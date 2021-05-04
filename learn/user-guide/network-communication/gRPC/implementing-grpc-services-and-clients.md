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
remote function add(AddRequest value) returns AddResponse|error {
    // Implementation goes here.
}
```

The implementation of the `add` service function can be completed as follows.

```ballerina
remote function add(AddRequest value) returns AddResponse|error {
    int result = value.numbers.reduce(function(int n, int i) returns int => n + i, 0);
    return {result: result};
}
```
The below is the full implementation of the service.

```ballerina
import ballerina/grpc;
import ballerina/uuid;
 
listener grpc:Listener ep = new (9090);
 
map<Person> personMap = {};
 
@grpc:ServiceDescriptor {
   descriptor: ROOT_DESCRIPTOR,
   descMap: getDescriptorMap()
}
service "AdminService" on ep {
 
    remote function add(AddRequest value) returns AddResponse|error {
        int result = value.numbers.reduce(function(int n, int i) returns int => n + i, 0);
        return {result: result};
    }
    remote function multiply(MultiplyRequest value) returns MultiplyResponse|error {
        return {result: value.v1 * value.v2};
    }
    remote function addPerson(Person value) returns AddPersonResponse|error {
        value.id = uuid:createType1AsString();
        personMap[value.id] = <@untainted> value;
        return {id: value.id};
    }
    remote function getPerson(GetPersonRequest value) returns Person|error {
        Person? person = personMap[value.id];
        if (person is Person) {
            return person;
        } else {
            return error grpc:NotFoundError(string `Person value for id: ${value.id} doesn't exist.`);
        }
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
AdminServiceClient ep = check new("http://localhost:9090");

public function main () {

}
```

The `ep` object contains the remote functions that correspond to the gRPC service methods. The diagram below shows the VS Code code assist in listing the methods. 

![Admin Service Client Remote Functions List](/learn/images/grpc-service-functions-list.png)

Complete the automatically-generated code in the `client` module of the `AdminService_sample_client.bal` file. The completed gRPC client code, which invokes all the methods defined in the service is as follows. 

```ballerina
import ballerina/io;

AdminServiceClient adminServiceClient = check new("http://localhost:9090");

public function main () returns error? {
   AddResponse addResult = check adminServiceClient->add({ numbers: [1, 2, 3, 4] });
   io:println("Add Result: ", addResult.result);
   MultiplyResponse mulResult = check adminServiceClient->multiply({ v1: 5, v2: 7 });
   io:println("Multiply Result: ", mulResult.result);
   Person person = { name: "Jack Dawson", birthYear: 1990 };
   AddPersonResponse addPersonResult = check adminServiceClient->addPerson(person);
   io:println("Add Person Result: ", addPersonResult.id);
   Person getPersonResult = check adminServiceClient->getPerson({ id: addPersonResult.id });
   io:println("Get Person Result: ", getPersonResult);
}
```

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
   Multiply Result: 35
   Add Person Result: eb8d852a-7988-4404-8f7e-173544f2af79
   Get Person Result: {"id":"eb8d852a-7988-4404-8f7e-173544f2af79","name":"Jack Dawson","birthYear":1990}
   ```

Now, the client will establish a connection with the gRPC service, invoke the methods in it, and receive the respective response messages. 

## What's Next?

For information on gRPC streaming, see [Performing gRPC Streaming](/learn/network-communication/grpc/performing-grpc-streaming/).

<style> #tree-expand-all, #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>

