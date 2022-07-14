---
layout: ballerina-testing-code-left-nav-pages-swanlake
title: Configure tests
description: Learn how to configure Ballerina tests.
keywords: ballerina, programming language, testing, test setup
permalink: /learn/test-ballerina-code/configure-tests/
active: configure-tests
intro: The Ballerina Test framework has configurations at various levels to streamline the testing process and ensure that the tests are written with a comprehensible structure.
redirect_from:
- /learn/testing-ballerina-code/
- /learn/testing-ballerina-code
- /swan-lake/learn/testing-ballerina-code/configuring-tests/
- /swan-lake/learn/testing-ballerina-code/configuring-tests
- /learn/user-guide/testing-ballerina-code/configuring-tests
- /learn/user-guide/testing-ballerina-code/configuring-tests/
- /learn/user-guide/testing-ballerina-code/
- /learn/user-guide/testing-ballerina-code
- /learn/user-guide/testing-ballerina-code/configuring-tests/
- /learn/testing-ballerina-code/configuring-tests/
- /learn/testing-ballerina-code/configuring-tests
- /learn/test-ballerina-code/configuring-tests
- /learn/test-ballerina-code/configuring-test/
- /learn/test-ballerina-code/configure-tests
- /learn/guides/testing-ballerina-code/configuring-tests/
- /learn/guides/testing-ballerina-code/configuring-tests
---

## Set up and tearing down

The following test annotations can be used to set up and tear down the instructions. These configuration annotations 
enable executing instructions at various levels.

### Suite level

#### The `@test:BeforeSuite {}` annotation
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

#### The `@test:AfterSuite {}` annotation
The `AfterSuite` annotated function will be run once after all the tests in the test suite are run. This can be used for 
cleaning up the test suite level aspects. A test suite covers tests related to a module.

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

### Group level

#### The `@test:BeforeGroups {}` annotation
For each group specified in this annotation, the `BeforeGroups` annotated function will be executed once before any of 
the tests belonging to the group.

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

#### The `@test:AfterGroups {}` annotation
For each group specified in this annotation, the `AfterGroups` annotated function will be executed once after all the 
tests belonging to the group is executed.

***Example:***
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

### Test case level

#### The `@test:BeforeEach` annotation
The `BeforeEach` annotated function will be run before each test in the test suite. This can be used to initialize the 
test-level prerequisites repeatedly before every test function.

***Example:***

```ballerina
import ballerina/io;
import ballerina/test;

// The `BeforeEach` function, which is executed before each test function.
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

#### The `@test:AfterEach` annotation
The `AfterEach` annotated function will be run after each test within the test suite. This can be used to clean up the 
test-level aspects repeatedly after every test function.

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

### Each test case

#### The `before` attribute of the `@test:Config {}` annotation
The test config annotation makes use of ‘before’ to denote which function needs to execute before the particular 
test is run.

***Example:***

```ballerina
@test:Config { before : testFunction1 }
function testFunction3() {
    io:println("I'm in test function 3!");
    test:assertTrue(true, msg = "Failed!");
}
```

#### The `after` attribute of the `@test:Config {}` annotation
The test config annotation makes use of ‘after’ to denote which function needs to execute after the particular 
test is run.

***Example:***

```ballerina
@test:Config { after : testFunction3 }
function testFunction2() {
    io:println("I'm in test function 2!");
    test:assertTrue(true, msg = "Failed!");
}
```

## Define test-specific configurations
Configurations for testing can be provided using configurable variables. The values for configurable variables can be
provided in a file named `Config.toml` located in the `tests` directory, which will only be initialized when the tests
are run. 

>**Note:** If the `Config.toml` is not specified in the `tests` directory, the values will
be either taken from the `Config.toml` in the root directory or default values will be used.

Configurable variables are useful when you require separate configurations that cannot be feasibly used outside of 
testing. This is particularly useful when testing services and clients where you may need different host values when you
are trying to test the service or client.


## Define test-only dependencies
Dependencies are meant to be resolved only during testing and can be specified in the `Ballerina.toml` file by specifying the 
scope.

```toml
[[platform.java11.dependency]]
path = "/user/foo/libs/abc.jar"
scope = "testOnly"
```
