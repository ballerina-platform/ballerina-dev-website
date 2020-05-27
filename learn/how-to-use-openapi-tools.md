---
layout: ballerina-left-nav-pages
title: How to Use Ballerina OpenAPI Tools
description: Check out how the Ballerina OpenAPI tooling makes it easy for users to start developing a service documented in the OpenAPI contract.
keywords: ballerina, programming language, openapi, open api, restful api
permalink: /learn/how-to-use-openapi-tools/
active: how-to-use-openapi-tools
redirect_from:
  - /learn/how-to-use-openapi-tools
  - /v1-2/learn/how-to-use-openapi-tools
  - /v1-2/learn/how-to-use-openapi-tools/
---

## How to Use Ballerina OpenAPI Tools

OpenAPI Specification is a specification that creates a RESTFUL contract for APIs, detailing all of its resources and operations in a human and machine-readable format for easy development, discovery, and integration. Ballerina OpenAPI tooling will make it easy for users to start development of a service documented in OpenAPI contract in Ballerina by generating Ballerina service and client skeletons.

The OpenAPI tools provides following capabilities.

1. Generate the Ballerina Service or Client code for a given OpenAPI definition.
2. Generate the client stub for an existing Ballerina service at build time.
3. Export the OpenAPI definition of a Ballerina service.

The `openapi` command in Ballerina is used for OpenAPI to Ballerina and Ballerina to OpenAPI code generation.
Code generation from OpenAPI to Ballerina can produce `ballerina mock services` and `ballerina client stubs`.

For build time client stub generation, annotation support is provided.

### Mock service from OpenAPI
`ballerina openapi gen-service <moduleName>:<serviceName> 
                               <openapi_contract>
                               [-c: copy-contract] 
                               [-o: outputFile]`

Generates a Ballerina service for the OpenAPI file.

This generated service is a mock version of the actual Ballerina service. Generated sources contain the service definition in `src/<module-name>/` and the OpenAPI contract that used to generate will be copied to `src/<module-name>/resources`. 

### Client stub from OpenAPI
`ballerina openapi gen-client [<moduleName>]:<clientName> 
                   <openapi-contract> [-o <dir-path> | --output <dir-path>]`
    
Generates a Ballerina client stub for the service defined in a OpenAPI file.

This client can be used in client applications to call the service defined in the OpenAPI file.

### Service to OpenAPI export
`ballerina openapi gen-contract [<moduleName>:]<serviceName> 
                                [-i: <ballerinaFile> | --ballerina-file <ballerina-file>] 
                                [-o: <openapi-contract> | --output <openapi-contract>] 
                                [-s | --skip-bind]`

Export the Ballerina service to a definition of OpenApi Specification 3.0.
For the export to work properly, the input Ballerina service should be defined using basic service and resource level HTTP annotations.

### Client stub for service
Generates a Ballerina client stub to communicate with a Ballerina service.

All endpoint(s) that are used for client stub generation should be marked with the `@openapi:ClientEndpoint` annotation. If not, there might be errors during client stub generation. Endpoints that are not marked with this annotation are not picked for client stub generation.
The `@openapi:ClientConfig { generate: true }` annotation is used to enable or disable client stub generation per service.

## Samples

### Mock service from OpenAPI
`ballerina openapi gen-service helloworld:helloService hello_service.yaml`

This will generate a Ballerina service, for `hello_service.yaml` OpenAPI contract, named `helloService` in the module named `helloworld`.
This command should be executed inside a Ballerina project. 
### Client stub from OpenAPI
`ballerina openapi gen-client hello_client hello_service.yaml`

This will generate a Client named `hello_client` in a module named `client` for the service documented in `hello_service.yaml`.
This command should be executed inside a Ballerina project. 
### OpenAPI from service
`ballerina openapi gen-contract helloworld:helloService -i src/helloworld/helloService.bal`

This will generate the OpenAPI contract for the Ballerina service `hello` which is in `hello.bal` Ballerina file.
### Client stub from service
Apply annotation to say that client generation is enabled by adding `@openapi:ClientConfig { generate: true }`
and point the client endpoint to be applied on generation by adding `@openapi:ClientEndpoint` annotation to the client endpoint.
```ballerina
import ballerina/http;
import ballerina/log;
import ballerina/openapi;

// Define this endpoint as a selected endpoint for client generation.
@openapi:ClientEndpoint
listener http:Listener helloEp = new(9090);

// Enable client code generation for this service.
@openapi:ClientConfig {
    generate: true
}
@http:ServiceConfig {
    basePath: "/sample"
}
service Hello on helloEp {    
    @http:ResourceConfig {
        methods: ["GET"],
        path: "/hello"
    }
    resource function hello(http:Caller caller, http:Request req) {
        http:Response res = new;
        res.setPayload("Hello");
        var result = caller->respond(res);
        if (result is error) {
            log:printError("Error when responding", err = result);
        }
    }
}
```
