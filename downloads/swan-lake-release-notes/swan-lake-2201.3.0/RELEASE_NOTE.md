---
layout: ballerina-left-nav-release-notes
title: 2201.3.0 (Swan Lake) 
permalink: /downloads/swan-lake-release-notes/2201-3-0/
active: 2201-3-0
redirect_from: 
    - /downloads/swan-lake-release-notes/2201-3-0
    - /downloads/swan-lake-release-notes/2201.3.0/
    - /downloads/swan-lake-release-notes/2201-3-0-swan-lake/
    - /downloads/swan-lake-release-notes/2201-3-0-swan-lake
---

## Overview of Ballerina 2201.3.0 (Swan Lake)

<em>2201.3.0 (Swan Lake) is the third major release of 2022, and it includes a new set of features and significant improvements to the compiler, runtime, standard library, and developer tooling. It is based on the 2022R4 version of the Language Specification.</em> 

## Update Ballerina

**If you are already using Ballerina 2201.0.0 (Swan Lake)**, run either of the commands below to directly update to 2201.3.0 using the [Ballerina Update Tool](/learn/update-tool/).

`bal dist update` (or `bal dist pull 2201.3.0`)

**If you are using a version below 2201.0.0 (Swan Lake)**, run the commands below to update to 2201.3.0.

1. Run `bal update` to get the latest version of the Update Tool.

2. Run `bal dist update` ( or `bal dist pull 2201.3.0`) to update your Ballerina version to 2201.3.0.

However, if you are using a version below 2201.0.0 (Swan Lake) and if you already ran `bal dist update` (or `bal dist pull 2201.3.0`) before `bal update`, see [Troubleshooting](/downloads/swan-lake-release-notes/swan-lake-2201.0.0#troubleshooting) to recover your installation.

## Install Ballerina

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.

## Language updates

### New features

#### Added support for function types with defaultable parameters

Default values are now allowed for parameters of function types.

```ballerina
import ballerina/io;

public function main() {
    int num1 = 100;
    int num2 = 50;
    int num3 = 25;
    function (int a = 0, int b = 0, int c = 0) returns int total = getSum;

    io:println(total()); // Prints `0`.
    io:println(total(num1, num2)); // Prints `150`.
    io:println(total(num1, num2, num3)); // Prints `175`.
}

function getSum(int num1, int num2, int num3) returns int {
    return num1 + num2 + num3;
}
```

#### Added a new field to the `display` annotation

A new field named `kind` has been introduced to the `display` annotation to indicate the kind of data. Allowed values are `text`, `password`, and `file`.

```ballerina
public type RefreshTokenGrantConfig record {|
    @display {
        iconPath: "Field.icon",
        label: "clientSecret field",
        kind: "password"
    }
    string clientSecret;
|};
```

### Improvements

#### Improved handling of optional field values

With this new feature,

- a record that contains optional fields can be destructured. If the optional field is not available, the type of the variable becomes nil.
- a variable of type `T?` can be used to construct an optional field. If the value is `()`, it effectively means that the field is not there.
- the optional field value can be removed from the record by assigning `()` to the optional field.

```ballerina
import ballerina/io;

type Employee record {
    int id?;
    string department?;
};

public function main() {
    Employee e = {id: 2, department: "HR"};
    e.id = (); // Remove the optional field `id`
    e = {id: 3};
    var {id: _, department} = e; // If `department` is absent in `e`, its value becomes nil.
    io:println(department is ()); // true

    int? idOrNil = ();
    e = {id: idOrNil, department: "Engineering"}; // absence of `id` is represented by nil 
    io:println(e.hasKey("id")); // false
}
```

#### Allow an optional terminating semicolon for module-level declarations

Previously, a closing semicolon was not allowed after the module-level declarations below.
- block function body
- service declaration
- module class definition
- module enumeration declaration 

Now, optionally, you can end these declarations with a semicolon.

### Backward-incompatible changes

#### Disallow using the `-9223372036854775808` unary expression as an integer

Previously, `-9223372036854775808` was allowed to be used as an integer in Ballerina. However, according to the language specification, `-9223372036854775808` is considered a unary expression, which requires the expression after `-` to be a valid value for `int`. Therefore, `-9223372036854775808` now results in a compilation error since `9223372036854775808` is out of range for `int`.

```ballerina
int result = -9223372036854775808; // error: '9223372036854775808' is out of range for 'int'
```

>**Note:** This change has affected the `uuid` module. Therefore, if an application uses the `uuid` module or uses a package, which has a dependency on the `uuid` module, make sure that the UUID version is updated to 1.4.0. Otherwise, it would result in the aforementioned compilation error. If the application has a direct dependency, modify the UUID version to 1.4.0 by modifying the `Dependencies.toml` file. If the dependency is transitive, make sure to update the corresponding package or module to 1.4.0 and use it by updating the `Dependencies.toml` file.

#### Restriction on the typed binding pattern of an outer join clause to use `var`

Previously, the typed binding pattern in an outer join clause was allowed to be any type descriptor, but now it has been restricted to allow only `var` so that an optional type (`T?`) will be inferred as the type.

```ballerina
type User record {|
    readonly int id;
    string name;
|};

type Login record {|
    int userId;
    string time;
|};

type Entry record {|
    string? name;
    string login;
|};

public function main() {
    Login[] logins = [
        {userId: 6789, time: "20:10:23"},
        {userId: 1234, time: "10:30:02"},
        {userId: 3987, time: "12:05:00"}
    ];

    table<User> key(id) users = table [
            {id: 1234, name: "Keith"},
            {id: 6789, name: "Anne"}
        ];

    Entry[] entities = from var login in logins
        outer join var user in users
        on login.userId equals user?.id
        select {name: user?.name, login: login.time};

    // Now, the code below gives an error at the typed binding pattern of the outer join clause.
    entities = from var login in logins
        outer join User user in users  // error: outer join must be declared with 'var'
        on login.userId equals user.id
        select {name: user?.name, login: login.time};
}
```

#### Disallow method calls with record fields of function types

Previously, method calls were allowed with record fields of function types similar to object fields. This has now been disallowed since it is not allowed by the language specification.

```ballerina
type Foo record {|
    function (int a, int b) returns int func;
|};

function callFunction(Foo foo) {
    int _ = foo.func(1, 2); // error
}
```

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.3.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.3.0+label%3AType%2FBug+is%3Aclosed).

