---
layout: ballerina-left-nav-release-notes
title: 2201.1.0 (Swan Lake Update 1)
permalink: /downloads/swan-lake-release-notes/2201.1.0/
active: 2201-1-0
redirect_from:
    - /downloads/swan-lake-release-notes/2201-1-0
    - /downloads/swan-lake-release-notes/2201-1-0-swan-lake/
    - /downloads/swan-lake-release-notes/2201-1-0-swan-lake
---

## Overview of Ballerina 2201.1.0 (Swan Lake Update 1)

<em>2201.1.0 (Swan Lake Update 1) is the first update of 2201.0.0 (Swan Lake), and it includes a new set of features and significant improvements to the compiler, runtime, standard library, and developer tooling. It is based on the 2022R2 version of the Language Specification.</em>


## Update Ballerina

If you are already using Ballerina, use the [Ballerina Update tool](/learn/tooling-guide/cli-tools/update-tool/) to directly update to 2201.1.0 by running the command below.

> `bal dist pull 2201.1.0`

## Install Ballerina

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.

## Language updates

### New features

#### Support for the spread operator in the list constructor

Introduced spread operator support for the list constructor expression.

If the spread operator in a list constructor expression is `...x`, then, `x` is expected to be a list (i.e., an array or a tuple). All the member values of the list that result from evaluating `x` are included in the list value being constructed.

```ballerina
public function main() {
    int[] a1 = [3, 4];
    int[] v1 = [1, 2, ... a1];
    io:println(v1); // [1,2,3,4]

    int[2] a2 = [6, 7];
    int[] v2 = [1, 2, ... a1, 5, ... a2];
    io:println(v2); // [1,2,3,4,5,6,7]

    [int, string] t1 = [5, "s"];
    any[] v3 = [ ... t1, "x"];
    io:println(v3); // [5,"s","x"]

    [boolean, int...] t2 = [false, 4, 7];
    [string, int, string, boolean, int...] v4 = ["x", ... t1, ... t2];
    io:println(v4); // ["x",5,"s",false,4,7];

    var v5 = [4, ... t1, ... a2];
    io:println(v5); // [4,5,"s",6,7];
}
```

The spread operator is not allowed with a variable-length list if the inherent type of the list being constructed has required members that are not guaranteed to have been provided a value.

```ballerina
import ballerina/io;

public function main() {
    [int, string...] t1 = [5, "s"];
    [int, string, string...] v1 = [ ... t1]; // Results in an error since a value is not guaranteed to have been provided for the second tuple member.

    [int, boolean, string, int...] t2 = [5, false, "w"];
    [int, boolean, anydata...] v2 = [ ... t2, "x", "y"]; // Works as all fixed tuple members are guaranteed to have been provided values.
}
```

#### Added support for multiplicative expressions with `int` and `float` or `decimal` operands

Multiplicative expressions are now allowed with certain combinations of `int` and `float` operands and `int` and `decimal` operands. The type of the resulting expression will be the floating-point type.

This allows the below.
- Multiplication supports `int*float`, `float*int`, `int*decimal`, and `decimal*int`
- For division and modulo, only the floating-point operand is supported as the dividend (i.e., `float/int`, `decimal/int`, `float%int`, and `decimal%int` are supported)

```ballerina
import ballerina/io;

public function main() {
    int quantity = 5;
    float weight = 2.5;
    decimal unitPrice = 10.55;

    float totalWeight = weight * quantity;
    io:println(totalWeight); // 12.5
    decimal totalPrice = unitPrice * quantity;
    io:println(totalPrice); // 52.750

    float weightInGrams = 2456;
    int gramsPerKG = 1000;
    float weightInKG = weightInGrams / gramsPerKG;
    io:println(weightInKG); // 2.456

    decimal totalAmount = 1000.5;
    int numberOfPersons = 3;
    decimal remainingAmount = totalAmount % numberOfPersons;
    io:println(remainingAmount); // 1.5
}
```

