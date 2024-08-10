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

#### `http` package

- Introduced support for server-sent events.
- Introduced service contract type.
- Introduced default status code response record type.

### Improvements

#### `http` package

- Added connection eviction support for the HTTP listener.
- Enhanced the configurability of Ballerina access logging by introducing multiple configuration options.

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
-  Added support to generate a mock client for OAS if including the example details. To generate mock client, use `--mock` flag along with openAPI CLI client generation command.
  ```
  $ bal openapi -i <yml file> --mode client --mock
  ```

-  Provided the option to generate a single bal file for client/service. To generate single file, use `--single-file` flag along with openAPI CLI client/service generation command.
  ```
  $ bal openapi -i <yml file> --mode <client/service> --single-file
  ```

-  Added support to generate Ballerina service object type from given OAS. To generate a service contract object type file, use the `--with-service-contract` flag along with the OpenAPI CLI service generation command.
  ```
  $ bal openapi -i <yml file> --mode service --with-service-contract
  ```

-  Introduced example annotations in the OpenAPI tool. This feature will  enable rendering example schemas in the generated OpenAPI specification.
ex:
  1. Using Example annotation
 ```ballerina
    @openapi:Example {
      value: {
        id: 10,
        name: "Jessica Smith"
      }
    }
    type User record {
      int id;
      string name
    }
 ```
  2. Using Examples annotation
  ```ballerina
    @openapi:Examples {
      Jessica: { // Example 1
        value: {
           id: 10,
           name: "Jessica Smith"
        }
      },
      Ron: { // Example 2
        value: {
           id: 11,
           name: "Ron Stewart"
        }
      } 
    }
    type User record {
      int id;
      string name
    }
  ```
- Provided an option to generate Ballerina client/service according to Ballerina friendly naming convention. To enable this feature, use `--use-sanitized-oas` flag along with client/service CLI code generation.
  ```
  $ bal openapi -i <yml file> --mode <client/service> --use-sanitized-oas
  ```
  
### Improvements

#### Language Server

- Added navigation and reference-finding support for object `init` functions.

#### OpenAPI tool
- Added support for Server Sent Events (SSE) in Ballerina Client generation.
- Added improvement for supporting reference JSON example file path for the examples field in `@openapi:ResourceInfo` annotation.
- Added request body example mapping support for `@openapi:ResourceInfo` annotation in OAS generation.

### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake Update 10 (2201.10.0) of the repositories below.

- [Language server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FLanguageServer+milestone%3A2201.10.0+is%3Aclosed+label%3AType%2FBug+)
- [OpenAPI](https://github.com/ballerina-platform/ballerina-library/issues?q=is%3Aissue+milestone%3A2201.10.0+is%3Aclosed+label%3Amodule%2Fopenapi-tools+label%3AType%2FBug)

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

### Language changes

 A bug that caused an invalid static type to be set for optional XML attribute access on `xml:Element` has been fixed for compliance with the specification. The static type now includes `error`.

```ballerina
public function main() {
    xml:Element xe = xml `<x attr="e"/>`;
    string? attr = xe?.attr; // Compile-time error now.
}
```

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
