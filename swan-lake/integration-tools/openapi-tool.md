---
layout: ballerina-openapi-support-left-nav-pages-swanlake
title: OpenAPI tool
description: Check out how the Ballerina OpenAPI tool makes it easy for you to start developing a service documented in an OpenAPI contract.
keywords: ballerina, programming language, openapi, open api, restful api
permalink: /learn/openapi-tool/
active: openapi-tool
intro: OpenAPI Specification is a specification that creates a RESTFUL contract for APIs by detailing all of its resources and operations in a human and machine-readable format for easy development, discovery, and integration. Ballerina Swan Lake supports the OpenAPI Specification version 3.0.0 onwards.
--- 

Ballerina OpenAPI tool makes it easy for you to start the development of a service documented in an OpenAPI contract in Ballerina by generating a Ballerina service and client skeletons. It enables you to take the code-first API design approach by generating an OpenAPI contract for the given service implementation.

## Usage

The Ballerina OpenAPI tool support provides the following capabilities.

 1. Generate Ballerina service/client stubs from a given OpenAPI contract file using the CLI tool.
 2. Export the OpenAPI definition from a given Ballerina service implementation using the CLI tool.
 3. Validate the service implementation compliance with a provided OpenAPI contract using the OpenAPI annotation.
  >**Info:** The OpenAPI compiler plugin allows you to validate a service implementation against an OpenAPI contract during the compile time. This plugin ensures that the implementation of a service does not deviate from its OpenAPI contract. 

### OpenAPI to Ballerina usage

The OpenAPI to Ballerina command supports several usages in the Ballerina OpenAPI tool as follows.

```
$ bal openapi [-i | --input] <openapi-contract-file-path> 
            [-o | --output] <output-location>
            [--mode] <mode-type>
            [--tags] <tag-names> 
            [--operations] <operation-names> 
            [-n | --nullable]
            [--license] <license-file-path> 
            [--with-tests]
            [--status-code-binding]
```

### Ballerina to OpenAPI usage

The Ballerina to OpenAPI command supports several usages in the Ballerina OpenAPI tool as follows.

```
$ bal openapi [-i | --input] <ballerina-service-file-path> [--json]
            [-s | --service] <current-service-name>
            [-o | --output] <output-location>
```

## Command options

The below command-line arguments can be used with the command.

### OpenAPI to Ballerina command options

The command-line arguments below can be used with the command for each particular purpose as described below. 

| Command option      | Description                                                                                                                                                                                                                                                                                                                                                                     | Mandatory/Optional |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| `-i \| --input`   | The `openapi-contract-path` command option specifies the path of the OpenAPI contract file (e.g., `my-api.yaml` or `my-api.json`).                                                                                                                                                                                                                                                                                                                                         | Mandatory          |
| `-o \| --output`  | The Ballerina files are generated at the same location from which the `bal openapi` command is executed. You can point to another directory location by using the `(-o\|--output).` flag.                                                                                                                                                                                                                                                                                                        | Optional          |
| `--mode`          | Mode type can be either a service or client. The Ballerina service and client are generated according to the mode. Without the `--mode`, it generates both service and client stubs for the given OpenAPI contract.                                                                                                                                                                                                                                                                                                 | Optional          |
| `--tags`          | To generate the Ballerina client or service stub with a subset of tags defined in the OpenAPI contract, use the `--tags` option and specify the tags you need as specified in the OpenAPI definition.<br><br>**E.g.,** `bal openapi -i <openapi-contract>  [--tags < "tag1","tag2">]`                                                                                                                                                                                                              |  Optional        |
| `--operations`    | To generate the Ballerina client or service stub with a subset of operations defined in the OpenAPI contract, use the `--operations` option and specify the operations you need as specified in the OpenAPI definition.<br><br>**E.g.,** `bal openapi -i <openapi-contract> [--operations <"op1", "op2">]`                                                                                                                                                                                                              |  Optional        |
| `--license`       | To generate the Ballerina files with the given copyright or license header, you can use this `--license` flag with your copyright text.<br><br>**E.g.,** `bal openapi -i <openapi-contract> [--license <license-file-path>]`                                                                                                                                                                                                                                                                                                         |  Optional         |
| `-n \|--nullable` | If your OpenAPI specification includes JSON schema properties that are not marked as `nullable:true`, they may return as null in some responses. It results in a JSON schema to Ballerina record data binding error. If you suspect this can happen for any property, it is safe to generate all data types in the generated record with Ballerina nil support by turning on this flag.<br><br>**E.g.,** `bal openapi -i <openapi-contract> [-n \|--nullable]`                          | Optional          |
| `--with-tests`    | It works with the client generation command and generates a boiler-plate test for all the remote methods of the generated client.                                                                                                                                                                                                                                                                                                                                                                                              | Optional          |
| `--client-methods`| This option can be used in the client generation to select the client method type, which can be `resource` or `remote`. (The default option is `resource`).                                                                                                                                                                                                                                                                                                                                                                                           |  Optional         |
| `--status-code-binding`| This option can be used in the client generation to generate the client methods with status code response binding.                                                                                                                                                                                                                                                                                                                                                                                           |  Optional         |

