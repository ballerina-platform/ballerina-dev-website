---
layout: ballerina-left-nav-pages-swanlake
title: Multipart Message Handling
description: HTTP multipart messages can be created by using the Multipurpose Internet Mail Extensions (MIME) standard. 
keywords: ballerina, cli, command line interface, programming language
permalink: /swan-lake/learn/network-communication/http/multipart-message-handling/
active: multipart-message-handling
intro: HTTP multipart messages can be created by using the Multipurpose Internet Mail Extensions (MIME) standard.  
redirect_from:
  - /swan-lake/learn/network-communication/http/multipart-message-handling
---

You can provide MIME entity values to create single or multi-part HTTP messages using the [`http:Request`] object(/swan-lake/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Request).

A MIME entity in Ballerina is represented using the [`mime:Entity`](/swan-lake/learn/api-docs/ballerina/#/ballerina/mime/1.0.6/mime/classes/Entity) object. The example below illustrates how to can use a MIME entity in setting a text payload in an HTTP request. 

**client_demo_multipart.bal**
```ballerina
import ballerina/http;
import ballerina/mime;
import ballerina/io;
 
public function main() returns @tainted error? {
   http:Client clientEp = new("http://httpbin.org");
   http:Request req = new;
   mime:Entity entity = new;
   entity.setText("Hello!", "text/plain");
   req.setEntity(entity);
   http:Response resp = <http:Response> check clientEp->post(
                                              "/post", req);
   io:println(resp.getTextPayload());
} 
```

Execute the `bal run client_demo_multipart.bal` command and the output will be as follows.

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

The code above explicitly creates the MIME entity and sets it in the HTTP request. The same operation happens if you use the [`setTextPayload`](/swan-lake/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Request#setTextPayload) method in the [`http:Request`](/swan-lake/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Request) object. These functions are effectively helper functions to set the MIME entities in the HTTP request for often-used content types. 

The [`mime:Entity`](/swan-lake/learn/api-docs/ballerina/#/ballerina/mime/1.0.6/mime/classes/Entity) object contains functions for setting the body with other data types such as [binary](https://dev.ballerina.io/swan-lake/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Request#setTextPayload), [XML](/swan-lake/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Request#setXmlPayload), and [JSON](/swan-lake/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Request#setJsonPayload) as well.

A multipart message can be created by setting the body parts in the [`mime:Entity`](/swan-lake/learn/api-docs/ballerina/#/ballerina/mime/1.0.6/mime/classes/Entity) object using the [`setBodyParts'](/swan-lake/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Request#setBodyParts) method. 

This method takes in an array of [`mime:Entity`](/swan-lake/learn/api-docs/ballerina/#/ballerina/mime/1.0.6/mime/classes/Entity) objects, and also optionally, the content type of the enclosing entity, in which, the default is set to [`multipart/form-data`](/swan-lake/learn/api-docs/ballerina/#/ballerina/mime/1.0.6/mime/constants#MULTIPART_FORM_DATA). 

If required, you can override this with other multipart values such as [`multipart/mixed`](/swan-lake/learn/api-docs/ballerina/#/ballerina/mime/1.0.6/mime/constants#MULTIPART_MIXED), [`multipart/alternative`](/swan-lake/learn/api-docs/ballerina/#/ballerina/mime/1.0.6/mime/constants#MULTIPART_ALTERNATIVE), and [`multipart/related`](/swan-lake/learn/api-docs/ballerina/#/ballerina/mime/1.0.6/mime/constants#MULTIPART_RELATED). 

The example below shows how a `multipart/mixed` message is created using plain text content and an image file as an attachment. 

```ballerina
import ballerina/http;
import ballerina/mime;
import ballerina/io;
 
public function main() returns @tainted error? {
  http:Client clientEp = new("http://httpbin.org");
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
  http:Response resp = <http:Response> check clientEp->post(
                                             "/post", req);
  io:println(resp.getTextPayload());
}
```
In the above code, the [`setContentDisposition`]() method in the [`mime:Entity'] object is used to set the content disposition of the entity. This provides information on how the recipient should handle the data. For example, if it should be displayed inline, treated as form data, or downloaded as an attachment.  

## What's Next?

For other advanced use cases of HTTP clients, see the topics below.
- [Data Binding](/swan-lake/learn/network-communication/http/data-binding)
- [Data Streaming](/swan-lake/learn/network-communication/http/data-streaming)
- [Communication Resiliency](/swan-lake/learn/network-communication/http/communication-resiliency)
- [Secure Communication](/swan-lake/learn/network-communication/http/secure-communication)