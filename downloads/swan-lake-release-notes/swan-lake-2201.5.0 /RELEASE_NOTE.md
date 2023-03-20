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

### Improvements

### Bug fixes

To view other bug fixes, see the [GitHub milestone for Swan Lake 2201.5.0](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FCompilerFE+milestone%3A2201.5.0+is%3Aclosed+label%3AType%2FBug).

## Runtime updates

### New features

#### New Runtime Java APIs

- To clone an `anydata` value with another subtype of `anydata` type, the following API is introduced in the `io.ballerina.runtime.api.utils.ValueUtils` class.
    ```java
    public static Object convert(Object value, Type targetType);
    ```
- `getFunctionName()` and `getPathParameters()` APIs are introduced in the runtime `io.ballerina.runtime.api.Environment` class. They provide the Ballerina function name and path parameters associated with Java interop methods, respectively.

### Improvements

#### Support for command line arguments of built-in subtypes

The command-line arguments of Ballerina built-in subtypes are now supported to be parsed as operands.

For the following `main` function,

```ballerina
public function main(byte byteVal, string:Char charVal, int:Signed8 int8Val) {
}
```

the values can be passed through the command line arguments as follows.

```
bal run -- 1 b 33
```
#### Support ambiguous union type configurable variables

When a structural value is provided for a configurable variable of a union type that includes more than one type descriptor, the inherent type used will be the first (leftmost) type descriptor, from which the value can be constructed.

For example, given the following Ballerina code
```ballerina
type Person record {|
    string name;
    string city;
|};

configurable map<string>|Person configVar = ?;
```
and the `Config.toml` file contains the following,
```toml
configVar = {name = "Jack", city = "Colombo"}
```
`configVar` is instantiated with the inherent type `map<string>`.

#### Support binding of resource functions to a generic native method

A new way has been introduced to support the binding of any resource function to a generic native method, regardless of the resource path parameters. The generic native method should be defined with a `BArray` parameter, which represents all path parameters. To avoid errors due to overloaded methods, it is recommended to define parameter type constraints as well.

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

- The `getType` runtime API which returns an `ObjectType` in `io.ballerina.runtime.api.values.BObject` class is now deprecated. A new API `getOriginalType` which returns the Type is introduced to return both the `ObjectType` and the type-reference type. We need to modify the previous `getType` API to return the Type after fixing the caching issue [#39850](https://github.com/ballerina-platform/ballerina-lang/issues/39850).

- The java constant `XMLNS` in `io.ballerina.runtime.api.values.BXmlItem` runtime class is now deprecated. The constant `javax.xml.XMLConstants.XMLNS_ATTRIBUTE` needs to be used instead.

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
