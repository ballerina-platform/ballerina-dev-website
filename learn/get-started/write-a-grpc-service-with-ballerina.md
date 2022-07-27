---
layout: ballerina-grpc-getting-started-left-nav-pages-swanlake
title: Write a gRPC service with Ballerina
description: This guide will walk you through writing a simple Ballerina gRPC service and invoking the service through a Ballerina gRPC client application.
keywords: ballerina, grpc, protocol buffers, protobuf, ballerina packages, language-guide, standard library
permalink: /learn/write-a-grpc-service-with-ballerina/
active: write-a-grpc-service-with-ballerina
intro: This guide will walk you through writing a simple Ballerina gRPC service and invoking the service through a Ballerina gRPC client application.
redirect_from:
- /learn/getting-started/writing-a-grpc-service-with-ballerina
- /learn/getting-started/writing-a-grpc-service-with-ballerina/
- /learn/user-guide/getting-started/writing-a-grpc-service-with-ballerina
- /learn/user-guide/getting-started/writing-a-grpc-service-with-ballerina/
- /learn/writing-a-grpc-service-with-ballerina/
- /learn/writing-a-grpc-service-with-ballerina
- /learn/write-a-grpc-service-with-ballerina
- /learn/getting-started/writing-a-grpc-service-with-ballerina/
- /learn/getting-started/writing-a-grpc-service-with-ballerina
---

## Set up the prerequisites

To complete this tutorial, you need:

