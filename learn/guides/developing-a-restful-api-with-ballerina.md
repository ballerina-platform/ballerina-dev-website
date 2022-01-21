---
layout: developing-a-restful-api-with-ballerina
title: Developing a RESTful API with Ballerina
permalink: /learn/developing-a-restful-api-with-ballerina/
description: This simple guide helps you understand the basics of Ballerina constructs which allow you to write RESTful APIs. 
active: developing-a-restful-api-with-ballerina
intro: This simple guide helps you understand the basics of Ballerina constructs which allow you to write RESTful APIs. 
redirect_from:
  - /learn/developing-a-restful-api-with-ballerina
---

This simple guide helps you understand the basics of Ballerina constructs which allow you to write RESTful APIs. 

Due to the batteries included nature of Ballerin language there is no need to add any third party libraries to implement the RESTful API. The Ballerina standard library itself is adequate. In this API you will be writing a simple CRUD like RESTful service. 

To get the best out of the guide it is better to have some idea about Ballerina.

In this tutorial, you will be creating a RESTful API with two endpoints. The sample is built around a set of covid19 data.

The tutorial includes the following steps,

1. Design the two endpoints 
2. Create the covid19 dataset 
3. Write a resource to get all the covid19 data
4. Write a resource to add covid19 data by ISO code
5. Write a resource to get filtered covid19 data by ISO code


## Prerequisite

Following two prerequisites are needed for this tutorial. 

