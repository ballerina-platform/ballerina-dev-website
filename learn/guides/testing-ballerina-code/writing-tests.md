---
layout: ballerina-testing-code-left-nav-pages-swanlake
title: Writing Tests
description: Learn how to use Ballerina's built-in test framework to write tests. The test framework provides a set of annotations and assertions to help write and run tests.
keywords: ballerina, programming language, testing
permalink: /learn/testing-ballerina-code/writing-tests/
active: writing-tests
intro: The sections below include information about writing tests in Ballerina.
redirect_from:
  - /learn/testing-ballerina-code/writing-tests
  - /swan-lake/learn/testing-ballerina-code/writing-tests/
  - /swan-lake/learn/testing-ballerina-code/writing-tests
  - /learn/testing-ballerina-code/writing-tests/
  - /learn/testing-ballerina-code/writing-tests
  - /learn/user-guide/testing-ballerina-code/writing-tests
  - /learn/user-guide/testing-ballerina-code/writing-tests/
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

// This test function depends on the `testFunction3` and is executed with an 
// array based data set.
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

// This is a random test function. This will randomly execute without depending  on
// the other functions. However, note that the `testFunction2` function depends on this.

@test:Config {
    groups: ["g1", "g2"]
}
function testFunction3() {
    io:println("I'm in test function 3!");
    test:assertTrue(true, msg = "Failed!");
}

// This test is executed with a map based data set.
@test:Config {
    dataProvider: mapDataProvider
}
function mapDataProviderTest(int value1, int value2, string fruit) returns error? {
    io:println("Input : [" + value1.toBalString() + "," + value2.toBalString() + "," + fruit + "]");
    test:assertEquals(value1, value2, msg = "The provided values are not equal");
    test:assertEquals(fruit.length(), 6);
}

// The data provider function, which returns a  data set as a map of tuples.
function mapDataProvider() returns map<[int, int, string]>|error {
    map<[int, int, string]> dataSet = {
        "banana": [10, 10, "banana"],
        "cherry": [5, 5, "cherry"]
    };
    return dataSet;
}
```

## Visibility of Symbols

The functions, services, and the global variables defined in a module are accessible from within the test files. Hence, you cannot redefine a symbol in the test files if it is already declared in the module. 

On the other hand, symbols defined in the test files will not be visible inside the module source files. When running tests, the symbols in the module source files will be initialized first followed by the ones in the test files.

## Using Assertions

The Ballerina test framework supports the following assertions, which help to verify the expected behavior of a piece of code. These assertions can be used to decide if the test is passing or failing based on the condition.

<table class="table cCodeTable" >
    <tr>
       <th class="cDescription">Assertion Function</th>
       <th class="cCodeCol">Description</th>
    </tr>
    <tr>
       <td>assertTrue(boolean expression, string message)</td>
       <td>
          Asserts that the expression is true with an optional message.
       </td>
    </tr>
    <tr>
       <td>assertFalse(boolean expression, string message)</td>
       <td>
          Asserts that the expression is false with an optional message.
       </td>
    </tr>
    <tr>
       <td>assertEquals(anydata|error actual, anydata expected, string message)</td>
       <td>
          Asserts that the actual value is equal to the expected value with an optional message.
       </td>
    </tr>
    <tr>
       <td>assertNotEquals(anydata actual, anydata expected, string message)</td>
       <td>
          Asserts that the actual value is not equal to the expected value with an optional message.
       </td>
    </tr>
    <tr>
       <td>assertExactEquals(any|error actual, any|error expected, string message)</td>
       <td>
          Asserts that the actual entity is exactly equal to the expected entity with an optional message.
       </td>
    </tr>
    <tr>
       <td>assertNotExactEquals(any|error actual, any|error expected, string message)</td>
       <td>
          Asserts that the actual entity is not exactly equal to the expected entity with an optional message.
       </td>
    </tr>
    <tr>
       <td>assertFail(string message)</td>
       <td>
           Fails the test. This is useful to fail a test based on a check for a condition while it is in execution.
       </td>
    </tr>
</table>

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
    test:assertEquals("hello Ballerina user\nWelcome to Ballerina",
        "hello user\nWelcome to Ballerina");
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

         --- actual
         +++ expected

         @@ -1,2 +1,2 @@

         -hello Ballerina user
         +hello user
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

// The `BeforeSuite` function is executed before running all the test
// functions in this module.
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

// The `beforeGroups1` function is executed before running all the test functions
// belonging to the `g1` group.
@test:BeforeGroups { value:["g1"] }
function beforeGroups1() {
    io:println("I'm the before groups function!");
}

// Another `beforeGroups2` function is executed before running all the test functions
// belonging to the `g1` and `g2` groups.
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

// The `afterGroupsFunc1` function is executed before running all the test functions
// belonging to the `g1` group.
@test:AfterGroups { value:["g1"] }
function afterGroupsFunc1() {
    io:println("I'm the after groups function!");
}

// The `afterGroupsFunc2` function is executed before running all the test functions
// belonging to the `g1` and `g2` groups.
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

## What's Next?

 As an integration language, you will be using lots of connectors when writing Ballerina code. Setting up mock backends
  for these external endpoints will be a tedious task (e.g., email client and SalesForce client). The mocking support in
   Ballerina will allow you to unit test your code without needing to set up mock backends by allowing you to control
    what the client objects return without actually sending requests to backends.

To learn about the mocking API, see [Mocking](/learn/testing-ballerina-code/mocking).