### Ballerina to OpenAPI command options

The command-line arguments below can be used with the command for each particular purpose as described below.

| Command option      | Description                                                                                                                                                                                                                                                                                                                                                                     | Mandatory/Optional |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| `-i \|--input`    | The `ballerina-service-file-path` command option specifies the path of the Ballerina service file (e.g., `my-service.bal`).                                                  | Mandatory          |
| `--json`          | Generate the Ballerina service to OpenAPI output as JSON. The default is YAML.                                                                                                           | Optional          |
| `-s \| --service` | This service name is used to identify the service that needs to be documented as an OpenAPI specification.                                                                               | Optional          |
| `-o\|--output`    | Location of the generated OpenAPI specification. If this path is not specified, the output is written to the same directory from which the command is run.                          | Optional          |

## Generate Ballerina services from OpenAPI Contracts 

If you are an API developer who prefers the **design-first approach**, you can use an existing or your OpenAPI definition to generate Ballerina services using the `bal openapi` CLI command as follows.

```
$ bal openapi -i <openapi-contract> --mode service
```

The generated service can be used as a code template to start the service implementation.

For example,

```
$ bal openapi -i hello.yaml --mode service
```

This generates a Ballerina service in a file named `hello_service.bal` and relevant schemas in a file named `types.bal` for the `hello.yaml` OpenAPI contract as depicted below. The above command can be run from anywhere on the execution path. It is not mandatory to run it from within a Ballerina package.

```
The service generation process is complete. The following files were created.
-- hello_service.bal
-- types.bal
```

### Generate from tags

To generate the Ballerina service stub with a subset of tags defined in an OpenAPI contract, use the `--tags` option and specify the tags you need as specified in the OpenAPI definition.

```
$ bal openapi -i <openapi-contract> [--tags <"tag1","tag2">]
```

For example, 

```
$ bal openapi -i hello.yaml --tags "pets", "list"
```

Once you execute the command, only the operations related to the given tags get included in the generated service file.

## Export OpenAPI contracts from Ballerina services

If you prefer to follow the **code-first approach**, you can convert your Ballerina service APIs into human-readable or machine-readable documents such as OpenAPI documents by using the Ballerina to OpenAPI CLI Tool as follows.

Export the Ballerina service to an OpenAPI Specification 3.0.0 definition. For the export to work properly, the input Ballerina service should be defined using the basic service and resource-level HTTP annotations.

```
$ bal openapi [-i | --input] <ballerina-service-file-path> [(-o | --output) <output-location>]
```

The `ballerina-service-file-path` command option specifies the path of the ballerina service file (e.g., `my_api.bal`) and is mandatory.

If your Ballerina file includes multiple services, this command generates the OpenAPI contract for each service in the Ballerina file.

### Export in JSON format

Use the `--json` flag If you need the Ballerina service to OpenAPI output in JSON. The default is YAML.

```
$ bal openapi -i <ballerina-resource-file> [--json]
```

### Export for a specific service

If you need to document an OpenAPI contract for only one given service (when there are multiple), use the following command, specifying the service name as the `absolute-resource-path`.

```
$ bal openapi -i <ballerina-resource-file> [-s|--service] <service-name>
```

For example,

```
$ bal openapi -i helloService.bal
```

This generates the OpenAPI contracts for the Ballerina services in the `hello_service.bal` Ballerina file.

```
$ bal openapi -i helloService.bal -s "/hello"
```

This generates the OpenAPI contracts for the Ballerina service in the `hello_service.bal` Ballerina file
of which the `absolute-resource-path` is `/hello`. 
### Export with a given title and version

