# Specification: Ballerina Toml Library

_Owners_: @MadhukaHarith92 @sameerajayasoma @nipunayf  
_Reviewers_: @shafreenAnfar  
_Created_: 2023/04/04  
_Updated_: 2023/04/04  
_Edition_: Swan Lake

## Introduction
This is the specification for the Toml library of [Ballerina language](https://ballerina.io/), which provides APIs to convert a TOML configuration file to `map<json>`, and vice-versa.

Since the parser is following LL(1) grammar, it follows a non-recursive predictive parsing algorithm that operates in a linear time complexity.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-library/issues) or in the [Discord server](https://discord.gg/ballerinalang). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Compatibility](#2-compatibility)
3. [Parsing a TOML Document](#3-parsing-a-toml-document)
4. [Writing to a TOML Document](#4-writing-to-a-toml-document)
5. [Supported Data Types](#5-supported-data-types)
6. [Example](#6-example)

## 1. Overview
This specification elaborates on the functions available in the Toml library.

Since the parser is following LL(1) grammar, it follows a non-recursive predictive parsing algorithm that operates in a linear time complexity.

## 2. Compatibility

| Language  | Version                        |
| --------- | ------------------------------ |
| Ballerina | Ballerina 2201.0.0 (Swan Lake) |
| TOML      | 1.0                            |

The parser follows the grammar rules particularized in the [TOML specification 1.0](https://toml.io/en/v1.0.0).

## 3. Parsing a TOML Document

The module supports parsing either a TOML file or a TOML string.

```ballerina
// Parsing a TOML file
map<json>|toml:Error tomlFile = toml:readFile("path/to/file.toml");

// Parsing a TOML string
map<json>|toml:Error tomLString = toml:readString(string
    `bool = true
    int = 1
    float = 1.1`);
```

By default, the package parses offset date time into `time.Utc`. This can be skipped by disabling the `parseOffsetDateTime`.

## 4. Writing to a TOML Document

Any `map<json>` structure containing the [supported data types](#Supported-Data-Types) can be converted to a TOML document. The package can either convert the document to an array of strings or write to a TOML file.

```ballerina
map<json> toml = {
    "str": "string",
    "float": 0.01,
    "inline": {
        "boolean": false
    }
};

// Write the TOML content into a file
toml:Error? fileResult = toml:writeFile("path/to/file.toml", toml);

// Covert the TOML content to an array of strings
string[]|toml:Error stringResult = toml:writeString(toml);
```



The following options can be set to further format the output TOML file.

| Option                      | Default | Description                                                                                                                                  |
| --------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `int indentationPolicy`     | `2`     | The number of whitespaces considered for an indent. An indentation is made once a standard or an array table is defined under the current one. |
| `boolean allowedDottedKeys` | `true`  | If set, dotted keys are used instead of standard tables.                                                                                     |

Consider the `map<json>` structure of  `{table: key = "value"}`. The output TOML document of this can be diverted based on the `allowedDottedKeys` property as follow.

```toml
table.key = "value" # allowedDottedKeys = true

# allowedDottedKeys = false
[table]
key = "value"
```

## 5. Supported Data Types

The following TOML primitives are mapped to the Ballerina types as follows.

| TOML                                        | Ballerina                       |
| ------------------------------------------- | ------------------------------- |
| Integer                                     | `ballerina.lang.int`            |
| Float                                       | `ballerina.lang.decimal`        |
| Infinity                                    | `ballerina.lang.float.Infinity` |
| NaN                                         | `ballerina.lang.float.NaN`      |
| Unquoted, Basic and Literal Strings         | `ballerina.lang.string`         |
| Boolean                                     | `ballerina.lang.boolean`        |
| Array                                       | `json[]`                        |
| Table                                       | `map<json>`                     |
| Offset Date-Time                            | `ballerina.time.Utc`            |
| Local Date-Time, Local Date, and Local Time | `ballerina.lang.string`         |

## 6. Example

The following example illustrates how TOML content is converted to a Ballerina record and written it back after processing it.

```ballerina
import ballerina/io;
import ballerina/toml;

type Package record {|
    string name;
    record {|int major; int minor; int patch;|} 'version;
|};

public function main() returns error? {
    // Read the TOML content into a map<json>
    map<json> result = check toml:readString(string
        `name = "toml"

        [version]
        major = 0
        minor = 1
        patch = 3`);

    Package packageToml = check result.fromJsonWithType();

    // Update the version 
    packageToml.'version.minor += 1;
    packageToml.'version.patch = 0;

    // Convert map<json> into TOML content
    io:println(toml:writeString(packageToml));
}
```
