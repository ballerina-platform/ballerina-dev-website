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

- A bug that allowed assigning `anydata` value to a `readonly` `anydata` variable has been fixed.

    ```ballerina
    public function main() {
        anydata a = [];
        anydata & readonly b = a; // Compilation error now.
    }
    ```
  
- A bug that allowed including a `readonly` `service` object inside a non-`service` `readonly` class has been fixed.

    ```ballerina
    public type A readonly & service object {
        isolated remote function execute() returns int;
    };
  
    readonly client class B {
        *A;
  
        isolated remote function execute() returns int {
            return 2;
        }
    }
    ```
  
- Modified the behavior of the [runtime Java APIs to support the intersection type](/downloads/swan-lake-release-notes/swan-lake-2201.8.0#intersection-type-support-in-runtime-java-apis).

- `TypeSymbol` of an intersection type will now return an `IntersectionTypeSymbol`.

    ```ballerina
    // `TypeSymbol` of `A` will now be an `IntersectionTypeSymbol` instead of `StringTypeSymbol`.
    type A string & readonly;
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

#### New Runtime Java APIs

- Introduced the `getImpliedType()` API in the `io.ballerina.runtime.api.utils.TypeUtils` class to retrieve the referred type if a given type is a type-reference type or to retrieve the effective type if the given type is an intersection type.

    ```java
    Type getImpliedType(Type type)
    ```

### Improvements

#### Intersection type support in runtime Java APIs

The following runtime APIs are now modified to return an intersection type rather than returning the effective type of the intersection.

| **Runtime API**                                                           | **Java class**                                     |
|---------------------------------------------------------------------------|----------------------------------------------------|
| `getElementType`                                                          | `io.ballerina.runtime.api.types.ArrayType`         |
| `getDetailType`                                                           | `io.ballerina.runtime.api.types.ErrorType`         |
| `getFieldType`                                                            | `io.ballerina.runtime.api.types.Field`             |
| `getParameterTypes`                                                       | `io.ballerina.runtime.api.types.FunctionType`      |
| `getReturnType`                                                           | `io.ballerina.runtime.api.types.FunctionType`      |
| `getReturnParameterType`                                                  | `io.ballerina.runtime.api.types.FunctionType`      |
| `getRestType`                                                             | `io.ballerina.runtime.api.types.FunctionType`      |
| `getParameters` (The `Parameter.type` field can be an intersection type.) | `io.ballerina.runtime.api.types.FunctionType`      |
| `getConstituentTypes`                                                     | `io.ballerina.runtime.api.types.IntersectionType`  |
| `getConstrainedType`                                                      | `io.ballerina.runtime.api.types.MapType`           |
| `getParamValueType`                                                       | `io.ballerina.runtime.api.types.ParameterizedType` |
| `getRestFieldType`                                                        | `io.ballerina.runtime.api.types.RecordType`        |
| `getReferredType`                                                         | `io.ballerina.runtime.api.types.ReferenceType`     |
| `getConstrainedType`                                                      | `io.ballerina.runtime.api.types.StreamType`        |
| `getCompletionType`                                                       | `io.ballerina.runtime.api.types.StreamType`        |
| `getConstrainedType`                                                      | `io.ballerina.runtime.api.types.TableType`         |
| `getTupleTypes`                                                           | `io.ballerina.runtime.api.types.TupleType`         |
| `getRestType`                                                             | `io.ballerina.runtime.api.types.TupleType`         |
| `getConstraint`                                                           | `io.ballerina.runtime.api.types.TypedescType`      |
| `getMemberTypes`                                                          | `io.ballerina.runtime.api.types.UnionType`         |
| `getOriginalMemberTypes`                                                  | `io.ballerina.runtime.api.types.UnionType`         |
| `getElementType`                                                          | `io.ballerina.runtime.api.values.BArray`           |
| `getConstraintType`                                                       | `io.ballerina.runtime.api.values.BStream`          |
| `getCompletionType`                                                       | `io.ballerina.runtime.api.values.BStream`          |
| `getKeyType`                                                              | `io.ballerina.runtime.api.values.BTable`           |
| `getDescribingType`                                                       | `io.ballerina.runtime.api.values.BTypedesc`        |
| `getType`                                                                 | `io.ballerina.runtime.api.values.BValue`           |
| `getType`                                                                 | `io.ballerina.runtime.api.utils.TypeUtils`         |

For example, if an intersection type is defined in the following way,

```ballerina
type ReadonlyIntArray readonly & int[];

ReadonlyIntArray array = [1, 2, 3, 4];
```
the results of the runtime API calls will be as follows.

| **Runtime API call**                                   | **Result**                                                     |
|--------------------------------------------------------|----------------------------------------------------------------|
| `array.getType()`                                      | This will return an `IntersectionType` instead of `ArrayType`. |
| `getDescribingType()` on `ReadonlyIntArray` type       | This will return an `IntersectionType` instead of `ArrayType`. |
| `getImpliedType()` on received `IntersectionType` type | This will return an `ArrayType`.                               |      

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.8.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.8.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed).

## Standard library updates

### New features

### Deprecations

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.8.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.8.0%22+label%3AType%2FBug).

## Developer tools updates

### New features

#### CLI

- Added a new `bal tool` command to manage tools that extend the functionality of the CLI. Tools can be pulled from the Ballerina Central and are managed using the `bal tool` command. For more information, see [Tool commands](https://ballerina.io/learn/cli-documentation/cli-commands/#tool-commands).

### Improvements

### Bug fixes

To view bug fixes, see the GitHub milestone for 2201.8.0 (Swan Lake) of the repositories below.

- [Language Server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FLanguageServer+milestone%3A2201.8.0+is%3Aclosed+label%3AType%2FBug)
