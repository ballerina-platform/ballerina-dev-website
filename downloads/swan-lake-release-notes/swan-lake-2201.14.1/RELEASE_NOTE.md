---
layout: ballerina-left-nav-release-notes
title: Swan Lake Update 14 (2201.14.1)
permalink: /downloads/swan-lake-release-notes/2201.14.1/
active: 2201.14.1
---

## Overview of Ballerina Swan Lake Update 14 (2201.14.1)

<em>Swan Lake Update 14 (2201.14.1) is the first patch release of Ballerina 2201.14.0 (Swan Lake Update 14) and it includes a new set of bug fixes to the Ballerina library.</em>

## Update Ballerina

Run the command below to update your current Ballerina installation directly to 2201.14.1 by using the [Ballerina Update Tool](/learn/update-tool/).

```
$ bal dist pull 2201.14.1
```

## Install Ballerina

If you have not installed Ballerina, then, download the [installers](/downloads/#swanlake) to install.

## Ballerina library updates

### Bug fixes

The following Ballerina library packages are updated to versions that are aligned with Swan Lake Update 14 (2201.14.0) and Java 25.

- `ballerina/graphql` - `1.19.0`
- `ballerina/mcp` - `1.4.0`
    - Fixed the `KeyNotFound` panic that occurred when initializing an `mcp:StreamableHttpListener` or `mcp:Listener`.
    - Fixed an issue in which a defaultable tool parameter could not be omitted in a `tools/call` request ([#9143](https://github.com/ballerina-platform/ballerina-library/issues/9143)).
- `ballerina/websub` - `2.16.0`
- `ballerina/websubhub` - `1.17.0`
