---
layout: ballerina-testing-code-left-nav-pages-swanlake
title: Mocking
description: Learn how to use the mocking API of Ballerina test framework to test modules
 independent from other modules, and external endpoints.
keywords: ballerina, programming language, testing, mocking, object mocking
permalink: /learn/test-ballerina-code/mocking/
active: mocking
intro: Mocking is useful to control the behavior of functions and objects to control the communication with other modules and external endpoints. A mock can be created by defining return values or replacing the entire object or function with a user-defined equivalent. This feature will help you to test the Ballerina code independently from other modules and external endpoints.
redirect_from:
  - /learn/testing-ballerina-code/mocking
  - /learn/testing-ballerina-code/mocking/
  - /swan-lake/learn/testing-ballerina-code/mocking/
  - /swan-lake/learn/testing-ballerina-code/mocking
  - /learn/user-guide/testing-ballerina-code/mocking
  - /learn/user-guide/testing-ballerina-code/mocking/
  - /learn/test-ballerina-code/mocking
  - /learn/guides/testing-ballerina-code/mocking/
  - /learn/guides/testing-ballerina-code/mocking
---

## Mock objects

The `Test` module provides capabilities to mock an object for unit testing. This allows you to control the behaviour of 
the object member functions and values of member fields via stubbing or replacing the entire object with a user-defined 
equivalent. This feature will help you to test the Ballerina code independently of other modules and external endpoints.

Mocking objects can be done in two ways :

1. Creating a test double (providing an equivalent object in place of the real object)
2. Stubbing the member function or member variable (specifying the behaviour of the functions and values of the 
variables)


### Create a test double

You can write a custom mock object and substitute it in place of the real object. The custom object should be made 
structurally equivalent to the real object via the mocking features in the test module.

***Example:***

Let's make changes to the example in the [Test a simple function](/learn/test-ballerina-code/test-a-simple-function/) to define a 
test double for the `clientEndpont` object.

>**Note:** Only the `get` function is implemented since it is the only function used in the sample. Attempting to call
 any other member function of the `clientEndpoint` will result in a runtime error. 

***main_test.bal***

```ballerina
import ballerina/test;
import ballerina/http;
 
// An instance of this object can be used as the test double for the `clientEndpoint`.
public client class MockHttpClient {

    remote function get(@untainted string path, map<string|string[]>? headers = (), http:TargetType targetType = http:Response) returns @tainted http:Response| anydata | http:ClientError {

        http:Response response = new;
        response.statusCode = 500;
        return response;
    }
}

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

### Stub member functions and variables of an object

Instead of creating a test double, you may also choose to create a default mock object and stub the functions to return 
a specific value or to do nothing.

***Example:***

The example in [Test a simple function](/learn/test-ballerina-code/test-a-simple-function/) shows how the `get` function of the 
client object can be stubbed to return a value. Let’s make changes to that example to get a random joke from a specific 
category (e.g., food or movies).

***main.bal***

```ballerina
import ballerina/io;
import ballerina/http;
import ballerina/regex;

http:Client clientEndpoint = check new ("https://api.chucknorris.io/jokes/");

