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

1. Use the Ctrl + ` keyboard shortcut with the backtick character to open the Terminal window of VS Code. 

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

Create the first resource of the first endpoint (to get data) using the [Ballerina HTTP API Designer](/learn/vs-code-extension/design-the-services/http-api-designer/) in VS Code as shown below.

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

