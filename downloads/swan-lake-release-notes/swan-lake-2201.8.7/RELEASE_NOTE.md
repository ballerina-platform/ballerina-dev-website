---
layout: ballerina-left-nav-release-notes
title: Swan Lake Update 8 (2201.8.7) 
permalink: /downloads/swan-lake-release-notes/2201.8.7/
active: 2201.8.7
---

## Overview of Ballerina Swan Lake Update 8 (2201.8.7)

<em>Swan Lake Update 8 (2201.8.7) is the seventh patch release of Ballerina 2201.8.0 (Swan Lake Update 8) and it includes a new set of bug fixes to the language.</em>

## Update Ballerina

Run the command below to update your current Ballerina installation directly to 2201.8.7 by using the [Ballerina Update Tool](/learn/update-tool/).

```
$ bal dist pull 2201.8.7
```

## Install Ballerina

If you have not installed Ballerina, then, download the [installers](/downloads/#swanlake) to install.

## Language updates

### Improvements

Introduced timeout configurations to prevent premature commits of long-running transactions. The following configurations related to transactions can be added to the `Config.toml` file.

```toml
[ballerina.lang.transaction]
transactionAutoCommitTimeout=120
transactionCleanupTimeout=600
```

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 8 (2201.8.7)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3AType%2FBug+is%3Aclosed+milestone%3A2201.8.7).

## Developer tools updates

### Improvements

Improved the performance of the VSCode editor.

## Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake Update 8 (2201.8.7) of the repositories below.
- [Debugger](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.8.7+is%3Aclosed+label%3AArea%2FDebugger+label%3AType%2FBug)
- [Project API](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.8.7+is%3Aclosed+label%3AArea%2FProjectAPI+label%3AType%2FBug)
