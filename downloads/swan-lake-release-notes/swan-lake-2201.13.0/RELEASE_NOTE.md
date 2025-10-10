---
layout: ballerina-left-nav-release-notes
title: 2201.13.0 (Swan Lake) 
permalink: /downloads/swan-lake-release-notes/2201.13.0/
active: 2201.13.0
redirect_from: 
    - /downloads/swan-lake-release-notes/2201.13.0
    - /downloads/swan-lake-release-notes/2201.13.0-swan-lake/
    - /downloads/swan-lake-release-notes/2201.13.0-swan-lake
    - /downloads/swan-lake-release-notes/
    - /downloads/swan-lake-release-notes
---

## Overview of Ballerina Swan Lake Update 13 (2201.13.0)

<em> Swan Lake Update 13 (2201.13.0) is the thirteenth update release of Ballerina Swan Lake, and it includes a new set of features and significant improvements to the compiler, runtime, Ballerina library, and developer tooling. It is based on the 2024R1 version of the Language Specification.</em>

## Update Ballerina

Update your current Ballerina installation directly to 2201.13.0 using the [Ballerina Update Tool](/learn/update-tool/) as follows.

1. Run `bal update` to get the latest version of the Update Tool.
2. Run `bal dist update` to update to this latest distribution.

## Install Ballerina

If you have not installed Ballerina, download the [installers](/downloads/#swanlake) to install.

## Language updates

### New features

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 13 (2201.13.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FCompilerFE+milestone%3A2201.13.0+is%3Aclosed+label%3AType%2FBug).

## Runtime updates

### New features

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 13 (2201.13.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.13.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed).

## Ballerina library updates

### New features

#### `time` package

- Added support for add/subtract specified durations to/from time values.

    ```ballerina
    import ballerina/io;
    import ballerina/time;

    public function main() {
        time:Civil civil = check time:civilFromString("2025-04-13T17:35:30.120Z");
        civil = check time:civilAddDuration(civil, {years: 1, months: 3, days: 5, hours: 6, minutes: 9, seconds: 1});
        io:println(check time:civilToString(civil)); // Prints "2026-07-18T23:44:31.120Z"

        time:TimeZone timeZone = check new("Asia/Colombo");
        civil = check time:civilFromString("2025-04-13T17:35:30.120-08:00[America/Los_Angeles]");
        civil = check timeZone.civilAddDuration(civil, {years: 1, months: 3, days: 5, hours: 6, minutes: 9, seconds: 1});
        io:println(check time:civilToString(civil)); // 2026-07-19T13:14:31.120+05:30[Asia/Colombo]
    }
    ```

### Improvements

#### `oauth2` package

- Added support for configuring the connection and request timeouts for the internal HTTP client.

    ```ballerina
    ClientCredentialsGrantConfig config = {
        // ... other configurations
        clientConfig: {
            connectTimeout: 30,
            reqTimeout: 60
        }
    };
    ```

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 13 (2201.13.0)](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.13.0%22+label%3AType%2FBug).

## Developer tools updates

### New features

#### Language Server

#### CLI

#### OpenAPI tool

### Improvements

#### Language Server

### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake Update 13 (2201.13.0) of the repositories below.

- [Language server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FLanguageServer+milestone%3A2201.13.0+is%3Aclosed+label%3AType%2FBug+)
- [OpenAPI](https://github.com/ballerina-platform/openapi-tools/issues?q=is%3Aissue+label%3AType%2FBug+milestone%3A%22Swan+Lake+2201.13.0%22+is%3Aclosed)

## Ballerina packages updates

### New features

### Improvements

### Bug fixes

## Backward-incompatible changes
