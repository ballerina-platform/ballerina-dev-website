---
layout: ballerina-left-nav-pages-swanlake
title: Writing Tests
description: Learn how to use Ballerina's built-in test framework to write tests. The test framework provides a set of annotations and assertions to help write and run tests.
keywords: ballerina, programming language, testing
permalink: /learn/user-guide/testing-ballerina-code/writing-tests/
active: writing-tests
intro: The sections below include information about writing tests in Ballerina.
redirect_from:
  - /learn/testing-ballerina-code/writing-tests
  - /swan-lake/learn/testing-ballerina-code/writing-tests/
  - /swan-lake/learn/testing-ballerina-code/writing-tests
  - /learn/testing-ballerina-code/writing-tests/
  - /learn/testing-ballerina-code/writing-tests
  - /learn/user-guide/testing-ballerina-code/writing-tests
---

## Project Structure


```bash
package-directory/
    Ballerina.toml
    main.bal
    [resources]
    tests/              # tests for default module
        main_test.bal   # The test file for main.bal
        [resources]     # Resources for the tests

```



## Test Source Files

Unit tests bound to a module need to be placed in a sub folder called `tests/` within the module. In a standard
 Ballerina package, a module is mapped to a test suite. All tests within a module’s `tests/` subfolder are considered to be part of the same test suite.

The test source files could have any name. The test functions are just Ballerina functions, which use a special annotation to mark the function as a test. Test functions must be specified with the `@test:Config {}` annotation and there is no restriction on the test function name.


## Test Resources

