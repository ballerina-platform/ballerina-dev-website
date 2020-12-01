---
layout: ballerina-left-nav-pages
title: Mocking
description: Learn how to use Ballerina's built-in mocking API provided by the test to test modules
 independent from other modules and external endpoints.
keywords: ballerina, programming language, testing, mocking
permalink: /learn/testing-ballerina-code/mocking/
active: mocking
intro: Mocking is useful to control the behavior of functions and objects to control the communication with other modules and external endpoints. A mock can be created by defining return values or replacing the entire object or function with a user-defined equivalent. This feature will help you to test the Ballerina code independently from other modules and external endpoints.
redirect_from:
  - /v1-2/learn/testing-ballerina-code/mocking
  - /learn/testing-ballerina-code/mocking
---

## Mocking Objects

The `Test` module provides capabilities to mock an object for unit testing. This allows you to control the behavior of the object member functions and values of member fields via stubbing or replacing the entire object with a user-defined equivalent. This feature will help you to test the Ballerina code independently from other modules and external endpoints.

Mocking of objects can be done in two ways.

1. Creating a test double (providing an equivalent object in place of the real)
2. Stubbing the member function or member variable (specifying the behavior of the functions and values of the variables)


### Creating a Test Double

You can write a custom mock object and substitute it in place of the real object. The custom object should be made structurally equivalent to the real object via the mocking features in the test module.

***Example:***

Let's make changes to the example in the [Quick Start](/learn/testing-ballerina-code/testing-quick-start) to define a test
 double for the  `clientEndpont` object.

>**Note:** Only the `get` function is implemented since it is the only function used in the sample. Attempting to call
 any other member function of the `clientEndpoint` will result in a runtime error. 

***main_test.bal***

```ballerina
import ballerina/test;
import ballerina/http;
 
// An instance of this object can be used as the test double for the `clientEndpoint`.
public type MockHttpClient client object {
    public remote function get(@untainted string path, public http:RequestMessage message = ()) 
    	returns http:Response|http:ClientError {

        http:Response response = new;
        response.statusCode = 500;
        return response;
    }
};

@test:Config {}
public function testGetRandomJoke() {
    // create and assign a test double to the `clientEndpoint` object
    clientEndpoint=<http:Client>test:mock(http:Client, new MockHttpClient());

    // invoke the function to test
    string|error result = getRandomJoke("Sheldon");

    // verify that the function returns an error
    test:assertTrue(result is error);
}
```

### Stubbing Member Functions and Variables of an Object

Instead of creating a test double, you may also choose to create a default mock object and stub the functions to return a specific value or to do nothing.

***Example:***

The example in the [Quick Start](/learn/testing-ballerina-code/testing-quick-start) shows how the `get` function of the client object can be stubbed to return a value. Let’s make changes to that example to get a random joke from a specific category (e.g., food or movies).

***main.bal***

```ballerina
import ballerina/io;
import ballerina/http;
import ballerina/stringutils;

http:Client clientEndpoint = new("https://api.chucknorris.io/jokes/");

// This function performs a `get` request to the Chuck Norris API and returns a random joke 
// or an error if the API invocations fail.
function getRandomJoke(string name, string category = "food") returns string|error {
    http:Response response = checkpanic clientEndpoint->get("/categories");

    // Check if the provided category is available
    if (response.statusCode == http:STATUS_OK) {
        json[] categories = <json[]>response.getJsonPayload();
        if (!isCategoryAvailable(categories, category)) {
            error err = error("'" + category + "' is not a valid category.");
            io:println(err.message());
            return err;
        }
    } else {
    	return createError(response);
    }

    // Get a random joke from the provided category
    response = checkpanic clientEndpoint->get("/random?category=" + category);
    if (response.statusCode == http:STATUS_OK) {
        json payload = <json>response.getJsonPayload();
        json joke = <json>payload.value;
        string replacedText = stringutils:replace(joke.toJsonString(), "Chuck Norris", name);
        return replacedText;
    } else {
    	return createError(response);
    }
}
```

***utils.bal***

The util functions below are used to validate the categories and construct errors based on the HTTP response.

