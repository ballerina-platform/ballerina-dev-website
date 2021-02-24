---
layout: ballerina-left-nav-pages-swanlake
title: HTTP Services
description: The topics below cover details on the HTTP services support in Ballerina. They explore the basics of creating an HTTP service and how Ballerina provides a convenient abstraction for defining complex operations.  
keywords: ballerina, cli, command line interface, programming language
permalink: /learn/network-communication/http/http-services/
active: http-services
intro: The topics below cover details on the HTTP services support in Ballerina. They explore the basics of creating an HTTP service and how Ballerina provides a convenient abstraction for defining complex operations. 
redirect_from:
  - /learn/network-communication/http/http-services
  - /swan-lake/learn/network-communication/http/http-services/
  - /swan-lake/learn/network-communication/http/http-services
---

## Structuring an HTTP Service

A Ballerina service’s structure and its semantics are defined by the service type (i.e., the type of the listener attached to it). A basic HTTP service is structured in Ballerina as shown below. 

<img src="/learn/images/http-resource-anatomy.png" alt="HTTP Resource Anatomy" width="800" height="400">

The elements of the service are as follows.

- **Service name:** the service name represents the base path of the HTTP service. This is an optional value. If it’s kept empty, the base path defaults to the value “/”. 

- **Listener object:** provides an instance of the [`http:Listener`]((learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/listeners/Listener)) to bind to a specific host/port. 

- **Resource:** a resource represents a specific subpath that can be accessed in relation to the service base path.

  - **Accessor:** this is the HTTP method used to access the resource. This can be any HTTP method (e.g., `get`, `put`, `post`, `delete`). Only a single accessor can be associated with a single resource. If you need to support multiple HTTP methods to a single resource, you can define distinct service resources with the same name and different accessors. The `default` special accessor  can be used to dispatch all the requests with the resource path regardless of the HTTP method.

  - **Name:** the name represents the path of the resource in relation to the service base path. You can provide hierarchical values as well (e.g., `foo/bar`). In this case, the final path to this resource would be `/base/foo/bar`.  

  The `.` special name is used to represent the service itself in a resource. Thus, requests that are directly sent to the base path will be dispatched to this resource. 

  **Return type:** this is an optional return type, which can be of type [`anydata`](/learn/by-example/anydata-type.html) or [`http:Response`]((/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Response)). An anydata return value would be returned with an HTTP status code 200 OK.

The full source code for the `hello` service above is shown below. 

```ballerina
import ballerina/http;
 
service / on new http:Listener(8080) {
 
   resource function get greeting() returns string {
       return "Hello!";
   }
 
}
```

The execution of the service and its invocation is shown below. 

```bash
$ bal run demo.bal
Compiling source
    	demo.bal

Running executable

[ballerina/http] started HTTP/WS listener 0.0.0.0:8080

$ curl http://localhost:8080/greeting
Hello!
```

## Creating Hierarchical Resources

Hierarchical resources in HTTP services are defined by providing the hierarchical path of the resource as the resource name. The path segments are separated using `/`. The example below shows how the `/base/foo/bar` path is represented in an HTTP service resource.

```ballerina
import ballerina/http;
 
service /base on new http:Listener(8080) {
 
   resource function get foo/bar() returns string {
       return "Hi!";
   }
 
}
```

The execution of the service and its invocation is shown below. 

```bash
$ bal run demo.bal

[ballerina/http] started HTTP/WS listener 0.0.0.0:8080

$ curl http://localhost:8080/base/foo/bar
Hi!
```

### Defining Resource Path Segments

Resource path segments can be defined with parameters similar to how we define function parameters. This is done with the `[<type> <name>]` syntax in the path segment. The parameter type must be one of these types: `int`, `string`, `float`, `boolean`, `decimal`. Path parameters for the HTTP resource can be defined using this functionality. An example is shown below. 

```ballerina
import ballerina/http;
 
service / on new http:Listener(8080) {
 
   resource function get person/[int id]() returns string {
       return string `Person with id ${id}`;
   }
 
}
```

The execution of the service and its invocation is shown below. 

```bash
$ bal run demo.bal
 
[ballerina/http] started HTTP/WS listener 0.0.0.0:8080
 
$ curl http://localhost:8080/person/1001
Person with id 1001
```

### Defining Resource Path Segment Parameters

There can be multiple resource path segment parameters and they can be mixed and located anywhere with general path segments. 

A resource path rest parameter can be used to represent zero or more path segments. An example of this is shown below.

```ballerina
import ballerina/http;
 
service / on new http:Listener(8080) {
 
   resource function get person/[int... ids]() returns string {
       return string `Persons with ids ${ids.toString()}`;
   }
 
}
```

The execution of the service and its invocation is shown below. 

```bash
$ bal run demo.bal
 
[ballerina/http] started HTTP/WS listener 0.0.0.0:8080
 
$ curl http://localhost:8080/person/1/2/3
Persons with ids [1,2,3]
```