You can use the `@openapi:ServiceInfo` annotation for specifying the title and version information of the OpenAPI contract as follows.



```ballerina
@openapi:ServiceInfo {
    contract: "/path/to/openapi.json|yaml",
    title: "Store Management",
    'version: "0.1.0"
}    
```
>**Info:** These `contract`, `title`, and `'version` are all optional attributes and can be used as described below.

| Command option      | Description                                                                                                                                                                                                                                                                                                                                                                     | Mandatory/Optional |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| `Contract: string?` | A path to the OpenAPI contract as a string and the OpenAPI file can either be `.yaml` or `.json`. When you use the Ballerina to OpenAPI tool, it provides an attached OpenAPI contract as the output for a given service. If this attribute is not provided, then the tool generates an OpenAPI Specification(OAS) contract for the given Ballerina file content.                          | Optional          |
| `Title: string?`    | You can use this to add the title of the `info` section in the generated OpenAPI contract. If this attribute is not provided, then the tool takes the absolute base path as the title to the OAS contract.                                                                                                                                                                                                                    | Optional          |
| `Version: string?`  | You can use this to add the version of the `info` section in the generated OpenAPI contract. If this attribute is not provided, then the tool picks the Ballerina package version as the OAS version.                                                                                                                                                                                                                         | Optional          |

For example,

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

## OpenAPI validator compiler plugin

The OpenAPI Validator Compiler plugin validates a service against a given OpenAPI contract. The Compiler Plugin gets activated if a service has the `@openapi:ServiceInfo` annotation. This plugin compares the service and the OpenAPI contract and validates both against a pre-defined set of validation rules. If any of the rules fail, the plugin provides compilation errors.

The `@openapi:ServiceInfo` annotation is used to bind the service with an OpenAPI contract. You need to add this annotation to the service file with the required values for enabling the validations.

>**Note:** Providing a `contract` path attribute is mandatory for the OpenAPI validator. The other attributes are optional.

The following is an example of the annotation usage in the Ballerina file.

```ballerina
import ballerina/openapi;

@openapi:ServiceInfo {
    contract: "/path/to/openapi.json|yaml",
    tags: ["store"],
    operations: ["op1", "op2"],
    failOnErrors: true # (default value => true),
    excludeTags: ["pets", "user"],
    excludeOperations: ["op1", "op2"]
}
service /greet on new http:Listener(9090) {
  ...
}
```

