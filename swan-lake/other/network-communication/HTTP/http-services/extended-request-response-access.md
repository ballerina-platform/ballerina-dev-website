---
layout: ballerina-left-nav-pages-swanlake
title: Extended request/response access
description: The service resources have the functionality of handling request and response data manually  without binding them to resource parameters or the return value.  
keywords: ballerina, cli, command-line interface, programming language
permalink: /learn/user-guide/network-communication/http/http-services/extended-request-response-access/
active: extended-request-response-access
intro: The service resources have the functionality of handling request and response data manually  without binding them to resource parameters or the return value. 
redirect_from:
  - /learn/network-communication/http/http-services/extended-request-response-access
  - /swan-lake/learn/network-communication/http/http-services/extended-request-response-access/
  - /swan-lake/learn/network-communication/http/http-services/extended-request-response-access
  - /learn/network-communication/http/http-services/extended-request-response-access/
  - /learn/network-communication/http/http-services/extended-request-response-access
  - /learn/user-guide/network-communication/http/http-services
redirect_to:
  - https://lib.ballerina.io/ballerina/http/latest/
---

## Interacting with the remote client

This is done by optionally taking in the [`http:Caller`](https://docs.central.ballerina.io/ballerina/http/latest/clients/Caller) and [`http:Request`](https://docs.central.ballerina.io/ballerina/http/latest/classes/Request) typed parameters, which represent calling the remote client and the current request information respectively. 

The [`http:Caller`](https://docs.central.ballerina.io/ballerina/http/latest/clients/Caller) contains functionality to interact with the remote client such as responding to the client using the [`respond`](https://docs.central.ballerina.io/ballerina/http/latest/clients/Caller#respond) remote method. The [`http:Request`](https://docs.central.ballerina.io/ballerina/http/latest/classes/Request) object contains operations to look up information regarding the current incoming HTTP request such as the request payload, [query](https://docs.central.ballerina.io/ballerina/http/latest/classes/Request#getQueryParams/[matrix](https://docs.central.ballerina.io/ballerina/http/latest/classes/Request#getMatrixParams) parameters, [cookies](https://docs.central.ballerina.io/ballerina/http/latest/classes/Request#getCookies), and [headers](https://docs.central.ballerina.io/ballerina/http/latest/classes/Request#getHeaders).

## Example

The example below demonstrates this functionality in action. 

```ballerina
import ballerina/http;
 
service / on new http:Listener(8080) {
 
   resource function post greeting(http:Caller caller,
                                   http:Request request) returns error? {
       string name = check request.getTextPayload();
       check caller->respond(string `Hello, ${name}!`);
   }
 
}
```

## Execution

The execution of the service and its invocation is shown below.

```bash
$ bal run demo.bal
 
[ballerina/http] started HTTP/WS listener 0.0.0.0:8080

$ curl -d "Jack" http://localhost:8080/greeting
Hello, Jack!
```

## Executing additional logic

Using this approach, you can also execute additional logic even after the response is sent back to the client. For example, in the case of a network issue when responding back to the client, you can do custom operations for failure-recovery or do extended logging operations. 

The [`respond`](https://docs.central.ballerina.io/ballerina/http/latest/clients/Caller#respond) remote method also takes in an [`http:Response`](https://docs.central.ballerina.io/ballerina/http/latest/classes/Response) object if you need finer control in the response such as setting the status code or overriding the default [content type](https://docs.central.ballerina.io/ballerina/http/latest/classes/Response#setContentType). 

### Example

The example below shows how you can send an HTTP 202 (Accepted) status code from your response.

```ballerina
import ballerina/http;
 
service / on new http:Listener(8080) {
 
   resource function post greeting(http:Caller caller,
                                  http:Request request) returns error? {
       string name = check request.getTextPayload();
       http:Response resp = new;
       resp.setTextPayload(string `Hello, ${name}!`);
       resp.statusCode = 202;
       check caller->respond(resp);
   }
 
}
```

### Execution

The execution of the service and its invocation is shown below.

```bash
$ bal run demo.bal
 
[ballerina/http] started HTTP/WS listener 0.0.0.0:8080

$ curl -v -d "Jack" http://localhost:8080/greeting
*   Trying 127.0.0.1:8080...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 8080 (#0)
> POST /greeting HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.68.0
> Accept: */*
> Content-Length: 4
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 4 out of 4 bytes
< HTTP/1.1 202 Accepted
< content-type: text/plain
< content-length: 12
< server: ballerina
< date: Wed, 27 Jan 2021 06:41:37 -0800
<
* Connection #0 to host localhost left intact
Hello, Jack!
```

## What's next?

For other use cases of HTTP services, see the topics below.

- [Payload Data Binding](/learn/network-communication/http/http-services/payload-data-binding/)
- [Multipart Message Handling](/learn/network-communication/http/http-services/multipart-message-handling/)
- [Secure Communication](/learn/network-communication/http/http-services/secure-communication/)
