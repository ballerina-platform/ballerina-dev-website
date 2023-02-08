---
layout: ballerina-left-nav-release-notes
title: 2201.4.0 (Swan Lake) 
permalink: /downloads/swan-lake-release-notes/2201.4.0/
active: 2201.2.2
redirect_from: 
    - /downloads/swan-lake-release-notes/2201.4.0
    - /downloads/swan-lake-release-notes/2201.4.0/
    - /downloads/swan-lake-release-notes/2201.4.0-swan-lake/
    - /downloads/swan-lake-release-notes/2201.4.0-swan-lake
    - /downloads/swan-lake-release-notes/
    - /downloads/swan-lake-release-notes
---

## Overview of Ballerina Swan Lake 2201.4.0

<em>2201.4.0 (Swan Lake) is the fourth major release of 2022, and it includes a new set of features and significant improvements to the compiler, runtime, standard library, and developer tooling. It is based on the 2022R5 version of the Language Specification.</em> 

## Update Ballerina

**If you are already using Ballerina 2201.0.0 (Swan Lake)**, run either of the commands below to directly update to 2201.4.0 using the [Ballerina Update Tool](/learn/cli-documentation/update-tool/).

`bal dist update` (or `bal dist pull 2201.4.0`)

**If you are using a version below 2201.0.0 (Swan Lake)**, run the commands below to update to 2201.4.0.

1. Run `bal update` to get the latest version of the Update Tool.

2. Run `bal dist update` ( or `bal dist pull 2201.4.0`) to update your Ballerina version to 2201.4.0.

However, if you are using a version below 2201.0.0 (Swan Lake) and if you already ran `bal dist update` (or `bal dist pull 2201.4.0`) before `bal update`, see [Troubleshooting](/downloads/swan-lake-release-notes/swan-lake-2201.0.0#troubleshooting) to recover your installation.

## Install Ballerina

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.

## Migrate from Swan Lake Beta releases
>**Info:** If you have been using Swan Lake Beta releases, delete the `Dependencies.toml` files in your Ballerina packages when migrating to Ballerina 2201.4.0 (Swan Lake). 

A few backward-incompatible changes have been introduced during the Swan Lake Beta program, and thereby, some of your existing packages may not compile with Ballerina 2201.4.0 (Swan Lake). Therefore, you need to delete the `Dependencies.toml` file to force the dependency resolver to use the latest versions of your dependencies. 

## Language updates

### New features

#### Tuple member annotations 

- Added support for annotating tuple members.
- Tuple members can be annotated with `field` annotations.

```
annotation annot on field;

type T [int, @annot string];
```

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake 2201.4.0](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FCompilerFE+milestone%3A2201.4.0+is%3Aclosed+label%3AType%2FBug).

## Runtime updates

### New features

#### Get the strand dump during `bal test`

When running the tests in a Ballerina package or a file using the `bal test` command, the strand dump can be obtained by sending the `SIGTRAP` signal to that process.

### Improvements

#### Improvements in runtime Java APIs

##### Get the user-defined type name on Singleton types

Calling `getName()` on the runtime class `FiniteType` will return the user-defined type name if it is available.

For example, if a constant is defined in the following way, the `getName()` method on the `FiniteType` will return the string `"OPEN"`.

```ballerina
const OPEN = "open";
```

##### Type-reference type support in runtime Java APIs

The following runtime APIs are now modified to return the type-reference type instances according to the type definitions.


