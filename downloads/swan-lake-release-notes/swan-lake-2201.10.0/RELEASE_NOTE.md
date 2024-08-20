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

### Improvements

#### Added support for the `shift`, `unshift`, `pop`, and `remove` functions with tuples

The runtime now supports the `shift`, `unshift`, `pop`, and `remove` operations on tuples similar to arrays, as long as they do not violate inherent type or mutability constraints.

The following are now allowed.

```ballerina
[int, int...] tuple1 = [1, 2];
int val1 = tuple1.shift(); // 1

[int, string, float...] tuple2 = [7, "hello", 67.5, 89.7];
int|string|float val2 = tuple2.remove(2); // 67.5
```

The following examples will result in errors.

```ballerina
[string, string...] tuple1 = ["hello"];
tuple1.unshift(154); // Compile-time error.

[int, string, float...] tuple2 = [7, "hello", 67.5, 89.7];
int|string|float val2 = tuple2.remove(1); // Panics.
```

#### New runtime Java APIs

##### A runtime Java API to check if remote management is enabled

A new runtime Java API is added to check if remote management is enabled via a build option.

```java
boolean isRemoteManagementEnabled();
```

The above API can be called via a Ballerina `Environment` instance as follows.

```java
import io.ballerina.runtime.api.Repository;
import io.ballerina.runtime.api.Environment;

Repository repository = env.getRepository();
boolean isRemoteManagementEnabled  = repository.isRemoteManagementEnabled();
```

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

#### `graphql` package

- Added support for GraphQL query complexity analysis, which can be used to enhance GraphQL service security by mitigating the risk of denial-of-service attacks. With this update, the `graphql:ServiceConfig` annotation now includes a new field named `queryComplexityConfig` to configure query complexity analysis.

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

#### `persist` package

- Introduced support for the H2 data store, mirroring the functionality provided for other supported SQL data stores like MySQL, MSSQL, and PostgreSQL.

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

#### `java.jdbc` package

- Updated the `datasourceName` and `properties` fields in the `jdbc:Options` record to be optional fields instead of fields of optional types, to allow users to use the `jdbc:Options` type in configurable variables.

#### `xslt` package

- Added parameter passing support for XSLT transformations.

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

-  Added support to generate a mock client for OpenAPI specifications (OAS) that include examples. To generate a mock client, use the `--mock` flag in the OpenAPI client generation CLI command.
  
    ```
     $ bal openapi -i <yml file> --mode client --mock
    ```

-  Provided an option to generate a single Ballerina file with the client or the service code. To generate code in a single file, use the `--single-file` flag in the OpenAPI client/service generation CLI command.
  
    ```
    $ bal openapi -i <yml file> --mode <client|service> --single-file
    ```

-  Added support to generate the Ballerina service contract object type for a given OAS. To generate the service contract object type, use the `--with-service-contract` flag along with the OpenAPI CLI client/service generation command.

    ```
    $ bal openapi -i <yml file> --mode <client|service> --with-service-contract
    ```

-  Introduced example annotations in the OpenAPI package. This feature will enable rendering example schemas in the generated OpenAPI specification.
  
    For example,

    Using the `openapi:Example` annotation
  
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
  
    Using the `openapi:Examples` annotation
  
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

- Provided a flag to generate the Ballerina client/service adhering to Ballerina naming conventions. To enable this feature, use the `--use-sanitized-oas` flag in the OpenAPI client/service CLI command. This an experimental feature.
  
  ```
  $ bal openapi -i <yml file> --mode <client|service> --use-sanitized-oas
  ```
  
#### Persist tool

- Introduced a new option to the `persist generate` command to provide a test datastore. This will generate a separate client which can be used to mock the actual client. The possible values are `h2` for SQL datastores and `inmemory` for non-SQL datastores.

    ```
    $ bal persist generate --datastore mysql --module db --test-datastore h2
    ```

- Introduced a new option to the `persist add` command to provide a test datastore. This will generate a separate client which can be used to mock the actual client. The possible values are `h2` for SQL datastores and `inmemory` for non-SQL datastores.

    ```
    $ bal persist add --datastore mysql --module db --test-datastore h2
    ```

- Added introspection support for `mssql` and `postgres` databases to facilitate the generation of the persist data model.

### Improvements

#### Language Server

- Added navigation and reference-finding support for object `init` functions.

#### OpenAPI tool

- Added support for Server-sent events (SSE) in Ballerina client generation.
- Added support to specify the path to an example file in JSON format as the `examples` field in the `@openapi:ResourceInfo` annotation.
- Added support for request body example mapping via the `@openapi:ResourceInfo` annotation.

### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake Update 10 (2201.10.0) of the repositories below.

- [Language server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FLanguageServer+milestone%3A2201.10.0+is%3Aclosed+label%3AType%2FBug+)
- [OpenAPI](https://github.com/ballerina-platform/ballerina-library/issues?q=is%3Aissue+milestone%3A2201.10.0+is%3Aclosed+label%3Amodule%2Fopenapi-tools+label%3AType%2FBug)

## Ballerina packages updates

### New features

### Improvements

- Resources are now expected at the package level, and module-level resources are no longer supported. Resources that were previously included at module-level have to be moved from modules to the package root to continue to be identified as resources.

  >**Note:** Any resources within the current package, as well as those exported from package dependencies, can be accessed via an [external function](https://ballerina.io/learn/by-example/interface-to-external-code/).

    * Old package structure

    ```
    .
    ├── Ballerina.toml
    ├── main.bal
    ├── resources
    └── modules
       └── util
           ├── Module.md
           ├── tests
           │   └── lib_test.bal
           ├── resources
           │   └── open-api-spec.json
           └── util.bal
    ```

    * New package structure

    ```
    .
    ├── Ballerina.toml
    ├── main.bal
    ├── resources
    │   └── open-api-spec.json
    └── modules
       └── util
           ├── Module.md
           ├── tests
           │   └── lib_test.bal
           └── util.bal
    ```

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