1. [Ballerina 2202.0.0 (Swan Lake)](/learn/install-ballerina/set-up-ballerina/) or greater
2. A text editor
  >**Tip:** Preferably, [Visual Studio Code](https://code.visualstudio.com/) with the [Ballerina extension](https://marketplace.visualstudio.com/items?itemName=WSO2.ballerina) installed.
3. A command terminal

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

Ballerina uses packages to group code. You need to create a Ballerina package, generate the service code in the package, and write the business logic.

### Create the service package

In the terminal, navigate to the `grpc_sample` directory, and execute the command below to create the Ballerina package for the gRPC service implementation.

> **Note:** For more information on Ballerina packages, see [Organize Ballerina code](/learn/organize-ballerina-code/).

```bash
$ bal new greeter_service
```

You view the output below.

```bash
Created new package 'greeter_service' at greeter_service.
```

This creates a directory named `greeter_service` with the files below.

```bash
.
├── greeter_service
│   ├── Ballerina.toml
│   └── main.bal
```

>**Tip:** Remove the automatically-created `main.bal` file as you are not going to use it in this guide.

### Generate the source code of the service

In the terminal, from inside the same `grpc_sample` directory, execute the command below to generate the source code related to the service definition.

```bash
$ bal grpc --mode service --input helloworld.proto --output greeter_service/
```

Once successfully executed, you will see the output below.

```bash
Successfully extracted the library files.
Successfully generated the Ballerina file.
```

This creates the two files below inside the `greeter_service` directory.

```bash
.
├── greeter_service
│   ├── greeter_service.bal
│   └── helloworld_pb.bal
```

- The `helloworld_pb.bal` file is the stub file, which contains classes that the client/service uses to talk to each other and the Ballerina types corresponding to the request and response messages.
- The `greeter_service.bal` file is the service template file, which contains service(s) with all the remote methods
  defined in the `.proto` file.

### Update the service template file

To add the business logic to the remote method (in this case, you only need to update the `sayHello` method as shown below), follow these steps:

1. Open the `greeter_service` directory in your text editor. 

2. Replace the service template file (i.e., `greeter_service.bal`) with the code below.

    ```ballerina
    import ballerina/grpc;

    listener grpc:Listener grpcListener = new (9090);

    @grpc:ServiceDescriptor {descriptor: ROOT_DESCRIPTOR_HELLOWORLD, descMap: getDescriptorMapHelloworld()}
    service "Greeter" on grpcListener {

        remote function sayHello(HelloRequest value) returns HelloReply|error {
            return {message: "Hello " + value.name};
        }
    }
    ```

    In this code:
      - The listener declaration creates a new gRPC listener with port 9090. The listener is the entity that listens to the
    input coming to the port and then dispatches it to the correct service(s).
      - The service declaration creates a service and attaches it to the listener. The service annotation is to create an
      internal mapping between the service declarations and the `.proto` definition. Do not change it.
      - The gRPC service can have one or more remote methods depending on the `.proto` definition. Here, this service has only one method called `sayHello` that has the `HelloRequest` type as the request and `HelloReply` type as the response.

## Run the gRPC service 

In the terminal, navigate to the `greeter_service` directory, and execute the command below to run the service package

```bash
$ bal run
```

You view the output below.

```bash
Compiling source
	example/greeter_service:0.1.0

Running executable
```

Now, you completed the server-side implementation and it is running on port 9090. Let’s move on to the gRPC client-side implementation.

## Implement the gRPC client

Similar to the service, the client application also starts with creating a new Ballerina package. Once created, you can generate the client code and update the code to call the remote methods exposed by the service.

### Create the client package

In a new tab of the terminal, navigate to the `grpc_sample` directory, and execute the command below to create the Ballerina package for the gRPC client implementation:

> **Note:** For more information on Ballerina packages, see [Organize Ballerina code](/learn/organize-ballerina-code/).

```bash
$ bal new greeter_client
```

You view the output below.

```bash
Created new package 'greeter_client' at greeter_service.
```

This creates a directory named `greeter_client` with the files below.

```bash
.
├── greeter_client
│   ├── Ballerina.toml
│   └── main.bal
```

>**Tip:** Remove the automatically-created `main.bal` file as you are not going to use it in this guide.

### Generate the source code of the client

In the terminal, from inside the same `grpc_sample` directory, execute the command below to generate the source code related to the client definition.

```bash
$ bal grpc --mode client --input helloworld.proto --output greeter_client/
```

Once successfully executed, you will see the output below.

```bash
Successfully extracted the library files.
Successfully generated the Ballerina file.
```

This creates the two files below inside the `greeter_client` directory.

```bash
.
├── greeter_client
│   ├── greeter_client.bal
│   └── helloworld_pb.bal
```

- The `helloworld_pb.bal` file is the stub file, which contains the classes that the client/service uses to talk to each
other and the Ballerina types corresponding to request and response messages.
- The `greeter_client.bal` file is the client template file, which contains the `main` function with the client declaration.

### Update the client template file

Replace the client template file (i.e., `greeter_client.bal`) with the code below to add the business logic to the remote method. 

```ballerina
import ballerina/io;

GreeterClient ep = check new ("http://localhost:9090");
public function main() returns error? {
   HelloReply sayHello = check ep->sayHello({name: "Ballerina"});
   io:println(`Response : ${sayHello.message}`);
}
```

In this code:

- The client declaration creates a connection to the remote server which is listening on port 9090. The generated client has remote methods that can use to talk to a remote server.
- The `main` function contains the statements that call the `sayHello` remote function and prints the response to the console.

## Run the gRPC client

In the terminal, navigate to the `greeter_client` directory, and execute the command below to run the service package

```bash
$ bal run
```

You view the output below printed on the console.

>**Info:** Since the server is up and running, once the client application is successfully executed, the client application invokes the `sayHello` function with the  `HelloRequest` message and receives the `HelloReply` as the response.

```bash
Compiling source
	example/greeter_client:0.1.0
Running executable
Response : Hello Ballerina
```

## Learn more

To learn more about gRPC support in Ballerina, see the following:
- [`grpc` module documentation](https://lib.ballerina.io/ballerina/grpc/latest)
- [gRPC CLI tooling guide](/learn/cli-documentation/grpc/)
- [Simple RPC](/learn/by-example/grpc-simple.html)
