---
layout: ballerina-blank-page
title: Release Note
---
### Overview of jBallerina 1.2.7
The jBallerina 1.2.7 patch release improves upon the 1.2.6 release by introducing the features listed below and addressing a number of [bugs](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A%22Ballerina+1.2.7%22+label%3AType%2FBug+is%3Aclosed) and [improvements](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A%22Ballerina+1.2.7%22+is%3Aclosed+label%3AType%2FImprovement).

You can use the update tool to update to jBallerina 1.2.7 as follows.

**For existing users:**

If you are already using jBallerina version 1.2.0, or above, you can directly update your distribution to jBallerina {{ site.data.stable-latest.metadata.version }} by executing the following command:

> ballerina dist update

However, you need to use the following commands instead of the above if you have installed:

- jBallerina 1.2.0 but switched to a previous version: `ballerina dist pull jballerina-1.2.7`
- a jBallerina version below 1.1.0: install via the [installers](https://ballerina.io/downloads/)

**For new users:**

If you have not installed jBallerina, then download the [installers](https://ballerina.io/downloads/) to install.

#### Standard Library

##### I/O

- When a CSV file has an empty record, the previous implementation panicked. This is fixed with this release.

#### Developer Tools

##### Test Framework

###### Object Mocking

Object mocking enables controlling the values of member variables and the behavior of the member functions of an object. The following improvements are introduced with regard to this.

- Ability to create a test double, which provides an equivalent mock in place of the real object
- Capability of stubbing the member function or member variable

Object mocking is done by using the following functions.

- The `test:mock()` and `test:prepare()` functions are used to initialize the mocking capability.
- The `test:prepare()` function allows to use the associated mocking functions like `thenReturn()`, `thenReturnSequence()`, `doNothing()`, and `withArguments()`.

###### Function Mocking

- The `MockFunction` object is added to handle function mocking. `MockFunction` objects are defined by attaching the `@test:Mock` to the `MockFunction` object to specify the function to mock.
- The mocking API also supports scoping and stubbing of mock functions that are declared for functions in imported modules.

Function mocking is done by using the following functions.

- The `test:when(mockObj)` function is used to initialize the mocking capability within a particular test case.
- This allows you to use the associated mocking functions like `call()`, `thenReturn()`, and `withArguments()`.
