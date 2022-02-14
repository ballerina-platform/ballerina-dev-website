---
layout: ballerina-openapi-support-left-nav-pages-swanlake
title: Ballerina OpenAPI Support 
description: Check out how the Ballerina OpenAPI tooling makes it easy for you to start developing a service documented in an OpenAPI contract.
keywords: ballerina, programming language, openapi, open api, restful api
permalink: /learn/ballerina-openapi-support/
active: openapi
intro: OpenAPI Specification is a specification that creates a RESTFUL contract for APIs by detailing all of its resources and operations in a human and machine-readable format for easy development, discovery, and integration. Ballerina OpenAPI tooling will make it easy for you to start the development of a service documented in an OpenAPI contract in Ballerina by generating a Ballerina service and client skeletons. It enables you to take the code-first API design approach by generating an OpenAPI contract for the given service implementation.
redirect_from:
  - /learn/how-to-use-openapi-tools/
  - /learn/how-to-use-openapi-tools
  - /learn/using-the-openapi-tools/
  - /learn/using-the-openapi-tools
  - /swan-lake/learn/using-the-openapi-tools/
  - /swan-lake/learn/using-the-openapi-tools
  - /learn/tooling-guide/cli-tools/openapi
  - /learn/tooling-guide/cli-tools/openapi/
  - /learn/ballerina-openapi-support/openapi
  - /learn/cli-documentation/openapi/#using-the-capabilities-of-the-openapi-tools/
  - /learn/cli-documentation/openapi/#using-the-capabilities-of-the-openapi-tools
  - /learn/cli-documentation/openapi/#openapi-validator-compiler-plugin/
  - /learn/cli-documentation/openapi/#openapi-validator-compiler-plugin
  - /learn/cli-documentation/openapi/
  - /learn/cli-documentation/openapi
---

## Using the Capabilities of the OpenAPI Tools

