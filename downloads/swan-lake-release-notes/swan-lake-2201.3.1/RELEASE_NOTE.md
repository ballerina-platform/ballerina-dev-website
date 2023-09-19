---
layout: ballerina-left-nav-release-notes
title: 2201.3.1 (Swan Lake) 
permalink: /downloads/swan-lake-release-notes/2201-3-1/
active: 2201-3-1
redirect_from: 
    - /downloads/swan-lake-release-notes/2201-3-1
    - /downloads/swan-lake-release-notes/2201.3.1/
    - /downloads/swan-lake-release-notes/2201-3-1-swan-lake/
    - /downloads/swan-lake-release-notes/2201-3-1-swan-lake
---

## Overview of Ballerina Swan Lake 2201.3.1

<em>Swan Lake 2201.3.1 is the first patch release of Ballerina 2201.3.0 (Swan Lake Update 3) and it includes a new set of bug fixes to the language, language server, and developer tooling.</em>

## Update Ballerina

**If you are already using Ballerina 2201.0.0 (Swan Lake)**, run either of the commands below to directly update to 2201.3.1 using the [Ballerina Update Tool](/learn/update-tool/).

`bal dist update` (or `bal dist pull 2201.3.1`)

**If you are using a version below 2201.0.0 (Swan Lake)**, run the commands below to update to 2201.3.1.

1. Run `bal update` to get the latest version of the Update Tool.

2. Run `bal dist update` ( or `bal dist pull 2201.3.1`) to update your Ballerina version to 2201.3.1.

However, if you are using a version below 2201.0.0 (Swan Lake) and if you already ran `bal dist update` (or `bal dist pull 2201.3.1`) before `bal update`, see [Troubleshooting](/downloads/swan-lake-release-notes/swan-lake-2201.0.0#troubleshooting) to recover your installation.

## Install Ballerina

If you have not installed Ballerina, then, download the [installers](/downloads/#swanlake) to install.

## Language updates

### Bug fixes

- [JSON to Record converter does not generate parent record with user defined name](https://github.com/ballerina-platform/ballerina-lang/issues/38583)
- [Config-schema is generated with unused configurables](https://github.com/ballerina-platform/ballerina-lang/issues/38518)
- [Config schema generator maps byte values to float instead of integer](https://github.com/ballerina-platform/ballerina-lang/issues/36270)

## Standard library updates

### Bug fixes

- [Fix trivy vulnerability scan failure in email module](https://github.com/ballerina-platform/ballerina-standard-library/issues/3850)
- [HTTP trace logs are not working with a mysql client](https://github.com/ballerina-platform/ballerina-standard-library/issues/3763)
- [Binary payload retrieved from the http:Request has different content-length than the original payload](https://github.com/ballerina-platform/ballerina-standard-library/issues/3662)

## Developer tools updates

### New features

- [New LS extension endpoint for fetching type information of parameters and the return type desc of a given function](https://github.com/ballerina-platform/ballerina-lang/issues/38612)

### Improvements

- [Implement a compiler plugin to generate component model](https://github.com/ballerina-platform/ballerina-lang/issues/38793)

### Bug fixes

- [JSON to Record converter does not generate parent record with user defined name](https://github.com/ballerina-platform/ballerina-lang/issues/38583)
- [Config-schema is generated with unused configurables](https://github.com/ballerina-platform/ballerina-lang/issues/38518)
- [Config schema generator maps byte values to float instead of integer](https://github.com/ballerina-platform/ballerina-lang/issues/36270)
