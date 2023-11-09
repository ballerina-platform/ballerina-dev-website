---
layout: ballerina-edi-support-left-nav-pages-swanlake
title: EDI tool
description: The EDI tool provides the below set of command line tools to work with EDI files in Ballerina.
keywords: ballerina, programming language, edi, contract
permalink: /learn/edi-tool/
active: edi-tool
intro: The EDI tool provides the below set of command line tools to work with EDI files in Ballerina.
--- 

## Usage

The tool supports two main usages as follows.

- **Code generation:** Generate Ballerina records and parsing functions for a given EDI schema
- **Package generation:** Generate Ballerina records, parsing functions, utility methods, and a REST connector for a given collection of EDI schemas, and also organize those as a Ballerina package

The functionalities of the above usages are described below.

### Code generation usage

The below command generates all Ballerina records and parsing functions required for working with data in the given EDI schema and writes those into the file specified in the output path.

```
$ bal edi codegen <edi-schema-path> <output-path>
```

The generated parsing function (i.e., `fromEdiString(...)`) can read EDI text files into generated records, which can be accessed from the Ballerina code, similar to accessing any other Ballerina record. Similarly, the generated serialization function (i.e., `toEdiString(...)`) can serialize generated Ballerina records into EDI text.

### Package generation usage

Usually, organizations have to work with many EDI formats, and integration developers need to have a convenient way to work on EDI data with minimum effort. The Ballerina EDI package facilitates this by allowing organizations to pack all EDI processing codes of their EDI collections into an importable package. Therefore, integration developers can simply import the package and convert EDI messages into Ballerina records in a single line of code.

The below command can be used to generate the EDI package.

```
$ bal edi libgen -O <org-name> -n <package-name> -s <edi-schema-folder> -o <output-folder>
```

A Ballerina package project will be generated in the output folder. This package can be built and published by issuing the `bal pack` and `bal push` commands from the output folder. Then, the generated package can be imported into any Ballerina project, and the generated utility functions of the package can be invoked to parse EDI messages into Ballerina records.

## Command options 

The command options that are available with the tool are listed below.

### Code generation command options

| Command option      | Description                                                                                                                                                                                                                                                                                                                                                                     | Mandatory/Optional |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| `EDI schema path`     | Path of the EDI schema which will be used to generate the code.                                                                                                                                                                                                      | Mandatory          |
| `output path`   | The path in which the output file will be created.                                                                                                                                                                                                   | Mandatory           |

### Package generation command options

| Command option     | Description                                                                                                                                                                                                                                                                                                                                                                     | Mandatory/Optional |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| `-O, --org`     | Organization of the package.                                                                                                                                                                                                    | Mandatory          |
| `-n, --name`   | Name of the package.                                                                                                                                                                                                                   | Mandatory          |
| `-s, --schema`     | Location of the EDI schema.                                                                                                                                                                                                      | Mandatory          |
| `-o, --output`   | Location of the generated package.                                                                                                                                                                                                                    | Mandatory           |

## Install the tool

Execute the command below to pull the EDI tool from Ballerina Central.

```
$ bal tool pull edi
ballerina/editoolspackage:0.8.4 pulled from central successfully
tool 'edi:0.8.4' pulled successfully.
tool 'edi:0.8.4' successfully set as the active version.
```

## Example

Examples of the above usages are described below.

### Code generation example

Follow the steps below to try out an example of generating Ballerina code from an EDI schema file.

#### Clone the sample project

