---
layout: ballerina-left-nav-pages-swanlake
title: Mocking
description: Learn how to use Ballerina's built-in mocking API provided by the test to test modules
 independent from other modules and external endpoints.
keywords: ballerina, programming language, testing, mocking
permalink: /swan-lake/learn/mocking/
active: mocking
redirect_from:
  - /swan-lake/learn/mocking
  - /swan-lake/learn/mocking/
---

# Mocking

Mocking is useful to control the behavior of functions and objects to control the communication with other modules and external endpoints. A mock can be created by defining return values or replacing the entire object or function with a user-defined equivalent. This feature will help you to test the Ballerina code independently from other modules and external endpoints.


## Mocking Objects

The test module provides capabilities to mock an object for unit testing. This allows you to control the behavior of object member functions and values of member fields via stubbing or replacing the entire object with a user-defined equivalent. This feature will help you to test the Ballerina code independently from other modules and external endpoints.

Mocking of objects can be done in two ways.



1. Creating a test double (providing an equivalent object in place of the real)
2. Stubbing the member function or member variable (specifying the behavior of functions and values of variables)


### Creating a test double

You can write a custom mock object and substitute it in place of the real object. The custom object should be made structurally equivalent to the real object via the mocking features in the test module.

***Example:***

Let's make changes to the example in the [Quick Start](/swan-lake/learn/testing-quick-start) page. In order to test the
 `getRandomJoke` function without actually calling the endpoint, use the `test:mock` function to mock the `get` remote function of the client object.

Change the content of the ***main_test.bal*** file as follows:

```ballerina
// main_test.bal
import ballerina/test;
import ballerina/http;

public type MockHttpClient client object {
    	public remote function get(@untainted string path, public 
        	http:RequestMessage message = ()) returns 
        http:Response|http:ClientError {

        	http:Response res = new;
        	res.statusCode = 500;
        	return res;
    }
};

@test:Config {}
public function testTestDouble() {
  	clientEndpoint=<http:Client>test:mock(http:Client, new MockHttpClient());
  	string|error result = getRandomJoke("Sheldon");
  	test:assertTrue(result is error);
}
```

### Stubbing member functions and variables of an object

Instead of creating a test double, you may also choose to create a default mock object and stub the functions to return a specific value or to do nothing.


#### Stubbing to return a specific value

***Example:***
The example in the [Quick Start](/swan-lake/learn/testing-quick-start) page shows how the `get` function of the client object can be
 stubbed to return a value. Let’s make changes to that example.

**main.bal**
```ballerina
// main.bal

import ballerina/io;
import ballerina/http;
import ballerina/stringutils;

http:Client clientEndpoint = new("https://api.chucknorris.io/jokes/");

// This function performs a `get` request to the Chuck Norris API and
// returns a random joke with the name replaced with the provided name
function getRandomJoke(string name, string category = "food") returns string|error {
	http:Response response = checkpanic clientEndpoint->get("/categories");
	if (response.statusCode == http:STATUS_OK) {
        	json[] categories = <json[]>response.getJsonPayload();
        	if (!isCategoryAvailable(categories, category)) {
            	error err = error("'"+category+"' is not a valid category.");
            	io:println(err.message());
            	return err;
        	}
	} else {
    		return createErrorResponse(response);
	}


	response = checkpanic clientEndpoint->get("/random?category=" + category);
	if (response.statusCode == http:STATUS_OK) {
        	json payload = <json>response.getJsonPayload();
        	json joke = <json>payload.value;
        	string replacedText = stringutils:replace(
        joke.toJsonString(), "Chuck Norris", name);
        	return replacedText;
	} else {
    		return createErrorResponse(response);
	}
}

// This function checks if the provided category is a valid one
function isCategoryAvailable(json[] categories, string category) returns boolean {
	foreach var cat in categories {
        	if (cat.toJsonString() == category) {
            	return true;
        	}
	}
	return false;
}

// Returns an error bases on the http response
function createErrorResponse(http:Response response) returns error {
	error err = error("error occurred while sending GET request");
	io:println(err.message(), ", status code: ", response.statusCode);
	return err;
}
```
**main_test.bal**
```ballerina
// main_test.bal
import ballerina/test;
import ballerina/http;
import ballerina/io;

// stubbing to return a specified value
@test:Config {}
public function testReturn() {
    clientEndpoint = <http:Client>test:mock(http:Client);

    // stubbing to return a value for any calls to `get` function
	test:prepare(clientEndpoint).when("get").thenReturn(getMockResponse());
    // stubbing to return a value based on input
    test:prepare(clientEndpoint).when("get").withArguments("/categories").thenReturn(getCategoriesResponse());
    
    string result = checkpanic getRandomJoke("Sheldon");
    test:assertEquals(result, "When Sheldon wants an egg, he cracks open a chicken.");
}

// stubbing to return different values for each function call
@test:Config {}
public function testReturnSequence() {
	clientEndpoint = <http:Client>test:mock(http:Client);
	test:prepare(clientEndpoint).when("get").thenReturnSequence(getCategoriesResponse(), getMockResponse());

	string result = checkpanic getRandomJoke("Sheldon");
	test:assertEquals(result, "When Sheldon wants an egg, he cracks open a chicken.");

}

// stubbing a member variable value
@test:Config {}
function testMemberVariable() {
    clientEndpoint = <http:Client>test:mock(http:Client);
    test:prepare(clientEndpoint).getMember("url").thenReturn("https://foo.com/");
    test:assertEquals(clientEndpoint.url, "https://foo.com/");
}

// util function for constructing a mock response
function getMockResponse() returns http:Response {
	http:Response mockResponse = new;
	json mockPayload = {
    	"categories":[],
    	"created_at":"2020-01-05 13:42:24.40636",
    	"icon_url":"https://assets.chucknorris.host/img/avatar/chuck-norris.png",
    	"id":"7hM0_eLTSaiXmpHO_29iOg","updated_at":"2020-01-05 13:42:24.40636",
    	"url":"https://api.chucknorris.io/jokes/7hM0_eLTSaiXmpHO_29iOg",
    	"value":"When Chuck Norris wants an egg, he cracks open a chicken."
	};
	mockResponse.setPayload(mockPayload);
	return mockResponse;
}

// util function for constructing a mock response
function getCategoriesResponse() returns http:Response {
	http:Response categoriesRes = new;
	json[] payload = ["animal","food","history","money","movie"];
	categoriesRes.setJsonPayload(payload);
	return categoriesRes;
}
```