## Compiler API updates

### New features

#### Semantic API
Added a new `annotAttachments()` API to get the annotation attachments and their constant values from the annotatable symbols.

### Improvements

#### Semantic API
Improved the `constValue()` method to retrieve the constant value as an object from the constant symbol.

#### Syntax API

Added a few methods to the `NodeParser` API. The methods below have been introduced for the `NodeParser` class.
  - `Node parseObjectMember(String text)`
  - `ModulePartNode parseModulePart(String text)`
  - `IntermediateClauseNode parseIntermediateClause(String text, boolean allowActions)`

### Backward-incompatible changes

Updated the `NodeFactory` methods to allow optional terminating semicolons for module-level declarations. The methods below in the `NodeFactory` have been updated with an extra parameter for the optional semicolon token.

  - `createServiceDeclarationNode`
  - `createFunctionBodyBlockNode`
  - `createEnumDeclarationNode`
  - `createClassDefinitionNode`

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.3.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.3.0+label%3AType%2FBug+is%3Aclosed+label%3ATeam%2FCompilerFETools).

## Runtime updates

### Improvements

#### Show the total strand count in strand dump

The total number of strand groups and strands created in a Ballerina program is now shown in the strand dump.

#### Allow ambiguous target types in `fromJsonWithType` and `cloneWithType`

The `fromJsonWithType` and `cloneWithType` functions returned an error in the earlier implementation when the user-specified target type was a union type consisting of multiple convertible types for a given source value. Now, for such user-specified target types, the operation succeeds without returning an error by returning a value whose inherent type is as follows. If the given source value belongs to at least one of the member types of the target union type, the inherent type of the returned value is the first found type to which the source value belongs. Otherwise, the inherent type of the returned value is the first convertible type in the union.

For example, the operations below will not return an error.

```ballerina
type PetByAge record {
    int age;
    string nickname?;
};

type PetByType record {
    "Cat"|"Dog" pet_type;
    boolean hunts?;
};

type Pet PetByAge|PetByType;

public function main() {
    json j = {
        "nickname": "Fido",
        "pet_type": "Dog",
        "age": 4
    };
    Pet|error pet = j.fromJsonWithType(); // inherent type of pet will be PetByAge

    j = {x: 1};
    record {float x;}|record {int x;}|error v = j.cloneWithType(); // inherent type of v will be record {int x;}
}
```

#### Configurable support for the array of tables

The configurable feature is improved to support the array of tables using a two-dimensional TOML array of in-line tables.

For example, if the configurable variables are defined in the following way,

```ballerina
type Person record {
    readonly int id;
    string name;
};

configurable table<map<int>>[] array1 = ?;
configurable table<Person> key (id)[] array2 = ?;
```

the values can be provided in the `Config.toml` file as follows.

```toml
array1 = [[{a = 1, b = 2}, {c = 3, d = 4}], [{e = 5, f = 6}]]

array2 = [[{id = 1, name = "Anne"}, {id = 2, name = "Bob"}], [{id = 3, name = "Charles"}]]

```

#### Configurable support for the nil type

The configurable feature is now improved to support the following `()` cases.

