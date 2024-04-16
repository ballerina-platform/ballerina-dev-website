---
layout: ballerina-testing-code-left-nav-pages-swanlake
title: Execute tests in parallel
description: Learn how to execute tests in parallel.
keywords: ballerina, programming language, testing, test execution
permalink: /learn/test-ballerina-code/execute-tests-in-parallel/
active: execute-tests-in-parallel
intro: Ballerina test framework allows developers to execute test cases in parallel, which can significantly reduce the overall test execution time, especially for large codebases with a large number of test cases.
---

## Enable parallel execution of tests

Tests are executed serially by default. The user has to explicitly activate the parallel execution by providing the `--parallel` flag as follows.

```
bal test --parallel
```

Before running tests concurrently, it is crucial to ensure concurrency safety. Ballerina inherently evaluates the concurrency safety of tests to some extent using a predefined set of rules. Tests that do not comply with these rules are executed sequentially, regardless of the parallel flag being enabled.

## Exclude a specific test from parallel execution

Certain tests may have dependencies or requirements that make them incompatible with parallel execution, such as shared resources or specific environment setups. If such a requirement is identified, the user may need to set the `serialExecution` flag to `true` as follows:

```ballerina
@test:Config {serialExecution: true}
function testAssertEquals6() {
    test:assertEquals(100, 100);
}
```

## Write a concurrent safe test case

The following conditions have to be met for a test to be identified as one that can be run in parallel.

1. The test function must be isolated. If the function is not exposed publicly and all the conditions for `isolated` functions are met, the compiler may infer the test functions as `isolated`. 
2. If it is a data provider test, 
   - The data provider of the test function must be isolated, either explicitly marked or inferred to be isolated.
   - The types of the test function parameters must be subtypes of `readonly`. I.e., only immutable values can be passed as arguments.
3. Corresponding set-up and tear-down functions (`before`, `after`, `BeforeEach`, `AfterEach`, `BeforeGroups`, `AfterGroups`) of the test function must be isolated.

To learn more about concurrency safety in Ballerina, see [Concurrency safety](https://ballerina.io/learn/concurrency/#concurrency-safety).

A warning related to unparallelized tests is printed at the beginning of the parallel test execution with the reasons.
Consider the following example.

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

The above code results in the following warning.

```
WARNING: Test function 'mapDataProviderTest' cannot be parallelized, reason: non-isolated test function, non-isolated data-provider function
```
Based on the warning, the code can be improved as follows.

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