| **Runtime API**                                                          | **Java class**                                     |
|--------------------------------------------------------------------------|----------------------------------------------------|
| `getElementType`                                                         | `io.ballerina.runtime.api.types.ArrayType`         |
| `getDetailType`                                                          | `io.ballerina.runtime.api.types.ErrorType`         |
| `getFieldType`                                                           | `io.ballerina.runtime.api.types.Field`             |
| `getParameterTypes`                                                      | `io.ballerina.runtime.api.types.FunctionType`      |
| `getReturnType`                                                          | `io.ballerina.runtime.api.types.FunctionType`      |
| `getReturnParameterType`                                                 | `io.ballerina.runtime.api.types.FunctionType`      |
| `getRestType`                                                            | `io.ballerina.runtime.api.types.FunctionType`      |
| `getParameters` The `Parameter.type` field can be a type-reference type. | `io.ballerina.runtime.api.types.FunctionType`      |
| `getConstituentTypes`                                                    | `io.ballerina.runtime.api.types.IntersectionType`  |
| `getEffectiveType`                                                       | `io.ballerina.runtime.api.types.IntersectionType`  |
| `getConstrainedType`                                                     | `io.ballerina.runtime.api.types.MapType`           |
| `getParamValueType`                                                      | `io.ballerina.runtime.api.types.ParameterizedType` |
| `getRestFieldType`                                                       | `io.ballerina.runtime.api.types.RecordType`        |
| `getReferredType`                                                        | `io.ballerina.runtime.api.types.ReferenceType`     |
| `getConstrainedType`                                                     | `io.ballerina.runtime.api.types.StreamType`        |
| `getCompletionType`                                                      | `io.ballerina.runtime.api.types.StreamType`        |
| `getConstrainedType`                                                     | `io.ballerina.runtime.api.types.TableType`         |
| `getTupleTypes`                                                          | `io.ballerina.runtime.api.types.TupleType`         |
| `getRestType`                                                            | `io.ballerina.runtime.api.types.TupleType`         |
| `getConstraint`                                                          | `io.ballerina.runtime.api.types.TypedescType`      |
| `getMemberTypes`                                                         | `io.ballerina.runtime.api.types.UnionType`         |
| `getOriginalMemberTypes`                                                 | `io.ballerina.runtime.api.types.UnionType`         |
| `getElementType`                                                         | `io.ballerina.runtime.api.values.BArray`           |
| `getConstraintType`                                                      | `io.ballerina.runtime.api.values.BStream`          |
| `getCompletionType`                                                      | `io.ballerina.runtime.api.values.BStream`          |
| `getKeyType`                                                             | `io.ballerina.runtime.api.values.BTable`           |
| `getDescribingType`                                                      | `io.ballerina.runtime.api.values.BTypedesc`        |
| `getType`                                                                | `io.ballerina.runtime.api.values.BValue`           |
| `getType`                                                                | `io.ballerina.runtime.api.utils.TypeUtils`         |

For example, if the type-reference types are defined in the following way,

```ballerina
type Integer int;

type IntegerArray Integer[];

IntegerArray arr = [1, 2, 3, 4];
```
the results of the runtime API calls will be as follows.

| **Runtime API call**                            | **Result**                                                       |
|-------------------------------------------------|------------------------------------------------------------------|
| `arr.getType()`                                 | This will return a `ReferenceType` with the name `IntegerArray`. |
| `getReferredType()` on `IntegerArray`           | This will return an `ArrayType` with name `IntegerArray`.        |
| `getElementType()` on `IntegerArray` array type | This will return a `ReferenceType` with the name `Integer`.      |

<br>

> **Note:**
> The definition of the `getType` API in the `BObject` runtime class is now modified to the following.
> ```java
>  Type getType();
> ```

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.4.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.4.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed).

## Standard library updates

### New features

##### `constraint` package

- Introduced the `@pattern` constraint on string types
- Added constraint validation support for `readonly` types

##### `oauth2` package

- Allow the use of inferred values for refreshing tokens through the password grant type
- Allow the use of string values for the `scopes` field in the client grant configuration 

##### `graphql` package

- Added support for multiplexing in GraphQL subscriptions
- Added support to access the GraphQL field information from resolvers

##### `nats` package

- Added support for the new NATS JetStream client with publishing and subscribing functionalities

### Improvements

##### `graphql` package

- Removed the limitation on the GraphQL `context` object parameter order

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake 2201.4.0](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.4.0%22+label%3AType%2FBug).

### Code to Cloud updates

### New features

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.4.0 (Swan Lake)](https://github.com/ballerina-platform/module-ballerina-c2c/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+2201.4.0%22+label%3AType%2FBug).

## Developer tools updates

### New features

#### Language Server

#### GraphQL Tool

- Added support for GraphQL SDL schema file generation

### Improvements

#### OpenAPI Tool

### Bug Fixes

To view bug fixes, see the GitHub milestone for Swan Lake 2201.4.0 of the repositories below.

- [Project API](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3AArea%2FProjectAPI+is%3Aclosed+milestone%3A2201.4.0+label%3AType%2FBug).
- [Language Server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FLanguageServer+milestone%3A2201.4.0+is%3Aclosed)
- [Debugger](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.4.0+is%3Aclosed+label%3AArea%2FDebugger)
- [OpenAPI Tool](https://github.com/ballerina-platform/openapi-tools/issues?q=is%3Aissue+label%3AType%2FBug+milestone%3A%22Swan+Lake+2201.4.0%22+is%3Aclosed)

## Ballerina packages updates

## Breaking changes