- Configurable variables of nil type 

    The configurable variables of the nil type are now supported if the configuration is optional.

    For example, the following will be initialized with the default values without providing a compilation error.

    ```ballerina
    configurable () nilValue = ();
    configurable ())[] nilArray = [];
    ```

- Record fields with nil type

    The record fields of nil type or a union of nil are now supported by the configurable feature only if the field contains a default value.

    For example, if the configurable variables are defined in the following way,

    ```ballerina
    type Person record {
        int id;
        string name;
        string? department = "HR";
    };

    configurable Person person = ?;
    ```

    the values can be provided in the `Config.toml` file as follows.

    ```toml
    person = {id = 101, name = "Tom"}
    ```

#### Configurable support for the `json` type

As `json` is a sub-type of `anydata`, it is now supported by the configurable feature.

For example, if the configurable variables are defined in the following way,

```ballerina
configurable json jsonVar = ?;
```

the values can be provided in the `Config.toml` file as follows.

```toml
jsonVar = {stringValue = "string", num = 12, arr = [1, 2, "hello"], map = {a = "a"}}
```

#### Configurable support for array filler values

The configurable feature is now improved to include filler values while configuring array values.

For example, if the configurable variable is defined in the following way,

```ballerina
configurable int[5] arr = ?;
```
the values are provided in the `Config.toml` as follows.

```toml
arr = [1, 2]
```
It will create an array with the `[1,2,0,0,0]` elements because the filler value of the `int` type is `0`.

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.3.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.3.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed+).

## Standard library updates

### New features

##### `http` package

- Added support for killing the application when a resource function panics. 
- Added a grace period for the graceful stop of the listener.
- Added the missing HTTP status codes.
- Made the socket configuration to be configurable in both listener and client configurations.
- Added defaultable parameter support for query parameters.
- Added support for populating the HATEOAS link's `types` field based on the resource return type.

#### `graphql` package

- Added support for disabling introspection queries.
- Added support for GraphQL interfaces.
- Added support for interfaces implementing interfaces.
- Introduced GraphQL client configurations.

#### `gRPC` package

- Added server reflection support for gRPC services.

### Improvements

##### `http` package

- Reduced the listener default timeout to 60s and client default timeout to 30s.
- Improved data binding based on the MIME type match.

#### `graphql` package

- Added service-level interceptor execution for records fields, maps, and tables.
- Added service-level interceptor execution for subscriptions.
- Changed to return all the errors related to a GraphQL document in a single response.

#### `gRPC` package

- Updated Protocol Buffers version to 3.21.7.

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.3.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aissue+milestone%3A2201.3.0+label%3AType%2FBug+is%3Aclosed).

## Developer tools updates

### New features

#### Language Server

- Introduced a new `Extract to local variable` code action.
- Introduced a new `Extract to constant` code action.
- Introduced a new `Extract to function` code action.
- Introduced a new code action to convert an array to array mapping into a query expression.
- Introduced the `loadProject()` API to the workspace manager to open up a project programmatically.

#### CLI

##### Native-image build (Experimental)

Introduced the `--native` flag, which generates a GraalVM native executable when building a Ballerina project.

- The generated executable contains the modules in the current package, their dependencies, Ballerina runtime, and statically linked native code from the JDK.

- The new CLI command will be `bal build --native`.

>**Note:** There is a known [issue](https://github.com/ballerina-platform/ballerina-lang/issues/38665) in the native image build when using locks along with loops. 

#### Debugger

Introduced the `run-in-terminal` feature, which provides the capability to debug Ballerina programs that take user inputs in the launch mode. This can be achieved by setting the `terminal` attribute in the launch configurations to `integrated`. Once the configuration is set, launching the debugger will cause the Ballerina programs to be executed in a separate integrated VS Code terminal.

### Improvements

#### Language Server

- Improved completion sorting within the expression of the `if` condition.
- Improved the `Change variable type` code action.

#### OpenAPI Tool

Improved the CLI client generation to generate the Ballerina client resource methods by default. (Now, the `--client-methods=remote` command option can be used to switch back to client remote functions instead.)

#### GraphQL Tool

- Introduced single client generation for a single schema definition.
- Improved the GraphQL client config generation to support runtime configurability.

### Bug fixes

To view bug fixes, see the GitHub milestone for 2201.3.0 (Swan Lake) of the repositories below.

- [Language Server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.3.0+label%3AType%2FBug+label%3ATeam%2FLanguageServer)
- [OpenAPI](https://github.com/ballerina-platform/openapi-tools/issues?q=is%3Aissue+milestone%3A%22Swan+Lake+2201.3.0%22+label%3AType%2FBug+is%3Aclosed)
- [Debugger](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.3.0+label%3AType%2FBug+label%3AArea%2FDebugger)

## Code to Cloud updates

### New features

Introduced the native executable Docker image creation for cloud-enabled projects by executing the `bal build --native` command.
