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

- A bug that caused an invalid static type to be set for an additive expression with operands of an XML and string subtype has been fixed.

```ballerina
public function main() {
    xml<xml:Element> x = xml `<bar/>`;
    string s1 = "foo";

    // Used to result in an incompatible types error, allowed now.
    xml<xml:Element|xml:Text> r1 = x + s1;

    "foo"|"bar" s2 = "foo";
    // Compile-time error now.
    xml<xml:Element|xml:Comment> r2 = x + s2;
}
```

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

#### `data.yaml` package

The [`data.yaml`](https://lib.ballerina.io/ballerina/data.yaml/latest/) package has been introduced to parse YAML as Ballerina `anydata` values with data projection and to serialize Ballerina values to YAML format.

```ballerina
import ballerina/data.yaml;
import ballerina/io;

type ServerConfig record {|
    string host;
    int port;
    int[2] remotePorts;
    DatabaseConfig database;
|};

type DatabaseConfig record {|
    string dbName;
    string username;
|};

public function main() returns error? {
    // Similar to content read from a YAML file.
    string yamlString = string `
        host: "localhost"
        port: 8080
        remotePorts: [9000, 9001, 9002, 9003]
        protocol: "http"
        database:
          dbName: "testdb"
          username: "dbuser"
          password: "dbpassword"`;

    // Based on the expected type, it parses the YAML string to selectively construct the record value.
    ServerConfig serverConfig = check yaml:parseString(yamlString);
    io:println(serverConfig);
}
```

#### `http` package

- Introduced support for server-sent events.
- Introduced service contract types.
- Introduced the default status code response record type.

#### `ldap` package

- Added support for the main operation types in LDAP.

### Improvements

#### `http` package

- Added connection eviction support for the HTTP listener.
- Enhanced the configurability of Ballerina access logging by introducing multiple configuration options.

#### `jwt` package

- Added support to directly provide `crypto:PrivateKey` and `crypto:PublicKey` values in JWT signature configurations. With this update, the `config` field of `jwt:IssuerSignatureConfig` now allows `crypto:PrivateKey`, and the `certFile` field of `jwt:ValidatorSignatureConfig` now allows `crypto:PublicKey`.

    Previous `jwt:IssuerSignatureConfig` record:

    ```ballerina
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
    ```

    New `jwt:IssuerSignatureConfig` record:

    ```ballerina
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
    ```

    Previous `jwt:ValidatorSignatureConfig` record:

    ```ballerina
    public type ValidatorSignatureConfig record {|
        // ... other fields
        string certFile?;
    |};
    ```

    New `jwt:ValidatorSignatureConfig` record:

    ```ballerina
    public type ValidatorSignatureConfig record {|
        // ... other fields
        string|crypto:PublicKey certFile?;
    |};
    ```

    >**Note:** This feature may break existing code if the relevant fields are referred to using the previous types.

### Deprecations

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 10 (2201.10.0)](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.10.0%22+label%3AType%2FBug).

## Developer tools updates

### New features

#### Language Server

- Introduced the `Convert to configurable` code action to convert a module-level variable into a configurable variable.
- Introduced the `Extract to configurable` code action to extract expressions or function arguments into configurable variables.
- Introduced the `Add to Config.toml` code action to add configurable variables to the `Config.toml` file.

#### CLI

- Introduced auto-restarting of services with the `bal run` command as an experimental feature.

    ```
    $ bal run --watch
    ```

#### OpenAPI tool

### Improvements

#### Language Server

- Added navigation and reference-finding support for object `init` functions.

### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake Update 10 (2201.10.0) of the repositories below.

- [Language server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FLanguageServer+milestone%3A2201.10.0+is%3Aclosed+label%3AType%2FBug+)
- [OpenAPI](https://github.com/ballerina-platform/openapi-tools/issues?q=is%3Aissue+label%3AType%2FBug+milestone%3A%22Swan+Lake+2201.10.0%22+is%3Aclosed)

## Ballerina packages updates

### New features

### Language changes

 A bug that caused an invalid static type to be set for optional XML attribute access on `xml:Element` has been fixed for compliance with the specification. The static type now includes `error`.

```ballerina
public function main() {
    xml:Element xe = xml `<x attr="e"/>`;
    string? attr = xe?.attr; // Compile-time error now.
}
```

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
