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

## Language updates

### New features

### Bug fixes

To view other bug fixes, see the [GitHub milestone for Swan Lake 2201.6.0](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FCompilerFE+milestone%3A2201.6.0+is%3Aclosed+label%3AType%2FBug).

## Runtime updates

### New features

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.6.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.6.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed).

## Standard library updates

### New features

#### `graphql` package

- Added support for GraphQL field interceptors.
- Added support for GraphQL interceptor configurations.
- Added support to access subfields of a GraphQL field from the `graphql:Field` object.

#### `persist` package

- Added support for the `in-memory` data store.
- Added support for the `Google Sheets` data store. The support for Google Sheets data store is currently an experimental feature, and its behavior may be subject to change in future releases.
- Added support for defining enums and adding `enum` fields to the data model.

### Improvements

#### `persist` package

- Renamed the error types to the following:
    - `InvalidKeyError` to `NotFoundError`
    - `DuplicateKeyError` to `AlreadyExistsError`
    - `ForeignKeyConstraintViolationError` to `ForeignKeyViolationError`
- Removed the `FieldDoesNotExistError` error type as the `NotFoundError` error type can be used instead.
- Marked the generated client object as `isolated`.
- Added support for transactions in the `MySQL` data store.

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake 2201.6.0](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.6.0%22+label%3AType%2FBug).

## Code to Cloud updates

### New features

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.6.0 (Swan Lake)](https://github.com/ballerina-platform/module-ballerina-c2c/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+2201.6.0%22+label%3AType%2FBug).

## Developer tools updates

### New features

#### Persist Tool

- Added support for the `In-Memory` data store. Set as the default data store.
- Added support for the `Google Sheets` data store. The support for Google Sheets data store is currently an experimental feature, and its behavior may be subject to change in future releases.
- Added `persist migrate` command to migration scripts for data model changes in the `mysql` data store. The support for migrations is currently an experimental feature, and its behavior may be subject to change in future releases.

### Improvements

#### Persist Tool
- Added support for additional DB configurations in MySQL generated client objects.
- Changed the Ballerina `byte[]` type mapping to `LONGBLOB` in MySQL generated script file.

#### Support for providing paths with `bal new`

Added support to provide a directory path with `bal new` to create a package in a specific directory. E.g., `bal new <package-path>`. 

#### Deprecation of the `bal init` command 

`bal init` is deprecated and will be removed in a future version. `bal new .` can be used instead.

### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake 2201.6.0 of the repositories below.

- [Test Framework](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+label%3AArea%2FTestFramework+milestone%3A2201.6.0)
- [Language Server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FLanguageServer+milestone%3A2201.6.0+is%3Aclosed+label%3AType%2FBug)
- [OpenAPI](https://github.com/ballerina-platform/openapi-tools/issues?q=is%3Aclosed+milestone%3A%22Swan+Lake+2201.6.0%22+label%3AType%2FBug)

## Ballerina packages updates

### New features

#### Language Server

- Added completions for the `group by` clause.
- Added inlay hint support for function call expressions and method call expressions to provide information about parameters.

### Improvements

#### Language Server

- Removed service template initialization from the lightweight mode.
- Improved the completion support and signature help for client resource access actions.
- Improved the main function completion item.
- improved completions in the named argument context.

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake 2201.6.0](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A2201.6.0+label%3AArea%2FProjectAPI).
