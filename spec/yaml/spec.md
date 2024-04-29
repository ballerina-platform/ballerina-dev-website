# Specification: Ballerina Yaml Library

_Owners_: @MadhukaHarith92 @sameerajayasoma @nipunayf  
_Reviewers_: @shafreenAnfar  
_Created_: 2023/04/04  
_Updated_: 2023/04/04  
_Edition_: Swan Lake

## Introduction
This is the specification for the Yaml library of [Ballerina language](https://ballerina.io/), which provides APIs to convert a YAML configuration file to JSON, and vice-versa. The module supports both the functions of reading and writing either a single YAML document or a YAML stream.

The Yaml library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-library/issues) or in the [Discord server](https://discord.gg/ballerinalang). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Compatibility](#2-compatibility)
3. [Parsing a YAML File](#3-parsing-a-yaml-file)
4. [Writing a YAML File](#4-writing-a-yaml-file)
5. [YAML Schema and Supported Data Types](#5-yaml-schema-and-supported-data-types)
6. [Custom YAML Types](#6-custom-yaml-types)

## 1. Overview
This specification elaborates on the functions available in the Yaml library.

Since the parser is following LL(1) grammar, it follows a non-recursive predictive parsing algorithm that operates in a linear time complexity.

## 2. Compatibility

| Language  | Version                        |
| --------- | ------------------------------ |
| Ballerina | Ballerina 2201.0.0 (Swan Lake) |
| YAML      | 1.2.2                          |

The parser follows the grammar rules particularized in the [YAML specification 1.2.2](https://yaml.org/spec/1.2.2/).

## 3. Parsing a YAML File

The read function allows the user to obtain either a YAML document or an array of YAML streams if the `isStream` flag is set.

```ballerina
// Parsing a YAML document
json|yaml:Error yamlDoc = yaml:readFile("path/to/file.yml");

// Parsing a YAML stream
json|yaml:Error yamlDocs = yaml:readFile("path/to/file.yml", isStream = true);

// Parsing a YAML string 
json|yaml:Error yamlLine = yaml:readString("outer: {inner: value}");
```

The user can either set the `allowAnchorRedefinition` or `allowMapEntryRedefinition` to let the parser overwrite anchors and map entry keys respectively.

## 4. Writing a YAML File

The user can write either a document or a stream using this function.

```ballerina
// Writing a YAML document
check yaml:writeFile("path/to/file.yaml", yamlContent);

// Writing a YAML stream
check yaml:writeFile("path/to/file.yaml", yamlContent, isStream = true);

// Writing a YAML string
json|yaml:Error jsonOutput = yaml:writeString("outer: {inner: value}");
```

By default, the parser attempts to write the YAML scalars in planar style. However, there are some scalars that cause ambiguity against a few control symbols in YAML. In this case to remove the vagueness, the parser will either add  `"` quotes or `'` quotes based on the `useSingleQuotes` flag is set. Further, if the `forceQuotes` flag is set, then all the scalars will be quoted.

The following options can be set to further format the output YAML file.

| Option                  | Default | Description                                                                                         |
| ----------------------- | ------- | --------------------------------------------------------------------------------------------------- |
| `int indentationPolicy` | `2`     | The number of whitespaces considered to a indent.                                                   |
| `int blockLevel`        | `1`     | The maximum depth level for the block-style collections before the flow-style collections are used. |
| `boolean canonical`     | `false` | If the flag is set, the parser will write the tag along with the node.                              |

## 5. YAML Schema and Supported Data Types

The `Fail Safe Schema` is the most basic schema supported by any YAML document. The corresponding Ballerina data types are listed as shown below.

| YAML Tag | Ballerina Data Type     |
| -------- | ----------------------- |
| !!str    | `ballerina.lang.string` |
| !!seq    | `ballerina.lang.array`  |
| !!map    | `ballerina.lang.map`    |

In addition to the `Fail-Safe Schema`, the `JSON Schema` defines the following tags to enable basic JSON support. The `Core Schema` is an extension of the `JSON Schema` that supports the same tags with more human-readable notations.

| YAML Tag | Ballerina Data Type      |
| -------- | ------------------------ |
| !!null   | `()`                     |
| !!bool   | `ballerina.lang.boolean` |
| !!int    | `ballerina.lang.int`     |
| !!float  | `ballerina.lang.float`   |

## 6. Custom YAML Types

A custom tag support can be added to the YAML parser by writing a record of the type `YamlType`. All the custom YAML tags must be provided as an array to the `yamlTypes` property in the config. The following code segment demonstrates an example of adding a custom tag to the parser.

```ballerina
import ballerina/yaml;

type RGB [int, int, int];

// Validation function to check before constructing the RGB
function constructRGB(json data) returns json|yaml:SchemaError {
    RGB|error value = data.cloneWithType();

    if value is error {
        return error("Invalid shape for RGB");
    }

    foreach int index in value {
        if index > 255 || index < 0 {
            return error("One RGB value must be between 0-255");
        }
    }

    return value;
}

public function main() returns error? {
    yaml:YamlType rgbType = {
        tag: "!rgb",
        ballerinaType: RGB,
        kind: yaml:SEQUENCE,
        construct: constructRGB,
        represent: function(json data) returns string => data.toString()
    };

    RGB color = [256, 12, 32];
    json balStruct = {color};

    check yaml:writeFile("rgb.yml", balStruct, canonical = true, yamlTypes = [rgbType]);
}
```

The parser considers these custom tags before the default tags when resolving. Thus, the output tag is `!rgb` rather than `!seq`.

```yaml
!!str color: !rgb [!!int 256, !!int 12, !!int 32]
```
