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

#### Remove dependence on syntactic location for module-level XMLNS declarations

It is now possible for expressions to refer to module-level XML namespaces declarations that are declared later in the code.

```ballerina
public function main() {
    string exdoc = ex:doc;
}

xmlns "http://example.com" as ex;
```
#### Allow declaration of XML namespaces with the same prefix in multiple Ballerina files

It is now possible to declare XML namespaces with the same prefix in multiple Ballerina files (source parts) of the same package. This is because the prefix symbol space applies to the source part, and not the module.

main.bal
```ballerina
xmlns "https://ballerina.io/" as ns;
```

utils.bal
 ```ballerina
// Previously resulted in a compile time error `redeclared symbol 'ns'` now works as expeted.
xmlns "https://example.com/" as ns; 
```

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 9 (2201.9.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FCompilerFE+milestone%3A2201.9.0+is%3Aclosed+label%3AType%2FBug).

## Runtime updates

### New features

#### Support to provide values for configurable variables through environment variables

Configurable values can now be provided through environment variables using the following syntax.

```
BAL_CONFIG_VAR_key=value
```

The key conforms to the structure `ORG_MODULE_VARIABLE`, where each part in the structured identifier is converted to uppercase, and dots are converted to underscores.

The environment variable-based configuration is supported for configurable variables of `boolean`, `int`, `float`, `decimal`, `string`, and `xml` types.

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

This returns a list of artifact instances that represent the services at runtime. An artifact instance contains a name (service name), type (only `service` is supported now), and a map of details. The map of details includes the following information.

- `listeners` - a list of listener objects attached to the service
- `attachPoint` - the attach point specified in the service declaration (for example, `basePath` in HTTP)
- `service` - the service object

```java
public Node getNode();
```

This returns a node instance that represents the Ballerina runtime node. A node instance contains a node ID (`nodeId` - self-generated unique ID), and a map of details. The map of details includes the following information.

- `balVersion` - The Ballerina version
- `balHome` - The path of Ballerina home
- `osName` - Name of the Operating System
- `osVersion` - Version of the Operating System

The above APIs can be called via a Ballerina environment instance as follows.

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

E.g.,
The following Ballerina resource method,
```ballerina
isolated resource function get abc/[int p1]/[string p2]/[string p3]/[int ...p4] (string s, int i, typedesc<anydata> targetType = <>) = @java:Method {
    'class: "javalibs.app.App",
    name: "getResource",
    paramTypes: ["io.ballerina.runtime.api.values.BObject", "io.ballerina.runtime.api.values.BArray", "io.ballerina.runtime.api.values.BString"]
} external;
```

can be bound to the following Java method.
```java
public static void getResource(BObject client, BArray path, BArray args) {
}
```

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 9 (2201.9.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.9.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed).

## Ballerina library updates

### New features

#### `avro` package

- Introduced Avro serialization/deserialization support

#### `graphql` package

- Introduced GraphQL server-side caching support

### Improvements

#### `graphql` package

- Improved the GraphQL error responses to use aliases instead of field names in the `path` field
- Added support to report GraphQL specific diagnostics in the VS Code extension

### Deprecations

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 9 (2201.9.0)](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.9.0%22+label%3AType%2FBug).

## Developer tools updates

### New features

#### Formatter

##### Customize formatting

It is now possible to provide custom formatting configurations to the Ballerina formatter via a local or remote configuration file. This allows for consistency in code style across projects in an organization and simplifies the process of enforcing formatting standards. This is introduced as an experimental feature in Ballerina 2201.9.0.

#### Language Server

#### CLI

#### OpenAPI tool

### Improvements

#### Formatter

##### Multiline function call formatting.

When a multiline function call is present in the code, the subsequent lines used to have the same indentation as the first line. This behavior is modified to have an indentation of 8 spaces in the subsequent lines.

Before formatting

```ballerina
addNumbers(numberOne,  numberTwo, numberThree,
numberFour, numberFive, numberSix);
```

After formatting

```ballerina
addNumbers(numberOne, numberTwo, numberThree,
        numberFour, numberFive, numberSix);
```

When a multiline object is present as an argument, the indentation of the subsequent lines is set such that those lines have the same indentation as the object declaration.

```ballerina
public function updateValues(int t1, int t2) {
    update(t1, object {
                   int i = 1;
                   int y = 2;
               },
               t2);
}
```

#### Language Server

### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake Update 9 (2201.9.0) of the repositories below.

