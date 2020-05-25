---
layout: ballerina-left-nav-pages
title: How to Test Ballerina Code
description: Learn how to use Ballerina's built-in test framework to write testable code. The test framework provides a set of building blocks to help write and run tests.
keywords: ballerina, programming language, testing
permalink: /learn/how-to-test-ballerina-code/
active: how-to-test-ballerina-code
redirect_from:
  - /learn/how-to-test-ballerina-code
  - /v1-2/learn/how-to-test-ballerina-code
  - /v1-2/learn/how-to-test-ballerina-code/
---

# How to Test Ballerina Code

Ballerina has a built-in test framework named Testerina. Testerina enables developers to write testable code. The test framework provides a set of building blocks to help write tests and a set of tools to help test. 

Developers and testers can cover multiple levels of the test pyramid including unit testing, integration testing and end to end testing with the building blocks the framework provides. It provides the flexibility to programmers and testers to build intelligent tests that suit the domain and application needs.

Testerina design and usage is aligned with project and module semantics of Ballerina. You can test the project modules while you are building the project in a seamless manner using the test constructs. 

## Overview
 
* Ballerina programmers can place their test code in a **tests** folder in a **module**
* Ballerina tests are defined using a set of **annotations**
* Test **assertions** can be used to verify the set of program behaviour expectations 
* Data providers can be used to feed in the test data sets 
* Function mocks can be used to mock a function in a module that you are testing or a function of an imported module

## Writing and Running Tests 

To write tests, you need to import the `test` module in all Ballerina test source files. 

```
import ballerina/test;
```

For structured projects, it is recommended to use a structured test model that is aligned with standard module semantics. Structured test model consists of a separate `tests` directory in a Ballerina module, which allows you to isolate the source from the tests.

In a standard Ballerina project, a module is mapped to a test suite. Unit and integration tests bound to a module need to be placed in a subfolder called `tests/` within the module. All tests within a module’s `tests/` subfolder are considered to be part of the same test suite.

### Project Structure
```
project-name/
- Ballerina.toml
- src/
-- mymodule/
--- Module.md      <- module level documentation
--- main.bal       <- Contains default main method.
--- resources/     <- resources for the module (available at runtime)
--- tests/         <- tests for this module (e.g. unit tests)
---- testmain.bal  <- test file for main
---- resources/    <- resources for these tests
```
The test source files could have any name. The test functions are just Ballerina functions that use a special annotation to mark the function as a test. Test functions must be specified with the `@test:Config { }` annotation and there is no restriction on the test function name.

The `ballerina test` command can be used to execute tests. 

Execute tests within the specified module with the following command.

```
ballerina test <module_name> 
```

Execute tests in the entire project, using the `--all` option.

```
ballerina test --all
```

For more information on the `test` command, run the following.

```
ballerina help test 
```

## Annotations 

Testerina defines the following test annotations. 

#### @test:BeforeSuite {}
The function specified following the annotation will be run once before any of the tests in the test suite is run. This can be used for initializing test suite level aspects. 

```ballerina
@test:BeforeSuite {} 
function testSuiteInitialize() { 
   // module level test initialization logic here 
}
```

Sample : 

```ballerina
import ballerina/io;
import ballerina/test;

// The `BeforeSuite` function is executed before all test functions in this module. 
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
#### @test:BeforeEach {}
The function specified following the annotation will be run before every test within the test suite is run. This can be used for repeatedly initializing test level aspects before every test function. 

```ballerina
@test:BeforeEach {}
function beforeEachTest() { 
   // test initialization logic here to be 
   // executed before each test being run
}
```

Sample :

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

#### @test:Config {}
The function specified following the annotation is a test function. This annotation supports the following parameters.

##### Annotation Value Fields:
`enable: {true | false}`: Enable/disable the test. 
Default: true

`before: "<function name>"`: Name of the function to be run just before the test is run. 
Default: none

`after: "<function name>"`: Name of the function to be run just after the test is run.
 
`dependsOn: ["<function names>", …]`: A list of function names on which the test function depends. These will be run before the test. The list of functions provided has no order of execution. The current test function will depend on the list provided and that list will run in whatever order. Thus, the order in which the comma-separated list appears has no prominence. In case there needs to be an order, define a sequence of test functions with one pointing to another based on dependency using the `dependsOn` parameter in each one's config.

`dataProvider: “<function name>”`: Specifies the name of the function that will be used to provide the value sets to execute the test against. The given Ballerina function should return an array of arrays (e.g., string[][] for a test function that accepts string parameters). Each array of the returned array of arrays should have a length similar to the number of arguments of the function (e.g., function testSuffixC(string input, string expected) could have a dataProvider function that returns a `string[][]` like `[ [“ab”, “abc”], [“de”, “dec”] ]` ). The length of the array of arrays represents the number of time the same test case would run (e.g., in the above example the test function testSuffixC would run 2 times with input parameters “ab”, “abc” and “de”, “dec” respectively).

`groups: [“<test group name”, …]`:
List of test group names (one or more) that this test belongs to. You can group a given test to a list of named test groups using this configuration. 

``` ballerina
@test:Config {
    before: "beforeTestBar", 
    after: "afterTestBar", 
    dependsOn: ["testFunctionPre1", "testFuncctionPre2"],
    groups: ["group1"]
}
function testBar() { 
   // test logic for function bar()
}
```

Sample : 

```ballerina
import ballerina/io;
import ballerina/test;

