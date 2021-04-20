variable "cloudwatch-retention" {
  type = number
}

variable "dns-name" {
  type = string
}

variable "dns-zone" {
  type = string
}

variable "tags" {
  type = map(string)
}
