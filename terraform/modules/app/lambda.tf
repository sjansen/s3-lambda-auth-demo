data "archive_file" "edge" {
  type        = "zip"
  output_path = "${path.module}/cloudfront.zip"
  source_dir  = "${path.module}/../../../dist/zip"
}

resource "aws_lambda_function" "edge" {
  provider = aws.us-east-1
  tags     = var.tags

  filename         = data.archive_file.edge.output_path
  source_code_hash = data.archive_file.edge.output_base64sha256

  function_name = local.edge_function_name
  handler       = "cloudfront.lambda_handler"
  memory_size   = 128
  publish       = true
  role          = aws_iam_role.edge.arn
  runtime       = "python3.8"
  timeout       = 3
}