#### New lang library functions

##### New `lang.array:some()` function

The `lang.array:some()` function tests whether a function returns `true` for some member of a list.

```ballerina
import ballerina/io;

function greaterThanTwo(int i) returns boolean {
    return i > 2;
}

public function main() {
    int[] arr = [1, 3];
    io:println(arr.some(greaterThanTwo)); // true

    [string, string...] tup = ["hello", "world"];
    io:println(tup.some(x => x.length() == 0)); // false
}
```

##### New `lang.array:every()` function

The `lang.array:every` function tests whether a function returns `true` for every member of a list.

```ballerina
import ballerina/io;

function greaterThanTwo(int i) returns boolean {
    return i > 2;
}

public function main() {
    int[] arr = [5, 3, 45];
    io:println(arr.every(greaterThanTwo)); // true

    [string, string] tup = ["", "ballerina"];
    io:println(tup.every(x => x.length() == 0)); // false
}
```

##### New `lang.decimal:quantize()` function

The `lang.decimal:quantize()` function is introduced to control the precision of decimal values. This returns a value equal to the first operand after rounding with the exponent of the second operand.

```ballerina
import ballerina/io;

public function main() {
    io:println(decimal:quantize(123.123, 1.0)); // 123.1
    io:println(decimal:quantize(123.123, 1.00)); // 123.12
    io:println(decimal:quantize(123.123, 1.000)); // 123.123
}
```

If the length of the coefficient after the quantize operation is greater than the precision, the function call results in a panic.

```ballerina
public function main() {
    decimal _ = decimal:quantize(123.1233, 1E-36); // Results in a panic.
}
```

##### New `lang.float:toFixedString()` and `lang.float:toExpString()` functions

Two new functions, `lang.float:toFixedString()` and `lang.float:toExpString()`, have been introduced to get the string representation of a `float` value in fixed-point notation and scientific notation respectively. Both the functions allow you to specify the number of digits required after the decimal point.

```ballerina
import ballerina/io;

public function main() {
    string a = float:toFixedString(5.7, 16);
    io:println(a); // 5.7000000000000002
    string b = float:toFixedString(5.7, 2);
    io:println(b); // 5.70

    float f1 = -45362.12334;
    string c = float:toExpString(f1, 16);
    io:println(c); // -4.5362123339999998e+4
    string d = float:toExpString(f1, 2);
    io:println(d); // -4.54e+4
}
```

##### New `lang.string:padStart()`, `lang.string:padEnd()`, and `lang.string:padZero()` functions

The `lang.string:padStart()`, `lang.string:padEnd()`, and `lang.string:padZero()` functions have been introduced to add padding in strings.
- `lang.string:padStart()` adds padding to the start of a string
- `lang.string:padEnd()` adds padding to the end of a string
- `lang.string:padZero()` pads a string with zeros

```ballerina
import ballerina/io;

public function main() {
    io:println("abc".padStart(5, "#").toBalString()); // "##abc"
    io:println("abc".padStart(5).toBalString()); // "  abc"
    io:println("abc".padEnd(5, "#").toBalString()); // "abc##"
    io:println("abc".padEnd(5).toBalString()); // "abc  "
    io:println("123".padZero(5).toBalString()); // "00123"
    io:println("123".padZero(5, "#").toBalString()); // "##123"
}
```

### Improvements

#### Revamped `lang.float:round` function

The function signature has been changed to have an extra `fractionDigits` parameter, by which, you can specify the number of fraction digits of the rounded result. When `fractionDigits` is zero, the function rounds to an integer.

```ballerina
import ballerina/io;

public function main() {
    float x = 555.545;
    float y = 5.5565;
    int fractionDigits = 3;

    io:println(555.545.round(1)); // 555.5
    io:println(555.545.round(2)); // 555.54
    io:println(float:round(x)); // 556.0
    io:println(float:round(x, fractionDigits = 0)); // 556.0
    io:println(float:round(x, 1));  // 555.5
    io:println(y.round(2)); // 5.56
    io:println(y.round(fractionDigits)); // 5.556
}
```

