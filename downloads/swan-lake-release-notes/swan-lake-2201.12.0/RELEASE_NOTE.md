---
layout: ballerina-left-nav-release-notes
title: 2201.12.0 (Swan Lake) 
permalink: /downloads/swan-lake-release-notes/2201.12.0/
active: 2201.12.0
redirect_from: 
    - /downloads/swan-lake-release-notes/2201.12.0
    - /downloads/swan-lake-release-notes/2201.12.0-swan-lake/
    - /downloads/swan-lake-release-notes/2201.12.0-swan-lake
    - /downloads/swan-lake-release-notes/
    - /downloads/swan-lake-release-notes
---

## Overview of Ballerina Swan Lake Update 12 (2201.12.0)

<em> Swan Lake Update 12 (2201.12.0) is the twelfth update release of Ballerina Swan Lake, and it includes a new set of features and significant improvements to the compiler, runtime, Ballerina library, and developer tooling. It is based on the 2024R1 version of the Language Specification.</em> 

## Update Ballerina

Update your current Ballerina installation directly to 2201.12.0 using the [Ballerina Update Tool](/learn/update-tool/) as follows.

1. Run `bal update` to get the latest version of the Update Tool.
2. Run `bal dist update` to update to this latest distribution.

## Install Ballerina

If you have not installed Ballerina, download the [installers](/downloads/#swanlake) to install.

## Language updates

### New features

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 12 (2201.12.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FCompilerFE+milestone%3A2201.12.0+is%3Aclosed+label%3AType%2FBug).

## Runtime updates

### New features

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 12 (2201.12.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.12.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed).

## Ballerina library updates

### Deprecations

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 12 (2201.12.0)](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.12.0%22+label%3AType%2FBug).

## Developer tools updates

### New features

#### Consolidate-packages tool

- Introduced the `consolidated-packages` bal tool to generate code required to consolidate multiple Ballerina services into a single executable.
- Simplifies service consolidation to enable monolith-style deployments.

  ```toml
  [package]
  org = "myorg"
  name = "myapp"
  version = "0.1.0"

  [[tool.consolidate-packages]]
  id = "consolidateSvc"
  options.services = ["myorg/menu_service", "myorg/order_service"]
  ```

Automation tools and CI/CD pipelines can integrate the CLI tool to automatically generate a Ballerina package containing the consolidated services.

- To install the tool, run:

  ```
  $ bal tool pull consolidate-packages 
  ```

- To create a package, use:

  ```
  $ bal consolidate-packages new --package-path <path> <comma-separated-list-of-services> 
  ```

For more information, see [consolidate-packages tool](/learn/consolidate-packages-tool). 

#### Language Server

#### CLI

#### OpenAPI tool

### Improvements

#### Language Server

### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake Update 12 (2201.12.0) of the repositories below.

- [Language server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FLanguageServer+milestone%3A2201.12.0+is%3Aclosed+label%3AType%2FBug+)
- [OpenAPI](https://github.com/ballerina-platform/openapi-tools/issues?q=is%3Aissue+label%3AType%2FBug+milestone%3A%22Swan+Lake+2201.12.0%22+is%3Aclosed)

## Ballerina packages updates

### New features

### Improvements

### Bug fixes

## Backward-incompatible changes
