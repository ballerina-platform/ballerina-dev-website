---
layout: ballerina-wsdl-support-left-nav-pages-swanlake
title: WSDL tool
description: The WSDL tool provides the below set of command line tools to work with WSDL files in Ballerina.
keywords: ballerina, programming language, wsdl, soap
permalink: /learn/wsdl-tool/
active: wsdl-tool
intro: The WSDL tool provides the below set of command line tools to work with WSDL files in Ballerina.
--- 

The Ballerina WSDL tool generates Ballerina client stubs and record types from a given WSDL file, simplifying integration with SOAP-based web services by eliminating the need for manually generating types and client functions.

## Install the tool

Execute the command below to pull the WSDL tool from [Ballerina Central](https://central.ballerina.io/ballerina/wsdl/latest).

```
$ bal tool pull wsdl
```

## Usage

The WSDL tool provide the following capabilities.
    1. Generate the Ballerina client code for a given WSDL specification.
    2. Generate the Ballerina record types for a XML schema provided in the WSDL specification.

### Generate Ballerina clients from WSDL Specification

The client generated from a WSDL file can be used in your applications to call the SOAP-based web service defined in the WSDL.

The following command will generate Ballerina client stubs and records for a given WSDL file.

```bash
$ bal wsdl <wsdl-file-path> [--operations <operation-uris>] [--module <output-module-name>] [--port <port-name>]
```

| Option | Description |
|--------|-------------|
| `<wsdl-file-path>` | (Required) The path to the WSDL file. |
| `--operations <operation-uris>` | (Optional) A comma-separated list of operation URIs for which client methods should be generated. If not provided, methods for all operations in the WSDL file will be generated. |
| `-m, --module <output-module-name>` | (Optional) The name of the module where the generated client and record types will be placed. If not provided, output files will be saved to the current Ballerina project. |
| `-p, --port <port-name>` | (Optional) The name of the port that defines the service endpoint. If specified, a client will be generated only for this port. Otherwise, clients for all available ports will be generated. |

For example,

```bash
$ bal wsdl hello.wsdl --operations http://hello.org/action --module custom
```

This generates a Ballerina SOAP client stub (`client.bal`), and record types (`types.bal`) for the `hello.wsdl` WSDL specification. It is mandatory to run the above command within a Ballerina package.

Upon successful execution, following files will be created in the `custom` directory within the Ballerina project.

```bash
-- client.bal (There can be multiple client files depends on the WSDL file)
-- types.bal
```

## Examples

### Generate a Ballerina client and types from a WSDL file

This command generates a Ballerina client and record types for all operations in `calculator.wsdl` and saves them in the current Ballerina project.

```bash
$ bal wsdl calculator.wsdl
```

### Generate a Ballerina client and types for a specific module

This command saves the generated client and record types in the `temp` module within the Ballerina project.

```bash
$ bal wsdl calculator.wsdl --module temp
```

### Generate a Ballerina client for specific operations

This command generates a client only for the specified operation and saves it in the `temp` module.

```bash
$ bal wsdl calculator.wsdl --operations http://example-operation-action-uri/path -m temp
```

### Generate a Ballerina client for a specific port

This command generates a client only for the `SamplePortName` port in the WSDL file.

```bash
$ bal wsdl calculator.wsdl --port SamplePortName
```
