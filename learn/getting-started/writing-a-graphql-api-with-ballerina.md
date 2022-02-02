---
layout: ballerina-graphql-guide-left-nav-pages-swanlake
title: Writing a GraphQL API with Ballerina
description: This guide helps you understand the basics of Ballerina constructs which allow you to write GraphQL APIs.
keywords: ballerina, graphql, ballerina packages, language-guide, standard library
permalink: /learn/writing-a-graphql-api-with-ballerina/
active: language-basics
intro: This guide walks through the steps of writing a GraphQL API in Ballerina.
---

Due to the batteries included nature of the Ballerina language, there is no need to add any third-party libraries to implement the GraphQL API. The Ballerina standard library itself is adequate. In this guide, you will be writing a simple GraphQL service to serve a dummy dataset related to COVID-19.

## Setting up the Prerequisites

To complete this tutorial, you need:

1. A command terminal
2. A text editor
    >**Tip:** Preferably, [Visual Studio Code](https://code.visualstudio.com/) with the [Ballerina extension](https://marketplace.visualstudio.com/items?itemName=WSO2.ballerina) installed.
3. A [Ballerina installation](https://ballerina.io/learn/installing-ballerina/setting-up-ballerina/)

## Designing the GraphQL Endpoint

Usually, a GraphQL endpoint is defined using a GraphQL schema. Some languages require the GraphQL schema to create a
GraphQL service (schema-first approach) while others do not need the schema to create the service
(code-first approach). Ballerina GraphQL package uses the latter. Therefore, you do not need the schema file to create
your service, and instead, once you write the Ballerina service, the Ballerina GraphQL package will generate the schema.

The GraphQL endpoint you are going to create in this guide will have two main operations, `Query` and `Mutation`. The
`Query` type will be used to read the data in the data source, and the `Mutation` operation will be used to update the
data in the data source.

### The `Query` Type
The `Query` type has two fields.
* The `all` field - This field will return all the data in the data source as an array.

* The `filter` field - This field will return the data filtered by the ISO Code of a country(`isoCode`).

### The `Mutation` Type
The `Mutation` type has a single field.
* The `add` field - This field will add a given entry to the data source.

## Creating a Datasource for the Project

Before writing the GraphQL service, let's create a data source for the project. This will mimic a database that stores
the data for the service. In this guide, you are going to use an in-memory table in Ballerina as the data source.

### Defining the Types for the Datasource

 To create the table, you have to define the data type to use in the table. The following code defines the record type
 `CovidEntry`. A single entry will include the ISO code for the location (`isoCode`), name of the country (`country`),
 number of cases (`cases`), number of deaths (`deaths`), number of recovered cases (`recovered`), and the number of
 active cases (`active`).

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

### Adding Data to the Datasource
Now you can add define the data table.

```ballerina
table<CovidEntry> key(isoCode) covidEntriesTable = table [
    {isoCode: "AFG", country: "Afghanistan", cases: 159303, deaths: 7386, recovered: 146084, active: 5833},
    {isoCode: "SL", country: "Sri Lanka", cases: 598536, deaths: 15243, recovered: 568637, active: 14656},
    {isoCode: "US", country: "USA", cases: 69808350, deaths: 880976, recovered: 43892277, active: 25035097}
];
```
Now, as the data source is completed, let's move on to writing the GraphQL service.

## Writing the Ballerina Service

Since the data used in this guide map to a GraphQL `Object`, you first have to define this object type. In Ballerina, a
GraphQL output object can be defined using either a service type or a record type.

In this guide, the endpoint is going to return the number of cases in thousands. Therefore, a service type is used to
define the output object type, and inside the service type, each resource function will return the original value
divided by 1000.

> **Note:** Since the GraphQL spec does not allow using an input object as an output object, the same record type cannot
> be used as the input type of a method and the output type of a method.

### Creating the GraphQL Object Types

The following is the definition of the `CovidData` object type.

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

Here, you are creating the `CovidData` service type to represent the GraphQL `Object` type that represents an entry in
the data set. Each resource method in this service represents a field of the GraphQL object type.  The return type of
the resource method is the type of the field.
The resource methods returning `isoCode` and the `country` have the return type `string`, which means these fields
cannot be `null` in the GraphQL response. In other words, these fields have `NON_NULL` types. (In GraphQL, these are
represented by the exclamation mark `!`. E.g., `String!`). However, the resource methods returning numbers can return `null`
values. Therefore, the type of fields represented by those resource methods is nullable.

> **Note:**  The `decimal` type is used as a return type. This will add a `Scalar` type named `Decimal` to the GraphQL
> schema, which will be generated by the Ballerina GraphQL package.

### Writing the GraphQL Service

Now you are all set to write the GraphQL service. To write the service, you need to create a GraphQL listener object.
To create a listener object, you need to import the Ballerina GraphQL package.

```ballerina
import ballerina/graphql;

service /covid19 on new graphql:Listener(9000) {

}
```

In the above code snippet, the path of this service is defined as `/covid19`. If you want to host the service on the
root, you can remove the path as the following code snippet:

```ballerina
import ballerina/graphql;

service on new graphql:Listener(9000) {

}
```

When creating the `graphql:Listener` object, you need to provide the port to which it is listening. Alternatively, an
existing `http:Listener` object can also be used to initialize the `graphql:Listener` as below.

```ballerina
import ballerina/graphql;
import ballerina/http;

listener http:Listener httpListener = check new(9000);

service /covid19 on new graphql:Listener(httpListener) {

}
```

This is as same as the first code snippet above, which will listen on the port `9000` and serve on `/covid19`.

Now, create the service methods.

As per the design, there are two fields in the `Query` type and one field in the `Mutation` type in your GraphQL
service. The fields of the `Query` type are represented by resource methods in Ballerina, while The fields of the
`Mutation` type are represented by the remote methods in Ballerina.

Let's first create the `all` field. This should return an array of `CovidData` type.

```ballerina
import ballerina/graphql;

service /covid19 on new graphql:Listener(9000) {
    resource function get all() returns CovidData[] {
        CovidEntry[] covidEntries = covidEntriesTable.toArray().cloneReadOnly();
        return covidEntries.map(entry => new CovidData(entry));
    }
}
```

> **Note:** A Ballerina GraphQL resource or remote method can return a `table` as well. When a method is returning a
> `table`, the corresponding GraphQL field type is a `LIST` type.

The resource method definition has the accessor `get`, which is used to identify the resource methods as a field of the
`Query` type. No other accessor is allowed. Then comes the name of the field. The return type is the type of the field.

The above resource method first retrieves the array of `CovidEntry` records from the data source as an array, then
returns an array of `CovidData` service type array as the result using the built-in `map` function.

Similarly, you can define another resource method to add the `filter` field.

>**Note:** This field has an input `isoCode` to filter the data.

```ballerina
resource function get filter(string isoCode) returns CovidData? {
    CovidEntry? covidEntry = covidEntriesTable[isoCode];
    if covidEntry is CovidEntry {
        return new (covidEntry);
    }
    return;
}
```

In the above resource method, the `filter` field is defined in the root `Query` type. Since this field has an
input parameter `isoCode`, you have to add an input parameter to the resource method. This method returns the
corresponding data for the given `isoCode` if such data is available in our data set, otherwise, it returns `null`.

As the `Query` type is completed now, you need to define the `Mutation` type using remote methods.

Let's define a remote method to add an entry to our data source:

```ballerina
remote function add(CovidEntry entry) returns CovidData {
    covidEntriesTable.add(entry);
    return new CovidData(entry);
}
```

This method requires a `CovidEntry` record as the input. When a remote or resource method has a record type as an
input, it will be mapped to a GraphQL input object type. Therefore, this cannot be used as an output type.

Below is the complete code for the Ballerina GraphQL service:
```ballerina
import ballerina/graphql;

public type CovidEntry record {|
    readonly string isoCode;
    string country;
    decimal cases?;
    decimal deaths?;
    decimal recovered?;
    decimal active?;
|};

table<CovidEntry> key(isoCode) covidEntriesTable = table [
    {isoCode: "AFG", country: "Afghanistan", cases: 159303, deaths: 7386, recovered: 146084, active: 5833},
    {isoCode: "SL", country: "Sri Lanka", cases: 598536, deaths: 15243, recovered: 568637, active: 14656},
    {isoCode: "US", country: "USA", cases: 69808350, deaths: 880976, recovered: 43892277, active: 25035097}
];

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

service /covid19 on new graphql:Listener(9000) {
    resource function get all() returns CovidData[] {
        CovidEntry[] covidEntries = covidEntriesTable.toArray().cloneReadOnly();
        return covidEntries.map(entry => new CovidData(entry));
    }

    resource function get filter(string isoCode) returns CovidData? {
        CovidEntry? covidEntry = covidEntriesTable[isoCode];
        if covidEntry is CovidEntry {
            return new (covidEntry);
        }
        return;
    }

    remote function add(CovidEntry entry) returns CovidData {
        covidEntriesTable.add(entry);
        return new CovidData(entry);
    }
}
```

Now, you can run this service to serve a GraphQL API to our data source. To run, execute the following command:

```shell
bal run
```

> **Note:** The console should have warning logs related to the isolatedness of resources. It is a built-in service concurrency safety feature of Ballerina.

If you connect to this service using any GraphQL client tools, it will show the following schema.

```graphql
type CovidData {
    isoCode: String!
    country: String!
    cases: Decimal
    recovered: Decimal
    active: Decimal
    deaths: Decimal
}

input CovidEntry {
    isoCode: String!
    country: String!
    cases: Decimal
    recovered: Decimal
    active: Decimal
    deaths: Decimal
}

Scalar Decimal

type Query {
    all: [CovidData!]!
    filter(isoCode: String!): CovidData
}

type Mutation {
    add(entry: CovidEntry!): CovidData!
}
```

## Accessing the GraphQL Endpoint

To access the endpoint, you can use cURL or a GraphQL client such as [GraphiQL](https://github.com/graphql/graphiql).

The following cURL request will retrieve all the data from the endpoint:

```shell
curl -X POST -H "Content-type: application/json" -H "scope: unknown" -d '{ "query": "query { all { country cases active}  }" }' 'http://localhost:9000/covid19'
```

In this request, an HTTP POST request is sent to the GraphQL endpoint. The request body contains the GraphQL query.

The result of this request is the following JSON.

```JSON
{
  "data": {
    "all": [
      {
        "country": "Afghanistan",
        "cases": 159.303,
        "active": 5.833
      },
      {
        "country": "Sri Lanka",
        "cases": 598.536,
        "active": 14.656
      },
      {
        "country": "USA",
        "cases": 69808.35,
        "active": 25035.097
      }
    ]
  }
}
```
