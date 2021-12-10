---
layout: ballerina-left-nav-release-notes
title: Swan Lake Beta2
permalink: /downloads/swan-lake-release-notes/swan-lake-beta2/
active: swan-lake-beta2
redirect_from: 
    - /downloads/swan-lake-release-notes/swan-lake-beta2
---
## Overview of Ballerina Swan Lake Beta2

<em>This is the second beta release leading up to the Ballerina Swan Lake GA release.</em> 

It introduces the new language features planned for the Swan Lake GA release and includes improvements and bug fixes done to the compiler, runtime, standard library, and developer tooling after the Swan Lake Beta1 release.

## Updating Ballerina

If you are already using Ballerina, use the [Ballerina Update Tool](/learn/tooling-guide/cli-tools/update-tool/) to directly update to Ballerina Swan Lake Beta2. 

First, run the command below to update the update tool to its latest version. 

> `bal update`

If your **Update Tool is below version 0.8.14**, use the `ballerina update` command.

Next, run the command below to update to Swan Lake Beta2.

> `bal dist pull slbeta2`

## Installing Ballerina

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.

## Language Updates

### Improvements

- Introduced the support for recursive tuple types.

    ```ballerina
    type RecursiveType [int, RecursiveType[]];

    public function main() {
        RecursiveType a = [1];
        RecursiveType b = [1, []];
        RecursiveType c = [1, [a]];
    }
    ```

- Changed the static type of the string iteration from `string` to `string:Char`.

    ```ballerina
    public function main() {
        string str = "foo";

        foreach string:Char s in str {
            io:println(s);
        }

        record {|string:Char value;|}? next = str.iterator().next();

        if !(next is ()) {
            io:println(next.value);
        }
    }
    ```

### Bug Fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Beta2](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta2%22+label%3AType%2FBug+label%3ATeam%2FCompilerFE).

## Runtime Updates

### Improvements

- Introduced `configurable` variables of union types via the TOML syntax. 

    ```ballerina
    configurable map<anydata> myMap = ?;
    configurable int|string id = ?;
    ```

**TOML:**

```toml
id = "12345"

[myMap]
name = "John"
age = 10
```

### Bug Fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Beta2](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta2%22+label%3AType%2FBug+label%3ATeam%2FjBallerina).

## Standard Library Updates

### New Features

#### `log` Package

Added observability span context values to log messages when observability is enabled.

#### `io` Package

Introduced the `io:fprint` and `io:fprintln` APIs which allow users to print content to a given stream (standard error or standard out).

```ballerina
io:fprint(io:stderr, "Unexpected error occurred");
io:fprintln(io:stderr, "Unexpected error occurred");
io:fprint(io:stdout, "Passed without an error");
io:fprintln(io:stdout, "Passed without an error");
```

#### `websocket` Package

Introduced declarative auth support for the server-side. 

#### `websub` Package

Added a utility method to retrieve HTTP headers from the `websub:ContentDistributionMessage`.

### Improvements

#### Database Packages

Made the return type of the stream to be inferred now as a second parameter to the query remote method.

**Previous Syntax**

```ballerina
stream<record {}, error> resultStream = 
jdbcClient->query(`SELECT * FROM Customers`,Customer);

stream<Customer, sql:Error> customerStream = 
        <stream<Customer, sql:Error>>resultStream;
```

According to the previous syntax, you can give the `Customer` record as the expected record type of the stream but you cannot get that stream directly. To do that, you have to cast the returned stream to the expected stream. Therefore, this has been improved to directly access data as an expected record type.

**New Syntax**

```ballerina
stream<Customer, error> customerStream = sqlClient->query(`SELECT * FROM Customers`);
```

#### `http` Package

- Updated to respond with a 202 Accepted response when the resource function returns nil. If the `http:Caller` is used in the resource, then, returning nil from the resource leads to a 500 Internal Server Error response.
- Updated to log the error stack trace when an error is returned from the resource function and on connection failures.
- Updated to log a warning when the same request is responded more than one time.

#### `graphql` Package

- Made the GraphQL resource execution non-blocking.
- Updated to send a `BAD_REQUEST` status code for the responses with document validation errors.

#### `ftp` Package

- Changed the `get`, `append`, and `put` method APIs to support `stream` instead of using `io:ReadableByteChannel` for reading and writing files.
- Updated to support the FTP protocol with password and private key based authentications.

#### `websub` Package

- Updated to log the error stack trace when an error is returned from the remote function of the subscriber service.
- Updated to return module-specific errors from the WebSub public APIs.
- Updated to allow non-remote methods in the subscriber service.

#### `websubhub` Package

- Updated to log the error stack trace when an error is returned from the remote function of the hub service.
- Updated to return the module-specific errors from the WebSubHub public APIs.
- Updated to allow non-remote methods in the Hub Service.
- Updated to allow `http:Headers` as an optional parameter in specific remote methods (`onRegisterTopic`/`onDeregisterTopic`/`onUpdateMessage`/`onSubscription`/`onUnsubscription`).

### Bug Fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Beta2](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%22Swan+Lake+Beta2%22+label%3AType%2FBug).

## Code to Cloud Updates

### Bug Fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Beta2](https://github.com/ballerina-platform/module-ballerina-c2c/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A%22Ballerina+Swan+Lake+-+Beta2%22).

## Developer Tools Updates

### New Features

#### Debugger 
- Added expression evaluation support for client remote method call actions.
- Added support to show the child element count inline (without having to expand the parent element) for Ballerina structured (i.e., Map, List, Table, XML, and JSON) variables.

### Improvements

#### Bindgen Tool

Changed the default bindings mapping approach to generate module-level mappings instead of having to use an explicit flag for this behavior. Generation of single directory mappings is facilitated using the `[(-o|--output) <output-path>]` option.

#### Test Framework

- Added support for a map of tuples as the data set for data provider functions.
- Added case-based filtering when running tests against data sets.

### Bug Fixes

To view bug fixes, see the GitHub milestone for Swan Lake Beta2 of the repositories below.

- [Language Server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta2%22+label%3ATeam%2FLanguageServer)
- [Debugger](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3AType%2FBug+label%3AArea%2FDebugger+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta2%22)
- [Test Framework](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FTestFramework+milestone%3A%22Ballerina+Swan+Lake+-+Beta2%22+label%3AType%2FBug+)
