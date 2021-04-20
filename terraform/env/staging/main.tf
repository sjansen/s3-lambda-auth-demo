module "app" {
  source = "../../modules/app"
  tags   = local.tags

  cloudwatch-retention = 30
  dns-name             = var.dns-name
  dns-zone             = var.dns-zone

  providers = {
    archive       = archive
    aws           = aws
    aws.us-east-1 = aws.us-east-1
  }
}
