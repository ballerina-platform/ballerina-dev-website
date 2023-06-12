---
layout: ballerina-testing-code-left-nav-pages-swanlake
title: Test services and clients
description: Learn how to use Ballerina's built-in test framework to write tests for Services and Clients.
keywords: ballerina, programming language, testing
permalink: /learn/test-ballerina-code/test-services-and-clients/
active: testing-services-and-clients
intro: Testing Ballerina services involves sending specific requests to the service using a client and verifying the responses using the assertion functions. The aim is to make sure that the service and client behave as expected when sending and recieving both expected requests and malformed ones.
---

## Test services

Any services defined in the package will start up on the specified ports and will remain running for the duration of the testing phase. After completing tests, the services will shut down automatically.
 It allows you to send requests directly to the service to test its functionality.

>**Note:** The service starts automatically, only if you have tests in the module where it is defined.

***Example:***

To test a service, you can create a client in the test source, which sends requests directly to
the service and use the test assertion functions to assert the responses. This can be used for both
external services and services defined in the package as well.

***main.bal***
```ballerina
import ballerina/http;

service http:Service /foo on new http:Listener(9090) {

    resource function get bar(int value) returns http:Ok|http:BadRequest {

        if value < 0 {
            return <http:BadRequest>{body: "Incorrect ID value"};
        }
        return <http:Ok>{body: "Retrieved ID " + value.toString()};
    }
}
```

***main_test.bal***
```ballerina
import ballerina/test;
import ballerina/http;

http:Client testClient = check new ("http://localhost:9090/foo");

@test:Config {}
public function testGet() returns error? {
    http:Response response = check testClient->get("/bar/?value=10");
    test:assertEquals(response.statusCode, http:STATUS_OK);
    test:assertEquals(response.getTextPayload(), "Retrieved ID 10");

    response = check testClient->get("/bar/?value=-5");
    test:assertEquals(response.statusCode, http:STATUS_BAD_REQUEST);
    test:assertEquals(response.getTextPayload(), "Incorrect ID value");
}
```

## Test clients

In cases where a fully fledged client is already defined for a particular service, you can make use
of `object mocking` to mock the calls to the service and return curated responses to the client.
It is useful when testing the full extent of the client by mocking responses that are difficult to reproduce in actual scenarios.
 It would cover a variety of cases that the client can handle without having the service to be up and running.

***Example:***
The following is a simple example on how mocking can be used to stub responses to services that you 
may not be able to access during the test execution.

***main.bal***

```ballerina
import ballerina/io;
import ballerina/http;

http:Client clientEndpoint = check new ("https://api.chucknorris.io/jokes/");

// This function performs a `get` request to the Chuck Norris API and returns a random joke
// with the name replaced by the provided name or an error if the API invocation fails.
function getRandomJoke(string name) returns string|error {

    http:Response response = check clientEndpoint->get("/random");

    if response.statusCode != http:STATUS_OK {
        string errorMsg = "error occurred while sending GET request";
        io:println(errorMsg, ", status code: ", response.statusCode, ", payload: ", response.getJsonPayload());
        return error(errorMsg);
    }

    json payload = check response.getJsonPayload().ensureType();
    string joke = check payload.value;
    string replacedText = re `Chuck Norris`.replaceAll(joke, name);
    return replacedText;
}
```

***main_test.bal***

```ballerina
import ballerina/test;
import ballerina/http;

@test:Config {}
public function testGetRandomJoke() returns error? {
    clientEndpoint = test:mock(http:Client);

    test:prepare(clientEndpoint).when("get").thenReturn(getMockResponse());

    http:Response result = check clientEndpoint->get("/random");
    json payload = check result.getJsonPayload();

    test:assertEquals(payload, {"value": "When Chuck Norris wants an egg, he cracks open a chicken."});    
}

function getMockResponse() returns http:Response {
    http:Response mockResponse = new;
    mockResponse.setPayload({"value": "When Chuck Norris wants an egg, he cracks open a chicken."});
    return mockResponse;
}
```

### Mock `final` clients

Object mocking cannot be used as final clients cannot be modified. It is recommended 
to write the client initialization logic in a separate function and assign the returned value to the client to facilitate testing. 
This initialization function can then be mocked using the compile-time function mocking feature.

***Example:***
The following is a simple example on how to mock a `final` client.

***Initialize the client:***
```ballerina
import ballerina/http;

final http:Client clientEndpoint = check intializeClient();

function intializeClient() returns http:Client|error {
   return new ("https://api.chucknorris.io/jokes/");
}
```

***Mock the client for testing:***
```ballerina
import ballerina/http;
import ballerina/test;

@test:Mock { functionName: "intializeClient" }
function getMockClient() returns http:Client|error {
    return test:mock(http:Client);
}
```
To lean more about how to use mocking to test services, see [Mocking](/learn/test-ballerina-code/mocking).

## Configure services and clients

Service or client configurations can be defined for testing using Configurable variables.
Maintaining a test configurable configuration allows us to re-define the host or port as required.
For example, when defining a service, the value for the host or port can be specified in the
`Config.toml` file, which will be used specifically when running the tests.

***main.bal***
```ballerina
import ballerina/http;

configurable int port = 1234;

service http:Service /foo on new http:Listener(port) {

    resource function get bar(int value) returns http:Ok|http:BadRequest {

        if value < 0 {
            return <http:BadRequest>{body: "Incorrect ID value"};
        }
        return <http:Ok>{body: "Retrieved ID " + value.toString()};
    }
}
```

***main_test.bal***
```ballerina
import ballerina/test;
import ballerina/http;

configurable string hostName = "http://originalService.com/foo";

http:Client testClient = check new (hostName);

@test:Config {}
public function testGet() returns error? {
    http:Response response = check testClient->get("/bar/?value=10");
    test:assertEquals(response.statusCode, http:STATUS_OK);
    test:assertEquals(response.getTextPayload(), "Retrieved ID 10");

    response = check testClient->get("/bar/?value=-5");
    test:assertEquals(response.statusCode, http:STATUS_BAD_REQUEST);
    test:assertEquals(response.getTextPayload(), "Incorrect ID value");
}
```

The `Config.toml` must be placed in the `tests` folder for the values to be applied during execution.

```toml
hostName = "http://localhost:9091/foo"
port = 9091
```
