data "aws_iam_policy_document" "edgelambda" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type = "Service"
      identifiers = [
        "lambda.amazonaws.com",
        "edgelambda.amazonaws.com"
      ]
    }
  }
}

resource "aws_iam_role" "edge" {
  name = local.edge_function_name
  tags = var.tags

  assume_role_policy = data.aws_iam_policy_document.edgelambda.json
}

resource "aws_iam_role_policy_attachment" "edge" {
  role       = aws_iam_role.edge.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
