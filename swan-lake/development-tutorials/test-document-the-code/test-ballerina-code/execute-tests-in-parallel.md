---
layout: ballerina-testing-code-left-nav-pages-swanlake
title: Execute tests in parallel
description: Learn how to execute tests in parallel.
keywords: ballerina, programming language, testing, test execution
permalink: /learn/test-ballerina-code/execute-tests-in-parallel/
active: execute-tests
intro: The sections below include information about executing tests in parallel.
---

## Enable parallel execution of tests

Tests are executed serially by default. User has to consciously enable the parallel execution by passing
the `--parallel` flag as follows.

```bash
bal test --parallel
```

Prior to executing tests concurrently, it is imperative to guarantee concurrency safety. Ballerina inherently assesses the concurrency safety of tests to a certain degree using a predefined set of rules. Tests failing to adhere to these rules are executed serially, notwithstanding the activation of the parallel flag.

## Exclude a specific test from parallel execution

Tests can be flagged to be executed serially eventhough parallel execution is enabled. The common use case is when
certain tests have dependencies or requirements that make them incompatible with parallel execution. Eg- Shared
resource/ specific environment set-up. If such a requirment is identfied, User may need to set the `serialExecution`
flag to `true` as follows.

```ballerina
@test:Config {serialExecution: true}
function testAssertEquals6() {
    test:assertEquals(100, 100);
}
```

## Write a concurrent safe test case

Following set of rules should be followed while writing a parallel test,

1) Test function should be isolated. In some instances, compiler infer the test functions as isolated automatically if
   there are sufficient conditions to make them concurrently safe.
2) If it is a data provider test, 
   - The data provider of the test function should be isolated.
   - The test function parameters should be read-only type.
3) Respective set-up, and tear-down functions (before, after, before-each, after-each, before-group, after-group) of the test function should be isolated.

A warning related to unparallelized tests are printed at the beginning of the parallel test execution with the reasons.
Consider the following example,

```ballerina
import ballerina/lang.runtime;
import ballerina/test;

int a = 0;

@test:Config {
    dataProvider: mapDataProvider
}
function mapDataProviderTest(int value1, int value2, string fruit) returns error? {
    test:assertEquals(value1, value2, msg = "The provided values are not equal");
    runtime:sleep(0.1);
    a = 8;
}

function mapDataProvider() returns map<[int, int, string]>|error {
    a = 10;
    map<[int, int, string]> dataSet = {
        "banana": [10, 10, "banana"],
        "cherry": [5, 5, "cherry"],
        "apple": [5, 5, "apple"],
        "orange": [5, 5, "orange"]
    };
    return dataSet;
}
```

The above code results following warning.

```bash
WARNING: Test function 'mapDataProviderTest' cannot be parallelized, reason: non-isolated test function, non-isolated data-provider function
```
Based on the warning, we can correct the code as follows,

```ballerina
import ballerina/lang.runtime;
import ballerina/test;

isolated int a = 0;

@test:Config {
    dataProvider: mapDataProvider
}
isolated function mapDataProviderTest(int value1, int value2, string fruit) returns error? {
    test:assertEquals(value1, value2, msg = "The provided values are not equal");
    runtime:sleep(0.1);
    lock {
        a = 8;
    }
}

isolated function mapDataProvider() returns map<[int, int, string]>|error {
    lock {
        a = 10;
    }
    map<[int, int, string]> dataSet = {
        "banana": [10, 10, "banana"],
        "cherry": [5, 5, "cherry"],
        "apple": [5, 5, "apple"],
        "orange": [5, 5, "orange"]
    };
    return dataSet;
}
```
