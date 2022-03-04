---
layout: ballerina-left-nav-pages-swanlake
title: HTTP services
description: The topics below cover details on the HTTP services support in Ballerina. They explore the basics of creating an HTTP service and how Ballerina provides a convenient abstraction for defining complex operations.  
keywords: ballerina, cli, command-line interface, programming language
permalink: /learn/user-guide/network-communication/http/http-services/
active: http-services
intro: The topics below cover details on the HTTP services support in Ballerina. They explore the basics of creating an HTTP service and how Ballerina provides a convenient abstraction for defining complex operations. 
redirect_from:
  - /learn/network-communication/http/http-services
  - /swan-lake/learn/network-communication/http/http-services/
  - /swan-lake/learn/network-communication/http/http-services
  - /learn/network-communication/http/http-services/
  - /learn/network-communication/http/http-services
  - /learn/user-guide/network-communication/http/http-services
redirect_to:
  - https://lib.ballerina.io/ballerina/http/latest/
---

## Structuring an HTTP service

A Ballerina service’s structure and its semantics are defined by the service type (i.e., the type of the listener attached to it). A basic HTTP service is structured in Ballerina as shown below. 

<img src="/learn/images/http-resource-anatomy-new.png" alt="HTTP Resource Anatomy" width="800" height="450">

The elements of the service are as follows.

- **Service name:** the service name represents the base path of the HTTP service. This is an optional value. If it’s kept empty, the base path defaults to the value “/”. 

- **Listener object:** provides an instance of the [`http:Listener`](https://docs.central.ballerina.io/ballerina/http/latest/listeners/Listener) to bind to a specific host/port. 

- **Resource:** a resource represents a specific subpath that can be accessed in relation to the service base path.

  - **Accessor:** this is the HTTP method used to access the resource. This can be any HTTP method (e.g., `get`, `put`, `post`, `delete`). Only a single accessor can be associated with a single resource. If you need to support multiple HTTP methods to a single resource, you can define distinct service resources with the same name and different accessors. The `default` special accessor  can be used to dispatch all the requests with the resource path regardless of the HTTP method.

  - **Name:** the name represents the path of the resource in relation to the service base path. You can provide hierarchical values as well (e.g., `foo/bar`). In this case, the final path to this resource would be `/base/foo/bar`.  

  The `.` special name is used to represent the service itself in a resource. Thus, requests that are directly sent to the base path will be dispatched to this resource. 

  **Return type:** this is an optional return type, which can be of type [`anydata`](/learn/by-example/anydata-type.html) or [`http:Response`](/learn/api-docs/ballerina/#/ballerina/http/latest/classes/Response). An anydata return value would be returned with an HTTP status code 200 OK.

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

## Creating hierarchical resources

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

### Defining resource path segments

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

### Defining resource path segment parameters

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

## Defining query parameters

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

## Payload data binding

For information on this, see [Payload Data Binding](/learn/network-communication/http/http-services/payload-data-binding/).

## Extended request/response access

For information on this, see [Extended Request/Response Access](/learn/network-communication/http/http-services/extended-request-response-access/).

## Multipart message handling

For information on this, see [Multipart Message Handling](/learn/network-communication/http/http-services/multipart-message-handling/).

## Secure communication

For information on this, see [Secure Communication](/learn/network-communication/http/http-services/secure-communication/).
