---
lang: shell
---
```
$ curl -X POST localhost:8081/support/return-requests -H 'content-type: text/plain' \
    -d 'The mug from order ORD-1003 arrived cracked. Can I get a replacement?'
HTTP/1.1 201 Created
{"orderId":"ORD-1003", "category":"DAMAGED",
 "summary":"Ceramic mug arrived cracked; customer wants a replacement.", "status":"OPEN"}

# The model answered with category "OTHER", which is not in the expected type
$ curl -X POST localhost:8081/support/return-requests -H 'content-type: text/plain' -d 'asdf asdf'
HTTP/1.1 502 Bad Gateway
Could not interpret the request

level=ERROR message="Could not interpret the return request"
  error="Invalid value returned from the LLM Client, expected:
         'typedesc return_triage:ReturnRequest', found 'error(...ConversionError...)'"

# Captured on Ballerina 2201.14.0 with ballerinax/ai.openai 1.4.1 against a local
# OpenAI-compatible mock and a mock order API. Real model output will vary.
```
