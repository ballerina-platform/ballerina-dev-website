---
layout: ballerina-graphql-guide-left-nav-pages-swanlake
title: Write a GraphQL API with Ballerina
description: This guide walks through the steps of writing a GraphQL API in Ballerina.
keywords: ballerina, graphql, ballerina packages, language-guide, Ballerina library
permalink: /learn/write-a-graphql-api-with-ballerina/
active: write-a-graphql-api-with-ballerina
intro: This guide walks you through writing a simple GraphQL service to serve a dummy dataset related to COVID-19.
---

>**Info:** Due to the batteries-included nature of the Ballerina language, there is no need to add third-party libraries to implement the GraphQL API. The Ballerina package itself is adequate. 

## Set up the prerequisites

To complete this tutorial, you need:

1. [Ballerina Swan Lake](/downloads/) or later
2. <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the  <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina extension</a> installed

## Design the GraphQL endpoint

Usually, a GraphQL endpoint is defined using a GraphQL schema. Some languages require the GraphQL schema to create a GraphQL service (schema-first approach), while others do not need the schema to create the service (code-first approach). Ballerina supports both approaches. This guide uses the code-first approach, where you do not need the schema file to create your service. Once you write the Ballerina service, the Ballerina `graphql` package will generate the schema.

The GraphQL endpoint you will create in this guide will have two primary operations, `Query` and `Mutation`. The `Query` type will be used to read the data in the data source, and the `Mutation` operation will be utilized to update the data in the data source.

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

1. In the Terminal, execute the command below to create the Ballerina package for the API implementation.

    ```
    $ bal new graphql-service
    ```

    You should see the output similar to the following.

    ```
    package name is derived as 'graphql_service'. Edit the Ballerina.toml to change it.

    Created new package 'graphql_service' at /Users/graphql-service.
    ```

    This creates a directory named `graphql-service` with sample Ballerina code, as shown below. 

    ```
    graphql-service
    │   ├── Ballerina.toml
    │   └── main.bal
    ```

    - `Ballerina.toml` is the file that makes the folder a Ballerina package.
    - `main.bal` file provides the look and feel of a simple Ballerina program.

2. Open the created package in VS Code.

3. Remove the generated content in the `main.bal` file and open the diagram view in VS Code.

    ![Open diagram view](/learn/images/featured-scenarios/write-a-graphql-api-with-ballerina/open-diagram-view.gif)

## Create the data source 

Before writing the GraphQL service, let's create a data source for the project. This data source will mimic a database that stores the data for the service using an in-memory table in Ballerina as the data source.

### Define the types of the data source

Follow the steps below to add the definitions of the data types and the declaration of the table.

1. Generate the record type corresponding to the table entry providing the record name as `CovidEntry` and the sample JSON object below.

    >**Tip:** You need to complete the generated record by adding the pipe signs to mark the record as a closed one, adding the `readonly` descriptor to the `isoCode` field to make it non-modifiable as it is the key of the table, and marking the values of the `cases`, `deaths`, `recovered`, and `active` variables as optional.

    ```json
    {
        "isoCode": "AFG",
        "country": "Afghanistan",
        "cases": 159.303,
        "deaths": 7.386,
        "recovered": 146.084,
        "active": 5.833
    }
    ```
    ![Create data record](/learn/images/featured-scenarios/write-a-graphql-api-with-ballerina/create-data-record.gif)
    
    The generated record will be as follows.

    ```ballerina
    type CovidEntry record {|
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

Follow the steps below to define the data [table](/learn/by-example/table).

1. Create the table, as shown below.

    >**Tip:** Enter `CovidEntry` as the table type, `isoCode` as the key, and `covidEntriesTable` as the variable type when creating the table.

   ![Create data table](/learn/images/featured-scenarios/write-a-graphql-api-with-ballerina/create-data-table.gif)

2. Replace the `{key: value}` placeholder of the generated table with the following entries to add the initial data to the table.

    ```
    {isoCode: "AFG", country: "Afghanistan", cases: 159.303, deaths: 7.386, recovered: 146.084, active: 5.833},
    {isoCode: "SL", country: "Sri Lanka", cases: 598.536, deaths: 15.243, recovered: 568.637, active: 14.656},
    {isoCode: "US", country: "USA", cases: 69808.350, deaths: 880.976, recovered: 43892.277, active: 25035.097}
    ```

The generated record and the table will be as follows.

```ballerina
type CovidEntry record {|
    readonly string isoCode;
    string country;
    decimal cases?;
    decimal deaths?;
    decimal recovered?;
    decimal active?;
|};

