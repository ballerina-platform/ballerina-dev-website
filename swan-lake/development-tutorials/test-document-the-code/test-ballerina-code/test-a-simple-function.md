---
layout: ballerina-testing-code-left-nav-pages-swanlake
title: Test a simple function
description: Learn how to use Ballerina's built-in test framework to write testable code. The test framework provides a set of building blocks to help write and run tests.
keywords: ballerina, programming language, testing
permalink: /learn/test-ballerina-code/test-a-simple-function/
active: test-a-simple-function
intro: The Ballerina language has a built-in robust test framework, which allows you to achieve multiple levels of the test pyramid including, unit testing, integration testing, and end-to-end testing. It provides assertions, data providers, mocking, and code coverage features, which enable the programmers to write comprehensive tests.
---

To get started, let's set up the Ballerina package to run tests.

1. Create a Ballerina package with the `bal new` command as follows.

   ```
   $ bal new hello_world
   ```

2. Create a directory in the root directory of the package named `tests` in which the test files will be stored.

    ```
    hello_world/
        Ballerina.toml
        main.bal
        tests/
            main_test.bal
    ```

3. Create the following function in the `main.bal` file.

    ```ballerina
    public function intAdd(int a, int b) returns (int) {
        return a + b;
    }
    ```

4. In the `main_test.bal` file, make use of the test module to test out the functionality of the `intAdd` function in the `main.bal` file.

    ```ballerina
    import ballerina/test;

    @test:Config {}
    function intAddTest() {
        test:assertEquals(intAdd(1, 3), 4);
    }
    ```

5. Execute the tests using the following command.

   ```
   $ bal test
   ```
   Then you can see the output as follows.

   ```
   Compiling source
        user/hello_world:0.1.0

   Running Tests

           hello_world


                   1 passing
                   0 failing
                   0 skipped
   ```
