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

#### Allow forward referencing of module-level XML namespace declarations.
The language supports referencing of module-level XML namespaces which are defined after the usage.

```ballerina
public function main() {
    string exdoc = ex:doc;
}
xmlns "http://example.com" as ex;
```

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 9 (2201.9.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FCompilerFE+milestone%3A2201.9.0+is%3Aclosed+label%3AType%2FBug).

## Runtime updates

### New features

### Improvements                             

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 9 (2201.9.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.9.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed).

## Ballerina library updates

### New features

#### `avro` package

- Introduced Avro serialization/deserialization support

### Deprecations

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 9 (2201.9.0)](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.9.0%22+label%3AType%2FBug).

## Developer tools updates

### New features

#### Formatter

##### Multiline function call formatting.
When a multiline function call is present in the code, the subsequent lines used to have the same indentation as the first line. This behavior is modified to have an indentation of 8 spaces in the subsequent lines.

- Before formatting

    ```ballerina
    addNumbers(numberOne,  numberTwo, numberThree,
    numberFour, numberFive, numberSix);
    ```

- After formatting

    ```ballerina
    addNumbers(numberOne, numberTwo, numberThree,
            numberFour, numberFive, numberSix);
    ```

When a multiline object is present as an argument, the indentation of the subsequent lines is set such that those lines have the same indentation as the object declaration.

```ballerina
public function baz() {
    baz(t1, t2, object {
                    int i = 1;
                    int y = 2;
                },
                b,
                c,
                d);
}
```



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

### Language

- A bug which resulted in the addition of a default namespace to an XML navigation name pattern, even when the default namespace is defined after it, has been fixed.

    ```ballerina
    public function main() {
        xml x = xml `<e/><f/>`;
        xml x1 = x.<e>; // which returned empty xml now returns <e/>.
        xmlns "http://example.com/";
    }
    ```

- A bug which resulted in XML navigation failing to return elements with namespaces different from the default one when using `<*>` to access XML element children has been fixed.

    ```ballerina
    public function main() {
        xmlns "foo";
        xmlns "bar" as k;
        xml x1 = xml `<item><k:child>C</k:child><child2>D</child2></item>`;
        xml x2 = x1/<*>; // used to return `<child2 xmlns="foo">D</child2>`, now returns `<k:child xmlns="foo" xmlns:k="bar">C</k:child><child2 xmlns="foo">D</child2>`
    }
    ```

- A bug which resulted in XML namespace URI being empty when a constant is used for XML namespace URI in the XML namespace definition has been fixed.

    ```ballerina
    const URI = "http://ballerina.com/";
    xmlns URI as ns0;

    public function main() {
        string s = ns0:foo; // used to result in "{}foo" which now results in {http://ballerina.com/}foo
    }
    ```

- A bug which resulted in a compiler crash or a null value for a variable of a binding pattern which is used within closure has been fixed.

    ```ballerina
    function f1() {
        string[] values = ["a", "b", "c"];
        map<int> data = {
            a: 1
        };
        foreach var [k, _] in data.entries() {
            boolean b = <any> k is (); // which resulted true since k is used in a closure, now returns false. k is now not nil.
            _ = values.filter(item => item == k);
        }
    }
    ```

- A bug which resulted in empty XML results in XML navigation when the navigation name pattern contains escape characters has been fixed.

    ```ballerina
    public function main() {
        xml d = xml `
        <person>
            <name>John</name>
            <home-address>some address</home-address>
        </person>`;

        xml x1 = d/<home\-address>; // Used to produce an empty output. Now produce <home-address>some address</home-address>
    }
    ```

- A bug which resulted in no compilation error on missing required fields in the select clause has been fixed.

    ```ballerina
    type Foo record {|
        int i;
        string x;
    |};

    type Bar record {|
        int j;
        string y;
    |};

    type Baz record {|
        Foo[] fooArr;
    |};

    function fn(Baz baz) {
        int|Bar[] _ = from var foo in baz.fooArr
            select { // used to give no compilation error. Now gives a compilation error. missing non-defaultable required record field 'y'
                j: foo.i
                // y: foo.x
            };
    }
    ```

- A bug which resulted in swapping the top most comments above imports while formatting is fixed. This fix results in preserving newlines within comment blocks above imports.

    - Before formatting

    ```ballerina
    // Copyright (c) 2024 WSO2 LLC. (http://www.wso2.com).
    //
    // WSO2 LLC. licenses this file to you under the Apache License,
    // Version 2.0 (the "License"); you may not use this file except
    // in compliance with the License.
    // You may obtain a copy of the License at
    //
    // http://www.apache.org/licenses/LICENSE-2.0
    //
    // Unless required by applicable law or agreed to in writing,
    // software distributed under the License is distributed on an
    // "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    // KIND, either express or implied.  See the License for the
    // specific language governing permissions and limitations
    // under the License.


    // just a random comment
    // for two lines part of this import



    import ballerinax/oracledb;

    import ballerina/io;

    // module imports
    import bas;
    import fos;

    // foo
    import abc/foo;

    // bar
    import abc/bar;

    function baz() {

    }
    ```

    - After formatting

    ```ballerina
    // Copyright (c) 2024 WSO2 LLC. (http://www.wso2.com).
    //
    // WSO2 LLC. licenses this file to you under the Apache License,
    // Version 2.0 (the "License"); you may not use this file except
    // in compliance with the License.
    // You may obtain a copy of the License at
    //
    // http://www.apache.org/licenses/LICENSE-2.0
    //
    // Unless required by applicable law or agreed to in writing,
    // software distributed under the License is distributed on an
    // "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    // KIND, either express or implied.  See the License for the
    // specific language governing permissions and limitations
    // under the License.

    // just a random comment
    // for two lines part of this import

    // module imports
    import bas;
    import fos;

    import ballerina/io;
    import ballerinax/oracledb;

    // bar
    import abc/bar;

    // foo
    import abc/foo;

    function baz() {

    }
    ```

### `rabbitmq` package

- Removed the previously deprecated `rabbitmq:Message` record. Consequently, corresponding APIs no longer accommodate this record. Users are advised to transition to utilizing subtypes of `rabbitmq:AnydataMessage` for continued functionality.

### `nats` package

- Removed the previously deprecated `nats:Message` record. Consequently, corresponding APIs no longer accommodate this record. Users are advised to transition to utilizing subtypes of `nats:AnydataMessage` for continued functionality.
