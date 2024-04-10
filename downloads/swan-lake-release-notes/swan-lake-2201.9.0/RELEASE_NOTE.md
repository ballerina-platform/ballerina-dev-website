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

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 9 (2201.9.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.9.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed).

## Ballerina library updates

### New features

#### `data.jsondata` package

- Introduced the [`data.jsondata`](https://lib.ballerina.io/ballerina/data.jsondata/latest/) package to provide a set of APIs for JSON data conversions, data projection, and JSON navigation.

    ```ballerina
    import ballerina/data.jsondata;
    import ballerina/io;

    // Define a closed record type to capture the required fields from the JSON content.
    type Book record {|
        string name;
        string author;
    |};

    json jsonContent = {
        name: "Clean Code",
        author: "Robert C. Martin",
        year: 2008,
        publisher: "Prentice Hall"
    };

    string jsonStr = string `
    {
        "name": "The Pragmatic Programmer",
        "author": "Andrew Hunt, David Thomas",
        "year": 1999,
        "publisher": "Addison-Wesley"
    }`;

    public function main() returns error? {
        // Based on the expected type, it selectively converts the JSON content to the record type.
        Book book = check jsondata:parseAsType(jsonContent);
        io:println(book);

        // Based on the expected type, it selectively converts the JSON string to the record type.
        Book book2 = check jsondata:parseString(jsonStr);
        io:println(book2);
    }
    ```

#### `data.xmldata` package

- Introduced the [`data.xmldata`](https://lib.ballerina.io/ballerina/data.xmldata/latest/) package to provide a set of APIs for XML data conversions and data projection.

    ```ballerina
    import ballerina/data.xmldata;
    import ballerina/io;

    // Define a closed record type to capture the required elements and attributes from the XML data.
    type Book record {|
        string name;
        string author;
    |};

    xml xmlData = xml `
    <book>
        <name>Clean Code</name>
        <author>Robert C. Martin</author>
        <year>2008</year>
        <publisher>Prentice Hall</publisher>
    </book>`;

    string xmlStr = string `
    <book>
        <name>Clean Code</name>
        <author>Robert C. Martin</author>
        <year>2008</year>
        <publisher>Prentice Hall</publisher>
    </book>`;

    public function main() returns error? {
        // Based on the expected type, it selectively converts the XML data to the record type.
        Book book = check xmldata:parseAsType(xmlData);
        io:println(book);

        // Based on the expected type, it selectively converts the XML string to the record type.
        Book book2 = check xmldata:parseString(xmlStr);
        io:println(book2);
    }
    ```

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
