---
layout: ballerina-left-nav-pages-swanlake
title: Performing gRPC streaming
description: The topics below demonstrates an example implementation of a gRPC client and bi-directional streaming using Ballerina.
keywords: ballerina, cli, command-line interface, programming language
permalink: /learn/user-guide/network-communication/grpc/performing-grpc-streaming/
active: performing-grpc-streaming
intro: The topics below demonstrates an example implementation of a gRPC client and bi-directional streaming using Ballerina.
redirect_from:
  - /learn/network-communication/grpc/performing-grpc-streaming
  - /swan-lake/learn/network-communication/grpc/performing-grpc-streaming/
  - /swan-lake/learn/network-communication/grpc/performing-grpc-streaming
  - /learn/network-communication/grpc/performing-grpc-streaming/
  - /learn/network-communication/grpc/performing-grpc-streaming
  - /learn/user-guide/network-communication/grpc/performing-grpc-streaming
redirect_to:
  - https://lib.ballerina.io/ballerina/grpc/latest/
---

>**Info:** gRPC supports both client and bi-directional streaming. In client streaming, the client writes a sequence of messages and sends them to the server via a stream. Once the client has finished writing the messages, it waits for the server to read them and return a response. In bi-directional streaming, the client and server each send a sequence of messages using read-write streams that operate independently allowing them to read and write in any order.

## Implementing bi-directional streaming

The diagram below depicts an example implementation of a gRPC client and bi-directional streaming using Ballerina. It shows the `streaming calc service`, which contains the `sum` and `incrementalSum` methods to represent the client and bi-directional streaming operations respectively. 

<img src="/learn/images/streaming-calc-service-new.png" alt="Streaming Calc RPC Service" width="500" height="450">

## Creating the Protobuf definition of the service

The Protobuf definition of the above service is shown below.

```proto
syntax = "proto3";
import "google/protobuf/wrappers.proto";
 
service StreamingCalcService {
   rpc sum(stream google.protobuf.Int64Value) returns (google.protobuf.Int64Value);
   rpc incrementalSum(stream google.protobuf.Int64Value) returns (stream google.protobuf.Int64Value);
}
```

The above definition introduces the stream qualifier for the method parameters and the return types. This signifies that the parameter/return value will be sent as a stream of individual values. 

The `sum` method takes in a stream of int64 values and returns a single int64 value. The `incrementalSum` method takes in and returns a stream of int64 values, which contain the individual results for each intermediate sum value in the calculation. 

## Implementing the service and client

Follow the steps below to create separate service and client packages, and generate the gRPC service and client code. 

1. Execute the `bal new service` command in a new base directory to create the service. You view the output below.

    ```bash
    Created new Ballerina package 'service' at service.
    ```

2. Execute the `bal new client` command to create the client. You view the output below.

    ```bash
    Created new Ballerina package 'client' at client.
    ```

3. Execute the `bal grpc --mode service --input streaming_calc.proto --output service/` to extract the library files of the service. You view the output below.

    ```bash
    Successfully extracted library files.
    Successfully generated ballerina file.
    ```

4. Execute the `bal grpc --mode client --input streaming_calc.proto --output client/` to extract the library files of the client. You view the output below.

    ```bash
    Successfully extracted library files.
    Successfully generated ballerina file.
    ```

5. Update the service skeleton with the code below to add the implementation. 

    ```ballerina
    import ballerina/grpc;
    
    listener grpc:Listener ep = new (9090);
    
    @grpc:ServiceDescriptor {
        descriptor: ROOT_DESCRIPTOR,
        descMap: getDescriptorMap()
    }
    service "StreamingCalcService" on ep {
        
        remote function sum(stream<int, grpc:Error?> clientStream) returns int|error {
           int sum = 0;
           error? e = clientStream.forEach(function (int value) {
               sum += value;
           });
           return sum;
        }
        remote function incrementalSum(StreamingCalcServiceIntCaller caller, stream<int, grpc:Error?> clientStream) returns error? {
           int sum = 0;
           error? e = clientStream.forEach(function (int value) {
               sum += value;
               checkpanic caller->sendInt(sum);
           });
           check caller->complete();
        }
    }
    ```

    >**Info:** In the code above, the gRPC stream type has been mapped to the stream type in Ballerina. Using the Ballerina stream type, you can iterate through all the values in the stream sent to the service by the client. The only difference between the `sum` and `incrementalSum` methods is the use of the caller object to stream out multiple values to the client.

6. Add the implementation of the generated client as shown below in order to invoke the `add` operation. 

    ```ballerina
    import ballerina/grpc;
    import ballerina/io;
    
    StreamingCalcServiceClient ep = check new("http://localhost:9090");
    
    public function main () returns error? {
        SumStreamingClient calcClient = check ep->sum();
        foreach var i in 1...10 {
           check calcClient->sendInt(i);
        }
        check calcClient->complete();
        
        int|grpc:Error? result = check calcClient->receiveInt();
        if result is int {
            io:println("Value: ", result);
        } else if result is grpc:Error {
            io:println("Error: ", result);
        } else {
            io:println("Complete.");
        }
    }
    ```

    >**Info:** In the above implementation, the `StreamingCalcServiceMessageListener` service is created along with the client code. This service is used as a callback for processing a streaming result from the remote service. A `grpc:StreamingClient` object is also provided when invoking the remote method of the service. This client is used to send streaming values to the active service request.

## Performing bi-directional streaming

Follow the steps below to perform a sample run of the above implementation.

1. Execute the `bal run service/` command to run the service. You view the output below.

    ```bash
    Compiling source
        laf/service:0.1.0

    Creating the BALA file
        target/bala/laf-service-any-0.1.0.bala

    Running executable

    [ballerina/grpc] started HTTP/WS listener 0.0.0.0:9090
    ```

2. Execute the `bal run client` command to run the client. You view the output below.

    ```bash
    Value: 55
    ```

3. Update the client code to use the `incrementalSum` operation, which implements bi-directional streaming as shown below. 

    ```ballerina
    import ballerina/grpc;
    import ballerina/io;
    
    StreamingCalcServiceClient ep = check new("http://localhost:9090");
    
    public function main () returns error? {
        IncrementalSumStreamingClient streamingClient = check ep->incrementalSum();
        _ = start readResponse(streamingClient);
        
        foreach var i in 1...10 {
           check streamingClient->sendInt(i);
        }
        check streamingClient->complete();
    }
    
    function readResponse(IncrementalSumStreamingClient streamingClient) returns error? {
        while(true) {
            int|grpc:Error? result = check streamingClient->receiveInt();
            if result is int {
                io:println("Value: ", result);
            } else if result is grpc:Error {
                io:println("Error: ", result);
                break;
            } else {
                io:println("Complete.");
                break;
            }
        }
    }
    ```

4. Execute the `bal run client` command to run the client. You view the output below.

    ```bash
    Value: 1
    Value: 3
    Value: 6
    Value: 10
    Value: 15
    Value: 21
    Value: 28
    Value: 36
    Value: 45
    Value: 55
    Complete.
    ```

>**Info:** In the above scenario, the service sends the result as a stream of individual values, which contain the incremental sum values of the input stream. 

<style> #tree-expand-all, #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
