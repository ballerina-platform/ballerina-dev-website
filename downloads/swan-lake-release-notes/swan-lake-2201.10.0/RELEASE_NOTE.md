---
layout: ballerina-left-nav-release-notes
title: 2201.10.0 (Swan Lake) 
permalink: /downloads/swan-lake-release-notes/2201.10.0/
active: 2201.10.0
redirect_from: 
    - /downloads/swan-lake-release-notes/2201.10.0
    - /downloads/swan-lake-release-notes/2201.10.0-swan-lake/
    - /downloads/swan-lake-release-notes/2201.10.0-swan-lake
    - /downloads/swan-lake-release-notes/
    - /downloads/swan-lake-release-notes
---

## Overview of Ballerina Swan Lake Update 10 (2201.10.0)

<em> Swan Lake Update 10 (2201.10.0) is the tenth update release of Ballerina Swan Lake, and it includes a new set of features and significant improvements to the compiler, runtime, Ballerina library, and developer tooling. It is based on the 2024R1 version of the Language Specification.</em> 

## Update Ballerina

Update your current Ballerina installation directly to 2201.10.0 using the [Ballerina Update Tool](/learn/update-tool/) as follows.

1. Run `bal update` to get the latest version of the Update Tool.
2. Run `bal dist update` to update to this latest distribution.

## Install Ballerina

If you have not installed Ballerina, download the [installers](/downloads/#swanlake) to install.

## Language updates

### New features

#### `http` package

- Introduced support for server-sent events.
- Introduced service contract type.
- Introduced default status code response record type.

### Improvements

#### `http` package

- Added connection eviction support for the HTTP listener.
- Enhanced the configurability of Ballerina access logging by introducing multiple configuration options.

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 10 (2201.10.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FCompilerFE+milestone%3A2201.10.0+is%3Aclosed+label%3AType%2FBug).

## Runtime updates

### New features

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 10 (2201.10.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.10.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed).

## Ballerina library updates

### Deprecations

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 10 (2201.10.0)](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.10.0%22+label%3AType%2FBug).

## Developer tools updates

### New features

#### Language Server

- Introduced the `Convert to configurable` code action to convert a module level variable into a configurable variable.
- Introduced the `Extract to configurable` code action to extract expressions or function arguments into configurable variables.
- Introduced the `Add to Config.toml` code action to add configurable variables in to the Config.toml file.

#### CLI

#### OpenAPI tool

### Improvements

- Added navigation and reference finding support for init functions.

#### Language Server

### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake Update 10 (2201.10.0) of the repositories below.

- [Language server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FLanguageServer+milestone%3A2201.10.0+is%3Aclosed+label%3AType%2FBug+)
- [OpenAPI](https://github.com/ballerina-platform/openapi-tools/issues?q=is%3Aissue+label%3AType%2FBug+milestone%3A%22Swan+Lake+2201.10.0%22+is%3Aclosed)

## Ballerina packages updates

### New features

### Improvements

### Bug fixes

## Backward-incompatible changes