This functionality can also be generally used in a situation in which you want to dispatch all requests coming to a certain base path and its subpaths. This can be accomplished by having a `[string… paths]` resource path rest parameter. An example of this scenario is shown below. 


```ballerina
import ballerina/http;
 
service / on new http:Listener(8080) {
 
   resource function get log/[string... paths]() returns string {
       return string `Path: ${paths.toString()}`;
   }
 
}
```

The execution of the service and its invocation is shown below.

```bash
$ bal run demo.bal
 
[ballerina/http] started HTTP/WS listener 0.0.0.0:8080

$ curl http://localhost:8080/log/hello
Path: ["hello"]

$ curl http://localhost:8080/log/hello/world
Path: ["hello","world"]

$ curl http://localhost:8080/log/1/2/3
Path: ["1","2","3"]
```

## Defining Query Parameters

In a resource function, the query parameters are represented using the resource function parameters. The parameter type must be one of the types: `int`, `string`, `float`, `boolean`, and `decimal`. The name of the parameter represents the query parameter name. An example of this functionality is shown below.

```ballerina
import ballerina/http;
 
service / on new http:Listener(8080) {
 
   resource function get search/[string keyword](int offset,
                                                 int size)
                                                 returns string {
       return string `Search: k=${keyword} o=${offset} s=${size}`;
   }
 
}
```

The execution of the service and its invocation is shown below.

```bash
$ bal run demo.bal
 
[ballerina/http] started HTTP/WS listener 0.0.0.0:8080

$ curl "http://localhost:8080/search/aliens?offset=20&size=10"
Search: k=aliens o=20 s=10
```

## Payload Data Binding

