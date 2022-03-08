---
layout: ballerina-left-nav-pages-swanlake
title: Payload data binding
description: The HTTP service resource payloads can be directly data bound to the resource function parameters. 
keywords: ballerina, cli, command-line interface, programming language
permalink: /learn/user-guide/network-communication/http/http-services/payload-data-binding/
active: payload-data-binding
intro: The HTTP service resource payloads can be directly data bound to the resource function parameters.
redirect_from:
  - /learn/network-communication/http/http-services/payload-data-binding
  - /swan-lake/learn/network-communication/http/http-services/payload-data-binding/
  - /swan-lake/learn/network-communication/http/http-services/payload-data-binding
  - /learn/network-communication/http/http-services/payload-data-binding/
  - /learn/network-communication/http/http-services/payload-data-binding
  - /learn/user-guide/network-communication/http/http-services/payload-data-binding
redirect_to:
  - https://lib.ballerina.io/ballerina/http/latest/
---

## Using the annotation

To distinguish between query parameters and resource payload parameters, the parameters that represent the resource payload are annotated with [`@http:Payload`](https://docs.central.ballerina.io/ballerina/http/latest/annotations#Payload). The supported parameter types are `string`, `json`, `xml`, `byte[]`, record types, and record array types. 

## Example

An example of payload data binding is shown below.

```ballerina
import ballerina/http;
 
service / on new http:Listener(8080) {
 
   resource function post upload/[string name](
                                  @http:Payload byte[] payload)
                                  returns string {
       return string `'${name}' uploaded with ${payload.length()} bytes`;
   }
 
}
```

## Execution

The execution of the service and its invocation is shown below.

```bash
$ bal run demo.bal
 
[ballerina/http] started HTTP/WS listener 0.0.0.0:8080

$ curl -d "XXXXXX" http://localhost:8080/upload/file1
'file1' uploaded with 6 bytes
```

## What's next?

For other use cases of HTTP services, see the topics below.

- [Extended Request/Response Access](/learn/network-communication/http/http-services/extended-request-response-access/)
- [Multipart Message Handling](/learn/network-communication/http/http-services/multipart-message-handling/)
- [Secure Communication](/learn/network-communication/http/http-services/secure-communication/)

<style> #tree-expand-all, #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
