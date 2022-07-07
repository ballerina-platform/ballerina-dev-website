---
layout: ballerina-left-nav-release-notes
title: 2201.1.1 (Swan Lake Update 1) 
permalink: /downloads/swan-lake-release-notes/2201.1.1/
active: 2201-1-1
redirect_from: 
    - /downloads/swan-lake-release-notes/2201-1-1-swan-lake/
    - /downloads/swan-lake-release-notes/2201-1-1-swan-lake
    - /downloads/swan-lake-release-notes/2201-1-1
    - /downloads/swan-lake-release-notes/
    - /downloads/swan-lake-release-notes
---

## Overview of Ballerina Swan Lake 2201.1.1

<em>Swan Lake 2201.1.1 is the first patch release of Ballerina 2201.1.0 (Swan Lake Update 1) and it includes a new set of bug fixes to the compiler, runtime, standard library, and developer tooling.</em> 

## Update Ballerina

**If you are already using Ballerina 2201.0.0 (Swan Lake)**, run either of the commands below to directly update to 2201.1.1 using the [Ballerina Update Tool](/learn/cli-documentation/update-tool/).

`bal dist update` (or `bal dist pull 2201.1.1`)

**If you are using a version below 2201.0.0 (Swan Lake)**, run the commands below to update to 2201.1.1.

1. Run `bal update` to get the latest version of the Update Tool.

2. Run `bal dist update` ( or `bal dist pull 2201.1.1`) to update your Ballerina version to 2201.1.1.

However, if you are using a version below 2201.0.0 (Swan Lake) and if you already ran `bal dist update` (or `bal dist pull 2201.1.1`) before `bal update`, see [Troubleshooting](/downloads/swan-lake-release-notes/2201-0-0-swan-lake/#troubleshooting) to recover your installation.

## Install Ballerina

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.

## Language updates

To view bug fixes, see the [GitHub milestone for Swan Lake 2201.1.1](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A%22Ballerina+2201.1.1%22+is%3Aclosed+label%3ATeam%2FCompilerFE).

## Developer tools updates

### New features

#### Language Server

- Implemented a publisher/subscriber model for internal components and extensions to be notified about various events like project updates
- Added new code actions to extract anonymous records into records and to generate undefined record types
- Introduced new code actions to generate getters and setters for class-level variables
- Added a new code action to make annotation declarations with the `source` attach point(s) constant

### Improvements

#### Language Server

- Improved hover feature support to display default values for defaultable parameters when hovering over a function
- Improved the `Create function` code action to add the `isolated` keyword to a function
- Improved the `Create function` code action to handle named arguments
- Improved the `Change return type` code action to add an optional error for check expressions
- Extended the `Type cast` code action to support several unsupported binary operations
- Improved the completion item sorting in `wait` actions and already-completed statements
- Updated the `resource function` snippet to add default values for the resource method and path
- Refactored the `CommonUtil` class by introducing several new utilities for the methods that are not used by only a single entity
- Modified the snippet labels for `record-type` definitions
- Improved the renaming support to avoid renaming on a compilation error
- Improved the `strand` annotation completion support in variable declarations
- Added completion support for already-imported modules as well as `spread` and `rest` fields in records

#### OpenAPI Tool
- Improved the service resource function return type generation by moving inline record generation to customised record.

### Bug Fixes

To view bug fixes, see the GitHub milestone for Swan Lake 2201.1.1 of the repositories below.

- [Language Server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+label%3ATeam%2FLanguageServer+milestone%3A%22Ballerina+2201.1.1%22+)
- [Debugger](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A%22Ballerina+2201.1.1%22+label%3AArea%2FDebugger+is%3Aclosed)
- [OpenAPI](https://github.com/ballerina-platform/openapi-tools/milestone/17?closed=1)

<!-- <style>.cGitButtonContainer, .cBallerinaTocContainer {display:none;}</style> -->
