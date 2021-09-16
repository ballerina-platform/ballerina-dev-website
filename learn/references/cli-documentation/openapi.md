---
layout: ballerina-cli-documentation-left-nav-pages-swanlake
title: OpenAPI 
description: Check out how the Ballerina OpenAPI tooling makes it easy for users to start developing a service documented in the OpenAPI contract.
keywords: ballerina, programming language, openapi, open api, restful api
permalink: /learn/cli-documentation/openapi/
active: openapi
intro: OpenAPI Specification is a specification that creates a RESTFUL contract for APIs, detailing all of its resources and operations in a human and machine-readable format for easy development, discovery, and integration. Ballerina OpenAPI tooling will make it easy for users to start the development of a service documented in an OpenAPI contract in Ballerina by generating Ballerina service and client skeletons.
redirect_from:
  - /learn/how-to-use-openapi-tools/
  - /learn/how-to-use-openapi-tools
  - /learn/using-the-openapi-tools
  - /swan-lake/learn/using-the-openapi-tools/
  - /swan-lake/learn/using-the-openapi-tools
  - /learn/tooling-guide/cli-tools/openapi
  - /learn/tooling-guide/cli-tools/openapi/
  - /learn/cli-documentation/openapi
---

## Using the Capabilities of the OpenAPI Tools

The OpenAPI tools provide the following capabilities.
 
 1. Generate the Ballerina service stub or client stub for a given OpenAPI definition (use `openapi` command).
 2. Export the OpenAPI definition of a given Ballerina service (use `openapi` command).
 3. Validate service implementation of a given OpenAPI contract (annotate your Ballerina service with `openapi` annotation).
    - The OpenAPI compiler plugin will allow you to validate a service implementation against an OpenAPI contract during
  the compile time.This plugin ensures that the implementation of a service does not deviate from its OpenAPI contract.   

### OpenAPI to Ballerina

```bash
bal openapi -i <openapi-contract-path>
               [--tags: tags list]
               [--operations: operationsID list]
               [--mode service|client ]
               [(-o|--output): output file path]
               [(-n | --nullable)]
               [--license: license file path]
```

* Parameter `openapi-contract-path` specifies the path of the OpenAPI contract file (e.g., `my-api.yaml` or `my-api
.json`) and is mandatory.
* To generate the Ballerina client or service stub with a subset of tags defined in the OpenAPI contract, use the
 options `--tags` and specify the tags you need as specified in OpenAPI definition.
* To generate the Ballerina client or service stub with a subset of operations defined in the OpenAPI contract, use the
  options `--operations` and specify the operations you need as specified in OpenAPI definition.
* The Ballerina files will be generated at the same location OpenAPI command is executed. Optionally, you can point
 another directory location using the optional flag  `(-o|--output)`.
* The OpenAPI to Ballerina Command generates both client and service stub by default. If you need to restrict the
 code generation to client or service stub only, use `--mode` option (see below).

##### Modes

###### 1. Client Mode
If you want to generate the Ballerina client only, you can set the mode as  `client` when running the OpenAPI tool. 
The generated client can be used in your applications to call the service defined in the OpenAPI file. This mode will
 generate tests for the generated remote functions as well.

```bash
bal openapi -i <openapi-contract-path> --mode client [(-o|--output) output file path]
```
###### 2. Service Mode
If you want to generate the Ballerina service only, you can set the mode as `service` when running the OpenAPI tool.

```bash
bal openapi -i <openapi-contract-path> --mode service [(-o|--output) output file path]
```

##### Nullable Flag
This is an optional flag in the OpenAPI to Ballerina command. If your OpenAPI specification includes JSON schema
properties that are not marked as `nullable:true`, they may return as null in some responses. It will result a JSON
schema to Ballerina record data binding error. If you suspect this can happen for any property, it is safe to 
 generate all data types in the generated record with Ballerina nil support by turing on this flag.

```bash
bal openapi -i <openapi-contract-path> [(-n| --nullable)]
```

##### License 
If you want to generate the Ballerina files with the given copyright or license header, you can use this `--license
` flag with your copyright text.

