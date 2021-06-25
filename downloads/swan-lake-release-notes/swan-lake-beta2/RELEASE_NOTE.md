---
layout: ballerina-left-nav-release-notes
title: Swan Lake Beta2
permalink: /downloads/swan-lake-release-notes/swan-lake-beta2/
active: swan-lake-beta2
redirect_from: 
    - /downloads/swan-lake-release-notes/swan-lake-beta2
    - /downloads/swan-lake-release-notes/
    - /downloads/swan-lake-release-notes
---
### Overview of Ballerina Swan Lake Beta2

<em>This is the second beta release leading up to the Ballerina Swan Lake GA release.</em> 

It introduces the new language features planned for the Swan Lake GA release and includes improvements and bug fixes done to the compiler, runtime, standard library, and developer tooling after the Swan Lake Beta1 release.

### Updating Ballerina

If you are already using Ballerina, you can use the [Update Tool](/learn/tooling-guide/cli-tools/update-tool/) to directly update to Ballerina Swan Lake Beta 2 as follows. 

To do this, first, execute the command below to get the update tool updated to its latest version. 

> `bal update`

If you are using an **Update Tool version below 0.8.14**, execute the `ballerina update` command to update it. Next, execute the command below to update to Swan Lake <VERSION>.

> `bal dist pull slbeta2`

### Installing Ballerina

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.

### Language Updates

#### New Features

#### Improvements
- Support for recursive tuple types has been introduced with this release.

```
type RecursiveType [int, RecursiveType[]];

public function main() {
    RecursiveType a = [1];
    RecursiveType b = [1, []];
    RecursiveType c = [1, [a]];
}
```

- The static type of string iteration has been changed from `string` to `string:Char`.

```ballerina
public function main() {
    string str = "foo";

    foreach string:Char s in str {
        io:println(s);        
    }

    record {| string:Char value; |}? next = str.iterator().next();

    if !(next is ()) {
        io:println(next.value);
    }
}
```

#### Bug Fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Beta2](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta2%22+label%3AType%2FBug+label%3ATeam%2FCompilerFE).

### Runtime Updates

#### New Features

#### Improvements

- Support has been introduced for `configurable` variables of union types via the TOML syntax. 

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

#### Bug Fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Beta2](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta2%22+label%3AType%2FBug+label%3ATeam%2FjBallerina).

### Standard Library Updates

The new `postgresql` database package is introduced with this release. This package provides the functionality required to access and manipulate data stored in a PostgreSQL database.

#### New Features

##### Log Package
Added Observability span context values to log messages when observability is enabled.

##### I/O Package
Introduced the `io:fprint` and `io:fprintln` APIs.
```ballerina
io:fprint(io:stderr, "Unexpected error occurred");
io:fprintln(io:stderr, "Unexpected error occurred");
io:fprint(io:stdout, "Passed without an error");
io:fprintln(io:stdout, "Passed without an error");
```

##### WebSocket Package
- Introduce declarative auth support for server side. 

##### WebSub Package
- Add a utility method to retrieve http-headers from `websub:ContentDistributionMessage`.

#### Improvements

##### Database Packages
Return type of the stream is now inferred as a second parameter to the query remote method.

**Previous Syntax**

```ballerina
stream<record{}, error> resultStream =
        jdbcClient->query(`SELECT * FROM Customers`, Customer);

stream<Customer, sql:Error> customerStream =
        <stream<Customer, sql:Error>>resultStream;
```
According to the previous syntax, the Ballerina user can give the `Customer` record as the expected record 
type of the stream but the user can not get that stream directly. Ballerina developer has to cast the returned 
stream to the expected stream. Therefore, This has been improved to directly get data as an expected record type.

**New Syntax**

```ballerina
stream<Customer, error> customerStream = sqlClient->query(`SELECT * FROM Customers`);
```

##### HTTP Package
- Respond with 202 Accepted response when the resource function returns nil. If the http:Caller is used in the resource, then returning nil from the resource leads to a  500 Internal Server Error response.
- Log error stacktrace when an error is returned from the resource function and connection failures.
- Log warning when the same request is responded more than one time.

##### GraphQL Package
- Make GraphQL resource execution non-blocking
- Sending `BAD_REQUEST` status code for the responses with document validation errors

##### FTP Package
- Change `get`, `append` and `put` method APIs to support `stream` instead of using `io:ReadableByteChannel` for reading and writing files.
- Support SFTP protocol with password and private key based authentication.

##### WebSub Package
- Log error stacktrace when an error is returned from the remote function of Subscriber Service.
- Return module specific errors from the WebSub public APIs.
- Allow non-remote methods in Subscriber Service.

##### WebSubHub Package
- Log error stacktrace when an error is returned from the remote function of Hub Service.
- Return module specific errors from the WebSubHub public APIs.
- Allow non-remote methods in Hub Service.
- Allow `http:Headers` as optional parameter to specific remote-methods(`onRegisterTopic`/`onDeregisterTopic`/`onUpdateMessage`/`onSubscription`/`onUnsubscription`).

#### Bug Fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Beta2](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%22Swan+Lake+Beta2%22+label%3AType%2FBug).

### Code to Cloud Updates

#### New Features

#### Improvements

#### Bug Fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Beta2](https://github.com/ballerina-platform/module-ballerina-c2c/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A%22Ballerina+Swan+Lake+-+Beta2%22).

### Developer Tools Updates

#### Language Server 

To view bug fixes, see the [GitHub milestone for Swan Lake <VERSION>](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta2%22+label%3AType%2FBug+label%3ATeam%2FLanguageServer).

#### New Features

##### Debugger 
- Added expression evaluation support for client remote method call actions.
- Added support to show the child element count inline (without having to expand the parent element) for Ballerina structured (i.e. Map, List, Table, XML and JSON) variables.

#### Improvements

##### Bindgen Tool
- Changed the default bindings mapping approach to generate module-level mappings, instead of having to use an explicit flag for this behavior. Generation of single directory mappings is facilitated using the option `[(-o|--output) <output-path>]`.

##### Test Framework

- Added support for map of tuples as the data set for data provider functions.
- Added case based filtering when running tests against data sets.

#### Bug Fixes

To view bug fixes, see the GitHub milestone for Swan Lake Beta2 of the repositories below.

- [Language](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta2%22+label%3AType%2FBug+label%3ATeam%2FDevTools)
- [Update Tool](https://github.com/ballerina-platform/ballerina-update-tool/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+project%3Aballerina-platform%2F32)
- [OpenAPI](https://github.com/ballerina-platform/ballerina-openapi/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A%22Ballerina+Swan+Lake+-+Beta%22)
- [Debugger](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3AType%2FBug+label%3AArea%2FDebugger+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta2%22)
- [Test Framework](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FTestFramework+milestone%3A%22Ballerina+Swan+Lake+-+Beta2%22+label%3AType%2FBug+)

#### Ballerina Packages Updates

### Breaking Changes
