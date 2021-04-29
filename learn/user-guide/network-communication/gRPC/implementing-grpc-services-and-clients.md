---
layout: ballerina-left-nav-pages-swanlake
title: Implementing gRPC Services and Clients
description: The topics below explain how to implement a gRPC service and write a client to invoke it.
keywords: ballerina, cli, command line interface, programming language
permalink: /learn/user-guide/network-communication/grpc/implementing-grpc-services-and-clients/
active: implementing-grpc-services-and-clients
intro: The topics below explain how to implement a gRPC service and write a client to invoke it. 
redirect_from:
  - /learn/network-communication/grpc/implementing-grpc-services-and-clients
  - /swan-lake/learn/network-communication/grpc/implementing-grpc-services-and-clients/
  - /swan-lake/learn/network-communication/grpc/implementing-grpc-services-and-clients
  - /learn/network-communication/grpc/implementing-grpc-services-and-clients/
  - /learn/network-communication/grpc/implementing-grpc-services-and-clients
  - /learn/user-guide/network-communication/grpc/implementing-grpc-services-and-clients
---

## Implementing a gRPC Service

Execute the `bal new service` command to create a Ballerina package to implement the service. You view the output below.

```bash
Created new Ballerina package 'service' at service.
```

Execute the `bal grpc --mode service --input admin.proto --output service/` command to create the gRPC service skeleton. You view the output below.

```bash
Successfully extracted library files.
Successfully generated ballerina file.
```

The `AdminService_sample_service.bal` file, which contains the service skeleton will be automatically generated in the default module directory of the service. 

You can simply fill in the implementation of the service functions that are defined in it. For example, the following is the remote function generated for the `add` gRPC method. 

```ballerina
remote function add(grpc:Caller caller, AddRequest value) {
    // Implementation goes here.
    // You should return a AddResponse
}
```

The implementation of the `add` service function can be completed as follows.

```ballerina
remote function add(grpc:Caller caller,
                    AddRequest value) returns error? {
    check caller->send(value.numbers.reduce(
                    function (int n, int i)
                    returns int => n + i, 0));
    check caller->complete();
}
```

The implementation uses the two `send` and `complete` remote function calls from the `caller` object. The `caller` represents the actual client that is sending requests to the service. Therefore, this object will be used to respond to the client. 

The `send` remote function can be called more than once because of the streaming functionality available with gRPC. After sending multiple calls, the completion of this session is notified by calling the `complete` remote function. In this situation, the `add` invocation only consists of a single return value to the client, and thereby, after a single `send` invocation, the call gets completed immediately.

The below is the full implementation of the service.

```ballerina
import ballerina/grpc;
import ballerina/system;
 
listener grpc:Listener ep = new (9090);
 
map<Person> personMap = {};
 
@grpc:ServiceDescriptor {
   descriptor: ROOT_DESCRIPTOR,
   descMap: getDescriptorMap()
}
service /AdminService on ep {
 
   remote function add(grpc:Caller caller,
                       AddRequest value) returns error? {
       check caller->send(value.numbers.reduce(
                       function (int n, int i)
                       returns int => n + i, 0));
       check caller->complete();
   }
   remote function multiply(grpc:Caller caller,
                            MultiplyRequest value) returns error? {
       check caller->send(value.v1 + value.v2);
       check caller->complete();
   }
   remote function addPerson(grpc:Caller caller,
                             Person value) returns error? {
       value.id = system:uuid();
       personMap[value.id] = <@untainted> value;
       check caller->send(value.id);
       check caller->complete();
   }
   remote function getPerson(grpc:Caller caller,
                             GetPersonRequest value) returns error? {
       check caller->send(personMap[value.id]);
       check caller->complete();
   }
}
```

## Implementing a gRPC Client

After completing the service implementation above, you can call these service methods using a client as follows. 

Execute the `bal new client` command to create a Ballerina package to implement the client. You view the output below.

```bash
Created new Ballerina package 'client' at client.
```

Execute the `bal grpc --mode client --input admin.proto --output client/` command to create the service stub/client. You view the output below.

```bash
Successfully extracted library files.
Successfully generated ballerina file.
```

The service stub/client is generated in the client default module directory. The `AdminService_sample_client.bal` file contains sample code instantiating the gRPC client to access the remote service as follows.

```ballerina
public function main (string... args) {
    AdminServiceBlockingClient blockingEp = new("http://localhost:9090");
}
```

The `blockingEp` object contains the remote functions that correspond to the gRPC service methods. The diagram below shows the VS Code code assist in listing the methods. 

![Admin Service Client Remote Functions List](/learn/images/grpc-service-functions-list.png)

Complet automatically-generated code in the `client` module of the `AdminService_sample_client.bal` file. The completed gRPC client code, which invokes all the methods defined in the service is as follows. 

```ballerina
import ballerina/io;
import ballerina/grpc;
 
public function main (string... args) returns error? {
   AdminServiceBlockingClient blockingEp = new("http://localhost:9090");
   [AddResponse, grpc:Headers] addResult = check blockingEp->add({ numbers: [1, 2, 3, 4] });
   io:println("Add Result: ", addResult[0].result);
   [MultiplyResponse, grpc:Headers] mulResult = check blockingEp->multiply({ v1: 5, v2: 7 });
   io:println("Multiply Result: ", mulResult[0].result);
   Person person = { name: "Jack Dawson", birthYear: 1990 };
   [AddPersonResponse, grpc:Headers] addPersonResult = check blockingEp->addPerson(person);
   io:println("Add Person Result: ", addPersonResult[0].id);
   [Person, grpc:Headers] getPersonResult = check blockingEp->getPerson({ id: addPersonResult[0].id });
   io:println("Get Person Result: ", getPersonResult[0]);
}
```

>**Info:** In the code above, the remote function calls return a tuple value, which contains the service response value and the gRPC header values. The header values are ignored and it simply accesses the response value of the tuple value. 

## Executing the Implementations

After completing the full code for both the client and the service, you can execute them by building and running both modules from the Ballerina project root directory as follows. 

1. Execute the `bal run service` command to start the gRPC service. You view the output below.

   ```bash
   Compiling source
      laf/service:0.1.0

   Creating the BALA file
      target/bala/laf-service-any-0.1.0.bala

   Running executable

   [ballerina/grpc] started HTTP/WS listener 0.0.0.0:9090
   ```

   >**Info:** The gRPC service is up and running at port 9090.

2. Execute the `bal run client` command to run the client module, which will try to contact the active service. You view the output below.

   ```bash
   Compiling source
      laf/client:0.1.0

   Creating the BALA file
      target/bala/laf-client-any-0.1.0.bala

   Running executable

   Add Result: 10
   Multiply Result: 12
   Add Person Result: eb8d852a-7988-4404-8f7e-173544f2af79
   Get Person Result: {"id":"eb8d852a-7988-4404-8f7e-173544f2af79","name":"Jack Dawson","birthYear":1990}
   ```

Now, the client will establish a connection with the gRPC service, invoke the methods in it, and receive the respective response messages. 

## What's Next?

For information on gRPC streaming, see [Performing gRPC Streaming](/learn/network-communication/grpc/performing-grpc-streaming/).

<style> #tree-expand-all, #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>

