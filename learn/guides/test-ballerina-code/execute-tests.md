---
layout: ballerina-testing-code-left-nav-pages-swanlake
title: Execute tests
description: Learn how to use different options for executing Ballerina tests.
keywords: ballerina, programming language, testing, test execution
permalink: /learn/test-ballerina-code/execute-tests/
active: execute-tests
intro: The sections below include information about executing tests in Ballerina.
redirect_from:
  - /swan-lake/learn/testing-ballerina-code/executing-tests/
  - /swan-lake/learn/testing-ballerina-code/executing-tests
  - /learn/user-guide/testing-ballerina-code/executing-tests
  - /learn/user-guide/testing-ballerina-code/executing-tests/
  - /learn/testing-ballerina-code/executing-tests/
  - /learn/testing-ballerina-code/executing-tests
  - /learn/testing-ballerina-code/execute-tests/
  - /learn/testing-ballerina-code/execute-tests
  - /learn/test-ballerina-code/execute-tests
  - /learn/guides/testing-ballerina-code/executing-tests/
  - /learn/guides/testing-ballerina-code/executing-tests
---

## Understand the test execution behavior

The following is the expected order of execution for setup and teardown functions of a test.

![Test Execution Order](/learn/images/test-execution-order.png)


## Understand the behavior during failures

* If a `BeforeSuite` function fails, 
 every other following function is skipped.

* If a `BeforeGroups` function fails, the tests belonging to that group, setup, and teardown functions specific to those
 tests will fail. The `AfterGroups` functions for that test group will be skipped. Other setup and teardown functions 
 will be executed as expected. Tests belonging to other groups will not be affected.

* If a `BeforeEach` function fails,
 every test will be skipped. Since `BeforeSuite` is already executed, `AfterSuite` will be executed. Even though the 
 `BeforeGroups` function is executed prior to BeforeEach, the `AfterGroups` function will not be executed unless marked 
 as `alwaysRun`.

* If a test function fails, none of the other functions get skipped.

* If the `before` test function fails, the test function and the `after` function for that test will be skipped.

* If an `AfterEach` function fails, every following `BeforeEach`, `AfterEach` and test function will get skipped.

* If `alwaysRun` property is enabled, `AfterGroups` and `AfterSuite` functions will run irrespective of the status of 
other functions.


## Execute tests using CLI commands

Tests will be executed when you run the test command.

Execute all the tests in the current package with the following command.

```bash
$ bal test
```

### Run tests for a group

List all the test groups in the package.

```bash
$ bal test --list-groups
```

Run only the tests belonging to the given group(s) in the current package.

```bash
$ bal test --groups <group_1>,<group_2>
```

Run the tests in the current package excluding the given group(s).

```bash
$ bal test --disable-groups <group_1>
```

### Run selected tests

Run only the given test function(s) in the current package.

```bash
$ bal test --tests <test_function>
```

Run a given set of functions in the default module only.

```bash
$ bal test --tests PackageName:<test_function>
```

Run all the functions in the given module.

```bash
$ bal test --tests PackageName.<module_name>:*
```

### Re-run failed tests

Run only the previously-failed test cases in the current package.

```bash
$ bal test --rerun-failed
```

### Run selected data sets in data-driven tests

Data-driven tests can be executed using the `bal test` command as any other test.

Run only the specified cases of a data set provided using the `dataProvider` attribute.
Use `#` as the separator and append the case identifier to the end of the test function name.

```bash
$ bal test --tests <test_function>#Case1
```

Run only the previously-failed cases in a data set.

```bash
$ bal test --rerun-failed
```

### Generate test report and code coverage

Generate an HTML test report without code coverage information.
Also, dump the test results in the JSON format.

```bash
$ bal test --test-report
```

Dump only the test results in the JSON format.

```bash
$ bal test --code-coverage
```

Generate an HTML test report with code coverage information.
Also, dump the test results in the JSON format.

```bash
$ bal test --test-report --code-coverage
```

Generate a JaCoCo XML test report with code coverage information.
Also, dump the test results in the JSON format.

```bash
$ bal test --code-coverage --coverage-format=xml
```

Generate an HTML test report and a JaCoCo XML test report with code coverage information.
Also, dump the test results in the JSON format.

```bash
$ bal test --test-report --code-coverage --coverage-format=xml
```


For more options of the test command, run the following.

```bash
$ bal test --help
``` 

<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