```ballerina
import ballerina/io;
import ballerina/http;

// This function checks if the provided category is a valid one.
function isCategoryAvailable(json[] categories, string category) returns boolean {
    foreach var cat in categories {
        if (cat.toJsonString() == category) {
            return true;
        }
    }
    return false;
}

// Returns an error based on the HTTP response.
function createError(http:Response response) returns error {
    error err = error("error occurred while sending GET request");
    io:println(err.message(), ", status code: ", response.statusCode);
    return err;
}
```

***test_utils.bal***

The util functions below are used to construct mock responses required for testing.
  
  ```ballerina
import ballerina/http;

// Returns a mock HTTP response to be used for the random joke API invocation.
function getMockResponse() returns http:Response {
    http:Response mockResponse = new;
    json mockPayload = {"value":"When Chuck Norris wants an egg, he cracks open a chicken."};
    mockResponse.setPayload(mockPayload);
    return mockResponse;
}

// Returns a mock response to be used for the category API invocation.
function getCategoriesResponse() returns http:Response {
    http:Response categoriesRes = new;
    json[] payload = ["animal","food","history","money","movie"];
    categoriesRes.setJsonPayload(payload);
    return categoriesRes;
}
```

#### Stubbing to Return a Specific Value

***main_test.bal***
 
This test stubs the behavior of the `get` function to return a specific value in 2 ways:
    
1. Stubbing to return a specific value in general
2. Stubbing to return a specific value based on the input

```ballerina
import ballerina/test;
import ballerina/http;

@test:Config {}
public function testGetRandomJoke() {
    // Create a default mock HTTP Client and assign it to the `clientEndpoint` object
    clientEndpoint = <http:Client>test:mock(http:Client);

    // Stub to return the specified mock response when the `get` function is called.
    test:prepare(clientEndpoint).when("get").thenReturn(getMockResponse());

    // Stub to return the specified mock response when the specified argument is passed.
    test:prepare(clientEndpoint).when("get").withArguments("/categories")
        .thenReturn(getCategoriesResponse());

    // Invoke the function to test.
    string result = checkpanic getRandomJoke("Sheldon");

    // Verify the return value against the expected string.
    test:assertEquals(result, "When Sheldon wants an egg, he cracks open a chicken.");
}
```

#### Stubbing with Multiple Values to Return Sequentially for Each Function Call

***main_test.bal***

This test stubs the behavior of the `get` function to return a specified sequence of values for each `get` function
 invocation (i.e., the first call to the `get` function will return the first argument and the second call will return the second
  argument).

```ballerina
import ballerina/test;
import ballerina/http;
    
@test:Config {}
public function testGetRandomJoke() {
    // Create a default mock HTTP Client and assign it to the `clientEndpoint` object.
    clientEndpoint = <http:Client>test:mock(http:Client);

    // Stub to return the corresponding value for each invocation 
    test:prepare(clientEndpoint).when("get")
        .thenReturnSequence(getCategoriesResponse(), getMockResponse());

    // Invoke the function to test
    string result = checkpanic getRandomJoke("Sheldon");

    // Verify the return value against the expected string
    test:assertEquals(result, "When Sheldon wants an egg, he cracks open a chicken.");
}
```

#### Stubbing a Member Variable

***main_test.bal***

This test shows how to stub a member variable value of the `clientEndpoint` object.

```ballerina
import ballerina/test;
import ballerina/http;

@test:Config {}
function testMemberVariable() {
    // Create a default mock HTTP Client and assign it to the `clientEndpoint` object.
    clientEndpoint = <http:Client>test:mock(http:Client);

    // Stub the value of the `url` variable to return the specified string.
    test:prepare(clientEndpoint).getMember("url").thenReturn("https://foo.com/");

    // Verify if the specified value is set.
    test:assertEquals(clientEndpoint.url, "https://foo.com/");
}
```

#### Stubbing to Do Nothing

If a function has an optional or no return type specified, this function can be mocked to do nothing when writing
 test cases.

***Example:***

***main.bal***

```ballerina
import ballerina/email;
import ballerina/io;

email:SmtpClient smtpClient = new ("localhost", "admin","admin");

// This function sends out emails to specified email addresses and returns an error if sending failed.
function sendNotification(string[] emailIds) returns error? {
    email:Email msg = {
        'from: "builder@abc.com",
        subject: "Error Alert ...",
        to: emailIds,
        body: ""
    };
    email:Error? response = smtpClient->send(msg);
    if (response is error) {
	io:println("error while sending the email: " + response.message());
  	return response;
    }
}
```
***main_test.bal***

