---
layout: ballerina-rest-api-guide-left-nav-pages-swanlake
title: Write a RESTful API with Ballerina
permalink: /learn/write-a-restful-api-with-ballerina/
description: This guide helps you understand the basics of Ballerina constructs, which allow you to write RESTful APIs.
keywords: ballerina, programming language, restful-api, ballerina packages, language-guide
active: write-a-restful-api-with-ballerina
intro: This guide helps you understand the basics of Ballerina constructs, which allow you to write RESTful APIs.
---

## Set up the prerequisites

To complete this tutorial, you need:

1. [Ballerina 2201.8.4 (Swan Lake)](/downloads/) or greater
2. Visual Studio Code</a> with the  <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina extension</a> installed.

## Understand the implementation

Due to the batteries included nature of the Ballerina language, there is no need to add any third-party libraries to implement a RESTful API. The Ballerina library itself is adequate.

This guide will walk you through creating a RESTful API with two endpoints. In this API, you will be writing a simple CRUD-like RESTful service. The sample is built around a set of COVID-19 data. Following are the URLs of each of the endpoints.

1. `/covid/status/countries`
2. `/covid/status/countries/{iso_code}`

### The first endpoint

The first endpoint is about getting data from the service as well as adding data to the service. Therefore, the service should handle both HTTP `GET` and `POST` requests.
- The `GET` request is to get data, and the response should be `200 OK`.
- The `POST` request is to add data, and the response should be `201 Created`.

### The second endpoint

The second endpoint is about getting data filtered from the service. The data is filtered by the ISO code. Therefore, the second endpoint accepts the ISO code as part of the URL and responds with the `200 OK` status code. In the event of an error, the relevant error is sent back to the client.

