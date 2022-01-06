---
layout: ballerina-testing-code-left-nav-pages-swanlake
title: Executing Tests
description: Learn how to use different options for executing Ballerina tests.
keywords: ballerina, programming language, testing
permalink: /learn/testing-ballerina-code/executing-tests/
active: executing-tests
intro: The sections below include information about executing tests in Ballerina.
redirect_from:
  - /learn/testing-ballerina-code/executing-tests
  - /swan-lake/learn/testing-ballerina-code/executing-tests/
  - /swan-lake/learn/testing-ballerina-code/executing-tests
  - /learn/user-guide/testing-ballerina-code/executing-tests
  - /learn/user-guide/testing-ballerina-code/executing-tests/
---

## Executing Tests Using CLI Commands

Tests will be automatically executed when you run the build command or you can explicitly run them using the test command. 

Execute all the tests in the current package with the following command.

```
$ bal test
```

List all the test groups in the package.

```
$ bal test --list-groups
```

Run only the tests belonging to the given group(s) in the current package.

```
$ bal test --groups <group_1>,<group_2>
```

Run the tests in the current package excluding the given group(s).

```
$ bal test --disable-groups <group_1>
```

Run only the given test function(s) in the current package.

```
$ bal test --tests <test_function>
```

Run a given set of functions in the default module only.

```
$ bal test --tests PackageName:<test_function>
```

Run all the functions in the given module.

```
$ bal test --tests PackageName.<module_name>:*
```

Run only the specified cases of a data set provided using the `dataProvider` attribute.
Use `#` as the separator and append the case identifier to end of the test function name.

```
$ bal test --tests <test_function>#Case1
```

Run only the previously-failed test cases in the current package.

```
$ bal test --rerun-failed
```

Generate an HTML test report without code coverage information.
Also, dump the test results in the JSON format.

```
$ bal test --test-report
```

Dump only the test results in the JSON format.

```
$ bal test --code-coverage
```

Generate an HTML test report with code coverage information.
Also, dump the test results in the JSON format.

```
$ bal test --test-report --code-coverage
```

Generate a JaCoCo XML test report with code coverage information.
Also, dump the test results in the JSON format.

```
$ bal test --code-coverage --coverage-format=xml
```

Generate an HTML test report and a JaCoCo XML test report with code coverage information.
Also, dump the test results in the JSON format.

```
$ bal test --test-report --code-coverage --coverage-format=xml
```

For more options of the test command, run the following.

`$ bal test --help` 

<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
