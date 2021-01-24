---
layout: ballerina-release-notes
title: Release Note
---

### Overview of Ballerina Swan Lake Alpha 

This Alpha release includes the language features planned for the Ballerina Swan Lake release. Moreover, this release includes improvements and bug fixes to the compiler, runtime, standard library, and developer tooling. This release note lists only the features and updates added after the eighth preview of Ballerina Swan Lake.

- [Updating Ballerina](#updating-ballerina)
    - [For Existing Users](#for-existing-users)
    - [For New Users](#for-new-users)
- [Highlights](#highlights)
- [What is new in Ballerina Swan Lake Alpha](#what-is-new-in-ballerina-swan-lake-alpha)
    - [Packages](#packages)
        - [Introduction of Hierarchical Package Names](#introduction-of-hierarchical-package-names)
        - [Introduction of the Dependencies TOML file](#introduction-of-the-dependencies-toml-file)
        - [Support to Accept an Empty Ballerina TOML File](#support-to-accept-an-empty-ballerina-toml-file)
    - [Language](#language)
        - [Intersection Type Support for Errors](#intersection-type-support-for-errors)
        - [Support for Passing a Closed Record as the Rest Argument](#support-for-passing-a-closed-record-as-the-rest-argument)
        - [Support for the Empty XML Value](#support-for-the-empty-xml-value)
        - [Improved Usage of Listener Declarations with Listener Types](#improved-usage-of-listener-declarations-with-listener-types)
        - [Improvements to the Match Statement](#improvements-to-the-match-statement)
        - [Support for Cyclic Union Types](#support-for-cyclic-union-types)
        - [Updated Syntax for User-Defined Error Construction](#updated-syntax-for-user-defined-error-construction)
        - [Changes on Casting with Errors](#changes-on-casting-with-errors)
        - [Changes on `toString` and `toBalString` with Errors](#changes-on-toString-and-toBalString-with-errors)
        - [Changes on Object Type Inclusion with Qualifiers](#changes-on-object-type-inclusion-with-qualifiers)
        - [Changes on Record Type Inclusion with Rest Descriptors](#changes-on-record-type-inclusion-with-rest-descriptors)
        - [Improved Listener Declaration](#improved-listener-declaration)
        - [Referring Lang Library Modules Without Using Quoted Identifiers](#referring-lang-library-modules-without-using-quoted-identifiers)
        - [Improved Lang Library Methods](#improved-lang-library-methods)
    - [Runtime](#runtime)
        - [Configurable](#configurable)
    - [Developer Tools](#developer-tools)
        - [Language Server](#language-server)
        - [Project API](#project-api)
        - [Debugger](#debugger)
        - [Test Framework](#test-framework)
        - [Bindgen Tool](#bindgen-tool)
        - [Maven Resolver](#maven-resolver)
        - [Ballerina Shell REPL [EXPERIMENTAL]](#ballerina-shell-repl-experimental)
        - [Documentation](#documentation)
    - [Standard Library](#standard-library)
        - [HTTP Module Improvements](#http-module-improvements)
        - [WebSocket Module Improvements](#websocket-module-improvements)
        - [gRPC Module Improvements](#grpc-module-improvements)
        - [Security Improvements](#security-improvements)
        - [GraphQL Module Improvements](#graphql-module-improvements)
        - [Common Changes in Messaging Modules](#common-changes-in-messaging-modules)
        - [Kafka Module Improvements](#kafka-module-improvements)
        - [NATS Module Improvements](#nats-module-improvements)
        - [NATS Streaming Module Improvements](#nats-streaming-module-improvements)
        - [RabbitMQ Module Improvements](#rabbitmq-module-improvements)
        - [Time Module Improvements](#time-module-improvements)
        - [Rename System Module to OS](#rename-system-module-to-os)
        - [Runtime Module Improvements](#runtime-module-improvements)
        - [Email Module Improvements](#email-module-improvements)
        - [WebSub Module Improvements](#websub-module-improvements)
        - [Introduced New Modules](#introduced-new-modules)
        - [Removed Modules](#removed-modules)
    - [Code to Cloud](#code-to-cloud)
    - [Breaking Changes](#breaking-changes)
        - [Language](#language)
    - [Taint Analyzer Update](#taint-analyzer-update)

#### Updating Ballerina

You can use the update tool to update to Ballerina Swan Lake Alpha as follows.

##### For Existing Users

If you are already using Ballerina, you can directly update your distribution to the Swan Lake channel using the [Ballerina Update Tool](/swan-lake/learn/keeping-ballerina-up-to-date/). To do this, first, execute the command below to get the update tool updated to its latest version. 
                        
> `bal update`

 Next, execute the command below to update to Swan Lake Alpha.

 > `bal dist pull alpha`                 

However, if you are using a Ballerina version below 1.1.0, install via the [installers](/downloads/#swanlake).

##### For New Users

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.

#### Highlights

- The `ballerina` command is renamed to `bal`
    Now onwards, all the commands will start with `bal` E.g., `bal -v`, `bal build`, `bal dist list`.
- Introduction of hierarchical package names
    Now, the package name can take the form of `package-name := identifier(.identifer)*`.
- Introduction of the `Dependencies.toml` file
- Support for the intersection type in errors
- Support for passing closed records as rest arguments in function/method calls
- Support to define empty XML values using only the `concat` XML lang library function  
- Improved listener declarations to support classes, which return `error?` from its `init` method
- Improvements to the `match` statement
- Support for cyclic union type descriptors to directly refer to its identifier
- Improvements in error handling, casting, constructors
- Changes on object-type and record-type inclusions
- Improved listener declaration
- Improvements on the lang library modules and methods
- Improvements on the `configurable` feature
- Improvements on the Developer Tools such as the Language Server, Project API, Debugger, Test Framework, Bindgen Tool, Maven Resolver, and Documentation
- Introduction of the REPL support for Ballerina via the `bal shell` command
- Improvements to the HTTP, WebSocket, gRPC, security, GraphQL, Kafka, NATS, NATS Streaming, RabbitMQ, Time, Runtime, Email, and WebSub standard library modules
- Rename the System standard library module to OS
- Introduction of the new Random, RegEx, TCP, UDP, and WebSubHub standard library modules
- Removal of the Config, Math, Stringutils, and Socket standard library modules
- VSCode plugin support for code actions and code completions on Code To Cloud
- Taint analyzer related updates

### What is New in Ballerina Swan Lake Alpha

#### Packages

##### Introduction of Hierarchical Package Names

Now, the package name can take the form of `package-name := identifier(.identifer)*` meaning the dot (`.`) is allowed in the package name.

The following is a valid `Ballerina.toml` file.

```toml
[package]
org = "ballerinax"
name = "observe.prometheus"
version = "1.0.0"
```

##### Introduction of the Dependencies TOML file

This is a dedicated file to maintain all the dependencies, which is expected to be created in the package root directory. All the dependencies, which were declared in the `Ballerina.toml` file should be moved to this file now.

A valid `Dependencies.toml` file will be as follows.

```toml
[[dependency]]
org = "ballerina"
name = "io"
version = "0.5.5"

[[dependency]]
org = "ballerina"
name = "log"
version = "1.0.5"
```

##### Support to Accept an Empty Ballerina TOML File

A valid Ballerina package can now contain an empty `Ballerina.toml` file. This makes it easier to convert an `application/service` written in a standalone Ballerina file to a Ballerina package. 

#### Language

##### Intersection Type Support for Errors

Intersection types are now allowed with `error` types. The set of values that belong to the intersection type will be the set of errors that belong to each error type in the intersection. 

```ballerina
type InvalidCodeError error<record { int code; }>;

type UnavailableError error<record { string[] alternatives; }>;

type Error error<record { int code; string[] alternatives; boolean fatal; }>;

public function main() {
    Error err = error Error("InvalidCode", code = 1234, alternatives = ["ballerina.io"], fatal = true);

    // Since `Error` is a subtype of both `InvalidCodeError` and `UnavailableError`
    // it is a subtype of the intersection type of `InvalidCodeError` and `UnavailableError`.
    // Thus `err` can be assigned to a variable of type `InvalidCodeError & UnavailableError`.
    InvalidCodeError & UnavailableError intersection = err;
}
```

#### Support for Passing a Closed Record as the Rest Argument

A closed record can be used as the rest argument in a function or method call. This is the same as passing each field in the record value as a named argument.

```ballerina
    import ballerina/io;

    type SalaryDetails record {|
        int annualIncrement = 20;
        float bonusRate?;
    |};

    function printSalaryDetails(int baseSalary, int annualIncrement, float bonusRate = 0.02) {
        io:println("Base Salary: ", baseSalary, " | Annual Increment: ", annualIncrement, " | Bonus Rate: ", bonusRate);
    }

    public function main() {
        SalaryDetails details = {
            annualIncrement: 30,
            bonusRate: 0.03
        };
        // Same as `printSalaryDetails(2500, annualIncrement = 30, bonusRate = 0.03);`
        printSalaryDetails(2500, ...details);

        details = {};
        // Same as `printSalaryDetails(2500, annualIncrement = 20);`
        printSalaryDetails(2500, ...details);
    }
```

##### Support for the Empty XML Value

Previously, it was possible to define a value of type `xml<never>` (i.e., the empty XML value) using only the `concat` XML Lang Library function. 

```ballerina
xml<never> emptyXmlValue = <xml<never>>'xml:concat();
```

With the new changes, it is now possible to directly create the empty XML value.

```
ballerina
xml<never> emptyXmlValue = xml ``;
```

#### Improved Usage of Listener Declarations with Listener Types

Listener declarations now support classes, which return `error?` from its `init` method. Before this change, the `init` method had to be made panic to use a listener class in a listener declaration.

If the initialization of the listener object returns an error, module initialization will fail.

```ballerina
public class Listener {
    public function init(int port) returns error? {
        if isUnavailable(port) {
            return error("Port already in use");
        }
    // Initialization.
    }

    public isolated function attach(service object {} svc, string|string[]? attachPoint) returns error? {
    }

    public isolated function detach(service object {} svc) returns error? {
    }

    public isolated function 'start() returns error? {
    }

    public isolated function gracefulStop() returns error? {
    }

    public isolated function immediateStop() returns error? {
    }
}

// Now a valid listener declaration.
// If the initialization returns an error, module initialization will fail.
listener Listener ln = new (8080);
```

##### Improvements to the Match Statement

###### Support for More Match Patterns

**List Match Pattern**
```ballerina
match v {
    var     [a, b ] => {
    // Matches lists with 2 elements.
    }    var [a, [b, c], d]|var [a, b , c, d] => {
    // Matches 
    // - lists with 3 elements where the second element is a list of 2 elements or
    // - lists with 4 elements
    }}

```

**Mapping Match Pattern**
```ballerina
match v {
    {a: "hello", b: "world"}     => {
    // Match mappings that contain the field `a` with
    // value "hello" and field `b` with value "world".
    }
{
    a:var x} => {
// Match mappings that contain the field `a`.
// The value is assigned to the variable `x`
// and can be assigned within the block.
io:println(x);
}
}
```

**Error Match Pattern**
```ballerina
match v {
    error ("Message") => {
    // Match errors with "Message" as the error message.
    }error () => {
    // Match all errors.
    }}
```

###### Improved Type Narrowing Within Match Statements

When code is executed through each match-clause, the type of the matched expression is narrowed. In the example below, the type of `v` in the last match clause is narrowed to `string`.

```ballerina
match v {
    var a if a is int|boolean => {
        return a.toString();
    }
    _ => {
        return v; // Type of `v` is `string` here.
    }
}
```

##### Support for Cyclic Union Types

Cyclic union types are now supported. A cyclic union type descriptor can directly refer to its identifier in its type descriptor.

```ballerina
type Integers int|Integers[]|map<Integers>;

Integers intValue = 5;
Integers intArray = [1, 2, 3, 4];
Integers intMap = {i: 1, j: 2};
Integers integers = [intValue, intArray, intMap];
```

##### Updated Syntax for User-Defined Error Constructions

The error constructor expression now requires the `error` keyword to construct a user-defined error.

**Previous Syntax:**
```ballerina
MyError myError = MyError("Message");
```
 
**New Syntax:**
```ballerina
MyError myError = error MyError("Message");
```

#### Changes on Casting with Errors

Errors cannot be cast away (i.e., if the value that is being cast can be an error, the type to which the cast is attempted should also have a subtype of error). 

The following was allowed previously.

```ballerina
function foo() returns string|int|error {
    return error(“Error Message”);
}

public function main() {
    string s = <string>foo(); // Cast without considering the error.
}
```

This is now disallowed and can be rewritten as follows.

```ballerina
function foo() returns string|int|error {
    return error("Error Message");
}

public function main() {
    string s = <string>checkpanic foo(); // use`checkpanic` to panic if `foo()` returns an error and then attempt the cast
}
```

1. Using `checkpanic` - This will preserve the `panic` behavior (but with a different error - the previous error was a cast error. Now, it will be the actual error returned by `foo()`).

    ```ballerina
    function foo() returns string|int|error {
        return error("Error Message");
    }

    public function main() {
        string s = <string>checkpanic foo(); // use`checkpanic` to panic if `foo()` returns an error and then attempt the cast
    }
    ```

2. Using `check` - Alternatively, if the function’s return type allows returning the error, `check` can be used before attempting the cast to return the error instead of panicking.

```ballerina
function foo() returns string|int|error {
    return error(“Error Message”);
}

public function main() returns error? {
    string s = <string>check foo(); // use`check` to return the error if `foo()` returns an error, and then attempt the cast
}
```

##### Changes on `toString` and `toBalString` with Errors

It was previously possible to call `toString()` and `toBalString()` on unions of errors and non-errors.

```ballerina
function print(any|error val) {
    string s = val.toString();
}
```

This has now been disallowed and the error scenarios need to be handled explicitly. The above example can be rewritten as follows.

```ballerina
function print(any|error val) {
    string s = val is error ? val.toString() : val.toString();
}
```

#### Changes on Object Type Inclusion with Qualifiers

- When object type inclusion is used with an object type descriptor with qualifiers (`isolated`, `client`, `service`), it is now mandatory for the object being included also to have these qualifiers.
- Object type descriptors can no longer use object type inclusion with `readonly` classes.
- Classes can use object type inclusion with `readonly` classes only if the including classes themselves are `readonly` classes.
- The type reference in an object constructor expression can refer to a `readonly` class only if the object being constructed is `readonly`.

#### Changes on Record Type Inclusion with Rest Descriptors

Record type inclusion now copies the rest descriptor from the included type to the including type. The including type may override the rest descriptor. 

```ballerina
type Congifuration record {|
    int id;
    decimal...;
|};

type DefaultCongifuration record {|
    // The rest descriptor is also copied.
    *Congifuration;
    boolean active;
|};

DefaultCongifuration config = {
    id: 1000,
    active: true,
    // Additional fields of type `decimal` 
    // can be specified since the rest descriptor
    // is copied from `Congifuration`.
    "factor": 1.0,
    "index": 0.0
};
```

The rest descriptor of the `DefaultCongifuration` is of type `decimal`.

```ballerina
type Congifuration record {|
    int id;
    decimal...;
|};

type InclusiveCongifuration record {
    // Since `InclusiveCongifuration` is an inclusive record type descriptor the 
    // `anydata` rest descriptor overrides the rest descriptor from `Congifuration`.
    *Congifuration;
    boolean active;
};

InclusiveCongifuration inclusiveConfig = {
    id: 1002,
    active: true,
    // Additional fields of type `anydata` can be specified since the rest descriptor
    // is overridden as `anydata`.
    "factor": 1.0,
    "owner": "admin"
};

type ExclusiveCongifuration record {|
    // The record type descriptor of  `ExclusiveCongifuration` overrides the rest 
    // descriptor from `Congifuration`, making the rest descriptor of `ExclusiveCongifuration` 
    // be of type `boolean`.
    *Congifuration;
    boolean active;
    boolean...;
|};

ExclusiveCongifuration exclusiveConfig = {
    id: 1003,
    active: false,
    // Additional fields of type `boolean` can be specified since the rest descriptor is overridden.
    "allow": true
};
```

The rest descriptor type of the `InclusiveCongifuration` is `anydata` and that of the `ExclusiveCongifuration` is `boolean`. The including records override the rest descriptor from the included record.

##### Improved Listener Declaration  

The listener declaration is improved to accept listener values that are a subtype of both the compiler built-in type `listener` and `error` type. This allows the following listener declaration when the `init` method of `Listener` may return an error.

```ballerina
listener lsn = new Listener();
```

Before this change, `listener` authors had to use `panic` in the `init` method instead of returning an error if the `listener` object failed to initialize.

If the initialization of the listener object returns an error, module initialization will fail.

```ballerina
listener lsn = new Listener();

public class Listener {

   public isolated function 'start() returns error? {
   }

   public isolated function gracefulStop() returns error? {
   }

   public isolated function immediateStop() returns error? {
   }

   public isolated function detach(service object {} s) returns error? {
   }

   public isolated function attach(service object {} s, string[]|string? name = ()) returns error? {
   }

   public function init() returns error? {
      ...
      // object init failed due to some reason
      if (object_init_failed) {
         return error("Listener initialization failed");
      }
   }
}
```

**Previous Syntax:**
```ballerina
listener lsn = new Listener();

public class Listener {
   ...
   ...
   // listener life cycle methods

   public function init() {
      ...
      // object init failed due to some reason
      if (object_init_failed) {
         panic error("Listener initialization failed");
      }
   }
}
```

##### Referring Lang Library Modules Without Using Quoted Identifiers

Lang library module prefixes can now be used without the initial quote. For example, both the approaches below are now supported.

```ballerina
int a = int:sum(1, 2);
```

```ballerina
int a = ‘int:sum(1, 2);
```

The way of overriding a langlib module is also relaxed now. For example, both the approaches below are now supported.

```ballerina
import somePackage.someModule as string;
```

and

```ballerina
import somePackage.someModule as `string;
```

##### Improved Lang Library Methods

###### Introduction of the `includes` Method

A new lang library method named `includes`, which tests whether a `string` value includes another `string` value has been added to the `ballerina/lang.string` library. It accepts an optional second argument to indicate the index to start searching from. It returns `true` only if the string contains the other string at an index greater or equal to the start index. The value `false` will be returned otherwise.

```ballerina
string str = "Ballerina Programming Language";
boolean contains = str.includes("Language", 10);
```

###### Introduction of the `sleep` Method

A new `sleep` method, which pauses the execution of the current strand for a specified time in seconds has been added to the `ballerina/lang.runtime` library.

```ballerina
runtime:sleep(2.0);
```

###### Introduction of the `getStackTrace` Method

A new `getStackTrace` method has been introduced in the `ballerina/lang.runtime` library to get a stack trace for the current call stack for the specified execution point. It returns an array of stack frames. 

```ballerina
runtime:StackFrame[] stackFrames = runtime:getStackTrace();
```

###### Introduction of the `Cloneable` Type

A new `Cloneable` type has been introduced to the `ballerina/lang.value` library. This is a cyclic union type. This type represents the values on which `clone` and `cloneReadOnly` can be applied on.

```ballerina
public type Cloneable readonly|xml|Cloneable[]|map<Cloneable>|table<map<Cloneable>>;
```

#### Rename of the `ballerina/java` Module

The `ballerina/java` module is renamed to `ballerina/jballerina.java`.

#### Runtime

New APIs are added for creating `readonly` Ballerina records and arrays from Java. 

The new `ValueCreator.createReadonlyArrayValue` API creates a new `readonly` Ballerina array from the given Java array and the `ValueCreator.createReadonlyRecordValue` creates a new `readonly` Ballerina record.

##### Configurable

The `configurable` feature is improved to support variables with decimal and arrays of int, float, string, boolean and decimal types.

Configurations can be provided at runtime using the `Config.toml` file in the current working directory or by exporting the file path using the `BALCONFIGFILE` environment variable. For the tests, configurations can be overridden by having the `Config.toml` file inside the tests directory.

#### Developer Tools

##### Language Server

- `Find all Reference` Support
- CodeLens support for `DocumentThis` is available to auto-generate documentation for public documentable constructs
- CodeAction for `ChangeVariableType` is available to solve incompatible variable assignments

##### Project API

TOML and MD files are made a part of the Project API.

##### Debugger

- Enhanced table variable presentation with the support to view child entries
- Introduced type test expression evaluation support

##### Test Framework

Support for function pointers in the `@test:Config {}` annotation. This applies to the `before`, `after`, `dependsOn`, and `dataProvider` fields of the annotation. 

##### Bindgen Tool
Introduced a `-m|--modules` flag to generate module-level mappings for Java packages generated using the Bindgen tool.

##### Maven Resolver
Introduced the support for specifying custom Maven repositories in the `Ballerina.toml` file. The configuration below can be used for this purpose.

```toml
[[platform.java11.repository]]
id = "<maven-repository-id>"
url = "<maven-repository-url>"
username = "<github-username>"
password = "<github-PAT>"
```

##### Ballerina Shell REPL [EXPERIMENTAL]

Introduced REPL support for Ballerina, which can be accessed via the `bal shell` command. Shell runs a REPL instance of Ballerina to enable running snippets of code. An example shell session is shown below:

```bash
> bal shall
Welcome to Ballerina Shell REPL.
Type /exit to exit and /help to list available commands.

=$ any a = 10

=$ a is int

=$ function add(int x, int y) returns int => x + y

=$ add(3, 4)
7

=$ /exit 
| Bye!!!
```

##### Documentation

Now, documentation URLs follow the `orgName/packageName/version/moduleName` structure.

#### Standard Library

##### HTTP Module Improvements

###### Allow Multiple Return Types for the Resource Method

The `resource` method can return anydata type, an `http:Response` object, `StatusCode` records along with `error?`. Instead of using an `http:Caller`, the response can be sent similarly by returning from the method. 

When returning anydata, the `@http:Payload` annotation can be used to specify the content type of the response additionally. Otherwise, the default content type of the respective return value type will be added. 

```ballerina
service on helloEP {
    resource function gethello () returns @http:Payload {mediaType: text / plain} string {
        return “Hello world”;
    }
}
```

##### Introduce Status Code Response Records

With the introduction of records to the mostly used status code, the response can be sent inline. 

```ballerina
service on helloEP {
    resource function get hello () returns http:Ok? {
        return {body:”Hello world”, headers: {x-test:”123abc”}, mediaType:”text/plain”};
    }
}
```

###### Introduce the Response Limit Configuration


The `http:Client` facilitates inbound response validations on the size limits. Each response that fails to meet the threshold will be returned as an error.

```ballerina
http:Client clientEP = new ("http://localhost:9092/hello", config = {responseLimits: {
        maxStatusLineLength: 50,
        maxHeaderSize: 1000,
        maxEntityBodySize: 50
    }});
```

###### Improve Listener/Client Return Type to Union with Error

Errors, which might occur during the listener and client initialization can be handled now. When the `listener` keyword is added to the listener, the error will fail the module init. 

**New Syntax:**

```ballerina
http:Listener|http:ListenerError ep = new (9090);
http:Client|http:ClientError myClient = new ("http://localhost:9100", {httpVersion: "2.0"});
```

###### Improve the `getHeader()` and `getHeaders()` return types to Union with Error

**New Syntax:**

```ballerina
string|error value = request.getHeader("Content-Type"); 
string[]|error values = request.getHeaders("Accept");
```

###### Remove Status Code Related `http:Caller` Methods

The `http:Caller` remote methods such as `ok()`, `created()`, `accepted()`, `noContent()`, `badRequest()`, `notFound()`, and `internalServerError()` were removed along with the response record introduction

##### WebSocket Module Improvements

- The Websocket module has been moved out of the HTTP module. Therefore, the import should be changed from `ballerina/http` to `ballerina/websocket`.
- Introduced a new listener as follows for the WebSocket module.
`listener websocket:Listener wsListener = new(9090);`
- This module now has the two types of services below that are mandatory to work with WebSockets. 
    - `websocket:UpgradeService` - This handles the HTTP to WebSocket upgrade. This service has a single get resource, which returns a `websocket:Service` or an error. Optionally, this takes in the `http:Request` parameter. To accept the WebSocket upgrade, this resource should return a `websocket:Service`. Or else, to cancel the WebSocket upgrade, it must return a `websocket:Error`.
    - `websocket:Service` - This handles the events after the WebSocket upgrade. This service has a predefined set of remote functions like `onTextMessage`, `onBinaryMessage`, `onError`, `onPing`, `onPong`, `onOpen`, `onClose`. Once the connection is successfully updated to a WebSocket connection, upon receiving WebSocket frames/messages, those will get dispatched to these remote functions. 

    **New Syntax:**

    ```ballerina
    import ballerina/http;
    import ballerina/websocket;

    service / basicon new websocket:Listener(9000) {
        resource function get.(http:Request req) returns websocket:Service|websocket:UpgradeError {
            return new WsService();
        }
    }

    service class WsService {
        *websocket:Service;
        remote function onOpen(websocket:Caller caller) {
        }

        remote function onTextMessage(websocket:Caller caller, string text) {
        }

        remote function onBinaryMessage(websocket:Caller caller, byte[] b) {
        }
    }
    ```

    The `onTextMessage` and `onBinaryMessage` will take in the complete WebSocket message. Unlike earlier versions, `onTextMessage` doesn’t support data binding. WebSocket messages dispatched to this remote function will only be in the `string` format.

    The `websocket:Caller` has the `writeTextMessage`, `writeBinaryMessage`, `ping`, `pong`, and, `close` as remote functions. Unlike earlier versions, `writeTextMessage` doesn’t support data binding. Complete messages only in the string format will be accepted by this.

    **New Syntax:**

    ```ballerina   
    caller->writeTextMessage(text);
    caller->writeBinaryMessage(byteArr);
    ```

- Introduced a WebSocket Async client
    The WebSocket module now has a `websocket:AsyncClient`. This client can take in a `websocket:Service` as a callback service to receive WebSocket messages at the client initialization. This service has a predefined set of remote functions like `onTextMessage`, `onBinaryMessage`, `onError`, `onPing`, `onPong`, `onOpen`, and `onClose`. 

    **New Syntax**

    ```ballerina
    import ballerina/io;
    import ballerina/websocket;

    public function main() returns websocket:Error? {
        websocket:AsyncClient wsClientEp = check new ("ws://echo.websocket.org", new ClientService());
        var err = wsClientEp->writeTextMessage("Hello World!");
    }

    service class ClientService {
        *websocket:Service;
        remote function onTextMessage(websocket:Caller conn, string text) {
        }
    }
    ```

    The `websocket:AsyncClient` has the `writeTextMessage`, `writeBinaryMessage`, `ping`, `pong`, and `close` remote functions. 

    **New Syntax:**

    ```ballerina
    asyncClient>writeTextMessage(text);
    asyncClient>writeBinaryMessage(byteArr);
    ```

- Improved the listener/client return type to union with error
    Errors, which might occur during the listener and client initialization can be handled now. When the `listener` keyword is added to the listener, the error will fail the module init. 

    **New Syntax:**

    ```ballerina
    websocket:Listener|websocket:Error ep = new(9090); 
    websocket:AsyncClient|websocket:Error wsClient = new("ws://echo.websocket.org");
    ```

##### gRPC Module Improvements

###### Service Changes

- Enable returning specific data types directly from the remote functions (even record types and streams).
    ```ballerina
    service "Chat" on ep {
remote function chat(stream<string, error?> clientStream) returns stream<string, error?> {
    }
}
    ```
- Add support to send/receive custom headers in the request/response path.

###### Client Changes

- Clients have the capability to receive a stream object in the server streaming scenario.
    ```ballerina
    stream<string, grpc:Error?> result = check endpoint > chat("WSO2");
    ```
- In the client and bidirectional streaming use cases, it returns a streaming client that has the capability to read and write data.
    ```ballerina
    grpc:StreamingClient streamingClient = check endpoint->chat();
    // Send messages
    check streamingClient->send(msg);
    // Receives messages
    var result = streamingClient->receive();
    ```
- Added the support to send/receive custom headers in the request/response path.

###### Protobuf Tool

- Generate a custom caller object from the Protobuf tool
- Generate a custom streaming client from the Protobuf tool
- Update the Protobuf tool to generate specific types using langlib data types

##### Security Improvements

Ballerina listener authentication and authorization, and client authentication were completely redesigned. The new design is compatible with most of the standard libraries like HTTP, gRPC, WebSocket etc.,

###### HTTP Listener Authentication and Authorization

A Ballerina HTTP listener can be configured to authenticate and authorize the inbound requests. Ballerina has built-in support for the following listener authentication mechanisms.

- Basic authentication
- LDAP user store
- JWT authentication
- OAuth2 authentication

For more information, see [Authentication and Authorization](/swan-lake/learn/security/authentication-and-authorization/#http-listener-authentication-and-authorization).

###### HTTP Client Authentication

The Ballerina HTTP client can be configured to send authentication information to the endpoint being invoked. Ballerina has built-in support for the following client authentication mechanisms.

- Basic authentication
- JWT authentication
- Self-signed JWT
- Bearer token
- OAuth2 authentication
- Client credentials grant type
- Password grant type
- Direct token type

For more information, see [Authentication and Authorization](/swan-lake/learn/security/authentication-and-authorization/#http-client-authentication).

##### GraphQL Module Improvements

###### Introspection Support

Ballerina GraphQL services now support introspection queries on the schema.

###### Improved Resource Functions

GraphQL resources can now return values union with  `error` values. 

##### Common Changes in Messaging Modules

- The `resource` functions are changed to `remote` functions in the new listener APIs. 
- The `service` name is given as a string with the new Ballerina language changes.

##### Kafka Module Improvements

###### Client Changes

- The `kafka:Consumer` is separated into `kafka:Listener` (asynchronous) and `kafka:Consumer` (synchronous). 
- The return type of the `init` functions of the `kafka:Producer` and `kafka:Consumer` is changed to `Error?`. 
- The `subscribeToPattern()` of the `kafka:Consumer` is changed to `subscribeWithPattern()`.
- A new record type named `ProducerRecord` is introduced for sending messages. 

    ```ballerina
    public type ProducerRecord record {|
        string topic;
        byte[] key?;
        byte[] value;
        int timestamp?;
        int partition?;
    |};
    ```

- The `send()` method of the `kafka:Producer` is changed to `sendProducerRecord(ProducerRecord producerRecord)`. An example of sending a message with the new API is given below.

    ```ballerina
    string message = "Hello World, Ballerina";
    kafkaProducer->sendProducerRecord({ topic: "test-kafka-topic",
                                        value: message.toBytes() });
    ```

###### Service and Listener Changes

- The return type of the `kafka:Listener init` is changed to `Error?`. 
- Has a single type of service that supports the two types of remote functions below:
    - `onConsumerRecord(kafka:ConsumerRecord[] record) {}` 
    - `onConsumerRecord(kafka:Caller caller, kafka:ConsumerRecord[] record) {}`
- The `kafka:Caller` is introduced to remote functions to commit offsets of the consumed records.
- The new syntax with the service changes is given below.

    ```ballerina
    listener kafka:Listener kafkaListener = new (consumerConfigs);

    service kafka:Service on kafkaListener {
        remote function onConsumerRecord(kafka:Caller caller, kafka:ConsumerRecord[] records) {
        // Process consumed records
        }
    }
    ```

##### NATS Module Improvements

 - The `ballerinax/nats` module is split into two packages as `ballerinax/nats` (NATS client) and `ballerinax/stan` (NATS Streaming client).
- The `nats:Connection` is removed entirely. 
- The `nats:Producer` is renamed to `nats:Client`. 
- The return type of the `nats:Client` is changed to `Error?`.
- The `nats:Message` object is changed into a record type. 

    ```ballerina
    public type Message record {|
           byte[] content;
           string subject;
           string replyTo?;
    |};
    ```

- The `publish()` of the `nats:Producer` is changed to `publishMessage(Message message)` of the `nats:Client`. An example of sending a message with the new API is given below.

    ```ballerina
    string message = "Hello from Ballerina";

    nats:Client natsClient = check new;

    check natsClient->publishMessage({
        content: message.toBytes(),
        subject: "demo.bbe.subject"
    });
    ```

###### Service and Listener Changes

- The return type of the `nats:Listener init` is changed to `Error?`. 
- Has a single type of service that supports the two types of remote functions below:
    - `onMessage(nats:Message message) {}`  
    - `onRequest(nats:Message message) returns anydata {}` 
- A new `onRequest` function is introduced to directly reply to a message by returning a value if the `replyTo` subject is present.
- If the subject name is not given in the `@nats:ServiceConfig`, the name of the service is considered as the subject name. 
- The new syntax with the service changes is given below.

    ```ballerina
    import ballerinax/nats;

    listener nats:Listener subscription = new;

    @nats:ServiceConfig {subject: "demo.bbe.*"}
    service nats:Service on subscription {

        remote function onMessage(nats:Message message) {
        }
    }
    ```

##### NATS Streaming Module Improvements

A new package named `ballerinax/stan` is introduced to handle the NATS Streaming Server related functionality.

###### Client Changes

- The `nats:Connection` is removed entirely from the NATS Streaming client as well. 
- The `stan:Client` is introduced to handle the client-side functionality. 
- An example of sending messages using the new `ballerinax/stan` package to a NATS Streaming server is given below. 

    ```ballerina
    import ballerinax/stan;

    public function main() returns error? {
        string message = "Hello from Ballerina";
        stan:Client stanClient = check new;
        string result = check stanClient->publishMessage({
            content: message.toBytes(),
            subject: "demo"
        });
    }
    ```

###### Service and Listener Changes

- The return type of the `stan:Listener init` is `Error?`. 
- Has a single type of service that supports the `onMessage` remote function below:
    `onMessage(nats:Message message) {}`
- If the subject name is not given in the `@stan:ServiceConfig`, the name of the service is considered as the subject name. 
- The new syntax with the service changes is given below.

    ```ballerina
    import ballerinax/stan;

    listener stan:Listener lis = new;

    @stan:ServiceConfig {subject: "demo"}
    service stan:Service on lis {
        remote function onMessage(stan:Message message) {
        }
    }
    ```


##### RabbitMQ Module Improvements

###### Client Changes

- The `rabbitmq:Connection` is removed entirely.
- The `rabbitmq:Channel` is renamed to `rabbitmq:Client`, which will handle the client-side functionality. The `init` function of the `rabbitmq:Client` returns `Error?`.
- The `rabbitmq:Message` object is changed into a record type.

    ```ballerina
    public type Message record {|
        byte[] content;
        string routingKey;
        string exchange = "";
        int deliveryTag?;
        BasicProperties properties?;
    |};
    ```

- The `queueDeclare()` function of the `rabbtimq:Channel` is split into `queueDeclare()` and `queueAutoGenerate()` of the `rabbtimq:Client`. 
- The `basicPublish()` function of the `rabbitmq:Channel` is changed to `publishMessage(Message message)` of the `rabbitmq:Client`. An example of sending a message with the new API is given below.

    ```ballerina
    import ballerinax/rabbitmq;

    public function main() returns error? {
        rabbitmq:Client newClient = check new;

        check newClient->queueDeclare("MyQueue");

        string message = "Hello from Ballerina";
        check newClient->publishMessage({
            content: message.toBytes(),
            routingKey: "MyQueue"
        });
    }
    ```

###### Service and Listener Changes

- The return type of the `rabbitmq:Listener init` is changed to `Error?`. 
- Has a single type of service that supports the three types of remote functions below:
     - `onMessage(rabbitmq:Message message) {}`
     - `onMessage(rabbitmq:Message message, rabbitmq:Caller caller) {}`
     - `onRequest(rabbitmq:Message message) returns anydata {}`
- A new `onRequest` function is introduced to directly reply to a message by returning a value if the `replyTo` subject is present.
- If the subject name is not given in the `@rabbitmq:ServiceConfig`, the name of the service is considered as the subject name. 
- The new syntax with the service changes is given below.

    ```ballerina
    import ballerinax/rabbitmq;

    listener rabbitmq:Listener channelListener = new;

    @rabbitmq:ServiceConfig {queueName: "MyQueue"}
    service rabbitmq:Service on channelListener {
        remote function onMessage(rabbitmq:Message message) {
        }
    }
    ```

##### Time Module Improvements

The improvements below have been added to the `Time` module.

- Added support for commonly-used date-time formatters in the `time:format()` & `time:parse()` APIs.
- The hours, minutes, seconds, milliseconds, and zone ID parameters of the `time:createTime()` API have been made defaultable.
- Introduced a new `time:Duration` record type to represent a chunk of time.
- Modified the `time:addDuration()` and `time:subtractDuration()` APIs to accept the `time:Duration` records to be added/subtracted.
- Introduced a new `time:getDifference()` API to calculate the difference between two `time:Time` records.
- Introduced a new `time:getTimezones()` API to retrieve the timezone IDs supported by the underlying native code.
- Introduced an enum to represent the days of the week and modified the `time:getWeekday()` API to return this enum.

##### Rename System Module to OS

The previous `system` module is now renamed to `os`. All the Operating System independent functionalities are included in this module.

##### Runtime Module Improvements

The methods below have been removed from the `runtime` module since these methods have moved to the `lang:runtime`.

- sleep
- getCallStack

##### Email Module Improvements

###### Common Changes for Client and Server Configurations

- The `email:Email` is changed to `email:Message`.

- Attachment support is improved to support file attachments directly with its content type. The new `email:Attachment` is as follows.

```ballerina
public type Attachment record {|
    string filePath;
    string contentType;
|};
```

-  The `email:Message` record is modified with union-typed `string` types for `to`, `cc`, `bcc`, and `replyTo` to add flexibility. An optional `htmlBody` field is added to support the HTML body. The new record is as follows. 

    > Note how the `attachments` field is modified.

    ```ballerina
    public type Message record {|
        string|string[] to;
        string subject;
        string 'from;
        string body;
        string htmlBody?;
        string|string[] cc?;
        string|string[] bcc?;
        string|string[] replyTo?;
        string contentType?;
        map<string> headers?;
        string sender?;
        Attachment|(mime:Entity|Attachment)[] attachments?;
    |}
    ```

- The `enableSsl` boolean property is replaced with the `security` parameter to enable different types of transport-layer security. This new parameter is an enumeration with the `START_TLS_AUTO|START_TLS_ALWAYS|START_TLS_NEVER|SSL` options. The default/undefined value is `SSL`.

- Self-signed certificate support is added while default SSL/TLS support is restricted to self-signed certificates with relevant configurations and CA-certified certificates. Hostname verification is made mandatory for SSL/TLS support. Anyway, hostname verification can be disabled with the configuration by passing the value of the `mail.smtp.ssl.checkserveridentity` property as `”false”`.

###### Client Changes

- A new `sendEmail` method is added to the `email:SmtpClient` API to send emails directly without creating the `email:Email` record supporting extra fields as named optional parameters. An example of sending an email with the new API is given below.

    ```ballerina
    Error? response = smtpClient->sendEmail(toAddresses, subject, fromAddress, body, cc = ccAddresses, bcc = bccAddresses, 
    htmlBody = htmlBody, contentType = contentType, headers = {header1_name: "header1_value"}, sender = sender, replyTo = 
    replyToAddresses, attachments = bodyParts);
    ```

- The `read` method of `email:ImapClient`, `email:PopClient`, and `email:Listener` (i.e., `new email:PopListener` and `email:ImapListener`) are changed to `receiveEmailMessage`.

- All client initializations return an `email:Error` when an error occurs during the initialization.

###### Service and Listener Related Changes

- All listener initializations return an `email:Error` when an error occurs during the initialization.

- The `email:Listener` is split into the `email:PopListener` and `email:ImapListener`. Therefore, the `protocol` field is removed from the new protocol-specific listeners. The `email:PopConfig` or `email:ImapConfig` that were used as fields for the `email:Listener` are not required for the new API implementation. Protocol configuration related fields are made parts of the new listeners.

- The `resource` functions are changed to `remote` functions in the new listener APIs.

- The `service` name is given as a string with the new Ballerina language changes.

- The `onMessage` method of the `email:Listener` (i.e., `new email:PopListener` and `email:ImapListener`) are changed to `onEmailMessage`.

- The `pollingInterval` field of the `email:Listener` is changed to `pollingIntervalInMillis` in the new listener APIs. That makes it consistent across other Ballerina modules, which are time durations configured in milliseconds.

- A sample POP3 listener is given below.

    **New Syntax:**

    ```ballerina
    listener email:PopListener emailListener = new ({
        host: "pop.email.com",
        username: "reader@email.com",
        password: "pass456",
        pollingIntervalInMillis: 2000,
        port: 995
    });

    service "emailObserver" on emailListener {

    remote function onEmailMessage(email:Message emailMessage) {

        }

    remote function onError(email:Error emailError) {

        }
    }
    ```

##### WebSub Module Improvements

###### Hub-Related Changes

- Default implementation for the `websub:Hub` has been removed from the module.
- API specification for the WebSub Hub is moved to the `websubhub` module.

##### Publisher-Related Changes

- The implementation related to the `websub:PublisherClient` is moved to the `websubhub` module.

##### Subscriber-Related Changes

- The two new configurations below are introduced to the `@websub:SubscriberServiceConfiguration`.
  - `accept` - The expected media type
  - `acceptLanguage` - The expected language type
- API specification for the `@websub:SubscriberService` is updated with the changes below.
  - The `onIntentVerification` and `onNotification` functions are removed.
  - The `onSubscriptionVerification`, `onEventNotification`, and `onSubscriptionValidationDenied` functions are introduced.
- The updated `websub:SubscriberService` sample implementation is as follows.

    ```ballerina
    listener websub:Listener testListener = new (9090);

    @websub:SubscriberServiceConfig {
        path: "/websub",
        subscribeOnStartUp: false,
        target: ["http://localhost:9191/websub/hub", "http://websubpubtopic.com"],
        leaseSeconds: 36000,
        secret: "Kslk30SNF2AChs2"
    }
    service / subscriberon testListener {
    remote function onSubscriptionValidationDenied(SubscriptionDeniedError msg) returns Acknowledgement {
        // execute subscription validation denied action
        }

    remote function onSubscriptionVerification(SubscriptionVerification msg) returns SubscriptionVerificationSuccess|
        SubscriptionVerificationError {
        // execute subscription verification action
        }

    remote function onEventNotification(ContentDistributionMessage event) {
        // execute event notification received action
        }
    }
    ```


##### Introduced New Modules

###### Random

This module provides functions related to random number generation.

###### RegEx

This module provides RegEx utilities such as checking whether a string matches a given RegEx, replacing substrings, and splitting strings based on a RegEx.

###### TCP

The Socket module is replaced by the TCP module. Therefore, the import statement needs to be changed from `ballerina/socket` to `ballerina/tcp`.

New APIs for the client and listener are introduced in the TCP module.

**Client Changes**

- The initialization changed from `socket:Client socketClient = new ({ host: "localhost", port: 61598 }); ` to `tcp:Client socketClient = check new ("localhost", 3000);`, which returns the `tcp:Error` if there an error occurs while initializing the client.
- The `write` method name changed to `writeBytes`. You don’t have to explicitly write a while loop to ensure the data is written completely as before. Instead, the `writeBytes` method ensures to write the data completely.
- The `read` method name changed to `readBytes`, which now returns a `readonly & byte[]` instead of a `[byte[], int]` tuple.

**New Syntax:**

```ballerina
import ballerina/tcp;

public function main() returns tcp:Error? {

    tcp:Client socketClient = check new ("localhost", 3000);

    check socketClient->writeBytes(“Hello Ballerina”.toBytes());

    readonly & byte[] receivedData = check socketClient->readBytes();

    check socketClient->close();
}
```

**Listener Changes**

**New Syntax:**

```ballerina
listener tcp:Listener socketListener = new (9090);
```

The service type with resource functions is removed from the module. The new implementation has the following two types of services.

1. The `tcp:Service`, which handles a TCP connection. This service has a predefined `onConnect` remote method that returns a `tcp:ConnectionService` or `tcp:Error?`.
2. The `tcp: ConnectionService`, which handles the traffic between the client and server. This can have the following optional remote methods.
    - `remote function onBytes(readonly & byte[] data) returns Error? { }`
    - `remote function onClose() returns Error? { }`
    - `remote function onError(readonly & Error err) returns Error? { }`

The `read` method is removed from the `tcp:Caller`. Also, the `write` methods of the `Caller` renamed to `writeBytes`, which is similar to the Client’s `writeBytes` method.

**New Syntax:**

```ballerina
import ballerina/tcp;

service on new tcp:Listener(3000) {
remote function onConnect(tcp:Caller caller) returns tcp:ConnectionService {
        return new TCPService(caller);
    }
}

service class TCPService {
    tcp:Caller caller;

    public function init(tcp:Caller c) {
        self.caller = c;
    }

    remote function onBytes(readonly & byte[] data) returns byte[]|tcp:Error? {
        return data;
    }

    remote function onClose() returns tcp:Error? {
    }

    remote function onError(readonly & tcp:Error err) returns tcp:Error? {
    }
}
```

###### UDP

The UDP module has been moved out of the Socket module. Therefore, it is required to change the import from `ballerina/socket` to `ballerina/udp`.

**Client Changes**

- Initialization changed from `socket:UdpClient socketClient = new(localAddress = {host: "localhost", port: 8080 });` to `udp:Client socketClient = check new;`. This returns the `udp:Error` if an error occurred while initializing the client.
- The `sendTo` method name changed to `sendDatagram`. This takes a `udp:Datagram` as a parameter. You don’t need to explicitly write a while loop to ensure the data is written completely. The `writeBytes` method ensures to write the data completely.
- The `receiveFrom` method name changed to `receiveDatagram`. This now returns a `readonly & udp:Datagram` instead of a `[byte[], int, socket:Address]` tuple.

    **New Syntax:**

    ```ballerina
    import ballerina/udp;

    public function main() returns udp:Error? {
        udp:Client socketClient = check new;
        udp:Datagram datagram = {
            remoteHost: "localhost",
            remotePort: 48829,
            data: "Hello Ballerina".toBytes()
        };
        check socketClient->sendDatagram(datagram);
        readonly & udp:Datagram result = check socketClient->receiveDatagram();
        check socketClient->close();
    }
    ```

- Introduced a `ConnectClient` and a `Listener` to the new UDP module as follows.

    **ConnectClient:**

    ```ballerina
    import ballerina/udp;

    public function main() returns udp:Error? {
        udp:ConnectClient socketClient = check new ("localhost", 48829);
        check socketClient->writeBytes("Hello Ballerina".toBytes());
        readonly & byte[] result = check socketClient->readBytes();
        check socketClient->close();
    }
    ```

    **Listener:**

    ```ballerina
    import ballerina/udp;

    service on new udp:Listener(48829) {

    remote function onBytes(readonly & byte[] data, udp:Caller caller) returns (readonly & byte[])|udp:Error? {
            return data;
        }

    remote function onError(readonly & udp:Error err) {
        }
    }
    ```

###### WebSubHub 

- This module contains the API specifications and implementations related to the WebSub Hub, WebSub Hub Client and WebSub Publisher.
- This is an inter-dependent module for the `websub` module.

**Hub Implementation**

- The default `websub:Hub` implementation has been removed and language-specific API abstraction is defined in the `websubhub:Service`.
- Updated the WebSub Hub sample implementation to comply with the new API specification as follows.

    ```ballerina
    listener websubhub:Listener hubListener = new (9001);

    service / websubhubon hubListener {

    remote function onRegisterTopic(TopicRegistration message) returns TopicRegistrationSuccess|TopicRegistrationError {
        // implement action to execute on topic-registration
        }

    remote function onDeregisterTopic(TopicDeregistration message) returns TopicDeregistrationSuccess|TopicDeregistrationError {
        // implement action to execute on topic-deregistration
        }

    remote function onUpdateMessage(UpdateMessage msg) returns Acknowledgement|UpdateMessageError {
        // implement action to execute on content-update for topic
        }

    remote function onSubscription(Subscription msg) returns SubscriptionAccepted|SubscriptionPermanentRedirect|
        SubscriptionTemporaryRedirect|BadSubscriptionError|InternalSubscriptionError {
        // implement action to execute on new subscription
        }

    remote function onSubscriptionValidation(Subscription msg) returns SubscriptionDeniedError? {
        // implement action to execute on subscription validation
        }

    remote function onSubscriptionIntentVerified(VerifiedSubscription msg) {
        // implement action to execute on subscription intent verification
        }

    remote function onUnsubscription(Unsubscription msg) returns UnsubscriptionAccepted|BadUnsubscriptionError|
        InternalUnsubscriptionError {
        // implement action to execute on unsubscription
        }

    remote function onUnsubscriptionValidation(Unsubscription msg) returns UnsubscriptionDeniedError? {
        // implement action to execute on unsubscription validation
        }

    remote function onUnsubscriptionIntentVerified(VerifiedUnsubscription msg) {
        // implement action to execute on unsubscription intent verification
        }
    }    
    ```

**Hub Client Implementation**

- The `websubhub:Client` is introduced to distribute the updated content to subscribers.
- The example below is a sample use-case of the WebSub Hub Client.

```ballerina
    service / websubhubon hubListener {
    remote function onSubscriptionIntentVerified(websubhub:VerifiedSubscription msg) {

            // you can pass client config if you want 
            // say maybe retry config
            websub:HubClient hubclient = new (msg);
            check start notifySubscriber(hubclient);
        }

        function notifySubscriber(websubhub:HubClient hubclient) returns error? {
            while (true) {
                // fetch the message from MB
                check hubclient->notifyContentDistribution({content: "This is sample content delivery"});
            }
        }
    }
```

**Publisher Implementation**

The `websub:PublisherClient` is moved to the `websubhub:PublisherClient`.

##### Removed Modules

###### Config

The configuration use cases are now covered under the `configurable` language feature. 

###### Math

The APIs related to random number generation were moved to the new `random` module. The rest of the APIs have replacements in the `lang.float` and `lang.int` packages.

###### Stringutils

The regex-related APIs that were supported by this module have been moved to the new `regex` module. The rest of the APIs have replacements in the langlib packages.

###### Socket

The `socket` module was removed and got replaced by the `TCP` and `UDP` modules.


#### Code to Cloud

- The Kubernetes artifacts can be generated using the `--cloud=k8s` build option. The `import ballerina/cloud as _` is no longer required.
- VS code plugin support for the `Kubernetes.toml`
    - Code Completion based on the c2c specification
    - Code Actions add/modify the probes and environments based on the source code.

#### Breaking Changes

##### Language

- Resource method declarations are no longer allowed in object-type descriptors.
- Resource methods are not considered to be part of the type.
- Non-`isolated` service variables defined outside an `isolated` function can be accessed within the function only if the variable is a `final` variable and the type is a subtype of `readonly`.
- The `@icon` annotation has been replaced with the `@display` annotation.
- The value type of the XML iteration, which was previously `xml|string` is now `xml`. Moreover, the value type of the `xml<T>` iteration is now `T`. 

#### Taint Analyzer Update

With this release, the taint analyzer does not produce taint errors unless explicitly enabled. However, the taint analyzer does perform the taint flow analysis without producing errors regardless of it being enabled or not.

This is enabled via the build options below in the `Ballerina.toml` file

```toml
[build-options]
taintCheck = true
```

or else, by using the `--taint-check` flag in the Ballerina CLI tools as follows.

```bash
bal run --taint-check[file.bal | project]
bal build --taint-check [file.bal | project]
```
