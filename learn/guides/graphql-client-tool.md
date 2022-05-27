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

The GraphQL schema is necessary to validate the GraphQL queries. Each GraphQL query will be validated against the given GraphQL schema before generating a Ballerina client remote operation and the corresponding Ballerina record types. You can use the generated Ballerina client to execute queries/mutations on the relevant GraphQL API through the generated remote operations. 

For advanced use cases, you can generate multiple clients using multiple GraphQL documents or generate multiple Ballerina modules per GraphQL API endpoint.

## Generate a client from a GraphQL config

> **Prerequisites:** Install the [GraphQL Foundation VSCode plugin](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) and the latest [Ballerina Swan Lake distribution](https://ballerina.io/downloads/).

The steps below demonstrates how to generate a Ballerina client from a GraphQL config file configured with a GraphQL schema (SDL) and GraphQL document using the `graphql` CLI tool.

### Create a Ballerina package

For more information, see [Package commands](/learn/cli-documentation/cli-commands/#package-commands).

### Add the GraphQL schema and the GraphQL document

Create the directories below in the Ballerina package root directory and add the GraphQL schema (SDL) and GraphQL document to each of them.

1. `schemas` directory - Add the GraphQL schema file (for example, `country.graphql`) to this directory. Add the GraphQL schema (SDL) of the relevant GraphQL API to this file.
2. `queries` directory - Add the GraphQL document file (for example, `query-country.graphql`) to this directory. Add the GraphQL queries/mutations separated by a newline to this file. You are required to give a query name for each query/mutation. This name would be used as the corresponding remote operation name in the generated client.

For example, the `query-country.graphql` file will have the content below.

```graphql
## Add the queries and mutations here.

query countryByCode($code: ID!) {
    country(code: $code) {
        name
    }
}
```

### Create a GraphQL config

The [GraphQL Foundation VSCode plugin](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) requires a GraphQL config file at the root level or in a parent level directory. The Ballerina GraphQL client tool supports only the standard `graphql.config.yaml` format as input. For more information, see the [GraphQL config](https://www.graphql-config.com/docs/user/user-usage).

Create a GraphQL config file (`graphql.config.yaml`) in the Ballerina package root directory with the configurations below.

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

### Execute the `graphql` CLI command

If you want to generate the Ballerina client for a given GraphQL document you can use the command below. For more information, see [GraphQL to Ballerina](/learn/cli-documentation/graphql/#graphql-to-ballerina). 

```bash
bal graphql [-i | --input] <graphql-configuration-file-path> [-o | --output] <output-location> 
```

This will generate a Ballerina client with remote operations corresponding to each GraphQL query/mutation in the GraphQL document (`.graphql document`). The generated sources will be written into the same directory from which the command is executed (i.e., the Ballerina package root directory). For example,

```bash
bal graphql -i graphql.config.yaml
```
The above command can be run from anywhere on the execution path. It is not mandatory to run it from within a Ballerina project.

This will generate the Ballerina sources (i.e., the three Ballerina files below) from the given GraphQL config.

1. `<document_name>_client.bal` - contains the Ballerina client with remote operations corresponding to each GraphQL query/mutation in the GraphQL document
2. `utils.bal` - contains all the utility methods related to the client stub
3. `types.bal`- contains all the Ballerina data types extracted from the GraphQL schema (SDL)

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

### Sample usage of the generated client

The generated client can be used to execute the queries/mutations on the GraphQL API. The example below shows the usage of the generated client in a Ballerina program. Make sure you have copied the generated files into the root of the Ballerina package.

Add a Ballerina file called `main.bal` with the content below into the root of the Ballerina package.

```ballerina
import ballerina/io;

public function main() returns error? {
    QuerycountryClient countryClient = check new ("https://countries.trevorblades.com/");
    CountryByCodeResponse response = check countryClient->countryByCode("LK");
    io:println(response.country?.name);
}
```

Build and run the Ballerina package by using the `bal run` command. For more information, see [Core commands](/learn/cli-documentation/cli-commands/#core-commands).

You can also use the generated client within the same Ballerina package by copying the generated files to a separate module. For more information, see [Import a module from the same package](/learn/organize-ballerina-code/#import-a-module-from-the-same-package). 

You can use the `graphql` CLI tool to generate a Ballerina module. For more information, see [Generate multiple modules from a GraphQL config](/learn/graphql-client-tool/#generate-multiple-modules-from-a-graphql-config).

## Advanced use cases

### Generate multiple clients from a GraphQL config

The steps below demonstrates how to generate multiple Ballerina clients from a GraphQL config file configured with a GraphQL schema (SDL) and multiple GraphQL documents using the `graphql` CLI tool. Each document will generate a separate Ballerina client.

Create a Ballerina package. For more information, see [Package commands](/learn/cli-documentation/cli-commands/#package-commands).

Create a GraphQL config file (`graphql.config.yaml`) in the Ballerina package root directory with the configurations below.

```yml
schema: <File path to the GraphQL schema or the web URL of the GraphQL schema>
documents:
   - <File path to the GraphQL document with the GraphQL queries & mutations>
   - <File path to the GraphQL document with the GraphQL queries & mutations>
   - <File path to the GraphQL document with the GraphQL queries & mutations>
   - <Add more documents based on your requirement …>
```

If you want to generate multiple Ballerina clients for a given set of GraphQL documents, use the command below.

```bash
bal graphql [-i | --input] <graphql-configuration-file-path> [-o | --output] <output-location> 
```

This will generate a separate Ballerina client for each GraphQL document with remote operations corresponding to each GraphQL query/mutation in the GraphQL document (`.graphql document`). The generated sources will be written into the same directory from which the command is executed (i.e., the Ballerina package root directory). For example,

```bash
bal graphql -i graphql.config.yaml
```

This will generate the Ballerina sources (i.e., the Ballerina files below) from the given GraphQL config.

1. `<document_name>_client.bal` - contains the Ballerina client corresponding to each GraphQL document (Each GraphQL document will generate a separate Ballerina client file.)
2. `utils.bal` - contains all the utility methods related to the client stub
3. `types.bal`- contains all the Ballerina data types extracted from the GraphQL schema (SDL)

The generated clients can be used to execute the queries/mutations on the GraphQL API. You can use the generated clients within a Ballerina program in the same Ballerina package.

You can also use the generated clients within the same Ballerina package by copying the generated files to a separate module. For more information, see [Import a module from the same package](/learn/organize-ballerina-code/#import-a-module-from-the-same-package). 

You can use the `graphql` CLI command to generate a Ballerina module. For more information, see [Generate multiple modules from a GraphQL config](/learn/graphql-client-tool/#generate-multiple-modules-from-a-graphql-config).

### Generate multiple modules from a GraphQL config

The steps below demonstrates how to generate multiple Ballerina modules from a GraphQL config file configured with multiple GraphQL projects using the `graphql` CLI tool. Each project will generate a separate Ballerina module. This enables you to work with multiple GraphQL APIs by configuring each GraphQL API endpoint under a separate project.

Create a Ballerina package. For more information, see [Package commands](/learn/cli-documentation/cli-commands/#package-commands).

Create a GraphQL config file (`graphql.config.yaml`) in the Ballerina package root directory with the configurations below.

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

If you want to generate multiple Ballerina modules for a given set of GraphQL projects, use the command below.

```bash
bal graphql [-i | --input] <graphql-configuration-file-path> [-o | --output] <output-location> 
```

This will generate a separate Ballerina module for each GraphQL project. The generated sources will be written into individual modules in the Ballerina package. For example,

```bash
bal graphql -i graphql.config.yaml
```

This will generate a separate Ballerina module (with the project name configured) for each GraphQL project in the GraphQL config. This will also generate the Ballerina sources (i.e., the Ballerina files below) inside each module.

1. `<document_name>_client.bal` - contains the Ballerina client corresponding to each GraphQL document (Each GraphQL document will generate a separate Ballerina client file.)
2. `utils.bal` - contains all the utility methods related to the client stub
3. `types.bal`- contains all the Ballerina data types extracted from the GraphQL schema (SDL)

The generated modules can be used to work with multiple GraphQL APIs. The generated client within each module can be used to execute the queries/mutations on the relevant GraphQL API. You can use the generated clients within the same Ballerina package by importing the generated modules. For more information, see [Import a module from the same package](/learn/organize-ballerina-code/#import-a-module-from-the-same-package).
