---
layout: ballerina-rest-api-guide-left-nav-pages-swanlake
title: Writing a RESTful API with Ballerina
permalink: /learn/writing-a-restful-api-with-ballerina/
description: This guide helps you understand the basics of Ballerina constructs, which allow you to write RESTful APIs.
keywords: ballerina, programming language, restful-api, ballerina packages, language-guide
active: writing-a-restful-api-with-ballerina
intro: This guide helps you understand the basics of Ballerina constructs, which allow you to write RESTful APIs.
redirect_from:
  - /learn/writing-a-restful-api-with-ballerina
---

Due to the batteries included nature of the Ballerina language, there is no need to add any third-party libraries to implement the RESTful API. The Ballerina standard library itself is adequate. In this API, you will be writing a simple CRUD-like RESTful service.

In this tutorial, you will be creating a RESTful API with two endpoints. The sample is built around a set of COVID-19 data.

## Setting up the Prerequisites

To complete this tutorial, you need:

1. A command terminal
2. A text editor
    >**Tip:** Preferably, [Visual Studio Code](https://code.visualstudio.com/) with the [Ballerina extension](https://marketplace.visualstudio.com/items?itemName=WSO2.ballerina) installed.
3. A [Ballerina installation](https://ballerina.io/learn/installing-ballerina/setting-up-ballerina/)

## Designing the Two Endpoints

The first endpoint is about getting data from the service as well as adding data to the service. Therefore, the service should handle both HTTP `GET` and `POST` requests.
- The `GET` request is to get data, and the response should be `200 OK`.
- The `POST` request is to add data, and the response should be `201 Created`.

The second endpoint is about getting data filtered from the service. The data is filtered by the ISO code. Therefore, the second service accepts the ISO code as part of the URL and responds with the `200 OK` status code. In the event of an error, the relevant error is sent back to the client.

Following is the URL for each endpoint, respectively.

1. /covid/status/countries
2. /covid/status/countries/{iso_code}

## Creating a Package for Your Code

Ballerina uses packages to group code. In this case, a package with the default module is created by executing the following command.

```bash
$ bal new covid19 -t service
```

This creates a folder named `covid19` along with a sample code for service. Navigate to the `covid19` directory, and execute the following command to start VSCode.

```bash
$ code .
```

`Ballerina.toml` is the file that makes the folder a Ballerina package. It also contains a test directory to include tests for the service. However, for the sake of simplicity, it will be ignored in this tutorial. You can just go through the sample in the `service.bal` to get a look and feel about Ballerina services. However, since you will be doing it from scratch, you can delete the entire code or edit it if you wish.

## Creating the COVID-19 Dataset

To keep things simple, an in-memory dataset is used with three entries. Ballerina tables are used to store data. Each entry in the table is represented by a Ballerina record. Following is the definition of the record and the declaration of the table.

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

## Writing a Resource to Get All the COVID-19 Data

As mentioned earlier, the first endpoint has two parts: getting data as well as adding data. In this section, the focus is on getting data.

Ballerina resources can only be inside a service. Therefore, first, a service needs to be created. If you have noticed, both endpoints have a common URL segment. When creating the service, the common URL segment can be moved to the service level as the base path.

Each service is associated with an `http:Listener`, it is the Ballerina abstraction that deals with network-level details such as host, port, SSL, etc.

```ballerina
service /covid/status on new http:Listener(9000) {
}
```

Adding the first endpoint to the service.

```ballerina
service /covid/status on new http:Listener(9000){
	resource function get countries() returns CovidEntry[] {
        return covidTable.toArray();
    }
}
```

Unlike normal functions, resource functions can have accessors. In this case, the accessor is set to `get`, which means only HTTP `GET` requests could hit this resource.

Ballerina automatically serializes Ballerina records as JSON and sends them over the wire. The default status code HTTP responses are `200 OK`.

## Writing a Resource to Add COVID-19 Data by ISO Code

The second part of the first endpoint is about adding or appending new data to the dataset. Following is the second resource associated with the first endpoint.

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
> **Note**: To keep things simple, in this case, it was chosen to either accept the entire payload or send back an error.

Copying this straightway results in an error, which is expected as the `CreatedCovidEntries` and `ConflictingIsoCodesError` types are not defined yet.

This resource is a bit more interesting than the second resource. To begin with, there is a resource argument named `covidEntries` annotated with `@http:Payload`. This means the resource is expecting a payload with type `CovideEntry[]`.

Finally, as the return values, there are two types of records `CreatedCovidEntries` and `ConflictingIsoCodesError`. Following is the definition of `CreatedCovidEntries`.

```ballerina
public type CreatedCovidEntries record {|
   *http:Created;
   CovidEntry[] body;
|};
```

As you can see, there is something new here. `*http:Created` is the Ballerina way of saying one type is a subtype of another. In this case, `CreatedCovidEntries` is a subtype of `*http:Created`. Ballerina has defined a set of types for each HTTP status code. This allows you to write services in a type-oriented way, which in turn is helpful when it comes to tooling and generating OpenAPI specifications for HTTP services. Returning this record results in an HTTP `201` response with a JSON payload. The body of the response is of type `CovidEntry[]`.

Similarly, the following is the definition of `ConflictingIsoCodesError`.

```ballerina
public type ConflictingIsoCodesError record {|
   *http:Conflict;
   ErrorMsg body;
|};

public type ErrorMsg record {|
   string errmsg;
|};
```

The body of the response is of type `ErrorMsg`, which simply has a string field named `errmsg`. Based on the need, users can have any data type for their response body.

## Writing a Resource to Get Filtered COVID-19 Data by ISO Code

This resource is a bit more different than the first two resources. As explained earlier, resource functions have accessors. In addition, it also supports hierarchical paths making it ideal for implementing RESTful APIs. Hierarchical paths can have path params. In this case, `iso_code` is used as the path param, which in turn, becomes a string variable.

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

As in the previous example, this resource also includes its own return types. However, the basic principle behind them is as the previous example. The following is the type definition of the `InvalidIsoCodeError`.

```ballerina
public type InvalidIsoCodeError record {|
    *http:NotFound;
    ErrorMsg body;
|};
```
## The Complete Code

It is always a good practice to document your interfaces. However, this example has omitted documentation for brevity. Nevertheless, any production-ready API interface must include API documentation.

You can run the service by executing the following command inside the `covid19` folder.

```bash
$ bal run
```

> **Note**: The console should have warning logs related to the isolatedness of resources. It is a built-in service concurrency safety feature of Ballerina.

In another terminal, execute the following `curl` commands to try out the service.

```bash
$ curl http://localhost:9000/covid/status/countries

[{"iso_code":"AFG", "country":"Afghanistan", "cases":159303, "deaths":7386, "recovered":146084, "active":5833}, {"iso_code":"SL", "country":"Sri Lanka", "cases":598536, "deaths":15243, "recovered":568637, "active":14656}, {"iso_code":"US", "country":"USA", "cases":69808350, "deaths":880976, "recovered":43892277, "active":25035097}]

$ curl http://localhost:9000/covid/status/countries/AFG

{"iso_code":"AFG", "country":"Afghanistan", "cases":159303, "deaths":7386, "recovered":146084, "active":5833}

$ curl http://localhost:9000/covid/status/countries -d '[{"iso_code":"DEU", "country":"Germany", "cases":159333, "deaths":7390, "recovered":126084, "active":6833}]'

[{"iso_code":"DEU", "country":"Germany", "cases":159333.0, "deaths":7390.0, "recovered":126084.0, "active":6833.0}]
```

You can also try generating an OpenAPI specification for the written service by executing the following command, which creates a `yaml` file in the current folder.

```bash
$ bal openapi -i service.bal
```
The following is the complete code.
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
