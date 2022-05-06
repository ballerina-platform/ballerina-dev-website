---
layout: ballerina-graphql-support-left-nav-pages-swanlake
title: Ballerina GraphQL support 
description: Check out how the Ballerina GraphQL tooling makes it easy for you to start developing a service documented in a GraphQL schema.
keywords: ballerina, programming language, graphql, sdl, schema definition language
permalink: /learn/ballerina-graphql-support/
active: ballerina-graphql-support
intro: Every GraphQL service defines a set of types, which describe the set of possible data you can query on that service and when queries come in, they are validated and executed against that schema. 
redirect_from:
  - /learn/ballerina-graphql-support
--- 

GraphQL schemas for a service are now most often specified using what’s known as the GraphQL SDL (schema definition language). It is also sometimes referred to as just GraphQL schema language. Ballerina GraphQL tooling will make it easy for you to generate a client in Ballerina given the GraphQL schema (SDL) and GraphQL queries. You can generate multiple clients in Ballerina for multiple GraphQL documents for a given GraphQL SDL. It also enables you to generate multiple Ballerina modules for multiple GraphQL projects to work with different GraphQL APIs. 

The Ballerina GraphQL tooling support provides the following capabilities.

> **Prerequisites:** Install the [GraphQL Foundation VSCode plugin](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) and the latest [Ballerina Swan Lake distribution](https://ballerina.io/downloads/).

1. Generate a Ballerina client from a given GraphQL config file configured with a GraphQL schema (SDL) and a GraphQL document using the CLI tool.

2. Generate multiple Ballerina clients from a given GraphQL config file configured with a GraphQL SDL and multiple GraphQL documents using the CLI tool. Each document will generate a separate Ballerina client.

3. Generate multiple Ballerina modules from a given GraphQL config file configured with multiple GraphQL projects. Each project will generate a separate Ballerina module. This enables you to work with multiple GraphQL APIs by configuring each GraphQL API under a separate project.

## Generate a client from a GraphQL config

The example below demonstrates how to generate a Ballerina client from a GraphQL config file configured with a GraphQL schema (SDL) and GraphQL document.

Create a GraphQL config file (`graphql.config1.yaml`) with the configuration below.

```yml
schema: <File path to the GraphQL schema or the web URL of the GraphQL schema>
documents: <File path to the GraphQL document with the GraphQL queries & mutations>
```

The client generated from the above GraphQL config file can be used in your applications to call the queries/mutations in the GraphQL document against the GraphQL API corresponding to the GraphQL schema defined in the GraphQL config file.

If you want to generate the Ballerina client for a given GraphQL document you can use the command below.

```bash
bal graphql [-i | --input] <graphql-configuration-file-path> [-o | --output] <output-location> 
```

This will generate a Ballerina client with remote operations corresponding to each GraphQL query/mutation in the GraphQL document (`.graphql document`). For example,

```bash
bal graphql -i graphql.config1.yaml
```
The above command can be run from anywhere on the execution path. It is not mandatory to run it from within a Ballerina project.

This will generate the files below.

1. `client.bal` - Ballerina client stub 
2. `utils.bal` - util file for the relevant `utils` methods related to the client stub
3. `types.bal`- schema file for the configured GraphQL schema

>**Note:** If the GraphQL API contains an authentication mechanism, add the extensions section in the GraphQL config file with the relevant tokens and headers. In this scenario, it is mandatory to configure the schema section with the web URL of the GraphQL schema as shown below.

```yml
schema: <The web URL of the GraphQL schema.>
documents:
<File path to the GraphQL document with the GraphQL queries & mutations>
extensions:
     endpoints:
         default:
              headers: { “<Authorization>”: “<Bearer token>”, “<API_Header_Key1>”: “<API_Header_Value1>”,” <API_Header_Key2>”: “<API_Header_Value2>” }
```

## Generate multiple clients from a GraphQL config

The example below demonstrates how to generate multiple Ballerina clients from a GraphQL config file configured with a GraphQL schema (SDL) and multiple GraphQL documents.

Create a GraphQL config file (`graphql.config2.yaml`) with the configuration below.

```yml
schema: <File path to the GraphQL schema or the web URL of the GraphQL schema>
documents:
<File path to the GraphQL document with the GraphQL queries & mutations>
<File path to the GraphQL document with the GraphQL queries & mutations>
<File path to the GraphQL document with the GraphQL queries & mutations>
<Add more documents based on your requirement …>
```

The clients generated from the GraphQL config file can be used in your applications to call the queries/mutations in each GraphQL document against the GraphQL API corresponding to the GraphQL schema defined in the GraphQL config file.

If you want to generate multiple Ballerina clients for a given set of GraphQL documents, use the command below.

```bash
bal graphql [-i | --input] <graphql-configuration-file-path> [-o | --output] <output-location> 
```

This will generate a separate Ballerina client for each GraphQL document with remote operations corresponding to each GraphQL query/mutation in the GraphQL document (`.graphql document`). For example,

```bash
bal graphql -i graphql.config2.yaml
```
The above command can be run from anywhere on the execution path. It is not mandatory to run it from within a Ballerina project.

This will generate the files below.

1. `<document_name>_client.bal` - Ballerina client stub corresponding to each GraphQL document
2. `utils.bal` - util file for the relevant utils methods related to the client stubs
3. `types.bal` - schema file for the configured GraphQL schema 

## Generate multiple modules from a GraphQL config

The example below demonstrates how to generate multiple Ballerina modules from a GraphQL config file configured with multiple GraphQL projects.

Create a GraphQL config file (`graphql.config3.yaml`) with the following configuration.

```yaml
projects:
    <project1_name>:
schema: <File path to the GraphQL schema or the web URL of the GraphQL schema>
documents:
<File path to the GraphQL document with the GraphQL queries & mutations>
<File path to the GraphQL document with the GraphQL queries & mutations>
<Add more documents based on your requirement …>
    <project2_name>:
schema: <File path to the GraphQL schema or the web URL of the GraphQL schema>
documents:
<File path to the GraphQL document with the GraphQL queries & mutations>
<File path to the GraphQL document with the GraphQL queries & mutations>
<Add more documents based on your requirement …>
    <project3_name>:
schema: <File path to the GraphQL schema or the web URL of the GraphQL schema>
documents:
<File path to the GraphQL document with the GraphQL queries & mutations>
<File path to the GraphQL document with the GraphQL queries & mutations>
<Add more documents based on your requirement …>
    <Add more projects based on your requirement …>
```

This enables you to work with multiple GraphQL APIs. Each GraphQL API should be defined under a separate project in the GraphQL config file. The clients generated under a separate Ballerina module related to each project from the GraphQL config file can be used in your applications to call the queries/mutations in each GraphQL document against the GraphQL API corresponding to the GraphQL schema defined under each project in the GraphQL config file.

If you want to generate multiple Ballerina modules for a given set of GraphQL projects, use the command below.

```bash
bal graphql [-i | --input] <graphql-configuration-file-path> [-o | --output] <output-location> 
```

This will generate a separate Ballerina module for each GraphQL project with clients corresponding to each GraphQL document configured under each GraphQL project. For example,

```bash
bal graphql -i graphql.config3.yaml
```

The above command can be run from anywhere on the execution path. It is not mandatory to run it from within a Ballerina project.

This will generate the below.

1. `project_name` - a Ballerina module corresponding to each GraphQL project
2. `<document_name>_client.bal` - each project will generate a Ballerina client stub corresponding to each GraphQL document configured under the relevant GraphQL project
3. `utils.bal` - util file for the relevant `utils` methods related to the client stubs
4. `types.bal` - schema file for the configured GraphQL schema under the relevant GraphQL project
  