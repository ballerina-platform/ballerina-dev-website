---
layout: ballerina-grpc-getting-started-left-nav-pages-swanlake
title: Write a gRPC service with Ballerina
description: This guide will walk you through writing a simple Ballerina gRPC service and invoking the service through a Ballerina gRPC client application.
keywords: ballerina, grpc, protocol buffers, protobuf, ballerina packages, language-guide, Ballerina library
permalink: /learn/write-a-grpc-service-with-ballerina/
active: write-a-grpc-service-with-ballerina
intro: This guide walks you through writing a simple Ballerina gRPC service and invoking the service through a Ballerina gRPC client application.
---

## Set up the prerequisites

To complete this tutorial, you need:

1. [Ballerina 2201.0.0 (Swan Lake)](/downloads/) or greater
2. <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina extension</a> installed.

## Understand the implementation

In an RPC program, you first define the service interface using an Interface Definition Language (IDL) to create the service definition (i.e., `helloworld.proto`). gRPC commonly uses Protocol Buffers as the IDL.

As illustrated in the diagram below, next, you compile the service definition file (i.e., `helloworld.proto`), and generate the source code for both the service and client applications. In Ballerina, you can generate the source code using the built-in `Protocol Buffers to Ballerina` tool.

![gRPC Getting Started](/learn/images/grpc-getting-started.png)

## Create the service definition

To create a simple service definition in Protocol Buffers, follow these steps:

1. Create a new directory named `grpc_sample` in a preferred location (this is your main directory).

2. Open the `grpc_sample` directory in your text editor. 

    >**Tip:** If you have VS Code installed, in the terminal, navigate to the `grpc_sample` directory, and execute the `code .` command.

3. Inside the `grpc_sample` directory, create a new service definition file (i.e., `helloworld.proto`).

4. Copy the service definition below to the `helloworld.proto` file.
  > **Info:** This sample service definition is taken from the [Quick start](https://grpc.io/docs/languages/go/quickstart/) guide on the gRPC official site.


  ```proto
  syntax = "proto3";

  package helloworld;

  // The greeting service definition.
  service Greeter {
    // Sends a greeting.
    rpc sayHello(HelloRequest) returns (HelloReply);
  }

  // The request message with the user's name.
  message HelloRequest {
    string name = 1;
  }

  // The response message with the greetings.
  message HelloReply {
    string message = 1;
  }
  ```

Now, let’s implement the gRPC service and client in the Ballerina language.

## Implement the gRPC service

Ballerina uses packages to group code. Follow the steps below to create a Ballerina package, generate the service code in the package, and write the business logic.

> **Info:** For more information on Ballerina packages, see [Organize Ballerina code](/learn/organize-ballerina-code/).

1. Open the VS Code editor, and use the ``Ctrl+` `` keyboard shortcut with the backtick character to open the Terminal window.

2. In the terminal, execute the command below to create the Ballerina package for the API implementation.

    ```
    $ bal new greeter_service
    ```

    You view the output below.

    ```
    Created new package 'greeter_service' at greeter_service.
    ```

    This creates a directory named `greeter_service` with the files below.

    ```
    .
    ├── greeter_service
    │   ├── Ballerina.toml
    │   └── main.bal
    ```

3. In the terminal, navigate to the directory of the created package and execute the `code .` command to open it in VS Code.

4. Remove the automatically-created `main.bal` file as you are not going to use it in this guide.

### Generate the source code of the service

In the VS Code terminal, from inside the same `grpc_sample` directory, execute the command below to generate the source code related to the service definition.

```
$ bal grpc --mode service --input helloworld.proto --output greeter_service/
```

Once successfully executed, you will see the output below.

```
Successfully extracted the library files.
Successfully generated the Ballerina file.
```

This creates the two files below inside the `greeter_service` directory.

```
.
├── greeter_service
│   ├── greeter_service.bal
│   └── helloworld_pb.bal
```

- The `helloworld_pb.bal` file is the stub file, which contains classes that the client/service uses to talk to each other and the Ballerina types corresponding to the request and response messages.
- The `greeter_service.bal` file is the service template file, which contains service(s) with all the remote methods
  defined in the `.proto` file.

### Update the service template file

Follow these steps below to add the business logic to the remote method. n this case, you only need to update the `sayHello` method as shown below).
