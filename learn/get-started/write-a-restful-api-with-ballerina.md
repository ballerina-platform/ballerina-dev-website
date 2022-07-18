---
layout: ballerina-rest-api-guide-left-nav-pages-swanlake
title: Write a RESTful API with Ballerina
permalink: /learn/write-a-restful-api-with-ballerina/
description: This guide helps you understand the basics of Ballerina constructs, which allow you to write RESTful APIs.
keywords: ballerina, programming language, restful-api, ballerina packages, language-guide
active: write-a-restful-api-with-ballerina
intro: This guide helps you understand the basics of Ballerina constructs, which allow you to write RESTful APIs.
redirect_from:
  - /learn/writing-a-restful-api-with-ballerina
  - /learn/writing-a-restful-api-with-ballerina/
  - /learn/write-a-restful-api-with-ballerina
  - /learn/getting-started/writing-a-restful-api-with-ballerina/
  - /learn/getting-started/writing-a-restful-api-with-ballerina
---

## Set up the prerequisites

To complete this tutorial, you need:

1. [Ballerina 2202.0.0 (Swan Lake)](/learn/install-ballerina/set-up-ballerina/) or greater
2. A text editor
  >**Tip:** Preferably, [Visual Studio Code](https://code.visualstudio.com/) with the [Ballerina extension](https://marketplace.visualstudio.com/items?itemName=WSO2.ballerina) installed.
3. A command terminal

## Understand the implementation

Due to the batteries included nature of the Ballerina language, there is no need to add any third-party libraries to implement a RESTful API. The Ballerina standard library itself is adequate.

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

Ballerina uses packages to group code. You need to create a Ballerina package and write the business logic in it. In the terminal, execute the command below to create the Ballerina package for the API implementation.

> **Info:** For more information on Ballerina packages, see [Organizing Ballerina code](/learn/organizing-ballerina-code/).

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
│   ├── Ballerina.toml
│   └── service.bal
```

- `Ballerina.toml` is the file that makes the folder a Ballerina package. It also contains a test directory to include tests for the service. However, this will not be used in this guide. 
- The `service.bal` template file provides a look and feel about Ballerina services. 

## Create the dataset

To keep things simple, an in-memory dataset is used with three entries. To add the definition of the record and the declaration of the table, replace the API template file (i.e., `service.bal`) with the code below.

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

Ballerina resources can only reside inside a service. Therefore, first, a service needs to be created. To create the service, add the code below to the API template file (i.e., `service.bal`).

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

To create the first resource of the first endpoint to get data, add the code below to the API template file (i.e., `service.bal`).

**Info:** 

```ballerina
service /covid/status on new http:Listener(9000){
	resource function get countries() returns CovidEntry[] {
        return covidTable.toArray();
    }
}
```

In this code:

- Unlike normal functions, resource functions can have accessors. In this case, the accessor is set to `get`, which means only HTTP `GET` requests could hit this resource. Ballerina automatically serializes Ballerina records as JSON and sends them over the wire. The default status code HTTP responses are `200 OK`.

### Create the second resource to add data

To create the second resource of the first endpoint to add new COVID-19 data to the dataset by ISO code, add the code below to the API template file (i.e., `service.bal`).


```ballerina
resource function post countries(@http:Payload CovidEntry[] covidEntries)
                                    returns CreatedCovidEntries|ConflictingIsoCodesError {

    string[] conflictingISOs = from CovidEntry covidEntry in covidEntries
        where covidTable.hasKey(covidEntry.iso_code)
        select covidEntry.iso_code;

    if conflictingISOs.length() > 0 {
        return <ConflictingIsoCodesError>{
            body: {
                errmsg: string:'join(" ", "Conflicting ISO Codes:", ...conflictingISOs)
            }
        };
    } else {
        covidEntries.forEach(covdiEntry => covidTable.add(covdiEntry));
        return <CreatedCovidEntries>{body: covidEntries};
    }
}
```

In this code:

- It is chosen to either accept the entire payload or send back an error. Copying this straightway results in an error, which is expected as the `CreatedCovidEntries` and `ConflictingIsoCodesError` types are not defined yet.

#### Define the record type

To define the `CreatedCovidEntries` record, add the code below to the API template file (i.e., `service.bal`).

```ballerina
public type CreatedCovidEntries record {|
   *http:Created;
   CovidEntry[] body;
|};
```

In this code:
- This resource has a resource argument named `covidEntries` annotated with `@http:Payload`. This means the resource is expecting a payload with type `CovideEntry[]`. There are two types of records `CreatedCovidEntries` and `ConflictingIsoCodesError` as the return values. Following is the definition of `CreatedCovidEntries`.
- `*http:Created` is the Ballerina way of saying one type is a subtype of another. In this case, `CreatedCovidEntries` is a subtype of `*http:Created`.
- Ballerina has defined a set of types for each HTTP status code. This allows you to write services in a type-oriented way, which in turn is helpful when it comes to tooling and generating OpenAPI specifications for HTTP services. 
- Returning this record results in an HTTP `201` response with a JSON payload. The body of the response is of type `CovidEntry[]`.

#### Define the error records

To define the error records, add the code below to the API template file (i.e., `service.bal`).

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
- The body of the response is of type `ErrorMsg`, which simply has a string field named `errmsg`. Based on the need, users can have any data type for their response body.

## Implement the second endpoint

The second endpoint has only one resource to get COVID-19 data filtered by the ISO code.

### Create the resource of the second endpoint

To create the resource of the second endpoin, add the code below to the API template file (i.e., `service.bal`).

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
- This resource is a bit more different than the first two resources. As explained earlier, resource functions have accessors.
- In addition, it also supports hierarchical paths making it ideal for implementing RESTful APIs. Hierarchical paths can have path params.
-  In this case, `iso_code` is used as the path param, which in turn, becomes a string variable.

#### Define the error record

To define the `InvalidIsoCodeError` record, add the code below to the API template file (i.e., `service.bal`).

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
                                    returns CreatedCovidEntries|ConflictingIsoCodesError {

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
            return <CreatedCovidEntries>{body: covidEntries};
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

public type CreatedCovidEntries record {|
    *http:Created;
    CovidEntry[] body;
|};

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

In the terminal, navigate to the `covid19` directory, and execute the command below to run the service package.

> **Info**: The console should have warning logs related to the isolatedness of resources. It is a built-in service concurrency safety feature of Ballerina.


```bash
$ bal run
```

You view the output below.

```bash
Compiling source
	example/covid19:0.1.0

Running executable
```

## Try the service

In another terminal, execute the cURL commands below one by one to try out the service.

### Get all countries

Execute the cURL command below.

```bash
$ curl http://localhost:9000/covid/status/countries
```

You view the output below.

```bash
[{"iso_code":"AFG", "country":"Afghanistan", "cases":159303, "deaths":7386, "recovered":146084, "active":5833}, {"iso_code":"SL", "country":"Sri Lanka", "cases":598536, "deaths":15243, "recovered":568637, "active":14656}, {"iso_code":"US", "country":"USA", "cases":69808350, "deaths":880976, "recovered":43892277, "active":25035097}]
```

### Add a country by the ISO code 

Execute the cURL command below.

```bash
$ curl http://localhost:9000/covid/status/countries -d '[{"iso_code":"DEU", "country":"Germany", "cases":159333, "deaths":7390, "recovered":126084, "active":6833}]'
```

You view the output below.

```bash
[{"iso_code":"DEU", "country":"Germany", "cases":159333.0, "deaths":7390.0, "recovered":126084.0, "active":6833.0}]
```

### Filter a country by the ISO code

Execute the cURL command below.

```bash
$ curl http://localhost:9000/covid/status/countries/AFG
```

You view the output below.

```bash
{"iso_code":"AFG", "country":"Afghanistan", "cases":159303, "deaths":7386, "recovered":146084, "active":5833}
```

## Learn more

To learn more about RESTful services in Ballerina, see the following:
- [`http` module documentation](https://lib.ballerina.io/ballerina/http/latest)
- [Service path and resource path](/learn/by-example/http-absolute-path-and-path.html)