function beforeFunc() {
    // This is the before Test Function
}

function afterFunc() {
    // This is the before Test Function
}

// This test function depends on `testFunction3`.
@test:Config {
    before: "beforeFunc",
    // You can provide a list of depends on functions here.
    dependsOn: ["testFunction3"],
    groups:["group1"],
    after:"afterFunc"
}
function testFunction1() {
    io:println("I'm in test function 1!");
    test:assertTrue(true, msg = "Failed!");
}

// This is a random test function, this will randomly execute without depending on other functions.
// But note that other function do depend on this.
@test:Config {}
function testFunction3() {
    io:println("I'm in test function 3!");
    test:assertTrue(true, msg = "Failed!");
}
```

#### @test:AfterSuite {}

The function specified following the annotation will be run once after all of the tests in the test suite is run. This can be used for cleaning up test suite level aspects. The test suite covers tests related to a module. 

```ballerina
@test:AfterSuite {}
function testSuiteCleanup() { 
   // module level test cleanup logic here 
}
```

Sample :

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
@test:AfterSuite
function afterFunc() {
    io:println("I'm the after suite function!");
}
```

## Assertions 
Testerina supports the following assertions.

#### assertTrue(boolean expression, string message)
Asserts that the expression is true with an optional message.

```ballerina
import ballerina/test;

@test:Config {}
function testAssertTrue() {
    boolean value = false;
    test:assertTrue(value, msg = "AssertTrue failed");
}
```

#### assertFalse(boolean expression, string message) 

Asserts that the expression is false with an optional message.

```ballerina
import ballerina/test;

@test:Config {}
function testAssertFalse() {
    boolean value = false;
    test:assertFalse(value, msg = "AssertFalse failed");
}
```

#### assertEquals(Any actual, Any expected, string message) 

Asserts that the actual is equal to the expected, with an optional message.

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

#### assertNotEquals(Any actual, Any expected, string message) 

Asserts that the actual is not equal to the expected, with an optional message.

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

#### assertFail(string message)

Fails the test. Useful when we want to fail a test while in execution based on a check for a condition.

``` ballerina
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

## Function Mocks

Ballerina test framework provides the capability to mock a function. Using the mocking feature you can easily mock a function in a module that you are testing or a function of an imported module. This feature will help you to test your Ballerina code independently from other modules and functions

#### @test:Mock {}

The function specified with the `@test:Mock {}` annotation will be considered as a mock function that gets triggered every time the original function is called. The original function that will be mocked should be defined using the annotation parameters.

##### Annotation Value Fields

`moduleName : "<moduleName>"` : Name of the module where the function to be mocked resides in. If the function is within the same module, this can be left blank or "." (No module) can be passed. If the function is in a different module, but within the same project, just passing the module name will suffice. For functions in completely seperate modules, the fully qualified module name must be passed, which includes the `orgName` and the `version`. ie. `orgName/module:version`. For native function, the ballerina module needs to be specified. 

`functionName : "<functionName>"` : Name of the function to be mocked.

Sample :

The following is an example for function mocking.

The following is the function definition in the module that we are trying to mock in the test case

```ballerina

public function intAdd(int a, int b) returns (int) {
    return (a + b);
}

```

The following is the Ballerina test file where the function mocking takes place

```ballerina
import ballerina/io;
import ballerina/test;
import ballerina/math;


// This is the mock function which will replace the real `intAdd` function
@test:Mock {
    // Since the function is defined in the same module, "." can be passed as the current module.
    // This can also be left blank.
    moduleName : ".",
    functionName : "intAdd"
}
// The mock function signature should match the actual function signature.
public function mockIntAdd(int a, int b) returns (int) {
    io:println("I am the mockIntAdd function");
    return (a - b);
}


// This test function calls the local `intAdd()` function but it expects the mocked result
@test:Config {}  
function test_intAdd() {
    int answer = 0;
    answer = intAdd(5, 3);
    test:assertEquals(answer, 2, msg = "function mocking failed");
}

// This test function calls the native `sqrt()` function but it expects the mocked result
@test:Config {}  
function test_sqrt() {
    float answer = 0;
    answer = math:sqrt(5);

    test:assertEquals(answer, 125.0, "mocking did not take place");
}

// This is a mock function which will replace `sqrt()` by `ballerina/math`.
@test:Mock {
    moduleName : "ballerina/math",
    functionName : "sqrt"
}
function mocksqrt(float a) returns (float) {
    io:println("I am the mocksqrt function");
    return a*a*a;
}

```
