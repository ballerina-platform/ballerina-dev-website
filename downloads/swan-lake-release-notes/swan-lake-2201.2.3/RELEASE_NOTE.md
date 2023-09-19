---
layout: ballerina-left-nav-release-notes
title: 2201.2.3 (Swan Lake) 
permalink: /downloads/swan-lake-release-notes/2201.2.3/
active: 2201.2.3
redirect_from: 
    - /downloads/swan-lake-release-notes/2201.2.3
    - /downloads/swan-lake-release-notes/2201.2.3/
    - /downloads/swan-lake-release-notes/2201.2.3-swan-lake/
    - /downloads/swan-lake-release-notes/2201.2.3-swan-lake
    - /downloads/swan-lake-release-notes/
    - /downloads/swan-lake-release-notes
---

## Overview of Ballerina Swan Lake 2201.2.3

<em>Swan Lake 2201.2.3 is the third patch release of Ballerina 2201.2.0 (Swan Lake Update 2) and it includes a new set of bug fixes to the language, language server, and developer tooling.</em> 

## Update Ballerina

**If you are already using Ballerina 2201.0.0 (Swan Lake)**, run either of the commands below to directly update to 2201.2.3 using the [Ballerina Update Tool](/learn/update-tool/).

`bal dist update` (or `bal dist pull 2201.2.3`)

**If you are using a version below 2201.0.0 (Swan Lake)**, run the commands below to update to 2201.2.3.

1. Run `bal update` to get the latest version of the Update Tool.

2. Run `bal dist update` ( or `bal dist pull 2201.2.3`) to update your Ballerina version to 2201.2.3.

However, if you are using a version below 2201.0.0 (Swan Lake) and if you already ran `bal dist update` (or `bal dist pull 2201.2.3`) before `bal update`, see [Troubleshooting](/downloads/swan-lake-release-notes/swan-lake-2201.0.0#troubleshooting) to recover your installation.

## Install Ballerina

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.

## Language updates

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.2.3 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FCompilerFE+milestone%3A2201.2.3+is%3Aclosed+label%3AType%2FBug).

## Standard library updates

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.2.3 (Swan Lake)](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%22Swan+Lake+2201.2.3%22+label%3AType%2FBug).

## Developer tools updates

### New features

#### Language Server

* Added a new quick-fix code action to fill in the missing required fields of a mapping constructor
* Added a new module-level completion item to generate an expression-bodied function snippet

### Improvements

#### OpenAPI Tool

Improved the OpenAPI client configuration handling functionality. Now, the record, which contains the information for client initialization is changed from the `ClientConfig` to `ConnectionConfig`. A few of the defaultable configuration fields, which were in the `ClientConfig` have been changed to the optional fields in the `ConnectionConfig` record. Due to this change, the `ConnectionConfig` record can be defined as a configurable variable.

>**Note:** Due to the above new configuration changes, it is recommended to republish the client connectors that you have already published to Ballerina Central using this release.

### Bug Fixes

To view bug fixes, see the GitHub milestone for 2201.2.3 (Swan Lake) of the repositories below.

- [Project API](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3AArea%2FProjectAPI+is%3Aclosed+milestone%3A2201.2.3+label%3AType%2FBug).
- [Language Server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FLanguageServer+milestone%3A2201.2.3+is%3Aclosed)
- [Debugger](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.2.3+is%3Aclosed+label%3AArea%2FDebugger)
- [OpenAPI Tool](https://github.com/ballerina-platform/openapi-tools/issues?q=is%3Aissue+label%3AType%2FBug+milestone%3A%22Swan+Lake+2201.2.3%22+is%3Aclosed)