// This function performs a `get` request to the Chuck Norris API and returns a random joke 
// or an error if the API invocations fail.
function getRandomJoke(string name, string category = "food") returns @tainted string|error {
    string replacedText = "";
    http:Response response = check clientEndpoint->get("/categories");

    // Check if the provided category is available

    if (response.statusCode == http:STATUS_OK) {
        json[] categories = <json[]>check response.getJsonPayload();

        if (!isCategoryAvailable(categories, category)) {
            error err = error("'" + category + "' is not a valid category.");
            io:println(err.message());
            return err;
        }

    } else {
        return createError(response);
    }

    // Get a random joke from the provided category
    response = check clientEndpoint->get("/random?category=" + category);

    if (response.statusCode == http:STATUS_OK) {
        json payload = check response.getJsonPayload();
        json joke = check payload.value;

        replacedText = regex:replaceAll(joke.toString(), "Chuck Norris", name);
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
        if (cat.toString() == category) {
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

#### Stub to return a specific value

***main_test.bal***
 
This test stubs the behaviour of the `get` function to return a specific value in 2 ways:

1. Stubbing to return a specific value in general
2. Stubbing to return a specific value based on the input

```ballerina
import ballerina/test;
import ballerina/http;

@test:Config {}
public function testGetRandomJoke() {
    // Create a default mock HTTP Client and assign it to the `clientEndpoint` object
    clientEndpoint = test:mock(http:Client);

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

#### Stub with multiple values to return sequentially for each function call

***main_test.bal***

This test stubs the behaviour of the `get` function to return a specified sequence of values for each `get` function 
invocation (i.e., the first call to the `get` function will return the first argument and the second call will return 
the second argument).

```ballerina
import ballerina/test;
import ballerina/http;
    
@test:Config {}
public function testGetRandomJoke() {
    // Create a default mock HTTP Client and assign it to the `clientEndpoint` object.
    clientEndpoint = test:mock(http:Client);

    // Stub to return the corresponding value for each invocation 
    test:prepare(clientEndpoint).when("get")
        .thenReturnSequence(getCategoriesResponse(), getMockResponse());

    // Invoke the function to test
    string result = checkpanic getRandomJoke("Sheldon");

    // Verify the return value against the expected string
    test:assertEquals(result, "When Sheldon wants an egg, he cracks open a chicken.");
}
```

#### Stub a member variable

If a `client` object has a public member variable, it can be stubbed to return a mock value for testing.

***Example:***

***main.bal***

```ballerina
# A record that represents a Product.
#
# + code - Code used to identify the product
# + name - Product Name
# + quantity - Quantity included in the product
public type Product record {|
    readonly int code;
    string name;
    string quantity;
|};

# A table with a list of Products uniquely identified using the code.
public type ProductInventory table<Product> key(code);

// This is a sample data set in the defined inventory.
ProductInventory inventory = table [
            {code: 1,  name: "Milk", quantity: "1l"},
            {code: 2, name: "Bread", quantity: "500g"},
            {code: 3, name: "Apple", quantity: "750g"}
        ];

# This client represents a product.
#
# + productCode - An int code used to identify the product.
public client class ProductClient {
    public int productCode;

    public function init(int productCode) {
        self.productCode = productCode;
    }
}

// The Client represents the product with the code `1` (i.e. "Milk").
ProductClient productClient = new (1);

# Get the name of the product represented by the ProductClient.
#
# + return - The name of the product
public function getProductName() returns string?{
    if (inventory.hasKey(productClient.productCode)){
        Product? product = inventory.get(productClient.productCode);
        if(product is Product){
                return product.name;
        }
    }
 }
```

***main_test.bal***

This test stubs the member variable `productCode` of the `ProductClient` to set a mock product code.

```ballerina
import ballerina/test;

@test:Config {}
function testMemberVariable() {
    int mockProductCode = 2;
    // Create a mockClient which represents product with the code `mockProductCode`
    ProductClient mockClient = test:mock(ProductClient);
    // Stub the member variable `productCode`
    test:prepare(mockClient).getMember("productCode").thenReturn(mockProductCode);
    // Replace `productClient` with the `mockClient`
    productClient = mockClient;
    // Assert for the mocked product name.
    test:assertEquals(getProductName(), "Bread");
}
```

#### Stub to do nothing

If a function has an optional or no return type specified, this function can be mocked to do nothing when writing
 test cases.

***Example:***

***main.bal***

```ballerina
import ballerina/email;

email:SmtpClient smtpClient = check new ("localhost", "admin","admin");

// This function sends out emails to specified email addresses and returns an error if sending failed.
function sendNotification(string[] emailIds) returns error? {
    email:Message msg = {
        'from: "builder@abc.com",
        subject: "Error Alert ...",
        to: emailIds,
        body: ""
    };
    return check smtpClient->sendMessage(msg);
}
```
***main_test.bal***

This test stubs the behaviour of the `send` function to do nothing for testing the `sendNotification` function.

```ballerina
import ballerina/test;
import ballerina/email;

@test:Config {}
function testSendNotification() {
    string[] emailIds = ["user1@test.com", "user2@test.com"];

    // Create a default mock SMTP client and assign it to the `smtpClient` object.
    smtpClient = test:mock(email:SmtpClient);

    // Stub to do nothing when the`send` function is invoked.
    test:prepare(smtpClient).when("sendMessage").doNothing();

    // Invoke the function to test and verify that no error occurred.
    test:assertEquals(sendNotification(emailIds), ());
}
```

## Mock functions

The Ballerina test framework provides the capability to mock a function. You can easily mock a function in a module that
you are testing or a function of an imported module by using the mocking feature. This feature will help you to test 
your Ballerina code independently from other modules and functions.

The object specified with the `@test:Mock{}` annotation will be considered as a mock function, which gets triggered in 
place of the real function.

* ***moduleName : "&lt;moduleName&gt;"*** - (optional) Name of the module in which the function to be mocked resides 
in. If the function is within the same module, this can be left blank or "." (no module) can be passed. If the function 
is in a different module but within the same package, just passing the module name will suffice. For functions in 
completely separate modules, the fully-qualified module name must be passed, which includes the `packageOrg` 
(i.e., `packageOrg/moduleName`). For native functions, the Ballerina module needs to be specified.

* ***functionName : "&lt;functionName&gt;"*** - Name of the function to be mocked.

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

After the initialization, the following options can be used to stub the behaviour of a function written in the module being tested.
 
### Stub to return a specific value
  
 This test stubs the behaviour of the `get` function to return a specific value in 2 ways:
     
 1. Stubbing to return a specific value in general
 2. Stubbing to return a specific value based on the input

```ballerina
import ballerina/test;

@test:Mock { functionName: "intAdd" }
test:MockFunction intAddMockFn = new();
   
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

### Stub to invoke another function in place of the real

This test stubs the behaviour of the `intAdd` function to substitute it with a user-defined mock function.

```ballerina
import ballerina/test;

@test:Mock { functionName: "intAdd" }
test:MockFunction intAddMockFn = new();

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
import ballerina/test;
import ballerina/io;

@test:Mock {
    moduleName: "ballerina/io",
    functionName: "println"
}
test:MockFunction printlnMockFn = new();

int tally = 0;

// This is a function that can be called in place of the `io:println` function.
public function mockPrint(any|error... val) {
    tally = tally + 1;
}

@test:Config {}
function testCall() {
    test:when(printlnMockFn).call("mockPrint");

    io:println("Testing 1");
    io:println("Testing 2");
    io:println("Testing 3");

    test:assertEquals(tally, 3);
}
```

This test calls the original `intAdd` function after it has been stubbed with a user-defined mock function.

```ballerina
import ballerina/test;
       
@test:Mock { functionName: "intAdd" }
test:MockFunction intAddMockFn = new();

@test:Config {}
function testCallOriginal() {
    // Stub to call another function when `intAdd` is called.
    test:when(intAddMockFn).call("mockIntAdd");
   
    test:assertEquals(addValues(11, 6), 5, msg = "function mocking failed");
    
    // Stub to call the original `intAdd` function.
    test:when(intAddMockFn).callOriginal();
    test:assertEquals(addValues(11, 6), 17, msg = "function mocking failed");
}
    
// The mock function to be used in place of the `intAdd` function
public function mockIntAdd(int a, int b) returns int {
    return (a - b);
}
```
