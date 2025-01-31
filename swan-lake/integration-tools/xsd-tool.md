---
layout: ballerina-xsd-support-left-nav-pages-swanlake
title: XSD tool
description: The XSD tool provides the below set of command line tools to work with XSD files in Ballerina.
keywords: ballerina, programming language, xsd, xml
permalink: /learn/xsd-tool/
active: xsd-tool
intro: The XSD tool provides the below set of command line tools to work with XSD files in Ballerina.
--- 

The Ballerina XSD tool generates Ballerina record types from an XSD specification, simplifying integration with XML-based operations in Ballerina.

## Install the tool

Execute the command below to pull the XSD tool from [Ballerina Central](https://central.ballerina.io/ballerina/xsd/latest).

```bash
$ bal tool pull xsd
```

## Usage

The XSD tool provides the capability to generate the Ballerina record types for a given XSD schema.

### Generate Ballerina clients from XSD Specification

The record types generated from an XSD file can be used in Ballerina applications to handle XML-based data defined in the XSD specification

The following command will generate Ballerina records for a given XSD file.

```bash
$ bal xsd <xsd-file-name> --module <output-module-name>
```

| Option | Description |
|--------|-------------|
| `<xsd-file-path>` | (Required) The path to the WSDL file. |
|`-m, --module <output-module-name>` |: The name of the module in which Ballerina record types will be generated. If not provided, the output file will be saved to the same Ballerina project. |

For example,

```bash
$ bal xsd hello.xsd --module custom
```

This generates record types (`types.bal`) for the `hello.xsd` XSD specification. The above command can be run from anywhere on the execution path. It is mandatory to run the above command within a Ballerina package.

Upon successful execution, the following file will be created in the `custom` directory within the Ballerina project.

```bash
-- types.bal
```

## Examples

### Generate record types in the default module

This command generates record types in the current Ballerina project.

```bash
$ bal xsd sample.xsd
```

### Generate record types in a specific module

To organize the generated types in a specific module, use the `--module` flag.

```bash
$ bal xsd sample.xsd --module custom
```

The generated types.bal file will be placed inside the `custom` module.

```bash
-- custom/
   ├── types.bal
```
