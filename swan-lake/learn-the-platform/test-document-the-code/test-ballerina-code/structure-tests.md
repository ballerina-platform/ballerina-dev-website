---
layout: ballerina-testing-code-left-nav-pages-swanlake
title: Structure tests
description: Learn how to structure Ballerina tests.
keywords: ballerina, programming language, testing
permalink: /learn/test-ballerina-code/structure-tests/
active: structure-tests
intro: The Ballerina Test Framework follows a general, organized structure that allows testing code under various conditions by making use of resources and configurations. 
redirect_from:
    - /swan-lake/learn/testing-ballerina-code/structuring-tests/
    - /swan-lake/learn/testing-ballerina-code/structuring-tests
    - /learn/user-guide/testing-ballerina-code/structuring-tests
    - /learn/user-guide/testing-ballerina-code/structuring-tests/
    - /learn/user-guide/testing-ballerina-code/
    - /learn/user-guide/testing-ballerina-code
    - /learn/user-guide/testing-ballerina-code/structuring-tests/
    - /learn/testing-ballerina-code/structuring-tests/
    - /learn/testing-ballerina-code/structuring-tests
    - /learn/testing-ballerina-code/structure-tests/
    - /learn/testing-ballerina-code/structure-tests
    - /learn/testing-ballerina-code/structure-the-tests/
    - /learn/testing-ballerina-code/structure-the-tests
    - /learn/test-ballerina-code/structure-tests
    - /learn/guides/testing-ballerina-code/structuring-the-tests/
    - /learn/guides/testing-ballerina-code/structuring-the-tests
---

## Test source files
Unit tests bound to a module need to be placed in a subfolder called `tests` within the module. 
In a standard Ballerina package, a module is mapped to a test suite. All tests within a module’s `tests` subdirectory 
are considered to be part of the same test suite. The test source files could have any name. The test functions are just 
Ballerina functions, which use a special annotation to mark the function as a test. Test functions must be specified 
with the `@test:Config{}` annotation and there is no restriction on the test function name.

The functions, services, and global variables defined in a module are accessible from within the test files.
Hence, you cannot redefine a symbol in the test files if it is already declared in the module.
On the other hand, symbols defined in the test files will not be visible inside the module source files.

## Test resources
The `resources` subdirectory found within the `tests` directory is meant to contain any files or resources that are 
exclusively required for testing. You can access the resource files either using the absolute path or using the path 
relative to the package root.

## Test configurations
Configurations for testing can be provided using configurable variables. The values for configurable variables can be 
provided in a file named `Config.toml` located in the `tests` directory.

For information on using configurable variables, see
[Configurable variables](/learn/configure-ballerina-programs/configure-a-sample-ballerina-service/).
