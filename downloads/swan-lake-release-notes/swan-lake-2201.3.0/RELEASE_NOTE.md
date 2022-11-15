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

### Overview of Ballerina 2201.3.0 (Swan Lake)

<em>2201.3.0 (Swan Lake) is the third major release of 2022, and it includes a new set of features and significant improvements to the compiler, runtime, standard library, and developer tooling. It is based on the 2022R4 version of the Language Specification.</em> 

### Update Ballerina

**If you are already using Ballerina 2201.0.0 (Swan Lake)**, run either of the commands below to directly update to 2201.3.0 using the [Ballerina Update Tool](/learn/cli-documentation/update-tool/).

`bal dist update` (or `bal dist pull 2201.3.0`)

**If you are using a version below 2201.0.0 (Swan Lake)**, run the commands below to update to 2201.3.0.

1. Run `bal update` to get the latest version of the Update Tool.

2. Run `bal dist update` ( or `bal dist pull 2201.3.0`) to update your Ballerina version to 2201.3.0.

However, if you are using a version below 2201.0.0 (Swan Lake) and if you already ran `bal dist update` (or `bal dist pull 2201.3.0`) before `bal update`, see [Troubleshooting](/downloads/swan-lake-release-notes/swan-lake-2201.0.0#troubleshooting) to recover your installation.

### Install Ballerina

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.

### Migrate from Swan Lake Beta releases
>**Info:** If you have been using Swan Lake Beta releases, delete the `Dependencies.toml` files in your Ballerina packages when migrating to Ballerina 2201.3.0 (Swan Lake). 

A few backward-incompatible changes have been introduced during the Swan Lake Beta program, and thereby, some of your existing packages may not compile with Ballerina 2201.3.0 (Swan Lake). Therefore, you need to delete the `Dependencies.toml` file to force the dependency resolver to use the latest versions of your dependencies. 

## Language updates

### New features

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.x.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+label%3ATeam%2FCompilerFE+milestone%3A%22Ballerina+2201.3.0%22).

## Compiler API updates

### New features

#### Semantic API
- Added a new `annotAttachments()` API to get the annotation attachments and their constant values from the annotatable symbols
- Introduced a new `ClientDeclSymbol` symbol to represent the semantic information of the client-declaration statement

### Improvements

#### Semantic API
- Improved the `constValue()` method to retrieve the constant value as an object from the constant symbol

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.3.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.3.0+label%3ATeam%2FCompilerFETools+label%3AType%2FBug+).

## Runtime updates

### New features

### Improvements

#### Strand dump showing the total strand count

The total number of strand groups and strands created in a Ballerina program is now shown in the strand dump.

#### Allow ambiguous target types in `fromJsonWithType` & `cloneWithType`

The `fromJsonWithType` & `cloneWithType` functions returned an error in the earlier implementation when the user-specified target type was a union type consisting of multiple convertible types for a given source value. Now, for such user-specified target types, the operation succeeds without returning an error by returning a value whose inherent type is as follows. If the given source value belongs to at least one of the member types of the target union type, the inherent type of the returned value is the first found type to which the source value belongs. Otherwise, the inherent type of the returned value is the first convertible type in the union.

For example, the following operations will not return an error.

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

#### Configurable support for nil type

The configurable feature is now improved to support the following `()` cases.

- configurable variables of nil type 
The configurable variables with nil type are now supported if the configuration is optional.

For example, the following will be initialized with the default values without providing a compilation error.

```ballerina
configurable () nilValue = ();
configurable ())[] nilArray = [];
```

- record fields with nil type
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

#### Configurable support for `json` type
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
It will create an array with the `[1,2,0,0,0]` elements because the filler value of `int` type is `0`.

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.3.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.3.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed+)

## Standard library updates

### New features

##### `http` package

- Added support for killing the application when a resource function panics 
- Added a grace period for the graceful stop of the listener
- Added the missing HTTP status codes
- Made the socket configuration to be configurable in both listener and client configurations
- Added defaultable parameter support for query parameters
- Added support for populating HATEOAS link's `types` field based on the resource return type

#### `graphql` package

- Added support for disabling introspection queries
- Added support for GraphQL interfaces
- Added support for interfaces implementing interfaces
- Introduced GraphQL client configurations

#### `gRPC` package

- Added server reflection support for gRPC services

### Improvements

##### `http` package

- Reduced the listener default timeout to 60s and client default timeout to 30s
- Improved data binding based on the  MIME type match

#### `graphql` package

- Added service-level interceptor execution for records fields, maps, and tables
- Added service-level interceptor execution for subscriptions
- Changed to return all the errors related to a GraphQL document in a single response

#### `gRPC` package

- Updated Protocol Buffers version to 3.21.7

## Developer tools updates

### New features

#### Language Server

- Introduced a new `Extract to local variable` code action
- Introduced a new `Extract to function` code action
- Introduced the `loadProject()` API to the workspace manager to open up a project programmatically
- Introduced a new `Generate module for client declaration` code action to generate a module for client declarations

#### CLI

##### Native-image build (Experimental)
Introduced the `--native` flag, which generates a GraalVM native executable when building a Ballerina project.
- The generated executable contains the modules in the current package, their dependencies, Ballerina runtime, and statically linked native code from the JDK.
- `bal build --native`


## Code to Cloud updates

### New features
- Introduced the native executable Docker image creation for cloud-enabled projects by executing the `bal build --native` command

#### Ballerina Shell

#### Ballerina Update Tool

#### Debugger

* Introduced the run-in-terminal feature, which provides the capability to debug Ballerina programs (that take user inputs) in the launch mode. This can be achieved by setting the `terminal` attribute in the launch configurations to `integrated`. Once the configuration is set, launching the debugger will cause the Ballerina programs to be executed in a separate integrated VS Code terminal.

### Improvements

#### Language Server
- Improved completions sorting within the expression of the `if` condition
- Improved the `Change variable type` code action

#### Ballerina Shell

#### Ballerina Update Tool

#### GraphQL Tool 
- Introduced single client generation for single schema definition
- Improved the GraphQL client config generation to support runtime configurability

### Bug fixes

To view bug fixes, see the GitHub milestone for 2201.3.0 (Swan Lake) of the repositories below.

- [Language Server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.3.0+label%3AType%2FBug+label%3ATeam%2FLanguageServer)
- [Update Tool](https://github.com/ballerina-platform/ballerina-update-tool/issues?q=is%3Aissue+milestone%3A%22Ballerina+2201.3.0%22+is%3Aclosed+label%3AType%2FBug)
- [OpenAPI](https://github.com/ballerina-platform/openapi-tools/issues?q=is%3Aissue+label%3AType%2FBug+milestone%3A%22Ballerina+2201.3.0%22+is%3Aclosed)
- [ProjectAPI](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FDevTools+milestone%3A2201.3.0+label%3AArea%2FProjectAPI)
- [Semantic API](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.3.0+label%3AArea%2FSemanticAPI+)

## Breaking changes
