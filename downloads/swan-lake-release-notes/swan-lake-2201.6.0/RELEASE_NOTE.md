---
layout: ballerina-left-nav-release-notes
title: 2201.6.0 (Swan Lake) 
permalink: /downloads/swan-lake-release-notes/2201.6.0/
active: 2201.6.0
redirect_from: 
    - /downloads/swan-lake-release-notes/2201.6.0
    - /downloads/swan-lake-release-notes/2201.6.0-swan-lake/
    - /downloads/swan-lake-release-notes/2201.6.0-swan-lake
    - /downloads/swan-lake-release-notes/
    - /downloads/swan-lake-release-notes
---

## Overview of Ballerina Swan Lake 2201.6.0

<em>2201.6.0 (Swan Lake Update 6) is the sixth update release of Ballerina Swan Lake, and it includes a new set of features and significant improvements to the compiler, runtime, standard library, and developer tooling. It is based on the 2022R4 version of the Language Specification.</em> 

## Update Ballerina

Update your current Ballerina installation directly to 2201.6.0 using the [Ballerina Update Tool](/learn/cli-documentation/update-tool/) as follows.

1. Run `bal update` to get the latest version of the Update Tool.
2. Run `bal dist update` to update to this latest distribution.

## Install Ballerina

If you have not installed Ballerina, download the [installers](/downloads/#swanlake) to install.

## Backward-incompatible changes

- `self` of an object is now implicitly final and cannot be assigned to.

    ```ballerina
    class Counter {
        private int i = 0;

        function updateSelf() {
            self = new; // Compilation error now.
        }

        function increment() {
            lock {
                self.i += 1;
            }
        }
    }    
    ```

  This also allows using `self` of an object that is a subtype of `readonly` or `isolated object {}` as a captured variable within an `isolated` anonymous function.

    ```ballerina
    isolated class Filter {
        final string[] & readonly words;
        private int length;

        isolated function init(string[] & readonly words, int length) {
            self.words = words;
            self.length = length;
        }

        isolated function setLength(int length) {
            lock {
                self.length = length;
            }
        }

        isolated function getCount() returns int =>
            self.words.filter(
                // Allowed now.
                word => word.length() == self.length).length();
    }
    ```

- Fixed a bug that allowed assigning `nil` to a record field with member access expressions when there are no fields of optional types. This previously resulted in a runtime panic if the value was `nil`.

    ```ballerina
    type Employee record {|
        string id;
        string name;
    |};

    public function main() {
        Employee employee = {
            name: "Jo",
            id: "E12321"
        };

        string key = "name";
        employee[key] = (); // Compilation error now.

        map<string> data = {
            name: "Jo Doe",
            dept: "IT"
        };

        foreach string mkey in employee.keys() {
            // `data[key]` will be nil if the key is not present in `data`.
            // E.g., `data[key]` is nil when `key` is `name`.
            employee[mkey] = data[mkey]; // Compilation error now.
        }
    }
    ```
    
- Fixed a bug with the XML parser error messages that showed dependency information. The error message prefix `failed to create xml` is now changed to `failed to parse xml` to have a single prefix for all the XML-parsing error messages.

    For example, consider the content below of the `invalid_xml.txt` file.

    ```
    <!-- comments cannot have -- in it -->
    ```

    When the following Ballerina code is run,

    ```ballerina
    import ballerina/io;

    public function main() returns error? {
        xml readResult = check io:fileReadXml("invalid_xml.txt");
    }
    ```

    it gives the error below.

    ```
    error: failed to parse xml: String '--' not allowed in comment (missing '>'?)
     at [row,col {unknown-source}]: [1,4]
    ```

- The `Environment`, `Future`, and `Runtime` classes in the `io.ballerina.runtime.api` package, are refactored to abstract classes. Creating an instance of those classes is incorrect.

- A `typedesc` value (returned by evaluating the `typeof` expression on a result of the `value:cloneWithType` and `value:fromJsonWithType` functions) is changed to give the correct type-reference type.

    ```ballerina
    import ballerina/io;

    type IntArray int[];

    public function main() returns error? {
        float[] arr = [1.0, 2.0];
        IntArray result = check arr.cloneWithType();
        io:println(typeof result); // Prints 'typedesc IntArray'.
    }
    ```

## Language updates

### New features

#### New lang library functions

##### New `lang.int:avg()` function

- Introduced the `lang.int:avg()` function, which returns the average of its integer arguments.

    ```ballerina
    import ballerina/io;

    public function main() {
        io:println(int:avg(10, 20, 30, 40)); // 25.0
    }
    ```

##### New `lang.float:avg()` function

- Introduced the `lang.float:avg()` function, which returns the average of its float arguments.

    ```ballerina
    import ballerina/io;

    public function main() {
        io:println(float:avg(2, 2)); // 2.0
    }
    ```

##### New `lang.decimal:avg()` function

- Introduced the `lang.decimal:avg()` function, which returns the average of its decimal arguments.

    ```ballerina
    import ballerina/io;

    public function main() {
        io:println(decimal:avg(10, 20, 30, 40)); // 25.0
    }
    ```

##### New `lang.boolean:some()` function

- Introduced the `lang.boolean:some()` function, which returns true if one or more of its arguments are `true`, and `false` otherwise.

    ```ballerina
    import ballerina/io;

    public function main() {
        io:println(boolean:some(true, false)); // true
        io:println(boolean:some(false, false)); // false
    }
    ```

##### New `lang.boolean:every()` function

- Introduced the `lang.boolean:every()` function, which returns `true` if all of its arguments are true, and `false` otherwise.

    ```ballerina
    import ballerina/io;

    public function main() {
        io:println(boolean:every(true, false)); // false
        io:println(boolean:every(true, true)); // true
    }
    ```

##### New `lang.value:count()` function

- Introduced the `lang.value:count()` function, which returns the number of arguments.

    ```ballerina
    import ballerina/io;
    import ballerina/lang.value;

    public function main() {
        io:println(value:count(1, 2, 3)); // 3
    }
    ```

##### New `lang.value:first()` function

- Introduced the `lang.value:first()` function, which returns the first argument.

    ```ballerina
    import ballerina/io;
    import ballerina/lang.value;

    public function main() {
        io:println(value:first(1, 2, 3)); // 1
    }
    ```

##### New `lang.value:last()` function

- Introduced the `lang.value:last()` function, which returns the last argument.

    ```ballerina
    import ballerina/io;
    import ballerina/lang.value;

    public function main() {
        io:println(value:last(1, 2, 3)); // 3
    }
    ```

### Bug fixes

To view other bug fixes, see the [GitHub milestone for 2201.6.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FCompilerFE+milestone%3A2201.6.0+is%3Aclosed+label%3AType%2FBug).

## Runtime updates

### New features

#### New Runtime Java APIs

- Introduced the `getInitMethod()` API in the `io.ballerina.runtime.api.types.ObjectType` class to get the method type of the initializer method of Ballerina objects.

    ```java
    MethodType getInitMethod();
    ```

### Deprecations

#### Deprecations in Runtime Java APIs

- Deprecated the following APIs in the `io.ballerina.runtime.api` package and marked for removal in a future release.

  | **Runtime API**                                  | **Java class**                                     |
  |--------------------------------------------------|----------------------------------------------------|
  | `getCurrentRuntime()`                            | `io.ballerina.runtime.api.Runtime`                 |
  | `createDecimalValue(String, DecimalValueKind)`   | `io.ballerina.runtime.api.creators.ValueCreator`   |
  | `createStreamingJsonValue(JsonDataSource)`       | `io.ballerina.runtime.api.creators.ValueCreator`   |
  | `convertToJson(Object, List<TypeValuePair>)`     | `io.ballerina.runtime.api.utils.JsonUtils`         |
  | `getStringValue(Object, BLink)`                  | `io.ballerina.runtime.api.utils.StringUtils`       |
  | `getExpressionStringValue(Object, BLink)`        | `io.ballerina.runtime.api.utils.StringUtils`       |
  | `parseExpressionStringValue(String, BLink)`      | `io.ballerina.runtime.api.utils.StringUtils`       |
  | `getValueKind()`                                 | `io.ballerina.runtime.api.values.BDecimal`         |
  | `getStrand()`                                    | `io.ballerina.runtime.api.values.BFuture`          |
  | `call(Strand, String, Object...)`                | `io.ballerina.runtime.api.values.BObject`          |
  | `start(Strand, String, Object...)`               | `io.ballerina.runtime.api.values.BObject`          |
  | `getRegExpDisjunction()`                         | `io.ballerina.runtime.api.values.BRegexpValue`     |
  | `instantiate(Strand)`                            | `io.ballerina.runtime.api.values.BTypedesc`        |
  | `instantiate(Strand, BInitialValueEntry[])`      | `io.ballerina.runtime.api.values.BTypedesc`        |

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.6.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.6.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed).

