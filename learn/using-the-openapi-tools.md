---
layout: ballerina-left-nav-pages
title: Using the OpenAPI Tools
description: Check out how the Ballerina OpenAPI tooling makes it easy for users to start developing a service documented in the OpenAPI contract.
keywords: ballerina, programming language, openapi, open api, restful api
permalink: /learn/using-the-openapi-tools/
active: using-the-openapi-tools
redirect_from:
  - /v1-2/learn/how-to-use-openapi-tools
  - /v1-2/learn/how-to-use-openapi-tools/
  - /learn/how-to-use-openapi-tools/
  - /learn/how-to-use-openapi-tools
  - /learn/using-the-openapi-tools
---

# Using the OpenAPI Tools

OpenAPI Specification is a specification that creates a RESTFUL contract for APIs, detailing all of its resources and operations in a human and machine-readable format for easy development, discovery, and integration. Ballerina OpenAPI tooling will make it easy for users to start development of a service documented in OpenAPI contract in Ballerina by generating Ballerina service and client skeletons.

The OpenAPI tools provides following capabilities.

1. Generate the Ballerina Service or Client code for a given OpenAPI definition.
2. Generate the client stub for an existing Ballerina service at build time.
3. Export the OpenAPI definition of a Ballerina service.

The `openapi` command in Ballerina is used for OpenAPI to Ballerina and Ballerina to OpenAPI code generation.
Code generation from OpenAPI to Ballerina can produce `ballerina mock services` and `ballerina client stubs`.

For build time client stub generation, annotation support is provided.

