---
layout: ballerina-graphql-support-left-nav-pages-swanlake
title: GraphQL client tool
description: Check out how the Ballerina GraphQL client tool makes it easy for you to generate a client in Ballerina using a given GraphQL schema (SDL) and GraphQL queries.
keywords: ballerina, programming language, graphql, sdl, schema definition language
permalink: /learn/graphql-client-tool/
active: graphql-client-tool
intro: The Ballerina GraphQL client tool will make it easy for you to generate a client in Ballerina using a given GraphQL schema (SDL) and GraphQL queries. 
redirect_from:
  - /learn/ballerina-graphql-support
  - /learn/ballerina-graphql-support/
  - /learn/graphql-tool
  - /learn/graphql-tool/
  - /learn/graphql-client-tool
--- 

The GraphQL schema is necessary to validate the GraphQL queries. Each GraphQL query will be validated against the given GraphQL schema before generating a Ballerina client remote operation and the corresponding Ballerina record types. You can use the generated Ballerina client to execute queries/mutations on the relevant GraphQL API through the generated remote operations. Based on your necessity, you can generate multiple clients in Ballerina using the given multiple GraphQL documents and GraphQL queries/mutations. You can also generate multiple Ballerina modules per GraphQL API endpoint. 

The Ballerina GraphQL client tool provides the following capabilities.

