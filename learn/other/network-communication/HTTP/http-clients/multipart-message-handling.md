---
layout: ballerina-left-nav-pages-swanlake
title: Multipart message handling
description: HTTP multipart messages can be created by using the Multipurpose Internet Mail Extensions (MIME) standard. 
keywords: ballerina, cli, command-line interface, programming language
permalink: /learn/user-guide/network-communication/http/http-clients/multipart-message-handling/
active: multipart-message-handling
intro: HTTP multipart messages can be created by using the Multipurpose Internet Mail Extensions (MIME) standard.  
redirect_from:
  - /learn/network-communication/http/http-clients/multipart-message-handling
  - /swan-lake/learn/network-communication/http/http-clients/multipart-message-handling/
  - /swan-lake/learn/network-communication/http/http-clients/multipart-message-handling
  - /learn/network-communication/http/http-clients/multipart-message-handling/
  - /learn/network-communication/http/http-clients/multipart-message-handling
  - /learn/user-guide/network-communication/http/http-clients/multipart-message-handling
  - /learn/network-communication/http/multipart-message-handling/
  - /learn/network-communication/http/multipart-message-handling
redirect_to:
  - https://lib.ballerina.io/ballerina/http/latest/
---

You can provide MIME entity values to create single or multi-part HTTP messages using the [`http:Request`](https://docs.central.ballerina.io/ballerina/http/latest/classes/Request) object.

A MIME entity in Ballerina is represented using the [`mime:Entity`](https://docs.central.ballerina.io/ballerina/mime/latest/classes/Entity) object.

## Setting a text payload

The `multipart_example_one.bal` example below illustrates how to can use a MIME entity in setting a text payload in an HTTP request. 

**multipart_example_one.bal**
```ballerina
import ballerina/http;
import ballerina/mime;
import ballerina/io;
 
public function main() returns @tainted error? {
   http:Client clientEp = check new("http://httpbin.org");
   http:Request req = new;
   mime:Entity entity = new;
   entity.setText("Hello!", "text/plain");
   req.setEntity(entity);
   http:Response resp = check clientEp->post("/post", req);
   io:println(resp.getTextPayload());
} 
```

Execute the `bal run multipart_example_one.bal` command and the output will be as follows.

```bash
{
  "args": {},
  "data": "Hello!",
  "files": {},
  "form": {},
  "headers": {
	"Content-Length": "6",
	"Content-Type": "text/plain",
	"Host": "httpbin.org",
	"User-Agent": "ballerina",
	"X-Amzn-Trace-Id": "Root=1-5fd1da83-22ce662a2b5e80ac0f9cb5f0"
  },
  "json": null,
  "origin": "45.30.94.9",
  "url": "http://httpbin.org/post"
}
```

The code above explicitly creates the MIME entity and sets it in the HTTP request. The same operation happens if you use the [`setTextPayload`](https://docs.central.ballerina.io/ballerina/http/latest/classes/Request#setTextPayload) method in the [`http:Request`](https://docs.central.ballerina.io/ballerina/http/latest/classes/Request) object. These functions are effectively helper functions to set the MIME entities in the HTTP request for often-used content types. 

## Setting the body with other data types

The [`mime:Entity`](https://docs.central.ballerina.io/ballerina/mime/latest/classes/Entity) object contains functions for setting the body with other data types such as [binary](https://docs.central.ballerina.io/ballerina/http/latest/classes/Request#setTextPayload), [XML](https://docs.central.ballerina.io/ballerina/http/latest/classes/Request#setXmlPayload), and [JSON](https://docs.central.ballerina.io/ballerina/http/latest/classes/Request#setJsonPayload) as well.

A multipart message can be created by setting the body parts in the [`mime:Entity`](https://docs.central.ballerina.io/ballerina/mime/latest/classes/Entity) object using the [`setBodyParts`](https://docs.central.ballerina.io/ballerina/http/latest/classes/Request#setBodyParts) method. 

This method takes in an array of [`mime:Entity`](https://docs.central.ballerina.io/ballerina/mime/latest/classes/Entity) objects, and also optionally, the content type of the enclosing entity, in which, the default is set to [`multipart/form-data`](https://docs.central.ballerina.io/ballerina/mime/latest/constants#MULTIPART_FORM_DATA). 


## Using other multipart values

If required, you can override the default `multipart/form-data` with other multipart values such as [`multipart/mixed`](https://docs.central.ballerina.io/ballerina/mime/latest/constants#MULTIPART_MIXED), [`multipart/alternative`](https://docs.central.ballerina.io/ballerina/mime/latest/constants#MULTIPART_ALTERNATIVE), and [`multipart/related`](https://docs.central.ballerina.io/ballerina/mime/latest/constants#MULTIPART_RELATED). 

The `multipart_example_two.bal` below shows how a `multipart/mixed` message is created using plain text content and an image file as an attachment. 

**multipart_example_two.bal**
```ballerina
import ballerina/http;
import ballerina/mime;
import ballerina/io;
 
public function main() returns @tainted error? {
  http:Client clientEp = check new("http://httpbin.org");
  http:Request req = new;
  mime:Entity mpEntity = new;
  mime:Entity textEntity = new;
  textEntity.setText("Hello!");
  mime:Entity imageEntity = new;
  imageEntity.setByteArray(<@untainted> check io:fileReadBytes(
                           "/home/laf/input.jpeg"), "image/jpg");
  mime:ContentDisposition contentDisp = new;
  contentDisp.disposition = "attachment";
  contentDisp.fileName = "input.jpeg";
  imageEntity.setContentDisposition(contentDisp);
  mpEntity.setBodyParts([textEntity, imageEntity], mime:MULTIPART_MIXED);
  req.setEntity(mpEntity);
  http:Response resp = check clientEp->post("/post", req);
  io:println(resp.getTextPayload());
}
```
In the above code, the [`setContentDisposition`](https://docs.central.ballerina.io/ballerina/mime/latest/classes/Entity#setContentDisposition) method in the [`mime:Entity'](https://docs.central.ballerina.io/ballerina/mime/latest/classes/Entity) object is used to set the content disposition of the entity. This provides information on how the recipient should handle the data. For example, if it should be displayed inline, treated as form data, or downloaded as an attachment.

## Processing HTTP response entities

Similar to how you work with MIME entities in HTTP requests, the HTTP response entities can also be processed using the [`getEntity`](https://docs.central.ballerina.io/ballerina/http/latest/classes/Response#getEntity) method in the [`http:Response`](https://docs.central.ballerina.io/ballerina/http/latest/classes/Response) object.

The `multipart_example_three.bal` below is an example of its usage.

**multipart_example_three.bal**
```ballerina
import ballerina/http;
import ballerina/mime;
import ballerina/io;
 
public function main() returns @tainted error? {
   http:Client clientEp = check new("http://httpbin.org");
   http:Response resp = check clientEp->get("/image/jpeg");
   mime:Entity entity = check resp.getEntity();
   io:println("Content Type: ", entity.getContentType());
   io:println("Content Length: ", entity.getContentLength());
}
```

Execute the `bal run multipart_example_three.bal` command and the output will be as follows.

```bash
Content Type: image/jpeg
Content Length: 35588
```

## What's next?

For other use cases of HTTP clients, see the topics below.
- [Data Binding](/learn/network-communication/http/data-binding)
- [Data Streaming](/learn/network-communication/http/data-streaming)
- [Communication Resiliency](/learn/network-communication/http/communication-resiliency)
- [Secure Communication](/learn/network-communication/http/secure-communication)

<style> #tree-expand-all, #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
