---
layout: ballerina-left-nav-release-notes
title: Swan Lake Alpha1
permalink: /downloads/swan-lake-release-notes/swan-lake-alpha1/
active: swan-lake-alpha1
redirect_from: 
    - /downloads/swan-lake-release-notes/swan-lake-alpha1
---

### Overview of Ballerina Swan Lake Alpha1  

This Alpha1 release includes the language features planned for the Ballerina Swan Lake release. Moreover, this release includes improvements and bug fixes to the compiler, runtime, standard library, and developer tooling. This release note lists only the features and updates added after the eighth preview of Ballerina Swan Lake.

- [Updating Ballerina](#updating-ballerina)
    - [For existing users](#for-existing-users)
    - [For new users](#for-new-users)
- [Highlights](#highlights)
- [What is new in Ballerina Swan Lake Alpha1](#what-is-new-in-ballerina-swan-lake-alpha1)
    - [Language](#language)
        - [Intersection type support for errors](#intersection-type-support-for-errors)
        - [Support for passing a closed record as the rest argument](#support-for-passing-a-closed-record-as-the-rest-argument)
        - [Support for the empty XML value](#support-for-the-empty-xml-value)
        - [Improvements to the match statement](#improvements-to-the-match-statement)
        - [Support for cyclic union types](#support-for-cyclic-union-types)
        - [Updated syntax for user-defined error construction](#updated-syntax-for-user-defined-error-construction)
        - [Changes to casting with errors](#changes-to-casting-with-errors)
        - [Changes to `toString` and `toBalString` with errors](#changes-to-tostring-and-tobalstring-with-errors)
        - [Changes to object type inclusion with qualifiers](#changes-to-object-type-inclusion-with-qualifiers)
        - [Changes to record type inclusion with rest descriptors](#changes-to-record-type-inclusion-with-rest-descriptors)
        - [Improved listener declaration](#improved-listener-declaration)
        - [Referring lang library modules without using quoted identifiers](#referring-lang-library-modules-without-using-quoted-identifiers)
        - [Improved lang library methods](#improved-lang-library-methods)
    - [Packages](#packages)
        - [Introduction of hierarchical package names](#introduction-of-hierarchical-package-names)
        - [Introduction of the dependencies TOML file](#introduction-of-the-dependencies-toml-file)
        - [Support to accept an empty Ballerina TOML file](#support-to-accept-an-empty-ballerina-toml-file)
    - [Runtime](#runtime)
        - [Configurable](#configurable)
    - [Developer tools](#developer-tools)
        - [Language Server](#language-server)
        - [Project API](#project-api)
        - [Debugger](#debugger)
        - [Test framework](#test-framework)
        - [Bindgen tool](#bindgen-tool)
        - [Maven resolver](#maven-resolver)
        - [Ballerina Shell REPL [EXPERIMENTAL]](#ballerina-shell-repl-experimental)
        - [Documentation](#documentation)
    - [Standard library](#standard-library)
        - [HTTP module improvements](#http-module-improvements)
        - [WebSocket module improvements](#websocket-module-improvements)
        - [gRPC module improvements](#grpc-module-improvements)
        - [Security improvements](#security-improvements)
        - [GraphQL module improvements](#graphql-module-improvements)
        - [TCP module improvements](#tcp-module-improvements)
        - [UDP module improvements](#udp-module-improvements)
        - [Common changes in messaging modules](#common-changes-in-messaging-modules)
        - [Kafka module improvements](#kafka-module-improvements)
        - [NATS module improvements](#nats-module-improvements)
        - [NATS streaming module improvements](#nats-streaming-module-improvements)
        - [RabbitMQ module improvements](#rabbitmq-module-improvements)
        - [Time module improvements](#time-module-improvements)
        - [Rename system module to OS](#rename-system-module-to-os)
        - [Runtime module improvements](#runtime-module-improvements)
        - [Email module improvements](#email-module-improvements)
        - [WebSub module improvements](#websub-module-improvements)
        - [Introduced new modules](#introduced-new-modules)
        - [Removed modules](#removed-modules)
    - [Code to Cloud](#code-to-cloud)
    - [Observability](#observability)
    - [Breaking changes](#breaking-changes)
    - [Taint analyzer update](#taint-analyzer-update)

#### Updating Ballerina

You can use the update tool to update to Ballerina Swan Lake Alpha1 as follows.

##### For existing users

If you are already using Ballerina, you can directly update your distribution to the Swan Lake channel using the [Ballerina update tool](/swan-lake/learn/keeping-ballerina-up-to-date/). To do this, first, execute the command below to get the update tool updated to its latest version. 
                        
> `ballerina update`

From now onwards, the `ballerina` command has to be issued as `bal`. Next, execute the command below to update to Swan Lake Alpha1.

 > `bal dist pull slalpha1`                 

However, if you are using a Ballerina version below 1.1.0, install via the [installers](/downloads/#swanlake).

##### For new users

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.

#### Highlights

- Support for intersection types with errors
- Support for more match patterns in the match statement
- Support for cyclic union type descriptors
- Changes to casting and `toString`/`toBalString` with errors
- Changes to object-type and record-type inclusions
- Improved listener declaration
- The `ballerina` command has been renamed to `bal`
- Introduction of hierarchical package names
- Introduction of the `Dependencies.toml` file
- Introduction of REPL support for Ballerina via the `bal shell` command
- Improvements to developer tools such as the Language Server, Project API, Debugger, Test Framework, Bindgen Tool, Maven Resolver, and Documentation
- Improvements to the HTTP, WebSocket, gRPC, security, GraphQL, Kafka, NATS, NATS Streaming, RabbitMQ, Time, Runtime, Email, and WebSub standard library modules
- Introduction of the new Random, RegEx, TCP, UDP, and WebSubHub standard library modules
- Code action and code completion support for Code to Cloud libraries in the VS Code plugin

### What is new in Ballerina Swan Lake Alpha1

#### Language

##### Intersection type support for errors

Intersection types are now allowed with `error` types. An `error` value will belong to the intersection type (`E1 & E2`) only if it belongs to each member error type (`E1` and `E2`) of the intersection. 

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

#### Support for passing a closed record as the rest argument

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

##### Support for the empty XML value

Previously, it was possible to define a value of type `xml<never>` (i.e., the empty XML value) only using the `concat` XML lang library method. 

```ballerina
xml<never> emptyXmlValue = <xml<never>>'xml:concat();
```

It is now possible to directly create the empty XML value.

```ballerina
xml<never> emptyXmlValue = xml ``;
```

##### Improvements to the match statement

###### Support for more match patterns

**List match pattern**
```ballerina
match v {
    var [a, b] => {
        // Matches lists with 2 elements.
    }    
    var [a, [b, c], d]|var [a, b , c, d] => {
        // Matches 
        // - lists with 3 elements where the second element is a list of 2 elements or
        // - lists with 4 elements
    }
}
```

**Mapping match pattern**
```ballerina
match v {
    {a: "hello", b: "world"} => {
        // Match mappings that contain the field `a` with
        // value "hello" and field `b` with value "world".
    }
    {a: var x} => {
        // Match mappings that contain the field `a`.
        // The value is assigned to the variable `x`
        // and can be assigned within the block.
        io:println(x);
    }
}
```

**Error match pattern**
```ballerina
match v {
    error ("Message") => {
        // Match errors with "Message" as the error message.
    }
    error () => {
        // Match all errors.
    }
}
```

###### Improved type narrowing within match statements

When code is executed through each match-clause, the type of the matched expression is narrowed. In the example below, the type of `v` in the last match clause is narrowed to `string`.

```ballerina
function getString(boolean|int|string v) returns string {
    match v {
        var a if a is int|boolean => {
            return a.toString();
        }
        _ => {
            return v; // Type of `v` is `string` here.
        }
    }
}
```

##### Support for cyclic union types

Cyclic union types are now supported. A cyclic union type descriptor can directly refer to its identifier in its type descriptor.

```ballerina
type Integers int|Integers[]|map<Integers>;

Integers intValue = 5;
Integers intArray = [1, 2, 3, 4];
Integers intMap = {i: 1, j: 2};
Integers integers = [intValue, intArray, intMap];
```

##### Updated syntax for user-defined error construction

The error constructor expression now requires the `error` keyword to construct a user-defined error.

**Previous syntax:**
```ballerina
MyError myError = MyError("Message");
```
 
**New syntax:**
```ballerina
MyError myError = error MyError("Message");
```

#### Changes to casting with errors

Errors cannot be cast away (i.e., if the value that is being cast can be an error, the type to which the cast is attempted should also have a subtype of error). 

The following was allowed previously.

```ballerina
function foo() returns string|int|error {
    return error("Error Message");
}

public function main() {
    string s = <string>foo(); // Cast without considering the error.
}
```

This is now disallowed and can be rewritten as follows.


1. Using `checkpanic` - This will preserve the `panic` behavior (but with a different error - the previous error was a cast error. Now, it will be the actual error returned by `foo()`).

    ```ballerina
    function foo() returns string|int|error {
        return error("Error Message");
    }

    public function main() {
        // Use`checkpanic` to panic if `foo()` returns an error and then attempt the cast.
        string s = <string>checkpanic foo();
    }
    ```

2. Using `check` - Alternatively, if the function’s return type allows returning the error, `check` can be used before attempting the cast to return the error instead of panicking.

    ```ballerina
    function foo() returns string|int|error {
        return error("Error Message");
    }

    public function main() returns error? {
        // Use`check` to return the error if `foo()` returns an error, and then attempt the cast.
        string s = <string>check foo();
    }
    ```

##### Changes to `toString` and `toBalString` with errors

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

#### Changes to object type inclusion with qualifiers

- When object type inclusion is used with an object type descriptor with qualifiers (`isolated`, `client`, `service`), it is now mandatory for the object in which the inclusion is done to also have these qualifiers.
- Object type descriptors can no longer use object type inclusion with `readonly` classes.
- Classes can use object type inclusion with `readonly` classes only if the including classes themselves are `readonly` classes.
- The type reference in an object constructor expression can refer to a `readonly` class only if the object being constructed is `readonly`.

#### Changes to record type inclusion with rest descriptors

Record type inclusion now copies the rest descriptor from the included type to the including type. The including type may override the rest descriptor. 

```ballerina
type Configuration record {|
    int id;
    decimal...;
|};

type DefaultConfiguration record {|
    // The rest descriptor is also copied.
    *Configuration;
    boolean active;
|};

DefaultConfiguration config = {
    id: 1000,
    active: true,
    // Additional fields of type `decimal` can be specified since the rest descriptor
    // is copied from `Configuration`.
    "factor": 1.0,
    "index": 0.0
};
```

The rest descriptor of the `DefaultConfiguration` is of type `decimal`.

```ballerina
type Configuration record {|
    int id;
    decimal...;
|};

type InclusiveConfiguration record {
    // Since `InclusiveConfiguration` is an inclusive record type descriptor the 
    // `anydata` rest descriptor overrides the rest descriptor from `Configuration`.
    *Configuration;
    boolean active;
};

InclusiveConfiguration inclusiveConfig = {
    id: 1002,
    active: true,
    // Additional fields of type `anydata` can be specified since the rest descriptor
    // is overridden as `anydata`.
    "factor": 1.0,
    "owner": "admin"
};

type ExclusiveConfiguration record {|
    // The record type descriptor of  `ExclusiveConfiguration` overrides the rest 
    // descriptor from `Configuration`, making the rest descriptor of `ExclusiveConfiguration` 
    // be of type `boolean`.
    *Configuration;
    boolean active;
    boolean...;
|};

ExclusiveConfiguration exclusiveConfig = {
    id: 1003,
    active: false,
    // Additional fields of type `boolean` can be specified since the rest descriptor is overridden.
    "allow": true
};
```

The rest descriptor type of the `InclusiveConfiguration` is `anydata` and that of the `ExclusiveConfiguration` is `boolean`. The including records override the rest descriptor from the included record.

##### Improved listener declaration  

The listener declaration is improved to allow using listener classes that may return an error on initialization. This allows the following listener declaration where the `init` method of `Listener` may return an error.

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
        // Return an error if initialization failed due to some reason.
        if (objectInitFailed) {
            return error("Listener initialization failed");
        }
    }
}
```

**Previous syntax:**
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

##### Referring lang library modules without using quoted identifiers

Lang library module prefixes can now be used without the initial quote. For example, both the approaches below are now supported.

```ballerina
int a = int:sum(1, 2);
```

```ballerina
int a = 'int:sum(1, 2);
```

##### Improved lang library methods

###### Introduction of the `includes` method

A new lang library method named `includes`, which tests whether a `string` value includes another `string` value has been added to the `ballerina/lang.string` library. It accepts an optional second argument to indicate the index to start searching from. It returns `true` only if the string contains the other string at an index greater or equal to the start index. The value `false` will be returned otherwise.

```ballerina
string str = "Ballerina Programming Language";
boolean includes = str.includes("Language", 10);
```

###### Introduction of the `sleep` method

A new `sleep` method, which pauses the execution of the current strand for a specified time in seconds has been added to the `ballerina/lang.runtime` library.

```ballerina
runtime:sleep(2.0);
```

###### Introduction of the `getStackTrace` method

A new `getStackTrace` method has been introduced in the `ballerina/lang.runtime` library to get a stack trace for the current call stack for the specified execution point. It returns an array of stack frames. 

```ballerina
runtime:StackFrame[] stackFrames = runtime:getStackTrace();
```

###### Introduction of the `Cloneable` type

A new type named `Cloneable` has been introduced to the `ballerina/lang.value` library. This is a cyclic union type. This type represents the values on which `clone` and `cloneReadOnly` can be applied on.

```ballerina
public type Cloneable readonly|xml|Cloneable[]|map<Cloneable>|table<map<Cloneable>>;
```

#### Rename of the `ballerina/java` module

The `ballerina/java` module is renamed to `ballerina/jballerina.java`.

#### Packages

##### Introduction of hierarchical package names

Now, the package name can take the form of `package-name := identifier(.identifer)*` meaning the dot (`.`) is allowed in the package name.

The following is a valid `Ballerina.toml` file.

```toml
[package]
org = "ballerinax"
name = "observe.prometheus"
version = "1.0.0"
```

##### Introduction of the dependencies TOML file

This is a dedicated file to maintain all the dependencies, which is expected to be created in the package root directory. All the dependencies which were previously declared in the `Ballerina.toml` file should be moved to this file now.

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

##### Support to accept an empty Ballerina TOML file

A valid Ballerina package can now contain an empty `Ballerina.toml` file. This makes it easier to convert an application/service written in a standalone Ballerina file to a Ballerina package.

#### Runtime

New APIs are added for creating immutable Ballerina records and arrays from Java. 

The new `ValueCreator.createReadonlyArrayValue` API creates a new `readonly` Ballerina array from the given Java array and the `ValueCreator.createReadonlyRecordValue` creates a new `readonly` Ballerina record.

##### Configurable

The `configurable` feature is improved to support variables with decimal and arrays of `int`, `float`, `string`, `boolean`, and `decimal` types.

For example if the `Config.toml` file contains the following arrays, 

```toml
ints = [1,2,3]
strings = ["red", "yellow", "green"]
```

they can be loaded as follows.

```ballerina
configurable int[] & readonly ints = ?;
configurable string[] & readonly strings = ?;
```

Configurations can be provided at runtime using the `Config.toml` file in the current working directory or by exporting the file path using the `BALCONFIGFILE` environment variable. For the tests, configurations can be overridden by having a `Config.toml` file inside the tests directory.

#### Developer tools

##### Language Server

- `Find all Reference` Support
- CodeLens support for `DocumentThis` is available to auto-generate documentation for public documentable constructs
- CodeAction for `ChangeVariableType` is available to solve incompatible variable assignments

##### Project API

TOML and MD files are made a part of the Project API.

##### Debugger

- Enhanced table variable presentation with the support to view child entries
- Introduced type test expression evaluation support

##### Test framework

Support for function pointers in the `@test:Config {}` annotation. The fields `before`, `after`, `dependsOn` and `dataProvider`, which previously expected the name of the function as a `string`, now accept function pointers instead.

##### Bindgen tool
Introduced a `-m|--modules` flag to generate module-level mappings for Java packages generated using the Bindgen tool.

##### Maven resolver
Introduced support for specifying custom Maven repositories in the `Ballerina.toml` file. The configuration below can be used for this purpose.

```toml
[[platform.java11.repository]]
id = "<maven-repository-id>"
url = "<maven-repository-url>"
username = "<github-username>"
password = "<github-PAT>"
```

##### Ballerina Shell REPL [EXPERIMENTAL]

Introduced Read-Evaluate-Print-Loop (REPL) support for Ballerina, which can be accessed via the `bal shell` command. Shell runs a REPL instance of Ballerina to enable running snippets of code. An example shell session is shown below:

```bash
> bal shell
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

#### Standard library

##### HTTP module improvements

###### Allow multiple return types for the resource method

The `resource` method can return anydata type, an `http:Response` object, `StatusCode` records along with `error?`. Instead of using an `http:Caller`, the response can be sent similarly by returning from the method. 

When returning anydata, the `@http:Payload` annotation can be used to specify the content type of the response additionally. Otherwise, the default content type of the respective return value type will be added. 

```ballerina
service on new http:Listener(8080) {
    resource function get hello () returns string {
        return "Hello"; // Content type defaults to `text/plain`
    }

    resource function get goodbye () returns @http:Payload {mediaType: "text/plain+id"} string {
        return "\"Goodbye!\"";
    }
}
```

##### Introduce status code response records

With the introduction of records for the most commonly used status codes, the response can be sent inline. 

```ballerina
service on helloEP {
    resource function get hello () returns http:Ok? {
        return {body: "Hello world", headers: {"x-test": "123abc"}, mediaType: "text/plain"};
    }
}
```

###### Introduce the response limit configuration


The `http:Client` facilitates validations on inbound responses based on size limits. Each response that exceeds the limits will be returned as an error.

```ballerina
http:Client clientEP = new ("http://localhost:9092/hello", config = {responseLimits: {
        maxStatusLineLength: 50,
        maxHeaderSize: 1000,
        maxEntityBodySize: 50
    }});
```

###### Improve listener/client return type to union with error

Listener and client initialization may return an error now. When the listener is used in a listener declaration, module initialization will fail if the listener initialization returns an error.

**New syntax:**

```ballerina
http:Listener|http:ListenerError ep = new (9090);
http:Client|http:ClientError myClient = new ("http://localhost:9100", {httpVersion: "2.0"});
```

###### Improve the `getHeader()` and `getHeaders()` return types to union with error

**New syntax:**

```ballerina
string|error value = request.getHeader("Content-Type"); 
string[]|error values = request.getHeaders("Accept");
```

###### Remove status code related `http:Caller` methods

The `http:Caller` remote methods such as `ok()`, `created()`, `accepted()`, `noContent()`, `badRequest()`, `notFound()`, and `internalServerError()` were removed along with the response record introduction

##### WebSocket module improvements

- The Websocket module has been moved out of the HTTP module. Therefore, the import should be changed from `ballerina/http` to `ballerina/websocket`.
- Introduced a new listener as follows for the WebSocket module.
`listener websocket:Listener wsListener = new(9090);`
- This module now has the two types of services below that are mandatory to work with WebSockets. 
    - `websocket:UpgradeService` - This handles the HTTP to WebSocket upgrade. This service has a single get resource, which returns a `websocket:Service` or an error. Optionally, this takes in the `http:Request` parameter. To accept the WebSocket upgrade, this resource should return a `websocket:Service`. Or else, to cancel the WebSocket upgrade, it must return a `websocket:UpgradeError`.
    - `websocket:Service` - This handles the events after the WebSocket upgrade. This service has a predefined set of remote methods like `onTextMessage`, `onBinaryMessage`, `onError`, `onPing`, `onPong`, `onOpen`, `onClose`. Once the connection is successfully updated to a WebSocket connection, upon receiving WebSocket frames/messages, those will get dispatched to these remote methods. 

**New syntax:**

```ballerina
import ballerina/http;
import ballerina/websocket;

service / basic on new websocket:Listener(9000) {
    resource function get .(http:Request req) returns websocket:Service|websocket:UpgradeError {
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

The `onTextMessage` and `onBinaryMessage` will take in the complete WebSocket message. Unlike earlier versions, `onTextMessage` doesn't support data binding. WebSocket messages dispatched to this remote method will only be in the `string` format.

The `websocket:Caller` has `writeTextMessage`, `writeBinaryMessage`, `ping`, `pong`, and, `close` as remote methods. Unlike earlier versions, `writeTextMessage` doesn't support data binding. Complete messages only in the string format will be accepted by this.

**New syntax:**

```ballerina   
caller->writeTextMessage(text);
caller->writeBinaryMessage(byteArr);
```

- Introduced a WebSocket Async client
    The WebSocket module now has a `websocket:AsyncClient`. This client can take in a `websocket:Service` as a callback service to receive WebSocket messages at the client initialization. This service has a predefined set of remote methods like `onTextMessage`, `onBinaryMessage`, `onError`, `onPing`, `onPong`, `onOpen`, and `onClose`. 

    **New syntax**

    ```ballerina
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

    The `websocket:AsyncClient` has the `writeTextMessage`, `writeBinaryMessage`, `ping`, `pong`, and `close` remote methods. 

    **New syntax:**

    ```ballerina
    asyncClient>writeTextMessage(text);
    asyncClient>writeBinaryMessage(byteArr);
    ```

- Improved the listener/client return type to union with error
    Listener and client initialization may return an error now. When the listener is used in a listener declaration, module initialization will fail if the listener initialization returns an error.

    **New syntax:**

    ```ballerina
    websocket:Listener|websocket:Error ep = new (9090); 
    websocket:AsyncClient|websocket:Error wsClient = new ("ws://echo.websocket.org");
    ```

##### gRPC module improvements

###### Service changes

- Enable returning specific data types directly from the remote methods (even record types and streams).
    ```ballerina
    service "Chat" on ep {
        remote function chat(stream<string, error?> clientStream) returns stream<string, error?> {
        }
    }
    ```
- Add support to send/receive custom headers in the request/response path.

###### Client changes

- Clients have the capability to receive a stream object in the server streaming scenario.
    ```ballerina
    stream<string, grpc:Error?> result = check endpoint->chat("WSO2");
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

###### Protobuf tool

- Generate a custom caller object from the Protobuf tool
- Generate a custom streaming client from the Protobuf tool
- Update the Protobuf tool to generate specific types using langlib data types

##### Security improvements

Ballerina listener authentication and authorization, and client authentication were completely redesigned. The new design is compatible with most of the standard libraries like HTTP, gRPC, WebSocket, etc.,

###### HTTP listener authentication and authorization

A Ballerina HTTP listener can be configured to authenticate and authorize the inbound requests. Ballerina has built-in support for the following listener authentication mechanisms.

- Basic authentication
- LDAP user store
- JWT authentication
- OAuth2 authentication

For more information, see [HTTP Listener Authentication and Authorization](/swan-lake/learn/security/authentication-and-authorization/#http-listener-authentication-and-authorization).

###### HTTP client authentication

The Ballerina HTTP client can be configured to send authentication information to the endpoint being invoked. Ballerina has built-in support for the following client authentication mechanisms.

- Basic authentication
- JWT authentication
- Self-signed JWT
- Bearer token
- OAuth2 authentication
- Client credentials grant type
- Password grant type
- Direct token type

For more information, see [HTTP Client Authentication](/swan-lake/learn/security/authentication-and-authorization/#http-client-authentication).

##### GraphQL module improvements

###### Introspection support

Ballerina GraphQL services now support introspection queries on the schema.

###### Improved resource methods

GraphQL resources may now return error values.

##### Common changes in messaging modules

- The `resource` methods are changed to `remote` methods in the new listener APIs. 
- The `service` name is given as a string with the new Ballerina language changes.

##### TCP module improvements

The Socket module is replaced by the TCP module. Therefore, the import statement needs to be changed from `ballerina/socket` to `ballerina/tcp`.

New APIs for the client and listener are introduced in the TCP module.

###### Client changes

- `tcp:Client` initialization may now return `tcp:Error` if an error occurs while initializing the client.
- The name of the `write` method changed to `writeBytes`. You don’t have to explicitly write a while loop to ensure the data is written completely as before. Instead, the `writeBytes` method ensures to write the data completely.
- The name of the `read` method changed to `readBytes`. This method now returns `readonly & byte[]` instead of `[byte[], int]`.

**New syntax:**

```ballerina
import ballerina/tcp;

public function main() returns tcp:Error? {

    tcp:Client socketClient = check new ("localhost", 3000);

    check socketClient->writeBytes(“Hello Ballerina”.toBytes());

    readonly & byte[] receivedData = check socketClient->readBytes();

    check socketClient->close();
}
```

###### Service and listener changes

**New syntax:**

```ballerina
listener tcp:Listener socketListener = new (9090);
```

The service type with resource methods is removed from the module. The new implementation has the following two types of services.

1. `tcp:Service` which handles a TCP connection. This service has a predefined `onConnect` remote method that returns `tcp:ConnectionService` or `tcp:Error?`.
2. `tcp: ConnectionService` which handles the traffic between the client and server. This can have the following optional remote methods.
    - `remote function onBytes(readonly & byte[] data) returns Error? { }`
    - `remote function onClose() returns Error? { }`
    - `remote function onError(readonly & Error err) returns Error? { }`

The `read` method is removed from `tcp:Caller`. Also, the `write` method of `Caller` is renamed to `writeBytes`, which is similar to the Client’s `writeBytes` method.

**New syntax:**

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

##### UDP module improvements

The UDP module has been moved out of the Socket module. Therefore, it is required to change the import from `ballerina/socket` to `ballerina/udp`.

###### Client changes

- `udp:Client` initialization may now return `udp:Error` if an error occurred while initializing the client.
- The name of the `sendTo` method changed to `sendDatagram`. This takes a `udp:Datagram` as a parameter. You don’t need to explicitly write a while loop to ensure the data is written completely. The `writeBytes` method ensures to write the data completely.
- The name of the `receiveFrom` method changed to `receiveDatagram`. This now returns `readonly & udp:Datagram` instead of `[byte[], int, socket:Address]`.

    **New syntax:**

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

  Introduced `ConnectClient` and `Listener` to the new UDP module as follows.

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

##### Kafka module improvements

###### Client changes

- The `kafka:Consumer` is separated into `kafka:Listener` (asynchronous) and `kafka:Consumer` (synchronous). 
- The return type of the `init` methods of the `kafka:Producer` and `kafka:Consumer` is changed to `Error?`. 
- The `subscribeToPattern()` method of the `kafka:Consumer` is changed to `subscribeWithPattern()`.
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
    kafkaProducer->sendProducerRecord({topic: "test-kafka-topic",
                                       value: message.toBytes()});
    ```

###### Service and listener changes

- The return type of the `init` method of `kafka:Listener` is changed to `Error?`. 
- Has a single type of service that supports the remote method below:
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

##### NATS module improvements

 - The `ballerinax/nats` module is split into two packages as `ballerinax/nats` (NATS client) and `ballerinax/stan` (NATS Streaming client).
- The `nats:Connection` object is removed entirely. 
- The `nats:Producer` client is renamed to `nats:Client`. 
- The return type of the `nats:Client` client is changed to `Error?`.
- The `nats:Message` object is changed into a record type. 

    ```ballerina
    public type Message record {|
           byte[] content;
           string subject;
           string replyTo?;
    |};
    ```

- The `publish()` method of the `nats:Producer` is changed to `publishMessage(Message message)` of the `nats:Client`. An example of sending a message with the new API is given below.

    ```ballerina
    string message = "Hello from Ballerina";

    nats:Client natsClient = check new;

    check natsClient->publishMessage({
        content: message.toBytes(),
        subject: "demo.bbe.subject"
    });
    ```

###### Service and listener changes

- The return type of the `init` method of `nats:Listener` is changed to `Error?`. 
- Has a single type of service that supports the two types of remote functions below:
    - `onMessage(nats:Message message) {}`  
    - `onRequest(nats:Message message) returns anydata {}` 
- A new `onRequest` remote method is introduced to directly reply to a message by returning a value if the `replyTo` subject is present.
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

##### NATS streaming module improvements

A new package named `ballerinax/stan` is introduced to handle the NATS Streaming Server related functionality.

###### Client changes

- `nats:Connection` is removed entirely from the NATS Streaming client as well. 
- `stan:Client` is introduced to handle the client-side functionality. 
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

###### Service and listener changes

- The return type of the `init` method of `stan:Listener` is `Error?`. 
- Has a single type of service that supports the `onMessage` remote method below:
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


##### RabbitMQ module improvements

###### Client changes

- `rabbitmq:Connection` is removed entirely.
- `rabbitmq:Channel` is renamed to `rabbitmq:Client`, which will handle the client-side functionality. The `init` method of `rabbitmq:Client` returns `Error?`.
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

- The `queueDeclare()` method of `rabbtimq:Channel` is split into `queueDeclare()` and `queueAutoGenerate()` of `rabbtimq:Client`. 
- The `basicPublish()` method of `rabbitmq:Channel` is changed to `publishMessage(Message message)` of the `rabbitmq:Client`. An example of sending a message with the new API is given below.

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

###### Service and listener changes

- The return type of the `init` method of `rabbitmq:Listener` is changed to `Error?`. 
- Has a single type of service that supports the three types of remote functions below:
     - `onMessage(rabbitmq:Message message) {}`
     - `onMessage(rabbitmq:Message message, rabbitmq:Caller caller) {}`
     - `onRequest(rabbitmq:Message message) returns anydata {}`
- A new `onRequest` method is introduced to directly reply to a message by returning a value if the `replyTo` subject is present.
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

##### Time module improvements

The improvements below have been introduced to the `ballerina/time` module.

- Added support for commonly-used date-time formatters in the `time:format()` and `time:parse()` APIs.
- The hours, minutes, seconds, milliseconds, and zone ID parameters of the `time:createTime()` method have been made defaultable.
- Introduced a new `time:Duration` record type to represent a chunk of time.
- Modified the `time:addDuration()` and `time:subtractDuration()` methods to accept the `time:Duration` records to be added/subtracted.
- Introduced a new `time:getDifference()` method to calculate the difference between two `time:Time` records.
- Introduced a new `time:getTimezones()` method to retrieve the timezone IDs supported by the underlying native code.
- Introduced an enum to represent the days of the week and modified the `time:getWeekday()` method to return this enum.

##### Runtime module improvements

The methods below have been removed from the `runtime` module since these methods have moved to the `lang:runtime` lang library.

- `sleep`
- `getCallStack`

##### Email module improvements

###### Common changes for client and server configurations

- `email:Email` is changed to `email:Message`.

- Attachment support is improved to support file attachments directly with its content type. The new `email:Attachment` record is as follows.

```ballerina
public type Attachment record {|
    string filePath;
string contentType;
|};
```

-  The `email:Message` record is modified to accept either a `string` or a `string[]` for the `to`, `cc`, `bcc`, and `replyTo` fields to add flexibility. An optional `htmlBody` field is added to support the HTML body. The new record is as follows. 

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

- The `enableSsl` boolean field is replaced with the `security` field to enable different types of transport-layer security. This new parameter is an enumeration with the `START_TLS_AUTO|START_TLS_ALWAYS|START_TLS_NEVER|SSL` options. The default/undefined value is `SSL`.

- Self-signed certificate support is added while default SSL/TLS support is restricted to self-signed certificates with relevant configurations and CA-certified certificates. Hostname verification is made mandatory for SSL/TLS support. Anyway, hostname verification can be disabled with the configuration by passing the value of the `mail.smtp.ssl.checkserveridentity` property as `”false”`.

###### Client changes

- A new `sendEmail` method is added to the `email:SmtpClient` API to send emails directly without creating the `email:Email` record supporting extra fields as named optional parameters. An example of sending an email with the new API is given below.

    ```ballerina
    Error? response = smtpClient->sendEmail(toAddresses, subject, fromAddress, body, cc = ccAddresses, bcc = bccAddresses, 
        htmlBody = htmlBody, contentType = contentType, headers = {header1_name: "header1_value"}, sender = sender, replyTo = 
        replyToAddresses, attachments = bodyParts);
    ```

- The `read` method of `email:ImapClient`, `email:PopClient`, and `email:Listener` (i.e., `new email:PopListener` and `email:ImapListener`) are changed to `receiveEmailMessage`.

- All client initializations return an `email:Error` when an error occurs during the initialization.

###### Service and listener related changes

- All listener initializations return an `email:Error` when an error occurs during the initialization.

- The `email:Listener` is split into the `email:PopListener` and `email:ImapListener`. Therefore, the `protocol` field is removed from the new protocol-specific listeners. The `email:PopConfig` or `email:ImapConfig` that were used as fields for the `email:Listener` are not required for the new API implementation. Protocol configuration related fields are made parts of the new listeners.

- The `resource` methods are changed to `remote` methods in the new listener APIs.

- The `service` name is given as a string with the new Ballerina language changes.

- The `onMessage` method of the `email:Listener` (i.e., `new email:PopListener` and `email:ImapListener`) is changed to `onEmailMessage`.

- The `pollingInterval` field of the `email:Listener` is changed to `pollingIntervalInMillis` in the new listener APIs. That makes it consistent across other Ballerina modules, in which time durations are configured in milliseconds.

- A sample POP3 listener is given below.

    **New syntax:**

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

##### WebSub module improvements

###### Hub-related changes

- Default implementation for the `websub:Hub` has been removed from the module.
- API specification for the WebSub Hub is moved to the [`websubhub` module](#websubhub).

##### Publisher-related changes

- The implementation related to the `websub:PublisherClient` is moved to the `websubhub` module.

##### Subscriber-related changes

- The two new configurations below are introduced to the `@websub:SubscriberServiceConfiguration` for hub/topic discovery.
  - `accept` - The expected media type
  - `acceptLanguage` - The expected language type
- API specification for the `@websub:SubscriberService` is updated with the changes below.
  - The `onIntentVerification` and `onNotification` methods are removed.
  - The `onSubscriptionVerification`, `onEventNotification`, and `onSubscriptionValidationDenied` methods are introduced.
- The updated `websub:SubscriberService` sample implementation is as follows.

    ```ballerina
    listener websub:Listener testListener = new (9090);

    @websub:SubscriberServiceConfig {
        target: ["http://localhost:9191/websub/hub", "http://websubpubtopic.com"],
        leaseSeconds: 36000,
        secret: "Kslk30SNF2AChs2"
    }
    service /subscriber on testListener {
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


##### Introduced new modules 

###### Random

The `ballerina/random` module provides functions related to random number generation.

###### RegEx

The `ballerina/regex` module provides RegEx utilities such as checking whether a string matches a given RegEx, replacing substrings, and splitting strings based on a RegEx.

###### WebSubHub 

- This module contains the API specifications and implementations related to the WebSub Hub, WebSub Hub Client, and WebSub Publisher.
- This is an inter-dependent module for the `websub` module.

**Hub Implementation**

- The default `websub:Hub` implementation has been removed and language-specific API abstraction is defined in the `websubhub:Service`.
- Updated WebSub Hub sample implementation to comply with the new API specification is as follows.

    ```ballerina
    listener websubhub:Listener hubListener = new (9001);

    service /websubhub on hubListener {
        remote function onRegisterTopic(websubhub:TopicRegistration message) 
                returns websubhub:TopicRegistrationSuccess|websubhub:TopicRegistrationError {
            // implement action to execute on topic-registration
        }
        
        remote function onDeregisterTopic(websubhub:TopicDeregistration message) 
                returns websubhub:TopicDeregistrationSuccess|websubhub:TopicDeregistrationError {
            // implement action to execute on topic-deregistration
        }
        remote function onUpdateMessage(websubhub:UpdateMessage msg) 
                returns websubhub:Acknowledgement|websubhub:UpdateMessageError {
            // implement action to execute on content-update for topic
        }
        remote function onSubscription(websubhub:Subscription msg) 
                returns websubhub:SubscriptionAccepted|websubhub:SubscriptionPermanentRedirect|
                    websubhub:SubscriptionTemporaryRedirect|websubhub:BadSubscriptionError|
                    websubhub:InternalSubscriptionError {
            // implement action to execute on new subscription
        }
        remote function onSubscriptionValidation(websubhub:Subscription msg) 
                returns websubhub:SubscriptionDeniedError? {
            // implement action to execute on subscription validation
        }
    
        remote function onSubscriptionIntentVerified(websubhub:VerifiedSubscription msg) {
            // implement action to execute on subscription intent verification
        }
        remote function onUnsubscription(websubhub:Unsubscription msg) 
                returns websubhub:UnsubscriptionAccepted|websubhub:BadUnsubscriptionError|
                    websubhub:InternalUnsubscriptionError {
            // implement action to execute on unsubscription
        }
    
        remote function onUnsubscriptionValidation(websubhub:Unsubscription msg) 
                returns websubhub:UnsubscriptionDeniedError? {
            // implement action to execute on unsubscription validation
        }
        
        remote function onUnsubscriptionIntentVerified(websubhub:VerifiedUnsubscription msg) {
            // implement action to execute on unsubscription intent verification
        }
    }   
    ```

**Hub Client implementation**

- `websubhub:Client` is introduced to distribute the updated content to subscribers.
- The example below is a sample use-case of the WebSub Hub Client.

    ```ballerina
        service /websubhub on hubListener {
        remote function onSubscriptionIntentVerified(websubhub:VerifiedSubscription msg) {

                // Client configuration (e.g., retry config) can be passed if required.
                websubhub:HubClient hubclient = check new (msg);
                var responseFuture =  start notifySubscriber(hubclient);
            }

            function notifySubscriber(websubhub:HubClient hubclient) returns error? {
                while (true) {
                    // Fetch the messages to be delivered. 
                ContentDistributionSuccess | SubscriptionDeletedError | error publishResponse = check hubclient->notifyContentDistribution({content: "This is sample content delivery"});
                }
            }
        }
    ```

**Publisher implementation**

`websub:PublisherClient` is moved to `ballerina/websubhub` and can now be used as `websubhub:PublisherClient`.

##### Removed modules 

###### Config

The configuration use cases are now covered under the `configurable` language feature. 

###### Math

The APIs related to random number generation were moved to the new `random` module. The rest of the APIs have replacements in the `lang.float` and `lang.int` packages.

###### Stringutils

The regex-related APIs that were supported by this module have been moved to the new `regex` module. The rest of the APIs have replacements in the langlib packages.

##### Rename system module to OS

The previous `ballerina/system` module is now renamed to `ballerina/os`. All the Operating System independent functionalities are included in this module.

#### Observability

- A new extension model, which separates each extension into a separate module is introduced.
    - Observability can be included in the final JAR by adding the following configuration in the `Ballerina.toml` file.

      ```toml
      [build-options]
      observabilityIncluded=true
      ```

    - The observability extension can be packaged by adding an import to the module in the code as shown in the example below.

      ```ballerina
      import ballerinax/prometheus as _;
      ```

- `Prometheus` and `Jaeger` extensions are introduced back.
    - The `Prometheus` extension can be enabled by adding the following configuration in the `Config.toml` file.

      ```toml
      [ballerina.observe]
      metricsEnabled=true
      metricsReporter="prometheus"
      
      [ballerinax.prometheus]
      host="127.0.0.1"  # Optional Configuration. Default value is localhost
      port=9797         # Optional Configuration. Default value is 9797
      ```

    - The `Jaeger` extension can be enabled by adding the following config.

      ```toml
      [ballerina.observe]
      tracingEnabled=true
      tracingProvider="jaeger"
      
      [ballerinax.jaeger]
      agentHostname="127.0.0.1"  # Optional Configuration. Default value is localhost
      agentPort=6831             # Optional Configuration. Default value is 6831
      ```

    - By default, the `Jaeger` extension now publishes traces to the Jaeger Agent using the `jaeger.thrift` over the compact Thrift protocol.  

#### Code to Cloud

- The Kubernetes artifacts can be generated using the `--cloud=k8s` build option. The `import ballerina/cloud as _` import is no longer required.
- VS code plugin support for the `Kubernetes.toml`
    - Code Completion based on the c2c specification.
    - Code Actions add/modify the probes and environments based on the source code.

#### Breaking changes

- Resource method declarations are no longer allowed in object-type descriptors.
- Resource methods are not considered to be part of the type.
- Non-`isolated` service variables defined outside an `isolated` function can be accessed within the function only if the variable is a `final` variable and the type is a subtype of `readonly`.
- The `@icon` annotation has been replaced with the `@display` annotation.
- The value type of XML iteration, which was previously `xml|string` is now `xml`. Moreover, the value type of `xml<T>` iteration is now `T`. 

#### Taint analyzer update

With this release, the taint analyzer does not produce taint errors unless explicitly enabled. However, the taint analyzer still performs the taint flow analysis without producing errors if error logging is not enabled.

This is enabled via the build option below in the `Ballerina.toml` file

```toml
[build-options]
taintCheck = true
```

or else, by using the `--taint-check` option in the Ballerina CLI tools as follows.

```bash
bal run --taint-check [file.bal | project]
bal build --taint-check [file.bal | project]
```
