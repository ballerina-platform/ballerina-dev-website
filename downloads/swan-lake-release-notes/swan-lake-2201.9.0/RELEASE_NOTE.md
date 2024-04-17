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

#### Introduction of the alternate receive action

The alternate receive action can be used to receive one of multiple values corresponding to multiple send actions. It operates by waiting until it encounters a non-error message, a panic termination status on a closed channel, or the closure of all channels. Alternate receive action sets the first non-error value it encounters as the result.

```ballerina
import ballerina/io;
import ballerina/lang.runtime;

public function main() {
    worker w1 {
        2 -> function;
    }

    worker w2 {
        runtime:sleep(2);
        3 -> function;
    }

    worker w3 returns error? {
        int value = 10;
        if value == 10 {
            return error("Error in worker 3");
        }
        value -> function;
    }

    worker w4 {
        runtime:sleep(2);
        3 -> function;
    }

    // The value of the variable `result` is set as soon as the value from either
    // worker `w1` or `w2` is received.
    int result1 = <- w1 | w2;
    io:println(result1); // 2

    // Alternate receive action waits until a message that is not an error is received. 
    // Since `w3` returns an error, it waits further and sets the value that is received from `w4`.
    int|error? result2 = <- w3 | w4;
    io:println(result2); // 3
}
```

#### Introduction of the multiple receive action

The multiple receive action can be used to receive values corresponding to multiple send actions. It operates by waiting for the receipt of values from all the send actions, subsequently constructing a mapping value containing those values.

```ballerina
import ballerina/io;
import ballerina/lang.runtime;

public function main() {
    worker w1 {
        2 -> function;
    }

    worker w2 {
        runtime:sleep(2);
        3 -> function;
    }

    // The worker waits until both values are received.
    Result result = <- {a: w1, b: w2};
    io:println(result); // {"a":2,"b":3}
}

type Result record {
    int a;
    int b;
};
```

#### Support for conditional worker send action

The send action in workers can be used in a conditional context, allowing for more flexible and dynamic inter-worker communication based on specific conditions. The receiver side in a conditional send might not always receive a message. Thus, to handle such scenarios, the static type of the receive action includes the `error:NoMessage` type.

```ballerina
import ballerina/io;

public function main() {
    boolean isDataReady = true;

    worker w1 {
        // A send action can be used in a conditional context.
        if isDataReady {
            10 -> function;
        }
    }

    worker w2 {
        if isDataReady {
            1 -> function;
        } else {
            0 -> function;
        }
    }

    // The send action corresponding to this receive action is conditionally executed.
    // Thus, there is a possibility that the send action may not get executed.
    // Therefore, the static type of the receive includes the `error:NoMessage` type
    // indicating the absence of a message in such cases.
    int|error:NoMessage w1Message = <- w1;
    io:println(w1Message); // 10

    // Two different conditional send actions exist within the worker `w3`.
    // Therefore, an alternate receive action can be used to receive them.
    int|error:NoMessage w2Message = <- w2 | w2;
    io:println(w2Message); // 1
}
```

#### Introduction of the `on fail` clause for named workers

The `on fail` clause can be used with a named worker, to handle any errors that occur within the worker's body.