The Ballerina OpenAPI tooling support provides the following capabilities.
 1. Generating Ballerina service/client stubs from a given OpenAPI contract file using the CLI tool.
 2. Exporting the OpenAPI definition from a given Ballerina service implementation using the CLI tool.
 3. Validating the service implementation compliance with a provided OpenAPI contract using the OpenAPI annotation.
    - The OpenAPI compiler plugin will allow you to validate a service implementation against an OpenAPI contract during
  the compile time. This plugin ensures that the implementation of a service does not deviate from its OpenAPI contract. 
    
 > **Prerequisite**: Download and install the Ballerina Swan Lake from [downloads](https://ballerina.io/downloads/).

 > **Note**: Ballerina SwanLake supports OpenAPI Specification version 3.0.0 onwards.

## Generating a Ballerina Service from an OpenAPI Definition (Design-First Approach)

To generate only the Ballerina service, you can use the following CLI command of the OpenAPI tool.
```bash
$ bal openapi -i <openapi-contract> --mode service
```
The generated service can be used as a code template to start the service implementation.

**Example:** 
```bash
$ bal openapi -i hello.yaml --mode service
```

This will generate a Ballerina service in a file named `hello_service.bal` and relevant schemas in a file named `types.bal` for the `hello.yaml` OpenAPI contract as depicted below. The above command can be run from anywhere on the execution path. It is not mandatory to run it from within a Ballerina project.

```bash
The service generation process is complete. The following files were created.
-- hello_service.bal
-- types.bal
```
#### Generating a Ballerina Service from Tags
To generate the Ballerina service stub with a subset of tags defined in an OpenAPI contract, use the `--tags` option and specify the tags you need as specified in the OpenAPI definition.
```bash
$ bal openapi -i <openapi-contract> [--tags <"tag1","tag2">]
```

**Example:**
```bash
$ bal openapi -i hello.yaml --tags "pets", "list"
```
Once you execute the command, only the operations related to the given tags will be included in the generated service file.

>**Info:** For more command options, see
[OpenAPI to Ballerina Command Reference](#openapi-to-ballerina-command-reference)

## Exporting an OpenAPI Contract from a Ballerina Service (Code-First Approach)

You can convert your Ballerina service APIs into human-readable or machine-readable documents such as OpenAPI documents by using the Ballerina to OpenAPI command as follows.

#### Using the Ballerina to OpenAPI CLI Tool
Export the Ballerina service to an OpenAPI Specification 3.0.0 definition. For the export to work properly, the input Ballerina service should be defined using the basic service and resource-level HTTP annotations.

```bash
$ bal openapi [-i | --input] <ballerina-service-file-path> [(-o | --output) <output-location>]
```
Parameter `ballerina-service-file-path` specifies the path of the ballerina service file (e.g., `my_api.bal`) and is mandatory.
If your Ballerina file includes multiple services, this command generates the OpenAPI contract for each service in the Ballerina file.

#### Generating an OpenAPI Specification in JSON Format
Use the `--json` flag If you need the Ballerina service to OpenAPI output in JSON. The default is YAML.
```bash
$ bal openapi -i <ballerina-resource-file> [--json]
```
#### Generating an OpenAPI Specification for a Given Service
If you need to document an OpenAPI contract for only one given service, then use the following command, specifying the service name as the `absolute-resource-path`.

```bash
$ bal openapi -i <ballerina-resource-file> [-s|--service] <service-name>
```
**Example:**
```bash
$ bal openapi -i helloService.bal
```
This will generate the OpenAPI contracts for the Ballerina services in the `hello_service.bal` Ballerina file.

```bash
$ bal openapi -i helloService.bal -s "/hello"
```

This will generate the OpenAPI contracts for the Ballerina service in the `hello_service.bal` Ballerina file
of which the `absolute-resource-path` is `/hello`. 
#### Generating the OpenAPI Contract with a Given Title and Version

You can use an annotation for specifying the title and version information of the OpenAPI contract as follows.  
```ballerina
@openapi:ServiceInfo {
    [contract: "/path/to/openapi.json|yaml"],
    [title: "Store Management"],
    ['version: "0.1.0"]
}    
```
- **Contract: string?** :
A path to the OpenAPI contract as a string and the OpenAPI file can either be `.yaml` or `.json`. This is an optional attribute. When you use the Ballerina to OpenAPI tool, it will provide an attached OpenAPI contract as the output for a given service. If this attribute is not provided, then the tool generates an OpenAPI Specification(OAS) contract for the given Ballerina file content.
- **Title: string?** :
This is an optional attribute. You can use this to add the title of the `info` section in the generated OpenAPI contract. If this attribute is not provided, then the tool takes the absolute base path as the title to the OAS contract.
- **Version: string?** :
This is an optional attribute. You can use this to add the version of the `info` section in the generated OpenAPI contract. If this attribute is not provided, then the tool picks the Ballerina package version as the OAS version.

**Example:**

**Ballerina service file with the OpenAPI annotation**
```ballerina
@openapi:ServiceInfo {
    title: "Store Management APIs",
    'version: "1.1.0"
}
service /greet on new http:Listener(9090) {
...
}
```
**Generated OpenAPI contract with the given details**
```openapi
openapi: 3.0.1
info:
  title: Store Management APIs
  version: 1.1.0
...
```

## OpenAPI Validator Compiler Plugin

The OpenAPI Validator Compiler plugin validates a service against a given OpenAPI contract. The Compiler Plugin gets activated if a service has the `@openapi:ServiceInfo` annotation. This plugin compares the service and the OpenAPI contract and validates both against a pre-defined set of validation rules. If any of the rules fail, the plugin provides compilation errors.
#### Annotation for Validator Plugin
The `@openapi:ServiceInfo` annotation is used to bind the service with an OpenAPI contract. You need to add this annotation to the service file with the required values for enabling the validations.
>**Note:** Providing a `contract` path attribute is mandatory for the OpenAPI validator.

The following is an example of the annotation usage in the Ballerina file.
```ballerina
import ballerina/openapi;

@openapi:ServiceInfo {
    contract: "/path/to/openapi.json|yaml",
    [tags: "store"],
    [operations: ["op1", "op2"]],
    [failOnErrors: true/false → default: true],
    [excludeTags: ["pets", "user"]],
    [excludeOperations: ["op1", "op2"]]
}
service /greet on new http:Listener(9090) {
  ...
}
```

For annotation attributes details, see [OpenAPI annotation reference](#openapi-annotation-reference).

## Generating a Ballerina Client from an OpenAPI Definition
The generated client can be used in your applications to call the service defined in the OpenAPI file. If you want to generate only the Ballerina client, you can set the `mode` as the `client` when running the OpenAPI tool. 

- **Note :** Before generating your client using the command-line tool, please check if a pre-generated client for your API already exists in the [Ballerina Central](https://central.ballerina.io/). (If so, you can refer to the client's API documentation for more information on how to use the pre-generated client in your code.)

```bash
$ bal openapi -i <openapi-contract> --mode client
```
**Example:**
```bash
$ bal openapi -i hello.yaml --mode client
```
This will generate a Ballerina client stub (`client.bal`), a util file (`utils.bal`) for the relevant utils methods related to the client stub, and a schemas file (`types.bal`) for the `hello.yaml` OpenAPI contract. The above command can be run from anywhere on the execution path. It is not mandatory to run it from within a Ballerina project.

```bash
Client generated successfully. The following files were created. 
-- client.bal
-- types.bal
-- utils.bal
```
#### Generating a Ballerina Client with Boiler-Plate Tests
Use the `--with-tests` flag in the client mode to generate a Ballerina client with boilerplate test cases for all the remote functions available in it.
```bash
$ bal openapi -i <openapi-contract> [--mode client] [--with-tests]
```

**Example:**
```bash
$ bal openapi -i hello.yaml --mode client --with-tests
```
In addition to the above-mentioned generated file, this will generate a `test.bal` file in the default client generation.

#### Generating with Nillable Types
This is an optional flag in the OpenAPI to Ballerina command. If your OpenAPI specification includes JSON schema properties that are not marked as **nullable:true**, they may be returned as null in some responses which will result in a JSON schema to Ballerina record data binding error. If you suspect this can happen for any property, it is safe to generate all data types in the generated record with Ballerina nil support by turning this flag on.
```bash
$ bal openapi -i <openapi-contract> [-n |--nullable]
```

>**Info:** For more command options, see [OpenAPI to Ballerina Command Reference](#openapi-to-ballerina-command-reference).

## Contributing to the WSO2 `openapi-connectors` Repository
To see your new client in Ballerina central in the future, follow the steps below and send a GitHub Pull Request.

#### **Step 01 :** Set up the Prerequisites 
1. Fork and clone the [`openapi-connectors`](https://github.com/ballerina-platform/openapi-connectors) repository. Connectors generated from the Ballerina OpenAPI tool are managed in this repository.

#### **Step 02 :** Add the Ballerina client
1. Open the cloned repository and navigate to the `/openapi` directory.
2. Run the `bal new <connector_name> -t lib` command to create a new Ballerina package. 
3. Copy the [generated files](#generating-a-ballerina-client-from-an-openapi-definition)(**client.bal, types.bal, utils.bal**) into the `<connector_name>` directory. 
4. Run the `bal build` command to check whether the newly-generated connector is compiling successfully. 
5. Run the necessary unit tests to verify the functionality of the generated connector. 
6. Add the license header at the top of each `.bal` file. 
7. Add the [`Package.md`](https://github.com/ballerina-platform/ballerina-extended-library/discussions/77) and [`Module.md`](https://github.com/ballerina-platform/ballerina-extended-library/discussions/78) files.
8. Add a connector icon to the root of the connector. The icon needs to be a `.png` of 200x200 px size named as `icon.png`. 
9. Update the [`Ballerina.toml` file](https://github.com/ballerina-platform/ballerina-extended-library/discussions/72).

#### **Step 03:** Send a PR to the `openapi-connectors` Repository
1. Run the `./gradlew build` command. 
2. Push the changes and create a Pull Request to the master branch of the `openapi-connectors` repository.

## OpenAPI to Ballerina Command Reference
```bash
bal openapi [-i | --input] <openapi-contract-file-path> 
            [-o | --output] <output-location>
            [--mode] <mode-type>
            [--tags] <tag-names> 
            [--operations] <operation-names> 
            [-n | --nullable]
            [--license] <license-file-path> 
            [--with-tests]
```

- ##### `-i | --input`
The `openapi-contract-path` parameter specifies the path of the OpenAPI contract file (e.g., `my-api.yaml` or `my-api.json`) and is mandatory.
- ##### `-o | --output`
The Ballerina files will be generated at the same location from which the OpenAPI command is executed. Optionally, you can point to another directory location by using the optional flag `(-o|--output)`.
- ##### `--mode`
Mode type is optional and can be either a service or client. The Ballerina service and client will be generated according to the mode. Without the `--mode`, it will generate both service and client stubs for the given OpenAPI contract.
- ##### `--tags`
To generate the Ballerina client or service stub with a subset of tags defined in the OpenAPI contract, use the `--tags` option and specify the tags you need as specified in the OpenAPI definition.
```bash
$ bal openapi -i <openapi-contract>  [--tags < "tag1","tag2">]
```
- ##### `--operations`
To generate the Ballerina client or service stub with a subset of operations defined in the OpenAPI contract, use the `--operations` option and specify the operations you need as specified in the OpenAPI definition.
```bash
$ bal openapi -i <openapi-contract> [--operations <"op1", "op2">]
```
- ##### `--license`
To generate the Ballerina files with the given copyright or license header, you can use this `--license` flag with your copyright text.
```bash
$ bal openapi -i <openapi-contract> [--license <license-file-path>]
```
- ##### `-n |--nullable`
This is an optional flag in the OpenAPI to Ballerina command. If your OpenAPI specification includes JSON schema properties that are not marked as **nullable:true**, they may return as null in some responses. It will result in a JSON schema to Ballerina record data binding error. If you suspect this can happen for any property, it is safe to generate all data types in the generated record with Ballerina nil support by turning on this flag.
```bash
$ bal openapi -i <openapi-contract> [-n |--nullable]
```
- ##### `--with-tests`
This is optional. It works with the client generation command and generates a boiler-plate test for all the remote functions of the generated client.

## OpenAPI Annotation Reference
The `@openapi:ServiceInfo` annotation supports several usages in the Ballerina OpenAPI tool. It contains attributes such as `contract` , `tags`, `operations`, `failOnErrors`, `excludeTags`, `excludeOperations`, `title`, `version`, and `embed` for each particular purpose. These attributes are optional to be used in the annotation.

```ballerina
@openapi:ServiceInfo {
    [contract: "/path/to/openapi.json|yaml"],
    [tags: "store"],
    [operations: ["op1", "op2"]],
    [failOnErrors: true/false → default: true],
    [excludeTags: ["pets", "user"]],
    [excludeOperations: ["op1", "op2"]],
    [title: "store"],
    ['version: "0.1.0"],
    [embed: false/true → default:true]
}
service /greet on new http:Listener(9090) {
   ...
}
```
- ##### `Contract: string?`
Here, you can provide a path to the OpenAPI contract as a string and the OpenAPI file can either be a `.yaml` or `.json`. 
- ##### `Tags: string[]?`
The compiler will only validate resources against operations, which are tagged with a tag specified in the list. If not specified, the compiler will validate resources against all the operations defined in the OpenAPI contract.
- ##### `Operations: string[]?`
This should contain a list of operation names that need to be validated against the resources in the service. If not specified, the compiler will validate resources against all the operations defined in the OpenAPI contract. If both tags and operations are defined, it will validate against the union set of the resources.
- ##### `ExcludeTags: string[]?`
This stores the tags that do not need to be validated. The annotation can not have both the `excludeTags` and `Tags` attributes at the same time. 
- ##### `ExcludeOperations: string[]?`
This specifies the operations that do not need to be validated.
- ##### `FailOnErrors: boolean?`
To turn off the validation, add this to the annotation with the value as `false`.
- ##### `Title: string?`
Use this to add the title of the `info` section in the generated OpenAPI contract.
- ##### `Version: string?`
Use this to add the version of the `info` section in the generated OpenAPI contract.
- ##### `Embed: string?`
To turn off generating OpenAPI documentation for service for introspection endpoint support, use this attribute with `false` in the annotation.
