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

#### Create immutable record value using record type with mutable default values

With these improvements, enable the usage of mutable defaults by wrapping them with `cloneReadOnly` when creating an immutable record value with a record type.

```ballerina
type Temp record {|
    any[] initalValues = [10, 20, 30];
|};

function value() {
    // Now results in compile-time error.
    Temp & readonly _ = {};
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

type Person record {
    *Data;
    int id;
};

public function main() {
    Person person = {"id": 10};
    io:println(person.id); // Prints 10.
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