>**Info:** For the complete source code of this implementation, see [The complete code](/learn/write-a-restful-api-with-ballerina/#the-complete-code).

## Create the service package 

Ballerina uses packages to group code. Follow the steps below to create a Ballerina package and write the business logic in it. 

> **Info:** For more information on Ballerina packages, see [Organize Ballerina code](/learn/organize-ballerina-code/).

1. Use the ``Ctrl+` `` keyboard shortcut with the backtick character to open the Terminal window of VS Code. 

2. In the terminal, navigate to a preferred location and execute the command below to create the Ballerina package for the API implementation.

    ```
    $ bal new covid19 -t service
    ```

    You view the output below.

    ```
    Created new package 'covid19' at covid19.
    ```

    This creates a directory named `covid19` with the default module along with a sample code for the service as shown below. 

    ```
    .
    ├── covid19
    │   ├── Ballerina.toml
    │   └── service.bal
    ```

    - `Ballerina.toml` is the file that makes the folder a Ballerina package. It also contains a test directory to include tests for the service. However, this will not be used in this guide. 
    - The `service.bal` template file provides a look and feel about Ballerina services. 

3. In the terminal, navigate to the directory of the created package and execute the `code .` command to open it in VS Code.

## Create the dataset

To keep things simple, an in-memory dataset is used with three entries. Follow the steps below to add the definition of the record and the declaration of the table.

1. Remove the auto-generated content of the API template file (i.e., `service.bal`) and open the diagram view in VS Code.

    <GIF>

2. Generate the record types corresponding to the payload from REST service by providing the sample JSON object below.

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

3. Create the table as shown below.

    <GIF>


The generated record and the table will be as follows.

```ballerina
public type CovidEntry record {|
    readonly string iso_code;
    string country;
    decimal cases;
    decimal deaths;
    decimal recovered;
    decimal active;
|};

public final table<CovidEntry> key(iso_code) covidTable = table [
    {iso_code: "AFG", country: "Afghanistan", cases: 159303, deaths: 7386, recovered: 146084, active: 5833},
    {iso_code: "SL", country: "Sri Lanka", cases: 598536, deaths: 15243, recovered: 568637, active: 14656},
    {iso_code: "US", country: "USA", cases: 69808350, deaths: 880976, recovered: 43892277, active: 25035097}
];
```

In this code:

- Ballerina tables are used to store data. Each entry in the table is represented by a Ballerina record.

## Create the service

Ballerina resources can only reside inside a service. Therefore, first, a service needs to be created. Create the service using the [Ballerina HTTP API Designer](/learn/vs-code-extension/design-the-services/http-api-designer/) in VS Code as shown below.

<GIF>

The generated REST service will be as follows.

```ballerina
service /covid/status on new http:Listener(9000) {
}
```

In this code:

- As both endpoints have a common URL segment, this is moved to the service level as the base path when creating the service.
- The service is associated with an `http:Listener`, which is the Ballerina abstraction that deals with network-level details such as the host, port, SSL, etc.

## Implement the first endpoint

The first endpoint has two resources one to get data and the other to add data.

### Create the first resource to get data

Create the first resource of the first endpoint to get data, using the [Ballerina HTTP API Designer](/learn/vs-code-extension/design-the-services/http-api-designer/) in VS Code as shown below.

<GIF>

The generated resource function will be as follows.

```ballerina
service /covid/status on new http:Listener(9000) {
	resource function get countries() returns CovidEntry[] {
        return covidTable.toArray();
    }
}
```

In this code:

- Unlike normal functions, resource methods can have accessors. In this case, the accessor is set to `get`, which means only HTTP `GET` requests could hit this resource. Ballerina automatically serializes Ballerina records as JSON and sends them over the wire. 
- The default HTTP response status code for a resource method other than `post` is `200 OK`. For an HTTP `POST` resource, the default HTTP response status code is `201 Created`. 

### Create the second resource to add data

Create the second resource of the first endpoint to add new COVID-19 data to the dataset by ISO code, using the [Ballerina HTTP API Designer](/learn/vs-code-extension/design-the-services/http-api-designer/) in VS Code as shown below.

<GIF>

The generated resource function will be as follows.

```ballerina
resource function post countries(@http:Payload CovidEntry[] covidEntries)
                                    returns CovidEntry[]|ConflictingIsoCodesError {

    string[] conflictingISOs = from CovidEntry covidEntry in covidEntries
        where covidTable.hasKey(covidEntry.iso_code)
        select covidEntry.iso_code;

    if conflictingISOs.length() > 0 {
        return {
            body: {
                errmsg: string:'join(" ", "Conflicting ISO Codes:", ...conflictingISOs)
            }
        };
    } else {
        covidEntries.forEach(covdiEntry => covidTable.add(covdiEntry));
        return covidEntries;
    }
}
```

In this code:

- It is chosen to either accept the entire payload or send back an error. Copying this straightway results in an error, which is expected as the `ConflictingIsoCodesError` type is not defined yet.
- This resource has a resource argument named `covidEntries` annotated with `@http:Payload`. This means the resource is expecting a payload with the `CovideEntry[]` type. There are two types of records `CovideEntry[]` and `ConflictingIsoCodesError` that will be used as the return values.

#### Define the error records

Similar to how you created the record type in [Create the dataset](#create-the-dataset), define the error records below of the first endpoint using the diagram view in VS Code.

```ballerina
public type ConflictingIsoCodesError record {|
    *http:Conflict;
    ErrorMsg body;
|};

public type ErrorMsg record {|
    string errmsg;
|};
```

In this code:
- Ballerina uses `*http:Conflict` to denote that one type is a subtype of another. In this case, `ConflictingIsoCodesError` is a subtype of `http:Conflict`.
- The body of the response is of type `ErrorMsg`, which simply has a string field named `errmsg`. Based on the need, users can have any data type for their response body.
- Ballerina has a defined set of types for each HTTP status code. This allows you to write services in a type-oriented way, which in turn is helpful when it comes to tooling and generating OpenAPI specifications for HTTP services. 

## Implement the second endpoint

The second endpoint has only one resource to get COVID-19 data filtered by the ISO code.

### Create the resource of the second endpoint

Similar to how you created the [second resource of the first endpoint](#create-the-second-resource-to-add-data), create the resource of the second endpoint below using the diagram view in VS Code.

```ballerina
resource function get countries/[string iso_code]() returns CovidEntry|InvalidIsoCodeError {
    CovidEntry? covidEntry = covidTable[iso_code];
    if covidEntry is () {
        return {
            body: {
                errmsg: string `Invalid ISO Code: ${iso_code}`
            }
        };
    }
    return covidEntry;
}
```

In this code:
- This resource is a bit more different than the first two resources. As explained earlier, resource methods have accessors.
- In addition, it also supports hierarchical paths making it ideal for implementing RESTful APIs. Hierarchical paths can have path params.
-  In this case, `iso_code` is used as the path param, which in turn, becomes a string variable.

#### Define the error record

Similar to how you created the record type in [Create the dataset](#create-the-dataset), define the error record below of the second endpoint using the diagram view in VS Code.

```ballerina
public type InvalidIsoCodeError record {|
    *http:NotFound;
    ErrorMsg body;
|};
```

In this code:
- As in the previous example, this resource also includes its own return types. However, the basic principle behind them is as the previous example. 

## The complete code

The below is the complete code of the service implementation.

```ballerina
import ballerina/http;

service /covid/status on new http:Listener(9000) {

    resource function get countries() returns CovidEntry[] {
        return covidTable.toArray();
    }

    resource function post countries(@http:Payload CovidEntry[] covidEntries)
                                    returns CovidEntry[]|ConflictingIsoCodesError {

        string[] conflictingISOs = from CovidEntry covidEntry in covidEntries
            where covidTable.hasKey(covidEntry.iso_code)
            select covidEntry.iso_code;

        if conflictingISOs.length() > 0 {
            return {
                body: {
                    errmsg: string:'join(" ", "Conflicting ISO Codes:", ...conflictingISOs)
                }
            };
        } else {
            covidEntries.forEach(covdiEntry => covidTable.add(covdiEntry));
            return covidEntries;
        }
    }

    resource function get countries/[string iso_code]() returns CovidEntry|InvalidIsoCodeError {
        CovidEntry? covidEntry = covidTable[iso_code];
        if covidEntry is () {
            return {
                body: {
                    errmsg: string `Invalid ISO Code: ${iso_code}`
                }
            };
        }
        return covidEntry;
    }
}

public type CovidEntry record {|
    readonly string iso_code;
    string country;
    decimal cases;
    decimal deaths;
    decimal recovered;
    decimal active;
|};

public final table<CovidEntry> key(iso_code) covidTable = table [
    {iso_code: "AFG", country: "Afghanistan", cases: 159303, deaths: 7386, recovered: 146084, active: 5833},
    {iso_code: "SL", country: "Sri Lanka", cases: 598536, deaths: 15243, recovered: 568637, active: 14656},
    {iso_code: "US", country: "USA", cases: 69808350, deaths: 880976, recovered: 43892277, active: 25035097}
];

public type ConflictingIsoCodesError record {|
    *http:Conflict;
    ErrorMsg body;
|};

public type InvalidIsoCodeError record {|
    *http:NotFound;
    ErrorMsg body;
|};

public type ErrorMsg record {|
    string errmsg;
|};
```

- It is always a good practice to document your interfaces. However, this example has omitted documentation for brevity. Nevertheless, any production-ready API interface must include API documentation. 
- You can also try generating an OpenAPI specification for the written service by executing the following command, which creates a `yaml` file in the current folder.

## Run the service

Use the `Run` CodeLens of the VS Code extension to build and run the service as shown below.

<GIF>

>**Info:** Alternatively, you can run this service by navigating to the project root (i.e., `covid19` directory) and executing the `bal run` command. The console should have warning logs related to the isolatedness of resources. It is a built-in service concurrency safety feature of Ballerina.

You view the output below in the Terminal.

```
Compiling source
	example/covid19:0.1.0

Running executable
```

## Try the service

Use the [Try it](/learn/vs-code-extension/try-the-services/try-http-services/) CodeLens of the VS Code extension to send a request to the service to try out the use case.

### Get all countries

Retrieve all the available records of all countries as shown below.

<GIF>

### Add a country by the ISO code 

Add a record of a country by its ISO code as shown below.

<GIF>

### Filter a country by the ISO code

Retrieve a specific record of a country by providing its ISO code as shown below.

<GIF>

## Learn more

To learn more about RESTful services in Ballerina, see the following:
- [`http` module documentation](https://lib.ballerina.io/ballerina/http/latest)
- [Service path and resource path](/learn/by-example/http-service-and-resource-paths/)
