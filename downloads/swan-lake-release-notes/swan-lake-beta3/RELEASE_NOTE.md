---
layout: ballerina-left-nav-release-notes
title: Swan Lake Beta3
permalink: /downloads/swan-lake-release-notes/swan-lake-beta3/
active: swan-lake-beta3
redirect_from: 
    - /downloads/swan-lake-release-notes/swan-lake-beta3
---
## Overview of Ballerina Swan Lake Beta3

<em>This is the third beta release leading up to the Ballerina Swan Lake GA release.</em> 

It introduces the new language features planned for the Swan Lake GA release and includes improvements and bug fixes done to the compiler, runtime, standard library, and developer tooling after the Swan Lake Beta2 release.

## Updating Ballerina

If you are already using Ballerina, you can use the [update tool](/learn/tooling-guide/cli-tools/update-tool/) to directly update to Ballerina Swan Lake Beta3 as follows. 

To do this, first, execute the command below to get the update tool updated to its latest version. 

> `bal update`

If you are using an **update tool version below 0.8.14**, execute the `ballerina update` command to update it. Next, execute the command below to update to Swan Lake <VERSION>.

> `bal dist pull slbeta3`

## Installing Ballerina

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.

## Language updates

### New features

#### Introduction of the `!is` operator

The `!is` operator has been introduced to check if a value does not belong to a given type. This is the negation of the `is` operator.

```ballerina
import ballerina/io;
 
public function main() {
   int|string? x = 10;
 
   if x !is () {
       io:println("int or string value: ", x);
   }
}
```

#### Inferring types for numeric literals in additive and multiplicative expressions

The types for numeric literals in additive and multiplicative expressions are now inferred from the contextually-expected type.

When the contextually-expected type for an additive or multiplicative expression is `float`, the type of a literal used as a subexpression is inferred to be `float`. Similarly, if the contextually-expected type is `decimal`, the type of the literal is inferred to be `decimal`.

```ballerina
float a = 10 + 3.0 + 5.0;
float b = 5 / 10.2;
decimal c = 10.0 * 3;
decimal d = 10 + 5 - 3.0;
```

#### Isolated inference

The compiler now infers `isolated` for service objects, class definitions, variables, and functions in scenarios in which if all of them explicitly specify an `isolated` qualifier, they would meet the requirements for isolated functions and isolated objects.

The following service and its methods are now inferred to be isolated.

```ballerina
import ballerina/http;
 
int defaultIncrement = 10;
 
service / on new http:Listener(8080) {
   private int value = 0;
 
   resource function get value() returns int {
       int value;
       lock {
           value = self.value;
       }
 
       lock {
           return value + defaultIncrement;
       }
   }
 
   resource function post increment(int i) {
       lock {
           self.value += i;
       }
   }
}
```

The compiler does not infer `isolated` for any constructs that are exposed outside the module.

#### Type narrowing in the `where` clause of a query expression/action

The `where` clause in a query now narrows the types similar to `if` statements.

```ballerina
import ballerina/io;
 
public function main() returns error? {
   int?[] v = [1, 2, (), 3];
   int total = 0;
   check from int? i in v
       where i is int
       do {
           // Type of `i` is narrowed to `int`.
           total += i;
       };
   io:println(total); // Prints 6.
}
```

### Improvements

#### Enum declarations with duplicate members

Enum declarations can now have duplicate members.

For example, the following declarations in which both `LiftStatus` and `TrailStatus` have the same `OPEN` and `CLOSED` members are now allowed.

```ballerina
enum LiftStatus {
   OPEN,
   CLOSED = "0",
   HOLD
}
 
enum TrailStatus {
   OPEN,
   CLOSED = "0"
}
```

However, it is an error if the same enum declaration has duplicate members. Similarly, it is also an error if different enums initialize the same member with different values.

#### Use of `string:Char` as the static type of string member access

The static type of the member access operation on a value of type `string` has been updated to be `string:Char` instead of `string`.

