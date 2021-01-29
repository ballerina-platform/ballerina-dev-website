---
layout: ballerina-left-nav-pages-swanlake
title: Performing gRPC Streaming
description: The topics below demonstrates an example implementation of a gRPC client and bi-directional streaming using Ballerina.
keywords: ballerina, cli, command line interface, programming language
permalink: /swan-lake/learn/network-communication/grpc/performing-grpc-streaming/
active: performing-grpc-streaming
intro: The topics below demonstrates an example implementation of a gRPC client and bi-directional streaming using Ballerina.
redirect_from:
  - /swan-lake/learn/network-communication/grpc/performing-grpc-streaming
---



>**Info:** gRPC supports both client and bi-directional streaming. In client streaming, the client writes a sequence of messages and sends them to the server via a stream. Once the client has finished writing the messages, it waits for the server to read them and return a response. In bi-directional streaming, the client and server each sends a sequence of messages using read-write streams that operate independently allowing them to read and write in any order.


## Implementing a gRPC Serivce


## What's Next?

<style> #tree-expand-all, #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>