table<CovidEntry> key(isoCode) covidEntriesTable = table [
    {isoCode: "AFG", country: "Afghanistan", cases: 159.303, deaths: 7.386, recovered: 146.084, active: 5.833},
    {isoCode: "SL", country: "Sri Lanka", cases: 598.536, deaths: 15.243, recovered: 568.637, active: 14.656},
    {isoCode: "US", country: "USA", cases: 69808.350, deaths: 880.976, recovered: 43892.277, active: 25035.097}
];
```

## Create the service

Create the service, as shown below.

>**Tip:** Select `service on graphql:Listener` and use `/covid19` as the service path (or the context) of the service, which is attached to the listener listening on port `9000`.

![Create the service](/learn/images/featured-scenarios/write-a-graphql-api-with-ballerina/create-the-service.gif)

The generated REST service will be as follows.

```ballerina
import ballerina/graphql;

service /covid19 on new graphql:Listener(9000) {
}
```

## Implement the service methods

As per the design, there are two fields in the `Query` type and one field in the `Mutation` type in your GraphQL service. The fields of the `Query` type are represented by the resource methods with the `get` accessor in Ballerina. In contrast, the fields of the `Mutation` type are defined by the remote methods in Ballerina.

### Create `Query` type service methods

Create the `Query` type service methods as follows.

#### Create the `all` field resource function

Follow the steps below to create the `all` field, which returns an array of `CovidData` type, using the [Ballerina GraphQL API Designer](/learn/vs-code-extension/design-the-services/graphql-api-designer/) in VS Code, as shown below.

1. Create the resource function, as shown below.

    ![Create first query](/learn/images/featured-scenarios/write-a-graphql-api-with-ballerina/create-first-query.gif)

    >**Info:** This creates the [service class to define the GraphQL object types](#create-the-object-types) also when creating this resource function.

2. Replace the body of the resource function with the code below.

    ```ballerina
    CovidEntry[] covidEntries = covidEntriesTable.toArray().cloneReadOnly();
    return covidEntries.map(entry => new CovidData(entry));
    ```

The generated resource function will be as follows.

```ballerina
resource function get all() returns CovidData[] {
    CovidEntry[] covidEntries = covidEntriesTable.toArray().cloneReadOnly();
    return covidEntries.map(entry => new CovidData(entry));
}
```

> **Note:** A Ballerina GraphQL resource or remote method can also return a `table`. When a method returns a `table`, the corresponding GraphQL field type is a `LIST` type.

In this code:
- The resource method definition has the accessor `get`, which is used to identify the resource methods as a field of the `Query` type. 
- Then comes the name of the field. The return type is the type of the field.
- The above resource method first retrieves the array of `CovidEntry` records from the data source as an array and then returns an array of `CovidData` service type array as the result using the built-in `map` function.

#### Create the `filter` field resource function

Similar to how you [created the `all` field resource function](#create-the-all-field-resource-function), create the `filter` field, which is another resource function with an input `isoCode` to filter the data, using the [Ballerina GraphQL API Designer](/learn/vs-code-extension/design-the-services/graphql-api-designer/) in VS Code, as shown below.

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
- The `filter` field is defined in the root `Query` type. Since this field has an input parameter named `isoCode`, you have to add an input parameter to the resource method. 
- This method returns the corresponding data for the given `isoCode` if such data is available in the data set and returns `null` otherwise.

### Create `Mutation` type 

Create the `Mutation` type service methods as follows.

#### Create the `add` field remote method

As the `Query` type is completed, follow the steps below to define the `Mutation` type using remote methods.

1. Define the `add` field, which returns an array of `CovidData` type to add an entry to the data source, using the [Ballerina GraphQL API Designer](/learn/vs-code-extension/design-the-services/graphql-api-designer/) in VS Code, as shown below.

    ![Create the mutation](/learn/images/featured-scenarios/write-a-graphql-api-with-ballerina/create-the-mutation.gif)

2. Replace the body of the resource function with the code below.

    ```ballerina
    covidEntriesTable.add(entry);
    return new CovidData(entry);
    ```

The generated resource function will be as follows.

```ballerina
remote function add(CovidEntry entry) returns CovidData {
    covidEntriesTable.add(entry);
    return new CovidData(entry);
}
```

In this code:
- This method requires a `CovidEntry` record as the input. 
- When a remote or resource method has a record type as an input, it will be mapped to a GraphQL input object type. Therefore, this cannot be used as an output type.

## Create the object types

Since the data used in this guide map to a GraphQL Object, you have to define this object type. In Ballerina, a GraphQL output object can be defined using either a service or record type.

> **Note:** Since the GraphQL spec does not allow using an input object as an output object, the same record type cannot be used as the input and output types of a method.

Follow the steps below to update the body of the service class, which you created when [creating the first `Query` type](#create-the-all-field-resource-function) to add the definition of the `CovidData` object type.

1. Add the `distinct` descriptor to the created service class, and add the code below to the body of the service class by editing the source to define the initial record and function.

    ```ballerina
    private final readonly & CovidEntry entryRecord;

    function init(CovidEntry entryRecord) {
        self.entryRecord = entryRecord.cloneReadOnly();
    }
    ```

3. Click the **Visualize** CodeLens and create a resource function inside the service class using the [Ballerina GraphQL API Designer](/learn/vs-code-extension/design-the-services/graphql-api-designer/), and design the body of the created resource function using the **Statement Editor**, as shown below.

    >**Tip:** Enter `isoCode` as the field, `string` as the return type, and `self.entryRecord.isoCode` as the return value of the resource function.

    ![Define object type](/learn/images/featured-scenarios/write-a-graphql-api-with-ballerina/define-object-type.gif)

    The generated resource function will be as follows.

    ```ballerina
    distinct service class CovidData {
        private final readonly & CovidEntry entryRecord;
        function init(CovidEntry entryRecord) {
            self.entryRecord = entryRecord.cloneReadOnly();
        }

        resource function get isoCode() returns string {
            return self.entryRecord.isoCode;
        }
    }
    ```

5. Add the code below to the body of the service class to complete it. 

    ```ballerina
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
    ```

In this code:
- The endpoint returns the number of cases in thousands. Therefore, a service type is used to define the output object type, and inside the service type, each resource method will return the original value
divided by `1000`.
- The `CovidData` service type represents the GraphQL `Object` type, which represents an entry in
the data set. 
- Each resource method in this service represents a field of the GraphQL object type.  The return type of
the resource method is the type of the field.
- The resource methods returning `isoCode` and the `country` have the return type `string`, which means these fields cannot be `null` in the GraphQL response. In other words, these fields have `NON_NULL` types. (GraphQL represents these by the exclamation mark `!` (e.g., `String!`). However, the resource methods returning numbers can return `null` values. Therefore, the type of fields represented by those resource methods is nullable.
- The `decimal` type is used as a return type. This will add a `Scalar` type named `Decimal` to the GraphQL schema, which the Ballerina GraphQL package will generate.

## The complete code

Below is the complete code for the Ballerina GraphQL service.

```ballerina
import ballerina/graphql;