```ballerina
public function main() {
   string str = "text";
 
   // Can now be assigned to a variable of type `string:Char`.
   string:Char firstChar = str[0];
}
```

#### Directly calling function-typed fields of an object

Fields of an object that are of a function type can now be called directly via an object value using the method call syntax.

```ballerina
class Engine {
   boolean started = false;
  
   function 'start() {
       self.started = true;
   }
}
 
class Car {
   Engine engine;
 
   function () 'start;
 
   function init() {
       self.engine = new;
       // Delegate `car.start` to `engine.start`.
       self.'start = self.engine.'start;
   }
}
 
public function main() {
   Car car = new;
   car.'start(); // Call the function via the object field.
}
```

#### Tuple to JSON compatibility

A tuple value whose members are JSON compatible can now be used in a context that expects a JSON value.

```ballerina
[string, int, boolean...] a = ["text1", 1, true, false];
// Now allowed.
json b = a;
```

#### Error return in the `init` method of a service declaration

Previously, the `init` method of a service declaration could not have a return type containing an error. That restriction has been removed with this release.
If the `init` method of a service declaration returns an error value, it will result in a module initialization failure.

```ballerina
import ballerina/http;
 
service / on new http:Listener(8080) {
   function init() returns error? {
       // Return an error for demonstration.
       // This will result in module initialization failing.
       return error("Service init failure!");
   }
}
```

#### Using `check` in object field initializers

`check` can now be used in the initializer of an object field if the class or object constructor expression has an `init` method with a compatible return type (i.e., the error type that the expression could evaluate to is a subtype of the return type of the `init` method).

If the expression that is used with `check` results in an error value, the `init` method will return the error resulting in either the `new` expression returning an error or the object constructor expression resulting in an error.

```ballerina
import ballerina/io;
 
int? value = ();
 
class NumberGenerator {
   int lowerLimit;
 
   // `check` can be used in the field initializer
   // since the `init` method's return type allows `error`.
   int upperLimit = check value.ensureType();
 
   function init(int lowerLimit) returns error? {
       self.lowerLimit = lowerLimit;
   }
}
 
public function main() {
   NumberGenerator|error x = new (0);
 
   if x is error {
       io:println(x);
   }
}
```

#### Wildcard binding pattern support in variable declarations

The wildcard binding pattern can now be used in a variable declaration with a value that belongs to type `any`.

```ballerina
import ballerina/io;
 
float _ = 3.14;
var _ = io:println("hello");
```

Using the wildcard binding pattern when the value is an error will result in a compilation error.

```ballerina
var _ = error("custom error"); // Compilation error.
```

#### Relaxed static type requirements for `==` and `!=`

Previously, `==` and `!=` were allowed only when both operands were of static types that are subtypes of `anydata`. This has now been relaxed to allow `==` and `!=` if the static type of at least one operand is a subtype of `anydata`.

```ballerina
error? x = ();
 
// Now allowed.
if x == () {
 
}
``` 

### Bug fixes

- In a stream type `stream<T, C>;` the completion type `C` should always include nil if it is a bounded stream. A bug which resulted in this not being validated for stream implementors has been fixed.
    ```ballerina
    class StreamImplementor {
        public isolated function next() returns record {|int value;|}|error? {
        
        }
    }
    
    stream<int, error> stm = new (new StreamImplementor()); // Will now result in an error.
    ```

- Resource methods are no longer added to the type via object type inclusions. This was previously added even though resource methods do not affect typing.
    ```ballerina
    service class Foo {
        resource function get f1() returns string => "foo";
    
        function f2() returns int => 42;
    }
    
    // It is no longer required to implement the `get f1` resource method.
    service class Bar {
        *Foo;
    
        function f2() returns int => 36;
    }
    ```

- A bug in string unescaping of Unicode codepoints > `0xFFFF` has been fixed.
    ```ballerina
    import ballerina/io;
    
    public function main() {
        string str = "Hello world! \u{1F600}";
        io:println(str);
    }
    ```

