---
layout: ballerina-testing-code-left-nav-pages-swanlake
title: Define test groups
description: Learn how to use grouping functionality of the Ballerina test framework.
keywords: ballerina, programming language, testing, test groups
permalink: /learn/test-ballerina-code/define-test-groups/
active: test-groups
intro: The Ballerina test framework allows grouping of tests.
---

## Group tests
Test grouping allows us to control the execution of tests by partitioning them into groups. The Test Framework allows
for a single test to have multiple groups. 

A test is assigned to a group via the test configuration `groups` key, which accepts a string array of groups. 

***Example:*** 

```ballerina
import ballerina/io;
import ballerina/test;

@test:Config {groups: ["g1"]}
function testFunction1() {
    io:println("I'm a test belonging to group g1!");
    test:assertTrue(true, msg = "Failed!");
}

@test:Config {groups: ["g1", "g2"]}
function testFunction2() {
    io:println("I'm a test belonging to groups g1 and g2!");
    test:assertTrue(true, msg = "Failed!");
}

@test:Config {groups: ["g2"]}
function testFunction3() {
    io:println("I'm a test belonging to group g2!");
    test:assertTrue(true, msg = "Failed!");
}
```

## Group commands

### Execute grouped tests
To execute groups of tests, the `--groups` flag is used during test execution.

```
$ bal test --groups g1
```

The above results in an output of :

```

Compiling source
        user/Testing:0.1.0

Running Tests

        Testing
I'm a test belonging to group g1!
I'm a test belonging to groups g1 and g2!


                2 passing
                0 failing
                0 skipped
```

The `groups` flag supports executing multiple groups by using comma-separated arguments.

```
$ bal test --groups g1,g2
```

The above results in an output of :

```

Compiling source
        user/Testing:0.1.0

Running Tests

        Testing
I'm a test belonging to group g1!
I'm a test belonging to groups g1 and g2!
I'm a test belonging to group g2!


                3 passing
                0 failing
                0 skipped
```

### Disable grouped tests

To skip the execution of certain groups of tests, the `--disable-groups` flag is used during test execution.

```
$ bal test --disable-groups g2
```

The above results in an output of :

```
Compiling source
        user/Testing:0.1.0

Running Tests

        Testing
I'm a test belonging to group g1!


                1 passing
                0 failing
                0 skipped
```
