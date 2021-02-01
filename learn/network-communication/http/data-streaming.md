---
layout: ballerina-left-nav-pages-swanlake
title: Data Streaming
description: HTTP data streaming can be attained using chunked transfer encoding.
keywords: ballerina, cli, command line interface, programming language
permalink: /swan-lake/learn/network-communication/http/data-streaming/
active: data-streaming
intro: HTTP data streaming can be attained using chunked transfer encoding.  
redirect_from:
  - /swan-lake/learn/network-communication/http/data-streaming
---

## Data Streaming Modes

In Ballerina, the clients automatically switch between the chunked or non-chunked modes based on the size of the content provided as the payload. This is controlled by the [`http:ClientConfiguration`](/swan-lake/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/records/ClientConfiguration) object’s [`http1Settings.chunking`](/swan-lake/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/records/ClientHttp1Settings) property, which has a default value of [`AUTO`](/swan-lake/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/constants#CHUNKING_AUTO). The fully supported modes are as follows.

- [`AUTO:`](/swan-lake/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/constants#CHUNKING_AUTO): If the payload is less than 8KB, the client will not use chunking. It will load the full content to the memory, set the “Content-Length” header with the content size, and send out the request. Otherwise, it will use chunking to stream the data to the remote endpoint. 
- [`ALWAYS:`](/swan-lake/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/constants#CHUNKING_ALWAYS): The client will always use chunking to stream the payload to the remote endpoint. 
- [`NEVER:`](/swan-lake/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/constants#CHUNKING_NEVER): The client will never use chunking, and it will fully read in the payload to memory and send out the request. 

## Creating the Input Data Channel

To use the HTTP streaming feature effectively, you need to create an HTTP request with a streaming input data channel. For example, if you want to stream the content of a large file to a remote endpoint and read its content using a function such as [`io:fileReadBytes`](swan-lake/learn/api-docs/ballerina/#/ballerina/io/0.5.6/io/functions#fileReadBytes) to read in the full content as a byte array to memory, then you lose the benefit of streaming the data. 

Therefore, you should use a streaming data channel by using an API such as the [`io:openReadableFile`](/swan-lake/learn/api-docs/ballerina/#/ballerina/io/0.5.6/io/functions#openReadableFile), which returns a [`ReadableByteChannel`](/swan-lake/learn/api-docs/ballerina/#/ballerina/io/0.5.6/io/classes/ReadableByteChannel). This streaming data channel can be used in places that accept streaming channels such as the [`http:Request`](/swan-lake/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Request) object’s [`setByteStream`](/swan-lake/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/classes/Request#setByteStream). 

The `data_streaming.bal` example below opens a file with a streaming data channel and uses it to create an HTTP request to stream its data to a remote endpoint.

>**Info:** Since the code below uses the default HTTP client configurations, if the input file is larger than 8KB, it will automatically stream the content to the remote endpoint using chunked transfer encoding. 

**data_streaming.bal**

```ballerina

import ballerina/http;
import ballerina/io;
 
public function main() returns @tainted error? {
   http:Client clientEp = new("http://httpbin.org");
   http:Request req = new;
   req.setByteChannel(check io:openReadableFile("/home/laf/input.jpeg"));
   http:Response resp = <http:Response> check clientEp->post("/post",
                                               req);
   io:println(resp.getTextPayload());
}
```

## What's Next?

For other use cases of HTTP clients, see the topics below.
- [Multipart Message Handling](/swan-lake/learn/network-communication/http/multipart-message-handling)
- [Data Binding](/swan-lake/learn/network-communication/http/data-binding)
- [Communication Resiliency](/swan-lake/learn/network-communication/http/communication-resiliency)
- [Secure Communication](/swan-lake/learn/network-communication/http/secure-communication)

<style> #tree-expand-all, #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>