type CovidEntry record {|
    readonly string isoCode;
    string country;
    decimal cases?;
    decimal deaths?;
    decimal recovered?;
    decimal active?;
|};

table<CovidEntry> key(isoCode) covidEntriesTable = table [
    {isoCode: "AFG", country: "Afghanistan", cases: 159.303, deaths: 7.386, recovered: 146.084, active: 5.833},
    {isoCode: "SL", country: "Sri Lanka", cases: 598.536, deaths: 15.243, recovered: 568.637, active: 14.656},
    {isoCode: "US", country: "USA", cases: 69808.350, deaths: 880.976, recovered: 43892.277, active: 25035.097}
];

distinct service class CovidData {
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

Use the [**Run**](/learn/vs-code-extension/run-a-program/) CodeLens of the VS Code extension to build and run the service, as shown below.

![Run the service](/learn/images/featured-scenarios/write-a-graphql-api-with-ballerina/run-the-service.gif)

>**Info:** Alternatively, you can run this service by navigating to the project root (i.e., the `graphql-service` directory) and executing the `bal run` command. The console should have warning logs related to the isolatedness of resources. It is a built-in service concurrency safety feature of Ballerina.

You should see the output similar to the following in the Terminal.

```
Compiling source
        featured_scenarios/graphql_service:0.1.0
HINT [main.bal:(41:5,41:5)] concurrent calls will not be made to this method since the method is not an 'isolated' method
HINT [main.bal:(46:5,46:5)] concurrent calls will not be made to this method since the method is not an 'isolated' method
HINT [main.bal:(54:5,54:5)] concurrent calls will not be made to this method since the method is not an 'isolated' method

Running executable
```

## View the generated schema

The schema below will be shown if you connect to this service using any [GraphQL client tools](/learn/graphql-tool/).

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

scalar Decimal

type Query {
    all: [CovidData!]!
    filter(isoCode: String!): CovidData
}

type Mutation {
    add(entry: CovidEntry!): CovidData!
}
```

## Try the service

Execute the query below using the [**Try it**](/learn/vs-code-extension/try-the-services/try-graphql-services/) CodeLens of the VS Code extension to send a request to the service to try out the use case, as shown below.

>**Tip:** In the **Explorer**, select `active`, `cases`, and `country` values under `all` to execute the query below.

```
{
  all {
    active
    cases
    country
  }
}
```

In this request:
- An HTTP POST request is sent to the GraphQL endpoint. 
- The request body contains the GraphQL query.

![Try the service](/learn/images/featured-scenarios/write-a-graphql-api-with-ballerina/try-the-service.gif)

You should see the JSON below as the result of this request.

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
- [GraphQL Hello World](/learn/by-example/graphql-hello-world)
- [GraphQL tool](/learn/graphql-tool/)