#### Revamped `lang.decimal:round` function

The function signature has been changed to have an extra `fractionDigits` parameter, by which, you can specify the number of fraction digits of the rounded result. When `fractionDigits` is zero, the function rounds to an integer.

```ballerina
import ballerina/io;

public function main() {
    io:println(5.55.round(1)); // 5.6
    decimal x = 5.55;
    io:println(decimal:round(x)); // 6
    io:println(decimal:round(5.55, fractionDigits = 0)); // 6
    io:println(decimal:round(5.5565, fractionDigits = 3)); // 5.556
}
```

#### Removed the compilation error for an unreachable panic statement

An unreachable panic statement no longer results in a compilation error.

```ballerina
function fn() returns string {
    int|string a = 10;

    if a is int {
        return "INT";
    } else {
        return "STRING";
    }

    panic error("Not Reached!"); // Unreachable but not an error.
}
```

#### Updated `lang.error:Cloneable` to be `public`

The `Cloneable` type in the `lang.error` module is now `public`.

```ballerina
import ballerina/io;

public function main() {
    error:Cloneable x = 4;
    error e1 = error("reason 1", message = "My Detail");
    map<error:Cloneable> m1 = e1.detail();

    io:println(x);  // 4
    io:println(m1); // {"message":"My Detail"}
}
```

#### Disallowed inferring array length in contexts that are not permitted

Inferring array length has been restricted to list constructors in variable and constant declarations. Moreover, only the first dimension can be inferred in multidimensional arrays.

```ballerina
int[*] x1 = [1, 2]; // Supported.

int[2] y = [1, 2];
int[*] x2 = y; // Not supported. Requires a list constructor to infer the array length.

int[*][2] x3 = [[1, 2], [1, 2]]; // Supported.
int[*][*] x4 = [[1, 2], [1, 2]]; // Not supported. Only the first dimension can be inferred.
```

### Bug fixes

- Fixed an invalid sub-typing relationship between `table` and `anydata`

    ```ballerina
    public function main() {
        table<map<any>> tany = table [{"a": 2}];
        anydata ad = tany; // Results in a compilation error now.
    }
    ```

- Fixed an issue that caused a union containing the `null` literal allowing `"null"` as a valid value

    ```ballerina
    type Foo boolean|null;

    public function main() {
        Foo a = "null"; // Results in a compilation error now.
        "string"|null b = "null"; // Results in a compilation error now.
    }
    ```

- Fixed an issue that caused the value of enum members defined with quoted identifiers to include the quote

    ```ballerina
    import ballerina/io;

    public enum Status {
        'new,
        old
    }

    public function main() {
        io:println('new); // Previously printed `'new`, now prints `new`.
    }
    ```

- Fixed a bug that resulted in a compilation error not being logged for an extra comma in a mapping match pattern

    ```ballerina
    type MyRecord record {
        int field1;
        int field2;
    };

    function fn(MyRecord r1) {
        match r1 {
            {field1: 0,} => { // A syntax error is now given for the comma.

            }
        }
    }
    ```

- Fixed qualified identifiers not being allowed in error match patterns

    ```ballerina
    function fn(error e) {
        match e {
            error(errors:MESSAGE) => { // Match pattern is now allowed.

            }
        }
    }
    ```

- Fixed the inherent type of a list constructed using a list constructor with `any` as the contextually-expected type to be `(any|error)[]` instead of `any[]`

    ```ballerina
    public function main() {
        any x = [1, 3, 4];
        if x is (any|error)[] {
            x.push(error("invalid!")); // Allowed now. Previously, failed at runtime.
        }
    }
    ```

- Fixed a bug that allowed additive expressions with operands of types that are union types of different basic types

    ```ballerina
    public function main() {
        int|float a = 4;
        int|float b = 4.5;

        int _ = a + b; // Now, this results in a compilation error.
    }
    ```

To view bug fixes, see the [GitHub milestone for Ballerina 2201.1.0 (Swan Lake Update 1)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+label%3ATeam%2FCompilerFE+milestone%3A%22Ballerina+2201.1.0%22).

## Runtime updates

### Improvements

#### Added support to provide values for configurable variables through TOML in-line tables

The configurable feature is improved to support TOML in-line tables through the TOML syntax.
The values for configurable variables of types `map` and `record` can now be provided using TOML in-line tables.
Similarly, the values for configurable variables of types array of `map`, array of `record`, and `table` can now be provided using the TOML array of TOML in-line tables.

For example, if the configurable variables are defined in the following way,

```ballerina
configurable map<anydata> mapVar = ?;
configurable Person recordVar = ?;
configurable table<map<int>> tableVar = ?;
configurable Person[] recordArrayVar = ?;

