---
layout: ballerina-left-nav-release-notes
title: Swan Lake Beta1
permalink: /downloads/swan-lake-release-notes/swan-lake-beta1/
active: swan-lake-beta1
redirect_from: 
    - /downloads/swan-lake-release-notes/swan-lake-beta1
---
## Overview of Ballerina Swan Lake Beta1

<em>This is the first beta release leading up to the Ballerina Swan Lake GA release.</em> 

It introduces the new language features planned for the Swan Lake GA release and includes improvements and bug fixes done to the compiler, runtime, standard library, and developer tooling after the Swan Lake Alpha5 release.

## Updating Ballerina

If you are already using Ballerina, use the [Ballerina update tool](/learn/tooling-guide/cli-tools/update-tool/) to directly update to Ballerina Swan Lake Beta1. 

First, run the command below to update the update tool to its latest version. 

> `bal update`

If your **update tool is below version 0.8.14**, use the `ballerina update` command.

Next, run the command below to update to Swan Lake Beta1.

> `bal dist pull slbeta1`

## Installing Ballerina

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.

## Language updates

### Improvements

- Worker deadlock detection has been improved to include the `wait` action.
- The `self` variable of an isolated object no longer needs to be accessed within a `lock` statement unless it is used to access a field that is either not `final` or is of a type that is not a subtype of `readonly` or `isolated object {}`.
- The `lang.xml:strip()` function does not mutate an XML value. Therefore, using the `lang.xml:strip()` function on immutable XML values is allowed.

### Breaking changes

- An included record parameter of a function can only be specified after any required and/or defaultable parameters of the function.
- Additive expressions and multiplicative expressions are no longer supported with numeric values when the static types of the operands belong to different numeric basic types.
- Configurable variables are implicitly `final` now. Moreover, the type of such a variable is now effectively the intersection of the specified type and `readonly`. Therefore, configurable variables no longer support the `final` and `isolated` qualifiers.
- Type narrowing will no longer take place for captured variables of an anonymous function since the narrowed type cannot be guaranteed during the execution of the function.
- Type narrowing will now be reset after a compound assignment.
- Worker message passing after waiting for the same worker has been disallowed.
- When a named worker is used in a `wait` action, it can no longer be used in a variable reference anywhere else. 
- When the type-descriptor is ambiguous, it is parsed according to the following table in which the precedence is specified in decreasing order.
For example, `A & B | C` is considered to be `(A & B) | C`.

  | Operator                  | Associativity |
  |---------------------------|---------------|
  | distinct T                |               |
  | T[ ]                      |               |
  | T1 & T2                   | left          |
  | T1 &#124; T2              | left          |
  | function (args) returns T | right         |

- The Taint analyzer is disabled and the `--taint-check` option is removed. The annotations `@tainted` and `@untainted` were left intact as placeholders for backward compatibility. Any script that used to pass the `--taint-check` option to the `bal run` or `bal build` commands will fail.

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Beta1](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta1%22+label%3AType%2FBug+label%3ATeam%2FCompilerFE).

## Runtime updates

### Improvements

#### Improved configurable variables to support enum types

Values can be provided for configurable variables of `enum` types via command-line arguments and a TOML file.


```ballerina
public enum HttpVersion {
    HTTP_1_1,
    HTTP_2
}

configurable HttpVersion httpVersion = ?;
```

The value for `httpVersion` can be provided via the `Config.toml` file or as a command-line argument as shown below.

```toml
[configUnionTypes]
httpVersion = "HTTP_1_1"
```

The command-line argument will be as shown below.

```bash
-ChttpVersion=HTTP_1_1
```

#### Improved configurable variables to support map types

The `configurable` feature is improved to support variables of `map` types. Values can be provided via a TOML file.

For example, if the `map`-typed configurable variables are defined in the following way, 

``` ballerina
configurable map<string> admin = ?;

type HttpResponse record {|
    string method;
    string httpVersion = "HTTP_1_0";
    map<string> headers;
|};

configurable HttpResponse response = ?;
configurable map<string>[] users = ?;
```

the values can be provided in the `Config.toml` as follows.

```toml
[admin]
username = "John Doe"
mail = "John@hotmail.com"
location = "LK"

[response]
method = "POST"
httpVersion = "HTTP_2_0"
headers.Status = "200 OK"
headers.Content-Type = "text/html"

[[users]]
username = "Jack"
location = "UK"

[[users]]
username = "Jane"
location = "US"
```

### Breaking changes

- The `io.ballerina.runtime.api.types.Type#getName` and `io.ballerina.runtime.api.types.Type#getQualifiedName` methods now return an empty string if no name was associated with the type. The `io.ballerina.runtime.api.types.Type#toString` method can be used to get the string representation of a type.
- `Wait` actions that wait for expressions that are not named workers can return errors now. The eventual type of such wait future expressions is now `T|error` where `T` is the type of the original return value.

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Beta1](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta1%22+label%3AType%2FBug+label%3ATeam%2FjBallerina).

## Standard library updates

### New features

#### `graphql` package
- Added declarative auth configuration
- Added support for optional types as inputs
- Added support for returning unions of distinct service objects
- Added support for inline fragments
- Added support for enums as input values

### Improvements

#### `cache` package
Marked the `cache:Cache` class as an `isolated` class.

#### `file` package
Marked the `file:Listener` class as an `isolated` class.

#### `graphql` package
- Improved introspection validation and execution
- Added missing fields in the GraphQL types
- Improved the compiler plugin to validate inputs and return types
- Added support to use included record parameters instead of the `record` type in the listener initialization

#### `http` package
- Improved the `http:Client` remote methods to support inferring the target type from the contextually-expected type
- Changed the listeners and clients to use include record parameters as configuration parameters
- Populated the error detail of `http:ClientRequestError` and `http:RemoteServerError` with the response payload and the headers
- Swapped the `mediaType` and `headers` arguments in the client remote methods

#### `sql` package
- Added the SQL Array Value type support and introduced the new distinct array value types for identified SQL types
- Marked the `sql:Client` class as an `isolated` class

#### `websubhub` package
Included the auth configuration in the WebSubHub publisher client configuration.

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Beta1](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%22Swan+Lake+Beta1%22+label%3AType%2FBug).

## Code to Cloud updates

### New Features
Added the `@cloud:Expose` annotation to support custom listeners.

### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake Beta1 of the repositories below.

- [C2C](https://github.com/ballerina-platform/module-ballerina-c2c/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A%22Ballerina+Swan+Lake+-+Beta1%22)
- [AWS Lambda](https://github.com/ballerina-platform/module-ballerinax-aws.lambda/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A%22Ballerina+Swan+Lake+-+Beta1%22)
- [Azure Functions](https://github.com/ballerina-platform/module-ballerinax-azure.functions/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A%22Ballerina+Swan+Lake+-+Beta1%22) 

## Developer tools updates

### Improvements

#### Debugger
- Added remote debugging support for the command that runs the Ballerina executable JAR
- Added support for debugging a single Ballerina test in Visual Studio Code

#### Test framework
Introduced a flag to pass the expected code coverage report formats

### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake Beta1 of the repositories below.

- [Language Server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta1%22+label%3ATeam%2FLanguageServer)
- [OpenAPI](https://github.com/ballerina-platform/ballerina-openapi/milestone/5?closed=1) 
- [Test framework](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FTestFramework+milestone%3A%22Ballerina+Swan+Lake+-+Beta1%22+is%3Aclosed+label%3AType%2FBug)


