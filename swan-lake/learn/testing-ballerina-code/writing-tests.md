---
layout: ballerina-left-nav-pages-swanlake
title: Writing Tests
description: Learn how to use Ballerina's built-in test framework to write tests. The test framework provides a set of
 annotations and assertions to help write and run tests.
keywords: ballerina, programming language, testing
permalink: /swan-lake/learn/testing-ballerina-code/writing-tests/
active: writing-tests
redirect_from:
  - /swan-lake/learn/testing-ballerina-code/writing-tests
---

# Structuring test code

## Project Structure


```
project-name/
  Ballerina.toml
    src/
      module1/
        main.bal
        Module.md 
        [resources/]   
        tests/       	  # Module-specific tests
          main_test.bal   # The test file for main.bal
          [resources]	  # Resources for the tests
```



## Test source files

Unit tests bound to a module need to be placed in a subfolder called ***tests/*** within the module. In a standard
 Ballerina project, a module is mapped to a test suite. All tests within a module’s *tests/* subfolder are
  considered to be part of the same test suite.

The test source files could have any name. The test functions are just Ballerina functions that use a special
 annotation to mark the function as a test. Test functions must be specified with the `@test:Config {}` annotation and there is no restriction on the test function name.


## Test Resources

The resources subdirectory found within the *tests/* directory is meant to contain any files or resources that are
 exclusively required for testing. You can access the resource files either using the absolute path or using the path relative to the project root.

## Defining a test

The test module provides the necessary annotations to construct a test suite. Therefore, importing the test module is essential in order to write Ballerina tests.


```
import ballerina/test;
```


Once the test module is imported, the following annotation can be used to write a test function.


### @test:Config {}

The function specified following the annotation is a test function. This annotation supports the following value fields.


*   ***enable: {true&#124;false}*** - Enable/disable the test. Default: true
*   ***before: "&lt;function name&gt;"*** - Name of the function to be run just before the test is run. Default: none
*   ***after: "&lt;function name&gt;"*** - Name of the function to be run just after the test is run.
*   ***dependsOn: ["&lt;function names>", …]*** - List of function names on which the test function depends. The
 order in
 which the comma-separated list appears has no prominence. In case there needs to be an order, define a sequence of test functions with one pointing to another based on the dependencies using the `dependsOn` parameter in each one’s config in order to control the order of test execution.
*   ***dataProvider: “&lt;function name>”*** - Specifies the name of the function that will be used to provide the value
 sets to execute the test against.
*   ***groups: [“&lt;test group name”, …]*** - A comma-separated list of test group names (one or more) that this test
 belongs to.

***Example:***


```ballerina
import ballerina/io;
import ballerina/test;

function beforeFunc() {
    // This is the before Test Function
}

function afterFunc() {
    // This is the before Test Function
}

// This test function will not be executed
@test:Config {
enable: false,
}
function testFunction1() {
    io:println("I'm in test function 1!");
    test:assertTrue(true, msg = "Failed!");
}

// This test function depends on `testFunction1`
@test:Config{  
    before: "beforeFunc",
    after: "afterFunc",
    dependsOn: ["testFunction3"],
    dataProvider:"dataGen",
    groups: ["g1"]
}
function testFunction2 (int value) returns error? {
    test:assertEquals(value, 1, msg = "value is not correct");
}


function dataGen() returns (int[][]) {
    return [[1]];
}

// This is a random test function. This will randomly execute without depending on other functions.
// However, note that other functions do depend on this.
@test:Config {
    groups: ["g1", "g2"]
}
function testFunction3() {
    io:println("I'm in test function 3!");
    test:assertTrue(true, msg = "Failed!");
}
```

## Visibility of symbols

The functions, services, and the global variables defined in a module are accessible from within the test files. Hence, you cannot redefine a symbol in the test files if it is already declared in the module. 

On the other hand, symbols defined in the test files will not be visible inside the module source files. When running tests, the symbols in the module source files will be initialized first followed by the ones in the test files.

## Using Assertions

The Ballerina test framework supports the following assertions, which help to verify the expected behaviour of a piece of code. These assertions can be used to decide if the test is passing or failing based on the condition.


### **assertTrue(boolean expression, string message)**

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

### **assertFalse(boolean expression, string message)**

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

### **assertEquals(Any actual, Any expected, string message)**

Asserts that the actual is equal to the expected with an optional message.

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

### **assertNotEquals(Any actual, Any expected, string message)**

Asserts that the actual is not equal to the expected with an optional message.

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

### **assertFail(string message)**

Fails the test. This is useful to fail a test based on a check for a condition while it is in execution.

***Example:***

```ballerina
import ballerina/test;

@test:Config {}
function foo() {
    error? e = trap bar(); // Expecting `bar()` to panic
    if (e is error) {
        test:assertEquals(e.reason(), "Invalid Operation", msg = "Invalid error reason"); // Some other assertions
    } else {
        test:assertFail(msg = "Expected an error");
    }
}
```

## Setup and Teardown

The following test annotations can be used for setup and teardown instructions. These annotations enable executing instructions in different levels.

### @test:BeforeSuite {}

The function specified following the annotation will be run once before any of the tests in the test suite is run. This can be used for initializing the test suite level aspects.

***Example:***

```ballerina
import ballerina/io;
import ballerina/test;

// The `BeforeSuite` function is executed before running all the test functions in this module. 
@test:BeforeSuite
function beforeFunc() {
    io:println("I'm the before suite function!");
}

// Test function
@test:Config {}
function testFunction1() {
    io:println("I'm in test function 1!");
    test:assertTrue(true, msg = "Failed");
}

// Test function
@test:Config {}
function testFunction2() {
    io:println("I'm in test function 2!");
    test:assertTrue(true, msg = "Failed");
}
```

### @test:BeforeEach {}

The function specified following the annotation will be run before every test within the test suite is run. This can be used for repeatedly initializing test-level aspects before every test function.

***Example:***

```ballerina
import ballerina/io;
import ballerina/test;

// Before each function, which is executed before each test function
@test:BeforeEach
function beforeFunc() {
    io:println("I'm the before function!");
}

// Test function
@test:Config {}
function testFunction1() {
    io:println("I'm in test function 1!");
    test:assertTrue(true, msg = "Failed!");
}

// Test function
@test:Config {}
function testFunction2() {
    io:println("I'm in test function 2!");
    test:assertTrue(true, msg = "Failed!");
}

// Test function
@test:Config {}
function testFunction3() {
    io:println("I'm in test function 3!");
    test:assertTrue(true, msg = "Failed!");
}
```

### @test:AfterSuite {}

The function specified following the annotation will be run once after all of the tests in the test suite is run. This can be used for cleaning up the test suite level aspects. The test suite covers tests related to a module.

***Example:***

```ballerina
import ballerina/io;
import ballerina/test;

// Test function
@test:Config {}
function testFunction1() {
    io:println("I'm in test function 1!");
    test:assertTrue(true, msg = "Failed");
}

// The `AfterSuite` function is executed after all the test functions in this module
@test:AfterSuite
function afterFunc() {
    io:println("I'm the after suite function!");
}
```

## Test Configurations

Configurations for testing can be provided using the Config API. For information on using the config library, see
 [Config Module](/swan-lake/learn/api-docs/ballerina/config/index.html).


## What's Next

 As an integration language, you will be using lots of connectors when writing Ballerina code. Setting up mock
 backends for these external endpoints will be a tedious task (e.g., email client, spaceforce client).
 The mocking support in Ballerina will allow you to unit test your code without needing to set up mock backends by
 allowing you to control what the client objects return without actually sending requests to backends.

To learn about the mocking API, see [Mocking](/swan-lake/learn/testing-ballerina-code/mocking).