## Standard library updates

### New features

#### `constraint` package

- Introduced the `@constriant:Date` annotation to validate date record structures.
- Allowed constraint annotations on subtypes.

#### `http` package

- Added constraint validation support for `query`, `path`, and `header` parameters.
- Exposed the `http:Request` object in the response interceptors as a remote method parameter.
- Added finite type support for `query`, `path`, and `header` parameters.

#### `graphql` package

- Added support for GraphQL field interceptors.
- Added support for GraphQL interceptor configurations.
- Added support to access subfields of a GraphQL field from the `graphql:Field` object.

#### `persist` package

- Added support for the `in-memory` data store.
- Added support for the `google-sheets` data store. This is currently an experimental feature and its behavior may be subject to change in future releases.
- Added support for defining enums and adding `enum` fields to the data model.

#### `edi` package

- Introduced the `edi` module to convert EDI to JSON and vice versa based on a given schema.

#### `toml` package

- Introduced the pre-release version of the `toml` module to convert a TOML configuration file to `map<json>` and vice versa.

#### `yaml` package

- Introduced the pre-release version of the `yaml` module to convert a YAML configuration file to JSON and vice 
versa.

### Deprecations

#### `stan` package

- Deprecated the `stan` package.
    > For NATS-enabled applications requiring persistence, it is recommended to use `JetStream` provided by the [`ballerinax/nats`](https://github.com/ballerina-platform/module-ballerinax-nats) library, including the new [NATS JetStream client](https://lib.ballerina.io/ballerinax/nats/latest#JetStreamClient) and the [NATS JetStream listener](https://lib.ballerina.io/ballerinax/nats/latest#JetStreamListener).

#### `serdes` package

- Deprecated the `serdes` package.

### Improvements

#### `persist` package

- Renamed the error types as follows.
    - `InvalidKeyError` to `NotFoundError`
    - `DuplicateKeyError` to `AlreadyExistsError`
    - `ForeignKeyConstraintViolationError` to `ForeignKeyViolationError`
- Removed the `FieldDoesNotExistError` error type as the `NotFoundError` error type can be used instead.
- Marked the generated client object as `isolated`.
- Added support for transactions in the `mysql` data store.

#### `http` package

- Allowed a single interceptor service object to be configured as the interceptor pipeline.
- Allowed the subtypes of one of `string`, `int`, `float`, `boolean`, or `decimal` as path parameters.
- Added support for `http:InterceptableService` to enable engaging service-level interceptors and deprecated the usage of interceptors in the `http:HttpServiceConfig`.

    For example, consider the following implementation of the `http:InterceptableService`.
    ```ballerina
    import ballerina/http;
    
    service http:InterceptableService / on new http:Listener(9090) {

        public function createInterceptors() returns RequestInterceptor {
            return new RequestInterceptor();
        }

        resource function get user() returns string {
            return "John, Doe";
        }
    }
    ```

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.6.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.6.0%22+label%3AType%2FBug).

