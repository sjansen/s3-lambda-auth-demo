terraform {
  required_providers {
    archive = {
      version = "~> 2.0"
    }
    aws = {
      version               = "~> 3.0"
      configuration_aliases = [aws.us-east-1]
    }
  }
}
