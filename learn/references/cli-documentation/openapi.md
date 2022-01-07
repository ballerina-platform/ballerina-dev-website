---
layout: ballerina-cli-documentation-left-nav-pages-swanlake
title: Ballerina OpenAPI Support 
description: Check out how the Ballerina OpenAPI tooling makes it easy for users to start developing a service documented in the OpenAPI contract.
keywords: ballerina, programming language, openapi, open api, restful api
permalink: /learn/cli-documentation/openapi/
active: openapi
intro: OpenAPI Specification is a specification that creates a RESTFUL contract for APIs, detailing all of its resources and operations in a human and machine-readable format for easy development, discovery, and integration. Ballerina OpenAPI tooling will make it easy for users to start the development of a service documented in an OpenAPI contract in Ballerina by generating Ballerina service and client skeletons. It supports the user to take the code first API design approach by generating an OpenAPI contract for the given service implementation.
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
 
 Prerequisite : Download and install the latest Ballerina version from [here](https://ballerina.io/downloads/).

## Generate service from OpenAPI (Design-First)

The Design First approach advocates for designing the API’s contract first before writing any code. If you want to generate the Ballerina service only, you can use the below CLI command in the OpenAPI tool.
```bash
$ bal openapi -i <openapi contract> --mode service
```
This generated service can be used as a code template to start the service implementation.

Example: 
```bash
$ bal openapi -i hello.yaml --mode service
```

This will generate a Ballerina service for the `hello.yaml` OpenAPI contract named `hello-service` and schemas named types. The above command can be run from anywhere on the execution path. It is not mandatory to run it from within a Ballerina project.

```bash
The service generation process is complete. The following files were created.
-- hello-service.bal
-- types.bal
```
#### Generate service by tags
To generate the Ballerina service stub with a subset of tags defined in the OpenAPI contract, use the options `--tags` and specify the tags you need as specified in the OpenAPI definition.
```bash
$ bal openapi -i <openapi contract> [--tags <"tag1","tag2">]
```

**Example :**
```bash
$ bal openapi -i hello.yaml --tags "pets", "list"
```
Once you execute the command, only the operations related to given tags will include in generated service file.

**See more command options :** 
[OpenAPI to Ballerina Command Reference](#openapi-to-ballerina-command-reference)

## Export OpenAPI from a service (Code-First)

In code first, based on the business plan, You developer can implement your Ballerina APIs directly, then you can convert your APIs into a human-readable or machine-readable document such as OpenAPI documents later by using the below the Ballerina to OpenAPI command.

### Using the Ballerina to OpenAPI CLI tool
Export the Ballerina service to an OpenAPI Specification 3.0 definition. For the export to work properly, the input Ballerina service should be defined using the basic service and resource-level HTTP annotations.
```bash
$ bal openapi [-i | --input] <ballerina-service-file-path> [(-o | --output) <output-location>]
```
Parameter **ballerina-service-file-path** specifies the path of the ballerina service file (e.g., my-api.bal) and is mandatory.
If your Ballerina file include multiple services, this command generates OpenAPI contract for each service in the Ballerina file.

### Generating OpenAPI specification with `json` format
Use `--json` flag If you need the Ballerina service to OpenAPI output as JSON. The default is YAML.
```bash
$ bal openapi -i <ballerina resource file> [--json]
```
### Generating OpenAPI specification for given service
If you need to document an OpenAPI contract for only one given service, then use this command. Use service name as the service `absolute-resource-path`.

```bash
$ bal openapi -i <ballerina resource file> [-s|--service] <service-name>
```
**Example :**
```bash
$ bal openapi -i helloService.bal
```
This will generate the OpenAPI contracts for the Ballerina services, which are in the `helloService.bal` Ballerina file.

```bash
$ bal openapi -i helloService.bal -s "/hello"
```

This will generate the OpenAPI contracts for the Ballerina service which absolute-resource-path is `/hello`, which are in the `helloService.bal` Ballerina file.

### Generate your OpenAPI contract with the given title and version

You can use annotation for storing title and version information about generated OpenAPI contract in ballerina to OpenAPI tool.
```ballerina
    @openapi:ServiceInfo{
    [contract: "/path/to/openapi.json|yaml"],
    [ title : "store" ],
    [ ‘version: "0.1.0"]
    }
```
- **Contract (Optional) : string?** :
Here, you can provide a path to the OpenAPI contract as a string and the OpenAPI file can either be `.yaml` or `.json`. This is an optional attribute. When you use Ballerina to OpenAPI tool it will provide attached openapi contract as output for a given service.
- **Title (Optional) : string?** :
This is an optional attribute. You can use this to add the title for the generated OpenAPI contract info section.
- **Version (Optional) : string?** :
This is an optional attribute. You can use this to add the version for the generated OpenAPI contract info section.

**Example**
**Ballerina service file with OpenAPI annotation**
```ballerina
 @openapi:ServiceInfo{
     title : "Store Management APIs" ,
     ‘version: "1.1.0" 
   }
service greet on new http:Listener(9090) {
    ...
}
```
**Generated OpenAPI contract with given details**
```openapi
openapi: 3.0.1
info:
  title: Store Management APIs
  version: 1.1.0
...
```

## Keep your implementation and definition in sync with the OpenAPI validator
## Generate client from OpenAPI specification
If you want to generate the Ballerina client only, you can set the mode as the client when running the OpenAPI tool. The generated client can be used in your applications to call the service defined in the OpenAPI file.

- **Note :** Before generating a client using the command-line tool, please check if a pre-generated client exists in [ballerina central](https://central.ballerina.io/). If found, you can find more information on how to use the client in your code by referring to the API documentation.
```bash
$ bal openapi -i <openapi contract> --mode client
```
Example :
```bash
$ bal openapi -i hello.yaml --mode client
```
This will generate a Ballerina client stub for the `hello.yaml` OpenAPI contract named `client` , util file (utils.bal) for relevant utils methods related client stub, and schemas named types. The above command can be run from anywhere on the execution path. It is not mandatory to run it from within a Ballerina project.

```bash
Client generated successfully. Following files were created. 
-- client.bal
-- types.bal
-- utils.bal
```
### Generate client with tests boiler-plates
By providing this flag with client mode can be generated a Ballerina client including boiler-plate test cases for all the client remote functions based on the given OpenAPI contract.
```bash
$ bal openapi -i <openapi contract> [--mode client] [--with-tests]
```

**Example :**
```bash
$ bal openapi -i hello.yaml --mode client --with-tests
```
In addition to above-mentioned generated file in default client generation, this will generate `tests.bal` .

### Generate with nillable types
This is an optional flag in the OpenAPI to Ballerina command. If your OpenAPI specification includes JSON schema properties that are not marked as **nullable:true**, they may return as null in some responses. It will result in a JSON schema to Ballerina record data binding error. If you suspect this can happen for any property, it is safe to generate all data types in the generated record with Ballerina nil support by turning on this flag.
```bash
$ bal openapi -i <openapi contract> [-n |--nullable]
```

**See more command options :**
[OpenAPI to Ballerina Command Reference](#openapi-to-ballerina-command-reference)


## Contribute to WSO2 openapi-connectors repository
If you are willing to see your new client in ballerina central in the future, please follow the below steps and send a GitHub Pull Request.

### **Step 01 :** Set up the prerequisites 
1. Fork and clone the [openapi-connectors](https://github.com/ballerina-platform/openapi-connectors) repository. Connectors generated from the Ballerina OpenAPI tool are managed at this repository. 
2. Set the BALLERINA_HOME environment variable to the ballerina distribution directory. `eg. /usr/lib/ballerina`
### **Step 02 :** Add ballerina client
1. Open the clone repository and navigate to `/openapi` directory.
2. Run `bal new <connector_name> -t lib` to create a new Ballerina package. 
3. Copy the generated files(**client.bal, types.bal, utils.bal**) into the <connector_name> directory. 
4. Run `bal build` to check whether the newly generated connector is compiling successfully. 
5. Run necessary unit tests to verify the functionality of the generated connector. 
6. Add license header at the top of each `.bal` file. 
7. Add Package.md ([guide here](https://github.com/ballerina-platform/ballerina-extended-library/discussions/77)) and Module.md ([guide here](https://github.com/ballerina-platform/ballerina-extended-library/discussions/78))
8. Add connector icon to the root of the connector. Icon needs to be a png of 200x200 px size with name icon.png 
9. Update Ballerina.toml file referring to the [guide here](https://github.com/ballerina-platform/ballerina-extended-library/discussions/72).
### **Step 03:** Send PR to openapi-connectors
1. Run ./gradlew build. 
2. Push the changes and create a Pull Request to the master branch of the `openapi-connectors` repository.

## OpenAPI to Ballerina Command Reference
```bash
bal openapi [-i | --input] <openapi-contract-file-path> 
            [-o | --output] <output-location>
            [--mode <mode-type>]
            [--tags <tag-names>] 
            [--operations <operation-names>] 
            [-n | --nullable]
            [--license] <license-file-path> 
            [--with-tests]
```

- ##### [-i | --input]
Parameter **openapi-contract-path** specifies the path of the OpenAPI contract file (e.g., my-api.yaml or my-api .json) and is mandatory.
- ##### [-o | --output]
The Ballerina files will be generated at the same location OpenAPI command is executed. Optionally, you can point to another directory location using the optional flag `(-o|--output)`.
- ##### --mode
Mode type is optional and can be service or client. The Ballerina service and client will be generated according to the mode. Without `--mode` it will generate both service and client stub for the given openAPI contract.
- ##### --tags
To generate the Ballerina client or service stub with a subset of tags defined in the OpenAPI contract, use the options `--tags` and specify the tags you need as specified in the OpenAPI definition.
```bash
$ bal openapi -i <openapi contract>  [--tags < "tag1","tag2">]
```
- ##### --operations
To generate the Ballerina client or service stub with a subset of operations defined in the OpenAPI contract, use the options `--operations` and specify the operations you need as specified in the OpenAPI definition.
```bash
$ bal openapi -i <openapi contract> [--operations <"op1", "op2">]
```
- ##### --license
If you want to generate the Ballerina files with the given copyright or license header, you can use this `--license` flag with your copyright text.
```bash
$ bal openapi -i <openapi contract> [--license <license-file-path>]
```
- ##### [-n |--nullable]
This is an optional flag in the OpenAPI to Ballerina command. If your OpenAPI specification includes JSON schema properties that are not marked as **nullable:true**, they may return as null in some responses. It will result in a JSON schema to Ballerina record data binding error. If you suspect this can happen for any property, it is safe to generate all data types in the generated record with Ballerina nil support by turning on this flag.
```bash
$ bal openapi -i <openapi contract> [-n |--nullable]
```
- ##### --with-tests
This is optional. Work with the client generation command and generate a test boiler-plate for all the remote functions of the generated client.

## OpenAPI Annotation Reference
The `@openapi:ServiceInfo` annotation support for several usages in the Ballerina OpenAPI tools. It contains attributes `contract` , `tag`, `operations`, `failOnErrors`, `excludeTags`, `excludeOperations`, `title`, `version` and `embed` for each particular purpose.

```ballerina
@openapi:ServiceInfo{
    [contract: “/path/to/openapi.json|yaml”],
    [ tag : “store” ],
    [ operations: [“op1”, “op2”] ], 
    [ failOnErrors]: true/false → default : true,
    [ excludeTags ]: [“pets”, “user”],
    [ excludeOperations: [“op1”, “op2”] ],
    [ title : “store” ],
    [ ‘version: “0.1.0” ],
    [embed: false/true -> default: true]
   }
service greet on new http:Listener(9090) {
    ...
}
```
- ##### Contract (required) : string
Here, you can provide a path to the OpenAPI contract as a string and the OpenAPI file can either be `.yaml` or `.json`. This is a required attribute.
- ##### Tag (optional): string[]?
The compiler will only validate resources against operations, which are tagged with a tag specified in the list. If not specified, the compiler will validate resources against all the operations defined in the OpenAPI contract.
- ##### Operations (optional) : string[]?
Should contain a list of operation names that need to be validated against the resources in the service. If not specified, the compiler will validate resources against all the operations defined in the OpenAPI contract. If both tags and operations are defined, it will validate against the union set of the resources.
- ##### ExcludeTags (optional): string[]?
This feature is for users to store the tag. It does not need to be validated.
- ##### ExcludeOperations (optional): string[]?
This feature is for users to store the operations that do not need to be validated.
- ##### FailOnErrors (optional) : boolean?
If you need to turn off the validation, add this to the annotation with the value as false.
- ##### Title (optional) : string?
This is an optional attribute. You can use this to add the title for the generated OpenAPI contract info section.
- ##### Version (optional) : string?
This is an optional attribute. You can use this to add the version for the generated OpenAPI contract info section.
- ##### Embed (optional) : string?
If you need to turn off the generating OpenAPI documentation for service for introspection endpoint support, use this attribute with false in the annotation.