## Developer tools updates

### New features

#### Persist Tool

- Added support for the `in-memory` data store. This is set as the default data store.
- Added support for the `google-sheets` data store. This is currently an experimental feature and its behavior may be subject to change in future releases.
- Added the `persist migrate` command to generate migration scripts for data model changes in the `mysql` data store. The support for migrations is currently an experimental feature and its behavior may be subject to change in future releases.

#### Language Server

- Added inlay hint support for function call expressions and method call expressions to provide information about parameters.

### Deprecations

#### CLI Commands

##### Deprecation of `bal init`

- Deprecated the `bal init` command. It will be removed in a future version. The `bal new .` command can be used instead.

### Improvements

#### Test Framework

- Added support for excluding source files from code coverage.

#### Persist Tool

- Added support for additional DB configurations in the generated client objects for the `mysql` data store.
- Changed the Ballerina `byte[]` type mapping to `LONGBLOB` in the generated SQL script file.

#### Language Server

- Removed service template initialization from the lightweight mode.
- Improved the completion support and signature help for client resource access actions.
- Improved the main function completion item.
- Improved completions in the named argument context.
- Added support to rename parameter documentation for record fields and required parameters.

#### OpenAPI Tool

- Added support for regular expression templates (i.e., the `pattern` property) defined on OpenAPI `string` types in the Ballerina client and service generation.
  With this support, the aforementioned Regex templates will be represented as `ballerina/constraint` module annotations in the generated code. This support applies to Regex patterns that satisfy [the Ballerina regular expression grammar](https://ballerina.io/spec/lang/2022R4/#section_10.1).
- Added support for OpenAPI enums in the client and service generation. 
- Added support for query parameters with referenced schema in the Ballerina service generation. 
- Added support for header parameters with referenced schema in the Ballerina service generation. 
- Added support for `integer`, `float`, `decimal`, and `boolean` header parameter types in the Ballerina service generation.

#### Architecture Model Generator

- Added a new language server extension to retrieve Ballerina persist models.
- Added support to retrieve dependencies of the main function entry points.

#### CLI commands

##### Support for providing paths with `bal new`

- Added support to provide a directory path with the `bal new` command to create a package in a specific directory (e.g., `bal new <package-path>`). 

### Bug fixes

To view bug fixes, see the GitHub milestone for 2201.6.0 (Swan Lake) of the repositories below.

- [Test Framework](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+label%3AArea%2FTestFramework+milestone%3A2201.6.0)
- [Language Server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FLanguageServer+milestone%3A2201.6.0+is%3Aclosed+label%3AType%2FBug)
- [OpenAPI](https://github.com/ballerina-platform/openapi-tools/issues?q=is%3Aissue+milestone%3A%22Swan+Lake+2201.6.0+%22+label%3AType%2FBug+is%3Aclosed)
- [Architecture Model Generator](https://github.com/ballerina-platform/ballerina-dev-tools/issues?q=is%3Aissue+milestone%3A2201.6.0+is%3Aclosed+label%3AArea%2FArchitectureModelGenerator+label%3AType%2FBug)

## Ballerina packages updates

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.6.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A2201.6.0+label%3AArea%2FProjectAPI).
