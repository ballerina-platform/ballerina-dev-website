---
layout: ballerina-xsd-support-left-nav-pages-swanlake
title: XSD tool
description: The XSD tool provides a set of command line tools to work with XSD files in Ballerina.
keywords: ballerina, programming language, xsd, xml
permalink: /learn/xsd-tool/
active: xsd-tool
intro: The Ballerina XSD tool generates Ballerina record types from an XSD specification, simplifying integration with XML-based operations in Ballerina.
--- 
## Install the tool

Execute the command below to pull the XSD tool from [Ballerina Central](https://central.ballerina.io/ballerina/xsdtool/latest).

```
$ bal tool pull xsd
```

## Usage

The XSD tool allows you to generate Ballerina record types from an XSD specification using the following command. It is mandatory to run the command inside a Ballerina project.

```
$ bal xsd <xsd-file-path> 
          [--module <output-module-name>]
```

### Command options  

| Option | Description | Mandatory/Optional |
|--------|-------------|--------------------|
| `<xsd-file-path>` | The path of the XSD file | Mandatory |
| `-m`, `--module`   | The name of the module in which the Ballerina record types are generated. If not provided, the output file will be saved to the project default package | Optional |

### Generate types for the given XSD file

Use the following command to generate Ballerina record types for all elements defined in the specified XSD file. By default, the generated `types.bal` file will be placed in the default module of the current Ballerina project.

```
$ bal xsd <source-file-path>
```

For example,

```
$ bal xsd sample.xsd
```

If successful, you will see the following output.

```
The 'types.bal' file is written to the default module
```

### Generate types in a specific module

To generate the Ballerina record types in a specific module, use the `--module` option.

```
$ bal xsd <source-file-path> --module <output-module-name>
```

For example,

```
$ bal xsd sample.xsd --module custom
```

This will generate a `types.bal` file inside the `custom` submodule of the Ballerina project.

```
modules/
└── custom/
        └── types.bal
```

The following output will be displayed.

```
The 'types.bal' file is written to 'modules/custom'
```