The above code snippet, which previously printed `Hello world!  ὠ0` will now print `Hello world! 😀`.

- A bug in escaping `NumericEscape` has been fixed.
    ```ballerina
    import ballerina/io;
    
    public function main() {
        string str = "\\u{61}pple";
        io:println(str);
    }
    ```

This code snippet, which previously printed `\u0061pple` will now print `\u{61}pple`.

- A bug that resulted in `NumericEscape` in the template string not being interpreted literally has been fixed.
    ```ballerina
    import ballerina/io;
    
    public function main() {
        string str = string `\u{61}pple`;
        io:println(str);
    }
    ```

The code snippet above, which previously printed `\u0061pple` will now print `\u{61}pple`.

- A bug that resulted in self-referencing not being detected when referenced via a `let` expression or a constant reference expression has been fixed.

    The following will now result in errors.
    ```ballerina
    const int INTEGER = INTEGER; // Compilation error.

    public function main() {
        string s = let string[] arr = [s] in arr[0]; // Compilation error.
    }
    ```

- Type narrowing is now reset on any assignment to a narrowed variable. Previously, type narrowing was not reset if the static type of the new value was a subtype of the narrowed type. This was a deviation from the specification.
    ```ballerina
    public function main() {
        int|string v = 0;

        if v is int {
            int x = v; // Valid.

            // Now, the type is reset to `int|string` even though `1` belongs to `int`.
            v += 1;

            int y = v; // Invalid, will now result in an error.
        }
    }
    ```

To view all bug fixes, see the [GitHub milestone for Swan Lake Beta3](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta3%22+label%3AType%2FBug+label%3ATeam%2FCompilerFE).

## Runtime updates

### Improvements

#### Improved configurable variables to support XML types through TOML syntax

The `configurable` feature is improved to support variables of XML types through the TOML syntax.

For example, if an XML-typed configurable variable is defined in the following way,

``` ballerina
configurable xml xmlVar = ?;
```
the value can be provided in the `Config.toml` file as follows.


```toml
xmlVar = "<book><name>Sherlock Holmes</name></book>"
```

#### Support to provide extra fields for configurable variables of open record types

The `configurable` feature is improved to support configuring extra fields in record variables through TOML syntax.

For example, if a configurable variable of an open record type is defined in the following way,

```ballerina
type Person record {
};

configurable Person person = ?;
```

the values can be provided in the `Config.toml` file as follows.


```toml
[person]
intVal = 22
floatVal = 22.33
stringVal = "abc"
arrVal = [1,2,3]
mapVal.a = "a"
mapVal.b = 123
```

The extra fields that are created from the TOML values will have the following types.

* TOML Integer - `int`
* TOML Float - `float`
* TOML String - `string`
* TOML Boolean - `boolean`
* TOML Table - `map<anydata>`
* TOML Table array - `map<anydata>[]`

Similarly, if a configurable variable of a closed record type is defined in the following way,

```ballerina
public type Numbers record {|
   int ...;
|};

configurable Numbers numbers = ?;
```

the values can be provided in the `Config.toml` file as follows.


```toml
num1 = 11
num2 = 26
```

#### Improved the printed error stacktrace to include the cause

The error stack trace has been improved to include the error cause locations. Stack frames of the wrapped error causes are also added to the stack trace.

For the following example,

```ballerina
public function main() {
    panic bar();
}

function bar() returns error {
    return error("a", y());
}

function y() returns error {
    return x();
}

function x() returns error {
    return error("b");
}
```

the expected stack trace will be as follows.

```
error: a
at cause_location.0:bar(main.bal:5)
cause_location.0:main(main.bal:2)
cause: b
at cause_location.0:x(main.bal:11)
cause_location.0:y(main.bal:8)
... 2 more
```
#### New runtime Java APIs

##### API to invoke a Ballerina object method asynchronously

New Java Runtime APIs are introduced to execute a Ballerina object method from Java. The object method caller can decide whether to execute the object method sequentially or concurrently using the appropriate API.