> **Prerequisites:** Install the [GraphQL Foundation VSCode plugin](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) and the latest [Ballerina Swan Lake distribution](https://ballerina.io/downloads/).

1. Generate a Ballerina client from a given GraphQL config file configured with a GraphQL schema (SDL) and a GraphQL document using the CLI tool.

2. Generate multiple Ballerina clients from a given GraphQL config file configured with a GraphQL SDL and multiple GraphQL documents using the CLI tool. Each document will generate a separate Ballerina client.

3. Generate multiple Ballerina modules from a given GraphQL config file configured with multiple GraphQL projects. Each project will generate a separate Ballerina module. This enables you to work with multiple GraphQL APIs by configuring each GraphQL API under a separate project.

>**Note:** The [GraphQL Foundation VSCode plugin](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) requires a GraphQL config file at the root level or in a parent level directory. The Ballerina GraphQL client tool supports only the standard `graphql.config.yaml` format as input. For more information, see the [GraphQL config](https://www.graphql-config.com/docs/user/user-usage). It is recommended to add the GraphQL config file (`graphql.config.yaml`) in a Ballerina package root and to execute the GraphQL client tool from the root directory. For more information, see [Package commands](/learn/cli-documentation/cli-commands/#package-commands). 

## Generate a client from a GraphQL config

The example below demonstrates how to generate a Ballerina client from a GraphQL config file configured with a GraphQL schema (SDL) and GraphQL document.

Create the directories below in a root directory and add the GraphQL schema (SDL) and GraphQL document to each of them.
- `schemas` folder to add your GraphQL schema (for example, `country.graphql`). Add the GraphQL schema (SDL) of the relevant GraphQL API to this file.
- `queries` folder to add your GraphQL document (for example, `query-country.graphql`). Add the GraphQL queries/mutations separated by a newline to this file. You are required to give a query name for each query/mutation. This name would be used as the corresponding remote operation name in the generated client.

For example, the `query-country.graphql` file will have the content below.

```graphql
## Add the queries and mutations here.

query countryByCode($code: ID!) {
    country(code: $code) {
        name
    }
}
```

Create a GraphQL config file (`graphql.config.yaml`) with the configurations below.

```yml
schema: <File path to the GraphQL schema or the web URL of the GraphQL schema>
documents:
   - <File path to the GraphQL document with the GraphQL queries & mutations>
```

For example,

```yml
## The GraphQL schema. E.g., https://countries.trevorblades.com or ./schemas/country.graphql
schema: https://countries.trevorblades.com
## The GraphQL documents that have queries/mutations
documents:
   - ./queries/query-country.graphql
```

The client generated from the above GraphQL config file can be used to execute the queries/mutations of the GraphQL document. This will be executed on the GraphQL API corresponding to the GraphQL schema defined in the GraphQL config file.

If you want to generate the Ballerina client for a given GraphQL document you can use the command below.

```bash
bal graphql [-i | --input] <graphql-configuration-file-path> [-o | --output] <output-location> 
```

This will generate a Ballerina client with remote operations corresponding to each GraphQL query/mutation in the GraphQL document (`.graphql document`). For example,

```bash
bal graphql -i graphql.config.yaml
```
The above command can be run from anywhere on the execution path. It is not mandatory to run it from within a Ballerina project.

This will generate the files below.

1. `<document_name>_client.bal` - Ballerina client stub 
2. `utils.bal` - util file for the relevant `utils` methods related to the client stub
3. `types.bal`- schema file for the configured GraphQL schema

For the example above, it would generate the client file below.

```ballerina
import ballerina/http;
import ballerina/graphql;

public isolated client class QuerycountryClient {
    final graphql:Client graphqlClient;
    public isolated function init(string serviceUrl, http:ClientConfiguration clientConfig = {}) returns graphql:ClientError? {
        graphql:Client clientEp = check new (serviceUrl, clientConfig);
        self.graphqlClient = clientEp;
        return;
    }
    remote isolated function countryByCode(string code) returns CountryByCodeResponse|graphql:ClientError {
        string query = string `query countryByCode($code:ID!) {country(code:$code) {name}}`;
        map<anydata> variables = {"code": code};
        json graphqlResponse = check self.graphqlClient->executeWithType(query, variables);
        return <CountryByCodeResponse> check performDataBinding(graphqlResponse, CountryByCodeResponse);
    }
}
```

It is recommended to copy the generated files into the root of a Ballerina package. You can use the `bal init` command to create a new Ballerina package in the existing directory. For more information, see [Package commands](/learn/cli-documentation/cli-commands/#package-commands). 

The example below shows the usage of the generated client in a Ballerina program. 

Add a file called `main.bal` with the content below into the root of the Ballerina package.

```ballerina
import ballerina/io;

public function main() returns error? {
    QuerycountryClient countryClient = check new ("https://countries.trevorblades.com/");
    CountryByCodeResponse response = check countryClient->countryByCode("LK");
    io:println(response.country?.name);
}
```

Build and run the Ballerina package by using the `bal run` command. For more information, see [Core commands](/learn/cli-documentation/cli-commands/#core-commands).

You can also use the generated client within the same Ballerina project by generating it within a separate module. For more information, see [Generate multiple modules from a GraphQL config](/learn/graphql-client-tool/#generate-multiple-modules-from-a-graphql-config).

>**Note:** If the GraphQL API is secured, add the extensions section in the GraphQL config file with the relevant tokens and headers. In this scenario, it is mandatory to configure the schema section with the web URL of the GraphQL schema as shown below.

```yml
schema: <The web URL of the GraphQL schema.>
documents:
   - <File path to the GraphQL document with the GraphQL queries & mutations>
extensions:
   endpoints:
      default:
         headers: { "Authorization": "Bearer token", "API_Header_Key1": "API_Header_Value1", "API_Header_Key2": "API_Header_Value2" }

```

## Generate multiple clients from a GraphQL config

The example below demonstrates how to generate multiple Ballerina clients from a GraphQL config file configured with a GraphQL schema (SDL) and multiple GraphQL documents.

Create a GraphQL config file (`graphql.config.yaml`) with the configuration below.

```yml
schema: <File path to the GraphQL schema or the web URL of the GraphQL schema>
documents:
   - <File path to the GraphQL document with the GraphQL queries & mutations>
   - <File path to the GraphQL document with the GraphQL queries & mutations>
   - <File path to the GraphQL document with the GraphQL queries & mutations>
   - <Add more documents based on your requirement …>
```

The clients generated from the GraphQL config file can be used to execute the queries/mutations of each GraphQL document. This will be executed on the GraphQL API corresponding to the GraphQL schema defined in the GraphQL config file.

If you want to generate multiple Ballerina clients for a given set of GraphQL documents, use the command below.

```bash
bal graphql [-i | --input] <graphql-configuration-file-path> [-o | --output] <output-location> 
```

This will generate a separate Ballerina client for each GraphQL document with remote operations corresponding to each GraphQL query/mutation in the GraphQL document (`.graphql document`). For example,

```bash
bal graphql -i graphql.config.yaml
```
The above command can be run from anywhere on the execution path. It is not mandatory to run it from within a Ballerina project.

This will generate the files below.

1. `<document_name>_client.bal` - Ballerina client stub corresponding to each GraphQL document
2. `utils.bal` - util file for the relevant utils methods related to the client stubs
3. `types.bal` - schema file for the configured GraphQL schema 

It is recommended to copy the generated files to the root of a Ballerina package. You can use the `bal init` command to create a new Ballerina package in the existing directory. For more information, see [Package commands](http://dev.ballerina.io/learn/cli-documentation/cli-commands/#package-commands). 

You can also use the generated client within the same Ballerina project by generating it within a separate module. For more information, see [Generate multiple modules from a GraphQL config](/learn/graphql-client-tool/#generate-multiple-modules-from-a-graphql-config).

## Generate multiple modules from a GraphQL config

The example below demonstrates how to generate multiple Ballerina modules from a GraphQL config file configured with multiple GraphQL projects.

Create a GraphQL config file (`graphql.config.yaml`) with the configuration below.

```yaml
projects:
   <project1_name>:
      schema: <File path to the GraphQL schema or the web URL of the GraphQL schema>
      documents:
         - <File path to the GraphQL document with the GraphQL queries & mutations>
         - <File path to the GraphQL document with the GraphQL queries & mutations>
         - <Add more documents based on your requirement …>
   <project2_name>:
      schema: <File path to the GraphQL schema or the web URL of the GraphQL schema>
      documents:
         - <File path to the GraphQL document with the GraphQL queries & mutations>
         - <File path to the GraphQL document with the GraphQL queries & mutations>
         - <Add more documents based on your requirement …>
   <project3_name>:
      schema: <File path to the GraphQL schema or the web URL of the GraphQL schema>
      documents:
         - <File path to the GraphQL document with the GraphQL queries & mutations>
         - <File path to the GraphQL document with the GraphQL queries & mutations>
         - <Add more documents based on your requirement …>
```

This enables you to work with multiple GraphQL APIs. Each GraphQL API should be defined under a separate project in the GraphQL config file. You can use the clients generated under a separate Ballerina module (related to each project from the GraphQL config file) to execute the queries/mutations of each GraphQL document. This will be executed on the GraphQL API corresponding to the GraphQL schema defined under each project in the GraphQL config file.

If you want to generate multiple Ballerina modules for a given set of GraphQL projects, use the command below.

```bash
bal graphql [-i | --input] <graphql-configuration-file-path> [-o | --output] <output-location> 
```

This will generate a separate Ballerina module for each GraphQL project with clients corresponding to each GraphQL document configured under each GraphQL project. For example,

```bash
bal graphql -i graphql.config.yaml
```

The above command can be run from anywhere on the execution path. It is not mandatory to run it from within a Ballerina project.

This will generate the below.

1. `project_name` - a Ballerina module corresponding to each GraphQL project
2. `<document_name>_client.bal` - each project will generate a Ballerina client stub corresponding to each GraphQL document configured under the relevant GraphQL project
3. `utils.bal` - util file for the relevant `utils` methods related to the client stubs
4. `types.bal` - schema file for the configured GraphQL schema under the relevant GraphQL project

It is recommended to copy the generated modules to the root of a Ballerina package. You can use the `bal init` command to create a new Ballerina package in the existing directory. For more information, see [Package commands](http://dev.ballerina.io/learn/cli-documentation/cli-commands/#package-commands). 

You can also use the generated clients within the same Ballerina package by importing the generated modules. For more information, see [Import a module from the same package](/learn/organize-ballerina-code/#import-a-module-from-the-same-package).
  