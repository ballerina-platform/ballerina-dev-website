---
layout: ballerina-graphql-support-left-nav-pages-swanlake
title: GraphQL tool
description: Check out how the Ballerina GraphQL tool makes it easy to generate a GraphQL schema using a given Ballerina GraphQL service, generate a Ballerina service using a given GraphQL schema file, and generate a client in Ballerina using a given GraphQL config file.
keywords: ballerina, programming language, graphql, sdl, schema definition language
permalink: /learn/graphql-tool/
active: graphql-tool
intro: The Ballerina GraphQL tool makes it easy to start the development of a GraphQL. It generates the GraphQL schema for a given Ballerina GraphQL service and writes it to a file in GraphQL schema definition language (SDL). In addition, the GraphQL tool supports generating the Ballerina service skeletons for a given GraphQL schema. The GraphQL tool generates the client skeletons in Ballerina for a given GraphQL schema and a GraphQL document [Experimental].
---
## Usage

The Ballerina GraphQL tooling support provides the main capabilities below.

- [Service generation](#service-generation)
- [Schema generation](#schema-generation)
- [Client generation [Experimental]](#client-generation-experimental)

The general usage of the GraphQL tool is as follows.

```shell
$ bal graphql [-i | --input] <graphql-schema-file-path | graphql-service-file-path | graphql-config-file-path >
              [-o | --output] <output-location>
              [-m | --mode] <operation-mode>
              [-r | --use-records-for-objects]
              [-s | --service] <service-base-path>
```

## Command options

The general use of the above command options are as follows.

| Command option      | Description                                                                                                                                                                                                                                                                                                                                                                     | Usage |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| `-i, --input`     | The path of the GraphQL service file, schema file, or config file.                                                                                                                                                                                                   | <ul><li><a href="#service-generation-command-options">service generation</a></li><li><a href="#schema-generation-command-options">schema generation</a></li><li><a href="#client-generation-command-options">client generation</a></li></ul>          |
| `-o, --output`   | The path of the output location of the generated files.                                                                                                                                                                                                                    | <ul><li><a href="#service-generation-command-options">service generation</a></li><li><a href="#schema-generation-command-options">schema generation</a></li><li><a href="#client-generation-command-options">client generation</a></li></ul>           |
| `-m, --mode`   | The operation mode. The possible values are `schema`, `service`, and `client`.                                                                                                                                                                                                                 | <ul><li><a href="#service-generation-command-options">service generation</a></li><li><a href="#service-generation-command-options">service generation</a></li><li><a href="#client-generation-command-options">client generation</a></li></ul>           |
| `-r, --use-records-for-objects`   | Specifies to use record types for GraphQL object types whenever it is possible.                                                                                                                                                                                                                   | <ul><li><a href="#service-generation-command-options">service generation</a></li></ul>           |
| `-s, --service`   | The base path of the Ballerina GraphQL service of which the schema needs to be generated.                                                                                                                                                                                                                   | <ul><li><a href="#schema-generation-command-options">schema generation</a></li></ul>           |

## Service generation

The GraphQL tool supports generating a Ballerina GraphQL service from a given GraphQL schema. Successful execution will generate two files. One contains the service and the other contains the types needed. You can export the generated files to a given location. 

### Service generation usage

Execute the command below to generate a Ballerina service from a given GraphQL schema, which is specified by the GraphQL schema definition language.

```shell
$ bal graphql [-i | --input] <graphql-schema-file-path>
              [-o | --output] <output-location>
              [-m | --mode] <operation-mode>
              [-r | --use-records-for-objects]
```

### Service generation command options

| Command option      | Description                                                                                                                                                                                                                                                                                                                                                                     | Mandatory/Optional |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| `-i, --input`     | The `input` parameter specifies the path of the GraphQL schema file (e.g., `schema.graphql`) specified in Schema Definition Language.                                                                                                                                                                                                    | Mandatory          |
| `-o, --output`   | The `output` parameter specifies the path of the output location of the generated files. If this parameter is not specified, the Ballerina files will be generated at the same location where the GraphQL command is executed.                                                                                                                                                                                                                   | Optional           |
| `-m, --mode`   | The `mode` parameter specifies the operation mode. It indicates the way to process the schema file. If the `mode` flag is not specified, the `graphql` tool will infer the mode from the `input` file extension. The mode should be `service` for the service generation.                                                                                                                                                                                                                | Optional           |
| `-r, --use-records-for-objects`   | The `use-records-for-objects` parameter specifies to generate record types for GraphQL object types whenever it is possible. If this parameter is not specified, service class types will be generated for GraphQL object types.                                                                                                                                                                                                                  | Optional           |

The tool can be used in the following ways to generate a Ballerina GraphQL service.

### Generate a service with GraphQL object types represented in service class types

Execute the command below to generate service class types for GraphQL object types in the GraphQL schema.

```shell
$ bal graphql [-i | --input] <graphql-schema-file-path> [-m | --mode] <operation-mode> [-o | --output <output-location>]
```

For example, see the command below.

```shell
$ bal graphql -i schema.graphql -m service -o ./service
```

The output flag is optional. If it is omitted, the generated files will be written to the current directory. 

>**Info:** For more information on the command, see [Service generation command options](#service-generation-command-options).

### Generate a service with GraphQL object types represented in record types

Execute the command below to generate record types for GraphQL object types in the GraphQL schema. 

```shell
$ bal graphql [-i | --input] <graphql-schema-file-path> [-m | --mode] <operation-mode> [-o | --output <output-location>] [-r | --use-records-for-objects]
```

For example, see the command below.

```shell
$ bal graphql -i schema.graphql -m service -o ./service -r
```

Even if the `[-r | --use-records-for-objects]` flag is used, the following object types will be generated using the service types because these types cannot be represented by Ballerina record types.

- types having a field with input arguments
- types being a subtype of a union type
- types implementing an interface

>**Info:** For more information on the command, see [Service generation command options](#service-generation-command-options).

## Schema generation

The GraphQL tool supports generating the GraphQL schema for a given Ballerina GraphQL service and writing it to a file using the GraphQL schema definition language (SDL). You will be able to export the generated schema file to the given location.

### Schema generation usage

Execute the command below to generate the GraphQL schema for a given Ballerina GraphQL service(s) and write the schema(s) to a file/files using the GraphQL schema definition language.

```shell
$ bal graphql [-i | --input] <ballerina-graphql-service-file-path>
              [-o | --output] <output-location>
              [-s | --service] <service-base-path>
```

### Schema generation command options

| Command option      | Description                                                                                                                                                                                                                                                                                                                                                                     | Mandatory/Optional |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| `-i, --input`     | The `input` command option specifies the path of the Ballerina GraphQL service file (e.g., `service.bal`).                                                                                                                                                                                                    | Mandatory          |
| `-o, --output`   | The `output` command option specifies the output location of the generated GraphQL schema files. If this command option is not specified, the schema files will be generated at the same location in which the `bal graphql` command is executed.                                                                                                                                                                                                                   | Optional           |
| `-m, --mode`   | The `mode` parameter specifies the operation mode. It indicates the way to process the schema file. If the `mode` flag is not specified, the `graphql` tool will infer the mode from the `input` file extension. The mode should be `schema` for the schema generation.                                                                                                                                                                                                                | Optional           |
| `-s, --service`   | The `service` command option specifies the base path of the Ballerina GraphQL service of which the schema needs to be generated. If this command option is not specified, schemas will be generated for each of the GraphQL services in the given file.                                                                                                                                                                                                                  | Optional           |

The tool can be used in the following ways to generate the schema.

### Generate GraphQL schemas for all services

If your Ballerina file includes multiple GraphQL services, this command generates the GraphQL schema for each service in the Ballerina file.

```shell
$ bal graphql [-i | --input] <ballerina-service-file-path> [(-o | --output) <output-location>]
```

For example,

```shell
$ bal graphql -i service.bal -o ./schema
```

The `input` command option specifies the path of the ballerina service file (e.g., `service.bal`) and is mandatory.

>**Info:** For more information on the command, see [Schema generation command options](#schema-generation-command-options).

### Generate a schema for a specific service

If your Ballerina file includes multiple GraphQL services, this command can be used to generate the GraphQL schema for a specific service. For this schema generation to work properly, the input Ballerina GraphQL services should be defined as the service declarations.

```shell
$ bal graphql [-i | --input] <ballerina-service-file-path> [(-o | --output) <output-location>] [(-s | --service) <service-base-path>]
```

For example,

```shell
$ bal graphql -i service.bal -o ./schema -s /starwars
```

The `service` command option specifies the base path of the Ballerina GraphQL service of which the schema needs to be generated. This generates the GraphQL schema for the Ballerina GraphQL service in the `service.bal` file of which the `service-base-path` is `/starwars`.

>**Info:** For more information on the command, see [Schema generation command options](#schema-generation-command-options).

## Client generation [Experimental]

The Ballerina GraphQL tool makes it easy to generate a client in Ballerina using a given GraphQL schema (SDL) and GraphQL queries. The GraphQL client generation is an experimental feature which supports only a limited set of functionality.

### Client generation usage

The tool supports two client generation usages as follows.

- Generate a Ballerina client from a given GraphQL config file configured with a GraphQL schema, which is specified by the GraphQL schema definition language and a GraphQL document/documents.

- Generate multiple Ballerina modules from a given GraphQL config file configured with multiple GraphQL projects.

   ```shell
   $ bal graphql [-i | --input] <graphql-configuration-file-path>
                 [-o | --output] <output-location>
   ```

This generates a Ballerina client with remote operations corresponding to each GraphQL query/mutation in the GraphQL document (`.graphql` file). The generated sources gets written into the same directory from which the command is executed (i.e., the Ballerina package root directory).

The above command can be run from anywhere on the execution path. It is not mandatory to run it from within a Ballerina package.

### Client generation command options

| Command option      | Description                                                                                                                                                                                                                                                                                                                                                                     | Mandatory/Optional |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| `-i, --input`     | The `input` command option specifies the path of the GraphQL config file (e.g., `graphql.config.yaml`) configured with GraphQL schemas specified by the Schema Definition Language and GraphQL documents.                                                                                                                                                                                                   | Mandatory          |
| `-o, --output`   | The `output` command option specifies the path of the output location of the generated files. If this command option is not specified, the Ballerina files will be generated at the same location in which the `bal graphql` command is executed.                                                                                                                                                                                                                   | Optional           |
| `-m, --mode`   | The `mode` parameter specifies the operation mode. It indicates the way to process the schema file. If the `mode` flag is not specified, the `graphql` tool will infer the mode from the `input` file extension. The mode should be `client` for the client generation.                                                                                                                                                                                                               | Optional           |

When generating the client, this tool validates the given GraphQL queries against the given GraphQL schema. A remote operation and the corresponding record types are generated for each given GraphQL query. The generated Ballerina client can be used to execute queries (i.e., that belong to one of the operation types, `query` or `mutation`) on the relevant GraphQL API through the generated remote operations.

Also, you can generate multiple clients using multiple GraphQL documents or generate multiple Ballerina modules per GraphQL API endpoint. For information, see [Advanced use cases](/learn/graphql-tool/#advanced-use-cases).

### Generate a client from a GraphQL config

Follow the steps below to generate a Ballerina client from a GraphQL config file using the `graphql` CLI tool.

1. Create a Ballerina package using the `bal new` command.

2. Create a directory called `queries` in the Ballerina package root directory and create a file with `.graphql` extension (i.e., `query-country.graphql`) inside the `queries` directory. Add the GraphQL queries to this file.

   Example:

   ```graphql
   ## Add the queries and mutations here.

   query countryByCode($code: ID!) {
      country(code: $code) {
         name
      }
   }
   ```

   You can validate and execute the GraphQL queries using the [GraphQL Foundation VSCode plugin](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql).

   You are required to give a name for each query. This name is used as the corresponding remote operation name in the generated client.

3. Create a GraphQL config file (`graphql.config.yaml`) in the Ballerina package root directory with the configurations below.

   ```yml
   schema: <File path to the GraphQL schema or the web URL of the GraphQL schema>
   documents:
      - <File path to the GraphQL document with the GraphQL queries & mutations>
   ```

   Example:

   ```yml
   ## The GraphQL schema. E.g., https://countries.trevorblades.com or ./schemas/country.graphql
   schema: https://countries.trevorblades.com
   ## The GraphQL documents that have queries/mutations
   documents:
      - ./queries/query-country.graphql
   ```

   The GraphQL Foundation VS Code plugin requires a GraphQL config file at the root level or in a parent-level directory. The Ballerina GraphQL tool supports only the standard `graphql.config.yaml` format as input. For more information, see the [GraphQL config](https://the-guild.dev/graphql/config/docs).

4. If the GraphQL API is secured, add the extensions section in the GraphQL config file with the relevant tokens and headers. In this scenario, it is mandatory to configure the schema section with the web URL of the GraphQL schema as shown below.

   ```yml
   schema: <The web URL of the GraphQL schema.>
   documents:
      - <File path to the GraphQL document with the GraphQL queries & mutations>
   extensions:
      endpoints:
         default:
            headers: {
               "Authorization": "Bearer token",
               "API_Header_Key1": "API_Header_Value1",
               "API_Header_Key2": "API_Header_Value2"
            }

   ```

5. To generate the Ballerina client for a given GraphQL document, use the command below.

   ```shell
   $ bal graphql -i graphql.config.yaml
   ```

This generates the Ballerina sources (i.e., the four Ballerina files below) from the given GraphQL config.

1. `client.bal` - contains the Ballerina client with remote operations corresponding to each GraphQL query/mutation in the GraphQL document
2. `utils.bal` - contains all the utility methods related to the client stub
3. `types.bal`- contains all the Ballerina data types extracted from the GraphQL schema (SDL)
4. `config_types.bal` - contains all the Ballerina data types related to connector configuration

#### Sample usage of the generated client

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

You can also use the `graphql` CLI tool to generate a Ballerina module. For more information, see [Generate multiple modules from a GraphQL config](/learn/graphql-tool/#generate-multiple-modules-from-a-graphql-config).

### Advanced use cases

#### Generate multiple clients from a GraphQL config

Follow the steps below to generate a Ballerina client from a GraphQL config file configured with a GraphQL schema (SDL) and multiple GraphQL documents using the `graphql` CLI tool. This client consists of all the remote operations related to the specified document files.

1. Create a Ballerina package. For more information, see [Package commands](/learn/cli-commands/#package-commands).

2. Create a GraphQL config file (`graphql.config.yaml`) in the Ballerina package root directory with the configurations below.

   ```yml
   schema: <File path to the GraphQL schema or the web URL of the GraphQL schema>
   documents:
      - <File path to the GraphQL document with the GraphQL queries & mutations>
      - <File path to the GraphQL document with the GraphQL queries & mutations>
      - <File path to the GraphQL document with the GraphQL queries & mutations>
      - <Add more documents based on your requirement …>
   ```

3. To generate the Ballerina client for a given set of GraphQL documents, use the command below.

   ```shell
   $ bal graphql -i graphql.config.yaml
   ```

This generates a single Ballerina client to represent all the GraphQL documents with remote operations corresponding to each GraphQL query/mutation in the GraphQL document (`.graphql` file). The generated sources are written into the same directory from which the command is executed (i.e., the Ballerina package root directory). This generate four files with same name as in generating client for single files.

The generated clients can be used to execute the queries/mutations on the GraphQL API. You can use the generated client within a Ballerina program in the same Ballerina package.

#### Generate multiple modules from a GraphQL config

Follow the steps below to generate multiple Ballerina modules from a GraphQL config file configured with multiple GraphQL projects using the GraphQL CLI tool. Each project generates a separate Ballerina module. This enables you to work with multiple GraphQL APIs by configuring each GraphQL API endpoint under a separate project.

1. Create a Ballerina package. For more information, see [Package commands](/learn/cli-commands/#package-commands).

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

3. To generate multiple Ballerina modules for a given set of GraphQL projects, use the command below.

   ```shell
   $ bal graphql -i graphql.config.yaml
   ```

This generates a separate Ballerina module (with the project name configured) for each GraphQL project in the GraphQL config. This also generates the Ballerina sources (i.e., the Ballerina files below) inside each module.

1. `client.bal` - contains the Ballerina client to represent all the remote operations in each GraphQL document
2. `utils.bal` - contains all the utility methods related to the client stub
3. `types.bal`- contains all the Ballerina data types extracted from the GraphQL schema (SDL)
4. `config_types.bal` - contains all the Ballerina data types related to connector configuration

You can use the generated modules to work with multiple GraphQL APIs. Use the client that is generated within each module to execute the queries/mutations on the relevant GraphQL API. Also, use the clients that are generated **within** the same Ballerina package by importing the generated modules. For more information, see [Import a module from the same package](/learn/organize-ballerina-code/#import-a-module-from-the-same-package).
