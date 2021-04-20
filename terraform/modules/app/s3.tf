resource "aws_s3_bucket" "logs" {
  bucket = "${local.bucket_prefix}-logs"
  acl    = "log-delivery-write"
  tags   = var.tags

  force_destroy = false
  lifecycle_rule {
    id                                     = "cleanup"
    enabled                                = true
    abort_incomplete_multipart_upload_days = 3
    expiration {
      days = 90
    }
    noncurrent_version_expiration {
      days = 30
    }
  }
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
  versioning {
    enabled = true
  }
}

resource "aws_s3_bucket" "media" {
  bucket = "${local.bucket_prefix}-media"
  tags   = var.tags

  force_destroy = false
  lifecycle_rule {
    id                                     = "cleanup"
    enabled                                = true
    abort_incomplete_multipart_upload_days = 3
    expiration {
      expired_object_delete_marker = true
    }
    noncurrent_version_expiration {
      days = 30
    }
  }
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
  versioning {
    enabled = true
  }
}

resource "aws_s3_bucket_object" "pages" {
  for_each = fileset("${path.module}/../../../site/", "**.html")

  bucket       = aws_s3_bucket.media.id
  content_type = "text/html"
  key          = each.key
  etag         = filemd5("${path.module}/../../../site/${each.key}")
  source       = "${path.module}/../../../site/${each.key}"
}

resource "aws_s3_bucket_policy" "media" {
  bucket = aws_s3_bucket.media.id
  policy = <<EOF
{
  "Version": "2008-10-17",
  "Statement": [{
    "Effect":"Allow",
    "Action": "s3:GetObject",
    "Principal": {
      "AWS": "${aws_cloudfront_origin_access_identity.cdn.iam_arn}"
    },
    "Resource": [
      "${aws_s3_bucket.media.arn}/*"
    ]
  }]
}
EOF
}