```bash
bal openapi -i <openapi-contract-path> [--license <license-file-path>]
```
### Ballerina to OpenAPI

#### Generating the Service for OpenAPI Export

```bash
bal openapi -i <ballerina-file-path>  [(-o|--output) output openapi file path]
```

Export the Ballerina service to an  OpenAPI Specification 3.0 definition. For the export to work properly, the input Ballerina service should be defined using the basic service and resource-level HTTP annotations.

If you need to document an OpenAPI contract for only one given service, then use this command.

```bash
bal openapi -i <ballerina-file-path> (-s | --service) <service-name>
```

### Samples for OpenAPI Commands

#### Generating the Service and Client Stub from OpenAPI

```bash
bal openapi -i hello.yaml
```

This will generate a Ballerina service and client stub for the `hello.yaml` OpenAPI contract named `hello-service` and client named `client`. The above command can be run from anywhere on the execution path. It is not mandatory to run it from within a Ballerina project.

Output:

```bash
The service generation process is complete. The following files were created.
-- hello-service.bal
-- client.bal
-- types.bal
-- tests
     |- tests.bal
```
#### Generating the Service and Client Stub from OpenAPI with License 

```bash
bal openapi -i hello.yaml --license license.txt
```

#### Generating the Ballerina Records from OpenAPI Schema with Ballerina Nil Support for Record Fields  

```bash
bal openapi -i hello.yaml --nullable
```

#### Generating an OpenAPI Contract from a Service

 ```bash
bal openapi -i modules/helloworld/helloService.bal
  ```

This will generate the OpenAPI contracts for the Ballerina services, which are in the `hello.bal` Ballerina file.

 ```bash 
bal openapi -i modules/helloworld/helloService.bal (-s | --service) helloworld
  ```

This command will generate the `helloworld-openapi.yaml` file that is related to the `helloworld` service inside the `helloService.bal` file.
 ```bash
bal openapi -i modules/helloworld/helloService.bal --json
  ```
This `--json` option can be used with the Ballerina to OpenAPI command to generate the `helloworld-openapi.json` file 
instead of generating the YAML file.

## OpenAPI Validator Compiler Plugin

The OpenAPI Validator Compiler plugin validates a service against a given OpenAPI contract. The Compiler Plugin is activated if a service has the `openapi:ServiceInfo` annotation. This plugin compares the service and the OpenAPI contract and validates both against a pre-defined set of validation rules. If any of the rules fail, the plugin will give the result as one or more compilation errors.

### Annotation for Validator Plugin 

The `@openapi:ServiceInfo` annotation is used to bind the service with an OpenAPI Contract. You need to add this annotation to the service file with the required values for enabling the validations. 

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

#### Annotation Support for Attributes

- **Contract** (Required) : **string**  :

Here, you can provide a path to the OpenAPI contract as a string and the OpenAPI file can either be `.yaml` or `.json`. This is a required attribute.

- **Tag** (Optional) : **string[]?**     :

The compiler will only validate resources against operations, which are tagged with a tag specified in the list. If not specified, the compiler will validate resources against all the operations defined in the OpenAPI contract. 

- **Operations** (Optional): **string[]?**  :

Should contain a list of operation names that need to be validated against the resources in the service. If not specified, the compiler will validate resources against all the operations defined in the OpenAPI contract. If both tags and operations are defined, it will validate against the union set of the resources.

- **ExcludeTags** (Optional) : **string[]?**    :

This feature is for users to store the tag. It does not need to be validated. At the same time, the `excludeTag` and `Tag` cannot store and the plugin will generate warning messages regarding
 it.

- **ExcludeOperations** (Optional) : **string[]?**  :

This feature is for users to store the operations that do not need to be validated.
At the same time, the `excludeOperations` and  `Operations` can not store and they will generate warning messages.

The `Tag` feature can store with `excludeOperations`. Then, all the tag operations will be validated except the `exclude`operations.
 
- **FailOnErrors** (Optional) : **boolean value**   :

If you need to turn off the validation, add this to the annotation with the value as `false`.