```

the values can be provided in the `Config.toml` file as follows.

```toml
mapVar = {a = "a", b = 2, c = 3.4, d = [1, 2, 3]}

recordVar = {name = "Jane"}

tableVar = [{a = 1, b = 2}, {c = 3}, {d = 4, e = 5, f = 6}]

recordArrayVar = [{name = "Tom"}, {name = "Harry"}]

```

#### Improved configurable variables to support tuple types through TOML syntax

The configurable feature is improved to support variables of tuple types through the TOML syntax.

For example, if the tuple-typed configurable variables are defined in the following way,

```ballerina
configurable [int, string, float, decimal, byte, boolean] simpleTuple = ?;
configurable [int[], [string, int], map<anydata>, table<map<string>>] complexTuple = ?;
configurable [int, string, int...] restTuple = ?;
```

the values can be provided in the `Config.toml` file as follows.

```toml
simpleTuple = [278, "string", 2.3, 4.5, 2, true]

complexTuple = [[1, 3, 5, 7, 9], ["apple", 2], {name = "Baz Qux", age = 22}, [{a = "a"}, {b = "b", c = "c"}]]

restTuple = [1, "foo", 2, 3, 4, 5]
```

#### Improved configurable variables to support union types through CLI arguments

The configurable feature is improved to support variables of union types with simple basic typed members through the CLI arguments.

For example, if the configurable variables are defined in the following way,

```ballerina
configurable float|int|string unionVar = ?;
```

the values can be provided via CLI arguments in the following way.

```bash
bal run -- -CunionVar=5.0
```

#### Improved runtime error creator and value creator API input validations

In order to handle Java Exceptions due to the invalid use of Ballerina runtime error creator and value
creator APIs, input validations have been improved to provide proper ballerina runtime errors.
For example, the following invalid use of the `ValueCreator.createRecordValue` API to create a record value with a Java ArrayList as a field of it will result in a panic.

```java
 public class App {

    private static Module module = new Module("org", "interop_project.records", "1");

    public static BMap<BString, Object> getRecord(BString recordName) {
        ArrayList<Integer> arrayList = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));
        Map<String, Object> map = Map.ofEntries(
                Map.entry("arrList", arrayList)
        );
        return ValueCreator.createRecordValue(module, recordName.getValue(), map);
    }
}
```

in modules/records

```ballerina
import ballerina/jballerina.java;

public type Foo record {
    int[] x;
};

public function getRecord(string recordName) returns record{} = @java:Method {
    'class: "javalibs.app.App"
} external;
```

`main.bal`

```ballerina
import interop_project.records;

public function main() {
    records:Foo foo =  <records:Foo> records:getRecord("Foo");
}
```
Runtime error:
```
'class java.util.ArrayList' is not from a valid java runtime class. " +
        "It should be a subclass of one of the following: java.lang.Number, java.lang.Boolean or " +
        "from the package 'io.ballerina.runtime.api.values'
