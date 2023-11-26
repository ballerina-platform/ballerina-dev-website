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

To implement this use case, you will develop a REST service with a single resource using Visual Studio Code with the Ballerina Swan Lake extension and then run the service. The resource will receive the user request, retrieve details from the backend service, and respond to the user request with the relevant doctor details.

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

2. Remove the generated content in the `main.bal` file and open the diagram view in VS Code.

    ![Open diagram view](/learn/images/integration-tutorials/sending-a-message-to-a-service/open_diagram_view.gif)

3. Generate a record type corresponding to the payload from the backend service by providing a sample of the expected JSON payload.

    The payload from the backend service will be an array of JSON objects, where each JSON object will be similar to the following.

    ```json
    {
        "name": "thomas collins",
        "hospital": "grand oak community hospital",
        "category": "surgery",
        "availability": "9.00 a.m - 11.00 a.m",
        "fee": 7000
    }
    ```
   
    ![Define a record](/learn/images/integration-tutorials/sending-a-message-to-a-service/define_record.gif)

    The generated record type will be as follows.

    ```ballerina
    type Doctor record {
        string name;
        string hospital;
        string category;
        string availability;
        decimal fee;
    };
    ```

    > **Note:**
    > While it is possible to work with the JSON payload directly, using record types offers several advantages including enhanced type safety, data validation, and better tooling experience (e.g., completion).

    > **Note:**
    > When the fields of the JSON objects are expected to be exactly those specified in the sample payload, the generated records can be updated to be [closed records](https://ballerina.io/learn/by-example/controlling-openness/), which would indicate that no other fields are allowed or expected.

4. Define the [HTTP service (REST API)](https://ballerina.io/learn/by-example/#rest-service) that has the resource that accepts user requests, retrieves relevant details from the backend service, and responds to the request.

    - Open the [Ballerina HTTP API Designer](https://wso2.com/ballerina/vscode/docs/design-the-services/http-api-designer) in VS Code
   
    - Use `/healthcare` as the service path (or the context) of the service, which is attached to the listener listening on port `8290`.

        ![Define the service](/learn/images/integration-tutorials/sending-a-message-to-a-service/define_a_service.gif)

    - Define an HTTP resource that allows the `GET` operation on the resource path `/doctors` and accepts the `category` path parameter (corresponding to the specialization). Use `Doctor[]`, `http:NotFound`, and `http:InternalServerError` as the response types.

        ![Define the resource](/learn/images/integration-tutorials/sending-a-message-to-a-service/define_a_resource.gif)

        The generated service will be as follows.
    
        ```ballerina
        service /healthcare on new http:Listener(8290) {
            resource function get doctors/[string category]() 
                    returns Doctor[]|http:NotFound|http:InternalServerError {
                
            }
        }
        ```

5. Define a [configurable variable](https://ballerina.io/learn/by-example/#configurability) for the URL of the backend service and an [`http:Client`](https://ballerina.io/learn/by-example/#http-client) object to send requests to the backend service.

    ![Define a configurable variable and a client](/learn/images/integration-tutorials/sending-a-message-to-a-service/define_a_configurable_variable_and_a_client.gif)

    The generated code will be as follows.

    ```ballerina
    configurable string healthcareBackend = "http://localhost:9090/healthcare";
    final http:Client queryDoctorEP = check new (healthcareBackend);
    ```

6. Implement the logic to retrieve and respond with relevant details.

    ```ballerina
    service /healthcare on new http:Listener(8290) {
        resource function get doctors/[string category]() 
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

    - The call to the backend is done using a remote method call expression (using `->`), which distinguishes network calls from normal method calls. [Client data binding](https://ballerina.io/learn/by-example/http-client-data-binding/) is used to directly try and bind the JSON response on success to the expected array of records.

    - Use the `is` check to decide the response based on the response to the backend call. If the backend call was successful and the response payload was an array of `Doctor` records (as expected), then directly return the array from the resource. 

    - If the backend call fails, send an `http:NotFound` response if the client call failed with a `4xx` status code or send an `http:InternalServerError` response for other failures.

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

configurable string healthcareBackend = "http://localhost:9090/healthcare";

final http:Client queryDoctorEP = check new (healthcareBackend);

service /healthcare on new http:Listener(8290) {
    resource function get doctors/[string category]() 
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

<img src="/learn/images/integration-tutorials/sending-a-message-to-a-service/sequence_diagram.png" alt="Sequence Diagram" height="800" style="width:auto; max-width:100%">

### Step 3: Build and run the service

![Run the service](/learn/images/integration-tutorials/sending-a-message-to-a-service/run_the_service.gif)

> **Note:**
> Alternatively, you can run this service by navigating to the project root and using the `bal run` command.
>
> ```
> sending-a-message-to-a-service$ bal run
> Compiling source
>         integration_tutorials/sending_a_message_to_a_service:0.1.0
>
> Running executable
> ```

### Step 4: Try out the use case

Let's test the use case by sending a request to the service.

#### Start the backend service

Download the JAR file for the [backend service](https://github.com/ballerina-guides/integration-tutorials/blob/main/backends/hospital-service/hospitalservice.jar), and execute the following command to start the service:

```
$ bal run hospitalservice.jar
```

#### Send a request

Use the [Try it](https://wso2.com/ballerina/vscode/docs/try-the-services/try-http-services/) feature to send a request to the service. Specify `surgery` as the path parameter.

![Send a request](/learn/images/integration-tutorials/sending-a-message-to-a-service/try_it.gif)

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

1. Change `queryDoctorEP` initialization in the source code to use a separate function that can be mocked.

    Replace

    ```ballerina
    final http:Client queryDoctorEP = check new (healthcareBackend);
    ```

    with

    ```ballerina
    final http:Client queryDoctorEP = check initializeHttpClient();

    function initializeHttpClient() returns http:Client|error => new (healthcareBackend);
    ```

2. Define an `http:Client` object to send requests to the healthcare service.

    ```ballerina
    final http:Client cl = check new (string `http://localhost:8290/healthcare/doctors`);
    ```

3. Define a variable with mock payload from the backend service. This variable will be used to mock the payload from the backend and to verify the received payload

    ```ballerina
    map<json>[] & readonly surgeons = [
        {
            "name": "thomas collins",
            "hospital": "grand oak community hospital",
            "category": "surgery",
            "availability": "9.00 a.m - 11.00 a.m",
            "fee": 7000.0d
        },
        {
            "name": "anne clement",
            "hospital": "clemency medical center",
            "category": "surgery",
            "availability": "8.00 a.m - 10.00 a.m",
            "fee": 12000.0d
        },
        {
            "name": "seth mears",
            "hospital": "pine valley community hospital",
            "category": "surgery",
            "availability": "3.00 p.m - 5.00 p.m",
            "fee": 8000.0d
        }
    ];
    ```

4. Mock the backend service by mocking the `http:Client` object and the `get` resource method. Then, mock the `initializeHttpClient` function, using the `@test:Mock` annotation, to return the mock HTTP client.

    ```ballerina
    public client class MockHttpClient {
        resource function get [string... path](map<string|string[]>? headers = (), 
                                                        http:TargetType targetType = http:Response,
                                                        *http:QueryParams params) 
                                                    returns http:Response|anydata|http:ClientError {
            match path[0] {
                "surgery" => {
                    return surgeons;
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

5. Use the `@test:Config` annotation to indicate that a function is a test function. Implement the test to send a request to the service and test for value equality between the retrieved payload and the expected payload using the `test:assertEquals` function.

    ```ballerina
    @test:Config
    function testSuccessfulRequest() returns error? {
        Doctor[] doctors = check cl->/surgery;
        test:assertEquals(doctors, surgeons);
    }
    ```

6. Run the tests.

    ![Run the tests](/learn/images/integration-tutorials/sending-a-message-to-a-service/run_tests.gif)

   Alternatively, you can run all the tests in a package by navigating to the project root and using the `bal test` command.

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
