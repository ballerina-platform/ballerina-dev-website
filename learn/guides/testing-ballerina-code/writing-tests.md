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

## What's Next?

 As an integration language, you will be using lots of connectors when writing Ballerina code. Setting up mock backends
  for these external endpoints will be a tedious task (e.g., email client and SalesForce client). The mocking support in
   Ballerina will allow you to unit test your code without needing to set up mock backends by allowing you to control
    what the client objects return without actually sending requests to backends.

To learn about the mocking API, see [Mocking](/learn/testing-ballerina-code/mocking).
