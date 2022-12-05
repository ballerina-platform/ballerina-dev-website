---
layout: ballerina-cli-documentation-left-nav-pages-swanlake
title: OpenAPI 
description: The sections below include information about the usages of the Ballerina OpenAPI tool.
keywords: ballerina, programming language, ballerina packages, package structure, package layout, OpenAPI
permalink: /learn/cli-documentation/openapi/
active: openapi
intro: The sections below include information about the usages of the Ballerina OpenAPI tool.
redirect_from:
  - /learn/cli-documentation/openapi
---

## OpenAPI to Ballerina 

The OpenAPI to Ballerina command supports several usages in the Ballerina OpenAPI tool as follows.

```
bal openapi [-i | --input] <openapi-contract-file-path> 
            [-o | --output] <output-location>
            [--mode] <mode-type>
            [--tags] <tag-names> 
            [--operations] <operation-names> 
            [-n | --nullable]
            [--license] <license-file-path> 
            [--with-tests]
```

The command-line arguments below can be used with the command for each particular purpose as described below. 

| Argument          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `-i \| --input`   | The `openapi-contract-path` parameter specifies the path of the OpenAPI contract file (e.g., `my-api.yaml` or `my-api.json`) and is mandatory.                                                                                                                                                                                                                                                                                                                                                                                   |
| `-o \| --output`  | The Ballerina files are generated at the same location from which the OpenAPI command is executed. Optionally, you can point to another directory location by using the optional flag `(-o\|--output)`.                                                                                                                                                                                                                                                                                                                      |
| `--mode`          | Mode type is optional and can be either a service or client. The Ballerina service and client are generated according to the mode. Without the `--mode`, it generates both service and client stubs for the given OpenAPI contract.                                                                                                                                                                                                                                                                                      |
| `--tags`          | To generate the Ballerina client or service stub with a subset of tags defined in the OpenAPI contract, use the `--tags` option and specify the tags you need as specified in the OpenAPI definition.<br><br>**E.g.,** `bal openapi -i <openapi-contract>  [--tags < "tag1","tag2">]`                                                                                                                                                                                                                                            |
| `--operations`    | To generate the Ballerina client or service stub with a subset of operations defined in the OpenAPI contract, use the `--operations` option and specify the operations you need as specified in the OpenAPI definition.<br><br>**E.g.,** `bal openapi -i <openapi-contract> [--operations <"op1", "op2">]`                                                                                                                                                                                                                       |
| `--license`       | To generate the Ballerina files with the given copyright or license header, you can use this `--license` flag with your copyright text.<br><br>**E.g.,** `bal openapi -i <openapi-contract> [--license <license-file-path>]`                                                                                                                                                                                                                                                                                                     |
| `-n \|--nullable` | This is an optional flag in the OpenAPI to Ballerina command. If your OpenAPI specification includes JSON schema properties that are not marked as `nullable:true`, they may return as null in some responses. It results in a JSON schema to Ballerina record data binding error. If you suspect this can happen for any property, it is safe to generate all data types in the generated record with Ballerina nil support by turning on this flag.<br><br>**E.g.,** `bal openapi -i <openapi-contract> [-n \|--nullable]` |
| `--with-tests`    | This is optional. It works with the client generation command and generates a boiler-plate test for all the remote methods of the generated client.                                                                                                                                                                                                                                                                                                                                                                            |
| `--client-methods`| This option can be used in the client generation to select the client method type, which can be `resource` or `remote`. (The default option is `remote`).                                                                                                                                                                                                                                                                                                                                                                            |

## Ballerina to OpenAPI 

The Ballerina to OpenAPI command supports several usages in the Ballerina OpenAPI tool as follows.

```
bal openapi [-i | --input] <ballerina-service-file-path> [--json]
            [-s | --service] <current-service-name>
            [-o | --output] <output-location>
```

The command line arguments below can be used with the command for each particular purpose as described below.

| Argument          | Description                                                                                                                                                     |
|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `-i \|--input`    | The `ballerina-service-file-path` parameter specifies the path of the Ballerina service file (e.g., `my-service.bal`) and is mandatory.                         |
| `--json`          | Generate the Ballerina service to OpenAPI output as JSON. The default is YAML.                                                                                  |
| `-s \| --service` | This service name is used to identify the service that needs to be documented as an OpenAPI specification.                                                      |
| `-o\|--output`    | Location of the generated OpenAPI specification. If this path is not specified, the output is written to the same directory from which the command is run. |

<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>

 
