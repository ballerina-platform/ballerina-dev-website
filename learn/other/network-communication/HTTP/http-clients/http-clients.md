---
layout: ballerina-left-nav-pages-swanlake
title: HTTP clients
description: The topics below explain how to process HTTP requests and responses using Ballerina. It provides in-depth details on how HTTP clients are created and how their functionality can be used effectively. 
keywords: ballerina, cli, command-line interface, programming language
permalink: /learn/user-guide/network-communication/http/http-clients/
active: http-clients
intro: The topics below explain how to process HTTP requests and responses using Ballerina. It provides in-depth details on how HTTP clients are created and how their functionality can be used effectively.  
redirect_from:
  - /learn/network-communication/http/http-clients
  - /swan-lake/learn/network-communication/http/http-clients/
  - /swan-lake/learn/network-communication/http/http-clients
  - /learn/network-communication/http/http-clients/
  - /learn/network-communication/http/http-clients
  - /learn/user-guide/network-communication/http/http-clients
redirect_to:
  - https://lib.ballerina.io/ballerina/http/latest/
---

## Creating HTTP clients

An HTTP client in Ballerina is created by instantiating an `http:Client` object while providing the host and client configurations. The client configuration has a default value of `{}`, and the default values of its fields can be found in the `http:ClientConfiguration` record definition.

>**Info:** The `error` is made union with the `http:Client` to get an error returned during its initialization.

```ballerina
http:Client|error clientEp = new("http://example.com");
```

The `clientEp` instance above represents a client created for the `example.com` host through the HTTP protocol. In the default configuration, a connection pooling configuration is attached, which means a single-client object is backed by a pool of network connections to the host.

```ballerina
http:Client|error clientEp = new("http://example.com", {
                           poolConfig: {
                               maxActiveConnections: 100, // default -1
                               maxIdleConnections: 10,    // default 100
                               waitTime: 10    // default 30
                           }
                       });
```

The code above creates a client by providing an explicit client configuration, which provides the connection-pooling configuration.

## Basic HTTP requests

After creating an HTTP client object, you can now execute HTTP requests through the [remote methods](https://docs.central.ballerina.io/ballerina/http/latest/clients/Client). 

Below are some of the remote methods that are most often used in the HTTP client object. 

### GET

An HTTP GET request is executed by using the [`get`](https://docs.central.ballerina.io/ballerina/http/latest/clients/Client#get) remote method in the HTTP client. This remote method takes in the request path as the first parameter, and optionally a header map as the second parameter.

The `client_demo_get.bal` below is an example of its usage.

**client_demo_get.bal**
```ballerina
import ballerina/io;
import ballerina/http;
 
public function main() returns @tainted error? {
   http:Client clientEp = check new("http://httpbin.org");
   json resp = check clientEp->get("/get");
   io:println("Payload: ", resp);
}
```

Execute the `bal run client_demo_get.bal` command and the output will be as follows.

```bash
Payload: {"args":{},"headers":{"Host":"httpbin.org","User-Agent":"ballerina","X-Amzn-Trace-Id":"Root=1-5fd3b719-0d5a1625098ad73b53c0c094"},"origin":"45.30.94.9","url":"http://httpbin.org/get"}
```

In case you want more information than the response payload, the [`http:Response`](https://docs.central.ballerina.io/ballerina/http/latest/classes/Response) object can be used to access information such as the client response payload, [content type](https://docs.central.ballerina.io/ballerina/http/latest/classes/Response#getContentType), [headers](https://docs.central.ballerina.io/ballerina/http/latest/classes/Response#getHeader), and [cookies](https://docs.central.ballerina.io/ballerina/http/latest/classes/Response#getCookies).

### POST

An HTTP POST is executed using the [`post`](https://docs.central.ballerina.io/ballerina/http/latest/clients/Client#post) remote method in the HTTP client. You can provide the request path as the first parameter. The second parameter is a value of the [`http:RequestMessage`](https://docs.central.ballerina.io/ballerina/http/latest/types#RequestMessage), which is a union type of the [`http:Request`](https://docs.central.ballerina.io/ballerina/http/latest/classes/Request) and other data-binding types such as XML, JSON, and other custom record types. Optionally as the third parameter you can send a header map.

The `client_demo_post.bal` below is an example of its usage.

**client_demo_post.bal**
```ballerina
import ballerina/io;
import ballerina/http;
 
public function main() returns @tainted error? {
   http:Client clientEp = check new ("http://httpbin.org");
   json resp = check clientEp->post("/post", "hello", {"x-user": "Jack"});
   io:println("Payload: ", resp);
}
```

Execute the `bal run client_demo_get.bal` command and the output will be as follows.

```bash
Payload: {"args":{},"data":"Hello!","files":{},"form":{},"headers":{"Content-Length":"6","Content-Type":"text/plain","Host":"httpbin.org","User-Agent":"ballerina","X-Amzn-Trace-Id":"Root=1-5fd3b957-4110242263315d0a3fa66dcc","X-User":"Jack"},"json":null,"origin":"45.30.94.9","url":"http://httpbin.org/post"}
```

### EXECUTE

Similar to the [`get`](https://docs.central.ballerina.io/ballerina/http/latest/clients/Client#get) and [`post`](https://docs.central.ballerina.io/ballerina/http/latest/clients/Client#post) remote methods above, there are other methods such as [`put`](https://docs.central.ballerina.io/ballerina/http/latest/clients/Client#put), [`delete`](https://docs.central.ballerina.io/ballerina/http/latest/clients/Client#delete), [`patch`](https://docs.central.ballerina.io/ballerina/http/latest/clients/Client#patch), [`head`](https://docs.central.ballerina.io/ballerina/http/latest/clients/Client#head), and [`options`](https://docs.central.ballerina.io/ballerina/http/latest/clients/Client#options) to represent the HTTP methods. There is also a generic [`execute`](https://docs.central.ballerina.io/ballerina/http/latest/clients/Client#execute) remote method for users to specify the HTTP verb and execute the HTTP action. 

## Multipart message handling

For information on this, see [Multipart Message Handling](/learn/network-communication/http/http-clients/multipart-message-handling).

## Data binding

For information on this, see [Data Binding](/learn/network-communication/http/http-clients/data-binding).

## Data streaming

For information on this, see [Data Streaming](/learn/network-communication/http/http-clients/data-streaming).

## Communication resiliency

For information on this, see [Communication Resiliency](/learn/network-communication/http/http-clients/communication-resiliency).

## Secure communication

For information on this, see [Secure Communication](/learn/network-communication/http/http-clients/secure-communication).
