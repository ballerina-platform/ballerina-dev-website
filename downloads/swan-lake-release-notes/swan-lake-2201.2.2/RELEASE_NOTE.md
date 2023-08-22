---
layout: ballerina-left-nav-release-notes
title: 2201.2.2 (Swan Lake) 
permalink: /downloads/swan-lake-release-notes/2201.2.2/
active: 2201.2.2
redirect_from: 
    - /downloads/swan-lake-release-notes/2201.2.2
    - /downloads/swan-lake-release-notes/2201.2.2/
    - /downloads/swan-lake-release-notes/2201.2.2-swan-lake/
    - /downloads/swan-lake-release-notes/2201.2.2-swan-lake
    - /downloads/swan-lake-release-notes/
    - /downloads/swan-lake-release-notes
---

## Overview of Ballerina Swan Lake 2201.2.2

<em>Swan Lake 2201.2.2 is the second patch release of Ballerina 2201.2.0 (Swan Lake Update 2) and it includes a new set of bug fixes to the language, language server, and developer tooling.</em> 

## Update Ballerina

**If you are already using Ballerina 2201.0.0 (Swan Lake)**, run either of the commands below to directly update to 2201.2.2 using the [Ballerina Update Tool](/learn/update-tool/).

`bal dist update` (or `bal dist pull 2201.2.2`)

**If you are using a version below 2201.0.0 (Swan Lake)**, run the commands below to update to 2201.2.2.

1. Run `bal update` to get the latest version of the Update Tool.

2. Run `bal dist update` ( or `bal dist pull 2201.2.2`) to update your Ballerina version to 2201.2.2.

However, if you are using a version below 2201.0.0 (Swan Lake) and if you already ran `bal dist update` (or `bal dist pull 2201.2.2`) before `bal update`, see [Troubleshooting](/downloads/swan-lake-release-notes/swan-lake-2201.0.0#troubleshooting) to recover your installation.

## Install Ballerina

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.

## Language updates

To view bug fixes, see the [GitHub milestone for 2201.2.2 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FCompilerFE+milestone%3A2201.2.2+is%3Aclosed)

## Developer tools updates

### New features

#### Language Server

- Introduced new refactor extract code actions to extract the below.
    - a constant expression to a constant
    - an expression to a local variable
    - an expression or set of statements to a function
- Improved the `Create variable` code action to provide a rename popup after applying it
- Added a new code action to convert an array to array mapping into a query expression
- Introduced a new API to load a project into the Workspace Manager

### Improvements

#### Language Server

- Improved code action support for optional fields, union typed fields, and query expressions
- Improved the LS Package Loader to update the package map after pulling a module
- Improved the `Import module` code action to change the module prefix when the module is already imported
- Improved the sorting in the method call expression, limit expression, error constructor, and positional argument
- Refactored the usage of commands in code actions with a code action resolve request
- Improved the `Compiler plugin` code action to prevent applying invalid text edits

### Bug Fixes

To view bug fixes, see the GitHub milestone for 2201.2.2 (Swan Lake) of the repositories below.

- [Language Server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FLanguageServer+milestone%3A2201.2.2+is%3Aclosed)
- [Debugger](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.2.2+is%3Aclosed+label%3AArea%2FDebugger)