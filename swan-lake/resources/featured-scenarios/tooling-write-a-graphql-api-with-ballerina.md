---
layout: ballerina-graphql-guide-left-nav-pages-swanlake
title: Write a GraphQL API with Ballerina
description: This guide walks through the steps of writing a GraphQL API in Ballerina.
keywords: ballerina, graphql, ballerina packages, language-guide, Ballerina library
permalink: /learn/write-a-graphql-api-with-ballerina/
active: write-a-graphql-api-with-ballerina
intro: This guide walks you through writing a simple GraphQL service to serve a dummy dataset related to COVID-19.
---

>**Info:** Due to the batteries-included nature of the Ballerina language, there is no need to add any third-party libraries to implement the GraphQL API. The Ballerina library itself is adequate. 

## Set up the prerequisites

To complete this tutorial, you need:

1. [Ballerina 2201.8.4 (Swan Lake)](/downloads/) or greater
2. <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the  <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina extension</a> installed

## Design the GraphQL endpoint

Usually, a GraphQL endpoint is defined using a GraphQL schema. Some languages require the GraphQL schema to create a GraphQL service (schema-first approach) while others do not need the schema to create the service (code-first approach). Ballerina GraphQL package uses the latter. Therefore, you do not need the schema file to create your service, and instead, once you write the Ballerina service, the Ballerina GraphQL package will generate the schema.

The GraphQL endpoint you will create in this guide will have two main operations, `Query` and `Mutation`. The `Query` type will be used to read the data in the data source, and the `Mutation` operation will be used to update the data in the data source.

### The `Query` type
The `Query` type has two fields.
* The `all` field - This field will return all the data in the data source as an array.
* The `filter` field - This field will return the data filtered by the ISO Code of a country(`isoCode`).

### The `Mutation` type
The `Mutation` type has a single field.
* The `add` field - This field will add a given entry to the data source.


## Create the service package 

Ballerina uses packages to group code. Follow the steps below to create a Ballerina package and write the business logic. 

> **Info:** For more information on Ballerina packages, see [Organize Ballerina code](/learn/organize-ballerina-code/).

1. In the terminal, execute the command below to create the Ballerina package for the API implementation.

    ```
    $ bal new covid19 -t service
    ```

    You can view the output below.

    ```
    Created new package 'covid19' at covid19.
    ```

    This creates a directory named `covid19` with the default module along with a sample code for the service, as shown below. 

    ```
    .
    ├── covid19
    │   ├── Ballerina.toml
    │   └── service.bal
    ```

    - `Ballerina.toml` is the file that makes the folder a Ballerina package. It also contains a test directory to include tests for the service. However, this will not be used in this guide. 
    - The `service.bal` template file provides a look and feel about Ballerina services. 

2. In the terminal, navigate to the directory of the created package and execute the `code .` command to open it in VS Code.

## Create the data source 

Before writing the GraphQL service, let's create a data source for the project. This will mimic a database that stores the data for the service using an in-memory table in Ballerina as the data source.

### Define the types for the data source

Follow the steps below to add the definitions of the data types and the declaration of the table.

1. Remove the auto-generated content of the API template file (i.e., `service.bal`) and open the **Overview Diagram** view in VS Code.

   <GIF>

2. Generate the record types corresponding to the payload from the REST service by providing the sample JSON object below.

    ```json
    {
        "iso_code": "AFG",
        "country": "Afghanistan",
        "cases": 159303,
        "deaths": 7386,
        "recovered": 146084,
        "active": 5833
    }
    ```
    <GIF>

The generated record will be as follows.

```ballerina
public type CovidEntry record {|
    readonly string isoCode;
    string country;
    decimal cases?;
    decimal deaths?;
    decimal recovered?;
    decimal active?;
|};
```

In this code:
- The record type `CovidEntry` is defined.
- A single entry will include the ISO code for the location (`isoCode`), name of the country (`country`), number of cases (`cases`), number of deaths (`deaths`), number of recovered cases (`recovered`), and the number of active cases (`active`).

### Add data to the data source

Follow the steps below to define the data table.

1. Create the table, as shown below.

    <GIF>

2. Replace the `{key: value}` of the generated table with the code below.

    ```
    ```

The generated record and the table will be as follows.

```ballerina
table<CovidEntry> key(isoCode) covidEntriesTable = table [
    {isoCode: "AFG", country: "Afghanistan", cases: 159303, deaths: 7386, recovered: 146084, active: 5833},
    {isoCode: "SL", country: "Sri Lanka", cases: 598536, deaths: 15243, recovered: 568637, active: 14656},
    {isoCode: "US", country: "USA", cases: 69808350, deaths: 880976, recovered: 43892277, active: 25035097}
];
```

## Create the object types

Since the data used in this guide map to a GraphQL Object, you first have to define this object type. In Ballerina, a GraphQL output object can be defined using either a service type or a record type.

> **Note:** Since the GraphQL spec does not allow using an input object as an output object, the same record type cannot be used as the input type of a method and the output type of a method.

To add the definition of the `CovidData` object type, add the code below to the `service.bal` file.

```ballerina
public distinct service class CovidData {
    private final readonly & CovidEntry entryRecord;

    function init(CovidEntry entryRecord) {
        self.entryRecord = entryRecord.cloneReadOnly();
    }

    resource function get isoCode() returns string {
        return self.entryRecord.isoCode;
    }

    resource function get country() returns string {
        return self.entryRecord.country;
    }

    resource function get cases() returns decimal? {
        if self.entryRecord.cases is decimal {
            return self.entryRecord.cases / 1000;
        }
        return;
    }

    resource function get deaths() returns decimal? {
        if self.entryRecord.deaths is decimal {
            return self.entryRecord.deaths / 1000;
        }
        return;
    }

    resource function get recovered() returns decimal? {
        if self.entryRecord.recovered is decimal {
            return self.entryRecord.recovered / 1000;
        }
        return;
    }

    resource function get active() returns decimal? {
        if self.entryRecord.active is decimal {
            return self.entryRecord.active / 1000;
        }
        return;
    }
}
```

In this code:
- The endpoint returns the number of cases in thousands. Therefore, a service type is used to define the output object type, and inside the service type, each resource method will return the original value
divided by `1000`.
- The `CovidData` service type represents the GraphQL `Object` type, which represents an entry in
the data set. 
- Each resource method in this service represents a field of the GraphQL object type.  The return type of
the resource method is the type of the field.
- The resource methods returning `isoCode` and the `country` have the return type `string`, which means these fields
cannot be `null` in the GraphQL response. In other words, these fields have `NON_NULL` types. (In GraphQL, these are
represented by the exclamation mark `!`. E.g., `String!`). However, the resource methods returning numbers can return `null` values. Therefore, the type of fields represented by those resource methods is nullable.
- The `decimal` type is used as a return type. This will add a `Scalar` type named `Decimal` to the GraphQL schema, which will be generated by the Ballerina GraphQL package.

## Create the service

Create the service using the [Ballerina HTTP API Designer](/learn/vs-code-extension/design-the-services/http-api-designer/) in VS Code, as shown below.

<GIF>

The generated REST service will be as follows.

```ballerina
service /covid/status on new http:Listener(9000) {
    resource function get .() returns error? {
    }
}
```