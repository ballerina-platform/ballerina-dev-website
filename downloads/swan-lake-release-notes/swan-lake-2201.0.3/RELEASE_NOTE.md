---
layout: ballerina-left-nav-release-notes
title: 2201.0.3 (Swan Lake) 
permalink: /downloads/swan-lake-release-notes/2201-0-3/
active: 2201-0-3
redirect_from: 
    - /downloads/swan-lake-release-notes/2201-0-3
    - /downloads/swan-lake-release-notes/2201.0.3/
    - /downloads/swan-lake-release-notes/2201-0-3-swan-lake/
    - /downloads/swan-lake-release-notes/2201-0-3-swan-lake
---

## Overview of Ballerina Swan Lake 2201.0.3

<em>Swan Lake 2201.0.3 is the third patch release of Ballerina 2201.0.0 (Swan Lake) and it includes a new set of bug fixes to the compiler, runtime, standard library, and developer tooling.</em> 

## Updating Ballerina

**If you are already using Ballerina 2201.0.0 (Swan Lake)**, run either of the commands below to directly update to 2201.0.3 (Swan Lake) using the [Ballerina Update Tool](/learn/cli-documentation/update-tool/).

`bal dist update` (or `bal dist pull 2201.0.3`)

**If you are using a version below 2201.0.0 (Swan Lake)**, run the commands below to update to 2201.0.3 (Swan Lake).

1. Run `bal update` to get the latest version of the Update Tool.

2. Run `bal dist update` ( or `bal dist pull 2201.0.3`) to update your Ballerina version to 2201.0.3 (Swan Lake).

However, if you are using a version below 2201.0.0 (Swan Lake) and if you already ran `bal dist update` (or `bal dist pull 2201.0.3`) before `bal update`, see [Troubleshooting](/downloads/swan-lake-release-notes/2201-0-0-swan-lake/#troubleshooting) to recover your installation.

## Installing Ballerina

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.

## Language updates

To view bug fixes, see the [GitHub milestone for Swan Lake 2201.0.3](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+label%3ATeam%2FCompilerFE+milestone%3A%222201.0.3%22).

## Runtime updates

To view bug fixes, see the [GitHub milestone for Swan Lake 2201.0.3](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+label%3ATeam%2FjBallerina+milestone%3A%222201.0.3%22+).

## Standard library updates

To view bug fixes, see the [GitHub milestone for Swan Lake 2201.0.3](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%22Swan+Lake+2201.0.3%22+label%3AType%2FBug).

## Developer tools updates

### Improvements

#### Debugger

Added rutime breakpoint verification support. With this improvement, now, the debugger will verify all the valid breakpoint locations in the current debug source. Therefore, all the breakpoints that are set on non-executable lines of code (i.e., Ballerina line comments, documentation , blank lines, declarations, etc.) will be marked as `unverified` in the editor.

### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake 2201.0.3 of the repositories below.

- [Language Server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+label%3ATeam%2FLanguageServer+milestone%3A%222201.0.3%22+label%3AType%2FBug+)
- [Debugger](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3AType%2FBug+label%3AArea%2FDebugger+is%3Aclosed+milestone%3A2201.0.3)
- [OpenAPI](https://github.com/ballerina-platform/openapi-tools/milestone/15?closed=1)

<!-- <style>.cGitButtonContainer, .cBallerinaTocContainer {display:none;}</style> -->
