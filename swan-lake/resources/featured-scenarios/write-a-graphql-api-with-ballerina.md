---
layout: ballerina-graphql-guide-left-nav-pages-swanlake
title: Write a GraphQL API with Ballerina
description: This guide walks through the steps of writing a GraphQL API in Ballerina.
keywords: ballerina, graphql, ballerina packages, language-guide, Ballerina library
permalink: /learn/write-a-graphql-api-with-ballerina/
active: write-a-graphql-api-with-ballerina
intro: This guide walks you through writing a simple GraphQL service to serve a dummy dataset related to COVID-19.
---

>**Info:** Due to the batteries included nature of the Ballerina language, there is no need to add any third-party libraries to implement the GraphQL API. The Ballerina library itself is adequate.

## Set up the prerequisites

To complete this tutorial, you need:

1. [Ballerina 2201.0.0 (Swan Lake)](/downloads/) or greater
2. A text editor
    >**Tip:** Preferably, [Visual Studio Code](https://code.visualstudio.com/) with the [Ballerina extension](/learn/vs-code-extension) installed.
3. A command terminal

## Design the GraphQL endpoint

Usually, a GraphQL endpoint is defined using a GraphQL schema. Some languages require the GraphQL schema to create a GraphQL service (schema-first approach) while others do not need the schema to create the service (code-first approach). Ballerina supports both approaches.
This guide follows the code-first approach; therefore, you do not need the schema file to create your service, and instead, once you write the Ballerina service, the Ballerina GraphQL package will generate the schema.

The GraphQL endpoint you will create in this guide will have two main operations, `Query` and `Mutation`. The `Query` type will be used to read the data in the data source, and the `Mutation` operation will be used to mutate (insert, delete, update) the data in the data source.

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

```
$ bal new covid19 -t service
```

You will see the output below.

```
Created new package 'covid19' at covid19.
```

This creates a directory named `covid19` with the default module along with a sample code for the service as shown below.

```
.
├── covid19
│   ├── tests
│   │   └── service_test.bal
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
    int cases?;
    int deaths?;
    int recovered?;
    int active?;
|};
```

In this code:

* The record type `CovidEntry` is defined.
* A single entry will include the ISO code for the location (`isoCode`), name of the country (`country`), number of cases (`cases`), number of deaths (`deaths`), number of recovered cases (`recovered`), and the number of active cases (`active`).

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

    resource function get isoCode() returns string => self.entryRecord.isoCode;

    resource function get country() returns string => self.entryRecord.country;

    resource function get cases() returns int? => self.entryRecord.cases;

    resource function get deaths() returns int? => self.entryRecord.deaths;

    resource function get recovered() returns int? => self.entryRecord.recovered;

    resource function get active() returns int? => self.entryRecord.active;
}
```

In this code:

* The `CovidData` service type represents the GraphQL `Object` type, which represents an entry in
the data set.
* Each resource method in this service represents a field of the GraphQL object type.  The return type of
the resource method is the type of the field.
* The resource methods returning `isoCode` and the `country` have the return type `string`, which means these fields
cannot be `null` in the GraphQL response. In GraphQL terms, these are `NON_NULL` types that are represented by the exclamation mark `!`. E.g., `String!`). However, the resource methods returning numbers can return `null` values. Therefore, the type of fields represented by those resource methods is nullable.

## Create the service

Now, you are all set to write the GraphQL service. To write the service, add the code below to the top of the `service.bal` file.

```ballerina
import ballerina/graphql;

service /covid19 on new graphql:Listener(9090) {

}
```

The path of this service is defined as `/covid19`. If you want to host the service on the root, you can remove the path as follows:

```ballerina
import ballerina/graphql;

service on new graphql:Listener(9090) {

}
```

When creating the `graphql:Listener` object, you need to provide the port to which it is listening. Alternatively, to use an existing `http:Listener` object, for initializing the `graphql:Listener`, add the code below to the `service.bal` file.

```ballerina
import ballerina/graphql;
import ballerina/http;

listener http:Listener httpListener = check new(9090);