Clone the [artifacts of the example](https://github.com/ballerina-guides/integration-samples/tree/main/edi_code_generation) and extract them to a preferred location.

>**Info:** The cloned directory includes the artifacts that will be required to try out this example. The `schemas` folder includes the schema file, which can be used to parse EDI documents with one HDR segment (mapped to `header`) and any number of ITM segments (mapped to `items`). The HDR segment contains three fields, which are mapped to `orderId`, `organization`, and `date`. Each ITM segment contains two fields mapped to `item` and `quantity`. Also, the `edi_read.bal` and `edi_write.bal`files include the business logic/usage of the package.

#### Generate the code

Follow the steps below to generate Ballerina records for the above EDI schema.

1. Navigate to the cloned `edi_code_generation` directory.

2. Run the tool with the [required arguments](#command-options) to generate the package.

    ```
    $ bal edi codegen -s hmartOrder/schemas/edi-schema.json -o hmartOrder/modules/hmartOrder/orderRecords.bal
    ```

>**Info:** The generated Ballerina records will be saved in a file named `orderRecords.bal` inside the `<edi_code_generation>/modules/hmartOrder/` directory. The Ballerina records generated for the above schema in the `orderRecords.bal` file are shown below.

```ballerina
type Header_Type record {|
    string code?;
    string orderId?;
    string organization?;
    string date?;
|};

type Items_Type record {|
    string code?;
    string item?;
    int quantity?;
|};

type SimpleOrder record {|
    Header_Type header;
    Items_Type[] items?;
|};
```

#### Use the generated package

Follow the steps below to use the generated `fromEdiString` function to read EDI text files into the generated Ballerina record.

##### Read from EDI files

1. Navigate to the cloned `edi_code_generation/hmartOrder` directory.

2. Run the `read_edi.bal` file.

    >**Note:** Any data item in the EDI (`edi-sample`.edi file) can be accessed using the record's fields.

       ```
    $ bal run read_edi.bal
    Compiling source
            edi_code_generation/hmartOrder:1.0.0

    Running executable
    ```

    You can view the response shown below.

    ```
    ```

##### Write to EDI files

Follow the steps below use the generated `toEdiString` function to serialize the `SimpleOrder` records into EDI text.

1. Navigate to the cloned `edi_code_generation/hmartOrder` directory.

2. Run the `write_edi.bal` file. 

    >**Info:** This shows how to 

    Below is the EDI document generated as the output of the above Ballerina code that can be parsed using the above schema.

    ```
    HDRORDER_200HMart17-05-2023~
    ITMA68015~
    ITMA5302~
    ITMA500*4~
    ```

### Package generation example

Follow the steps below to try out an example package generation use case of the EDI tool.

#### Clone the sample project

Clone the [artifacts of the example](https://github.com/ballerina-guides/integration-samples/edi_package_generation/) and extract them to a preferred location.

>**Info:** The cloned directory includes the artifacts that will be required to try out this example. The `schemas` folder includes the JSON schema source file of the `EDIFACT` specifications required for an organization (`CityMart`) to work with the `ORDERS`operations for handling purchase orders. Also, the `main.bal` file includes the business logic/usage of the package.

#### Generate the package

Follow the steps below to run the EDI tool and create the Ballerina package.

1. Navigate to the `edi_package_generation` directory.

2. Run the tool with the [required arguments](#command-options) to generate the package.

    >**Note:** This example uses the EDI schema files of the [`edi_package_generation` example](https://github.com/ballerina-guides/integration-samples/edi_package_generation/) to generate the package.


    ```
    $ bal edi libgen -O citymart -n porder -s CityMart/schemas -o CityMart/lib
    ```

    The generated Ballerina package will be, as shown below.

    >**Info:** The code for each EDI schema is generated into a separate module to prevent possible conflicts.

3. Build the generated package.

    ```
    $ cd edi_package_generation
    $ bal pack
    ```

4. Push it to a repository.

    >**Tip:** You can push either to the local repository or the remote repository in Ballerina Central.

    ```````
    $ bal push --repository local
    ````

#### Use the generated package

It is quite common for different trading partners to use variations of the standard EDI formats. In such cases, it is possible to create partner-specific schemas and generate a partner-specific Ballerina package for processing interactions with a particular partner.

Follow the steps below to use the generated package by running the cloned Ballerina project.

>**Info:** Now, any Ballerina project can import this package and use it to work with the EDI files related to purchase orders. An example of using this package for reading an `ORDERS` file is shown below. 

1. Navigate to the `edi_package-generation` directory.

    >**Info:** You can change the dependency (name and version) of the generated package in the `Ballerina.toml` file of this cloned Ballerina project directory as preferred.

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
    curl --location 'http://localhost:8090' \
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

The above REST call will return a JSON response, as shown below.

```json
{"buyerName":"WALMARTUS","date":"20230719","productIdentifier":"PRD1234567890","productQty":10}
```

#### Use the generated EDI package as a standalone REST service

The EDI package generated above can also be compiled into a JAR file (using the `bal build` command) and executed as a standalone Ballerina service that processes EDI files via a REST interface. This is useful for microservices environments where the EDI processing functionality can be deployed as a separate microservice.

For example, the `citymart` package generated above can be built and executed as a JAR file. Once executed, it will expose a REST service to work with the `ORDERS` files. 
