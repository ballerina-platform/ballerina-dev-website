---
layout: ballerina-edi-support-left-nav-pages-swanlake
title: EDI tool
description: The EDI tool provides the below set of command line tools to work with EDI files in Ballerina.
keywords: ballerina, programming language, edi, contract, text, JSON
permalink: /learn/edi-tool/
active: edi-tool
intro: The EDI tool provides the below set of command line tools to work with EDI files in Ballerina.
--- 

## Install the tool

Execute the command below to pull the EDI tool from [Ballerina Central](https://central.ballerina.io/ballerina/edi/latest).

```
$ bal tool pull edi
ballerina/editoolspackage:0.8.5 pulled from central successfully
tool 'edi:0.8.5' pulled successfully.
tool 'edi:0.8.5' successfully set as the active version.
```

## Usage

The tool supports two main usages as follows.

- [**Code generation:**](#code-generation) Generate Ballerina records and parsing functions for a given EDI schema
- [**Package generation:**](#package-generation) Generate Ballerina records, parsing functions, utility methods, and a REST connector for a given collection of EDI schemas, and also organize those as a Ballerina package

## Code generation

The sections below describe the code generation functionality in detail.

### Code generation usage

The command below generates all Ballerina records and parsing functions required for working with data in the given EDI schema and writes those into the file specified in the output path.

```
$ bal edi codegen <edi-schema-path> <output-path>
```

The generated parsing function (i.e., `fromEdiString(...)`) can read EDI text files into generated records, which can be accessed from the Ballerina code, similar to accessing any other Ballerina record. Similarly, the generated serialization function (i.e., `toEdiString(...)`) can serialize generated Ballerina records into EDI text.

### Code generation command options

| Command option      | Description                                                                                                                                                                                                                                                                                                                                                                     | Mandatory/Optional |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| `<edi-schema-path>`     | Path of the EDI schema, which will be used to generate the code.                                                                                                                                                                                                      | Mandatory          |
| `<output-path>`   | The path in which the output file will be created.                                                                                                                                                                                                   | Mandatory           |

### Code generation example

Follow the steps below to try out an example of generating Ballerina code from an EDI schema file.

#### Clone the example project

Clone the [artifacts of the example](https://github.com/ballerina-guides/integration-samples/tree/main/edi-code-generation) and extract them to a preferred location.

The cloned directory includes the artifacts below that will be required to try out this example. 

- The `schemas` folder: includes the schema file ([`schemas/edi-schema.json`](https://github.com/ballerina-guides/integration-samples/tree/main/edi-code-generation/schemas/edi-schema.json)), which can be used to parse EDI documents with one HDR segment (mapped to `header`) and any number of ITM segments (mapped to `items`). The HDR segment contains three fields, which are mapped to `orderId`, `organization`, and `date`. Each ITM segment contains two fields mapped to `item` and `quantity`. 
- The [`main.bal`](https://github.com/ballerina-guides/integration-samples/tree/main/edi-code-generation/main.bal) file: includes the business logic/usage of the code.
- The [`resources/edi-sample.edi`](https://github.com/ballerina-guides/integration-samples/tree/main/edi-code-generation/resources/edi-sample.edi) file: includes the EDI message to be read from the generated code.

#### Generate the code

Follow the steps below to generate Ballerina records for the above EDI schema.

1. Navigate to the cloned `edi-code-generation` directory.

2. Run the tool with the [required command options](#code-generation-command-options) to generate the package.

    ```
    $ bal edi codegen -s schemas/edi-schema.json -o orderRecords.bal
    Generating code for schemas/edi-schema.json...
    ```

    >**Info:** The Ballerina records below will be generated and saved in a file named `orderRecords.bal`. 

    ```ballerina
    public type Header_Type record {|
        string code = "HDR";
        string orderId?;
        string organization?;
        string date?;
    |};

    public type Items_Type record {|
        string code = "ITM";
        string item?;
        int? quantity?;
    |};

    public type SimpleOrder record {|
        Header_Type? header?;
        Items_Type[] items = [];
    |};
    ```

#### Use the generated code

Follow the steps below to use the generated `fromEdiString` function to read EDI text files from the generated Ballerina records.

##### Read from EDI files

1. Navigate to the cloned `edi-code-generation` directory.

2. Execute the command below to run the `read_edi()` function.

    >**Info:** Any data item in the EDI text (`edi-sample.edi` file) can be accessed using the record's fields.

    ```
    $ bal run -- read
    ```

    You can view the response shown below.

    ```
    Order date: 2008-01-01
    ```

##### Write to EDI files

Follow the steps below to use the generated `toEdiString` function to serialize the `SimpleOrder` records into EDI text.

1. Navigate to the cloned `edi-code-generation` directory.

2. Execute the command below to run the `write_edi()` function. 

    ```
    $ bal run -- write
    ```

    Below is the EDI document generated as the output of the Ballerina code that can be parsed using the provided schema.

    ```
    EDI message: 
    HDR*ORDER_200*HMart*17-05-2023~
    ITM*A680*15~
    ITM*A530*2~
    ITM*A500*4~
    ```

## Package generation

The sections below describe the package generation functionality in detail.

### Package generation usage

Usually, organizations have to work with many EDI formats, and integration developers need to have a convenient way to work on EDI data with minimum effort. The Ballerina EDI package facilitates this by allowing organizations to pack all EDI processing codes of their EDI collections into an importable package. Therefore, integration developers can simply import the package and convert EDI messages into Ballerina records in a single line of code.

The command below can be used to generate the EDI package.

```
$ bal edi libgen -O <org-name> -n <package-name> -s <edi-schema-path> -o <output-path>
```

A Ballerina package will be generated in the output folder. This package can be built and published by issuing the `bal pack` and `bal push` commands from the output folder. Then, the generated package can be imported into any Ballerina project, and the generated utility functions of the package can be invoked to parse EDI messages into Ballerina records.

### Package generation command options

| Command option     | Description                                                                                                                                                                                                                                                                                                                                                                     | Mandatory/Optional |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| `-O, --org`     | Organization of the package.                                                                                                                                                                                                    | Mandatory          |
| `-n, --name`   | Name of the package.                                                                                                                                                                                                                   | Mandatory          |
| `-s, --schema`     | Location of the EDI schema.                                                                                                                                                                                                      | Mandatory          |
| `-o, --output`   | Location of the generated package.                                                                                                                                                                                                                    | Mandatory           |

### Package generation example

Below is an example of using the EDI tool to create an EDI package and use it.

#### Clone the example project

Clone the [artifacts of the example](https://github.com/ballerina-guides/integration-samples/tree/main/edi-package-generation) and extract them to a preferred location.

The cloned directory includes the artifacts below that will be required to try out this example. 

- The [`schemas`](https://github.com/ballerina-guides/integration-samples/tree/main/edi-package-generation/schemas) directory: includes the JSON schema source files of the `EDIFACT` specifications required for an organization to work with the EDI operations for handling purchase orders. 
- The [`edi_service/service.bal`](https://github.com/ballerina-guides/integration-samples/tree/main/edi-package-generation/edi_service/service.bal) file: includes the business logic/usage of the package.

#### Generate the package

Follow the steps below to run the EDI tool and create the package.

1. Navigate to the `edi-package-generation` directory.

2. Execute the `libgen` command below to generate a Ballerina package.

    ```
    $ bal edi libgen -O citymart -n porder -s schemas -o lib
    Generating library package for citymart - porder : schemas
    ```

    >**Info:** The generated package (`lib/porder`) will be as shown below. The code for each EDI schema is generated into a separate module to prevent possible conflicts.
    
    ```
    edi-package-generation
    ├── example
    │   ├── Ballerina.toml
    │   └── service.bal
    ├── lib
    │   └── porder
    │       ├── Ballerina.toml
    │       ├── Module.md
    │       ├── Package.md
    │       ├── modules
    │       │   ├── mGENRAL
    │       │   │   ├── G_GENRAL.bal
    │       │   │   └── transformer.bal
    │       │   ├── mINVOIC
    │       │   │   ├── G_INVOIC.bal
    │       │   │   └── transformer.bal
    │       │   └── mORDERS
    │       │       ├── G_ORDERS.bal
    │       │       └── transformer.bal
    │       ├── porder.bal
    │       └── rest_connector.bal
    └── schemas
        ├── GENRAL.json
        ├── INVOIC.json
        └── ORDERS.json
    ```

3. Navigate to the generated `lib/porder` package.

    ```
    $ cd lib/porder
    ```

4. Build the generated package.

    ```
    $ bal pack
    Compiling source
        citymart/porder:0.1.0

    Creating bala
        target/bala/citymart-porder-any-0.1.0.bala
    ```

5. Push it to a repository.

    >**Tip:** You can push either to the local repository or to [Ballerina Central](https://central.ballerina.io/), which is a remote repository. Then, any Ballerina project can import this package and use it to work with the EDI files related to purchase orders.

    ```
    $ bal push --repository local
    Successfully pushed target/bala/citymart-porder-any-0.1.0.bala to 'local' repository.
    ```

#### Use the generated package

Follow the steps below to use the generated package by running the cloned Ballerina project.

>**Info:** It is quite common for different trading partners to use variations of the standard EDI formats. In such cases, it is possible to create partner-specific schemas and generate a partner-specific Ballerina package for processing interactions with a particular partner.

1. Navigate to the `edi-package-generation/edi_service` directory.

    >**Info:** You can change the dependency (name and version) of the generated package in the `lib/porder/Ballerina.toml` file of the generated package as preferred.

2. Run the cloned Ballerina project and validate the output.

    ```
    $ bal run
    Compiling source
            integration_samples/edi_package-generation:1.0.0

    Running executable
    ```

3. Invoke the API to try it out.

    >**Info:** You can convert EDI text to JSON using a cURL command, as shown below. 

    ```
    curl --location 'http://localhost:8090/getEDI' \
    --header 'Content-Type: text/plain' \
    --data 'BGM+380+4467862+9'\''
    DTM+137:20230719:102'\''
    RFF+ON:123456'\''
    NAD+BY+WALMARTUS::92++WALMART US'\''
    NAD+SU+GLAXOSMITHK::92++GLAXOSMITHK'\''
    LIN+1++PRD1234567890:EN'\''
    QTY+47:10:PCE'\''
    MOA+203:150'\''
    ALC+C+AAB'\''
    MOA+8:15'\''
    TAX+7+VAT+++:::20'\''
    MOA+124:30'\''
    UNS+S'\''
    MOA+77:195'\'''
    ```

    The above REST call will return the JSON response below.

    ```json
    {"buyerName":"WALMARTUS","date":"20230719","productIdentifier":"PRD1234567890","productQty":10}
    ```

##### Use the package as a service

The EDI package generated above can also be compiled into a JAR file (using the `bal build` command) and executed as a standalone Ballerina REST service that processes EDI files via a REST interface. This is useful for microservices environments where the EDI processing functionality can be deployed as a separate microservice.

For example, the `citymart` package generated above can be built and executed as a JAR file. Once executed, it will expose a REST service to work with the EDI files. 