service /covid19 on new graphql:Listener(httpListener) {

}
```

>**Info:** The above code is similar to the previous one, which will listen on the port `9090` and serve on the path `/covid19`.

### Implement the service methods

As per the design, there are two fields in the `Query` type and one field in the `Mutation` type in your GraphQL service. The fields of the `Query` type are represented by the resource methods with the `get` accessor in Ballerina, while the fields of the `Mutation` type are represented by the remote methods in Ballerina.

#### Create `Query` type

##### Create the `all` field resource method

To create the `all` field, which returns an array of `CovidData` type, add the code below to the `service.bal` file.

```ballerina
resource function get all() returns CovidData[] {
    return from CovidEntry entry in covidEntriesTable select new (entry);
}
```

> **Note:** A Ballerina GraphQL resource or remote method can return a `table` as well. When a method is returning a `table`, the corresponding GraphQL field type is a `LIST` type.

In this code:

* The resource method definition has the accessor `get`, which is used to identify the resource methods as a field of the `Query` type.
* The path of the resource method (`all`) is the name of the field.
* The method uses a query expression to iterate over the entries in the `covidEntriesTable` and map them to the `CovidData` type.

##### Create the `filter` field resource method

To add the `filter` field, which is another resource method with an input `isoCode` to filter the data, add the code below to the `service.bal` file.

```ballerina
resource function get filter(string isoCode) returns CovidData? {
    if covidEntriesTable.hasKey(isoCode) {
        return new CovidData(covidEntriesTable.get(isoCode));
    }
    return;
}
```

In this code:

* The `filter` field is defined in the root `Query` type. Since this field has an input parameter `isoCode`, you have to add an input parameter to the resource method.
* This method returns the corresponding data for the given `isoCode` if such data is available in the data set, and it returns `null` otherwise.

#### Create `Mutation` type

##### Create the `add` field remote method

As the `Query` type is completed now, define the `Mutation` type using remote methods.

To define a remote method to add an entry to the data source, add the code below to the `service.bal` file.

```ballerina
remote function add(CovidEntry entry) returns CovidData {
    covidEntriesTable.add(entry);
    return new CovidData(entry);
}
```

In this code:

* This method requires a `CovidEntry` record as the input.
* When a remote or resource method has a record type as an input, it will be mapped to a GraphQL input object type. Therefore, this cannot be used as an output type.

## The complete code

Below is the complete code for the Ballerina GraphQL service.

```ballerina
import ballerina/graphql;

public type CovidEntry record {|
    readonly string isoCode;
    string country;
    int cases?;
    int deaths?;
    int recovered?;
    int active?;
|};

final table<CovidEntry> key(isoCode) covidEntriesTable = table [
    {isoCode: "AFG", country: "Afghanistan", cases: 159303, deaths: 7386, recovered: 146084, active: 5833},
    {isoCode: "SL", country: "Sri Lanka", cases: 598536, deaths: 15243, recovered: 568637, active: 14656},
    {isoCode: "US", country: "USA", cases: 69808350, deaths: 880976, recovered: 43892277, active: 25035097}
];

public distinct service class CovidData {
    private final readonly & CovidEntry entryRecord;

    function init(CovidEntry entryRecord) {
        self.entryRecord = entryRecord.cloneReadOnly();
    }

    resource function get isoCode() returns string => self.entryRecord.isoCode;

    resource function get country() returns string => self.entryRecord.country;

    resource function get cases() returns int? => self.entryRecord.cases;

    resource function get deaths() returns int? => self.entryRecord.deaths;

    resource function get recovered() returns int? => self.entryRecord.recovered;

    resource function get active() returns int? => self.entryRecord.active;
}

