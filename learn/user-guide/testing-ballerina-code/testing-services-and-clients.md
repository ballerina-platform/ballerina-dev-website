---
layout: ballerina-left-nav-pages-swanlake
title: Testing Services and Clients
description: Learn how to use Ballerina's built-in test framework to write tests for Services and Clients.
keywords: ballerina, programming language, testing
permalink: /learn/user-guide/testing-ballerina-code/testing-services-and-clients/
active: testing-services-and-clients
intro: The sections below include information about writing tests for Services and Clients in Ballerina.
redirect_from:
- /learn/testing-ballerina-code/testing-services-and-clients
- /swan-lake/learn/testing-ballerina-code/testing-services-and-clients/
- /swan-lake/learn/testing-ballerina-code/testing-services-and-clients
- /learn/testing-ballerina-code/testing-services-and-clients/
- /learn/testing-ballerina-code/testing-services-and-clients
- /learn/user-guide/testing-ballerina-code/testing-services-and-clients
---

## Testing Ballerina Services and Clients

Testing Ballerina services involves sending specific requests to the service using a client
and verifying the responses using the assertion functions. The aim is to make sure that the service
and client behave as expected when sending and recieving both expected requests and malformed ones.

### Testing Services

Any services defined in the package will start up on their defined ports and will remain running
for the duration of the testing phase after which they will be automatically shut down. This allows
you to send requests directly to the service in order to test its functionality.

>**Note:** You need to have tests defined in the respective module where the service is defined in
order for the service to start automatically.

***Example***

To test a service, you can create a client in the test source, which sends requests directly to
the service and use the test assertion functions to assert the responses. This can be used for both
services defined in the package as well.

***main.bal***
```ballerina
import ballerina/http;

service http:Service /foo on new http:Listener(9090) { 
    resource function get bar(int value) returns http:Response {
        http:Response response = new;

        if (value < 0) {
            response.statusCode = 400;
        } else {
            response.statusCode = 200;
        }

        return response;
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
    test:assertEquals(response.statusCode, 200);

    response = check testClient->get("/bar/?value=-5");
    test:assertEquals(response.statusCode, 400);
}
```

### Testing Clients

In cases where a fully fledged client is already defined for a particular service, you can make use
of object mocking to mock the calls to the service and return curated responses to the client.
This is useful when testing the full extent of the client by mocking responses that normally would
be difficult to reproduce in an actual scenario. This would cover a variety of scenarios that the
client is capable of handling without having the service to actually be up and running.

To lean more about how to use mocking to test services, see [Mocking](/learn/testing-ballerina-code/mocking).

### Configuring Services and Clients

Service or client configurations can be defined for testing using Configurable variables.
Maintaining a test configurable configuration allows us to re-define the host or port as required.
For example, when defining a service, the value for the host or port can be specified in the
`Config.toml` file, which will be used specifically when running the tests.

```ballerina
configurable string hostName = "http://localhost:9090/foo";
configurable int port = 9090;

http:Client testClient = check new (hostName);

service http:Service /foo on new http:Listener(port) { 
    resource function get bar(int value) returns http:Response {
        http:Response response = new;

        if (value < 0) {
            response.statusCode = 400;
        } else {
            response.statusCode = 200;
        }

        return response;
    }
}
```

The `Config.toml` must be placed in the `tests` folder for the values to be applied during execution.

```toml
hostName = "http://localhost:9091/foo"
port = 9091
```