1. [Ballerina Swan Lake](https://ballerina.io/downloads/)
2. [VSCode](https://code.visualstudio.com/download) with [Ballerina extension](https://marketplace.visualstudio.com/items?itemName=WSO2.Ballerina)

## Design the Two Endpoints 

The first endpoint is about getting data from the service as well as adding data to the service. Therefore, the service should handle both HTTP GET and POST requests. The GET request is to get data whereas the POST request is to add data. In the case of the GET request the response should be 200 OK whereas in the case of POST request the response should be 201 created.

The second endpoint is about getting filtered data from the service. The data is filtered by the ISO code. Therefore, the second service accepts the ISO code as part of the URL and then responds with 200 OK status code. In the event of an error the relevant error is sent back to the client.

Following is the URL for each endpoint respectively.

1. /covid/status/countries
2. /covid/status/countries/{iso_code}

## Create a Package for Your Code

Ballerina uses packages to group code. In this case, a package with the default module is created by executing the following command.

`bal new covid19 -t service`

This creates a folder named covid19 along with a sample code for a service. Move to the new folder and execute the following command to start VSCode.

`code .`

`Ballerina.toml` is the file which actually makes the folder a Ballerina package. It also contains a test directory to include tests for the service. But for the sake of simplicity we will ignore it in this tutorial. You can just go through the sample to get a look and feel about Ballerina services. However, we will be starting with a blank page. Hence, before you start you can delete the entire code or edit it if you wish.

## Create the Covid19 Dataset 

To keep things simple a in memory dataset is used with three entries. Ballerina tables are used to store data. Each entry in the table is represented by a Ballerina record. Following is the definition of the record and the declaration of the table.

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
    { iso_code: "AFG", country: "Afghanistan", cases: 159303, deaths: 7386, recovered: 146084, active: 5833 },
    { iso_code: "SL", country: "Sri Lanka", cases: 598536, deaths: 15243, recovered: 568637, active: 14656 },
    { iso_code: "US", country: "USA", cases: 69808350, deaths: 880976, recovered: 43892277, active: 25035097 }
];
```

## Write a Resource to Get All the Covid19 Data

As mentioned earlier, the first endpoint has two parts: getting data as well as adding data. In this section, the focus is on getting data. 

Ballerina resources can only be inside a service. Therefore, first a service needs to be created. If you have noticed, both endpoints have a common URL segment. When creating the service, the common URL segment can be moved to service level as the base path. 

Each service is associated with a `http:Listener`, it is the Ballerina abstraction which deals with network level details such as host, port, SSL, etc. 

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

Unlike normal functions resource functions can have accessors. In this case accessor is set to `get`, which means only HTTP GET requests could hit this resource. 

Ballerina automatically serializes Ballerina records as JSON and sends them over the wire. The default status code HTTP responses are 200 OK.

## Write a Resource to Add Covid19 Data by ISO Code

The second part of the first endpoint is about adding or appending new data to the dataset. Following is the second resource associated with the first endpoint.

```ballerina
resource function post countries(@http:Payload CovidEntry covidEntry) 
                                    returns CreatedCovidEntry|ConflictingIsoCodeError {
    if covidTable.hasKey(covidEntry.iso_code) {
        return <ConflictingIsoCodeError>{ 
            body : { 
                errmsg : string `Conflicting ISO Code: ${covidEntry.iso_code}`
            } 
        };
    }
    covidTable.add(covidEntry); 
    return <CreatedCovidEntry>{ body: covidEntry }; 
}
```

Copying this straightway results in an error which is expected as the `ConflictingIsoCodeError` type is not defined yet.

This resource is a bit more interesting than the second resource. To begin with there is a resource argument named `covidEntry` annotated with `@http:Payload`. This basically means the resource is expecting a payload with type `CovideEntry`. 

Finally, as the return values there are two types of records `CovidEntry` and `ConflictingIsoCodeError`. The former is the same record that was used in the first resource. The other is a bit different and the following is the definition of `ConflictingIsoCodeError`.

```ballerina
public type ConflictingIsoCodeError record {|
    *http:Conflict;
    ErrorMsg body;
|};
public type ErrorMsg record {|
    string errmsg;
|};
```

As you can see, there is something new here. `*http:Conflict` is the Ballerina way of saying one type is a subtype another. In this case `ConflictingIsoCodeError` is a subtype of `*http:Conflict`.Ballerina has defined a set of types for each HTTP status code. This allows users to write services in a type oriented way which is in turn helpful when it comes to tooling and generating OpenAPI specification for HTTP services. Returning this record results in HTTP 409 response with JSON payload. 

The body of the response is of type `ErrorMsg` which simply has a string field named `errmsg`. Based on the need users can have any data type for their response body.

## Write a Resource to Get Filtered Covid19 Data by ISO Code

This resource is a bit more different than the first two resources. As you already know resource functions have accessors. In addition, it also supports hierarchical paths. Making it ideal for implementing RESTful APIs. Hierarchical paths can have path params. In this case iso_code is used as the path param which intern becomes a string variable. 

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

As in the previous example, this resource also includes its own return types. But the basic principle behind them is as the previous example. Following is the type definition of `InvalidIsoCodeError`.

```ballerina
public type InvalidIsoCodeError record {|
    *http:NotFound;
    ErrorMsg body;
|};
```
## The Complete Code

It is always a good practice to document your interfaces. However, this example has omitted documentation for brevity. But any production ready API interface must include API documentation. 

You can run the service by executing the following command inside the `covid19` folder. 

`bal run`

> **Note**: Console should have warning logs related to isolatedness of resources. It is a built-in service concurrency safety feature in Ballerina. 

You can also try generating OpenAPI specification for the written service by executing the following command which creates a `yaml` file in the current folder.

`bal openapi -i service.bal`

```ballerina
import ballerina/http;

service /covid/status on new http:Listener(9000) {

    resource function get countries() returns CovidEntry[] {
        return covidTable.toArray();
    }

    resource function post country(@http:Payload CovidEntry covidEntry) 
                                    returns CreatedCovidEntry|ConflictingIsoCodeError {
        if covidTable.hasKey(covidEntry.iso_code) {
            return <ConflictingIsoCodeError>{ 
                body : { 
                    errmsg : string `Conflicting ISO Code: ${covidEntry.iso_code}`
                } 
            };
        }
        covidTable.add(covidEntry); 
        return <CreatedCovidEntry>{ body: covidEntry }; 
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
    { iso_code: "AFG", country: "Afghanistan", cases: 159303, deaths: 7386, recovered: 146084, active: 5833 },
    { iso_code: "SL", country: "Sri Lanka", cases: 598536, deaths: 15243, recovered: 568637, active: 14656 },
    { iso_code: "US", country: "USA", cases: 69808350, deaths: 880976, recovered: 43892277, active: 25035097 }
];
public type CreatedCovidEntry record {|
    *http:Created;
    CovidEntry body;
|};

public type ConflictingIsoCodeError record {|
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