```

### New features

#### New runtime Java API to create an enum type
New runtime Java API can be used to create enum types from native code.


```java
public static UnionType createUnionType(List<Type> memberTypes, String name, Module pkg, int typeFlags, boolean isCyclic, long flags)
```

### Bug fixes

To view bug fixes, see the [GitHub milestone for Ballerina 2201.1.0 (Swan Lake Update 1)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+2201.1.0%22+label%3AType%2FBug+label%3ATeam%2FjBallerina+).

## Standard library updates

### New features

#### `ftp` package

- Introduced the `ftp:Caller` API and added it as an optional parameter in the `onFileChange` method
- Added compiler plugin validation support for the `ftp:Service`
- Added code-actions to generate an `ftp:Service` template

#### `http` package

- Introduced `ResponseInterceptor` and `ResponseErrorInterceptor`
- Introduced `DefaultErrorInterceptor`
- Added code-actions to generate the interceptor method template
- Allowed records to be annotated with `@http:Header`
- Added basic type support for header parameters in addition to `string` and `string[]`
- Added `anydata` support for service and client data binding
- Added common constants for HTTP status-code responses
- Added union type support for service and client data binding
- Added OpenAPI definition field in the service config

#### `websocket` package

- Introduced the `writeMessage` client and caller APIs
- Introduced the `onMessage` remote function for services
- Added `anydata` data binding support for the `writeMessage` API and `onMessage` remote function

#### `graphql` package

- Added the support for GraphQL `subscriptions`
- Added the support for GraphQL `documentation`
- Added the `GraphiQL client` support for GraphQL services

#### `websub` package

- Added code-actions to generate a `websub:SubscriberService` template

#### `regex` package

- Introduced the API to extract the first substring from the start index in the given string that matches the regex
- Introduced the API to extract all substrings in the given string that match the given regex
- Introduced the API to replace the first substring from the start index in the given string that matches the given regex with the provided replacement string or the string returned by the provided function. The `replaceFirst()` API is being deprecated by introducing this API
- Allowed passing a replacer function to `replace` and `replaceAll` APIs. Now the regex matches can be replaced with a new string value or the value returned by the specified replacer function

#### `file` package

- Introduced the constants for path and path list separators
  - `file:pathSeparator`: It is a character used to separate the parent directories, which make up the path to a specific location. For windows, it’s `\` and for UNIX it’s `/`
  - `file:pathListSeparator`: It is a character commonly used by the operating system to separate paths in the path list. For windows, it’s `;` and for UNIX it’s `:`

#### `os` package
- Introduced the `setEnv()` function to set an environment variable
- Introduced the `unsetEnv()` function to remove an environment variable from the system
- Introduced the `listEnv()` function to list the existing environment variables of the system

### Improvements

#### `http` package

- Allowed `Caller` to respond to an `error` or a `StatusCodeResponse`
- Appended the HTTPS scheme (`https://`) to the client URL if security is enabled
- Refactored the auth-desugar response with a `DefaultErrorInterceptor`
- Hid the subtypes of the `http:Client`

#### `jwt` package

- Appended the HTTPS scheme (`https://`) to the client URL (of JWKs endpoint) if security is enabled

#### `oauth2` package

- Appended the HTTPS scheme (`https://`) to the client URL (of token endpoint or introspection endpoint) if security is enabled

### Bug fixes

To view bug fixes, see the [GitHub milestone for Ballerina 2201.1.0 (Swan Lake Update 1)](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.1.0%22+label%3AType%2FBug).

## Deployment updates

### New features

Added the `name` field for the `cloud.config.files` property in the `Cloud.toml` file to change the name of the generated config map
```toml
[[cloud.config.files]]
file="./conf/Config.toml"
name="sample-config"
```