This test stubs the behavior of the `send` function to do nothing for testing the `sendNotification` function.

```ballerina
import ballerina/test;
import ballerina/email;

@test:Config {}
function testSendNotification() {
    string[] emailIds = ["user1@test.com", "user2@test.com"];

    // Create a default mock SMTP client and assign it to the `smtpClient` object.
    smtpClient = <email:SmtpClient>test:mock(email:SmtpClient);

    // Stub to do nothing when the`send` function is invoked.
    test:prepare(smtpClient).when("send").doNothing();

    // Invoke the function to test and verify that no error occurred.
    test:assertEquals(sendNotification(emailIds), ());
}
```

## Mocking Functions

The Ballerina test framework provides the capability to mock a function. You can easily mock a function in a module that you are testing or a function of an imported module by using the mocking feature. This feature will help you to test your Ballerina code independently from other modules and functions.

The object specified with the `@test:Mock {}` annotation will be considered as a mock function, which gets triggered in place of the real function.

*   ***moduleName : "&lt;moduleName&gt;"*** - (optional) Name of the module in which the function to be mocked resides in. If the function is within the same module, this can be left blank or "." (no module) can be passed. If the function is in a different module but within the same project, just passing the module name will suffice. For functions in completely separate modules, the fully-qualified module name must be passed, which includes the `orgName` and the `version` i.e., `orgName/module:version`. For native functions, the Ballerina module needs to be specified.

*   ***functionName : "&lt;functionName&gt;"*** - Name of the function to be mocked.

***Example:***

***main.bal***

```ballerina
// This function returns the result provided by the `intAdd` function.
public function addValues(int a, int b) returns int {
    return intAdd(a, b);
}

// This function adds two integers and returns the result.
public function intAdd(int a, int b) returns int {
    return (a + b);
}
```

***main_test.bal***
 
This is the initialization of the mock function, which should be called in place of the `intAdd` function.

```ballerina
import ballerina/test;

@test:Mock { functionName: "intAdd" }
test:MockFunction intAddMockFn = new();
```

After the initialization, the following options can be used to stub the behaviour of a function written in the
 module being tested.
 
### Stubbing to Return a Specific Value
  
 This test stubs the behavior of the `get` function to return a specific value in 2 ways:
     
 1. Stubbing to return a specific value in general
 2. Stubbing to return a specific value based on the input

```ballerina
import ballerina/test;
   
@test:Config {}
function testReturn() {
    // Stub to return the specified value when the `intAdd` is invoked.
    test:when(intAddMockFn).thenReturn(20);
   
    // Stub to return the specified value when the `intAdd` is invoked with the specified arguments.
    test:when(intAddMockFn).withArguments(0, 0).thenReturn(-1);
        
    test:assertEquals(addValues(10, 6), 20, msg = "function mocking failed");
    test:assertEquals(addValues(0, 0), -1, msg = "function mocking with arguments failed");
}
```

### Stubbing to Invoke Another Function in Place of the Real

This test stubs the behavior of the `intAdd` function to substitute it with a user-defined mock function.

```ballerina
import ballerina/test;
       
@test:Config {}
function testCall() {
    // Stub to call another function when `intAdd` is called.
    test:when(intAddMockFn).call("mockIntAdd");
   
    test:assertEquals(addValues(11, 6), 5, msg = "function mocking failed");
}
    
// The mock function to be used in place of the `intAdd` function
public function mockIntAdd(int a, int b) returns int {
    return (a - b);
}
```

This test stubs the behaviour of an imported function to substitute it with a user-defined mock function.

```ballerina
@test:Mock {
    // This specifies a mock function that should replace the
    // imported function `math:sqrt`.
    moduleName: "ballerina/math",
    functionName: "sqrt"
}
test:MockFunction sqrtMockFn = new();

// This is a mock function, which can be called in place of the `math:sqrt` function.
function mockSqrt(float val) returns float {
    return 125.0;
}

@test:Config {}
function testCall() {
   // This stubs the calls to `math:sqrt` function
   // to invoke the specified function.
   test:when(sqrtMockFn).call("mockSqrt");
   test:assertEquals(math:sqrt(25), 125.0);
}
```

## What's Next?
 
Now, that you are aware of the details on writing tests, learn the different options that can be used when [Executing
 Tests](/learn/testing-ballerina-code/executing-tests).
