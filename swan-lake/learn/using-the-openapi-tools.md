---
layout: ballerina-left-nav-pages
title: Using the OpenAPI Tools
description: Check out how the Ballerina OpenAPI tooling makes it easy for users to start developing a service documented in the OpenAPI contract.
keywords: ballerina, programming language, openapi, open api, restful api
permalink: /swan-lake/learn/using-the-openapi-tools/
active: using-the-openapi-tools
intro: OpenAPI Specification is a specification that creates a RESTFUL contract for APIs, detailing all of its resources and operations in a human and machine-readable format for easy development, discovery, and integration. Ballerina OpenAPI tooling will make it easy for users to start development of a service documented in OpenAPI contract in Ballerina by generating Ballerina service and client skeletons.
redirect_from:
  - /swan-lake/learn/how-to-use-openapi-tools/
  - /swan-lake/learn/how-to-use-openapi-tools
  - /swan-lake/learn/using-the-openapi-tools
---

## Using the Capabilities of the OpenAPI Tools

The OpenAPI tools provide the following capabilities.
 
 1. Generate the Ballerina service or client code for a given OpenAPI definition. 
 2. Export the OpenAPI definition of a Ballerina service.
 3. Validate service implementation of a given OpenAPI Contract.
    
The `openapi` command in Ballerina is used for OpenAPI to Ballerina and Ballerina to OpenAPI code generations. 
Code generation from OpenAPI to Ballerina can produce `ballerina service stubs` and `ballerina client stubs`.
The OpenAPI compiler plugin will allow you to validate a service implementation against an OpenAPI contract during
 compile time. 
This plugin ensures that the implementation of a service does not deviate from its OpenAPI contract.   

### OpenAPI to Ballerina
#### Generate Service and Client Stub from an OpenAPI Contract

```bash
ballerina openapi   -i <openapi-contract> 
               [--service-name: generated files name]
               [--tags: tags list]
               [--operations: operationsID list]
               [--mode service|client ]
               [(-o|--output): output file path]
```
Generates both the Ballerina service and Ballerina client stub for a given OpenAPI file.

This `-i <openapi-contract>` parameter of the command is mandatory. As an input, it will take the path to the OpenAPI
 contract file (i.e., `my-api.yaml` or `my-api.json`). 

The `--service-name`  is an optional parameter, which allows you to change the generated service name.

You can give the specific tags and operations that you need to document as services without documenting all the operations using these optional `--tags` and `--operations` commands.

`(-o|--output)` is an optional parameter. You can use this to give the output path for the generated files.
If not, it will take the execution path as the output path.

##### Modes
If you  want to generate a Service only, you can set the mode as `service` in the OpenAPI tool.

```bash
ballerina openapi   -i <openapi-contract> --mode service
                               [(-o|--output) output file path]
```

If you want to generate a Client only, you can set the mode as  `client` in the OpenAPI tool. 
This client can be used in client applications to call the service defined in the OpenAPI file.

```bash
ballerina openapi   -i <openapi-contract> --mode client
                               [(-o|--output) output file path]
```

### Ballerina to OpenAPI
#### Service to OpenAPI Export
```bash
ballerina openapi   -i <ballerina file> 
                    [(-o|--output) output openapi file path]
```
Export the Ballerina service to an  OpenAPI Specification 3.0 definition. For the export to work properly, 
the input Ballerina service should be defined using the basic service and resource-level HTTP annotations.
If you need to document an OpenAPI contract for only one given service, then use this command.
```bash
    ballerina openapi -i <ballerina file> (-s | --service) <service name>
```

### Samples for OpenAPI Commands
#### Generate Service and Client Stub from OpenAPI
```bash
    ballerina openapi -i hello.yaml
```

This will generate a Ballerina service and client stub for the `hello.yaml` OpenAPI contract 
named `hello-service` and client named `hello-client`. The above command can be run from anywhere on the execution
 path. 
It is not mandatory  to run it from inside the Ballerina project.

Output:
```bash
The service generation process is complete. The following files were created.
-- hello-service.bal
-- hello-client.bal
-- schema.bal
```
#### Generate an OpenAPI Contract from a Service

 ```bash
    ballerina openapi -i src/helloworld/helloService.bal
  ```
This will generate the OpenAPI contracts for the Ballerina services, which are in the `hello.bal` Ballerina file.
 ```bash 
    ballerina openapi -i src/helloworld/helloService.bal (-s | --service) helloworld
  ```
This command will generate the `helloworld-openapi.yaml` file that is related to the `helloworld` service inside the
 `helloService.bal` file.

## OpenAPI Validator Compiler Plugin

The OpenAPI Validator Compiler plugin validates a service again a given OpenAPI contract. 
The Compiler Plugin is activated if a service has the `openapi:ServiceInfo` annotation. This plugin compares 
the service and the OpenAPI Contract and validates both against a pre-defined set of validation rules. 
If any of the rules fail, the plugin will give the result as one or more compilation errors.

### Annotation for Validator Plugin 
The `@openapi:ServiceInfo` annotation is used to bind the service with an OpenAPI Contract. You need to add 
this annotation to the service file with the required values for enabling the validations.  
The following is an example of the annotation usage.
```ballerina
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
#### Annotation Support for the Following Attributes:
- **Contract** (Required) : **string**  :
Here, you can provide a path to the OpenAPI contract as a string and the OpenAPI file can either be `.yaml` or `.json`
This is a required attribute.

- **Tag** (Optional) : **string[]?**     :
The compiler will only validate resources against operations, which are tagged with a tag specified in the list.
If not specified, the compiler will validate resources against all the operations defined in the OpenAPI contract. 

- **Operations** (Optional): **string[]?**  :
Should contain a list of operation names that need to be validated against the resources in the service.
If not specified, the compiler will validate resources against all the operations defined in the OpenAPI contract. If both tags and operations are defined, it will validate against the union set of the resources.

- **ExcludeTags** (Optional) : **string[]?**    :
This feature is for users to store the tag. It does not need to be validated.
At the same time, the `excludeTag` and `Tag` cannot store and the plugin will generate warning messages regarding
 it.

- **ExcludeOperations** (Optional) : **string[]?**  :
This feature is for users to store the operations that do not need to be validated.
At the same time, the `excludeOperations` and  `Operations` can not store and they will generate warning messages.
The `Tag` feature can store with `excludeOperations`. Then, all the tag operations will be validated except the `exclude`
 operations.
 
- **FailOnErrors** (Optional) : **boolean value**   :
If you need to turn off the validation, add this to the annotation with the value as `false`.
