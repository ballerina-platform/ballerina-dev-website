---
layout: ballerina-left-nav-release-notes
title: 2201.2.0 (Swan Lake) 
permalink: /downloads/swan-lake-release-notes/2201-2-0/
active: 2201-2-0
redirect_from: 
    - /downloads/swan-lake-release-notes/2201-2-0
    - /downloads/swan-lake-release-notes/2201.2.0/
    - /downloads/swan-lake-release-notes/2201-2-0-swan-lake/
    - /downloads/swan-lake-release-notes/2201-2-0-swan-lake
---

### Overview of Ballerina 2201.2.0 (Swan Lake)

<em>2201.2.0 (Swan Lake) is the second major release of 2022, and it includes a new set of features and significant improvements to the compiler, runtime, standard library, and developer tooling. It is based on the 2022R3 version of the Language Specification.</em> 

### Update Ballerina

**If you are already using Ballerina 2201.0.0 (Swan Lake)**, run either of the commands below to directly update to 2201.2.0 using the [Ballerina Update Tool](/learn/update-tool/).

`bal dist update` (or `bal dist pull 2201.2.0`)

**If you are using a version below 2201.0.0 (Swan Lake)**, run the commands below to update to 2201.2.0.

1. Run `bal update` to get the latest version of the Update Tool.

2. Run `bal dist update` ( or `bal dist pull 2201.2.0`) to update your Ballerina version to 2201.2.0.

