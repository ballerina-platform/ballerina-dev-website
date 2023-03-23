---
layout: ballerina-left-nav-release-notes
title: 2201.5.0 (Swan Lake) 
permalink: /downloads/swan-lake-release-notes/2201.5.0/
active: 2201.5.0
redirect_from: 
    - /downloads/swan-lake-release-notes/2201.5.0
    - /downloads/swan-lake-release-notes/2201.5.0/
    - /downloads/swan-lake-release-notes/2201.5.0-swan-lake/
    - /downloads/swan-lake-release-notes/2201.5.0-swan-lake
    - /downloads/swan-lake-release-notes/
    - /downloads/swan-lake-release-notes
---

## Overview of Ballerina Swan Lake 2201.5.0

<em>2201.5.0 (Swan Lake Update 5) is the fourth update release of Ballerina Swan Lake, and it includes a new set of features and significant improvements to the compiler, runtime, standard library, and developer tooling. It is based on the 2022R4 version of the Language Specification.</em> 

## Update Ballerina

**If you are already using Ballerina 2201.0.0 (Swan Lake)**, run either of the commands below to directly update to 2201.5.0 using the [Ballerina Update Tool](/learn/cli-documentation/update-tool/).

`bal dist update` (or `bal dist pull 2201.5.0`)

**If you are using a version below 2201.0.0 (Swan Lake)**, run the commands below to update to 2201.5.0.

1. Run `bal update` to get the latest version of the Update Tool.

2. Run `bal dist update` ( or `bal dist pull 2201.5.0`) to update your Ballerina version to 2201.5.0.

However, if you are using a version below 2201.0.0 (Swan Lake) and if you already ran `bal dist update` (or `bal dist pull 2201.5.0`) before `bal update`, see [Troubleshooting](/downloads/swan-lake-release-notes/swan-lake-2201.0.0#troubleshooting) to recover your installation.

## Install Ballerina

If you have not installed Ballerina, download the [installers](/downloads/#swanlake) to install.

## Backward-incompatible changes

- Fixed a bug that resulted in invalid usage of additive expressions with operands of different incompatible basic types not resulting in a compilation error.

    ```ballerina
    public function main() {
        "abc"|string:Char a = "a";
        var b = a + 1; // compilation error now
        var c = ["a","b","c"].map(s => s + 1); // compilation error now
    } 
    ```

- Fixed a bug that previously resulted in incorrect type checking for an intersection with `readonly` against an incompatible union type as the expected type.

    ```ballerina
    type Employee record {|
        string[] name;
        int id;
    |};

    public function main() {
        json & readonly v = {};
        
        string|error r = v; // compilation error now
        Employee|string s = v.cloneReadOnly(); // compilation error now
    }
    ```

- Fixed a bug that previously resulted in variables that were initialized with non-isolated expressions being inferred to be `isolated` variables.

    ```ballerina
    int[] config = [];

    // `configs` was previously inferred to be an `isolated` variable
    // incorrectly. It will no longer be inferred to be an `isolated` 
    // variable since `config` is not an isolated expression.
    int[][] configs = [[1, 2], config]; 

    // Since `configs` is not inferred to be an `isolated` variable now,
    // `getConfig` is not inferred to be an `isolated` function.
    function getConfig(int index) returns int[] {
        lock {
            return configs[index].clone();
        }
    }
    ```

- Fixed a bug in dependently-typed function analysis which previously resulted in compilation errors not being logged when the `typedesc` argument is defined using a type definition (`T`) and the return type is a union (`T|t`) where the basic types for `T` and `t` are not disjoint.

    ```ballerina
    public type TargetType typedesc<anydata>;

    // already a compilation error
    function f1(typedesc<anydata> targetType = <>) returns targetType|json = external;

    // also a compilation error now
    function f2(TargetType targetType = <>) returns targetType|json = external;
    ```

- Fixed a bug that allowed using an included record parameter of the same name as that of a field of the parameter record type.
    
    ```ballerina
    type ErrorDetail record {|
        string 'error;
        int code;
        int[] locations?;
    |};
    
    function getError(*ErrorDetail 'error) { // compilation error now
    }
    ```

- Due to an internal API change, the GraphQL `1.7.0` package is not compatible with older Ballerina versions and older GraphQL versions are not compatible with Ballerina `2201.5.0`. When migrating to Ballerina `2201.5.0` from previous Ballerina distributions, the GraphQL version should be updated to `1.7.0` with this release.

## Language updates

### New features

#### Language support for regular expressions

The language now supports regular expressions enabling powerful pattern-matching and text processing operations. A new type, named `RegExp`, has been introduced in the new `lang.regexp` module (it can also be referred to using the type alias `RegExp` defined in the `lang.string` module). The `RegExp` type conforms to a subset of the ECMAScript specification for regular expressions.

```ballerina
import ballerina/lang.regexp;
import ballerina/io;

public function main() {
    string:RegExp reg = re `[bB].tt[a-z]*`;
    regexp:Span[] result = reg.findAll("Butter was bought by Betty.");
    io:println(result.length()); // 2

    regexp:Span span1 = result[0];
    io:println(span1.substring()); // Butter

    regexp:Span span2 = result[1];
    io:println(span2.substring()); // Betty
}
```

### Improvements

### Bug fixes

To view other bug fixes, see the [GitHub milestone for Swan Lake 2201.5.0](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FCompilerFE+milestone%3A2201.5.0+is%3Aclosed+label%3AType%2FBug).

## Runtime updates

### New features

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.5.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.5.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed).

## Standard library updates

### New features

#### `graphql` package

- Added support for the federation subgraph.

### Improvements

#### `graphql` package

- Added parallel execution support for GraphQL resolvers.
- Allowed adding a single interceptor without creating an array.

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake 2201.5.0](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.5.0%22+label%3AType%2FBug).

### Code to Cloud updates

### New features

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.5.0 (Swan Lake)](https://github.com/ballerina-platform/module-ballerina-c2c/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+2201.5.0%22+label%3AType%2FBug).

## Developer tools updates

### New features

#### Test Framework

#### Language Server

#### GraphQL Tool

#### OpenAPI Tool

#### Persist Tool

### Improvements

#### CLI

#### JSON-to-record converter

#### Language Server

#### OpenAPI Tool
- Updated the tool to handle multiple media types with the same return code in the Ballerina service to OpenAPI contract generation. 
- Added the support to handle the newly introduced `@http:Query` annotation of the `ballerina/http` module in the Ballerina service to OpenAPI contract generation.
- Added the support to generate API documentation for the resource functions in the generated Ballerina service. 

### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake 2201.5.0 of the repositories below.

- [Test Framework](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+label%3AArea%2FTestFramework+milestone%3A2201.5.0)
- [Language Server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FLanguageServer+milestone%3A2201.5.0+is%3Aclosed+label%3AType%2FBug)
- [Debugger](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.5.0+is%3Aclosed+label%3AArea%2FDebugger+label%3AType%2FBug)
- [OpenAPI Tool](https://github.com/ballerina-platform/openapi-tools/issues?q=is%3Aclosed+milestone%3A%22Swan+Lake+2201.5.0+%22+label%3AType%2FBug)

## Ballerina packages updates

### New features

- Introduced `bal deprecate`. With this command, now a package in the Ballerina Central can be deprecated and undeprecated by the owner.

### Improvements

- Added support for maintaining generated test code in a Ballerina package
- Improved the dependency resolution to minimize the impact of essential incompatible changes added with new Update releases

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake 2201.5.0](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A2201.5.0+label%3AArea%2FProjectAPI)
