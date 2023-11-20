---
layout: ballerina-sending-a-message-to-a-service-left-nav-pages-swanlake
title: Sending a message to a service 
permalink: /learn/sending-a-message-to-a-service/
description: Integration tutorial for sending a message to a service.
keywords: ballerina, programming language, client, restful-api, integration
active: sending-a-message-to-a-service
intro: This tutorial helps you understand the basics of how Ballerina can be used to do client calls and develop RESTful APIs.
---

## Overview

In this tutorial, you will develop a service that allows a user to retrieve a list of doctors based on the doctor's specialization (category). The information about the doctors is retrieved from a separate microservice. 

To implement this use case, you will develop a REST service with a single resource using Visual Studio Code with the Ballerina Swan Lake extension, and then, run the service. The resource will receive the user request, retrieve details from the backend service, and respond to the user request with the relevant doctor details.

### Concepts covered

- REST API
- HTTP client

## Develop the application

### Step 1: Set up the workspace

Install [Ballerina Swan Lake](https://ballerina.io/downloads/) and the [Ballerina Swan Lake extension](https://marketplace.visualstudio.com/items?itemName=wso2.ballerina) on VS Code.

### Step 2: Develop the service

Follow the instructions given in this section to develop the service.

1. Create a new Ballerina project using the `bal` command and open it in VS Code.

    ```
    $ bal new sending-a-message-to-a-service
    ```

2. Introduce the source code in files with the `.bal` extension (e.g., the `main.bal` file). 

    Import the 
    - `ballerina/http` module to develop the REST API and define the client that can be used to send requests to the backend service
    - `ballerina/log` module to log some information for each client request

    ```ballerina
    import ballerina/http;
    import ballerina/log;
    ```

3. Define two [configurable variables](https://ballerina.io/learn/by-example/#configurability) for the port on which the listener should listen and the URL of the backend service.

    ```ballerina
    configurable int port = 8290;
    configurable string healthcareBackend = "http://localhost:9090/healthcare";
    ```

4. Define an [`http:Client` client](https://ballerina.io/learn/by-example/#http-client) to send requests to the backend service.

    ```ballerina
    final http:Client queryDoctorEP = check initializeHttpClient();

    function initializeHttpClient() returns http:Client|error => new (healthcareBackend);
    ```

    The argument to the `new` expression is the URL for the backend service.

5. Define a record corresponding to the payload from the backend service.

    ```ballerina
    type Doctor record {|
        string name;
        string hospital;
        string category;
        string availability;
        decimal fee;
    |};
    ```

    The payload will be an array of JSON objects in which, the structure of each JSON object matches this record. Note that you can use the "Paste JSON as record" VS Code command to generate the record if you have the JSON payload.

6. Define the [HTTP service (REST API)](https://ballerina.io/learn/by-example/#rest-service) that has the resource that accepts user requests, retrieves relevant details from the backend service, and responds to the request. Use `/healthcare` as the service path (or the context) of the service, which is attached to the listener listening on port `port`. Define an HTTP resource that allows the `GET` operation on resource path `/querydoctor` and accepts the `category` (corresponding to the specialization) as a path parameter.

    ```ballerina
    service /healthcare on new http:Listener(port) {
        resource function get querydoctor/[string category]() {
            
        }
    }
    ```

7. Implement the logic to retrieve and respond with relevant details.

    ```ballerina
    service /healthcare on new http:Listener(port) {
        resource function get querydoctor/[string category]() 
                returns Doctor[]|http:NotFound|http:InternalServerError {
            log:printInfo("Retrieving information", specialization = category);
            
            Doctor[]|http:ClientError resp = queryDoctorEP->/[category];
            if resp is Doctor[] {
                return resp;
            }

            if resp is http:ClientRequestError {
                return <http:NotFound> {body: string `category not found: ${category}`};
            }

            return <http:InternalServerError> {body: resp.message()};
        }
    }
    ```

    - The `log:printInfo` statement [logs](https://ballerina.io/learn/by-example/#log) information about the request.

        ```ballerina
        log:printInfo("Retrieving information", specialization = category);
        ```

    - The call to the backend is done using a remote method call expression (using `->`), which distinguishes network calls from normal method calls. [Client data binding](https://ballerina.io/learn/by-example/http-client-data-binding/) is used to directly try and bind the JSON response on success to the expected array of records.

        ```ballerina
        Doctor[]|http:ClientError resp = queryDoctorEP->/[category];
        ```

    - Use the `is` check to decide the response based on the response to the client call. If the client call was successful and the respond payload was an array of `Doctor` records (as expected), then, directly return the array from the resource. If the request failed, send an `http:NotFound` response if the client call failed with a `4xx` status code or return an `http:InternalServerError` response for other failures.

        ```ballerina
        log:printInfo("Retrieving information", specialization = category);

        Doctor[]|http:ClientError resp = queryDoctorEP->/[category];
        if resp is Doctor[] {
            return resp;
        }

        log:printError("Retrieving doctor information failed", resp);
        if resp is http:ClientRequestError {
            return <http:NotFound> {body: string `category not found: ${category}`};
        }

        return <http:InternalServerError> {body: resp.message()};
        ```

You have successfully developed the required service.

#### Complete source

```ballerina
import ballerina/http;
import ballerina/log;

type Doctor record {|
    string name;
    string hospital;
    string category;
    string availability;
    decimal fee;
|};

configurable int port = 8290;
configurable string healthcareBackend = "http://localhost:9090/healthcare";

final http:Client queryDoctorEP = check initializeHttpClient();

function initializeHttpClient() returns http:Client|error => new (healthcareBackend);

service /healthcare on new http:Listener(port) {
    resource function get querydoctor/[string category]() 
            returns Doctor[]|http:NotFound|http:InternalServerError {
        log:printInfo("Retrieving information", specialization = category);
        
        Doctor[]|http:ClientError resp = queryDoctorEP->/[category];
        if resp is Doctor[] {
            return resp;
        }
        
        log:printError("Retrieving doctor information failed", resp);
        if resp is http:ClientRequestError {
            return <http:NotFound> {body: string `category not found: ${category}`};
        }

        return <http:InternalServerError> {body: resp.message()};
    }
}
```

#### Sequence diagram

The [sequence diagram view](https://wso2.com/ballerina/vscode/docs/implement-the-code/sequence-diagram-view/) for the implemented resource method is the following.

<img src="/learn/images/tutorial_sending_a_message_to_a_service.png" alt="Sequence Diagram" height="800" style="width:auto; max-width:100%">

### Step 3: Build and run the service

You can run this service by navigating to the project root and using the `bal run` command.

```
sending-a-message-to-a-service$ bal run
Compiling source
        integration_tutorials/sending_a_message_to_a_service:0.1.0

Running executable
```

### Step 4: Try out the use case

Let's test the use case by sending a request to the service.

#### Start the backend service

Download the JAR file for the [backend service](https://github.com/ballerina-guides/integration-tutorials/blob/main/backends/hospital-service/hospitalservice.jar), and execute the following command to start the service:

```
$ bal run hospitalservice.jar
```

#### Send a request

Let's send a request to the service using cURL as follows.

1. Install and set up [cURL](https://curl.se/) as your client.

2. Execute the following command.

    ```
    $ curl -v http://localhost:8290/healthcare/querydoctor/surgery
    ```

#### Verify the response

You will see the response message from the backend with a list of details of the available doctors.

```json
[
    {
        "name": "thomas collins",
        "hospital": "grand oak community hospital",
        "category": "surgery",
        "availability": "9.00 a.m - 11.00 a.m",
        "fee": 7000.0
    },
    {
        "name": "anne clement",
        "hospital": "clemency medical center",
        "category": "surgery",
        "availability": "8.00 a.m - 10.00 a.m",
        "fee": 12000.0
    },
    {
        "name": "seth mears",
        "hospital": "pine valley community hospital",
        "category": "surgery",
        "availability": "3.00 p.m - 5.00 p.m",
        "fee": 8000.0
    }
]
```

Now, check the terminal in which you ran the Ballerina service. You should see a log similar to the following.

```
time = 2023-08-15T13:01:34.022+05:30 level = INFO module = integration_tutorials/sending_a_message_to_a_service message = "Retrieving information" specialization = "surgery"
```

### Step 5: Write tests for the use case

Let's test the use case by writing a test case that sends a request to the service and validates the payload for a successful request. Testing is enabled by the [Ballerina test framework](https://ballerina.io/learn/test-ballerina-code/test-services-and-clients/).

1. Introduce the tests in a `.bal` file within a directory named `tests` in the package. Import the `ballerina/test` module to use the Ballerina test framework and the `ballerina/http` module to use an `http:Client` client object to send requests to the implemented service and mock the backend service.

    ```ballerina
    import ballerina/http;
    import ballerina/test;
    ```

2. Mock the backend service by mocking the `http:Client` object and the `get` resource method. Then, mock the `initializeHttpClient` function, using the `@test:Mock` annotation, to return the mock HTTP client.

    ```ballerina
    public client class MockHttpClient {
        isolated resource function get [string... path](map<string|string[]>? headers = (), 
                                                        http:TargetType targetType = http:Response,
                                                        *http:QueryParams params) 
                                                    returns http:Response|anydata|http:ClientError {
            match path[0] {
                "surgery" => {
                    return getSurgeryResponsePayload();
                }
            }
            return <http:ClientRequestError> error ("unknown specialization", 
                                                body = string `unknown specialization: ${path[0]}`, 
                                                headers = {}, 
                                                statusCode = http:STATUS_NOT_FOUND);
        }
    }

    @test:Mock {
        functionName: "initializeHttpClient"
    }
    function initializeHttpClientMock() returns http:Client|error =>
        test:mock(http:Client, new MockHttpClient());
    ```

3. Use the `@test:Config` annotation to indicate that a function is a test function. Implement the test to send a request to the service and test for value equality between the retrieved payload and the expected payload using the `test:assertEquals` function.

    ```ballerina
    @test:Config
    function testSuccessfulRequest() returns error? {
        Doctor[] doctors = check cl->/surgery;
        test:assertEquals(doctors, getSurgeryResponsePayload());
    }
    ```

4. Run the `bal test` command from the project root to run the tests.

    ```
    sending-a-message-to-a-service$ bal test
    Compiling source
            integration_tutorials/sending_a_message_to_a_service:0.1.0

    Running Tests

            sending_a_message_to_a_service
    time = 2023-08-17T09:01:23.758+05:30 level = INFO module = integration_tutorials/sending_a_message_to_a_service message = "Retrieving information" specialization = "surgery"


                    1 passing
                    0 failing
                    0 skipped
    ```

You have now developed and tested a simple Ballerina REST service, which receives a request, logs a message, sends a request to a backend service, and responds to the original request with the response from the backend service.

## Complete implementation

Check out the [complete implementation](https://github.com/ballerina-guides/integration-tutorials/tree/main/sending-a-message-to-a-service) on GitHub.

## References

- [`ballerina/http` API docs](https://lib.ballerina.io/ballerina/http/latest)
- [`ballerina/log` API docs](https://lib.ballerina.io/ballerina/log/latest)
- [`ballerina/test` API docs](https://lib.ballerina.io/ballerina/test/latest)
