---
layout: ballerina-testing-code-left-nav-pages-swanlake
title: Mocking
description: Learn how to use the mocking API of Ballerina test framework to test modules
 independent from other modules, and external endpoints.
keywords: ballerina, programming language, testing, mocking, object mocking
permalink: /learn/test-ballerina-code/mocking/
active: mocking
intro: Mocking is useful to control the behavior of functions and objects to control the communication with other modules and external endpoints. A mock can be created by defining return values or replacing the entire object or function with a user-defined equivalent. This feature will help you to test the Ballerina code independently from other modules and external endpoints.
---

## Mock objects

The [ballerina/test](https://central.ballerina.io/ballerina/test/latest) module provides capabilities to mock an object for unit testing. This allows you to control the behavior of the methods of an object and values of member fields via stubbing or replacing the entire object with a user-defined equivalent. This feature will help you to test the Ballerina code independently of other modules and external endpoints.

Mocking objects can be done in two ways :

1. Creating a test double (providing an equivalent object in place of the real object)
2. Stubbing the methods, resources and fields of the object (specifying the behavior of the methods, resources and values of the object fields)


### Create a test double

You can write a custom mock object and substitute it in place of the real object. The custom object should be made structurally equivalent to the real object via the mocking features in the test module.

***Example:***

Consider the following example in which an `http:Client` interacts with an external endpoint to get a random joke.

***main.bal***

```ballerina
import ballerina/http;

http:Client clientEndpoint = check new ("https://api.chucknorris.io/jokes/");

type Joke readonly & record {
    string value;
};

// This function performs a `get` request to the Chuck Norris API and returns a random joke 
// with the name replaced by the provided name or an error if the API invocation fails.
function getRandomJoke(string name) returns string|error {
    Joke joke = check clientEndpoint->get("/random");
    string replacedText = re `Chuck Norris`.replaceAll(joke.value, name);
    return replacedText;
}
```

Let's write tests for the above `main.bal` file to define a test double for the `clientEndpoint` object.

>**Note:** Only the `get` method is implemented since it is the only method used in the sample. Attempting to call any other methods of the `clientEndpoint` will result in a runtime error. 

***main_test.bal***

```ballerina
import ballerina/test;
import ballerina/http;

// An instance of this object can be used as the test double for the `clientEndpoint`.
public client class MockHttpClient {

    remote function get(string path, map<string|string[]>? headers = (), http:TargetType targetType = http:Response) returns http:Response|anydata|http:ClientError {
        Joke joke = {"value": "Mock When Chuck Norris wants an egg, he cracks open a chicken."};
        return joke;
    }

}

@test:Config
public function testGetRandomJoke() {

    // create and assign a test double to the `clientEndpoint` object
    clientEndpoint = test:mock(http:Client, new MockHttpClient());

    // invoke the function to test
    string|error result = getRandomJoke("Sheldon");

    // verify that the function returns the mock value after replacing the name
    test:assertEquals(result, "Mock When Sheldon wants an egg, he cracks open a chicken.");
}
```

### Stub methods

Instead of creating a test double, you may also choose to create a mock object and stub the methods to return a specific value or to do nothing.

This approach applies to all the methods other than resources.

>**Note:** It is important to ensure that all the methods (of the object) being tested are properly stubbed. 
> If a method that has not been stubbed is called in the implementation, the test framework will generate an  
> error message in the following format: 
> `no cases registered for member function '<member_function_name>' of object type '<object_type>'.`

***Example:***

Let’s make changes to the above example to get a random joke from a specific category (e.g., food or movies).

***main.bal***

```ballerina
import ballerina/http;
import ballerina/lang.array;
import ballerina/io;

http:Client clientEndpoint = check new ("https://api.chucknorris.io/jokes/");

type Joke readonly & record {
    string value;
};

// This function performs a `get` request to the Chuck Norris API and returns a random joke 
// or an error if the API invocations fail.
function getRandomJoke(string name, string category = "food") returns string|error {
    string[] categories = check clientEndpoint->get("/categories");

    if !isCategoryAvailable(categories, category) {
        string errorMsg = "'" + category + "' is not a valid category. ";
        io:println(errorMsg);
        return error(errorMsg);
    }

    // Get a random joke from the provided category
    Joke joke = check clientEndpoint->get("/random?category=" + category);
    return re `Chuck Norris`.replaceAll(joke.value, name);
}

function isCategoryAvailable(string[] categories, string category) returns boolean => array:some(categories, categoryVal => categoryVal == category);
```

***test_utils.bal***

The util functions below are used to construct mock responses required for testing.
  
  ```ballerina
// Returns a mock Joke to be used for the random joke API invocation.
function getMockResponse() returns Joke {
    Joke joke = {"value": "When Chuck Norris wants an egg, he cracks open a chicken."};
    return joke;
}

// Returns a mock response to be used for the category API invocation.
function getCategoriesResponse() returns string[] {
    return ["animal", "food", "history", "money", "movie"];
}
```

#### Stub to return a specific value

***main_test.bal***

This test stubs the behavior of the `get` method to return a specific value in 2 ways:

1. Stubbing to return a specific value in general
2. Stubbing to return a specific value based on the input

```ballerina
import ballerina/test;
import ballerina/http;

@test:Config
public function testGetRandomJoke() {
    // Create a default mock HTTP Client and assign it to the `clientEndpoint` object
    clientEndpoint = test:mock(http:Client);

    // Stub to return the specified mock response when the `get` function is called.
    test:prepare(clientEndpoint).when("get").thenReturn(getMockResponse());

    // Stub to return the specified mock response when the specified argument is passed.
    test:prepare(clientEndpoint).when("get").withArguments("/categories")
        .thenReturn(getCategoriesResponse());

    // Invoke the function to test.
    string|error result = getRandomJoke("Sheldon");

    // Verify the return value against the expected string.
    test:assertEquals(result, "When Sheldon wants an egg, he cracks open a chicken.");
}
```

#### Stub with multiple values to return sequentially for each function call

***main_test.bal***

This test stubs the behavior of the `get` method to return a specified sequence of values for each invocation (i.e., the first call to the `get` method will return the first argument and the second call will return the second argument).

>**Note:** The `withArguments` method is not supported with `thenReturnSequence`.

```ballerina
import ballerina/test;
import ballerina/http;
    
@test:Config
public function testGetRandomJoke() {
    // Create a default mock HTTP Client and assign it to the `clientEndpoint` object.
    clientEndpoint = test:mock(http:Client);

    // Stub to return the corresponding value for each invocation 
    test:prepare(clientEndpoint).when("get")
        .thenReturnSequence(getCategoriesResponse(), getMockResponse());

    // Invoke the function to test
    string|error result = getRandomJoke("Sheldon");

    // Verify the return value against the expected string
    test:assertEquals(result, "When Sheldon wants an egg, he cracks open a chicken.");
}
```

#### Stub to do nothing

If a method has no return type or has an optional type as the return type, the method can be mocked to do nothing when writing test cases.

***Example:***

***main.bal***

```ballerina
import ballerina/email;

email:SmtpClient smtpClient = check new ("localhost", "admin","admin");

// This function sends out emails to specified email addresses and returns an error if sending fails.
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

This test stubs the behavior of the `sendMessage` method to do nothing for testing the `sendNotification` function.

```ballerina
import ballerina/test;
import ballerina/email;

@test:Config
function testSendNotification() {
    string[] emailIds = ["user1@test.com", "user2@test.com"];

    // Create a default mock SMTP client and assign it to the `smtpClient` object.
    smtpClient = test:mock(email:SmtpClient);

    // Stub to do nothing when the`sendMessage` method is invoked.
    test:prepare(smtpClient).when("sendMessage").doNothing();

    // Invoke the function to test and verify that no error occurred.
    test:assertEquals(sendNotification(emailIds), ());
}
```

### Stub resources

Similar to remote methods, resources also can be stubbed to return a specific value, a series of values, or to do nothing. To mock a resource, the resource name (e.g., `get`, `post`, `put`) and resource path must be specified. Each path parameter in the resource path must be indicated with a colon (`:`) prefix and rest parameters should be indicated with a double colon (`::`) prefix.

***Example:***

Let's consider the following client example.

***main.bal***

```ballerina
public type Employee record {|
    readonly string id;
    string firstName;
    string lastName;
    string gender;
|};

EmpClient empClient = new ();

public client class EmpClient {
    map<Employee> employees = {};

    resource function get employee/[string id]() returns Employee? {
        return self.employees[id];
    }

    resource function get employee/welcome/[string id](string firstName, string lastName) returns string {
        return "Welcome " + firstName + " " + lastName + ". your ID is " + id;
    }
}
```

#### Stub to return a specific value with a resource

***main_test.bal***
 
This test stubs the behavior of the below resource to return a specific value in 4 ways:

```ballerina
    resource function get employee/welcome/[string id](string firstName, string lastName) returns string {
        return "Welcome " + firstName + " " + lastName + ". your ID is " + id;
    }
```

1. Stubbing to return a specific value in general
2. Stubbing to return a specific value based on the path parameter
3. Stubbing to return a specific value based on the method arguments
4. Stubbing to return a specific value based on the path parameter and the method arguments

Here, Precedence is given to more specific stubbing over more general stubbing when a call is made to the resource with a particular set of path parameters, arguments, or both.

```ballerina
@test:Config
function testWelcomeEmployee() {
    empClient = test:mock(EmpClient);
    // Stubbing to return a specific value in general
    test:prepare(empClient)
        .whenResource("employee/welcome/:id")
        .onMethod("get")
        .thenReturn("Welcome..general stubbing");

    // Stubbing to return a specific value on specific path parameter
    test:prepare(empClient)
        .whenResource("employee/welcome/:id")
        .onMethod("get").withPathParameters({id: "emp014"})
        .thenReturn("Welcome...path given stub");

    // Stubbing to return a specific value on specific method arguments
    test:prepare(empClient)
        .whenResource("employee/welcome/:id")
        .onMethod("get").withArguments("vijay", "kumar")
        .thenReturn("Welcome...arg given stub");

    // Stubbing to return a specific value on specific path parameter and method arguments
    test:prepare(empClient)
        .whenResource("employee/welcome/:id")
        .onMethod("get")
        .withPathParameters({id: "emp014"})
        .withArguments("vijay", "kumar").thenReturn("Welcome...more specific stub");

    // As the arguments and the path match with the above stub specifically, 
    // "Welcome...more specific stub" is returned from the stub
    string result = empClient->/employee/welcome/["emp014"].get(firstName = "vijay", lastName = "kumar"); 
    test:assertEquals(result, "Welcome...more specific stub"); 

    result = empClient->/employee/welcome/["emp001"].get(firstName = "vijay", lastName = "kumar");
    test:assertEquals(result, "Welcome...arg given stub");

    result = empClient->/employee/welcome/["emp014"].get(firstName = "John", lastName = "Kibert");
    test:assertEquals(result, "Welcome...path given stub");

    result = empClient->/employee/welcome/["emp001"].get(firstName = "John", lastName = "Kibert");
    test:assertEquals(result, "Welcome..general stubbing");
}
```

#### Stub with multiple values to return sequentially for each invocation of the resource

***main_test.bal***

Similar to other object methods, resources also can be stubbed to return a value from a sequence of values during method invocation.

>**Note:** The `withArguments` and `withPathParameters` methods are not supported with `thenReturnSequence`.

```ballerina
@test:Config
function testGetAllEmployeeById() {
    // Create a mock client
    empClient = test:mock(EmpClient);
    Employee emp1 = {id: "emp001", firstName: "John", lastName: "Doe", gender: "male"};
    Employee emp2 = {id: "emp002", firstName: "John", lastName: "Kennedy", gender: "male"};
    Employee emp3 = {id: "emp003", firstName: "John", lastName: "Kill", gender: "male"};

    // Stub to return the corresponding value for each invocation 
    test:prepare(empClient).whenResource("employee/:id").onMethod("get").thenReturnSequence(emp1, emp2, emp3);

    // Invoke function calls 
    Employee? result = empClient->/employee/["emp001"].get();
    test:assertEquals(result, emp1);
    Employee? result1 = empClient->/employee/["emp002"].get();
    test:assertEquals(result1, emp2);
    Employee? result2 = empClient->/employee/["emp002"].get();
    test:assertEquals(result2, emp3);
}
```

#### Stub to do nothing with a resource

***main_test.bal***

If a resource has no return type or has an optional type as the return type, the method can be mocked to do nothing when writing test cases.

```ballerina
@test:Config
function testGetAllEmployee() {
    empClient = test:mock(EmpClient);
    test:prepare(empClient).whenResource("employee/:id").doNothing();
    Employee? result = empClient->/employee/["emp001"].get();
    test:assertEquals(result, ());
}
```

### Stub a member variable

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
    {code: 1, name: "Milk", quantity: "1l"},
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
public function getProductName() returns string? {
    if !inventory.hasKey(productClient.productCode) {
        return;
    }
    Product? product = inventory.get(productClient.productCode);
    return product is Product ? product.name : ();
}
```

***main_test.bal***

This test stubs the member variable `productCode` of the `ProductClient` to set a mock product code.

```ballerina
import ballerina/test;

@test:Config
function testMemberVariable() {
    int mockProductCode = 2;
    // Create a mockClient which represents product with the code `mockProductCode`
    productClient = test:mock(ProductClient);
    // Stub the member variable `productCode`
    test:prepare(productClient).getMember("productCode").thenReturn(mockProductCode);
    // Assert for the mocked product name.
    test:assertEquals(getProductName(), "Bread");
}
```

## Mock functions

The Ballerina test framework provides the capability to mock a function. You can easily mock a function in a module that
you are testing or a function of an imported module by using the mocking feature. This feature will help you to test 
your Ballerina code independently from other modules and functions.

The object specified with the `@test:Mock` annotation will be considered as a mock function, which gets triggered in 
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

@test:Mock {functionName: "intAdd"}
test:MockFunction intAddMockFn = new ();
```

After the initialization, the following options can be used to stub the behavior of a function written in the module being tested.
 
### Stub to return a specific value
  
 This test stubs the behavior of the `get` function to return a specific value in 2 ways:
     
 1. Stubbing to return a specific value in general
 2. Stubbing to return a specific value based on the input

```ballerina
import ballerina/test;

@test:Mock {functionName: "intAdd"}
test:MockFunction intAddMockFn = new ();
   
@test:Config
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

This test stubs the behavior of the `intAdd` function to substitute it with a user-defined mock function.

```ballerina
import ballerina/test;

@test:Mock {functionName: "intAdd"}
test:MockFunction intAddMockFn = new ();

@test:Config
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

This test stubs the behavior of an imported function to substitute it with a user-defined mock function.

```ballerina
import ballerina/test;
import ballerina/io;

@test:Mock {
    moduleName: "ballerina/io",
    functionName: "println"
}
test:MockFunction printlnMockFn = new ();

int tally = 0;

// This is a function that can be called in place of the `io:println` function.
public function mockPrint(any|error... val) {
    tally = tally + 1;
}

@test:Config
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
       
@test:Mock {functionName: "intAdd"}
test:MockFunction intAddMockFn = new ();

@test:Config
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
