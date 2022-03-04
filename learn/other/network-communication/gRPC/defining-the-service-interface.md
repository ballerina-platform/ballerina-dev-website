---
layout: ballerina-left-nav-pages-swanlake
title: Defining the service interface 
description: gRPC is an open-source remote procedure call (RPC) technology, which uses HTTP/2 for transport and is based on Google’s Protocol Buffers. It promises high performance, efficient network communication, features such as schema evolution, blocking and non-blocking communication, and bidirectional streaming. The topics below explain how gRPC works and the tools and techniques that are required to implement it using Ballerina.
keywords: ballerina, cli, command-line interface, programming language
permalink: /learn/user-guide/network-communication/grpc/defining-the-service-interface/ 
active: defining-the-service-interface
intro: gRPC is an open-source remote procedure call (RPC) technology, which uses HTTP/2 for transport and is based on Google’s Protocol Buffers. It promises high performance, efficient network communication, features such as schema evolution, blocking and non-blocking communication, and bidirectional streaming. The topics below explain how gRPC works and the tools and techniques that are required to implement it using Ballerina. 
redirect_from:
  - /learn/network-communication/grpc
  - /swan-lake/learn/network-communication/grpc/
  - /swan-lake/learn/network-communication/grpc
  - /learn/network-communication/grpc/
  - /learn/network-communication/grpc
  - /learn/user-guide/network-communication/grpc
  - /learn/user-guide/network-communication/grpc/
  - /learn/user-guide/network-communication/grpc/defining-the-service-interface
redirect_to:
  - https://lib.ballerina.io/ballerina/grpc/latest/
---

In an RPC service, the first step is to define the interface of the service. This is done using an IDL (Interface Definition Language) file. The IDL file of a gRPC service is provided using Protocol Buffers. Protobuf is a standard for serializing structured data. It provides the structures required for defining services, operations, and messages used in the service communication. 

For example, the diagram below shows a sample RPC service, which contains the actions to do some computational operations, store them, and return a custom type. 

<img src="/learn/images/grpc-admin-service-new.png" alt="Admin RPC Service" width="450" height="400">

### Creating the Proto file

A proto file starts by mentioning the Protobuf syntax version. The latest version is `proto3`. This is mentioned as follows.

```proto
syntax = "proto3";
```

Start defining a message, which is a structure that contains some data fields. An example is shown below.

```proto
message Person {
  int64 id = 1;
  string name = 2;
  int32 birthYear = 3;
}
```

A `Person` entity is represented with the above Protobuf message definition. The fields are defined by stating the type first followed by the name of the field and then the field number. In this way, the first field `id` has a scalar type of `int64` and a field number `1`. 

The type can be a composite type as well (such as enumerations and other message types). A field number is a unique number that is used to identify the field in the encoded binary format. This makes sure that the messages will be backward compatible as long as the same field numbers are retained. This is how Protobuf manages to support schema evolution. 

A field can also be qualified as `singular` or `repeated`. This states that the message can have zero or one of these fields, or else, it can have zero or many of these fields respectively. The default is `singular`. An example of this is shown below. 

```proto
message AddRequest {
  repeated int64 numbers = 1;
}
 
message AddResponse {
  int64 result = 1;
}
```

The `AddRequest` message contains a structure for an additional operation, which has an array of numbers to be added together. The `AddResponse` message contains a `singular result` field of the type `int64`.

Commonly-used Protobuf types and the respective  Ballerina types that can be mapped to them are shown below. 

- `int32` - `int`
- `int64` - `int`
- `float` - `float`
- `double` - `float`
- `string` - `string`
- `bool` - `bool` 
- `bytes` - `byte[]`
- `stream` - `stream`

### Defining the service

A service is defined in Protobuf as follows. 

```proto
service AdminService {
  rpc Add(AddRequest) returns (AddResponse);
}
```

The snippet above defines the `AdminService` RPC service with a method `Add`, which takes in the `AddRequest` message and returns an `AddResponse` message. In this manner, multiple methods can be added to a single service. The following Protobuf definition contains the complete service definition for the service shown in the above diagram. 

```proto
syntax = "proto3";
 
message Person {
 string id = 1;
 string name = 2;
 int32 birthYear = 3;
}
 
message GetPersonRequest {
 string id = 1;
}
 
message AddPersonResponse {
 string id = 1;
}
 
message AddRequest {
 repeated int64 numbers = 1;
}
 
message AddResponse {
 int64 result = 1;
}
 
message MultiplyRequest {
 int64 v1 = 1;
 int64 v2 = 2;
}
 
message MultiplyResponse {
 int64 result = 1;
}
 
service AdminService {
 rpc add(AddRequest) returns (AddResponse);
 rpc multiply(MultiplyRequest) returns (MultiplyResponse);
 rpc addPerson(Person) returns (AddPersonResponse);
 rpc getPerson(GetPersonRequest) returns (Person);
}
```

The above is the full Protobuf definition for the service. 

## Implementing gRPC services and clients

For instructions on implementing the above service and writing a client to invoke it, see [Implementing gRPC Services and Clients](/learn/network-communication/grpc/implementing-grpc-services-and-clients/).


## Performing gRPC streaming

For instructions on this, see [Performing gRPC Streaming](/learn/network-communication/grpc/performing-grpc-streaming/).






