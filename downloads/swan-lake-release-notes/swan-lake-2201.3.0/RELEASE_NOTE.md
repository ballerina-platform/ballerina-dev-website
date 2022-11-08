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

<em>2201.3.0 (Swan Lake) is the second major release of 2022, and it includes a new set of features and significant improvements to the compiler, runtime, standard library, and developer tooling. It is based on the 2022R3 version of the Language Specification.</em> 

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

### Language Updates

#### New features

#### Improvements

#### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.3.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+label%3ATeam%2FCompilerFE+milestone%3A%222201.3.0%22).

### Runtime Updates

#### New Features

#### Improvements

##### Strand dump showing the total strand group and strand count in a Ballerina program

The total number of strand groups and strands created in a Ballerina program is now shown in the strand dump.

##### Allowing ambiguous target types in `fromJsonWithType` & `cloneWithType`

When the user-specified target type was a union type consisting of multiple convertible types for a given source value, earlier `fromJsonWithType` & `cloneWithType` returned an error. Now for such user-specified target types, the operation succeeds without returning an error, returning a value whose inherent type is as follows. If the given source value belongs to at least one of the member types of the target union type, the inherent type of the returned value is the first found type to which the source value belongs. Otherwise, the inherent type of the returned value is the first convertible type in the union.

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

##### Configurable support for the array of tables

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

##### Configurable support for nil type

The configurable feature is now improved to support the following `()` cases

- configurable variables of nil type
  The configurable variables with nil type are now supported if the configuration is optional.

For example, the following will be initialized with the default values without providing a compilation error.

```ballerina
configurable () nilValue = ();
configurable ())[] nilArray = [];
```

- record fields with nil type
  The record fields of nil type or a nilable union type are now supported by the configurable feature, only if the field contains a default value. If the configurable variable is of record type and the record contains nil or union of nil is now supported if the record configurable variable

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

##### Configurable support for `json` type
As `json` is a sub-type of `anydata`, it is now supported by the configurable feature.

For example, if the configurable variables are defined in the following way,

```ballerina
configurable json jsonVar = ?;
```

the values can be provided in the `Config.toml` file as follows.

```toml
jsonVar = {stringValue = "string", num = 12, arr = [1, 2, "hello"], map = {a = "a"}}
```

##### Configurable support for array filler values

The configurable feature is now improved to include filler values while configuring array values.

For example, if the configurable variable is defined in the following way,

```ballerina
configurable int[5] arr = ?;
```
And the values are provided in the `Config.toml` as follows,

```toml
arr = [1, 2]
```
It will create an array with the elements `[1,2,0,0,0]` as the filler value for the `int` type is `0`.

#### Bug Fixes

To view bug fixes, see the [GitHub milestone for 2201.3.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.3.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed+)

### Standard library updates

#### New features

#### Improvements

#### Bug Fixes

To view bug fixes, see the [GitHub milestone for 2201.3.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.3.0%22+label%3AType%2FBug).

### Code to Cloud updates

#### Improvements

#### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.3.0 (Swan Lake)](https://github.com/ballerina-platform/module-ballerina-c2c/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+2201.3.0%22+label%3AType%2FBug).

### Developer tools updates

#### New features

#### Improvements

To view bug fixes, see the GitHub milestone for 2201.3.0 (Swan Lake) of the repositories below.

- [Language Server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A%22Ballerina+2201.3.0%22+is%3Aclosed+label%3ATeam%2FLanguageServer)
- [update tool](https://github.com/ballerina-platform/ballerina-update-tool/issues?q=is%3Aissue+milestone%3A%22Ballerina+2201.3.0%22+is%3Aclosed+label%3AType%2FBug)

### Breaking changes

### Ballerina packages updates

#### New features

<!-- <style>.cGitButtonContainer, .cBallerinaTocContainer {display:none;}</style> -->
