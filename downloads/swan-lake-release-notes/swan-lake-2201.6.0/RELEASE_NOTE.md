---
layout: ballerina-left-nav-release-notes
title: 2201.6.0 (Swan Lake) 
permalink: /downloads/swan-lake-release-notes/2201.6.0/
active: 2201.6.0
redirect_from: 
    - /downloads/swan-lake-release-notes/2201.6.0
    - /downloads/swan-lake-release-notes/2201.6.0-swan-lake/
    - /downloads/swan-lake-release-notes/2201.6.0-swan-lake
    - /downloads/swan-lake-release-notes/
    - /downloads/swan-lake-release-notes
---

## Overview of Ballerina Swan Lake 2201.6.0

<em>2201.6.0 (Swan Lake Update 6) is the sixth update release of Ballerina Swan Lake, and it includes a new set of features and significant improvements to the compiler, runtime, standard library, and developer tooling. It is based on the 2022R4 version of the Language Specification.</em> 

## Update Ballerina

Update your currrent Ballerina installation directly to 2201.6.0 by using the [Ballerina Update Tool](/learn/cli-documentation/update-tool/) as follows.

1. Run `bal update` to get the latest version of the Update Tool.
2. Run `bal dist pull 2201.6.0` to update to this latest distribution.

## Install Ballerina

If you have not installed Ballerina, download the [installers](/downloads/#swanlake) to install.

## Backward-incompatible changes

- Fixed a bug with the XML parser error messages that showed dependency information. The error message prefix `failed to create xml` is now changed to `failed to parse xml`, to have a single prefix for all the XML-parsing error messages.

    For example, consider the content below of the `invalid_xml.txt` file.

    ```
    <!-- comments cannot have -- in it -->
    ```

    When the following Ballerina code is run,

    ```ballerina
    import ballerina/io;

    public function main() returns error? {
        xml readResult = check io:fileReadXml("invalid_xml.txt");
    }
    ```

    it gives the error below.

    ```
    error: failed to parse xml: String '--' not allowed in comment (missing '>'?)
     at [row,col {unknown-source}]: [1,4]
    ```

- The `Environment`, `Future`, and `Runtime` classes in the `io.ballerina.runtime.api` package are refactored to abstract classes. Creating an instance of those classes is incorrect.

- A typedesc value (returned by evaluating the `typeof` expression on a result of the `value:cloneWithType` and `value:fromJsonWithType` functions) is changed to give the correct type-reference type.

    ```ballerina
    import ballerina/io;

    type IntArray int[];

    public function main() returns error? {
        float[] arr = [1.0, 2.0];
        IntArray result = check arr.cloneWithType();
        io:println(typeof result); // Prints 'typedesc IntArray'.
    }
    ```

## Language updates

### New features

### Bug fixes

To view other bug fixes, see the [GitHub milestone for Swan Lake 2201.6.0](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FCompilerFE+milestone%3A2201.6.0+is%3Aclosed+label%3AType%2FBug).

## Runtime updates

### New features

#### New Runtime Java APIs

Introduced the `getInitMethod()` API in the `io.ballerina.runtime.api.types.ObjectType` class to get the method type of the initializer method of Ballerina objects.

### Improvements

#### Improvements in Runtime Java APIs

The following APIs in the `io.ballerina.runtime.api` package are deprecated and marked for removal in a future release.

- `Runtime.getCurrentRuntime()`
- `creators.ValueCreator.createDecimalValue(String, DecimalValueKind)`
- `creators.ValueCreator.createStreamingJsonValue(JsonDataSource)`
- `utils.JsonUtils.convertToJson(Object, List<TypeValuePair>)`
- `utils.StringUtils.getStringValue(Object, BLink)`
- `utils.StringUtils.getExpressionStringValue(Object, BLink)`
- `utils.StringUtils.parseExpressionStringValue(String, BLink)`
- `values.BDecimal.getValueKind()`
- `values.BFuture.getStrand()`
- `values.BObject.call(Strand, String, Object...)`
- `values.BObject.start(Strand, String, Object...)`
- `values.BRegexpValue.getRegExpDisjunction()`
- `values.BTypedesc.instantiate(Strand)`
- `values.BTypedesc.instantiate(Strand, BInitialValueEntry[])`

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.6.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.6.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed).

## Standard library updates

### New features

#### `graphql` package

- Added support for GraphQL field interceptors.
- Added support for GraphQL interceptor configurations.
- Added support to access subfields of a GraphQL field from the `graphql:Field` object.

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake 2201.6.0](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.6.0%22+label%3AType%2FBug).

## Code to Cloud updates

### New features

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.6.0 (Swan Lake)](https://github.com/ballerina-platform/module-ballerina-c2c/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+2201.6.0%22+label%3AType%2FBug).

## Developer tools updates

### New features

### Improvements

### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake 2201.6.0 of the repositories below.

- [Test Framework](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+label%3AArea%2FTestFramework+milestone%3A2201.6.0)
- [Language Server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FLanguageServer+milestone%3A2201.6.0+is%3Aclosed+label%3AType%2FBug)
- [OpenAPI](https://github.com/ballerina-platform/openapi-tools/issues?q=is%3Aclosed+milestone%3A%22Swan+Lake+2201.6.0%22+label%3AType%2FBug)

## Ballerina packages updates

### New features

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake 2201.6.0](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A2201.6.0+label%3AArea%2FProjectAPI).