#### Stubbing to do nothing

***Example:***

**main.bal**
```ballerina
// main.bal
import ballerina/email;
import ballerina/io;

email:SmtpClient smtpClient = new ("localhost", "admin","admin");

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
**main_test.bal**
```ballerina
// main_test.bal
import ballerina/test;

@test:Config {}
function testSendNotification() {
	smtpClient = <email:SmtpClient>test:mock(email:SmtpClient);
	test:prepare(smtpClient).when("send").doNothing();
	string[] emailIds = ["user1@test.com", "user2@test.com"];

	test:assertEquals(sendNotification(emailIds), ());
}
```

## Mocking Functions

Ballerina test framework provides the capability to mock a function. Using the mocking feature, you can easily mock a function in a module that you are testing or a function of an imported module. This feature will help you to test your Ballerina code independently from other modules and functions.


### Mocking an imported function

The function specified with the **_@test:Mock {} _** annotation will be considered as a mock function that gets triggered every time the original function is called. The original function that will be mocked should be defined using the following annotation value fields.

*   ***moduleName*** : "&lt;moduleName&gt;" - Name of the module in which the function to be mocked resides in. If the
 function is within the same module, this can be left blank or “.” (no module) can be passed. If the function is in a different module but within the same project, just passing the module name will suffice. For functions in completely separate modules, the fully-qualified module name must be passed, which includes the `orgName` and the `version` (i.e., `orgName/module:version`). For native functions, the Ballerina module needs to be specified.
*   ***functionName*** : "&lt;functionName&gt;" - Name of the function to be mocked.

Mocking an imported function will apply the mocked function to every instance of the original function call. It is not limited to the test the file, which is being mocked. 

***Example:***

**main.bal**
```ballerina
// main.bal
import ballerina/io;
import ballerina/math;

public function printMathConsts() {
   io:println("Value of PI : ", math:PI);
}
```
**main_test.bal**
```ballerina
// main.test.bal
import ballerina/test;

(any|error)[] outputs = [];

@test:Mock {
	moduleName: "ballerina/io",
	functionName: "println"
}
function mockIoPrintLn((any|error)... text) {
	outputs.push(text);
}

@test:Config {}
function testMathConsts() {
   printMathConsts();
   test:assertEquals(outputs[0].toString(), "Value of PI :  3.141592653589793");
}
```

#### Mocking a function in the same module

The object specified with the `@test:MockFn{}` annotation will be considered as a mock function that gets triggered
 every time the original function is called. Subsequent to the declaration, the function call should be stubbed using the available function mocking features. Different behaviors can be defined for different test cases if required.

***Example:***

**main.bal**
```ballerina
// main.bal
import ballerina/io;

public function addValues(int a, int b) returns int {
	return intAdd(a, b);
}

public function intAdd(int a, int b) returns int {
	return (a + b);
}
```
**main_test.bal**
```ballerina
// main_test.bal
import ballerina/test;

@test:MockFn { functionName: "intAdd" }
test:MockFunction intAddMockFn = new();

@test:Config {}
function testReturn() {
	test:when(intAddMockFn).thenReturn(20);
	test:when(intAddMockFn).withArguments(0, 0).thenReturn(-1);

	test:assertEquals(intAdd(10, 6), 20, msg = "function mocking failed");
	test:assertEquals(intAdd(0, 0), -1,
    	msg = "function mocking with arguments failed");
}

@test:Config {}
function testCall() {
	test:when(intAddMockFn).call("mockIntAdd");
	test:assertEquals(addValues(11, 6), 5, msg = "function mocking failed");
}

public function mockIntAdd(int a, int b) returns int {
	return (a - b);
}
```

## What's Next
 
Now, that you are aware of the details on writing tests, learn the different options that can be used when [Executing
 Tests](/swan-lake/learn/executing-tests).
