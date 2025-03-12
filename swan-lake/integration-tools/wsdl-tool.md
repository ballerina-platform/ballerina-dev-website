---
layout: ballerina-wsdl-support-left-nav-pages-swanlake
title: WSDL tool
description: The WSDL tool provides a set of command line tools to work with WSDL files in Ballerina.
keywords: ballerina, programming language, wsdl, soap
permalink: /learn/wsdl-tool/
active: wsdl-tool
intro: The Ballerina WSDL tool generates Ballerina client stubs and record types from a given WSDL file, simplifying integration with SOAP-based web services by eliminating the need for manually creating types and client functions.
---

## Install the tool

Execute the command below to pull the WSDL tool from [Ballerina Central](https://central.ballerina.io/ballerina/wsdl/latest).

```
bal tool pull wsdl
```

## Usage

The WSDL tool provides the following capabilities:

1. Generate Ballerina client functions for a given WSDL specification.
2. Generate Ballerina record types for an XML schema provided in the WSDL specification.

The client generated from a WSDL file can be used in your applications to call the SOAP-based web service defined in the WSDL.

The following command will generate Ballerina client stubs and records for a given WSDL file. It is mandatory to run the command within a Ballerina package.

```
bal wsdl <wsdl-file-path>
         [--operations <operation-uris>]
         [--module <output-module-name>]
         [--port <port-name>]
```

### Command options

| Option | Description | Mandatory/Optional |
|--------|-------------|--------------------|
| `<wsdl-file-path>` | The path of the WSDL file. | Mandatory |
| `--operations <operation-uris>` | A comma-separated list of operation URIs for which client methods should be generated. If not provided, methods for all operations in the WSDL file will be generated. | Optional |
| `-m, --module <output-module-name>` | The name of the module where the generated client and record types will be placed. If not provided, output files will be saved to the project default package. | Optional |
| `-p, --port <port-name>` | The name of the port that defines the service endpoint. If specified, a client will be generated only for this port. Otherwise, clients for all available ports will be generated. | Optional |

### Generate Ballerina clients and types from a WSDL file

```
bal wsdl <wsdl-file-path>
```

This command generates Ballerina clients and record types for all operations in the given WSDL file.

For example,

```
bal wsdl calculator.wsdl
```

Upon successful execution, the following files will be created inside the default module in the Ballerina project.

```
client.bal (There can be multiple client files depending on the WSDL file)
types.bal
```

### Generate a Ballerina client and types for a specific module

```
bal wsdl <wsdl-file-path> --module <output-module-name>
```

This command generates Ballerina clients and record types for the given WSDL file and saves them in the `<output-module-name>` submodule within the Ballerina project.

For example,

```
bal wsdl calculator.wsdl --module custom
```

This generates a Ballerina client (`client.bal`) and record types (`types.bal`) for the `calculator.wsdl` WSDL specification.

Upon successful execution, the following files will be created in the `custom` submodule within the Ballerina project.

```
modules/
└── custom/
    └── client.bal (There can be multiple client files depending on the WSDL file)
    └── types.bal
```

### Generate a Ballerina client for specific operations

```
bal wsdl <wsdl-file-path> --operations <operation-uris>
```

This command generates a client containing methods only for the specified operation actions.

For example,

```
bal wsdl sample.wsdl --operations http://sample.org/action1,http://sample.org/action2
```

### Generate a Ballerina client for a specific port

```
bal wsdl <wsdl-file-path> --port <port-name>
```

This command generates a client only for the given port in the WSDL file.

For example,

```
bal wsdl calculator.wsdl --port SamplePortName
```
