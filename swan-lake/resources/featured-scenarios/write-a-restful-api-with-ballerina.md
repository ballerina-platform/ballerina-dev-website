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
2. <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the  <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina extension</a> installed

## Understand the implementation

Due to the batteries-included nature of the Ballerina language, there is no need to add third-party libraries to implement a RESTful API. The Ballerina library itself is adequate.

This guide will walk you through creating a RESTful API with two endpoints. In this API, you will be writing a simple CRUD-like RESTful service. The sample is built around a set of COVID-19 data. Following are the URLs of each of the endpoints.

1. `/covid/status/countries`
2. `/covid/status/countries/{iso_code}`

### The first endpoint

The first endpoint is about getting data from the service and adding data to the service. Therefore, the service should handle HTTP `GET` and `POST` requests.
- The `GET` request is to get data; the response should be `200 OK`.
- The `POST` request is to add data; the response should be `201 Created`.

### The second endpoint

The second endpoint is about getting data filtered from the service. The data is filtered by the ISO code. Therefore, the second endpoint accepts the ISO code as part of the URL and responds with the `200 OK` status code. The relevant error is sent back to the client in the event of an error.

>**Info:** For the complete source code of this implementation, see [The complete code](/learn/write-a-restful-api-with-ballerina/#the-complete-code).

## Create the package 

Ballerina uses packages to group code. Follow the steps below to create a Ballerina package and write the business logic. 

> **Info:** For more information on Ballerina packages, see [Organize Ballerina code](/learn/organize-ballerina-code/).

1. In the terminal, execute the command below to create the Ballerina package for the API implementation.

    ```
    $ bal new write-a-restful-api
    ```

    You should see the output similar to the following.

    ```
    package name is derived as 'write_a_restful_api'. Edit the Ballerina.toml to change it.

    Created new package 'write_a_restful_api' at /Users/write-a-restful-api.
    ```

    This creates a directory named `write-a-restful-api` with sample Ballerina code, as shown below. 

    ```
    .
    ├── Ballerina.toml
    └── main.bal
    ```

    - `Ballerina.toml` is the file that makes the folder a Ballerina package. 
    - The `main.bal` file provides the look and feel of a simple Ballerina program. 

2. Remove the generated content in the `main.bal` file and open the diagram view in VS Code.

    ![Open diagram view](/learn/images/featured-scenarios/write-a-restful-api-with-ballerina/open-diagram-view.gif)

## Create the dataset

An in-memory dataset with three entries is used to keep things simple. Follow the steps below to add the definition of the record and the declaration of the [table](/learn/by-example/table/) that holds the data.

1. Generate the record types corresponding to the payload of the REST service by providing the record name as `CovidEntry` and the sample JSON object below.

    >**Tip:** You need to complete the generated record by adding the `public` keyword to the record, the pipe signs to mark the record as a closed one, and adding the `readonly` descriptor to the `iso_code` field to make it non-modifiable as it is the key of the table, which cannot be represented in the JSON format.

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
    ![Create data record](/learn/images/featured-scenarios/write-a-restful-api-with-ballerina/create-data-record.gif)

2. Create the table, as shown below.

    >**Tip:** Enter `CovidEntry` as the table type, `iso_code` as the key, and `covidTable` as the variable type when creating the table.

    ![Create data table](/learn/images/featured-scenarios/write-a-restful-api-with-ballerina/create-data-table.gif)

3. Replace the `{key: value}` placeholder of the generated table with the following entries to add the initial data to the table.

    ```
        {
            iso_code: "AFG", 
            country: "Afghanistan", 
            cases: 159303, 
            deaths: 7386, 
            recovered: 146084, 
            active: 5833
        },
        {
            iso_code: "SL", 
            country: "Sri Lanka", 
            cases: 598536, 
            deaths: 15243, 
            recovered: 568637, 
            active: 14656
        },
        {
            iso_code: "US", 
            country: "USA", 
            cases: 69808350, 
            deaths: 880976, 
            recovered: 43892277, 
            active: 25035097
        }
    ```
The generated record and the table will be as follows.

```ballerina
public type CovidEntry record {
    readonly string iso_code;
    string country;
    int cases;
    int deaths;
    int recovered;
    int active;
};

public final table<CovidEntry> key(iso_code) covidTable = table [
    {
        iso_code: "AFG",
        country: "Afghanistan",
        cases: 159303,
        deaths: 7386,
        recovered: 146084,
        active: 5833
    },
    {
        iso_code: "SL",
        country: "Sri Lanka",
        cases: 598536,
        deaths: 15243,
        recovered: 568637,
        active: 14656
    },
    {
        iso_code: "US",
        country: "USA",
        cases: 69808350,
        deaths: 880976,
        recovered: 43892277,
        active: 25035097
    }
];
```

## Create the service

Ballerina resources can only reside inside a service. Therefore, first, a service needs to be created. Create the service using the [Ballerina HTTP API Designer](/learn/vs-code-extension/design-the-services/http-api-designer/) in VS Code, as shown below.

>**Tip:** Use `/covid/status` as the service path (or the context) of the service, which is attached to the listener listening on port `9000`.

![Create REST service](/learn/images/featured-scenarios/write-a-restful-api-with-ballerina/create-rest-service.gif)

The generated REST service will be as follows.

```ballerina
service /covid/status on new http:Listener(9000) {
    resource function get .() returns error? {
    }
}
```

In this code:

- As both endpoints have a common URL segment, this is moved to the service level as the base path when creating the service.
- The service is associated with an `http:Listener`, which is the Ballerina abstraction that deals with network-level details such as the host, port, SSL, etc.

## Implement the first endpoint

The first endpoint has two resources: one to get data and the other to add data.

### Create the first resource to get data

Create the first resource of the first endpoint to get data using the [Ballerina HTTP API Designer](/learn/vs-code-extension/design-the-services/http-api-designer/) in VS Code, as shown below.

>**Tip:** Define an HTTP resource that allows the `GET` operation on the resource path `countries`. Use `CovidEntry[]`as the response type and replace the auto-generated  body of the resource with `return covidTable.toArray()`.

![Create GET resource](/learn/images/featured-scenarios/write-a-restful-api-with-ballerina/create-get-resource.gif)

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
- The default HTTP response status code for a resource method other than `post` is `200 OK`. The default HTTP response status code for an HTTP `POST` resource is `201 Created`. 

### Create the second resource to add data

Create the second resource of the first endpoint to add new COVID-19 data to the dataset by ISO code, using the [Ballerina HTTP API Designer](/learn/vs-code-extension/design-the-services/http-api-designer/) in VS Code, as shown below.

>**Tip:** Define an HTTP resource that allows the `POST` operation on the resource path `countries` and accepts a `CovidEntry[]` payload named `covidEntries`. Use `CovidEntry[]` and `ConflictingIsoCodesError` as the response types. Mark the `ConflictingIsoCodesError` as public once it is created.

![Create POST resource](/learn/images/featured-scenarios/write-a-restful-api-with-ballerina/create-post-resource.gif)

Implement the logic of this `POST` resource function with the code below.

```ballerina
resource function post countries(CovidEntry[] covidEntries)
                                    returns CovidEntry[]|ConflictingIsoCodesError {

    string[] conflictingISOs = from CovidEntry covidEntry in covidEntries
        where covidTable.hasKey(covidEntry.iso_code)
        select covidEntry.iso_code;

    if conflictingISOs.length() > 0 {
        return {
            body: string:'join(" ", "Conflicting ISO Codes:", ...conflictingISOs)
        };
    } else {
        covidEntries.forEach(covidEntry => covidTable.add(covidEntry));
        return covidEntries;
    }
}
```

In this code:

- It is chosen to accept the entire payload or send back an error. Copying this straightway results in an error, which is expected as the `ConflictingIsoCodesError` type is not defined yet.
- This resource has an argument named `covidEntries`, which means the resource expects a payload with the `CovidEntry[]` type. Two types of records, `CovidEntry[]` and `ConflictingIsoCodesError`, will be used as the return types.

## Implement the second endpoint

The second endpoint has only one resource to get COVID-19 data filtered by the ISO code.

### Create the resource of the second endpoint

Similar to how you created the [second resource of the first endpoint](#create-the-second-resource-to-add-data), create the resource of the second endpoint below using the diagram view in VS Code.

>**Tip:** Define an HTTP resource that allows the `GET` operation on the resource path `countries` and accepts the `iso_code` path parameter. Use `CovidEntry[]` and `InvalidIsoCodeError` as the response types. Mark the `InvalidIsoCodeError` as `public` once it is created.

![Create second GET resource](/learn/images/featured-scenarios/write-a-restful-api-with-ballerina/create-second-get-resource.gif)

Implement the logic of this `GET` resource function with the code below.

```ballerina
resource function get countries/[string iso_code]() returns CovidEntry|InvalidIsoCodeError {
    CovidEntry? covidEntry = covidTable[iso_code];
    if covidEntry is () {
        return {
            body: string `Invalid ISO Code: ${iso_code}`  
        };
    }
    return covidEntry;
}
```

In this code:
- This resource is different from the first two resources. As explained earlier, resource methods have accessors.
- It also supports hierarchical paths, making it ideal for implementing RESTful APIs. Hierarchical paths can have path params.
- In this case, `iso_code` is used as the path param, which, in turn, becomes a `string` variable.

## The complete code

Below is the complete code of the service implementation.

```ballerina
import ballerina/http;

service /covid/status on new http:Listener(9000) {

    resource function get countries() returns CovidEntry[] {
        return covidTable.toArray();
    }

    resource function post countries(CovidEntry[] covidEntries)
                                    returns CovidEntry[]|ConflictingIsoCodesError {

        string[] conflictingISOs = from CovidEntry covidEntry in covidEntries
            where covidTable.hasKey(covidEntry.iso_code)
            select covidEntry.iso_code;

        if conflictingISOs.length() > 0 {
            return {
                body: string:'join(" ", "Conflicting ISO Codes:", ...conflictingISOs)
            };
        } else {
            covidEntries.forEach(covidEntry => covidTable.add(covidEntry));
            return covidEntries;
        }
    }

    resource function get countries/[string iso_code]() returns CovidEntry|InvalidIsoCodeError {
        CovidEntry? covidEntry = covidTable[iso_code];
        if covidEntry is () {
            return {
                body: string `Invalid ISO Code: ${iso_code}`
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
    string body;
|};

public type InvalidIsoCodeError record {|
    *http:NotFound;
    string body;
|};
```

- It is always a good practice to document your interfaces. However, this example has omitted documentation for brevity. Nevertheless, any production-ready API interface must include API documentation. 
- You can also try generating an OpenAPI specification for the written service by executing the following command, which creates a `yaml` file in the current folder.

## Run the service

Use the [**Run**](/learn/vs-code-extension/run-a-program/) CodeLens of the VS Code extension to build and run the service, as shown below.

![Run the service](/learn/images/featured-scenarios/write-a-restful-api-with-ballerina/run-the-service.gif)

>**Info:** Alternatively, you can run this service by navigating to the project root (i.e., the `write-a-restful-api` directory) and executing the `bal run` command. The console should have warning logs related to the isolatedness of resources. It is a built-in service concurrency safety feature of Ballerina.

You should see the output similar to the following.

```
Compiling source
        featured_scenarios/write_a_restful_api:0.1.0
HINT [main.bal:(40:5,40:5)] concurrent calls will not be made to this method since the method is not an 'isolated' method
HINT [main.bal:(43:5,43:5)] concurrent calls will not be made to this method since the method is not an 'isolated' method
HINT [main.bal:(61:5,61:5)] concurrent calls will not be made to this method since the method is not an 'isolated' method

Running executable
```

## Try the service

Use the [**Try it**](/learn/vs-code-extension/try-the-services/try-http-services/) CodeLens of the VS Code extension to send a request to the service to try out the use case.

### Get all countries

Retrieve all the available records of all countries, as shown below.

![Get all countries](/learn/images/featured-scenarios/write-a-restful-api-with-ballerina/get-all-countries.gif)

### Add a country by the ISO code 

Add a record of a country by its ISO code by passing the following payload, as shown below.

```json
{
  "iso_code": "DEU",
  "country": "Germany",
  "cases": 159333.0,
  "deaths": 7390.0,
  "recovered": 126084.0,
  "active": 6833.0
}
```

![Add a country](/learn/images/featured-scenarios/write-a-restful-api-with-ballerina/add-a-country.gif)

### Filter a country by the ISO code

Retrieve a specific record of a country by providing its ISO code (e.g., `AFG`), as shown below.

![Filter a country](/learn/images/featured-scenarios/write-a-restful-api-with-ballerina/filter-a-country.gif)

## Learn more

To learn more about RESTful services in Ballerina, see the following:
- [`http` module documentation](https://lib.ballerina.io/ballerina/http/latest)
- [Service path and resource path](/learn/by-example/http-service-and-resource-paths/)
