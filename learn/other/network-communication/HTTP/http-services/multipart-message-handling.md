---
layout: ballerina-left-nav-pages-swanlake
title: Multipart Mmssage handling
description: You can carry out multipart message handling in Ballerina HTTP services. 
keywords: ballerina, cli, command-line interface, programming language
permalink: /learn/user-guide/network-communication/http/http-services/multipart-message-handling/
active: multipart-message-handling
intro: You can carry out multipart message handling in Ballerina HTTP services.
redirect_from:
  - /learn/network-communication/http/http-services/multipart-message-handling
  - /swan-lake/learn/network-communication/http/http-services/multipart-message-handling/
  - /swan-lake/learn/network-communication/http/http-services/multipart-message-handling
  - /learn/network-communication/http/http-services/multipart-message-handling/
  - /learn/network-communication/http/http-services/multipart-message-handling
  - /learn/user-guide/network-communication/http/http-services/multipart-message-handling
redirect_to:
  - https://lib.ballerina.io/ballerina/http/latest/
---

## Using MIME entities

As used in the HTTP [client API](https://docs.central.ballerina.io/ballerina/http/latest/clients/Client), similarly, multipart messages can be created in service resources by using the Multipurpose Internet Mail Extensions (MIME) standard. You can provide MIME entity values to create single or multi-part HTTP messages using the [`http:Response`](https://docs.central.ballerina.io/ballerina/http/latest/classes/Response) object. 

A MIME entity in Ballerina is represented using the [`mime:Entity`](https://docs.central.ballerina.io/ballerina/mime/latest/classes/Entity) object. 

## Example

The example below shows how to set a text payload in the response using a MIME entity.

>**Info:** The code below explicitly creates the MIME entity and sets it in the HTTP response. The same operation happens if you use the [`setTextPayload`](https://docs.central.ballerina.io/ballerina/http/latest/classes/Response#setTextPayload) method in the [`http:Response`](https://docs.central.ballerina.io/ballerina/http/latest/classes/Response) object. These functions are effectively helper functions to set the MIME entities in the HTTP response for often-used content types. 

```ballerina
import ballerina/mime;
import ballerina/http;
 
service / on new http:Listener(8080) {
 
   resource function get greeting(http:Caller caller) returns error? {
       mime:Entity entity = new;
       entity.setText("Hello!", "text/plain");
       http:Response resp = new;
       resp.setEntity(entity);
       check caller->respond(resp);
   }
 
}
```

## Execution

The execution of the service and its invocation is shown below.

```bash
$ bal run demo.bal
 
[ballerina/http] started HTTP/WS listener 0.0.0.0:8080

$ curl http://localhost:8080/greeting
Hello!
```

## What's next?

For other use cases of HTTP services, see the topics below.

- [Payload Data Binding](/learn/network-communication/http/http-services/payload-data-binding/)
- [Extended Request/Response Access](/learn/network-communication/http/http-services/extended-request-response-access/)
- [Secure Communication](/learn/network-communication/http/http-services/secure-communication/)

<style> #tree-expand-all, #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>


