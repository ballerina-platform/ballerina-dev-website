---
layout: ballerina-left-nav-release-notes
title: Swan Lake Update 12 (2201.12.9) 
permalink: /downloads/swan-lake-release-notes/2201.12.9/
active: 2201.12.9
---

## Overview of Ballerina Swan Lake Update 12 (2201.12.9)

<em>Swan Lake Update 12 (2201.12.9) is the seventh patch release of Ballerina 2201.12.0 (Swan Lake Update 12) and it includes a new set of bug fixes to the compiler and runtime.</em>

## Update Ballerina

Run the command below to update your current Ballerina installation directly to 2201.12.9 by using the [Ballerina Update Tool](/learn/update-tool/).

```
$ bal dist pull 2201.12.9
```

## Install Ballerina

If you have not installed Ballerina, then, download the [installers](/downloads/#swanlake) to install.

<!-- ADD ONLY THE APPLICABLE SECTIONS FROM THE BELOW -->


## Developer tools updates

- Fixed the required minimum code coverage support for the `bal test` command with the `--min-coverage` flag
- Added Ballerina Update Tool support for a custom truststore by using the following environment variables:
    ```
    BALLERINA_CA_BUNDLE
    BALLERINA_CA_PASSWORD
    BALLERINA_CA_CERT
    ```