If the object and the method are `isolated` and the caller can ensure that there will be no data race with arguments that have mutable state, they can use the `invokeMethodAsyncConcurrently` method, or otherwise, the `invokeMethodAsyncSequentially` method.

```java
boolean isIsolated = object.getType().isIsolated(methodName);
if (isIsolated) {
    BFuture bFuture = env.getRuntime().invokeMethodAsyncConcurrently(object, methodName, strandName, metadata, 
                                    callback, properties, returnType, args);
} else {
    BFuture bFuture = env.getRuntime().invokeMethodAsyncSequentially(object, methodName, strandName, metadata,
                                    callback, properties, returnType, args);
}
```

> **Info:** The previous `invokeMethodAsync` methods are deprecated.

#####  API to retrieve whether a Ballerina object or method is `isolated`

The two new APIs below are introduced to the `ObjectType`.

```java
boolean isIsolated();
boolean isIsolated(String methodName);
```

#### Removed fully-qualified package version from runtime

The fully-qualified package version has been removed from the runtime and will only have the major version. Therefore, when you provide the version to the Ballerina runtime Java API (e.g., when creating values), you need to provide only the package runtime version. The stack traces will contain only the major package versions.


### Bug fixes

The completion type of a stream is now considered in runtime assignability checks.

```ballerina
stream<int, error?> stm = new (new StreamImplementor());
 
// Evaluated to true in SL Beta2, evaluates to false now.
boolean streamCheck = stm is stream<int>;
```

To view bug fixes, see the [GitHub milestone for Swan Lake Beta3](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta3%22+label%3AType%2FBug+label%3ATeam%2FjBallerina).

## Standard library updates

### New features

#### `crypto` package
- Improved the hash APIs for cryptographic salt

#### `graphql` package
- Added field alias support for GraphQL documents
- Added variable support in GraphQL requests
- Added mutation support for GraphQL services
- Added typename introspection
- Added input objects support
- Added block string support
- Added `graphql:Context` to support sharing meta-information between the resolvers

#### `grpc` package
- Added declarative auth configurations
- Added timestamp, duration, and struct type support
- Added OAuth2 JWT bearer grant type support for the client
- Introduced the support for a directory with PROTO files as the input (`--input` flag) for the gRPC command
- Introduced the support for external import paths in the gRPC command using the `--proto_path` flag
- Added the PROTO file name as a suffix for the `ROOT_DESCRIPTOR` constant and `getDescriptorMap` function to fix the re-declared symbol issue when multiple stub files are put into the same module. If you are going to regenerate the stub files with the Swan Lake Beta3 release, you need to change the service annotation like below.
    ```ballerina
    @grpc:ServiceDescriptor {
    descriptor: ROOT_DESCRIPTOR_<PROTO_FILE_NAME>,
    descMap: getDescriptorMap<Proto_File_Name>()
    }
    service "HelloWorld" on new grpc:Listener(9090) {
    ```

#### `http` package
- Enabled HTTP trace and access log support
- Added HATEOAS link support
- Introduced the `http:Cache` annotation to the resource signature
- Introduced support for the service-specific media-type subtype prefix
- Introduced the introspection resource method to get the generated OpenAPI document of the service
- Added OAuth2 JWT bearer grant type support for client
- Add support to overwrite the scopes config by resource annotation
- Introduce introspection resource method to get generated OpenAPI document of the service
- Introduce service config treatNilableAsOptional for query and header params
- Add support to URL with empty scheme in http:Client

#### `jwt` package
- Added HMAC signature support for JWT
  
#### `log` package
- Added observability span context values to the log messages when observability is enabled
- Introduced a function(`log:setOutputFile`) to write the log output to a file

#### `oauth2` package
- Added JWT bearer grant type support
    
