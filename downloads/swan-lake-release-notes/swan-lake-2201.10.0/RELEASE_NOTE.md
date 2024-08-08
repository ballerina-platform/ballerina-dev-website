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

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 10 (2201.10.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FCompilerFE+milestone%3A2201.10.0+is%3Aclosed+label%3AType%2FBug).

## Runtime updates

### Improvements

#### Added support for the `shift`, `unshift`, `pop`, and `remove` functions with tuples
The runtime now supports the `shift`, `unshift`, `pop`, and `remove` operations on tuples similar to arrays, as long as they do not violate inherent type or mutability constraints.

The following are now allowed.
```ballerina
[int, int...] tuple1 = [1, 2];
int val1 = tuple1.shift();          // 1

[string, string...] tuple2 = ["hello"];
tuple2.unshift("world", "cat");     // ["hello", "world", "cat"]

[int, string, int...] tuple3 = [1, "hello", 4];
var val3 = tuple3.pop();            // 4

[int,string, float...] tuple4 = [7, "hello", 67.5, 89.7];
var val4 = tuple4.remove(2);        // 67.5
```

The following examples will cause errors.
```ballerina
[int, string...] tuple1 = [1, "hello"];
int val1 = tuple1.shift();          // inherent type violation

[int, int] tuple2 = [1, 2];
int val2 = tuple2.shift();          // immutable tuple

[string, string...] tuple3 = ["hello"];
tuple3.unshift(154);                // inherent type violation

[int, string, int] tuple4 = [1, "hello", 4];
var val4 = tuple4.pop();            // immutable tuple

[int,string, float...] tuple5 = [7, "hello", 67.5, 89.7];
var val5 = tuple5.remove(1);        // inherent type violation
```

### New runtime Java APIs

#### A runtime Java API to check if remote management is enabled

A new runtime Java API is added to check if remote management is enabled, via a build option.

```java
boolean isRemoteEnabled();
```

The above API can be called via a Ballerina environment instance as follows.

```java
import io.ballerina.runtime.api.Repository;
import io.ballerina.runtime.api.Environment;

Repository repository = env.getRepository();
boolean isRemoteEnabled  = repository.isRemoteEnabled();
```

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 10 (2201.10.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.10.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed).

## Ballerina library updates

### Deprecations

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 10 (2201.10.0)](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.10.0%22+label%3AType%2FBug).

## Developer tools updates

### New features

#### Language Server

#### CLI

#### OpenAPI tool

### Improvements

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