The HTTP service resource payloads can be directly data bound to the resource function parameters. To distinguish between query parameters and resource payload parameters, the parameters that represent the resource payload are annotated with [`@http:Payload`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/annotations#Payload). The supported parameter types are `string`, `json`, `xml`, `byte[]`, record types, and record array types. 

An example of payload data binding is shown below.

```ballerina
import ballerina/http;
 
service / on new http:Listener(8080) {
 
   resource function post upload/[string name](
                                  @http:Payload {} byte[] payload)
                                  returns string {
       return string `'${name}' uploaded with ${payload.length()} bytes`;
   }
 
}
```

The execution of the service and its invocation is shown below.

```bash
$ bal run demo.bal
 
[ballerina/http] started HTTP/WS listener 0.0.0.0:8080

$ curl -d "XXXXXX" http://localhost:8080/upload/file1
'file1' uploaded with 6 bytes
```

## Extended Request/Response Access

The service resources have the functionality of handling request and response data manually  without binding them to resource parameters or the return value. This is done by optionally taking in [`http:Caller`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/clients/Caller) and [`http:Request`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Request) typed parameters, which represent calling the remote client and the current request information respectively. 

The [`http:Caller`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/clients/Caller) contains functionality to interact with the remote client such as responding to the client using the [`respond`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/clients/Caller#respond) remote method. The [`http:Request`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Request) object contains operations to look up information regarding the current incoming HTTP request such as the request payload, [query](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Request#getQueryParams/[matrix](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Request#getMatrixParams) parameters, [cookies](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Request#getCookies), and [headers](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Request#getHeaders).

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

The execution of the service and its invocation is shown below.

```bash
$ bal run demo.bal
 
[ballerina/http] started HTTP/WS listener 0.0.0.0:8080

$ curl -d "Jack" http://localhost:8080/greeting
Hello, Jack!
```

Using this approach, you can also execute additional logic even after the response is sent back to the client. For example, in the case of a network issue when responding back to the client, you can do custom operations for failure-recovery or do extended logging operations. 

The [`respond`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/clients/Caller#respond) remote method also takes in an [`http:Response`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Response) object if you need finer control in the response such as setting the status code or overriding the default [content type](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Response#setContentType). The code snippet below shows how you can send an HTTP 202 (Accepted) status code from your response.

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

## Multipart Message Handling

As used in the HTTP [client API](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/clients/Client), similarly, multipart messages can be created in service resources by using the Multipurpose Internet Mail Extensions (MIME) standard. You can provide MIME entity values to create single or multi-part HTTP messages using the [`http:Response`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Response) object. 

A MIME entity in Ballerina is represented using the [`mime:Entity`](/learn/api-docs/ballerina/#/ballerina/mime/1.0.6/mime/classes/Entity) object. The example below shows how to set a text payload in the response using a MIME entity.

>**Info:** The code below explicitly creates the MIME entity and sets it in the HTTP response. The same operation happens if you use the [`setTextPayload`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Response#setTextPayload) method in the [`http:Response`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Response) object. These functions are effectively helper functions to set the MIME entities in the HTTP response for often-used content types. 

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

The execution of the service and its invocation is shown below.

```bash
$ bal run demo.bal
 
[ballerina/http] started HTTP/WS listener 0.0.0.0:8080

$ curl http://localhost:8080/greeting
Hello!
```

### Setting Other Data Types

The [`mime:Entity`](/learn/api-docs/ballerina/#/ballerina/mime/1.0.6/mime/classes/Entity) object contains functions for setting the body with other data types, such as [`binary`](/learn/api-docs/ballerina/#/ballerina/mime/1.0.6/mime/classes/Entity#setByteArray), [`XML`](/learn/api-docs/ballerina/#/ballerina/mime/1.0.6/mime/classes/Entity#setXml), and [`JSON`](/learn/api-docs/ballerina/#/ballerina/mime/1.0.6/mime/classes/Entity#setJson) as well.

A multipart message can be created by setting the body parts in the [`mime:Entity`](/learn/api-docs/ballerina/#/ballerina/mime/1.0.6/mime/classes/Entity) object using the [`setBodyParts`](/learn/api-docs/ballerina/#/ballerina/mime/1.0.6/mime/classes/Entity#setBodyParts) method. This method takes in an array of [`mime:Entity`](/learn/api-docs/ballerina/#/ballerina/mime/1.0.6/mime/classes/Entity) objects, and also optionally, the content type of the enclosing entity in which the default is set to [`multipart/form-data`](/learn/api-docs/ballerina/#/ballerina/mime/1.0.6/mime/constants#MULTIPART_FORM_DATA). If required, you can override this with other multipart values such as [`multipart/mixed`](/learn/api-docs/ballerina/#/ballerina/mime/1.0.6/mime/constants#MULTIPART_MIXED), [`multipart/alternative`](/learn/api-docs/ballerina/#/ballerina/mime/1.0.6/mime/constants#MULTIPART_ALTERNATIVE), and [`multipart/related`](/learn/api-docs/ballerina/#/ballerina/mime/1.0.6/mime/constants#MULTIPART_RELATED). 

The example below shows how a [`multipart/mixed`](/learn/api-docs/ballerina/#/ballerina/mime/1.0.6/mime/constants#MULTIPART_MIXED) message is created using plain text content and an image file as an attachment. 

>**Info:** In the below code, the [`setContentDisposition`](/learn/api-docs/ballerina/#/ballerina/mime/1.0.6/mime/classes/Entity#setContentDisposition) method in the [`mime:Entity`](/learn/api-docs/ballerina/#/ballerina/mime/1.0.6/mime/classes/Entity) object is used to set the content disposition of the entity. This provides information on how the recipient should handle the data. For example, if it should be displayed inline, treated as form data, or downloaded as an attachment. 

```ballerina
import ballerina/mime;
import ballerina/http;
import ballerina/io;
 
service / on new http:Listener(8080) {
 
   resource function get download(http:Caller caller) returns error? {
       mime:Entity mpEntity = new;
       mime:Entity textEntity = new;
       textEntity.setText("Hello!");
       mime:Entity imageEntity = new;
       imageEntity.setByteArray(<@untainted>check io:fileReadBytes(
                                "/home/laf/input.jpeg"), "image/jpg");
       mime:ContentDisposition contentDisp = new;
       contentDisp.disposition = "attachment";
       contentDisp.fileName = "input.jpeg";
       imageEntity.setContentDisposition(contentDisp);
       mpEntity.setBodyParts([textEntity, imageEntity],
                              mime:MULTIPART_MIXED);
       http:Response resp = new;
       resp.setEntity(mpEntity);
       check caller->respond(resp);
   }
 
}
```

The execution of the service and its invocation is shown below.

 
```bash
$ bal run demo.bal
 
[ballerina/http] started HTTP/WS listener 0.0.0.0:8080
 
$ curl http://localhost:8080/download --output data.mime
```

## Secure Communication

The HTTP listener can be configured to enable transport security to restrict to HTTPS clients for communication. This is done by providing an optional [`ListenerConfiguration`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/records/ListenerConfiguration) instance when creating the [`http:Listener`](learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/listeners/Listener) client and providing the secure socket configurations. The example below shows how an HTTPS service is configured. 

```ballerina
import ballerina/http;
import ballerina/os;
 
http:ListenerConfiguration listenerConf = {
   secureSocket: {
       keyStore: {
           path: os:getEnv("BAL_HOME") +
                 "/bre/security/ballerinaKeystore.p12",
           password: "ballerina"
       }
   }
};
 
service / on new http:Listener(8443, listenerConf) {
    resource function get greeting() returns string {
        return "Hello!";
    }
}
```

The execution of the service and its invocation is shown below.

```bash
$ export BAL_HOME=`bal home`

$ bal run demo.bal

[ballerina/http] started HTTP/WS listener 0.0.0.0:8080

$ curl -k https://localhost:8443/greeting
Hello!
```
