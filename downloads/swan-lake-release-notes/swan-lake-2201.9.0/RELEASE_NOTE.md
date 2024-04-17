---
layout: ballerina-left-nav-release-notes
title: 2201.9.0 (Swan Lake) 
permalink: /downloads/swan-lake-release-notes/2201.9.0/
active: 2201.9.0
redirect_from: 
    - /downloads/swan-lake-release-notes/2201.9.0
    - /downloads/swan-lake-release-notes/2201.9.0-swan-lake/
    - /downloads/swan-lake-release-notes/2201.9.0-swan-lake
    - /downloads/swan-lake-release-notes/
    - /downloads/swan-lake-release-notes
---

## Overview of Ballerina Swan Lake Update 9 (2201.9.0)

<em> Swan Lake Update 9 (2201.9.0) is the ninth update release of Ballerina Swan Lake, and it includes a new set of features and significant improvements to the compiler, runtime, Ballerina library, and developer tooling. It is based on the 2023R1 version of the Language Specification.</em> 

## Update Ballerina

Update your current Ballerina installation directly to 2201.9.0 using the [Ballerina Update Tool](/learn/update-tool/) as follows.

1. Run `bal update` to get the latest version of the Update Tool.
2. Run `bal dist update` to update to this latest distribution.

## Install Ballerina

If you have not installed Ballerina, download the [installers](/downloads/#swanlake) to install.

## Language updates

### New features

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 9 (2201.9.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FCompilerFE+milestone%3A2201.9.0+is%3Aclosed+label%3AType%2FBug).

## Runtime updates

### New features

### Improvements                             

#### Support to construct immutable record values with record type-descriptors that have mutable default values

It is now possible to use record type-descriptors with mutable default values when constructing immutable record values, as long as the default value belongs to `lang.value:Cloneable`. When used in a context that requires an immutable value, the default value will be wrapped in a `value:cloneReadOnly` call to produce an immutable value.

```ballerina
import ballerina/io;

type Student record {|
    int id;
    string name;
    // The inherent type of the default value expression is `int[]`.
    int[] moduleCodes = [1001, 2001, 3010];
    // The inherent type of the default value expression is `any[]`.
    any[] config = getStudentConfig();
|};

function createEmployee(int id, string name, readonly & string[] config) {
    // No longer panics at runtime, since an immutable value is set
    // for the `moduleCodes` field.
    Student & readonly s1 = {id, name, config};
    io:println(s1.moduleCodes is readonly & int[]); // true
}

isolated function getStudentConfig() returns any[] {
    return [];
}
```
If the default value does not belong to `value:Cloneable`, and therefore, an immutable value cannot be created by calling `value:cloneReadOnly`, the compiler requires specifying a value for such a field (i.e., the default will not be used).

```ballerina
function createEmployee(int id, string name) {
    // Results in a compile-time error now since there is no default
    // value that can be used for `config`.
    Student & readonly s1 = {id, name};
}   
```

#### Improvements to the usage of default values of record fields

Now, the default value of a record is evaluated only if a value is not provided for the specific field in the mapping constructor.

With these improvements, with record type inclusion, the default value from an included record will not be used if the including record overrides the field.

```ballerina
import ballerina/io;

isolated int id = 1;

type Data record {
    int id = getId();
};

public function main() {
    Data data = {"id": 10};
    lock {
        io:println(id); // Prints 1 since it is `getId()` is not evaluated.
    }
}

isolated function getId() returns int {
    lock {
        id = id + 1;
        return id;
    }
}
```

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 9 (2201.9.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.9.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed).

## Ballerina library updates

### Deprecations

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 9 (2201.9.0)](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.9.0%22+label%3AType%2FBug).

## Developer tools updates

### New features

#### Language Server

#### CLI

#### OpenAPI tool

### Improvements

#### Language Server

### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake Update 9 (2201.9.0) of the repositories below.

- [Language server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FLanguageServer+milestone%3A2201.9.0+is%3Aclosed+label%3AType%2FBug+)
- [OpenAPI](https://github.com/ballerina-platform/openapi-tools/issues?q=is%3Aissue+label%3AType%2FBug+milestone%3A%22Swan+Lake+2201.9.0%22+is%3Aclosed)

## Ballerina packages updates

### New features

### Improvements

### Bug fixes

## Backward-incompatible changes
