import os.path
from urllib.parse import parse_qs, urlencode


FORBIDDEN = r"""
 <!DOCTYPE html>
 <html lang="en">
   <head>
     <meta charset="utf-8">
     <title>Access Denied</title>
   </head>
   <body>
     <h1>403</h1>
     <p>Forbidden</p>
   </body>
 </html>
 """


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

    if not uri.startswith("/secret"):
        return request

    if params.get("authenticated") == "true":
        return request

    response = {
        "status": "403",
        "statusDescription": "Forbidden",
        "headers": {
            "cache-control": [{"key": "Cache-Control", "value": "max-age=0"}],
            "content-type": [{"key": "Content-Type", "value": "text/html"}],
        },
        "body": FORBIDDEN,
    }
    return response
