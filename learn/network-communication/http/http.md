---
layout: ballerina-left-nav-pages-swanlake
title: HTTP
description: The topics below explain how to process HTTP requests and responses using Ballerina. It provides in-depth details on how HTTP clients are created and how their functionality can be used effectively. 
keywords: ballerina, cli, command line interface, programming language
permalink: /learn/network-communication/http/
active: http
intro: The topics below explain how to process HTTP requests and responses using Ballerina. It provides in-depth details on how HTTP clients are created and how their functionality can be used effectively.  
redirect_from:
  - /learn/network-communication/http
---

## Creating HTTP Clients

An HTTP client in Ballerina is created by instantiating an `http:Client` object while providing the host and client configurations. The client configuration has a default value of `{}`, and the default values of its fields can be found in the `http:ClientConfiguration` record definition.

```ballerina
http:Client clientEp = new("http://example.com");
```

The `clientEp` instance above represents a client created for the `example.com` host through the HTTP protocol. In the default configuration, a connection pooling configuration is attached, which means a single-client object is backed by a pool of network connections to the host.

```ballerina
http:Client clientEp = new("http://example.com", {
                           poolConfig: {
                               maxActiveConnections: 100, // default -1
                               maxIdleConnections: 10,    // default 100
                               waitTimeInMillis: 10000    // default 30000
                           }
                       });
```

The code above creates a client by providing an explicit client configuration, which provides the connection-pooling configuration.

## Basic HTTP Requests

After creating an HTTP client object, you can now execute HTTP requests through the [remote methods](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/clients/Client). 

The below are some of the remote methods that are most often used in the HTTP client object. 

### GET

An HTTP GET request is executed by using the [`get`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/clients/Client#get) remote method in the HTTP client. This remote method takes in the request path as the first parameter, and the target type as the second parameter for data-binding operations. The default value of the target type is [`http:Response`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Response). The remote method returns a union type consisting of [`http:Response`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Response), [`http:PayloadType`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/types#PayloadType), and `error`. 

The `client_demo_get.bal` below is an example of its usage.

**client_demo_get.bal**
```ballerina
import ballerina/io;
import ballerina/http;
 
public function main() returns @tainted error? {
   http:Client clientEp = new("http://httpbin.org");
   http:Response resp = <http:Response> check clientEp->get("/get");
   io:println("Content Type: ", resp.getContentType());
   io:println("Payload: ", resp.getJsonPayload());
   io:println("Status Code: ", resp.statusCode);
   io:println("Header [date]: ", resp.getHeader("date"));
}
```

Execute the `bal run client_demo_get.bal` command and the output will be as follows.

```bash
Content Type: application/json
Payload: {"args":{},"headers":{"Host":"httpbin.org","User-Agent":"ballerina","X-Amzn-Trace-Id":"Root=1-5fd3b719-0d5a1625098ad73b53c0c094"},"origin":"45.30.94.9","url":"http://httpbin.org/get"}
Status Code: 200
Header [date]: Fri, 11 Dec 2020 18:14:49 GMT
```

The [`http:Response`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Response) object can be used to access information such as the client response payload, [content type](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Response#getContentType), [headers](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Response#getHeader), and [cookies](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Response#getCookies).

### POST

An HTTP POST is executed using the [`post`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/clients/Client#post) remote method in the HTTP client. You can provide the request path as the first parameter. The second parameter is a value of the [`http:RequestMessage`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/types#RequestMessage), which is a union type of the [`http:Request`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Request) and other data-binding types such as XML, JSON, and other custom record types. The third parameter is the target type for providing the response data-binding type, similar to the result of the HTTP GET functionality. The default value of the target type is [`http:Response`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Response). 

The `client_demo_post.bal` below is an example of its usage.

**client_demo_post.bal**
```ballerina
import ballerina/io;
import ballerina/http;
 
public function main() returns @tainted error? {
   http:Client clientEp = new ("http://httpbin.org");
   http:Request req = new;
   req.setTextPayload("Hello!");
   req.setHeader("x-user", "Jack");
   http:Response resp = <http:Response> check clientEp->post("/post",
                                              req);
   io:println("Payload: ", resp.getJsonPayload());
}
```

Execute the `bal run client_demo_get.bal` command and the output will be as follows.

```bash
Payload: {"args":{},"data":"Hello!","files":{},"form":{},"headers":{"Content-Length":"6","Content-Type":"text/plain","Host":"httpbin.org","User-Agent":"ballerina","X-Amzn-Trace-Id":"Root=1-5fd3b957-4110242263315d0a3fa66dcc","X-User":"Jack"},"json":null,"origin":"45.30.94.9","url":"http://httpbin.org/post"}
```

### EXECUTE

Similar to the [`get`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/clients/Client#get) and [`post`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/clients/Client#post) remote methods above, there are other methods such as [`put`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/clients/Client#put), [`delete`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/clients/Client#delete), [`patch`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/clients/Client#patch), [`head`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/clients/Client#head), and [`options`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/clients/Client#options) to represent the HTTP methods. There is also a generic [`execute`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/clients/Client#execute) remote method for users to specify the HTTP verb and execute the HTTP action. 

## Multipart Message Handling

For information on this, see [Multipart Message Handling](/learn/network-communication/http/multipart-message-handling).

## Data Binding

For information on this, see [Data Binding](/learn/network-communication/http/data-binding).

## Data Streaming

For information on this, see [Data Streaming](/learn/network-communication/http/data-streaming).

## Communication Resiliency

For information on this, see [Communication Resiliency](/learn/network-communication/http/communication-resiliency).

## Secure Communication

For information on this, see [Secure Communication](/learn/network-communication/http/secure-communication).
