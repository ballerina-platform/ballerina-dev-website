---
layout: ballerina-testing-code-left-nav-pages-swanlake
title: Quick Start on Testing
description: Learn how to use Ballerina's built-in test framework to write testable code. The test framework provides a set of building blocks to help write and run tests.
keywords: ballerina, programming language, testing
permalink: /learn/testing-ballerina-code/quick-start-on-testing/
active: quick-start-on-testing
intro: The Ballerina Language has a built-in robust test framework, which allows you to achieve multiple levels of the test pyramid including unit testing, integration testing, and end to end testing.  It provides features such as assertions, data providers, mocking, and code coverage, which enable the programmers to write comprehensive tests.
redirect_from:
  - /learn/how-to-test-ballerina-code/
  - /learn/how-to-test-ballerina-code
  - /learn/testing-ballerina-code/testing-quick-start
  - /learn/testing-ballerina-code/testing-quick-start/
  - /learn/testing-ballerina-code/
  - /learn/testing-ballerina-code
  - /swan-lake/learn/testing-ballerina-code/testing-quick-start/
  - /swan-lake/learn/testing-ballerina-code/testing-quick-start
  - /learn/user-guide/testing-ballerina-code/testing-quick-start
  - /learn/user-guide/testing-ballerina-code/testing-quick-start/
  - /learn/user-guide/testing-ballerina-code/
  - /learn/user-guide/testing-ballerina-code
  - /learn/user-guide/testing-ballerina-code/testing-quick-start/
  - /learn/testing-ballerina-code/quick-start-on-testing
---

## Writing a Simple Function

To get started, let's set up the Ballerina package to run tests.

1. Create a directory in the root directory of the package named `tests` in which the test files will be stored.

    ```bash
    package-directory/
        Ballerina.toml
        main.bal
        tests/
            main_test.bal
    ```

2. Create the following function in the ***main.bal*** file

    ```ballerina
    public function intAdd(int a, int b) returns (int) {
        return a + b;
    }
    ```

3. In the **main_test.bal**, make use of the test module to test out the functionality of the `intAdd` function in 
the ***main.bal***

    ```ballerina
    import ballerina/test;

    @test:Config {}
    function intAddTest() {
        test:assertEquals(intAdd(1, 3), 4);
    }
    ```

4. Execute the tests using the following command

    ```$ bal test```
