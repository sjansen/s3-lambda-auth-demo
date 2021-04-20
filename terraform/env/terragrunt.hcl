locals {
  archive_version    = "~> 2.1"
  aws_version        = "~> 3.37"
  terragrunt_version = "~> 0.28.24"

  env  = path_relative_to_include()
  proj = "s3-lambda-auth-demo"
  region = {
    production = "us-east-2"
    staging    = "us-west-2"
  }[local.env]

  rsc_config = find_in_parent_folders("terragrunt-local.json", "")
  rsc_prefix = local.rsc_config == "" ? local.proj : jsondecode(file(local.rsc_config)).rsc_prefix
}

generate "locals-provider" {
  path      = "locals-generated.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
locals {
  env  = "${local.env}"
  proj = "${local.proj}"
}
EOF
}

generate "providers" {
  path      = "providers-generated.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
provider "archive" {}

provider "aws" {
  region  = "${local.region}"
}

provider "aws" {
  alias   = "us-east-1"
  region  = "us-east-1"
}

terraform {
  required_providers {
    archive = {
      source  = "hashicorp/archive"
      version = "${local.archive_version}"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "${local.aws_version}"
    }
  }
}
EOF
}

remote_state {
  backend = "s3"
  config = {
    region         = local.region
    dynamodb_table = "terraform"
    bucket         = "${local.rsc_prefix}-terraform-${local.region}"
    key            = "${local.proj}/${local.env}.tfstate"
    encrypt        = true
  }
}

terragrunt_version_constraint = local.terragrunt_version
