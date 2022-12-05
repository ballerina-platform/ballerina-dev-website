---
layout: ballerina-graphql-support-left-nav-pages-swanlake
title: GraphQL client tool
description: Check out how the Ballerina GraphQL client tool makes it easy for you to generate a client in Ballerina using a given GraphQL schema (SDL) and GraphQL queries.
keywords: ballerina, programming language, graphql, sdl, schema definition language
permalink: /learn/graphql-client-tool/
active: graphql-client-tool
intro: The Ballerina GraphQL client tool makes it easy for you to generate a client in Ballerina using a given GraphQL schema (SDL) and GraphQL queries. 
redirect_from:
  - /learn/ballerina-graphql-support
  - /learn/ballerina-graphql-support/
  - /learn/graphql-tool
  - /learn/graphql-tool/
  - /learn/graphql-client-tool
--- 

When generating the client, this tool validates the given GraphQL queries against the given GraphQL schema. A remote operation and the corresponding record types are generated for each given GraphQL query. The generated Ballerina client can be used to execute queries (i.e., that belong to one of the operation types, `query` or `mutation`) on the relevant GraphQL API through the generated remote operations.

Also, you can generate a Ballerina client using multiple GraphQL documents or generate multiple Ballerina modules per GraphQL API endpoint. For information, see [Advanced use cases](/learn/graphql-client-tool/#advanced-use-cases).

## Generate a client from a GraphQL config

> **Prerequisites:** Install the <a href="https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql" target="_blank">GraphQL Foundation VSCode plugin</a> and the latest <a href="https://ballerina.io/downloads/" target="_blank">Ballerina Swan Lake distribution</a>.

Follow the steps below to generate a Ballerina client from a GraphQL config file using the `graphql` CLI tool.

### Create a Ballerina package

Create a Ballerina package using the `bal new` command.

### Add the GraphQL document

Create a directory called `queries` in the Ballerina package root directory. Add a GraphQL document file (`query-country.graphql`) to this directory.

### Create a GraphQL config

Create a GraphQL config file (`graphql.config.yaml`) in the Ballerina package root directory with the configurations below.

```yml
## The GraphQL schema. E.g., https://countries.trevorblades.com or ./schemas/country.graphql
schema: https://countries.trevorblades.com
## The GraphQL documents that have queries/mutations
documents:
   - ./queries/query-country.graphql
```

In general you can use the configuration format given below.

```yml
schema: <File path to the GraphQL schema or the web URL of the GraphQL schema>
documents:
   - <File path to the GraphQL document with the GraphQL queries & mutations>
```

The GraphQL Foundation VSCode plugin requires a GraphQL config file at the root level or in a parent-level directory. The Ballerina GraphQL client tool supports only the standard `graphql.config.yaml` format as input. For more information, see the <a href="https://www.graphql-config.com" target="_blank">GraphQL config</a>.

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

### Add the GraphQL queries

Add the GraphQL queries to the GraphQL document file (i.e., `query-country.graphql`). 

For example, the `query-country.graphql` file have the content below.

```graphql
## Add the queries and mutations here.

query countryByCode($code: ID!) {
    country(code: $code) {
        name
    }
}
```

You can validate and execute the GraphQL queries using the >GraphQL Foundation VSCode plugin.

>**Note:** You are required to give a query name for each query. This name is used as the corresponding remote operation name in the generated client. 

### Execute the `graphql` CLI command

If you want to generate the Ballerina client for a given GraphQL document, use the command below.

```
bal graphql -i graphql.config.yaml
```

This generates the Ballerina sources (i.e., the three Ballerina files below) from the given GraphQL config.

1. `client.bal` - contains the Ballerina client with remote operations corresponding to each GraphQL query/mutation in the GraphQL document
2. `utils.bal` - contains all the utility methods related to the client stub
3. `types.bal`- contains all the Ballerina data types extracted from the GraphQL schema (SDL)
4. `config_types.bal` - contains all the Ballerina data types related to connector configuration

The example above generates the client file below.

```ballerina
import ballerina/http;
import ballerina/graphql;

public isolated client class GraphqlClient {
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

In general you can use the command format given below.

```
bal graphql [-i | --input] <graphql-configuration-file-path> [-o | --output] <output-location> 
```

This generates a Ballerina client with remote operations corresponding to each GraphQL query/mutation in the GraphQL document (`.graphql document`). The generated sources gets written into the same directory from which the command is executed (i.e., the Ballerina package root directory). For more information, see [GraphQL to Ballerina](/learn/cli-documentation/graphql/#graphql-to-ballerina).

The above command can be run from anywhere on the execution path. It is not mandatory to run it from within a Ballerina package.

### Sample usage of the generated client

Use the generated client to execute the queries/mutations on the GraphQL API. The example below shows the usage of the generated client in a Ballerina program. Make sure you have copied the generated files into the root of the Ballerina package.

1. Copy the generated files into the root of the Ballerina package.

2. Add a Ballerina file called `main.bal` with the content below into the root of the Ballerina package.

   ```ballerina
   import ballerina/io;

   public function main() returns error? {
      GraphqlClient countryClient = check new ("https://countries.trevorblades.com/");
      CountryByCodeResponse response = check countryClient->countryByCode("LK");
      io:println(response.country?.name);
   }
   ```

3. Build and run the Ballerina package by using the `bal run` command.

You can also use the `graphql` CLI tool to generate a Ballerina module. For more information, see [Generate multiple modules from a GraphQL config](/learn/graphql-client-tool/#generate-multiple-modules-from-a-graphql-config).

## Advanced use cases

### Generate a single client from multiple GraphQL documents

Follow the steps below to generate a Ballerina client from a GraphQL config file configured with a GraphQL schema (SDL) and multiple GraphQL documents using the `graphql` CLI tool. This client consists of all the remote operations related to the specified document files.

1. Create a Ballerina package. For more information, see [Package commands](/learn/cli-documentation/cli-commands/#package-commands).

2. Create a GraphQL config file (`graphql.config.yaml`) in the Ballerina package root directory with the configurations below.

   ```yml
   schema: <File path to the GraphQL schema or the web URL of the GraphQL schema>
   documents:
      - <File path to the GraphQL document with the GraphQL queries & mutations>
      - <File path to the GraphQL document with the GraphQL queries & mutations>
      - <File path to the GraphQL document with the GraphQL queries & mutations>
      - <Add more documents based on your requirement …>
   ```

To generate the Ballerina client for a given set of GraphQL documents, use the command below.

```
bal graphql [-i | --input] <graphql-configuration-file-path> [-o | --output] <output-location> 
```

This generates a single Ballerina client to represent all the GraphQL documents with remote operations corresponding to each GraphQL query/mutation in the GraphQL document (`.graphql document`). The generated sources are written into the same directory from which the command is executed (i.e., the Ballerina package root directory). For example,

```
bal graphql -i graphql.config.yaml
```

This generates the Ballerina sources (i.e., the Ballerina files below) from the given GraphQL config.

1. `client.bal` - contains the Ballerina client to represent all the remote operations in each GraphQL document
2. `utils.bal` - contains all the utility methods related to the client stub
3. `types.bal`- contains all the Ballerina data types extracted from the GraphQL schema (SDL)
4. `config_types.bal` - contains all the Ballerina data types related to connector configuration

The generated clients can be used to execute the queries/mutations on the GraphQL API. You can use the generated client within a Ballerina program in the same Ballerina package.

You can also use the `graphql` CLI command to generate a Ballerina module. For more information, see [Generate multiple modules from a GraphQL config](/learn/graphql-client-tool/#generate-multiple-modules-from-a-graphql-config).

### Generate multiple modules from a GraphQL config

Follow the steps below to generate multiple Ballerina modules from a GraphQL config file configured with multiple GraphQL projects using the `graphql` CLI tool. Each project generates a separate Ballerina module. This enables you to work with multiple GraphQL APIs by configuring each GraphQL API endpoint under a separate project.

1. Create a Ballerina package. For more information, see [Package commands](/learn/cli-documentation/cli-commands/#package-commands).

2. Create a GraphQL config file (`graphql.config.yaml`) in the Ballerina package root directory with the configurations below.

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

```
bal graphql [-i | --input] <graphql-configuration-file-path> [-o | --output] <output-location> 
```

This generates a separate Ballerina module for each GraphQL project. The generated sources are written into individual modules in the Ballerina package. For example,

```
bal graphql -i graphql.config.yaml
```

This generates a separate Ballerina module (with the project name configured) for each GraphQL project in the GraphQL config. This also generates the Ballerina sources (i.e., the Ballerina files below) inside each module.

1. `client.bal` - contains the Ballerina client to represent all the remote operations in each GraphQL document
2. `utils.bal` - contains all the utility methods related to the client stub
3. `types.bal`- contains all the Ballerina data types extracted from the GraphQL schema (SDL)
4. `config_types.bal` - contains all the Ballerina data types related to connector configuration

You can use the generated modules to work with multiple GraphQL APIs. Use the client that is generated within each module to execute the queries/mutations on the relevant GraphQL API. Also, use the clients that are generated **within** the same Ballerina package by importing the generated modules. For more information, see [Import a module from the same package](/learn/organize-ballerina-code/#import-a-module-from-the-same-package).