- [Language server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FLanguageServer+milestone%3A2201.9.0+is%3Aclosed+label%3AType%2FBug+)
- [OpenAPI](https://github.com/ballerina-platform/openapi-tools/issues?q=is%3Aissue+label%3AType%2FBug+milestone%3A%22Swan+Lake+2201.9.0%22+is%3Aclosed)

## Ballerina packages updates

### New features

### Improvements

#### `cloud` package
- Directories can now be mounted as ConfigMaps and Secrets.

### Bug fixes

## Backward-incompatible changes

### Language

- A bug which resulted in the addition of a default namespace to an XML navigation name pattern, even when the default namespace is defined after it, has been fixed.

    ```ballerina
    public function main() {
        xml x = xml `<item><name>Box</name></item>`;

        // Previously evaluated to an empty XML sequence, now evaluates to 
        // `<item><name>Box</name></item>`
        xml x1 = x.<item>;

        xmlns "http://example.com/";
    }
    ```

- A bug which resulted in XML navigation failing to return elements with namespaces different from the default one when using `<*>` to access XML element children has been fixed.

    ```ballerina
    public function main() {
        xmlns "http://example.com/";
        xmlns "https://ballerina.io/" as ns0;

        xml x1 = xml `
        <item>
            <ns0:name>ball</ns0:name>
            <type>t</type>
        </item>`;

        // Previously evaluated to `
        // <type xmlns="http://example.com/">t</type>`,
        // now evaluates to, 
        // `<ns0:name xmlns="http://example.com/" xmlns:ns0="https://ballerina.io">ball</ns0:name>
        // <type xmlns="http://example.com/">t</type>`
        xml x2 = x1/<*>;
    }
    ```

- A bug which resulted in the XML namespace URI being empty when a constant is used in the XML namespace declaration has been fixed.

    ```ballerina
    const URI = "http://ballerina.com/";
    xmlns URI as ns0;

    public function main() {
        // Previously evaluated to "{}attr", now evaluates to {http://ballerina.com/}attr
        string s = ns0:attr;
    }
    ```

- A bug which resulted in a compiler crash or a nil value for a variable of a binding pattern which is used as a captured variable has been fixed.

    ```ballerina
    type Doctor record {
        string name;
        string category;    
    };

    function updateDoctorCategories(Doctor doctor, string[] categories) returns error? {
        var {category} = doctor;
        string cat = category;
         // Previously evaluated to `true` since category is used in a closure, now returns `false`.
        boolean b = <any> category is ();
        if !categories.some(existingCategory => existingCategory == category) {
            categories.push(category);
        }
    }
    ```

- A bug which resulted in XML navigation evaluating to empty XML sequence when the navigation name pattern contains escape characters has been fixed.

    ```ballerina
    public function main() {
        xml d = xml `
        <person>
            <name>John</name>
            <home-address>some address</home-address>
        </person>`;

        xml x1 = d/<home\-address>; // Previously evaluated to an empty XML sequence, now evaluates to `<home-address>some address</home-address>`
    }
    ```

-  A bug which resulted in no compilation errors being logged for missing required fields in the `select` clause has been fixed.

    ```ballerina
    type Student record {|
        int id;
        string name;
        Enrollment[] enrollments;
    |};

    type Course record {|
        int id;
        string name;
    |};

    type Enrollment record {|
        int id;
        string name;
        int year;
        int grade;
    |};

    function getStudentCourses(Student student) returns int|Course[] {
        int|Course[] courses = from var enrollment in student.enrollments
                            select {
                                // Compile-time error now, since the `name` field is not specified
                                id: enrollment.id
                            };
        return courses;
    }
    ```

- A bug which resulted in the top-most comments above imports being moved when formatting imports has been fixed. This fix also preserves new lines within comment blocks above imports.

    Before formatting

    ```ballerina
    // Copyright (c) 2024 WSO2 LLC. (http://www.wso2.com).
    //
    // WSO2 LLC. licenses this file to you under the Apache License,
    // Version 2.0 (the "License"); you may not use this file except
    // in compliance with the License.
    // You may obtain a copy of the License at
    //
    // http://www.apache.org/licenses/LICENSE-2.0
    //
    // Unless required by applicable law or agreed to in writing,
    // software distributed under the License is distributed on an
    // "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    // KIND, either express or implied.  See the License for the
    // specific language governing permissions and limitations
    // under the License.


    // this file contains implementaion of the agent code. 
    // It includes functions for managing the ai client. 



    import ballerinax/oracledb;

    import ballerina/io;

    // module imports
    import agent;
    import utils;

    // endpoint related functions
    import ai/endpoints;

    // config related functions
    import ai/config;

    function attachAgent() {

    }
    ```

    After formatting

    ```ballerina
    // Copyright (c) 2024 WSO2 LLC. (http://www.wso2.com).
    //
    // WSO2 LLC. licenses this file to you under the Apache License,
    // Version 2.0 (the "License"); you may not use this file except
    // in compliance with the License.
    // You may obtain a copy of the License at
    //
    // http://www.apache.org/licenses/LICENSE-2.0
    //
    // Unless required by applicable law or agreed to in writing,
    // software distributed under the License is distributed on an
    // "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    // KIND, either express or implied.  See the License for the
    // specific language governing permissions and limitations
    // under the License.

    // this file contains implementaion of the agent code. 
    // It includes functions for managing the ai client. 

    // module imports
    import agent;
    import utils;

    import ballerina/io;
    import ballerinax/oracledb;

    // config related functions
    import ai/config;

    // endpoint related functions
    import ai/endpoints;

    function attachAgent() {

    }
    ```

- To avoid clashes with Java identifiers, the character `$` which is used for encoding and decoding identifiers has been replaced by the character `&`.

### `rabbitmq` package

- Removed the previously deprecated `rabbitmq:Message` record. Consequently, corresponding APIs no longer accommodate this record. Users are advised to transition to utilizing subtypes of `rabbitmq:AnydataMessage` for continued functionality.

### `nats` package

- Removed the previously deprecated `nats:Message` record. Consequently, corresponding APIs no longer accommodate this record. Users are advised to transition to utilizing subtypes of `nats:AnydataMessage` for continued functionality.

### `cloud` package

- SSL configurations are no longer automatically retrieved from the code. You need to explicitly mark them as secrets in `Cloud.toml`. 
    ```toml
    [[cloud.secret.files]]
    file="resource."
    mount_dir="./resource"
    ```

- The `mount_path` of `[[cloud.secret.files]]` and  `[[cloud.config.maps]]` is renamed as `mount_dir` in the `Cloud.toml` file, and now it always expects the destination directory.

- Entrypoints are used instead of CMD to run the ballerina application in the Dockerfile.
    ```
    CMD ["java","..."] //Old
    ```

    ```
    ENTRYPOINT ["java","..."] //New
    ```

- Suffix is added to generated ConfigMaps and Secrets in Kubernetes to avoid Conflicts.
- Subpaths are used in Kubernetes to better support multiple files in the same directory.