#### `sql` package
- Added support for the `queryRow()` in the database connectors. This method allows retrieving a single row as a record or a single value from the database.
    ```ballerina
    record{} queryResult = sqlClient->queryRow(`SELECT * FROM ExTable where row_id = 1`);
    int count = sqlClient->queryRow(`SELECT COUNT(*) FROM ExTable`);
    ```

- Introduced the `queryConcat()` and `arrayFlattenQuery()` util functions to create a complex query dynamically.
  - The `queryConcat()` function creates a parameterized query by concatenating a set of parameterized queries.
    ```ballerina
    sql:ParameterizedQuery query = `SELECT * FROM students`;
    sql:ParameterizedQuery query1 = ` WHERE id < ${id} AND age > ${age}`;
    sql:ParameterizedQuery sqlQuery = sql:queryConcat(query, query1);
    ```

  - The `arrayFlattenQuery()` is introduced to make the array flattening easier. It makes the inclusion of varying array elements into the query easier by flattening the array to return a parameterized query.
    ```ballerina
    int[] ids = [1, 2];
    sql:ParameterizedQuery sqlQuery = sql:queryConcat(`SELECT * FROM DataTable WHERE id IN (`, sql:arrayFlattenQuery(ids), `)`);
    ```

#### `websocket` package
- Added the OAuth2 JWT bearer grant type support for the client
- Introduced retrying for the WebSocket client
- Introduced the header annotation and query param binding support

#### `ftp` package
- Added SFTP and related security
- Added the support for an anonymous user

### Improvements

#### `graphql` package
Moved the `maxQueryDepth` validation from compile-time to runtime

#### `http` package
- Added support for the `map<json>` as the query parameter type
- Added support for nilable client data binding types

#### `websocket` package
- Made the WebSocket caller isolated
- Introduced a write timeout for the WebSocket client

#### `ftp` package
- Introduced the byte stream related functionality to the FTP module
- Renamed the `BasicAuth` record to `Credentials` in the configuration
- Updated to return an error once an error occurs while the FTP client is initialized
- Updated to throw an error when a file/directory does not exist in the `isDirectory` method
- Removed the `arraySize` parameter from the `get` method of the FTP client API
- Changed the `boolean` typed `compressInput` parameter of the `put` method of the FTP client to an `enum` type with the name `compressionType`
- Made the access level of the `WatchEvent` to `readonly` in the FTP listener

#### `sql` package
- Improved the throughput performance with asynchronous database queries
- Introduced new array out parameter types in call procedures
- Changed the return type of the SQL query API to include the completion type as nil in the stream. The SQL query code below demonstrates this change</li>
    
    **Previous syntax:**
    ```ballerina
    stream<RowType, error> resultStream = sqlClient->query(``);
    ```

    **New syntax:**
    ```ballerina
    stream<RowType, error?> resultStream = sqlClient->query(``);
    ```

- Improved the error types in the SQL module with the introduction of typed errors for data manipulation under the `sql:ApplicationError`
- Removed support for the string query parameter

    **Previous syntax:**
    ```ballerina
    stream<RowType, error?> resultStream = sqlClient->query("SELECT * FROM Students;");
    ```

    **New syntax:**
    ```ballerina
    stream<RowType, error?> resultStream = sqlClient->query(`SELECT * FROM Students;`);
    ```

#### `io` package
Changed the `io:readin` function input parameter to optional. In the previous API, it was required to pass a value to be printed before reading the user input as a string. It was removed due to the breaking change and made optional. It is not recommended to pass a value to print it in the console.

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Beta3](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%22Swan+Lake+Beta3%22+label%3AType%2FBug).

## Code to Cloud updates