- [OpenAPI to Ballerina](#openAPI-to-ballerina)
    - [Mock Service from OpenAPI](#mock-service-from-openapi)
    - [Client Stub from OpenAPI](#client-stub-from-openapi)
- [Ballerina to OpenAPI](#ballerina-to-openAPI)    
    - [Service to OpenAPI Export](#service-to-openapi-export)
- [Client Stub for Service](#client-stub-for-service)    
- [Samples](#samples)
    - [Mock Service from OpenAPI Sample](#mock-service-from-openapi-sample)
    - [Client Stub from OpenAPI Sample](#client-stub-from-openapi-sample)
    - [OpenAPI from Service Sample](#openapi-from-service-sample)
    - [Client Stub from Service Sample](#client-stub-from-service-sample)
- [OpenAPI Validator Compiler Plugin](#openAPI-validator-compiler-plugin)
     

###OpenAPI to Ballerina
####Mock service and Client stub from OpenAPI
```
ballerina openapi   -i <openapi-contract> 
               [--service-name: generated files name]
               [--tags: tags list]
               [--operations: operationsID list]
               [(-o|--output): outputFile]
```
Generates both Ballerina service and Ballerina client stub for a given OpenAPI file. 

This parameter `-i <openapi-contract>` of the command is mandatory. As an input it will take the path to the resource file. 

`--service-name`  This is an optional parameter. If you are interested in naming generated files by given name, 
you can use this parameter with command. 

You can give the specific tags and operations that you need to document as services without documenting the 
whole operation using these optional commands `--tags` and `--operations`.

`(-o|--output)` is the optional parameter. You can give the specific direction path to generate the files. 
If not it will take the execution path as the target path.

####Mock service from OpenAPI
```
ballerina openapi   -i <openapi-contract> --mode service
                    [(-o|--output) outputFile]
```
Generates a Ballerina service for the OpenAPI file. This generated service is a mock version of the actual Ballerina service.


####Client stub from OpenAPI
```
ballerina openapi   -i <openapi-contract> --mode client
                    [(-o|--output) outputFile]
```
Generates a Ballerina client stub for the service defined in a OpenAPI file. This client can be used in client 
applications to call the service defined in the OpenAPI file.

###Ballerina to OpenAPI
####Service to OpenAPI export
```
ballerina openapi   -i <ballerina file> 
                    [(-o|--output) output openapi File]
```
Export the Ballerina service to a definition of OpenApi Specification 3.0. For the export to work properly, 
the input Ballerina service should be defined using basic service and resource level HTTP annotations.
If a user needs to document an OpenAPI contract for only one given service, then the user can use this command.
``ballerina openapi -i <ballerina file> (-s | --service) <service name>``

###Client stub for service
Generates a Ballerina client stub to communicate with a Ballerina service.
All endpoint(s) that are used for client stub generation should be marked with the 
`@openapi:ClientEndpoint` annotation. If not, there might be errors during client stub generation. Endpoints that are not marked with 
this annotation are not picked for client stub generation. The `@openapi:ClientConfig { generate: true }` 
annotation is used to enable or disable client stub generation per service.


##Samples for openAPI commands
###Mock service and client stub from OpenAPI

`ballerina openapi -i hello.yaml`

This will generate a Ballerina service and Client stub, for `hello.yaml` OpenAPI contract, 
named `hello-service` and client named `hello-client`. The above command can be run anywhere on the execution path. 
It is not mandatory  to run inside the ballerina project.

Output:
```
The service generation process is complete. Following files were created.
-- hello-service.bal
-- hello-client.bal
-- schema.bal
```
###OpenAPI from service

- `ballerina openapi -i src/helloworld/helloService.bal`
This will generate the OpenAPI contracts for the Ballerina services which are in `hello.bal` Ballerina file.
- `ballerina openapi -i src/helloworld/helloService.bal (-s | --service) helloworld`
This command will generate the `helloworld-openapi.yaml` file that related to helloworld service inside the helloService.bal file

###Client stub from service
Apply annotation to say that client generation is enabled by adding `@openapi:ClientConfig { generate: true }` and
 point the client endpoint to be applied on  generation by adding `@openapi:ClientEndpoint` annotation to the client
  endpoint.

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

##OpenAPI Validator Compiler Plugin

OpenAPI Validator Compiler plugin was implemented which validates a service with a given OpenAPI contract. 
The compiler plugin is activated if a service has `openapi:ServiceInfo` annotation. This plugin compares 
the service and the OpenAPI Contract and validates both against a predefined set of validation rules. 
If any of the rules fail the plugin will result in one or more compilation errors.

###Annotation for validator plugin 
We will use “@openapi:ServiceInfo” annotation to bind the service with an OpenAPI Contract. Users need to add 
this annotation to the service file with the required values for enabling the validations.  
Following is an example of annotation usage.
```
@openapi:ServiceInfo{
    contract: “/path/to/openapi.json|yaml”,
    [ tag : “store” ],
    [ operations: [“op1”, “op2”] ] 
    [ failOnErrors]: true/false → default : true
    [ excludeTags ]: [“pets”, “user”]
    [ excludeOperations: [“op1”, “op2”] ]
   }
service greet on new http:Listener(9090) {
    ...
}
```
 **Annotation support the following attributes:**
- **Contract** (Required) : **string**  :
Here you can provide a path to the OpenAPI contract as a string and OpenAPI file can either be .yaml or .json
This is a required attribute.

- **Tag**(Optional) : **string[]?**     :
The compiler will only validate resources against operations which are tagged with a tag specified in the list.
If not specified, the compiler will validate resources against all the operations defined in the OpenAPI contract. 

- **Operations** (Optional): **string[]?**  :
Should contain a list of operation names that need to be validated against the resources in the service.
If not specified, the compiler will validate resources against all the operations defined in the OpenAPI contract. 

If tags and operations both are defined it will validate against the union set of resources.

- **ExcludeTags** (Optional) : **string[]?**    :
This feature for users to store the tag does not need to be validated.
At the same time excludeTag and Tag cannot store, It will generate warning messages regarding it.

- **ExcludeOperations** (Optional) : **string[]?**  :
This feature for users to store the operations that do not need to be validated.
At the same time excludeOperations and  Operations can not store, it will generate warning messages.
Tag feature can store with excludeOperations , that time all the tag operations validate except the exclude operations.
 
- **FailOnErrors** (Optional) : **boolean value**   :
If the user needs to turn off the validation user can put this in to annotation with the value as false.

