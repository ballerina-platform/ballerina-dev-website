---
layout: ballerina-left-nav-release-notes
title: Swan Lake Beta1
permalink: /downloads/swan-lake-release-notes/swan-lake-beta1/
active: swan-lake-beta1
redirect_from: 
    - /downloads/swan-lake-release-notes/swan-lake-beta1
    - /downloads/swan-lake-release-notes/
    - /downloads/swan-lake-release-notes
---
## Overview of Ballerina Swan Lake Beta1

<em>This is the Beta1 release in a series of planned Alpha and Beta releases leading up to the Ballerina Swan Lake GA release.</em> 

It introduces the new language features planned for the Swan Lake GA release and includes improvements and bug fixes done to the compiler, runtime, standard library, and developer tooling after the Swan Lake Alpha5 release.

## Updating Ballerina

If you are already using Ballerina, you can use the [Update Tool](/learn/tooling-guide/cli-tools/update-tool/) to directly update to Ballerina Swan Lake Beta1 as follows. 

To do this, first, execute the command below to get the update tool updated to its latest version. 

> `bal update`

If you are using an **Update Tool version below 0.8.14**, execute the `ballerina update` command to update it. Next, execute the command below to update to Swan Lake Beta1.

> `bal dist pull beta1`

## Installing Ballerina

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.

## Language Updates

### Improvements

- Worker deadlock detection has been improved to include the `wait` action.
- The `self` variable of an isolated object no longer needs to be accessed within a `lock` statement unless it is used to access a field that is either not `final` or is of a type that is not a subtype of `readonly` or `isolated object {}`.
- The `lang.xml:strip()` function does not mutate an XML value. Therefore, using the `lang.xml:strip()` function on immutable XML values is allowed.

### Breaking Changes

- The Taint analyzer is disabled and the `--taint-check` option is removed. The annotations `@tainted` and `@untainted` were left intact as placeholders for backward compatibility. Any script that used to pass the `--taint-check` option to the `bal run` or `bal build` commands will fail.
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

### Bug Fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Beta1](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta1%22+label%3AType%2FBug+label%3ATeam%2FCompilerFE).

## Runtime Updates

### Improvements

#### Improved Configurable Variables to Support Enum Types

Configurable variables with enum types are supported to provide values through command-line arguments and a TOML file.

For example, see the configurable variable with the `enum` type.

```ballerina
public enum HttpVersion {
    HTTP_1_1,
    HTTP_2
}

configurable configLib:HttpVersion & readonly httpVersion = ?;
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

#### Improved Configurable Variables to Support Map Types

The `configurable` feature is improved to support variables with the `map` types through the TOML syntax. 

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

### Breaking Changes

- The `io.ballerina.runtime.api.types.Type#getName` and `io.ballerina.runtime.api.types.Type#getQualifiedName` methods now return an empty string if no name was associated with the type. The `io.ballerina.runtime.api.types.Type#toString` method can be used to get the string representation of a type if required.
- `Wait` actions that wait for expressions that are not named workers can return errors now. The eventual type of such wait future expressions is now `T|error`in which `T` is the type of the original return value.

### Bug Fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Beta1](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta1%22+label%3AType%2FBug+label%3ATeam%2FjBallerina).

## Standard Library Updates

### New Features

#### `graphql` Package
- Added declarative auth configurations
- Added support for optional types as inputs
- Added support for returning distinct service object unions
- Added support for inline fragments
- Added support for enums as input values

### Improvements

#### `cache` Package
Marked the `cache:Cache` class as an isolated class

#### `file` Package
Marked the `file:Listener` class as an isolated class

#### `graphql` Package
- Improved introspection validation and execution
- Added missing fields in the GraphQL types
- Improved the compiler plugin to validate inputs and return types
- Added support to use included record parameters instead of the `record` type in the listener initialization

#### `http` Package
- Improved the `http:Client` remote methods to support the contextually-expected type inference
- Changed the configuration parameters of the listeners and clients to include the record parameters
- Populated the error detail of `http:ClientRequestError` and `http:RemoteServerError` with response payload and header
- Swapped the `mediaType` and `headers` arguments in the client remote methods

#### `sql` Package
- Added the SQL Array Value type support and introduced the new distinct array value types for identified SQL types
- Marked the `sql:Client` class as an isolated class

#### `websubhub` Package
Included the auth configuration to the WebSubHub publisher client configuration

### Bug Fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Beta1](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%22Swan+Lake+Beta1%22+label%3AType%2FBug).

## Code to Cloud Updates

### New Features
Added `@cloud:Expose` annotation to support custom listeners.

### Bug Fixes

To view bug fixes, see the GitHub milestone for Swan Lake Beta1 of the repositories below.

- [C2C](https://github.com/ballerina-platform/module-ballerina-c2c/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A%22Ballerina+Swan+Lake+-+Beta1%22)
- [Docker](https://github.com/ballerina-platform/module-ballerina-docker/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A%22Ballerina+Swan+Lake+-+Beta1%22)
- [AWS Lambda](https://github.com/ballerina-platform/module-ballerinax-aws.lambda/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A%22Ballerina+Swan+Lake+-+Beta1%22)
- [Azure Functions](https://github.com/ballerina-platform/module-ballerinax-azure.functions/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A%22Ballerina+Swan+Lake+-+Beta1%22) 

## Developer Tools Updates

### Improvements

#### Debugger
- Added remote debugging support for the command, which runs the Ballerina executable JAR
- Added support for debugging single Ballerina tests in Visual Studio Code

### Bug Fixes

To view bug fixes, see the GitHub milestone for Swan Lake Beta1 of the repositories below.

- [Language Server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta1%22+label%3ATeam%2FLanguageServer)
- [OpenAPI](https://github.com/ballerina-platform/ballerina-openapi/milestone/5?closed=1) 