The resources sub directory found within the *tests/* directory is meant to contain any files or resources that are exclusively required for testing. You can access the resource files either using the absolute path or using the path relative to the package root.

## Defining a Test

The test module provides the necessary annotations to construct a test suite. Therefore, importing the test module is essential in order to write Ballerina tests.


```
import ballerina/test;
```


Once the test module is imported, the following annotation can be used to write a test function.


### '@test:Config {}'

The function specified after the annotation is a test function. This annotation supports the following value fields.


*   ***enable: {true&#124;false}*** - Enable/disable the test. Default: true
*   ***before: &lt;function name&gt;*** - The function to be run just before the test is run. Default: none
*   ***after: &lt;function name&gt;*** - The function to be run just after the test is run. Default: none
*   ***dependsOn: [&lt;function names>, …]*** - List of functions on which the test function depends. The order in which the comma-separated list appears has no prominence. In case there needs to be an order, the `dependsOn` parameter can be used to create an ordered sequence of functions with one function depending on the other.
*   ***dataProvider: &lt;function name>*** - Specifies the function that will be used to provide the data sets for the test.
*   ***groups: [“&lt;test group name”, …]*** - A comma-separated list of test group names (one or more) to which this test
 belongs.

***Example:***


```ballerina
import ballerina/io;
import ballerina/test;

function beforeFunc() {
    // This is the function, which will be executed before the Test functions.
}

function afterFunc() {
    // This is the function, which will be executed after the Test functions.
}

// This test function will not be executed.
@test:Config {
enable: false
}
function testFunction1() {
    io:println("I'm in test function 1!");
    test:assertTrue(true, msg = "Failed!");
}

// This test function depends on the `testFunction3`.
@test:Config{  
    before: beforeFunc,
    after: afterFunc,
    dependsOn: [testFunction3],
    dataProvider: dataGen,
    groups: ["g1"]
}
function testFunction2 (int value) returns error? {
    test:assertEquals(value, 1, msg = "value is not correct");
}


function dataGen() returns (int[][]) {
    return [[1]];
}

// This is a random test function. This will randomly execute without depending on the other functions.
// However, note that the `testFunction2` function depends on this.
@test:Config {
    groups: ["g1", "g2"]
}
function testFunction3() {
    io:println("I'm in test function 3!");
    test:assertTrue(true, msg = "Failed!");
}
```

## Visibility of Symbols

The functions, services, and the global variables defined in a module are accessible from within the test files. Hence, you cannot redefine a symbol in the test files if it is already declared in the module. 

On the other hand, symbols defined in the test files will not be visible inside the module source files. When running tests, the symbols in the module source files will be initialized first followed by the ones in the test files.

## Using Assertions

The Ballerina test framework supports the following assertions, which help to verify the expected behavior of a piece of code. These assertions can be used to decide if the test is passing or failing based on the condition.


### assertTrue(boolean expression, string message)

Asserts that the expression is true with an optional message.

***Example:***
```ballerina
import ballerina/test;

@test:Config {}
function testAssertTrue() {
    boolean value = false;
    test:assertTrue(value, msg = "AssertTrue failed");
}
```

### assertFalse(boolean expression, string message)

Asserts that the expression is false with an optional message.

***Example:***
```ballerina
import ballerina/test;

@test:Config {}
function testAssertFalse() {
    boolean value = false;
    test:assertFalse(value, msg = "AssertFalse failed");
}
```

### assertEquals(anydata|error actual, anydata expected, string message)

Asserts that the actual value is equal to the expected value with an optional message.

***Example:***
```ballerina
import ballerina/test;

@test:Config {}
function testAssertIntEquals() {

    int answer = 0;
    int a = 5;
    int b = 3;
    answer = intAdd(a, b);
    test:assertEquals(answer, 8, msg = "IntAdd function failed");
}

function intAdd(int a, int b) returns (int) {
    return (a + b);
}
```

### assertNotEquals(anydata actual, anydata expected, string message)

Asserts that the actual value is not equal to the expected value with an optional message.

***Example:***

```ballerina
import ballerina/test;

@test:Config {}
function testAssertIntEquals() {

    int answer = 0;
    int a = 5;
    int b = 3;
    answer = intAdd(a, b);
    test:assertNotEquals(answer, 8, msg = "Matches");
}

function intAdd(int a, int b) returns (int) {
    return (a + b);
}
```

### assertExactEquals(any|error actual, any|error expected, string message)

Asserts that the actual entity is exactly equal to the expected entity with an optional message.

***Example:***
```ballerina
import ballerina/test;

class Person {
    public string name = "";
    public int age = 0;
    public Person? parent = ();
    private string email = "default@abc.com";
    string address = "No 20, Palm grove";
}

@test:Config {}
function testAssertExactEqualsObject() {
    Person p1 = new;
    Person p2 = p1;
    test:assertExactEquals(p1, p2, msg = "Objects are not exactly equal");
}
```

### assertNotExactEquals(any|error actual, any|error expected, string message)

Asserts that the actual entity is not exactly equal to the expected entity with an optional message.

***Example:***

```ballerina
import ballerina/test;

class Person {
    public string name = "";
    public int age = 0;
    public Person? parent = ();
    private string email = "default@abc.com";
    string address = "No 20, Palm grove";
}

@test:Config {}
function testAssertNotExactEqualsObject() {
    Person p1 = new;
    Person p2 = new ();
    test:assertNotExactEquals(p1, p2, msg = "Objects are exactly equal");
}
```

### assertFail(string message)

Fails the test. This is useful to fail a test based on a check for a condition while it is in execution.

***Example:***

```ballerina
import ballerina/test;

@test:Config {}
function foo() {
    error? e = trap bar(); // Expecting `bar()` to panic
    if (e is error) {
        test:assertEquals(e.message().toString(), "Invalid Operation", msg = "Invalid error reason"); // Some other assertions
    } else {
        test:assertFail(msg = "Expected an error");
    }
}

function bar() {
    panic error("Invalid Operation");
}
```

### Difference between expected and actual values when using 'assertEquals'


#### Values with different types

The `diff` shows the expected and actual values preceded by the type within the angle brackets.

***Example:***

```ballerina
import ballerina/test;

@test:Config {}
function testAssertStringAndInt() {
    test:assertEquals(1, "1");
}
```

***Output:***

```bash
[fail] testAssertStringAndInt:

    Assertion Failed!

        expected: <string> '1'
        actual  : <int> '1'
```

##### Values of the `string` type

The `diff` is displayed in the GNU format using `+` and `-` to show the
 line differences.

***Example:***

```ballerina
import ballerina/test;

@test:Config {}
function testAssertString() {
    test:assertEquals("hello Ballerina user\nWelcome to Ballerina", "hello user\nWelcome to Ballerina");
}
```

***Output:***

```bash
[fail] testAssertString:
    Assertion Failed!

        expected: 'hello user
        Welcome to Ballerina'
        actual  : 'hello Ballerina user
        Welcome to Ballerina'

         Diff    :

         --- expected
         +++ actual

         @@ -1,2 +1,2 @@

         -hello user
         +hello Ballerina user
         Welcome to Ballerina

```

#### Values of the `JSON/record/map` type

The `diff` lists the JSON key mismatch using the `expected keys` and `actual keys`.
The JSON value mismatch is listed per key showing the `expected` and `actual` values.

***Example:***

```ballerina
import ballerina/test;

@test:Config {}
function testAssertJson() {
    json j1 = {
        name: "Anne",
        age: "21",
        marks: {
            maths: 99,
            english: 90,
            status: {pass: true}
        }
    };
    json j2 = {
        name2: "Amie",
        age: 21,
        marks: {
            maths: 35,
            english: 90,
            status: {pass: false}
        }
    };
    test:assertEquals(j1, j2);
}
```

***Output:***

```bash
[fail] testAssertJson:
    Assertion Failed!

      expected: '{"name2":"Amie","age":21,"marks":{"maths":35,"english":90,"status":{"pass":false...'
      actual  : '{"name":"Anne","age":"21","marks":{"maths":99,"english":90,"status":{"pass":true...'

      Diff    :

        expected keys   : name2
        actual keys     : name

        key: age
        expected value  : <int> 21
        actual value    : <string> 21

        key: marks.maths
        expected value  : 35
        actual value    : 99

        key: marks.status.pass
        expected value  : false
        actual value    : true

```

#### Values of other `anydata` type

The `diff` is displayed showing the `expected` and `actual` values.

***Example:***

```ballerina
import ballerina/test;

@test:Config {}
function testAssertTuples() {
    [int, string] a = [10, "John"];
    [int, string] b = [12, "John"];
    test:assertEquals(a, b);
}
```

***Output:***

```bash
[fail] testAssertTuples:
    Assertion Failed!

        expected: '12 John'
        actual  : '10 John'
```


## Setup and Teardown

The following test annotations can be used to set up and tear down the instructions. These annotations enable executing the 
instructions at different levels.

### @test:BeforeSuite {}

The function annotated with the `BeforeSuite` annotation will be run once before any of the tests in the test suite.
This can be used for initializing the test suite level pre-requisites.

***Example:***

```ballerina
import ballerina/io;
import ballerina/test;

// The `BeforeSuite` function is executed before running all the test functions in this module. 
@test:BeforeSuite
function beforeFunc() {
    io:println("I'm the before suite function!");
}

// Test function.
@test:Config {}
function testFunction1() {
    io:println("I'm in test function 1!");
    test:assertTrue(true, msg = "Failed");
}

// Test function.
@test:Config {}
function testFunction2() {
    io:println("I'm in test function 2!");
    test:assertTrue(true, msg = "Failed");
}
```

### @test:BeforeGroups {}

For each group specified in this annotation, the `BeforeGroups` annotated function will be executed once before
 any of the tests belonging to the group.

***Example:***

```ballerina
import ballerina/io;
import ballerina/test;

// The `beforeGroups1` function is executed before running all the test functions belonging to the `g1` group.
@test:BeforeGroups { value:["g1"] }
function beforeGroups1() {
    io:println("I'm the before groups function!");
}

// Another `beforeGroups2` function is executed before running all the test functions belonging to the `g1` and `g2` groups. 
@test:BeforeGroups { value:["g1", "g2"] }
function beforeGroups2() {
    io:println("I'm another before groups function!");
}

// A test function that belongs to the `g1` group.
@test:Config { groups:["g1"] }
function testFunction1() {
    io:println("I belong to group g1!");
    test:assertTrue(true, msg = "Failed");
}

// A test function that belongs to the `g2` group.
@test:Config { groups:["g2"] }
function testFunction2() {
    io:println("I belong to group g2 ");
    test:assertTrue(true, msg = "Failed");
}
```

### @test:BeforeEach

The `BeforeEach` annotated function will be run before each test in the test suite. This can be used to initialize
 the test-level prerequisites repeatedly before every test function.

***Example:***

```ballerina
import ballerina/io;
import ballerina/test;

// The `BeforeEach` function, which is executed before each test function
@test:BeforeEach
function beforeFunc() {
    io:println("I'm the before function!");
}

// The first test function.
@test:Config {}
function testFunction1() {
    io:println("I'm in test function 1!");
    test:assertTrue(true, msg = "Failed!");
}

// The second test function.
@test:Config {}
function testFunction2() {
    io:println("I'm in test function 2!");
    test:assertTrue(true, msg = "Failed!");
}

// The third test function.
@test:Config {}
function testFunction3() {
    io:println("I'm in test function 3!");
    test:assertTrue(true, msg = "Failed!");
}
```

### @test:AfterEach

The `AfterEach` annotated function will be run after each test within the test suite.
This can be used to clean up the test-level aspects repeatedly after every test function.

***Example:***

```ballerina
import ballerina/io;
import ballerina/test;

// This `AfterEach` function is executed before each test function.
@test:AfterEach
function afterFunc() {
    io:println("I'm the after function!");
}

// The first test function.
@test:Config {}
function testFunction1() {
    io:println("I'm in test function 1!");
    test:assertTrue(true, msg = "Failed!");
}

// The second test function.
@test:Config {}
function testFunction2() {
    io:println("I'm in test function 2!");
    test:assertTrue(true, msg = "Failed!");
}

// The third test function.
@test:Config {}
function testFunction3() {
    io:println("I'm in test function 3!");
    test:assertTrue(true, msg = "Failed!");
}
```

## @test:AfterGroups {}

***Example:***

For each group specified in this annotation, the `AfterGroups` annotated function will be executed once after all the
 tests belonging to the group is executed.

```ballerina
import ballerina/io;
import ballerina/test;

// A test function that belongs to the `g1` group.
@test:Config { groups:["g1"] }
function testFunction1() {
    io:println("I belong to group g1!");
    test:assertTrue(true, msg = "Failed");
}

// A test function that belongs to the `g2` group.
@test:Config { groups:["g2"] }
function testFunction2() {
    io:println("I belong to group g2 ");
    test:assertTrue(true, msg = "Failed");
}

// The `afterGroupsFunc1` function is executed before running all the test functions belonging to the `g1` group.
@test:AfterGroups { value:["g1"] }
function afterGroupsFunc1() {
    io:println("I'm the after groups function!");
}

// The `afterGroupsFunc2` function is executed before running all the test functions belonging to the `g1` and `g2` groups. 
@test:AfterGroups { value:["g1", "g2"] }
function afterGroupsFunc2() {
    io:println("I'm another after groups function!");
}
```

### @test:AfterSuite {}

The `AfterSuite` annotated function will be run once after all the tests in the test suite are run. 
This can be used for cleaning up the test suite level aspects. A test suite covers tests related to a module.

***Example:***

```ballerina
import ballerina/io;
import ballerina/test;

// Test function.
@test:Config {}
function testFunction1() {
    io:println("I'm in test function 1!");
    test:assertTrue(true, msg = "Failed");
}

// The `AfterSuite` function is executed after all the test functions in this module.
@test:AfterSuite  {}
function afterFunc() {
    io:println("I'm the after suite function!");
}
```

## Test Configurations

Configurations for testing can be provided using configurable variables. The values for configurable
variables can be provided in a file named `Config.toml` located in the tests directory.

For information on using configurable variables, see
 [Configurable Variables](/learn/user-guide/configurability/defining-configurable-variables/).

## Test Dependencies

Dependencies meant to be resolved only during testing and can be specified in the `Ballerina.toml` file
by specifiying the scope

```toml
[[platform.java11.dependency]]
path = "/user/foo/libs/abc.jar"
scope = "testOnly"
```

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

## What's Next?

 As an integration language, you will be using lots of connectors when writing Ballerina code. Setting up mock backends
  for these external endpoints will be a tedious task (e.g., email client and SalesForce client). The mocking support in
   Ballerina will allow you to unit test your code without needing to set up mock backends by allowing you to control
    what the client objects return without actually sending requests to backends.

To learn about the mocking API, see [Mocking](/learn/testing-ballerina-code/mocking).
