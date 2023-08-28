---
layout: ballerina-left-nav-release-notes
title: 2201.8.0 (Swan Lake) 
permalink: /downloads/swan-lake-release-notes/2201.8.0/
active: 2201.7.0
redirect_from: 
    - /downloads/swan-lake-release-notes/2201.8.0
    - /downloads/swan-lake-release-notes/2201.8.0-swan-lake/
    - /downloads/swan-lake-release-notes/2201.8.0-swan-lake
    - /downloads/swan-lake-release-notes/
    - /downloads/swan-lake-release-notes
---

## Overview of Ballerina Swan Lake 2201.8.0

<em>2201.8.0 (Swan Lake Update 8) is the eighth update release of Ballerina Swan Lake, and it includes a new set of features and significant improvements to the compiler, runtime, standard library, and developer tooling. It is based on the 2023R1 version of the Language Specification.</em> 

## Update Ballerina

Update your current Ballerina installation directly to 2201.8.0 using the [Ballerina Update Tool](/learn/cli-documentation/update-tool/) as follows.

1. Run `bal update` to get the latest version of the Update Tool.
2. Run `bal dist update` to update to this latest distribution.

## Install Ballerina

If you have not installed Ballerina, download the [installers](/downloads/#swanlake) to install.

>**Info:** From this release onwards, you can verify Ballerina artifacts using the Cosign CLI and Rekor APIs. For more information, see [Verify Ballerina artifacts](/downloads/verify-ballerina-artifacts).

## Backward-incompatible changes

- Ballerina interoperability implementation may have an impact with the Java 17 support due to any incompatible changes. For example, Java 17 has some restrictions on using Java reflections with internal Java packages. For more information, see the Java 17 release notes.

- Fixed a bug that resulted in variables that may or may not be initialized in an `on fail` clause not being identified as potentially uninitialized variables.

  ```ballerina
  public function main() {
    int resultInt;
    transaction {
        resultInt = check maybeProvideInt(true);
        check commit;
    } on fail {
        io:println("Failed to initialize resultInt");
    }
    resultInt += 1; // error: resultInt may not have been initialized
  }
  ```

- Fixed a bug related to type inference within query expressions when an expected type was absent. Previously, when iterating over a `map` without specifying an expected type, the query expression's result type was mistakenly inferred as an `array` which is now restricted.
  
- ```ballerina
  function foo(map<int> mp) {
      var _ = from int i in mp // compile-time error
                select i;
  }
  ```

- Fixed a bug where `error` completion was ignored while using collect-clause with query expressions.
 
- ```ballerina
  function foo(stream<int, error?> strm) {
     int _ = from var i in strm // compile-time error: expected int, but found int|error
             collect sum(i);
  }
  ```

## Platform updates

### New features

#### Introduction of list constants

The language now supports list constants. You can declare a constant variable using a list constructor as shown below.

```ballerina
const int[] ERROR_CODES = [404, 500, 503];
const ERROR_MESSAGES = ["Not Found", "Internal Server Error", "Service Unavailable"];
```

Also, you can declare a list constant using a byte array literal.

```ballerina
const byte[] data16 = base16 `55 EE 66`;
const data64 = base64 `ABCD pqrs`;
```

### Improvements

### Bug fixes

## Language updates

### New features

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.8.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FCompilerFE+milestone%3A2201.8.0+is%3Aclosed+label%3AType%2FBug).

## Runtime updates

### New features

#### Ballerina Profiler (experimental)

Introduced the `profile` CLI command, which runs a Ballerina package and does a CPU profile of it during runtime.

```
$ bal profile
```

- For example, if we run the above command in the root directory of a Ballerina package, it generates a flame graph that shows the time taken to execute each function.

- The output is given by the `ProfilerOutput.html` file, which can be opened using a web browser.

>**Note:** This is an experimental feature, which supports only a limited set of functionality.

### Improvements

#### Java 17 support

Ballerina now supports code compilation and execution with Java 17.

#### Support large list and mapping constructors

The number of members supported in a list constructor expression and the number of fields supported in a mapping constructor expression have been increased to create new array, tuple, map, and record values that are larger in size.

For example, the following array constructor is now supported.

```ballerina
// Array with 10000 elements. Middle elements are not shown and replaced with `...`.
int[] array = [1, 2, 3, ..., 9998, 9999, 10000];
```

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.8.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.8.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed).

## Standard library updates

### New features

#### `graphql` package

- Introduced the `DataLoader` functionality.

### Deprecations

#### `graphql` package

- Deprecated the `executeWithType()` method of the `graphql:Client`.

### Improvements

#### `graphql` package

- Added support for the `@deprecated` directive to output objects defined using record types.
- Added support for printing the GraphiQL URL to `stdout`.
- Added support for generating a subgraph SDL schema at compile time.

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.8.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.8.0%22+label%3AType%2FBug).

## Developer tools updates

### New features

#### CLI

- Added a new `bal tool` command to manage tools that extend the functionality of the CLI. Tools can be pulled from the Ballerina Central and are managed using the `bal tool` command. For more information, see [Tool commands](https://ballerina.io/learn/cli-documentation/cli-commands/#tool-commands).

#### OpenAPI tool
- Added support to generate Ballerina client and service declarations from OpenAPI v3.1.x definitions.

### Improvements

### Bug fixes

To view bug fixes, see the GitHub milestone for 2201.8.0 (Swan Lake) of the repositories below.

- [Language Server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FLanguageServer+milestone%3A2201.8.0+is%3Aclosed+label%3AType%2FBug)
- [OpenAPI](https://github.com/ballerina-platform/openapi-tools/issues?q=is%3Aissue+label%3AType%2FBug+milestone%3A%22Swan+Lake+2201.8.0%22+is%3Aclosed)

## Ballerina packages updates

### New features

Added support for custom package repositories for dependency resolution. This feature enables configuring commonly used package repositories to publish Ballerina libraries and to use them in Ballerina projects. 