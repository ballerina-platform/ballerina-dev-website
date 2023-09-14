---
layout: ballerina-cli-documentation-left-nav-pages-swanlake
title: gRPC tool
description: The `Protocol Buffers to Ballerina` tool provides capabilities to generate Ballerina source code for the Protocol Buffer definition.
keywords: ballerina, protocol buffers, programming language
permalink: /learn/cli-documentation/grpc/
active: grpc
intro: Protocol Buffers is an open-source cross-platform data format used to serialize structured data. gRPC uses Protocol Buffers as Interface Definition Language to create service contracts, detailing all of its remote methods and message formats. The `Protocol Buffers to Ballerina` tooling makes it easy for users to develop a service documented in a Protocol Buffers by generating Ballerina service/client stub files and skeletons.
---

## Prepare the service definition

The example below shows a sample Protocol Buffers definition (`helloworld.proto` file).

```proto
syntax = "proto3";

package helloworld;

// The greeting service definition.
service Greeter {
 // Sends a greeting
 rpc sayHello (HelloRequest) returns (HelloReply);
}

// The request message with the user's name.
message HelloRequest {
 string name = 1;
}

// The response message with the greetings
message HelloReply {
 string message = 1;
}
```
**Note:** The sample service definition is taken from the [gRPC official site](https://grpc.io/docs/what-is-grpc/introduction/).

## Usage

The code generation tool can produce `service/client stub files` and `service/client skeletons` in the Ballerina Language.
 
>**Info:** In Ballerina, Protocol Buffers serialization is supported only in the gRPC module. Therefore, you can only use this tool to generate Ballerina source code for gRPC service definitions.

You can generate Ballerina source code using the following command.

```
$ bal grpc --input <proto-file-path> 
         [--output <path>] 
         [--mode client|service]
         [--proto-path <proto-directory>]
```

## Command options

| Parameter      | Description                                                                                                                                                                                                                                                                                                                                                  | Mandatory/Optional |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| `--input`  | Path of the `.proto` definition file or a directory containing multiple `.proto` files.                                                                                                                                                                                                                         | Mandatory           |
| `--output`     | Location of the generated Ballerina source files. If the output path is not specified, the output is written to a directory corresponding to the package in the Protocol Buffers definition. If the package is not specified, the output is written to a directory named 'temp' in the current location.                                                                                                                                          | Optional           |
| `--mode`     | Set the mode as client or service to generate code samples. If not specified, only the stub file is generated.                                                                                                                                          | Optional           |
| `-- proto-path`     | Path to a directory in which to look for `.proto` files when resolving import directives. If omitted, the current directory is used. The `.proto` file specified in the `input` must reside in the `proto-path` so that the compiler can determine its canonical name.                                                                                                                                         | Optional           |

## Generate the stub 

Execute the following command to generate only the client/service stub file.

```
$ bal grpc --input helloworld.proto --output stubs
```

Once you execute the command, only the stub file (`helloworld_pb.bal`) is generated inside the `stubs` directory.

## Generate the stub and service template

Execute the below command to generate the client/service stub and service template files.

```
$ bal grpc --input helloworld.proto --mode service --output service
```

Once you execute the command, the stub file (`helloworld_pb.bal`) and the service template file (`greeter_service.bal`) are generated inside the service directory.

> **Note:** If you have multiple services in a Protocol Buffers definition, this command will generate a stub file with common message types and a service template file for each service definition. This is to avoid duplicating message types in all the service files.

## Generate the stub and client template

Execute the following command to generate the client/service stub and client template files.

```
$ bal grpc --input helloworld.proto --mode client --output client
```

Once you execute the command, the stub file (`helloworld_pb.bal`) and the client template file (`greeter_client.bal`) are generated inside the client directory.
