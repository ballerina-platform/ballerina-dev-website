---
layout: ballerina-grpc-getting-started-left-nav-pages-swanlake
title: Writing a gRPC service with Ballerina
description: This guide will walk you through writing a simple Ballerina gRPC service and invoking the service through a Ballerina gRPC client application.
keywords: ballerina, grpc, protocol buffers, protobuf, ballerina packages, language-guide, standard library
permalink: /learn/writing-a-grpc-service-with-ballerina/
active: language-basics
intro: This guide will walk you through writing a simple Ballerina gRPC service and invoking the service through a Ballerina gRPC client application.
redirect_from:
- /learn/getting-started/writing-a-grpc-service-with-ballerina
- /learn/getting-started/writing-a-grpc-service-with-ballerina/
- /learn/user-guide/getting-started/writing-a-grpc-service-with-ballerina
- /learn/user-guide/getting-started/writing-a-grpc-service-with-ballerina/
---

## Setting up the prerequisites

>**Info:** You need a command terminal to complete this tutorial.

To set up the other prerequisites, follow these steps:

1. Install [Ballerina](https://ballerina.io/learn/installing-ballerina/setting-up-ballerina/).
2. Install a text editor. 
  >**Tip:** Preferably, [Visual Studio Code](https://code.visualstudio.com/) with the [Ballerina extension](https://marketplace.visualstudio.com/items?itemName=WSO2.ballerina) installed.

## Understanding the implementation

In an RPC program, you first define the service interface using an Interface Definition Language(IDL) to create the service definition (i.e., `helloworld.proto`). gRPC commonly uses Protocol Buffers as the IDL.

As illustrated in the diagram below, next, you compile the service definition file (i.e., `helloworld.proto`), and generate the source code for both the service (i.e., `greeter_service.bal` file) and client (`greeter_client.bal` file) applications. In Ballerina, you can generate the source code using the built-in `Protocol Buffers to Ballerina` tool.

![gRPC Getting Started](/learn/images/grpc-getting-started.png)


## Creating the service definition

To create a simple service definition in Protocol Buffers, follow these steps:

> **Info:** The sample service definition is taken from the [quick start guide on the gRPC official site](https://grpc.io/docs/languages/go/quickstart/).

1. Create a new directory named `grpc` in a preferred location (this is your main directory.)

2. Inside the `grpc` directory, create a new service definition file (i.e., `helloworld.proto`).

3. Copy the service definition below to the `helloworld.proto` file.

Let's write a simple service definition in Protocol Buffers as below.

```proto
syntax = "proto3";

package helloworld;

// The greeting service definition.
service Greeter {
 // Sends a greeting.
 rpc sayHello (HelloRequest) returns (HelloReply);
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


Let’s start implementing a Ballerina service and client for the above definition. Create a new service definition file (i.e., `helloworld.proto`) in which you want to create the project and copy the above service definition.

Let’s walk through the instructions on implementing the gRPC service and client in the Ballerina language.

### Developing a gRPC service

As with any other Ballerina Program, you need to create a Ballerina project. Then, you can generate the service code in the project and write the business logic.

#### Creating a Ballerina project

Execute the following command to create a new Ballerina project in the directory that you want to create the project.

```bash
$ bal new greeter_service
```

> **Note:** For more information on creating Ballerina packages, see [Getting Started with Ballerina](/learn/getting-started-with-ballerina).

Remove the automatically-created `main.bal` file as you are not going to use it in this guide.

#### Generating the source code

Execute the following command inside the same directory in which you created the Ballerina project to generate the source code related to the service definition.

```bash
$ bal grpc --mode service --input helloworld.proto --output greeter_service/
```

Once successfully executed, you will see the output below.

```bash
Successfully extracted the library files.
Successfully generated the Ballerina file.
```

Once you move into the directory, you will see the following two files,

```bash
greeter_service
├── - - -
├── greeter_service.bal
└── helloworld_pb.bal
```

Here,
- The `helloworld_pb.bal` file is the stub file. It contains classes that the client/service uses to talk to each other
and the Ballerina types corresponding to the request and response messages.
- The `greeter_service.bal` file is the service template file. It contains service(s) with all the remote methods
  defined in the `.proto` file.

#### Update and run the application

Let’s update the service template file (i.e., `greeter_service.bal`) and add the business logic to the remote method. In this case, you only need to update the `sayHello` method as shown below.

```ballerina
import ballerina/grpc;

listener grpc:Listener grpcListener = new (9090);

@grpc:ServiceDescriptor {descriptor: ROOT_DESCRIPTOR_HELLOWORLD, descMap: getDescriptorMapHelloworld()}
service "Greeter" on grpcListener {

   remote function sayHello(HelloRequest value) returns HelloReply|error {
       return { message: "Hello " + value.name};
   }
}
```

In this code,
- The Listener declaration creates a new gRPC listener with port 9090. The listener is the entity that listens to the
input coming to the port and then dispatches it to the correct service(s).
- The service declaration creates a service and attaches it to the listener. The service annotation is to create an
  internal mapping between the service declarations and the PROTO definition. Do not change it.
- The gRPC service can have one or more remote methods depending on the proto definition. Here, this service has only one
  method called `sayHello` that has the `HelloRequest` type as the request and `HelloReply` type as the response.

Let’s run this project in your terminal:

```bash
$ bal run
Compiling source
	example/greeter_service:0.1.0

Running executable
```

Now you completed the server-side implementation, and it is running on port 9090. Let’s move on to the gRPC client-side implementation.

### Developing a gRPC client

Similar to the service, the client application also starts with creating a new Ballerina project. Once created, you can generate the client code and update the code to call the remote methods exposed by the service.

#### Creating a Ballerina project

Execute the following command to create a new Ballerina project in the directory that you want to create the project.

```bash
$ bal new greeter_client
```

> **Note:** For more information on creating Ballerina packages, see [Getting Started with Ballerina](/learn/getting-started-with-ballerina).

Remove the automatically-created `main.bal` file as you are not going to use it in this guide.

#### Generating the source code

Execute the following command inside the same directory in which you created the Ballerina project to generate the source code related to the service definition.

```bash
$ bal grpc --mode client --input helloworld.proto --output greeter_client/
```

Once successfully executed, you could be able to view the below output.
```
Successfully extracted the library files.
Successfully generated the Ballerina file.
```

Once you move into the directory, you will see the following two new files.
```
greeter_client
├── - - -
├── greeter_client.bal
└── helloworld_pb.bal
```

Here,
- The `helloworld_pb.bal` file is the stub file that contains the classes that the client/service uses to talk to each
other and the Ballerina types corresponding to request and response messages.
- The `greeter_client.bal` file is the client template file that contains the `main` function with the client declaration.

#### Update and run the application

Let’s update the client template file (i.e., `greeter_client.bal`) and write code to call the remote function in the server and get the server response back. Sample code is as follows,

```ballerina
import ballerina/io;

GreeterClient ep = check new ("http://localhost:9090");
public function main() returns error? {
   HelloReply sayHello = check ep->sayHello({name: "Ballerina"});
   io:println(`Response : ${sayHello.message}`);
}
```

In this code,

- The client declaration creates a connection to the remote server which is listening on port 9090. The generated client has remote methods that can use to talk to a remote server.
- The `main` function contains the statements that call the `sayHello` remote function and prints the response to the
  console.

Let’s run this project in your terminal:

```bash
$ bal run
Compiling source
	example/greeter_client:0.1.0

Running executable
```

Since the server is up and running, once the client application is successfully executed, the client application
invokes the `sayHello` function with the  `HelloRequest` message and receives the `HelloReply` as the response. You will
see the output below printed on the console.

```
Response : Hello Ballerina
```

To learn more about gRPC support in Ballerina, see the following:
- [gRPC Library Documentation](https://lib.ballerina.io/ballerina/grpc/latest)
- [gRPC CLI tooling guide](/learn/cli-documentation/grpc/)
- [gRPC Examples](/learn/by-example/grpc-simple.html?is_ref_by_example=true)
