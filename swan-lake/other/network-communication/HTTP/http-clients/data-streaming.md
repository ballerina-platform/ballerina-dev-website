---
layout: ballerina-left-nav-pages-swanlake
title: Data streaming
description: HTTP data streaming can be attained using chunked transfer encoding.
keywords: ballerina, cli, command-line interface, programming language
permalink: /learn/user-guide/network-communication/http/http-clients/data-streaming/
active: data-streaming
intro: HTTP data streaming can be attained using chunked transfer encoding.  
redirect_from:
  - /learn/network-communication/http/http-clients/data-streaming
  - /swan-lake/learn/network-communication/http/http-clients/data-streaming/
  - /swan-lake/learn/network-communication/http/http-clients/data-streaming
  - /learn/network-communication/http/http-clients/data-streaming/
  - /learn/network-communication/http/http-clients/data-streaming
  - /learn/user-guide/network-communication/http/http-clients/data-streaming
  - /learn/network-communication/http/data-streaming/
  - /learn/network-communication/http/data-streaming
redirect_to:
  - https://lib.ballerina.io/ballerina/http/latest/
---

## Data streaming modes

In Ballerina, the clients automatically switch between the chunked or non-chunked modes based on the size of the content provided as the payload. This is controlled by the [`http:ClientConfiguration`](https://docs.central.ballerina.io/ballerina/http/latest/clients/Client) object’s [`http1Settings.chunking`](https://docs.central.ballerina.io/ballerina/http/latest/records/ClientHttp1Settings) property, which has a default value of [`AUTO`](https://docs.central.ballerina.io/ballerina/http/latest/constants#CHUNKING_AUTO). The fully supported modes are as follows.

- [`AUTO:`](https://docs.central.ballerina.io/ballerina/http/latest/constants#CHUNKING_AUTO): If the payload is less than 8KB, the client will not use chunking. It will load the full content to the memory, set the “Content-Length” header with the content size, and send out the request. Otherwise, it will use chunking to stream the data to the remote endpoint. 
- [`ALWAYS:`](https://docs.central.ballerina.io/ballerina/http/latest/constants#CHUNKING_ALWAYS): The client will always use chunking to stream the payload to the remote endpoint. 
- [`NEVER:`](https://docs.central.ballerina.io/ballerina/http/latest/constants#CHUNKING_NEVER): The client will never use chunking, and it will fully read in the payload to memory and send out the request. 

## Creating the input data stream

To use the HTTP streaming feature effectively, you need to create an HTTP request with a stream of byte[]. For example, if you want to stream the content of a large file to a remote endpoint and read its content using a function such as [`io:fileReadBytes`](https://docs.central.ballerina.io/ballerina/io/latest/functions#fileReadBytes) to read in the full content as a byte array to memory, then you lose the benefit of streaming the data. 

Therefore, you should use a stream of byte[] by using an API such as the [`io:fileReadBlocksAsStream`](https://docs.central.ballerina.io/ballerina/io/latest/functions#fileReadBlocksAsStream), which returns a `stream<byte[], io:Error>`. This stream can be used in places that accept a stream of byte[] such as the [`http:Request`](https://docs.central.ballerina.io/ballerina/http/latest/classes/Request) object’s [`setByteStream`](https://docs.central.ballerina.io/ballerina/http/latest/classes/Request#setByteStream). 

The `data_streaming.bal` example below opens a file with a stream and uses it to create an HTTP request to stream its data to a remote endpoint.

>**Info:** Since the code below uses the default HTTP client configurations, if the input file is larger than 8KB, it will automatically stream the content to the remote endpoint using chunked transfer encoding. 

**data_streaming.bal**

```ballerina
import ballerina/http;
import ballerina/io;
 
public function main() returns @tainted error? {
   http:Client clientEp = check new("http://httpbin.org");
   http:Request req = new;
   req.setByteStream(check io:fileReadBlocksAsStream("/home/laf/input.jpeg"));
   http:Response resp = check clientEp->post("/post", req);
   io:println(resp.getTextPayload());
}
```

## What's next?

For other use cases of HTTP clients, see the topics below.
- [Multipart Message Handling](/learn/network-communication/http/multipart-message-handling)
- [Data Binding](/learn/network-communication/http/data-binding)
- [Communication Resiliency](/learn/network-communication/http/communication-resiliency)
- [Secure Communication](/learn/network-communication/http/secure-communication)

<style> #tree-expand-all, #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
