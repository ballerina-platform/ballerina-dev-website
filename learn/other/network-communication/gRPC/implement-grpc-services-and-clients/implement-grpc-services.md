---
layout: ballerina-left-nav-pages-swanlake
title: Implementing gRPC services 
description: The topics below explain how to implement a gRPC service and write a client to invoke it.
keywords: ballerina, cli, command-line interface, programming language
permalink: /learn/user-guide/network-communication/grpc/implementing-grpc-services-and-clients/implementing-grpc-services/
active: implementing-grpc-services
intro: The topics below explain how to implement a gRPC service and write a client to invoke it. 
redirect_from:
  - /learn/network-communication/grpc/implementing-grpc-services-and-clients
  - /swan-lake/learn/network-communication/grpc/implementing-grpc-services-and-clients/
  - /swan-lake/learn/network-communication/grpc/implementing-grpc-services-and-clients
  - /learn/network-communication/grpc/implementing-grpc-services-and-clients/
  - /learn/network-communication/grpc/implementing-grpc-services-and-clients
  - /learn/user-guide/network-communication/grpc/implementing-grpc-services-and-clients
  - /learn/user-guide/network-communication/grpc/implementing-grpc-services-and-clients/
  - /learn/user-guide/network-communication/grpc/implementing-grpc-services-and-clients/implementing-grpc-services
redirect_to:
  - https://lib.ballerina.io/ballerina/grpc/latest/
---

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
Below is the full implementation of the service.

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
        personMap[value.id] = value;
        return {id: value.id};
    }
    remote function getPerson(GetPersonRequest value) returns Person|error {
        Person? person = personMap[value.id];
        if person is Person {
            return person;
        } else {
            return error grpc:NotFoundError(string `Person value for id: ${value.id} doesn't exist.`);
        }
    }
}
```

<style> #tree-expand-all, #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>

