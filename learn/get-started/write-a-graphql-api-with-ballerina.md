---
layout: ballerina-graphql-guide-left-nav-pages-swanlake
title: Write a GraphQL API with Ballerina
description: This guide walks through the steps of writing a GraphQL API in Ballerina.
keywords: ballerina, graphql, ballerina packages, language-guide, standard library
permalink: /learn/write-a-graphql-api-with-ballerina/
active: write-a-graphql-api-with-ballerina
intro: This guide walks you through writing a simple GraphQL service to serve a dummy dataset related to COVID-19.
redirect_from:
    - /learn/writing-a-graphql-api-with-ballerina/
    - /learn/writing-a-graphql-api-with-ballerina
    - /learn/write-a-graphql-api-with-ballerina
    - /learn/getting-started/writing-a-graphql-api-with-ballerina/
    - /learn/getting-started/writing-a-graphql-api-with-ballerina
---

>**Info:** Due to the batteries included nature of the Ballerina language, there is no need to add any third-party libraries to implement the GraphQL API. The Ballerina standard library itself is adequate. 

## Set up the prerequisites

To complete this tutorial, you need:

1. [Ballerina 2202.0.0 (Swan Lake) ](https://ballerina.io/learn/installing-ballerina/setting-up-ballerina/) or greater
2. A text editor
    >**Tip:** Preferably, [Visual Studio Code](https://code.visualstudio.com/) with the [Ballerina extension](https://marketplace.visualstudio.com/items?itemName=WSO2.ballerina) installed.
3. A command terminal

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

Ballerina uses packages to group code. You need to create a Ballerina package, generate the service code in the package, and write the business logic.

>**Info:** For more information on Ballerina packages, see [Organize Ballerina code](/learn/organize-ballerina-code).

In the terminal, execute the command below to create the Ballerina package for the API implementation.

```bash
$ bal new covid19 -t service
```

You view the output below.

```bash
Created new package 'covid19' at covid19.
```

This creates a directory named `covid19` with the default module along with a sample code for the service as shown below.

```bash
.
├── covid19
│   ├── Ballerina.toml
│   └── service.bal
```

## Create the data source 

Before writing the GraphQL service, let's create a data source for the project. This will mimic a database that stores the data for the service using an in-memory table in Ballerina as the data source.

### Define the types for the data source

To define the data type to use in the table, replace the `service.bal` file with the code below. 


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

To define the data table, add the code below to the `service.bal` file. 

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
- The endpoint returns the number of cases in thousands. Therefore, a service type is used to define the output object type, and inside the service type, each resource function will return the original value
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

Now, you are all set to write the GraphQL service. To write the service, add the code below to the `service.bal` file.

```ballerina
import ballerina/graphql;

service /covid19 on new graphql:Listener(9000) {

}
```

>**Info:** The path of this service is defined as `/covid19`. If you want to host the service on the
root, you can remove the path as the follows:

```ballerina
import ballerina/graphql;

service on new graphql:Listener(9000) {

}
```

>**Info:** When creating the `graphql:Listener` object, you need to provide the port to which it is listening. Alternatively, to use an existing `http:Listener` object, for initializing the `graphql:Listener`, add the code below to the `service.bal` file. 

```ballerina
import ballerina/graphql;
import ballerina/http;

listener http:Listener httpListener = check new(9000);

service /covid19 on new graphql:Listener(httpListener) {

}
```

>**Info:** The above is as same as the first code snippet above, which will listen on the port `9000` and serve on `/covid19`.

### Implement the service methods

As per the design, there are two fields in the `Query` type and one field in the `Mutation` type in your GraphQL service. The fields of the `Query` type are represented by the resource methods with the `get` accessor in Ballerina, while the fields of the `Mutation` type are represented by the remote methods in Ballerina.

#### Create `Query` type 

##### Create the `all` field resource function

To create the `all` field, which returns an array of `CovidData` type, add the code below to the `service.bal` file.

```ballerina
    resource function get all() returns CovidData[] {
        CovidEntry[] covidEntries = covidEntriesTable.toArray().cloneReadOnly();
        return covidEntries.map(entry => new CovidData(entry));
    }
}
```

> **Note:** A Ballerina GraphQL resource or remote method can return a `table` as well. When a method is returning a `table`, the corresponding GraphQL field type is a `LIST` type.

In this code:
- The resource method definition has the accessor `get`, which is used to identify the resource methods as a field of the `Query` type. 
- Then comes the name of the field. The return type is the type of the field.
- The above resource method first retrieves the array of `CovidEntry` records from the data source as an array, and then, returns an array of `CovidData` service type array as the result using the built-in `map` function.

##### Create the `filter` field resource function

To add the `filter` field, which is another resource method with an input `isoCode` to filter the data, add the code below to the `service.bal` file.

```ballerina
resource function get filter(string isoCode) returns CovidData? {
    CovidEntry? covidEntry = covidEntriesTable[isoCode];
    if covidEntry is CovidEntry {
        return new (covidEntry);
    }
    return;
}
```

In this code:
- The `filter` field is defined in the root `Query` type. Since this field has an input parameter `isoCode`, you have to add an input parameter to the resource method. 
- This method returns the corresponding data for the given `isoCode` if such data is available in the data set, and it returns `null` otherwise.

#### Create `Mutation` type 

##### Create the `add` field remote function

As the `Query` type is completed now, define the `Mutation` type using remote methods.

To define a remote method to add an entry to the data source, add the code below to the `service.bal` file.

```ballerina
remote function add(CovidEntry entry) returns CovidData {
    covidEntriesTable.add(entry);
    return new CovidData(entry);
}
```

In this code:
- This method requires a `CovidEntry` record as the input. 
- When a remote or resource method has a record type as an input, it will be mapped to a GraphQL input object type. Therefore, this cannot be used as an output type.

## The complete code

Below is the complete code for the Ballerina GraphQL service.

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

## Run the service

 Execute the command below to run this service to serve a GraphQL API to the data source.

```shell
bal run
```

You view the output below.

>**Info:** The console has warning logs related to the isolatedness of resources. It is a built-in service concurrency safety feature of Ballerina.

```bash
Compiling source
	user/graphql:0.1.0
WARNING [service.bal:(25:5,25:5)] concurrent calls will not be made to this method since the service and the method are not 'isolated'
WARNING [service.bal:(29:5,29:5)] concurrent calls will not be made to this method since the service and the method are not 'isolated'
WARNING [service.bal:(33:5,33:5)] concurrent calls will not be made to this method since the service and the method are not 'isolated'
WARNING [service.bal:(40:5,40:5)] concurrent calls will not be made to this method since the service and the method are not 'isolated'
WARNING [service.bal:(47:5,47:5)] concurrent calls will not be made to this method since the service and the method are not 'isolated'
WARNING [service.bal:(54:5,54:5)] concurrent calls will not be made to this method since the service and the method are not 'isolated'
WARNING [service.bal:(63:5,63:5)] concurrent calls will not be made to this method since the method is not an 'isolated' method
WARNING [service.bal:(68:5,68:5)] concurrent calls will not be made to this method since the method is not an 'isolated' method
WARNING [service.bal:(76:5,76:5)] concurrent calls will not be made to this method since the method is not an 'isolated' method

Running executable
```

## View the generated schema

If you connect to this service using any GraphQL client tools, it will show the schema below.

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

## Try the service

>**Info:** To access the endpoint, use cURL or a GraphQL client such as [GraphiQL](https://github.com/graphql/graphiql).

Execute the cURL command below to retrieve all the data from the endpoint.

```shell
curl -X POST -H "Content-type: application/json" -H "scope: unknown" -d '{ "query": "query { all { country cases active}  }" }' 'http://localhost:9000/covid19'
```

In this request:
- An HTTP POST request is sent to the GraphQL endpoint. 
- The request body contains the GraphQL query.

You view the JSON below as the result of this request.

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

## Learn more
To learn more about GraphQL services in Ballerina, see the following.

- [`graphql` module documentation](https://lib.ballerina.io/ballerina/graphql/latest)
- [GraphQL Hello World](/learn/by-example/graphql-hello-world.html)
- [GraphQL to Ballerina](/learn/cli-documentation/graphql/#graphql-to-ballerina)
- [GraphQL client tool](/learn/graphql-client-tool/)
 