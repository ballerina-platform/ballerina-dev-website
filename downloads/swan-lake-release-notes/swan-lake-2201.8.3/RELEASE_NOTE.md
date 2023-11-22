---
layout: ballerina-left-nav-release-notes
title: Swan Lake Update 8 (2201.8.3) 
permalink: /downloads/swan-lake-release-notes/2201.8.3/
active: 2201.8.3
---

## Overview of Ballerina Swan Lake Update 8 (2201.8.3)

<em>Swan Lake Update 8 (2201.8.3) is the third patch release of Ballerina 2201.8.0 (Swan Lake Update 8) and it includes a new set of bug fixes to the runtime and developer tooling.</em>

## Update Ballerina

Run the command below to update your current Ballerina installation directly to 2201.8.3 by using the [Ballerina Update Tool](/learn/update-tool/) as follows.

```
$ bal dist pull 2201.8.3
```

## Install Ballerina

If you have not installed Ballerina, download the [installers](/downloads/#swanlake) to install.

## Runtime updates

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.8.3 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.8.3+label%3AType%2FBug+is%3Aclosed+label%3ATeam%2FjBallerina).

## Developer tools updates

### Observability Improvements

#### Provide `response_errors_total_value` metric

Ballerina observability now provides total number of errors in responses as an metric via `response_errors_total_value`.

#### Let the user define `service name` in traces

User can now add a suffix to the service name shown in the tracer providers (Jaeger, Zipkin & New Relic) by passing an environment variable in the runtime as given below. 

`$ BAL_OBSERVE_SERVICE_NAME_SUFFIX=<suffix> bal run`

By default, the service name will be the base path of the service or the display name of the service.

### Bug fixes
To view bug fixes, see the GitHub milestone for Swan Lake Update 8 (2201.8.3) of the repositories below.

- [Dev Tools](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.8.3+label%3ATeam%2FDevTools+label%3AType%2FBug+is%3Aclosed)
