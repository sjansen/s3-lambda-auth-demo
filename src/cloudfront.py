import os.path
from urllib.parse import parse_qs, urlencode


def lambda_handler(event, context):
    request = event["Records"][0]["cf"]["request"]
    headers = request["headers"]

    params = {k: v[0] for k, v in parse_qs(request["querystring"]).items()}
    sortedParams = sorted(params.items(), key=lambda x: x[0])
    request["querystring"] = urlencode(sortedParams)

    uri = request["uri"]
    if uri.endswith("/"):
        request["uri"] += "index.html"
    elif not os.path.splitext(uri)[1]:
        request["uri"] += "/index.html"

    if request["uri"] != "/secret.html":
        return request

    if params.get("authenticated") == "true":
        return request

    response = {
        "status": "403",
        "statusDescription": "Forbidden",
    }
    return response