```ballerina
import ballerina/io;

public function main() {
    int[] values = [2, 3, 4, 5];
    int value = 0;

    worker w1 {
        int index = check getIndex(values, value);
        index -> function;
    } on fail {
        // Handle the error thrown in the worker body.
        -1 -> function;
    }

    int|error:NoMessage result = <- w1 | w1;
    io:println(result); // -1
}

function getIndex(int[] values, int value) returns int|error =>
    let int? index = values.indexOf(value) in index ?: error("value not found");
```

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
// Previously resulted in a `redeclared symbol` compile-time error, now works as expected.
xmlns "https://example.com/" as ns; 
```

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 9 (2201.9.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FCompilerFE+milestone%3A2201.9.0+is%3Aclosed+label%3AType%2FBug).

## Runtime updates

### New features

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 9 (2201.9.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.9.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed).

## Ballerina library updates

### New features

#### `avro` package

- Introduced Avro serialization/deserialization support.

#### `graphql` package

- Introduced GraphQL server-side caching support.

#### `crypto` package

- Introduced new APIs for ML-KEM-768 (Kyber768) key encapsulation mechanism.
- Introduced new APIs for RSA-KEM-ML-KEM-768 key encapsulation mechanism.
- Introduced new APIs for ML-KEM-768 hybrid public-key encryption (HPKE).
- Introduced new APIs for RSA-KEM-ML-KEM-768 hybrid public-key encryption (HPKE).
- Introduced new APIs for ML-DSA65 (Dilithium3) signing.

### Improvements

#### `cloud` package
- Directories can now be mounted as ConfigMaps and Secrets.

#### `graphql` package

- Improved the GraphQL error responses to use aliases instead of field names in the `path` field.
- Added support to report GraphQL specific diagnostics in the VS Code extension.

### Deprecations

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 9 (2201.9.0)](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.9.0%22+label%3AType%2FBug).

### Revamped connector updates

The following new connectors along with major updates have been added to the Ballerina library, as part of the Ballerina connector revamp initiative.
All the connectors listed below have been released under new major versions, due to significant changes in the APIs and functionalities.

#### `asana` package

- Enhanced connector APIs by incorporating resource function syntax, along with improved documentation and examples.

#### `candid` package

- Introduced support for connecting to Candid's Charity Check, Essentials and Premier REST APIs.

#### `confluent.cavroserdes` package

- Introduced support for serializing and deserializing data using Avro schemas stored in the Confluent Schmema Registry.

#### `confluent.cregistry` package

- Introduced support for integrating with the Confluent Schema Registry.

#### `docusign.dsadmin` package

- Introduced new APIs to be consistent with DocuSign Admin APIs.

#### `docusign.dsclick` package

- Introduced new APIs to be consistent with DocuSign Click APIs.

#### `docusign.dsesign` package

- Introduced new APIs to be consistent with DocuSign eSignature APIs.

#### `googleapis.gcalendar` package

- Introduced support for connecting to Google Calendar REST APIs.

#### `github` package 

- Introduced support for connecting to GitHub REST API version 2022-11-28, replacing the GitHub GraphQL API based connector.

#### `guidewire.insnow` package

- Introduced support for connecting to Guidewire InsuranceNow REST API.

#### `ibm.ibmmq` package 

- Introduced support for connecting to IBM MQ server versions up to 9.3.

#### `mongodb` package

- Introduced `mongodb:Client`, `mongodb:Database`, and `mongodb:Collection` objects to provide a more intuitive and user-friendly API for MongoDB operations.
- Introduced new APIs to be consistent with MongoDB's native APIs.
- Added support for MongoDB aggregation operations.
- Added support for MongoDB projections through type inference and manual projection.
- Added support for connecting to MongoDB Atlas databases and clusters.
- Added support for SSL connections to MongoDB servers.
- Improved the `find` API with support for filtering, sorting, and pagination.
- Improved the `update` API by providing `matchedCount` and `modifiedCount` in the response.
- Improved the overall documentation and examples.

#### `redis` package

- Added support to connect and work with Redis clusters.
- Introduced support for secure connections (SSL/TLS) to Redis servers.
- Added support for Redis connection strings (i.e. Redis URIs).
- Extended connector compatibility to include the latest Redis server versions (up to 7.2.x).

#### `zendesk` package

- Introduced support to connect to Zendesk REST API V2, combining the functionalities of the `zendesk.support` and `zendesk.voice` packages.

#### `rabbitmq` package

- Removed the previously deprecated `rabbitmq:Message` record. Consequently, corresponding APIs no longer accommodate this record. Users are advised to transition to utilizing subtypes of `rabbitmq:AnydataMessage` for continued functionality.

#### `nats` package

- Removed the previously deprecated `nats:Message` record. Consequently, corresponding APIs no longer accommodate this record. Users are advised to transition to utilizing subtypes of `nats:AnydataMessage` for continued functionality.

#### `aws.redshift` package

- Introduced seamless connectivity to Amazon Redshift databases.

## Developer tools updates

### New features

#### Formatter

##### Customize formatting

It is now possible to provide custom formatting configurations to the Ballerina formatter via a local or remote configuration file. This allows for consistency in code style across projects in an organization and simplifies the process of enforcing formatting standards. This is introduced as an experimental feature in Ballerina 2201.9.0.

#### Language Server

- Introduced the `Extract to transform function` code action to extract the value expression of a field in a mapping constructor into an expression-bodied function that returns expected record.
- Introduced the `Surround with lock` code action to wrap an isolated variable access with a `lock` statement.
- Introduced the `Add private qualifier` code action to set the visibility qualifier of a field in an isolated class to `private`.
- Introduced the `Make variable immutable` code action to add `final` and/or `readonly` as needed to make the field immutable.

#### Ballerina Shell

- Added support for invoking actions directly from the shell prompt, as shown in the following examples.

```ballerina
$= string value = myClient->invoke("input");
$= string value = myClient->/root/name("input");
$= future<int> result = start name();
```

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

- Improved the snippet completion items provided for dependently-typed functions.
- Improved the completion items provided for resource parameters with singleton types.
- Improved the order of completions provided for resource access actions.
- Introduced an error notification to indicate when the project contains cyclic dependencies.
- Introduced an error notification to indicate high memory usage.

### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake Update 9 (2201.9.0) of the repositories below.

- [Language server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FLanguageServer+milestone%3A2201.9.0+is%3Aclosed+label%3AType%2FBug+)
- [OpenAPI](https://github.com/ballerina-platform/openapi-tools/issues?q=is%3Aissue+label%3AType%2FBug+milestone%3A%22Swan+Lake+2201.9.0%22+is%3Aclosed)

## Ballerina packages updates

### New features

### Improvements

### Bug fixes

## Backward-incompatible changes

### Language changes

- A bug that allowed using `self` of an isolated object to access a mutable field without a lock statement within an anonymous function has been fixed.

    ```ballerina
    import ballerina/log;

    isolated class Data {
        private int id;
        private string name;

        isolated function init(int id, string name) {
            self.id = id;
            self.name = name;
        }

        isolated function update(int? id = (), string? name = ()) {
            lock {
                if id is int {
                    self.id = id;
                }

                if name is string {
                    self.name = name;
                }
            }

            var logger = isolated function () returns string {
                // Now results in compile-time errors, 
                // need to use a lock statement. 
                return string `ID: '${self.id}', Name: '${self.name}'`; 
            };
            log:printDebug("Data updated", details = logger);
        }
    }
    ```

- A bug which resulted in the rest parameter of a function not being considered final has been fixed.

    ```ballerina
    function sum(int i, int... j) {
        j = [1, 2, 3]; // Compile-time error now.
    }
    ```

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

### Ballerina library changes

#### `rabbitmq` package

- Removed the previously deprecated `rabbitmq:Message` record. Consequently, corresponding APIs no longer accommodate this record. Users are advised to transition to utilizing subtypes of `rabbitmq:AnydataMessage` for continued functionality.

#### `nats` package

- Removed the previously deprecated `nats:Message` record. Consequently, corresponding APIs no longer accommodate this record. Users are advised to transition to utilizing subtypes of `nats:AnydataMessage` for continued functionality.

#### `cloud` package

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