### Improvements
- Reduced the package size of `ballerina/cloud`
- Docker image generation now relies on the user's docker client
- Added the `ballerinax/awslambda` package in [Ballerina Central](https://central.ballerina.io/ballerinax/awslambda)
- Added the `ballerinax/azure_functions` package in [Ballerina Central](https://central.ballerina.io/ballerinax/azure_functions)

### Breaking changes

Due to an improvement in `ballerinax/azure_functions` and `ballerinax/awslambda` packages, the versions shipped with previous distributions are incompatible with Swan Lake Update 1 and therefore were removed from the distribution. If your packages use these dependencies, delete the `Dependencies.toml` file to force the dependency resolver to use the latest versions from Ballerina Central

### Bug fixes

To view bug fixes, see the [GitHub milestone for Ballerina 2201.1.0 (Swan Lake Update 1)](https://github.com/ballerina-platform/module-ballerina-c2c/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A%22Ballerina+Swan+Lake+-+2201.1.0%22).

## Developer tools updates

### New features

#### AsyncAPI tool

Introduced the AsyncAPI tool, which will make it easy for you to start the development of an event API documented in an AsyncAPI contract in Ballerina by generating Ballerina service and listener skeletons. Ballerina Swan Lake supports the [AsyncAPI Specification version 2.x](https://www.asyncapi.com/docs/specifications/v2.0.0). For more information, see [Ballerina AsyncAPI support](/learn/ballerina-asyncapi-support) and [AsyncAPI CLI documentation](/learn/cli-documentation/asyncapi/#asyncapi-to-ballerina).

#### GraphQL client tool

Introduced the GraphQL client tool, which will make it easy for you to generate a client in Ballerina given the GraphQL schema (SDL) and GraphQL queries. Ballerina Swan Lake supports the GraphQL specification [October 2021 edition](https://spec.graphql.org/October2021/). For more information, see [Ballerina GraphQL support](/learn/ballerina-graphql-support/) and [GraphQL CLI documentation](/learn/cli-documentation/graphql/#graphql-to-ballerina).

#### Language server

- Introduced a new code action called `Make construct public` to make a construct public
- Added completion and code action support to suggest packages pulled from Ballerina central

### Improvements

#### Debugger

Added runtime breakpoint verification support. With this improvement, the debugger is expected to verify all the valid breakpoint locations in the current debug source. All the breakpoints that are set on non-executable lines of code (i.e., Ballerina line comments, documentation , blank lines, declarations, etc.) will be marked as `unverified` in the editor.

#### Language server

- Improved the `Document this` code action to support module-level variables
- Added signature help for included record params
- Revamped the code action utilities introducing a new API to find the top-level node for a given code action context
- Improved completion item sorting in several contexts
- Improved the `Create function` code action to handle named arguments
- Improved the `Create function` code action to add an isolated qualifier
- Added signature help for union-typed expressions

#### OpenAPI tool

##### Improved the OpenAPI service validator

- Added support to validate the Ballerina resource headers with OpenAPI operation headers. With this improvement, the validator gives validation errors on missing headers, undocumented headers, and type mismatch of the header parameters.
- Added support to validate the Ballerina resource return type with OpenAPI operation response. With this improvement, the validator gives validation errors on missing return status codes, missing return payload types, undocumented return status codes, and undocumented payload media types.

#### Bug fixes

To view bug fixes, see the GitHub milestone for Ballerina 2201.1.0 (Swan Lake Update 1) of the repositories below.

- [Language server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+label%3ATeam%2FLanguageServer+milestone%3A%22Ballerina+2201.1.0%22+)
- [OpenAPI](https://github.com/ballerina-platform/openapi-tools/issues?q=is%3Aissue+label%3AType%2FBug+milestone%3A%22Swan+Lake+2201.1.0%22+is%3Aclosed)

<style>.cGitButtonContainer, .cBallerinaTocContainer {display:none;}</style>

## Ballerina packages updates

### Improvements
Added support to specify the minimum required dependency version in the `Ballerina.toml` file. With this improvement, the dependencies will get updated to the specified version or the latest compatible version.

For example, the minimum version of the `ballerinax/mysql` dependency can be specified in the following way.
```toml
[[dependency]]
org = "ballerinax"
name = "mysql"
version = "1.3.0”
```
