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

- Fixed a bug that resulted in inconsistent error messages with the `cloneWithType` operation.
    
    ```ballerina
    type OpenRecord record {
    };

    public function main() {
        [OpenRecord...] tupleVal = [{"nonJson": xml `<a>abc</a>`}];
        json jsonVal = checkpanic tupleVal.cloneWithType();
    }
    ```
    now gives
    ```
    error: {ballerina/lang.value}ConversionError {"message":"'[OpenRecord...]' value cannot be converted to 'json'"}
        at ballerina.lang.value.0:cloneWithType(value.bal:114)
           sample:main(sample.bal:6)
    ```

- Improved the error message given in a failure of `fromJsonWithType` or `cloneWithType` operations, when the target type is a union type.
    
    ```ballerina
    public function main() {
        json j = [1, 1.2, "hello"];
        int[]|float[] val = checkpanic j.fromJsonWithType();
    }
    ```
    now gives
    ```
    error: {ballerina/lang.value}ConversionError {"message":"'json[]' value cannot be converted to '(int[]|float[])': 
                {
                  array element '[2]' should be of type 'int', found '"hello"'
                or
                  array element '[2]' should be of type 'float', found '"hello"'
                }"}
        at ballerina.lang.value.0:fromJsonWithType(value.bal:370)
           sample:main(sample.bal:3)
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

#### New Runtime Java APIs

- Introduced the following API in the `io.ballerina.runtime.api.utils.ValueUtils` class to clone an `anydata` value with another subtype of the `anydata` type.
    ```java
    public static Object convert(Object value, Type targetType);
    ```
- Introduced the `getFunctionName()` and `getPathParameters()` APIs in the runtime `io.ballerina.runtime.api.Environment` class. They provide the Ballerina function name and path parameters associated with an external Java method respectively.

### Improvements

#### Support for command-line arguments of built-in subtypes

The command-line arguments of the Ballerina built-in subtypes are now supported to be parsed as operands.

For the following `main` function,
```ballerina
public function main(byte byteVal, string:Char charVal, int:Signed8 int8Val) {
}
```
the values can be passed through command-line arguments as follows.
```
bal run -- 1 b 33
```

#### Support ambiguous union type configurable variables

When a structural value is provided for a configurable variable of a union type that includes more than one type descriptor, the inherent type used will be the first (leftmost) type descriptor from which the value can be constructed.

For example, in the following Ballerina code,
```ballerina
type Person record {|
    string name;
    string city;
|};

configurable map<string>|Person configVar = ?;
```
and when the `Config.toml` file contents are as follows,
```toml
configVar = {name = "Jack", city = "Colombo"}
```
`configVar` is instantiated with the `map<string>` inherent type.

#### Support binding of resource functions to a generic native method

A new way has been introduced to support the binding of any resource function to a generic native method regardless of the resource path parameters. The generic native method should be defined with a `BArray` parameter, which represents all the path parameters. To avoid errors due to overloaded methods, it is recommended to define the parameter type constraints as well.

For example, the following Ballerina resource function
```ballerina
isolated resource function get abc/[int p1]/[string p2]/[string p3]/[int ...p4] (string s) = @java:Method {
        'class: "javalibs.app.App",
        name: "getResource",
        paramTypes: ["io.ballerina.runtime.api.values.BObject", "io.ballerina.runtime.api.values.BArray", "io.ballerina.runtime.api.values.BString"]
    } external;
```
can be bound to the following Java method.
```java
public static void getResource(BObject client, BArray path, BString str) {
}
```

#### Improvements in Runtime Java APIs

- The `getType` runtime API, which returns an `ObjectType` in the `io.ballerina.runtime.api.values.BObject` class is now deprecated. A new `getOriginalType` API, which returns the `Type` is introduced to return both the `ObjectType` and the type-reference type.
- The `XMLNS` Java constant in the `io.ballerina.runtime.api.values.BXmlItem` runtime class is now deprecated. Instead, the `javax.xml.XMLConstants.XMLNS_ATTRIBUTE` constant needs to be used.

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

- Added quick pick support for the `Extract to local variable` and `Extract to function` code actions.
- Added completion support for regular expressions.

#### GraphQL Tool

#### OpenAPI Tool

#### Persist Tool

### Improvements

#### CLI

#### JSON-to-record converter

#### Language Server

- Updated the LSP4J version to 0.15.0.
- Added annotation completions for the tuple member context.
- Added snippet completions for the `string` and `xml` templates.
- Added code action support for regular expressions.
- Added field access completions for template expressions.

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
