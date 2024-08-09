---
layout: ballerina-left-nav-release-notes
title: 2201.10.0 (Swan Lake) 
permalink: /downloads/swan-lake-release-notes/2201.10.0/
active: 2201.10.0
redirect_from: 
    - /downloads/swan-lake-release-notes/2201.10.0
    - /downloads/swan-lake-release-notes/2201.10.0-swan-lake/
    - /downloads/swan-lake-release-notes/2201.10.0-swan-lake
    - /downloads/swan-lake-release-notes/
    - /downloads/swan-lake-release-notes
---

## Overview of Ballerina Swan Lake Update 10 (2201.10.0)

<em> Swan Lake Update 10 (2201.10.0) is the tenth update release of Ballerina Swan Lake, and it includes a new set of features and significant improvements to the compiler, runtime, Ballerina library, and developer tooling. It is based on the 2024R1 version of the Language Specification.</em> 

## Update Ballerina

Update your current Ballerina installation directly to 2201.10.0 using the [Ballerina Update Tool](/learn/update-tool/) as follows.

1. Run `bal update` to get the latest version of the Update Tool.
2. Run `bal dist update` to update to this latest distribution.

## Install Ballerina

If you have not installed Ballerina, download the [installers](/downloads/#swanlake) to install.

## Language updates

### New features

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 10 (2201.10.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FCompilerFE+milestone%3A2201.10.0+is%3Aclosed+label%3AType%2FBug).

## Runtime updates

### New features

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 10 (2201.10.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.10.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed).

## Ballerina library updates

### New features

#### `data.jsondata` package

- Introduced constraint validation support, allowing validation of the output against constraints specified in the target type.
- Introduced support for parsing JSON with union types as expected types.

#### `data.xmldata` package

- Introduced constraint validation support, allowing validation of the output against constraints specified in the target type.
- Introduced support for parsing XML with record types with default values as the expected type, using the default values where required (i.e., if a value corresponding to the record field is not present in the XML value).
- Introduced the option to choose between semantic and syntactic equality of XML elements and attributes.

#### `http` package

- Introduced support for server-sent events.
- Introduced service contract type.
- Introduced default status code response record type.

#### `ldap` package

- Added support for the main operation types in LDAP.

### Improvements

#### `http` package

- Added connection eviction support for the HTTP listener.
- Enhanced the configurability of Ballerina access logging by introducing multiple configuration options.

### Deprecations

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 10 (2201.10.0)](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.10.0%22+label%3AType%2FBug).

## Developer tools updates

### New features

#### Language Server

#### CLI

- Introduced auto-restarting of services with the `bal run` command as an experimental feature.

    ```
    $ bal run --watch
    ```

#### OpenAPI tool

### Improvements

#### Language Server

### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake Update 10 (2201.10.0) of the repositories below.

- [Language server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FLanguageServer+milestone%3A2201.10.0+is%3Aclosed+label%3AType%2FBug+)
- [OpenAPI](https://github.com/ballerina-platform/openapi-tools/issues?q=is%3Aissue+label%3AType%2FBug+milestone%3A%22Swan+Lake+2201.10.0%22+is%3Aclosed)

## Ballerina packages updates

### New features

### Improvements

- Added support to mark a Java dependency as GraalVM compatible in the `Ballerina.toml` file as follows.

    ``` toml
    [[platform.java11.dependency]]
    groupId = "<group-id>"
    artifactId = "<artifact-id>"
    version = "<version>"
    graalvmCompatible = true
    ```

- Introduced an experimental build option to enable memory-efficient compilation for large packages to prevent out-of-memory issues that can happen during the initial compilation which happens with a clean Central cache.

    ```
    $ bal build --optimize-dependency-compilation
    ```

### Bug fixes

## Backward-incompatible changes

### Ballerina library changes

#### `jwt` package

- Add support to directly provide `crypto:PrivateKey` and `crypto:PublicKey` in JWT signature configurations. With this update, the `config` field in `jwt:IssuerSignatureConfig` now supports `crypto:PrivateKey`, and the `certFile` field in `jwt:ValidatorSignatureConfig` now supports `crypto:PublicKey`. These additions will breaks the previous union-type support.
    ```ballerina
    // previous `jwt:IssuerSignatureConfig` record
    public type IssuerSignatureConfig record {|
        // ... other fields
        record {|
            crypto:KeyStore keyStore;
            string keyAlias;
            string keyPassword;
        |} | record {|
            string keyFile;
            string keyPassword?;
        |}|string config?;
    |};

    // new `jwt:IssuerSignatureConfig` record
    public type IssuerSignatureConfig record {|
        // ... other fields
        record {|
            crypto:KeyStore keyStore;
            string keyAlias;
            string keyPassword;
        |} | record {|
            string keyFile;
            string keyPassword?;
        |}|crypto:PrivateKey|string config?;
    |};

    // previous `jwt:ValidatorSignatureConfig` record
    public type ValidatorSignatureConfig record {|
        // ... other fields
        string|crypto:PublicKey certFile?;
    |};

    // new `jwt:ValidatorSignatureConfig` record
    public type ValidatorSignatureConfig record {|
        // ... other fields
        string|crypto:PublicKey certFile?;
    |};
    ```