>**Info:** For annotation attributes details, see [Annotation reference](#annotation-reference).

## Generate Ballerina clients from OpenAPI definitions

The client generated from an OpenAPI definition can be used in your applications to call the service defined in the OpenAPI file. If you want to generate only the Ballerina client, you can set the `mode` as the `client` when running the OpenAPI tool. 

>**Note:** Before generating your client using the command-line tool, please check if a pre-generated client for your API already exists in the <a href="https://central.ballerina.io/" target="_blank">Ballerina Central</a>. (If so, you can refer to the client's API documentation for more information on how to use the pre-generated client in your code.)

```
$ bal openapi -i <openapi-contract> --mode client
```

For example, 

```
$ bal openapi -i hello.yaml --mode client
```
This generates a Ballerina client stub (`client.bal`), a util file (`utils.bal`) for the relevant utils methods related to the client stub, and a schemas file (`types.bal`) for the `hello.yaml` OpenAPI contract. The above command can be run from anywhere on the execution path. It is not mandatory to run it from within a Ballerina package.

```
Client generated successfully. The following files were created. 
-- client.bal
-- types.bal
-- utils.bal
```
### Generate with boiler-plate tests

Use the `--with-tests` flag in the client mode to generate a Ballerina client with boilerplate test cases for all the remote methods available in it.
```
$ bal openapi -i <openapi-contract> [--mode client] [--with-tests]
```

For example,

```
$ bal openapi -i hello.yaml --mode client --with-tests
```
In addition to the above-mentioned generated file, this generates a `test.bal` file in the default client generation.

### Generate with nillable types

>**Info:** This is an optional flag in the OpenAPI to Ballerina command.

If your OpenAPI specification includes JSON schema properties that are not marked as **nullable:true**, they may be returned as null in some responses which results in a JSON schema to Ballerina record data binding error. If you suspect this can happen for any property, it is safe to generate all data types in the generated record with Ballerina nil support by turning this flag on.

```
$ bal openapi -i <openapi-contract> [-n |--nullable]
```

### Generate with a given method type
Use the `--client-methods <resource|remote>` option to select the client method type, which can be `resource` or `remote`. (The default option is `remote`).

```
$ bal openapi -i <openapi-contract> --mode client --client-methods <resource|remote>
```

>**Info:** For more command options, see [OpenAPI to Ballerina CLI options](#openapi-to-ballerina-command-options).

### Automate client generation

#### Update the `Ballerina.toml` file with OpenAPI tool configurations

Adding the following OpenAPI tool configurations to the `Ballerina.toml` file will generate a client during the package build. This eliminates the need to commit the generated code.

> **Info:** It is mandatory to provide `id` and `filePath` attributes for the OpenAPI tool configurations. The other attributes are optional.

The following is an example of the tool configuration usage in the `Ballerina.toml`.

```ballerina
[[tool.openapi]]
id = "client01"
filePath = "./openapi.yaml"
targetModule = "delivery"
options.mode = "client"
options.statusCodeBinding = true
options.tags = ["tag1", "tag2"]
options.operations = ["op1", "op2"]
options.nullable = true # (default value => false)
options.license = "./license.txt"
```

The below tool configuration can be used.

| Command option      | Description                                                                                                                                                                                                                                                                                                                                                                     | Mandatory/Optional |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| `filePath`   | The `filePath` tool option specifies the path of the OpenAPI contract file (e.g., `my-api.yaml` or `my-api.json`).                                                                                                                                                                                                                                                                                                                                         | Mandatory          |
| `id`          | Id for the generated module.                                                                                                                                                                                                                                                                                  | Mandatory        |
| `targetModule`  | The Ballerina files are generated at the given directory name in the Ballerina package.                                                                                                                                                                                                                                                                                     | Optional          |
| `options.mode`          | The supported mode type is `client`. It generates client stubs for the given OpenAPI contract.                                                                                                                                                                                                                                                                                                 | Optional          |
| `options.tags`          | To generate the Ballerina client stub with a subset of tags defined in the OpenAPI contract                                                                                                                                                                                                             |  Optional        |
| `options.operations`    | To generate the Ballerina client stub with a subset of operations defined in the OpenAPI contract, use the `options.operations` option and specify the operations you need as specified in the OpenAPI definition.                                                                                                                                                                                                            |  Optional        |
| `options.license`       | To generate the Ballerina files with the given copyright or license header, you can use this `options.license` option with the path to your copyright text.                                                                                                                                                                                                                                                                                                         |  Optional         |
| `options.nullable` | If your OpenAPI specification includes JSON schema properties that are not marked as `options.nullable=true`, they may return as null in some responses. It results in a JSON schema to Ballerina record data binding error. If you suspect this can happen for any property, it is safe to generate all data types in the generated record with Ballerina nil support by turning on this flag.           | Optional          |
| `options.clientMethods`| This option can be used in the client generation to select the client method type, which can be `resource` or `remote`. (The default option is `resource`).                                                                                                                                                                                                                                                                                                                                                                                           |  Optional         |
| `options.statusCodeBinding`| This option can be used in the client generation to generate the client methods with status code response binding.                                                                                                                                                                                                                                                                                                                                                                                           |  Optional         |


#### Update the Ballerina.toml file with OpenAPI tool configurations using OpenAPI CLI command

Executing the following OpenAPI `add` sub-command, along with the OpenAPI to Ballerina CLI options, will update the `Ballerina.toml` with OpenAPI tool configurations.

```
$ bal openapi add [-i | --input] <openapi-contract-file-path>
                  [--id] <client-id>
                  [--module] <target-module>
                  [--package] <ballerina-package-path>
```

For example,

```
$ bal openapi add -i <openapi-contract> --id <client_id> --module <target-module> --package <ballerina package path> --tags <"tag1","tag2">
```

| Command option      | Description                                                                                                                                                                                                                                                                                                                                                                     | Mandatory/Optional |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| `-i \| --input`   | The `-i\|--input` command option specifies the path of the OpenAPI contract file (e.g., `my-api.yaml` or `my-api.json`).                                                                                                                                                                                                                                                                                                                                         | Mandatory          |
| `--id`          | Id for the generated module | Mandatory          |
| `--module`          | Module name for the generated client stub module (default will be generated directory)|  Optional        |
| `-p \|--package`    | The Ballerina package location to generate the Ballerina client or service stub.                                                                                                                                                                                                              |  Optional        |

>**Info:** For more command options, see [OpenAPI to Ballerina CLI options](#openapi-to-ballerina-command-options).

## Publish your client

To see your new client in Ballerina central in the future, follow the steps below to send a GitHub Pull Request to the WSO2 `openapi-connectors` repository to publish it.

1. Fork and clone the <a href="https://github.com/ballerina-platform/openapi-connectors" target="_blank">`openapi-connectors`</a> repository. Connectors generated from the Ballerina OpenAPI tool are managed in this repository.

2. Open the cloned repository and navigate to the `/openapi` directory.

3. Run the `bal new <connector_name> -t lib` command to create a new Ballerina package. 

4. Copy the [generated files](#generate-ballerina-clients-from-openapi-definitions) (i.e., `client.bal`, `types.bal`, and `utils.bal`) into the `<connector_name>` directory. 

5. Run the `bal build` command to check whether the newly-generated connector is compiling successfully. 

6. Run the necessary unit tests to verify the functionality of the generated connector.

7. Add the license header at the top of each `.bal` file. 

8. Add the <a href="https://github.com/ballerina-platform/ballerina-extended-library/discussions/77" target="_blank">`Package.md`</a> and <a href="https://github.com/ballerina-platform/ballerina-extended-library/discussions/78" target="_blank">`Module.md`</a> files.

9. Add a connector icon to the root of the connector. The icon needs to be a `.png` of 200x200 px size named as `icon.png`. 

10. Update the <a href="https://github.com/ballerina-platform/ballerina-extended-library/discussions/72" target="_blank">`Ballerina.toml` file</a>.

11. Run the `./gradlew build` command. 

12. Push the changes and create a Pull Request to the master branch of the `openapi-connectors` repository.

## Annotation reference

### The `@openapi:ServiceInfo` annotation

The `@openapi:ServiceInfo` annotation supports several usages in the Ballerina OpenAPI tool.

```ballerina
@openapi:ServiceInfo {
    contract: "/path/to/openapi.json|yaml",
    tags: ["store"],
    operations: ["op1", "op2"],
    failOnErrors: true // (default value => true),
    excludeTags: ["pets", "user"],
    excludeOperations: ["op1", "op2"],
    title: "store",
    'version: "0.1.0",
    embed: true // (default value => true)
}
service /greet on new http:Listener(9090) {
   ...
}
```

The attributes of the annotation are optional and can be used for each particular purpose as described below.  


| Command option      | Description                                                                                                                                                                                                                                                                                                                                                                     | Mandatory/Optional |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| `Contract: string?`            | Provides a path to the OpenAPI contract as a string and the OpenAPI file can either be a `.yaml` or `.json`.                                                                                                                                                                                                                              | Mandatory          |
| `Tags: string[]?`              | Specifies the tag in the list for the compiler to validate resources against operations that are tagged with it. If not specified, the compiler validates resources against all the operations defined in the OpenAPI contract.                                                                                                           | Optional          |
| `Operations: string[]?`        | Contains a list of operation names that need to be validated against the resources in the service. If not specified, the compiler validates resources against all the operations defined in the OpenAPI contract.  If both tags and operations are defined, it validates against the union set of the resources.                          | Optional          |
| `ExcludeTags: string[]?`       | Stores the tags that do not need to be validated. The annotation can not have both the `excludeTags` and `Tags` attributes at the same time.                                                                                                                                                                                              | Optional          |
| `ExcludeOperations: string[]?` | Specifies the operations that do not need to be validated.                                                                                                                                                                                                                                                                                | Optional          |
| `FailOnErrors: boolean?`       | Turns off the validation when used with `false` in the annotation.                                                                                                                                                                                                                                                                        | Optional          |
| `Title: string?`               | Adds the title of the `info` section in the generated OpenAPI contract.                                                                                                                                                                                                                                                                  | Optional          |
| `Version: string?`             | Adds the version of the `info` section in the generated OpenAPI contract.                                                                                                                                                                                                                                                                 | Optional          |
| `Embed: string?`               | Turns off generating OpenAPI documentation for the service for introspection endpoint support when used with `false` in the annotation.                                                                                                                                                                                                   | Optional          |

