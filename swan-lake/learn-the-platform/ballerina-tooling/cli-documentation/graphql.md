---
layout: ballerina-cli-documentation-left-nav-pages-swanlake
title: GraphQL
description: The sections below include information about the usages of the Ballerina GraphQL tool.
keywords: ballerina, programming language, ballerina packages, package structure, package layout, GraphQL
permalink: /learn/cli-documentation/graphql/
active: graphql
intro: The sections below include information about the usages of the Ballerina GraphQL tool.
---

## GraphQL to Ballerina 

The GraphQL to Ballerina command supports several usages in the Ballerina GraphQL tool as follows.

### Client generation
```
$ bal graphql [-i | --input] <graphql-configuration-file-path>
            [-o | --output] <output-location>
```

The command-line arguments below can be used with the command for each particular purpose as described below.

| Argument       | Description                                                                                                                                                                                                                                                   |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `-i, --input`  | The `input` parameter specifies the path of the GraphQL config file (e.g., `graphql.config.yaml`) configured with GraphQL schemas specified by the Schema Definition Language and GraphQL documents. This parameter is mandatory.                             |
| `-o, --output` | The `output` parameter specifies the path of the output location of the generated files. This parameter is optional. If this parameter is not specified, the Ballerina files will be generated at the same location in which the GraphQL command is executed. |

### Service generation 
```
$ bal graphql [-i | --input] <graphql-schema-file-path>
            [-o | --output] <output-location>
            [-m | --mode] <operation-mode>
            [-r | --use-records-for-objects]
```
The command-line arguments below can be used with the command for each particular purpose as described below.

| Argument       | Description                                                                                                                                                                                                                                                   |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `-i, --input`  | The `input` parameter specifies the path of the GraphQL schema file (e.g., `schema.graphql`) specified in Schema Definition Language. This parameter is mandatory.                             |
| `-o, --output` | The `output` parameter specifies the path of the output location of the generated files. This parameter is optional. If this parameter is not specified, the Ballerina files will be generated at the same location where the GraphQL command is executed. |
| `-m, --mode`  | The `mode` parameter specifies the operation mode. It indicates the way to process the schema file. If the `mode` flag is not specified, the `graphql` tool will infer the mode from the `input` file extension. |
| `-r, --use-records-for-objects`  | The `use-records-for-objects` parameter specifies to generate record types for GraphQL object types whenever it is possible. This parameter is optional. If this parameter is not specified, service class types will be generated for GraphQL object types. |

## Ballerina to GraphQL

The Ballerina to GraphQL command supports several usages in the Ballerina GraphQL tool as follows.

```
$ bal graphql [-i | --input] <ballerina-graphql-service-file-path>
            [-o | --output] <output-location>
            [-s | --service] <service-base-path>
```

The command-line arguments below can be used with the command for each particular purpose as described below.

| Argument        | Description                                                                                                                                                                                                                                                               |
|-----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `-i, --input`   | The `input` parameter specifies the path of the Ballerina GraphQL service file (e.g., `service.bal`). This parameter is mandatory.                                                                                                                                        |
| `-o, --output`  | The `output` parameter specifies the output location of the generated GraphQL schema files. This parameter is optional. If this parameter is not specified, the schema files will be generated at the same location in which the GraphQL command is executed.             |
| `-o, --service` | The `service` parameter specifies the base path of the Ballerina GraphQL service of which the schema needs to be generated. This parameter is optional. If this parameter is not specified, schemas will be generated for each of the GraphQL services in the given file. |

<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
