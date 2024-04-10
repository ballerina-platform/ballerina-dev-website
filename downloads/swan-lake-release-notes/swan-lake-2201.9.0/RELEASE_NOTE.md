---
layout: ballerina-left-nav-release-notes
title: 2201.9.0 (Swan Lake) 
permalink: /downloads/swan-lake-release-notes/2201.9.0/
active: 2201.9.0
redirect_from: 
    - /downloads/swan-lake-release-notes/2201.9.0
    - /downloads/swan-lake-release-notes/2201.9.0-swan-lake/
    - /downloads/swan-lake-release-notes/2201.9.0-swan-lake
    - /downloads/swan-lake-release-notes/
    - /downloads/swan-lake-release-notes
---

## Overview of Ballerina Swan Lake Update 9 (2201.9.0)

<em> Swan Lake Update 9 (2201.9.0) is the ninth update release of Ballerina Swan Lake, and it includes a new set of features and significant improvements to the compiler, runtime, Ballerina library, and developer tooling. It is based on the 2023R1 version of the Language Specification.</em> 

## Update Ballerina

Update your current Ballerina installation directly to 2201.9.0 using the [Ballerina Update Tool](/learn/update-tool/) as follows.

1. Run `bal update` to get the latest version of the Update Tool.
2. Run `bal dist update` to update to this latest distribution.

## Install Ballerina

If you have not installed Ballerina, download the [installers](/downloads/#swanlake) to install.

## Language updates

### New features

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 9 (2201.9.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FCompilerFE+milestone%3A2201.9.0+is%3Aclosed+label%3AType%2FBug).

## Runtime updates

### New features

#### Support to provide values for configurable variables through environment variables

Configurable values can now be provided through environment variables using the following syntax.

```
BAL_CONFIG_VAR_key=value
```
The key conforms to the structure  `org_module_variable`, where each part in the structured identifier is converted to uppercase, and dots are converted to underscores.

The environment variable-based configuration is supported for configurable variables with `boolean`, `int`, `float`, `decimal`, `string`, and `xml` types.

For example, if the configurable variable is defined in the following way,

```ballerina
configurable int port = ?;
```
The values can be provided through environment variables as follows.

If the configurable variable is defined in the default module or if a single Ballerina file is being used:

For Windows:
```
$ set BAL_CONFIG_VAR_PORT=9090
```
For Linux/macOS:
```
$ export BAL_CONFIG_VAR_PORT=9090
```
If the configurable variable is defined in a different module of the same organization:

For Windows:
```
$ set BAL_CONFIG_VAR_MODULENAME_PORT=9090
```
For Linux/macOS:
```
$ export BAL_CONFIG_VAR_MODULENAME_PORT=9090
```
If the configurable variable is defined in a module of a different organization.

For Windows:
```
$ set BAL_CONFIG_VAR_ORGNAME_MODULENAME_PORT=9090
```
For Linux/macOS:
```
$ export BAL_CONFIG_VAR_ORGNAME_MODULENAME_PORT=9090
```

#### New Runtime Java APIs

##### Java APIs to parse a JSON string to a target type

A new optimized API is introduced in `ValueUtils` to parse a given input stream and create a value using a subtype of `json` given by the target type. The user needs to close the provided input stream.

```java
public static Object parse(InputStream in, Type targetType) throws BError {
};
```

##### Java APIs to provide information about runtime artifacts

New runtime Java APIs are added to provide information about the active runtime artifacts.

```java
public List<Artifact> getArtifacts();
```

This returns a list of artifact instances that represent the services at runtime. An artifact instance contains a name (service name), type (only `service` is supported now), and a map of details. The details enclose the following information.
- `listeners` - a list of listener objects attached to the service
- `attachPoint` - the attach point specified in the service declaration (for example, `basePath` in HTTP)
- `service` - the service object

```java
public Node getNode();
```

This returns a node instance that represents the Ballerina runtime node. A node instance contains a nodeId (self-generated unique ID), and a map of details. The details enclose the following information.
- `balVersion` - The Ballerina version
- `balHome` - The path of Ballerina home
- `osName` - Name of the Operating System
- `osVersion` - Version of the Operating System

The above APIs can be called from a Ballerina environment instance. Similar to this,

```java 
import io.ballerina.runtime.api.Artifact;
import io.ballerina.runtime.api.Environment;
import io.ballerina.runtime.api.Node;

Repository repository = env.getRepository();
List<Artifact> artifacts = repository.getArtifacts();
Node node = repository.getNode();
```

##### Java APIs to start a new runtime and invoke a Ballerina function
Java APIs are introduced to start a new Ballerina runtime instance for a given module and perform function invocations within the module by calling the module initialization and module start methods sequentially before any other function calls. It is recommended to call the module stop method to gracefully shut down the Ballerina runtime at the end of the program.

```java
import io.ballerina.runtime.api.Runtime;

Runtime balRuntime = Runtime.from(module);
balRuntime.init();
balRuntime.start();
balRuntime.invokeMethodAsync(functionName, callback, args);
balRuntime.stop();
```

### Improvements

#### Support mapping of resource and remote function parameters to `BArray` parameter of a generic native method
A new way has been introduced to support the binding of any resource or remote function to a generic native method, regardless of the function parameters. The generic native method should be defined with a `BArray` parameter, which represents all the parameters excluding path parameters (Handling path parameters in a similar manner is supported from 2201.5.0). To avoid errors due to overloaded methods, it is recommended to define parameter type constraints as well.

E.g.:
```ballerina
isolated resource function get abc/[int p1]/[string p2]/[string p3]/[int ...p4] (string s, int i, typedesc<anydata> targetType = <>) = @java:Method {
    'class: "javalibs.app.App",
    name: "getResource",
    paramTypes: ["io.ballerina.runtime.api.values.BObject", "io.ballerina.runtime.api.values.BArray", "io.ballerina.runtime.api.values.BString"]
} external;
```

```java
public static void getResource(BObject client, BArray path, BArray args) {
}
```

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 9 (2201.9.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.9.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed).

## Ballerina library updates

### Deprecations

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 9 (2201.9.0)](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.9.0%22+label%3AType%2FBug).

## Developer tools updates

### New features

#### Language Server

#### CLI

#### OpenAPI tool

### Improvements

#### Language Server

### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake Update 9 (2201.9.0) of the repositories below.

- [Language server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FLanguageServer+milestone%3A2201.9.0+is%3Aclosed+label%3AType%2FBug+)
- [OpenAPI](https://github.com/ballerina-platform/openapi-tools/issues?q=is%3Aissue+label%3AType%2FBug+milestone%3A%22Swan+Lake+2201.9.0%22+is%3Aclosed)

## Ballerina packages updates

### New features

### Improvements

### Bug fixes

## Backward-incompatible changes

- To avoid clashes with Java identifiers, the character `$` which is used for encoding and decoding identifiers has been replaced by the character `&`.