service /covid19 on new graphql:Listener(9090) {

    resource function get all() returns CovidData[] {
        return from CovidEntry entry in covidEntriesTable select new (entry);
    }

    resource function get filter(string isoCode) returns CovidData? {
        if covidEntriesTable.hasKey(isoCode) {
            return new CovidData(covidEntriesTable.get(isoCode));
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

```
$ bal run
```

You view the output below.

```shell
Compiling source
	user/covid19:0.1.0
HINT [service.bal:(25:5,25:5)] concurrent calls will not be made to this method since the service and the method are not 'isolated'
HINT [service.bal:(29:5,29:5)] concurrent calls will not be made to this method since the service and the method are not 'isolated'
HINT [service.bal:(33:5,33:5)] concurrent calls will not be made to this method since the service and the method are not 'isolated'
HINT [service.bal:(40:5,40:5)] concurrent calls will not be made to this method since the service and the method are not 'isolated'
HINT [service.bal:(47:5,47:5)] concurrent calls will not be made to this method since the service and the method are not 'isolated'
HINT [service.bal:(54:5,54:5)] concurrent calls will not be made to this method since the service and the method are not 'isolated'
HINT [service.bal:(63:5,63:5)] concurrent calls will not be made to this method since the method is not an 'isolated' method
HINT [service.bal:(68:5,68:5)] concurrent calls will not be made to this method since the method is not an 'isolated' method
HINT [service.bal:(76:5,76:5)] concurrent calls will not be made to this method since the method is not an 'isolated' method

Running executable
```

>**Info:** The console has warning logs related to the isolatedness of resources. It is a built-in service concurrency safety feature of Ballerina. Refer to the [isolated functions](/learn/by-example/isolated-functions) example to learn more about this feature.

## View the generated schema

To generate the schema for the code, execute the following command in the terminal.

```
$ bal graphql -i service.bal
```

It will generate the schema and save it in a file named `schema_covid19.graphql` in the project directory. Following is the content of the generated schema.

```graphql
type Query {
    all: [CovidData!]!
    filter(isoCode: String!): CovidData
}

type CovidData {
    isoCode: String!
    country: String!
    cases: Int
    deaths: Int
    recovered: Int
    active: Int
}

type Mutation {
    add(entry: CovidEntry!): CovidData!
}

input CovidEntry {
    isoCode: String!
    country: String!
    cases: Int
    deaths: Int
    recovered: Int
    active: Int
}
```

## Try the service

To try out the service, you can use the built-in GraphiQL client in the GraphQL service. To enable the GraphiQL client, add the following annotation to the GraphQL service.

```ballerina
@graphql:ServiceConfig {
    graphiql: {
        enabled: true
    }
}
```

### The complete code with the GraphiQL client

```ballerina
import ballerina/graphql;

public type CovidEntry record {|
    readonly string isoCode;
    string country;
    int cases?;
    int deaths?;
    int recovered?;
    int active?;
|};

final table<CovidEntry> key(isoCode) covidEntriesTable = table [
    {isoCode: "AFG", country: "Afghanistan", cases: 159303, deaths: 7386, recovered: 146084, active: 5833},
    {isoCode: "SL", country: "Sri Lanka", cases: 598536, deaths: 15243, recovered: 568637, active: 14656},
    {isoCode: "US", country: "USA", cases: 69808350, deaths: 880976, recovered: 43892277, active: 25035097}
];

public distinct service class CovidData {
    private final readonly & CovidEntry entryRecord;

    function init(CovidEntry entryRecord) {
        self.entryRecord = entryRecord.cloneReadOnly();
    }

    resource function get isoCode() returns string => self.entryRecord.isoCode;

    resource function get country() returns string => self.entryRecord.country;

    resource function get cases() returns int? => self.entryRecord.cases;

    resource function get deaths() returns int? => self.entryRecord.deaths;

    resource function get recovered() returns int? => self.entryRecord.recovered;

    resource function get active() returns int? => self.entryRecord.active;
}

@graphql:ServiceConfig {
    graphiql: {
        enabled: true
    }
}
service /covid19 on new graphql:Listener(9090) {

    resource function get all() returns CovidData[] {
        return from CovidEntry entry in covidEntriesTable select new (entry);
    }

    resource function get filter(string isoCode) returns CovidData? {
        if covidEntriesTable.hasKey(isoCode) {
            return new CovidData(covidEntriesTable.get(isoCode));
        }
        return;
    }

    remote function add(CovidEntry entry) returns CovidData {
        covidEntriesTable.add(entry);
        return new CovidData(entry);
    }
}
```

Now run the service again.

```
$ bal run
```

You can see the following output.

```shell
Running executable

GraphiQL client ready at http://localhost:9090/graphiql
```

Now, access the GraphiQL client using the provided URL.

In the left pane of the GraphiQL client, you can write the GraphQL queries. In the right pane, you can see the results of the queries.

### Execute the `all` query

Execute the following query in the left pane of the GraphiQL client.

```graphql
{
    all {
        country
        cases
        deaths
    }
}
```

You can see the JSON below as the result of this request.

```JSON
{
    "data": {
        "all": [
            {
                "country": "Afghanistan",
                "cases": 159303,
                "deaths": 7386
            },
            {
                "country": "Sri Lanka",
                "cases": 598536,
                "deaths": 15243
            },
            {
                "country": "USA",
                "cases": 69808350,
                "deaths": 880976
            }
        ]
    }
}
```

### Execute the `add` mutation

Execute the following mutation in the left pane of the GraphiQL client.

```graphql
mutation {
    add(entry: {
        isoCode: "UK",
        country: "United Kingdom",
        cases: 2376872,
        deaths: 435341,
        recovered: 1940968
        active: 563
    }) {
        isoCode
    }
}
```

This will insert a new entry to the data source and return the `isoCode` of the new entry.

Now you can execute the `filter` query to get the newly added entry.

### Execute the `filter` query

Execute the following query in the left pane of the GraphiQL client.

```graphql
{
    filter(isoCode: "UK") {
        country
        cases
        recovered
    }
}
```

You can see the JSON below as the result of this request.

```JSON
{
    "data": {
        "filter": {
            "country": "United Kingdom",
            "cases": 2376872,
            "recovered": 1940968
        }
    }
}
```

## Learn more

To learn more about GraphQL services in Ballerina, see the following.

* [The `graphql` module documentation](https://lib.ballerina.io/ballerina/graphql/latest)
* [The `graphql` module specification](/spec/graphql)
* [GraphQL examples](/learn/by-example/#graphql-service)
* [GraphQL tool](/learn/graphql-tool/)
