---
layout: ballerina-left-nav-release-notes
title: 2201.5.0 (Swan Lake) 
permalink: /downloads/swan-lake-release-notes/2201.5.0/
active: 2201.5.0
redirect_from: 
    - /downloads/swan-lake-release-notes/2201.5.0
    - /downloads/swan-lake-release-notes/2201.5.0-swan-lake/
    - /downloads/swan-lake-release-notes/2201.5.0-swan-lake
    - /downloads/swan-lake-release-notes/
    - /downloads/swan-lake-release-notes
---

## Overview of Ballerina Swan Lake 2201.5.0

<em>2201.5.0 (Swan Lake Update 5) is the fifth update release of Ballerina Swan Lake, and it includes a new set of features and significant improvements to the compiler, runtime, standard library, and developer tooling. It is based on the 2022R4 version of the Language Specification.</em> 

## Update Ballerina

Update your current Ballerina installation directly to 2201.5.0 using the [Ballerina Update Tool](/learn/update-tool/) as follows.

1. Run `bal update` to get the latest version of the Update Tool.
2. Run `bal dist pull 2201.5.0` to update to this latest distribution.

## Install Ballerina

If you have not installed Ballerina, download the [installers](/downloads/#swanlake) to install.

>**Note:** From the 2201.5.0 release onwards, a [new installer](https://dist.ballerina.io/downloads/2201.5.0/ballerina-2201.5.0-swan-lake-macos-arm-x64.pkg) is introduced to support the macOS-ARM platform.

## Language updates

### New features

#### Introduction of the `int:range` lang library function

The `int:range` lang library function returns an iterable object, which iterates over a range of integers.

The `int:range(start, end, step)` function call will return an iterable object (`S`), which iterates over a range of integers from `start` (inclusive) to `end` (exclusive) with `step` being the difference between successive integers. `start`, `end`, and `step` are integer arguments.

- When `step` is greater than `0`, the members of `S` that are less than `end` are returned in increasing order.
- When `step` is less than `0`, the members of `S` that are greater than `end` are returned in decreasing order.
- When `step` is `0`, the function panics.
    
```ballerina
// Iterate over a range of integers from 0 (inclusive) to 5 (exclusive) with a step of 2 between each integer (i.e., 0, 2, 4).
foreach int i in int:range(0, 5, 2) {
    io:println(i);
}

// A negative step can be used to get a descending set of integers (i.e., 5, 3, 1).
foreach int i in int:range(5, 0, -2) {
    io:println(i);
}    
```

#### Language support for regular expressions

The language now supports regular expressions enabling powerful pattern-matching and text-processing operations. A new type, named `RegExp`, has been introduced in the new `lang.regexp` module (it can also be referred to using the type alias `RegExp` defined in the `lang.string` module). The `RegExp` type conforms to a subset of the ECMAScript specification for regular expressions.

```ballerina
import ballerina/lang.regexp;
import ballerina/io;

public function main() {
    string:RegExp reg = re `[bB].tt[a-z]*`;
    regexp:Span[] result = reg.findAll("Butter was bought by Betty.");
    io:println(result.length()); // Prints "2".

    regexp:Span span1 = result[0];
    io:println(span1.substring()); // Prints "Butter".

    regexp:Span span2 = result[1];
    io:println(span2.substring()); // Prints "Betty".
}
```

For more information, see the new [RegExp type example](/learn/by-example/regexp-type), [RegExp operations example](/learn/by-example/regexp-operations), [API Documentation](https://central.ballerina.io/ballerina/lang.regexp/latest), and [Regular expressions feature guide](/learn/advanced-general-purpose-language-features/#regular-expressions).

### Bug fixes

To view other bug fixes, see the [GitHub milestone for Swan Lake 2201.5.0](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FCompilerFE+milestone%3A2201.5.0+is%3Aclosed+label%3AType%2FBug).

## Runtime updates

### New features

#### New Runtime Java APIs

- Introduced the following API in the `io.ballerina.runtime.api.utils.ValueUtils` class to clone and convert an `anydata` value to another subtype of the `anydata` type.

    ```java
    public static Object convert(Object value, Type targetType);
    ```
    
- Introduced the `getFunctionName()` and `getPathParameters()` APIs in the runtime `io.ballerina.runtime.api.Environment` class. They provide the Ballerina function name and path parameters associated with an external Java method respectively.

### Improvements

#### Support for command-line arguments of built-in subtypes

The command-line arguments of the Ballerina built-in subtypes are now supported to be parsed as operands.

For the following `main` function,

```ballerina
public function main(byte byteVal, string:Char charVal, int:Signed8 int8Val) {
}
```

the values can be passed through command-line arguments as follows.

```
$ bal run -- 1 b 33
```

#### Support ambiguous union-type configurable variables

When a structural value is provided for a configurable variable of a union type that includes more than one type descriptor, the inherent type used will be the first (leftmost) type descriptor from which the value can be constructed.

For example, in the following Ballerina code,

```ballerina
type Person record {|
    string name;
    string city;
|};

configurable map<string>|Person configVar = ?;
```
and when the `Config.toml` file contents are as follows,

```toml
configVar = {name = "Jack", city = "Colombo"}
```

`configVar` is instantiated with the `map<string>` inherent type.

#### Support binding of resource methods to a generic native method

A new way has been introduced to support the binding of any resource method to a generic native method regardless of the resource path parameters. The generic native method should be defined with a `BArray` parameter, which represents all the path parameters. To avoid errors due to overloaded methods, it is recommended to define the parameter type constraints as well.

For example, the following Ballerina resource method,

```ballerina
isolated resource function get abc/[int p1]/[string p2]/[string p3]/[int... p4](string s) = @java:Method {
    'class: "javalibs.app.App",
    name: "getResource",
    paramTypes: ["io.ballerina.runtime.api.values.BObject", "io.ballerina.runtime.api.values.BArray", "io.ballerina.runtime.api.values.BString"]
} external;
```

can be bound to the following Java method.

```java
public static void getResource(BObject client, BArray path, BString str) {
}
```

#### Improvements in Runtime Java APIs

- Deprecated the `getType` runtime API, which returns an `ObjectType` in the `io.ballerina.runtime.api.values.BObject` class. Instead, a new `getOriginalType` API, which returns the `Type` is introduced to return both the `ObjectType` and the type-reference type.
- Deprecated the `XMLNS` Java constant in the `io.ballerina.runtime.api.values.BXmlItem` runtime class. Instead, the `javax.xml.XMLConstants.XMLNS_ATTRIBUTE` constant needs to be used.

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.5.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.5.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed).

## Standard library updates

### New features

#### `http` package

- Introduced a new HTTP status code error structure.
- Added support for allowing the tuple type in the resource return type.
- Added basic path parameter support for client resource methods.

#### `graphql` package

- Added support for the federation subgraph.

### Improvements

#### `http` package

- Made the `@http:Payload` annotation optional for the `post`, `put`, and `patch` actions.
- Rewrote the compiler plugin to resolve inconsistencies.

#### `graphql` package

- Added parallel execution support for GraphQL resolvers.
- Allowed adding a single interceptor without creating an array.
- Skipped additional validation for unused operations in the GraphQL document.
- Improved the listener's behavior to exit when a panic occurs.

#### `nats` package

- Improved the listener's behavior to exit when a panic occurs.

#### `rabbitmq` package

- Improved the listener's behavior to exit when a panic occurs.

#### `persist` package

>**Info:** The Ballerina persistence feature is an experimental feature. APIs might change in future releases.

- Added support for specifying the fields to be retrieved from the database table in the `get` function. This allows the user to retrieve only the required fields by setting up the target type of the `get` function.
- Added support for retrieving associated records from the database table in the `get` function. This allows the user to retrieve associated records along with the main record.
- Added support for setting multiple associations between the same entities. The relation owner should be the same for all associations.
- Added support for specifying the relation owner in the one-to-one association. The associated entity field must be an optional value field in the child entity.
- Added code actions to make defining the data model easier.

#### `regex` package

- The `regex` package has been deprecated and will no longer be maintained or updated. Instead, it is recommended to use the [`ballerina/lang.regexp`](https://lib.ballerina.io/ballerina/lang.regexp/latest) library. For more information, see the new [RegExp type example](/learn/by-example/regexp-type), [RegExp operations example](/learn/by-example/regexp-operations), and [Regular expressions feature guide](/learn/advanced-general-purpose-language-features/#regular-expressions).

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.5.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.5.0%22+label%3AType%2FBug).

## Code to Cloud updates

### Improvements

- Improved the Kubernetes Horizontal autoscaler to use `autoscaling/v2`.

## Developer tools updates

### New features

#### Language Server

- Added quick fix support for the `Extract to local variable` and `Extract to function` code actions.
- Added completion support for regular expressions.

#### Persist Tool

>**Info:** The Ballerina persistence feature is an experimental feature. The commands associated with the tool might change in future releases.

- Added the following new arguments to the `persist init` commands.
    - `--datastore` - This is used to indicate the preferred database client. Currently, only `mysql` is supported.
    - `--module` - This is used to indicate the module in which the files are generated.

    For example,

    ```bash
    $ bal persist init --datastore mysql --module db
    ```
- Changed the `persist init` command to create a `persist` directory in the Ballerina project and generate a new definition file (`model.bal`) in the `persist` directory if the file does not exist.
- Restricted to have only one persist model definition per Ballerina package.
- Removed the `persist push` command support and generate SQL script file in the `persist generate` command. The generated SQL script file needs to be executed manually to create the database table.
- Changed the `persist generate` command to generate all the Ballerina client, types, `db_config` files, and the SQL script files in the `generated/<module_name>` directory.
- Renamed the generated files to the following.
  - `generated_client.bal` -> `persist_client.bal`
  - `generated_types.bal` -> `persist_types.bal`
  - `database_configuration.bal` -> `persist_db_config.bal`
  - `<schema_name>_db_script.sql` -> `script.sql`
- Changed the code in the generated Ballerina client and types files to support the new changes.

### Improvements

#### Bindgen tool 

- Added the `--with-optional-types`, `--with-optional-types-param`, and `--with-optional-types-return` command options to the `bal bindgen` command, to support handling Java null values via generated bindings. These command options will generate optional (i.e., nilable) types for parameter or/and return types in generated Ballerina binding functions.

    Consider the Java methods below and the corresponding Ballerina binding functions generated with and without the new command options.

    ```java
    // Parameters and return types having inbuilt object types (`java.lang.String`).
    public String f1(String str) {
        return str;
    }
        
    // Parameter and return types having external object arrays (`Foo[]`).
    public Foo[] f2(Foo[] fooArray) {
        return fooArray;
    }
    ```
    
    **Without optional types** 
    
    ```bash
    $ bal bindgen
    ```
        
    ```ballerina
    public function f1(string arg0) returns string {
        return java:toString(Foo_strParamReturns(self.jObj, java:fromString(arg0))) ?: "";
    }

    public function f2(Foo[] arg0) returns Foo[]|error {
        handle externalObj = Foo_objArrayParamReturns(self.jObj, check jarrays:toHandle(arg0, "Foo"));
        Foo[] newObj = [];
        handle[] anyObj = <handle[]>check jarrays:fromHandle(externalObj, "handle");
        int count = anyObj.length();
        foreach int i in 0 ... count - 1 {
            Foo element = new (anyObj[i]);
            newObj[i] = element;
        }
        return newObj;
    }
    ```
    
    **With optional types**

    ```bash
    $ bal bindgen --with-optional-types
    ``` 
        
    ```ballerina
    public function f1(string? arg0) returns string? {
        return java:toString(Foo_strParamReturns(self.jObj, arg0 is () ? java:createNull() : java:fromString(arg0)));
    }

    public function f2(Foo?[]? arg0) returns Foo?[]?|error {
        handle externalObj = Foo_objArrayParamReturns(self.jObj, check jarrays:toHandle(arg0 ?: [], "Foo"));
        Foo?[]? newObj = [];
        handle[] anyObj = <handle[]>check jarrays:fromHandle(externalObj, "handle");
        int count = anyObj.length();
        foreach int i in 0 ... count - 1 {
            Foo? element = new (anyObj[i]);
            if (newObj is Foo?[]) {
                newObj[i] = element;
            }
        }
        return newObj;
    }
    ```

#### Language Server

- Updated the LSP4J version to 0.15.0.
- Added annotation completions for the tuple member context.
- Added snippet completions for the `string` and `xml` templates.
- Added code action support for regular expressions.
- Added field access completions for template expressions.

#### OpenAPI Tool

- Updated the tool to handle multiple media types with the same return code in the Ballerina service to OpenAPI contract generation. 
- Added support to handle the newly introduced `@http:Query` annotation of the `ballerina/http` module in the Ballerina service to OpenAPI contract generation.
- Added support to generate API documentation for resource methods when generating Ballerina services using openAPI contracts.

### Bug fixes

To view bug fixes, see the GitHub milestone for 2201.5.0 (Swan Lake) of the repositories below.

- [Test Framework](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+label%3AArea%2FTestFramework+milestone%3A2201.5.0)
- [Language Server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FLanguageServer+milestone%3A2201.5.0+is%3Aclosed+label%3AType%2FBug)
- [OpenAPI](https://github.com/ballerina-platform/openapi-tools/issues?q=is%3Aclosed+milestone%3A%22Swan+Lake+2201.5.0%22+label%3AType%2FBug)

## Ballerina packages updates

### New features

- Introduced the `bal deprecate` command. With this, now, a version of a package in Ballerina Central can be deprecated and undeprecated by the owner.

### Improvements

- Added support for maintaining generated test code in a Ballerina package.
- Improved the dependency resolution to minimize the impact of essential incompatible changes added with new Update releases.

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.5.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A2201.5.0+label%3AArea%2FProjectAPI).

## Backward-incompatible changes

- Fixed a bug that resulted in invalid usage of additive expressions with operands of different incompatible basic types not resulting in a compilation error.

    ```ballerina
    public function main() {
        "abc"|string:Char a = "a";
        var b = a + 1; // Compilation error now.
        var c = ["a", "b", "c"].map(s => s + 1); // Compilation error now.
    }
    ```

- Fixed a bug that previously resulted in incorrect type checking for an intersection with `readonly` against an incompatible union type as the expected type.

    ```ballerina
    type Employee record {|
        string[] name;
        int id;
    |};

    public function main() {
        json & readonly v = {};

        string|error r = v; // Compilation error now.
        Employee|string s = v.cloneReadOnly(); // Compilation error now.
    }
    ```

- Fixed a bug that previously resulted in variables that were initialized with non-isolated expressions being inferred as `isolated` variables.

    ```ballerina
    int[] config = [];

    // `configs` was previously inferred as an `isolated` variable
    // incorrectly. It will no longer be inferred as an `isolated` 
    // variable since `config` is not an isolated expression.
    int[][] configs = [[1, 2], config];

    // Since `configs` is not inferred as an `isolated` variable now,
    // `getConfig` is not inferred as an `isolated` function.
    function getConfig(int index) returns int[] {
        lock {
            return configs[index].clone();
        }
    }
    ```

- Fixed a bug in dependently-typed function analysis. Previously, compilation errors were not logged when the `typedesc` argument is defined using a type definition (`T`) and the return type is a union (`T|t`) in which basic types for `T` and `t` are not disjoint.

    ```ballerina
    public type TargetType typedesc<anydata>;

    // Already a compilation error.
    function f1(typedesc<anydata> targetType = <>) returns targetType|json = external;

    // Also a compilation error now.
    function f2(TargetType targetType = <>) returns targetType|json = external;
    ```

- Fixed a bug that allowed using an included record parameter of the same name as that of a field of the parameter record type.
    
    ```ballerina
    type ErrorDetail record {|
        string 'error;
        int code;
        int[] locations?;
    |};
    
    function getError(*ErrorDetail 'error) { // Compilation error now.
    }
    ```

- Improved how the inherent type is chosen when constructing a structural value in the `value:cloneWithType` and `value:fromJsonWithType` functions. Now, if the target type is a union that includes more than one type descriptor such that a value belonging to that type can be constructed, then, the inherent type used will be the first (leftmost) such type descriptor. Hence, the inherent type of the constructed value may differ from what it was previously.
    
    ```ballerina
    type FloatSubtype record {|
        float value;
    |};

    type DecimalSubtype record {|
        decimal value;
    |};

    public function main() returns error? {
        FloatSubtype x = {value: 0.0};
        DecimalSubtype|FloatSubtype y = check x.cloneWithType(); // Inherent type of `y` will be `DecimalSubtype`.
    }
    ```

- Fixed a bug that resulted in inconsistent error messages with the `value:cloneWithType` function.
    
    ```ballerina
    type OpenRecord record {
    };

    public function main() returns error? {
        [OpenRecord...] tupleVal = [{"nonJson": xml `<a>abc</a>`}];
        json jsonVal = check tupleVal.cloneWithType();
    }
    ```
    Now, this gives the error below.
    
    ```
    error: {ballerina/lang.value}ConversionError {"message":"'[OpenRecord...]' value cannot be converted to 'json'"}    
    ```

- Improved the message given by an error returned from the `value:cloneWithType` and `value:fromJsonWithType` functions when the target type is a union type.
    
    ```ballerina
    public function main() returns error? {
        json j = [1, 1.2, "hello"];
        int[]|float[] val = check j.fromJsonWithType();
    }
    ```
    Now, this gives the error below.
    
    ```
    error: {ballerina/lang.value}ConversionError {"message":"'json[]' value cannot be converted to '(int[]|float[])': 
                {
                  array element '[2]' should be of type 'int', found '"hello"'
                or
                  array element '[2]' should be of type 'float', found '"hello"'
                }"}
    ```

- Added validations for the incorrect use of the `@test` annotation (i.e., disallowed the usage of it on resource methods and object methods). Previously, the annotation was ignored and the code compiled successfully.

    ```ballerina
    distinct service class Book {
        @test:Config // Compilation error now.
        resource function get id() {
        }
        
        resource function get title() {
        }
    }
    ```
