---
layout: ballerina-left-nav-release-notes
title: 2201.14.0 (Swan Lake) 
permalink: /downloads/swan-lake-release-notes/2201.14.0/
active: 2201.14.0
redirect_from: 
    - /downloads/swan-lake-release-notes/2201.14.0
    - /downloads/swan-lake-release-notes/2201.14.0-swan-lake/
    - /downloads/swan-lake-release-notes/2201.14.0-swan-lake
    - /downloads/swan-lake-release-notes/
    - /downloads/swan-lake-release-notes
---

## Overview of Ballerina Swan Lake Update 14 (2201.14.0)

<em> Swan Lake Update 14 (2201.14.0) is the fourteenth update release of Ballerina Swan Lake, and it includes a new set of features and significant improvements to the compiler, runtime, Ballerina library, and developer tooling. It is based on the 2024R1 version of the Language Specification.</em>

## Update Ballerina

Update your current Ballerina installation directly to 2201.14.0 using the [Ballerina Update Tool](/learn/update-tool/) as follows.

1. Run `bal update` to get the latest version of the Update Tool.
2. Run `bal dist update` to update to this latest distribution.

## Install Ballerina

If you have not installed Ballerina, download the [installers](/downloads/#swanlake) to install.

## Runtime updates

### Improvements

#### Java 25 support

The jBallerina runtime is now upgraded to support Java 25 LTS, the latest long-term support release of the Java SE platform, and the Ballerina distribution now ships with a Java 25 runtime.

## Ballerina library updates

### Improvements

#### Netty 4.2 support

All packages under the `ballerina` and `ballerinax` organizations are now upgraded to use Netty 4.2.

>**Note:** Packages from other organizations that still depend on Netty 4.1 may fail with unexpected errors when both Netty versions are on the classpath. Such packages should be updated to use Netty 4.2.

## Ballerina packages updates

### New features

#### Stable release of the `workflow` package

A stable version of the `ballerina/workflow` package has been released. The `ballerina/workflow` package lets you write long-running processes as plain Ballerina functions and executes them durably: the progress of the process is recorded step by step, so a crashed or redeployed program picks up exactly where it left off instead of starting over.

## Bug fixes

To view all the bug fixes related to the compiler, runtime, and developer tools, see the [GitHub milestone for Swan Lake Update 14 (2201.14.0) for Ballerina platform](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue%20state%3Aclosed%20milestone%3A2201.14.0%20label%3AType%2FBug).

To view all the bug fixes related to the Ballerina library, see the [GitHub milestone for Swan Lake Update 14 (2201.14.0) for Ballerina Library](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.14.0%22+label%3AType%2FBug).