### Improvements
- Added a flag to disable the Docker image generation
- Added the secret generation support for HTTP clients
- Improved diagnostics for failed value retrievals
- Added support for multiple volumes

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Beta3](https://github.com/ballerina-platform/module-ballerina-c2c/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A%22Ballerina+Swan+Lake+-+Beta3%22).

## Dependency management updates

With Swan Lake Beta3, the way how dependencies of a package are managed has been changed. The new implementation will ensure the following. 

- The new build will ensure that you will get updates of the dependent packages (direct or transitive) automatically
- Introducing the `--sticky` flag in case you want to lock the dependency versions for subsequent builds

The following changes have been introduced.

- Introduced the `Dependencies.toml` version 2. Going forward, this will be automatically managed by the `build` command and you should not modify it. If you already have a `Dependencies.toml` file, it will be automatically updated to the new version.
- Packages in the local repository need to be configured in the `Ballerina.toml` file. The format is as follows.
    ```toml
    [[dependency]]
    org = "ballerinax"
    name = "github"
    version = "0.99.20"
    ```
- The minimum distribution required to compile a package can be specified in the `Ballerina.toml` file as follows. The packages created with Beta3 will have this added with the `bal new` command.
    ```toml
    [[package]]
    org = "ballerinax"
    name = "github"
    version = "2.0.0"
    distibution = "slbeta3"
    ```
    
## Developer tools updates

### New features

#### Language server

- Added the completion extension API for TOML configuration files
- Added completion support for the `Ballerina.toml` file
- Added the offline build configuration option
    Clients can set the `ls.compilation.online` system property to `true` or `false` in order to run the Language Server's compilations online or offline. By default, the compilations are running offline. 

#### Debugger
- Introduced log points support
- Added the debugger evaluation support for the following types:
    - Query expressions
    - Error constructor expressions
    - Explicit new expressions
    - XML attribute access expressions
    - Annotation access expressions
    - Range expressions
    - Trap expressions
    - Function, object method, and action invocations with rest arguments
- Added evaluation support for expressions with import references
    
#### Ballerina OpenAPI tool
- Introduced a new command-line option to generate all the record fields that are not specifically mentioned as `nullable:false` in the OpenAPI schema property as nullable to reduce the type conversion errors in the OpenAPI to Ballerina command.

  >`bal openapi -i <openapi-contract-file>  --nullable`

- Introduced a new command-line option to add user-required license or copyright headers for the generated Ballerina files via OpenAPI to Ballerina command.

  >`bal openapi -i <openapi-contract-file> --license <license-file> `

- Introduced a new command-line option to generate the JSON file via the Ballerina to OpenAPI command.

  >`bal openapi -i <service-file> --json`

- Added support to generate a boilerplate of test functions for each remote function implemented within a client connector.

### Improvements

#### Ballerina OpenAPI tool

##### Ballerina OpenAPI client and schema generation improvements for the OpenAPI to Ballerina command
- Added support to generate suitable client connector authentication mechanisms by mapping the security schemes given in the OpenAPI Specification (OAS)
- Added support to generate API documentation for the client init method, remote functions, and records
- Added support to facilitate you to set common client configurations when initializing the connector 
- Added support to generate records for nested referenced schemas in the OpenAPI specification 
- Improved the OpenAPI tool to select the `https` server URL when multiple URLs are given in the OpenAPI Specification
 
##### The Ballerina to OpenAPI command improvements
- Added support for the Language Server extension 
- Improved the response status code map to `202` when the resource function does not have a return type
- Improved mapping different status code responses in the resource function
- Enhanced generating an OpenAPI schema with Ballerina `typeInclusion` scenarios
- Added a resource function API documentation mapping to the OAS description and summary
- Improved the resource function request payload mapping with the OAS `requestBody`
- Added the resource signature `http:Cache` annotation mapping to response headers
- Improved reference resolving for accessing a separate module data type to map OAS object schemas
- Improved nullable record field mapping to an OAS schema property
 
### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake Beta3 of the repositories below.

- [Language Server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta3%22+label%3AType%2FBug+label%3ATeam%2FLanguageServer)
- [OpenAPI](https://github.com/ballerina-platform/ballerina-openapi/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta3%22+label%3AType%2FBug)
- [Debugger](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3AType%2FBug+label%3AArea%2FDebugger+milestone%3A%22Ballerina+Swan+Lake+-+Beta3%22+is%3Aclosed)