However, if you are using a version below 2201.0.0 (Swan Lake) and if you already ran `bal dist update` (or `bal dist pull 2201.2.0`) before `bal update`, see [Troubleshooting](/downloads/swan-lake-release-notes/swan-lake-2201.0.0#troubleshooting) to recover your installation.

### Install Ballerina

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.

### Migrate from Swan Lake Beta releases
>**Info:** If you have been using Swan Lake Beta releases, delete the `Dependencies.toml` files in your Ballerina packages when migrating to Ballerina 2201.2.0 (Swan Lake). 

A few backward-incompatible changes have been introduced during the Swan Lake Beta program, and thereby, some of your existing packages may not compile with Ballerina 2201.2.0 (Swan Lake). Therefore, you need to delete the `Dependencies.toml` file to force the dependency resolver to use the latest versions of your dependencies. 

### Language Updates

#### New features

##### Support for resource methods in client objects

Client objects can now contain `resource` methods. These `resource` methods can only be accessed by client resource access actions. With this feature, `resource` methods are also allowed in object-type descriptors.

```ballerina
import ballerina/io;

type ClientObjectType client object {
    resource function get greeting/[string name]() returns string;
};

ClientObjectType clientObj = client object {
    resource function get greeting/[string name]() returns string {
        return "Hello, " + name;
    }
};

public function main() {
    string result = clientObj->/greeting/James;
    // Will print `Hello, James`
    io:println(result);
}
```

In the above example, the `greeting/[string name]` resource in `clientObj` is accessed with the `->/` call syntax. This notation signifies that it is a resource access action on a client object.

The `greeting/James` resource access path segments after `->/` specify the target resource to access on the `clientObj`. The default resource method name will be`get` if it is not specified in the client resource access action.

##### Support for creating maps with query expressions

Maps can now be constructed using query expressions. A query expression that constructs a map must start with the `map` keyword. Further, the type of the `select` expression must be a tuple `[string, T]`. Then the query expression will create a value of type `map<T>`. Duplicate keys will be handled similarly to a query expression constructing a table.

```ballerina
import ballerina/io;

public function main() {
    [string, int][] arr = [["A", 0], ["B", 1], ["C", 2], ["D", 3], ["A", 4]];

    map<int>|error mapA = map from var element in arr
                            select [element[0], element[1]];
    io:println(mapA); // {"A":4,"B":1,"C":2,"D":3}

    map<int>|error mapB = map from var element in arr
                            select [element[0], element[1]]
                            on conflict error("Duplicate Key");
    io:println(mapB); // error("Duplicate Key")
}
```

##### Support for running new strands safely on separate threads

The `isolated` feature has been extended to identify cases where strands created by a `start` action or a named worker can be run safely on separate threads. 

A `start` action is isolated if the function or method it calls has a type that is isolated and the expression for every argument is an isolated expression. The object whose method is called by the method call or remote method call is treated as an argument. An isolated `start` action is allowed in an `isolated` function and the strand created by the `start` action will run in a separate thread from the current thread.

```ballerina
import ballerina/io;

isolated function f1(int[] arr) returns int[] {
    return arr.sort();
}

isolated function f2() {
    future<int[]> f = start f1([4, 2, 8, 6]); // Now allowed
}

function f3(int[] arr) returns int[] {
    return arr.sort();
}

function f4() {
    future<int[]> f = start f3([4, 2, 8, 6]);
}

public function main() {
    io:println(f3 is isolated function (int[]) returns int[]); // true, f3 is inferred to be isolated
    io:println(f4 is isolated function ()); // true, f4 is inferred to be isolated
}
```

The strand created by a named worker can run on a separate thread from the default worker if the body of the worker satisfies the requirements for an isolated function.

```ballerina
import ballerina/io;

final int[] & readonly intArr = [4, 2, 8, 6];

isolated function f1(int[] arr) returns int[] {
    return arr.sort();
}

isolated function f2() {
    worker A { // Now allowed
        int[] f = f1(intArr);
    }
}

function f3(int[] arr) returns int[] {
    return arr.sort();
}

function f4() {
    worker A {
        int[] f = f3(intArr);
    }
}

public function main() {
    io:println(f3 is isolated function (int[]) returns int[]); // true, f3 is inferred to be isolated
    io:println(f4 is isolated function ()); // true, f4 is inferred to be isolated
}
```

#### Improvements

##### Use `xml` as the contextually-expected type for interpolations in XML template expressions

The contextually-expected type for interpolations in XML template expressions has been changed to `xml`. This ensures that a query expression as an interpolation works as expected. However, it is not an error for the static type to not be a subtype of the contextually-expected type.

```ballerina
import ballerina/io;

public function main() {
    var x1 = xml `<doc>${from int i in 0 ..< 2
                            select xml `<num>${i}</num>`}</doc>`;
    io:println(x1); // <doc><num>0</num><num>1</num></doc>

    xml:Element x2 = xml `<doc>${from int i in 0 ..< 2
                            select xml `<num>${i}</num>`}</doc>`;
    io:println(x2); // <doc><num>0</num><num>1</num></doc>

    int n = 1;
    var x3 = xml `<num>${n}</num>`; // no error, although the static type is not a subtype of xml
    io:println(x3); // <num>1</num>
}
```

##### Allow query expressions with `readonly` contextually-expected types

Query expressions are now allowed with `readonly` contextually-expected types. Such query expressions create immutable structural values. 

```ballerina
import ballerina/io;

type T1 readonly & record {
    string[] arr;
};

type T2 record {
    int id;
    string name;
};

public function main() {
    T1 t = {arr: from var s in ["A", "C"] select s};
    io:println(t); // {"arr":["A","C"]}
    io:println(isImmutable(t)); // true

    var arr = [["A", 0], ["B", 1], ["C", 2], ["D", 3]];
    map<int> & readonly|error mp = map from var element in arr
                                    select [element[0], element[1]];
    io:println(isImmutable(mp)); // true

    table<T2> & readonly tbl = table key(id) from var item in [[1, "John"], [2, "Jane"]]
                                    select {
                                        id: item[0],
                                        name: item[1]
                                    };
    io:println(isImmutable(tbl)); // true
}

function isImmutable(any|error value) returns boolean => value is readonly;
```

##### Make the variable declaration in the on-fail clause optional

Previously, a variable needed to be  declared in the on-fail clause (e.g., `on fail error err`). It has now been made optional.

```ballerina
import ballerina/io;

function parseInts(string[] strs) returns [int[], int] {
    int[] ints = [];
    int errCount = 0;

    foreach string strVal in strs {
        do {
            int intVal = check int:fromString(strVal);
            ints.push(intVal);
        } on fail {
            errCount += 1;
        }
    }

    return [ints, errCount];
}

public function main() {
    [int[], int] [ints, errCount] = parseInts(["1", "b7a", "2"]);
    io:println(ints); // [1,2]
    io:println(errCount); // 1
}
```

##### Allow actions inside queries

The grammar now allows an action such as a remote method call to occur inside a query.

```ballerina
import ballerina/io;

public function main() {
    var obj = client object {
        remote function f1() returns (int|string)[] {
            return [1, "2", "3", 4];
        }

        remote function f2() returns int {
            return 10;
        }

        remote function f3(int i, int j) returns int {
            return i * j;
        }
    };

    int[] arr = from var i in obj->f1()
                  let int j = obj->f2()
                  where i is int
                  select obj->f3(i, j);

    io:println(arr); // [10,40]
}
```

##### Add the `call` langlib function to dynamically call a function

The `lang.function:call()` langlib function is introduced to call a function dynamically, passing a function value and optionally argument(s) .

```ballerina
import ballerina/io;

public function main() {
    io:println(function:call(getSum)); // 30
    io:println(function:call(getSum, 10)); // 40
    io:println(function:call(getSum, 10, 15)); // 45
    io:println(function:call(getSum, 10, 15, 25)); // 50
}

function getSum(int a = 0, int b = 10, int c = 20) returns int {
    return a + b + c;
}
```

If the arguments do not match the parameters expected by the function, the function call results in a panic.


```ballerina
import ballerina/io;

public function main() {
    callFn(getSum); // The `function:call` call results in a panic.
}

function callFn(function fn) {
    any|error value = function:call(fn, 10);
    io:println(value);
}

function getSum(int a, int b, int c) returns int {
    return a + b + c;
}
```

#### Backward incompatible changes

- A bug that resulted in allowing access to non-public error intersection types outside the module has been fixed.

```ballerina
public type E1 distinct error;
 
public type E2 distinct error;
 
type E3 distinct error;
 
type E4 distinct error;
 
type E5 E1 & E2; // not allowed to access outside the module
 
type E6 E3 & E4; // not allowed to access outside the module
```

- Fixed a bug that resulted in a compilation error not being logged for invalid usage of an on-conflict clause in a query with inner queries.

```ballerina
type Token record {|
    readonly int idx;
    string value;
|};

type TokenTable table<Token> key(idx);

public function main() {
    Token[] tbl = from Token i in (table key(idx) from var j in [1, 2]
                        select {
                            idx: j,
                            value: "A"
                        })
                    select {
                        idx: i.idx,
                        value: "A"
                    }
                    on conflict error("Duplicate Key"); // Now an error
}
```

- A bug that resulted in a compilation error not being logged when a spread field is used in a table member to specify a field that is part of the key sequence has been fixed. For every field name in the key sequence of a table, a mapping constructor member must have a specific field corresponding to the field.

```ballerina
type Employee record {
    readonly int id;
    string name;
    string dept;
};

public function main() {
    Employee employee = {
        id: 1234,
        name: "Amy Wilson",
        dept: "legal"
    };

    table<Employee> key(id) employees = table [
        // Results in an error now.
        {...employee}
    ];
}
```

#### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.2.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+label%3ATeam%2FCompilerFE+milestone%3A%222201.2.0%22).

### Runtime updates

#### New features

##### Strand dump

Allows getting the status of strands and strand groups during the execution of a Ballerina program.

This can be used to troubleshoot runtime errors. The Ballerina runtime will emit the strand dump to the standard output stream in the text format if it receives a `SIGTRAP` signal (`SIGTRAP` is not available on Windows).

E.g., if the PID of the running Ballerina program is `$PID`, you can get the strand dump by executing either `kill -SIGTRAP $PID` or `kill -5 $PID` command.

##### `StopHandler` Object

Allows registering a function that will be called during a graceful shutdown.

A call to `onGracefulStop` will result in one call to the handler function that was passed as an argument; the handler functions will be called after calling `gracefulStop` on all registered listeners, in the reverse order of the corresponding calls to `onGracefulStop`.

E.g., a `foo` function can be called during the graceful shutdown by registering it as follows.

`runtime:onGracefulStop(foo);`

#### Improvements


##### Type-reference type support at runtime

When a type is defined referring to another type, it will now be passed to the runtime as a `BTypeReferenceType` instance.

For example, the following code contains the `Integer` and `Student` type reference types.

```ballerina
type Integer int;

type Person record {|
    string name;
    Integer age;
|};

type Student Person;
```

##### Modified existing runtime APIs

The following runtime Java APIs are now supported to return the `BTypeReferenceType` instances.

```java
// from the `ArrayType`.
Type getElementType();

// from the `FunctionType`.
Parameter[] getParameters();
Type[] getParameterTypes();

// from the `Field`.
Type getFieldType();

// from the `BTypedesc`.
Type getDescribingType();
```

##### New runtime Java API

The following new runtime APIs are added to provide the referred type of a type reference type.  

- `TypeUtils.getReferredType()`
- `getReferredType()` in `ReferenceType`  

```ballerina
type Integer int;

type Quantity Integer;
```  

In the above example of the `Quantity` type,  
the `TypeUtils.getReferredType()` call will return the `int` type instance.  
The `getReferredType()` call on the `ReferenceType` will return another `BTypeReferenceType` instance with the `Integer` name.

#### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.2.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.2.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed).

### Standard library updates

#### New features

##### `io` package

- Added support for data mapping between Ballerina Records and CSV in CSV read/write APIs.

##### `constraint` package

- Introduced the `constraint` standard library package, which provides features to validate the values that have been assigned to Ballerina types

##### `http` package

- Implemented the `immediateStop()` function for the HTTP listener
- Added the initial support for HATEOAS
- Added support for client resource methods in the HTTP client
- Added IP addresses to both local and remote addresses
- Added proxy support for the HTTP2 client
- Added constraint validation to HTTP payload binding

##### `websocket` package

- Added constraint validation to WebSocket payload binding

##### `graphql` package

- Added the support for deprecation of fields and enum values
- Added the support for GraphQL interceptors

##### `serdes` package

- Introduced the `serdes` standard library package for serializing and deserializing Ballerina `anydata` subtypes
- Proto3 is the underlying technology used by this package to achieve serialization and deserialization

##### `os` Package
- Introduced the `exec()` function to support OS command execution in Ballerina

##### `xmldata` package

- Introduced new APIs such as `fromXml` and `toXml` to perform conversions between `XML` and `map<anydata>`. 
  The `toRecord` API is being deprecated by introducing this `fromXml` API
- Introduced a new config named `rootTag` in the `JsonOptions` to configure the name of the XML root element tag

##### `sql` Package
- Added schema client abstraction to support metadata retrieval from SQL databases. The implementation for the connectors will be added soon

##### `grpc` Package
- Introduced message-level annotations for the proto descriptor instead of a centralized proto descriptor
- Introduced packaging support
- Added stub generation support for nested directories

##### `kafka` Package
- Added constraint validation support for payload binding

##### `rabbitmq` Package
- Added constraint validation support for payload binding

##### `nats` Package
- Added constraint validation support for payload binding

#### Improvements

##### `http` package

- Made HTTP2 the default transport for the `http` package
- Updated the default response status as `HTTP 201` for POST resources

##### `random` Package
- Updated the `createDecimal()` function to be cryptographically secure

##### `grpc` Package
- Added sample client calls with dummy values to generated client files
- Removed caller client object when generating code in client mode
- Added a new `grpc:Descriptor` annotation for services as a replacement for the current `grpc:ServiceDescriptor`. Both annotations are supported now to maintain backward compatibility. The `grpc:ServiceDescriptor` will be removed in the future. (Please update the service annotation if stub files are regenerated for the existing gRPC services)

#### Bug Fixes

To view bug fixes, see the [GitHub milestone for 2201.2.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.2.0%22+label%3AType%2FBug).

### Code to Cloud updates

#### Improvements
The base image was updated to `ballerina/jvm-runtime:1.0` based on Alpine 3.15 with the necessary libraries.

#### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.2.0 (Swan Lake)](https://github.com/ballerina-platform/module-ballerina-c2c/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+2201.2.0%22+label%3AType%2FBug).

### Developer tools updates

#### New features

##### Language Server

- Added API docs reference support on hover. Now when you hover over a construct (class, type, function), the hover documentation will include a link to view the API docs specific to that construct
- Added new code actions to extract anonymous records into records and to generate undefined record types
- Introduced new source actions to generate getters and setters for class-level variables
- Added a new code action to make annotation declarations with the `source` attach point(s) constant
- Moved the `Optimize imports` code action to `Source action` and it no longer appears under the code action bulb. Source actions are displayed under `Source action` in the context menu

##### OpenAPI Tool
Added support for generating client resource methods in the client generation command. The preferred client method type can be chosen using the `--client-methods=<remote(default)|resource>` option.
- `$ bal openapi -i <OpenAPI contract> --client-methods=resource`
- `$ bal openapi -i <OpenAPI contract> --mode client --client-methods=resource`

##### SemVer validator CLI tool (Experimental)
Introduced the `bal semver` CLI command, which attempts to validate <a href="https://semver.org/">Semantic Versioning</a> compatibility of the local package changes against any previously published version(s) in Ballerina Central. Currently, the tool can be used to: 
- list down the source code differences (along with its compatibility impact) between the local and any published versions in Ballerina central
- suggest the new package version based on the compatibility impact of source code changes

Refer to the examples below which demonstrate a few key functionalities of the SemVer CLI tool.

- version suggestions
```
$bal semver             
checking for the latest compatible release version available in central...

current version: 1.2.2-SNAPSHOT
compatibility impact (compared with the release version '1.2.1'): backward-incompatible changes detected
suggested version: 2.0.0
```

- version suggestions with the list of source code changes
```
$bal semver --show-diff
checking for the latest compatible release version available in central...

=========================================================================
 Comparing version '1.2.2-SNAPSHOT'(local) with version '1.2.1'(central) 
=========================================================================
[+-] package 'io' is modified [version impact: MAJOR]
  [+-] module 'io' is modified [version impact: MAJOR]
    [++] function 'printlnNew' is added [version impact: MINOR]
    [+-] function 'println' is modified [version impact: MAJOR]
      [+-] documentation is modified [version impact: PATCH]
      [--] 'isolated' qualifier is removed [version impact: AMBIGUOUS]
      [++] 'transactional' qualifier is added [version impact: AMBIGUOUS]
      [++] new required parameter 'a' is added [version impact: MAJOR]
      [++] new defaultable parameter 'b' is added [version impact: MINOR]
      [+-] parameter type changed from 'Printable' to 'string' [version impact: AMBIGUOUS]
      [+-] function body is modified [version impact: PATCH]

current version: 1.2.2-SNAPSHOT
compatibility impact (compared with the release version '1.2.1'): backward-incompatible changes detected
suggested version: 2.0.0
```
##### CLI

Introduced the `bal graph` CLI command, which resolves the dependencies of the current package and prints the dependency graph in the console. This produces the textual representation of the dependency graph using the DOT graph description language.

```ballerina
$ bal graph
digraph "org/package:0.1.0" {
        node [shape=record]
        "org/package" [label="<0.1.0> org/package:0.1.0"];
        "ballerina/io" [label="<1.2.2> ballerina/io:1.2.2"];

        // Edges
        "org/package":"0.1.0" -> "ballerina/io":"1.2.2";
}
```

##### Compiler API

- Introduced a set of builders in the Types API, which are used to construct complex types that have varying components

##### Ballerina Update Tool

#### Improvements

##### Language Server
- Improved the `Create variable` code action in the `async send` action
- Added completion support for the resource access action context

##### OpenAPI Tool
Added support for OpenAPI schema constraint properties in client/service generation. With this improvement, the OpenAPI constraints will be applied as `ballerina/constraint` standard library package annotations when generating Ballerina clients and services from the OpenAPI definition.
The following OpenAPI properties are currently supported in the Ballerina OpenAPI generation tool.
- `minimum`, `maximum`, `exclusiveMinimum`, and `exclusiveMaximum` for `integer` and `number` types
- `minLength` and `maxLength` for `string` type
- `minItems` and `maxItems` for `array` type

To view bug fixes, see the GitHub milestone for 2201.2.0 (Swan Lake) of the repositories below.

- [Language Server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A%22Ballerina+2201.2.0%22+is%3Aclosed+label%3ATeam%2FLanguageServer)
- [update tool](https://github.com/ballerina-platform/ballerina-update-tool/issues?q=is%3Aissue+milestone%3A%22Ballerina+2201.2.0%22+is%3Aclosed+label%3AType%2FBug)

##### JSON to record converter
Improved JSON value to Ballerina record conversion logic, to enhance the conversion experience of `Paste JSON as record` feature in Ballerina VSCode extension.

###### Handling of array of elements/objects
Instead of looking at the first object of the array, all elements/objects would be looked at to generate the record field.
```json
[
    { "id": "5001", "index": "15" },
    { "id": "5002", "index": 16 }
]
```
```ballerina
type ArrayItem record {
    string id;
    (int|string) index;
};
```

###### Handling optional fields
If an element is present in a JSON object and not in another (in an array of objects), that field would be treated as an optional field.
```json
[
    { "id": "5001", "index": "15" },
    { "id": "5002" }
]
```
```ballerina
type ArrayItem record {
    string id;
    string index?;
};
```

###### Handling `null` values
JSON `null` fields would be treated as required fields with the `anydata` type.
```json
{
  "name": "Joe",
  "phoneNumber": null
}
```
```ballerina
type NewRecord record {
    string name;
    anydata phoneNumber;
};
```

>**Note:** The entire JSON value to Ballerina record conversion logic is rewritten to enhance the conversion experience. The above-mentioned scenarios are a few noticeable, important changes.

##### Compiler API

- Added semantic API support for the client resource access action

### Ballerina packages updates

#### New features

Introduced an `include` field under the `[package]` table in `Ballerina.toml`. It accepts a string array of paths to any additional files and directories, which need to be packed in the BALA file. The path should be relative to the package root directory.

```ballerina
[package]
org = "samjs"
name = "winery"
version = "0.1.0"
include = [documents/”, "images/sample.png"]
```

<!-- <style>.cGitButtonContainer, .cBallerinaTocContainer {display:none;}</style> -->
