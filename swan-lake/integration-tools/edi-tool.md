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
```

## Usage

The tool supports three main usages, as follows:

- [**Schema conversion**](#schema-conversion): Convert an EDIFACT, X12, or ESL schema to the Ballerina EDI schema format.
- [**Code generation**](#code-generation): Generate Ballerina records and parser functions for a given EDI schema.
- [**Package generation**](#package-generation): Generate Ballerina records, parser functions, utility methods, and a REST connector for a given collection of EDI schemas, and organize those as a Ballerina package.

The generated code uses the [`ballerina/edi`](https://central.ballerina.io/ballerina/edi/latest) library at runtime.

> **Note:** For common UN/EDIFACT D03A message types, prebuilt packages are published under the `ballerinax` organization — `edifact.d03a.supplychain`, `edifact.d03a.finance`, `edifact.d03a.logistics`, `edifact.d03a.retail`, `edifact.d03a.shipping`, `edifact.d03a.services`, and `edifact.d03a.manufacturing`. Each message type is a submodule exposing `fromEdiString` and `toEdiString`, so no code has to be generated. Generate your own only when the message type is not covered, or when a trading partner deviates from the standard.

## Schema conversion

Rather than writing a Ballerina EDI schema by hand, convert the standard's own specification into it.

### EDIFACT schema to the Ballerina EDI schema

EDIFACT, which stands for Electronic Data Interchange For Administration, Commerce, and Transport, is an international EDI standard developed by the United Nations. It is widely used in Europe and many other parts of the world, with message types such as `ORDERS`, `INVOIC`, and `DESADV`.

Download the release archive for the required version from the [UN/EDIFACT directory downloads](https://unece.org/trade/uncefact/unedifact/download) and pass it with `-i`. The archive can be passed as downloaded, or as a directory it was extracted to.

```
$ bal edi convertEdifactSchema -v <EDIFACT version> -t <EDIFACT message type> -i <downloaded archive> -o <output folder>
```

#### `convertEdifactSchema` command options

| Command option  | Description                                                                                            | Mandatory/Optional |
|-----------------|--------------------------------------------------------------------------------------------------------|--------------------|
| `-v, --version` | EDIFACT version (e.g. `d03a`).                                                                         | Mandatory          |
| `-t, --type`    | EDIFACT message type (e.g. `ORDERS`). Omit it to convert every message type in the directory.          | Optional           |
| `-i, --input`   | Path to the downloaded UN/EDIFACT directory archive, or to a directory it was extracted to.            | Mandatory          |
| `-o, --output`  | Path to the folder where the schemas will be generated, one `<message-type>.json` per message type.    | Mandatory          |

Example:
```
$ bal edi convertEdifactSchema -v d03a -t ORDERS -i d03a.zip -o resources
```

The schema is written to `resources/ORDERS.json`, named after the message type.

### X12 schema to the Ballerina EDI schema

X12, short for ANSI ASC X12, is a standard for electronic data interchange in the United States. It defines the structure and format of business documents such as `purchase orders`, `invoices`, and `shipping notices`, and covers a wide range of industries, including healthcare, finance, retail, and manufacturing.

X12 message specifications are licensed from ASC X12, so the conversion starts from the schema you are licensed to use:

``` 
$ bal edi convertX12Schema -i <input schema path> -o <output json file/folder path> -H <enable headers mode> -c <enable collection mode> -d <segment details path>
```

#### `convertX12Schema` command options

| Command option     | Description                                                                                     | Mandatory/Optional |
|--------------------|-------------------------------------------------------------------------------------------------|--------------------|
| `-i, --input`      | Path to the X12 schema file.                                                                    | Mandatory          |
| `-o, --output`     | Path to the output file or folder.                                                              | Mandatory          |
| `-H, --headers`    | Enable headers mode, for a schema that separates the interchange and group headers from the transaction set body. The converted schema then carries the envelope, and the generated code carries the envelope-aware functions. | Optional           |
| `-c, --collection` | Enable collection mode, to treat the input as a collection of related schemas rather than a single transaction set. | Optional           |
| `-d, --segdet`     | Path to the segment details file, for a schema that keeps its segment definitions separately.    | Optional           |

Example:
```
$ bal edi convertX12Schema -i input/850.xsd -o resources/850-schema.json
```

### ESL to the Ballerina EDI schema

ESL, or EDI Schema Language, describes the structure of an EDI message in YAML, alongside a base file holding the shared segment definitions. Both inputs are required.

```
$ bal edi convertESL -b <segment definitions file path> -i <input ESL schema file/folder> -o <output file/folder>
```

#### `convertESL` command options

| Command option   | Description                                                     | Mandatory/Optional |
|------------------|-----------------------------------------------------------------|--------------------|
| `-b, --basedef`  | Path to the segment definitions file for ESL schema conversion. | Mandatory          |
| `-i, --input`    | Path to the ESL schema file or folder.                          | Mandatory          |
| `-o, --output`   | Path to the output file or folder.                              | Mandatory          |
 
Example:
```
$ bal edi convertESL -b segment_definitions.yaml -i esl_schema.esl -o resources/schema.json
```

### Writing a schema by hand

A proprietary or non-standard format is described directly in the Ballerina EDI schema format and passed to `codegen` without a conversion step. The [Ballerina EDI specification](https://ballerina.io/spec/edi/#7-schema-definition) defines the full grammar — delimiters, segments and segment groups, fields, components, sub-components, the `envelope` declaration, and the additional configuration options.

As an illustrative example, consider the following schema definition for a `simple order`, assumed to be stored as `schema.json`:

```json
{
    "name": "SimpleOrder",
    "delimiters" : {"segment" : "~", "field" : "*", "component": ":", "repetition": "^"},
    "segments" : [
        {
            "code": "HDR",
            "tag" : "header",
            "minOccurances": 1,
            "fields" : [{"tag": "code"}, {"tag" : "orderId"}, {"tag" : "organization"}, {"tag" : "date"}]
        },
        {
            "code": "ITM",
            "tag" : "items",
            "maxOccurances" : -1,
            "fields" : [{"tag": "code"}, {"tag" : "item"}, {"tag" : "quantity", "dataType" : "int"}]
        }
    ]
}
```

This schema parses EDI documents with one HDR segment, mapped to the `header`, and any number of ITM segments, mapped to `items`. Below is an example of a document it parses, assumed to be stored as `sample.edi`:

```
HDR*ORDER_1201*ABC_Store*2008-01-01~
ITM*A-250*12~
ITM*A-45*100~
ITM*D-10*58~
ITM*K-80*250~
ITM*T-46*28~
```

## Code generation

The below command generates the Ballerina records and parser functions for a given EDI schema, and writes them into the given output file.

```
$ bal edi codegen -i <input schema path> -o <output path>
```

The generated `fromEdiString` function reads EDI text into the generated records, which are accessed like any other Ballerina record. The generated `toEdiString` function serializes those records back into EDI text.

### `codegen` command options

| Command option  | Description                  | Mandatory/Optional |
|-----------------|------------------------------|--------------------|
| `-i, --input`   | Path to the EDI schema file. | Mandatory          |
| `-o, --output`  | Path to the output file.     | Mandatory          |

### Code generation example

Create a new Ballerina package and generate the code into its default module:

```
$ bal new sample
$ cd sample
$ bal edi codegen -i resources/schema.json -o orders.bal
```

At this point, the directory structure of the package looks like below:

```
.
├── Ballerina.toml
├── Dependencies.toml
├── main.bal
├── orders.bal
└── resources
    ├── sample.edi
    └── schema.json
```

For a larger project, the generated EDI code can live in its own package within a Ballerina workspace, alongside the integration that consumes it. Keeping the code for each schema in its own module or package avoids conflicts between the records of different schemas.

Generated Ballerina records for the above schema are shown below:

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
   Header_Type header;
   Items_Type[] items = [];
|};
```

#### Reading EDI files

The generated `fromEdiString` function reads EDI text into the generated Ballerina record. Any data item in the EDI is then accessed through the record's fields:

```ballerina
import ballerina/io;

public function main() returns error? {
    string ediText = check io:fileReadString("resources/sample.edi");
    SimpleOrder sampleOrder = check fromEdiString(ediText);
    io:println(sampleOrder.header.date);
}
```

#### Writing EDI files

The generated `toEdiString` function serializes a `SimpleOrder` record into EDI text:

```ballerina
import ballerina/io;

public function main() returns error? {
    SimpleOrder simpleOrder = {header: {code: "HDR", orderId: "ORDER_200", organization: "ABC_Store", date: "17-05-2024"}};
    simpleOrder.items.push({code: "ITM", item: "A680", quantity: 15});
    simpleOrder.items.push({code: "ITM", item: "A530", quantity: 2});
    simpleOrder.items.push({code: "ITM", item: "A500", quantity: 4});
    string ediText = check toEdiString(simpleOrder);
    io:println(ediText);
}
```

#### Reading and writing EDI envelopes

An EDI interchange is wrapped in an **envelope**: interchange headers and trailers, functional group headers and trailers in X12, and one or more transactions inside them. When the schema declares an `envelope` — which it does when it comes from an EDIFACT specification, or from an X12 specification converted with `-H` — `codegen` also generates the envelope wrappers and the envelope-aware functions:

- `<Name>Interchange`, `<Name>FunctionalGroup` (X12), and `<Name>Transaction` records mirroring the envelope hierarchy. `<Name>Transaction.body` is typed `<Name>|error`, so a malformed transaction body is captured on that transaction instead of failing the whole parse.
- `headersFromEdiString` — reads only the envelope headers, which is enough to route a document.
- `interchangeFromEdiString` — reads the full interchange into a typed `<Name>Interchange`.
- `interchangeToEdiString` — writes a `<Name>Interchange` back to EDI text, recomputing the envelope counts.

```ballerina
import ballerina/io;

public function main() returns error? {
    string ediText = check io:fileReadString("resources/order.edi");

    // Read the full envelope hierarchy into typed records.
    ORDERSInterchange interchange = check interchangeFromEdiString(ediText);
    foreach var txn in interchange.transactions {
        if txn.body is error {
            io:println("Quarantined: ", txn.body.message());
            continue;
        }
        io:println(txn.body);
    }

    // Write a filtered or transformed interchange back to EDI text.
    string ediOut = check interchangeToEdiString(interchange);
    io:println(ediOut);
}
```

The envelope wrappers require `ballerina/edi` 1.6.0 or later. For envelope-aware schemas, `libgen` pins that floor in the generated package's `Ballerina.toml`.

For the envelope semantics — how counts are recomputed, how trailers are located, and how a UNA service string advice is handled — see the [Ballerina EDI specification](https://ballerina.io/spec/edi/#6-envelope-processing).

## Package generation

Usually, organizations have to work with many EDI formats, and integration developers need a convenient way to work with EDI data with minimum effort. Ballerina EDI libraries facilitate this by allowing organizations to pack all the EDI processing code for their EDI collections into an importable package. Integration developers can then simply import those libraries and convert EDI messages into Ballerina records in a single line of code.

The below command generates Ballerina records, parser and util functions, and a REST connector for a given collection of EDI schemas, organized into a Ballerina package:

```
$ bal edi libgen -p <organization-name/package-name> -i <input schema folder> -o <output folder>
```

The Ballerina package is generated in the output folder. It is built and published with the `bal pack` and `bal push` commands issued from that folder. The generated package can then be imported into any Ballerina project, and its utility functions invoked to parse EDI messages into Ballerina records.

### `libgen` command options

| Command option  | Description                                           | Mandatory/Optional |
|-----------------|-------------------------------------------------------|--------------------|
| `-p, --package` | Package name (organization-name/package-name).        | Mandatory          |
| `-i, --input`   | Path to the folder containing EDI schemas.            | Mandatory          |
| `-o, --output`  | Path to the folder where libraries will be generated. | Mandatory          |

### Package generation example

Let's assume that an organization named "CityMart" needs to work with X12 850, 810, 820, and 855 to handle purchase orders. CityMart's integration developers can put the schemas of those X12 specifications into a folder as follows:

```
|-- CityMart
    |--lib
    |--schemas
       |--850.json
       |--810.json
       |--820.json
       |--855.json
```

Then, the `libgen` command can be used to generate a Ballerina package as shown below:

```
$ bal edi libgen -p citymart/porder -i CityMart/schemas -o CityMart/lib
```

The generated Ballerina package will look like below:

```
|-- CityMart
    |--lib  
    |--porder
    |     |--modules
    |	  |   |--m850
    |	  |	  |  |--G_850.bal
    |     |   |  |--transformer.bal
    |	  |	  |--m810
    |	  |	  |  |--G_810.bal
    |     |   |  |--transformer.bal
    |	  |	  |--m820
    |	  |	  |  |--G_820.bal
    |     |   |  |--transformer.bal
    |	  |	  |--m855
    |	  |	    |--G_855.bal
    |     |     |--transformer.bal
    |	  |--Ballerina.toml
    |	  |--Module.md
    |	  |--Package.md
    |	  |--porder.bal
    |	  |--rest_connector.bal
    |
    |--schemas
       |--850.json
       |--810.json
       |--820.json
       |--855.json
```

As seen in the above project structure, the code for each EDI schema is generated into a separate module, to prevent possible conflicts. The package is built with the `bal pack` command and published to the central repository with the `bal push` command. Any Ballerina project can then import this package and use it to work with purchase order-related EDI files. An example of using this package for reading an 850 file and writing an 855 file is shown below:

```ballerina
import ballerina/io;
import citymart/porder.m850;
import citymart/porder.m855;

public function main() returns error? {
    string orderText = check io:fileReadString("orders/d15_05_2023/order10.edi");
    m850:Purchase_Order purchaseOrder = check m850:fromEdiString(orderText);
    ...
    m855:Purchase_Order_Acknowledgement orderAck = {...};
    string orderAckText = check m855:toEdiString(orderAck);
    check io:fileWriteString("acks/d15_05_2023/ack10.edi", orderAckText);
}
```

It is quite common for different trading partners to use variations of standard EDI formats. In such cases, it is possible to create partner-specific schemas and generate a partner-specific Ballerina package for processing interactions with the particular partner.

### Dispatching by EDI name

The default module of a generated package offers a facade over every schema in the package — `fromEdiString(ediText, ediName)` and `toEdiString(data, ediName)` — which is useful when the EDI type is only known at runtime. When at least one schema declares an envelope, the facade also covers the envelope functions:

```ballerina
import ballerina/io;
import citymart/porder;
import citymart/porder.m850;

public function main() returns error? {
    string orderText = check io:fileReadString("orders/order10.edi");

    // Route on the envelope headers without parsing the transaction bodies.
    anydata headers = check porder:headersFromEdiString(orderText, porder:EDI_850);

    any interchange = check porder:interchangeFromEdiString(orderText, porder:EDI_850);
    m850:Purchase_OrderInterchange typed = check interchange.ensureType();
    io:println(typed.groups.length());
}
```

Because the facade is keyed by name, it returns the module's typed record boxed in `anydata` for headers and `any` for interchanges; narrow it with `ensureType` as above. Interchanges are `any` rather than `anydata` because `<Name>Transaction.body` is `<Name>|error`, and a value holding an error is not `anydata`. Call `hasEnvelope(ediName)` to test whether a given EDI type supports these functions — for a schema without an envelope, they return an error.

### Using generated EDI libraries as standalone REST services

EDI libraries generated in the previous step can also be compiled into a jar file (using the `bal build` command) and executed (using the `bal run` command) as a standalone Ballerina service that processes EDI files via a REST interface. This is useful for microservice environments where the EDI processing functionality can be deployed as a separate microservice.

For example, the "citymart" package generated in the above step can be built and executed as a jar file. Once executed, it will expose a REST service to work with X12 850, 810, 820, and 855 files. Each schema gets an EDI-to-JSON endpoint under `edis` and a JSON-to-EDI endpoint under `objects`.

#### Converting of X12 850 EDI text to JSON using the REST service

The below REST call can be used to convert an X12 850 EDI text to JSON using the REST service generated from the "citymart" package:

```
curl --location 'http://localhost:9090/porderParser/edis/850' \
--header 'Content-Type: text/plain' \
--data-raw 'GS*PO*SENDERID*RECEIVERID*20240802*1705*1*X*004010~
ST*850*0001~
BEG*00*NE*4500012345**20240802~
REF*DP*038~
PER*BD*John Doe*TE*1234567890*EM*john.doe@example.com~
FOB*CC~
ITD*01*3*2**30**31~
DTM*002*20240902~
N1*ST*SHIP TO NAME*92*SHIP TO CODE~
N3*123 SHIP TO ADDRESS~
N4*CITY*STATE*12345*US~
PO1*1*10*EA*15.00**BP*123456789012*VP*9876543210*UP*123456789012~
PID*F****PRODUCT DESCRIPTION~
PO4*1*CA*20*LB~
CTT*1~
SE*16*0001~
GE*1*1~
IEA*1*000000001~'
```

The above REST call will return a JSON response like the below:

```
{
    "X12_FunctionalGroup": {
        "FunctionalGroupHeader": {
            "code": "GS",
            "GS01__FunctionalIdentifierCode": "PO",
            "GS02__ApplicationSendersCode": "SENDERID",
            "GS03__ApplicationReceiversCode": "RECEIVERID",
            ... // Other fields
        }
        ... // Other fields
    },
    "InterchangeControlTrailer": {
        "code": "IEA",
        "IEA01__NumberofIncludedFunctionalGroups": 1.0,
        "IEA02__InterchangeControlNumber": 1.0
    }
}
```

#### Converting of JSON to X12 850 EDI text using the REST service

The below REST call can be used to convert a JSON to X12 850 EDI text using the REST service generated from the "citymart" package:

```
curl --location 'http://localhost:9090/porderParser/objects/850' \
--header 'Content-Type: application/json' \
--data-raw '{
    "X12_FunctionalGroup": {
        "FunctionalGroupHeader": {
            "code": "GS",
            "GS01__FunctionalIdentifierCode": "PO",
            "GS02__ApplicationSendersCode": "SENDERID",
            "GS03__ApplicationReceiversCode": "RECEIVERID",
            "GS04__Date": "20240802",
            "GS05__Time": "1705",
            "GS06__GroupControlNumber": 1.0,
            ... // Other fields
        },
        ... // Other fields
    },
    "InterchangeControlTrailer": {
        "code": "IEA",
        "IEA01__NumberofIncludedFunctionalGroups": 1.0,
        "IEA02__InterchangeControlNumber": 1.0
    }
}'
```

The above REST call will return an X12 850 EDI text response like the below:

```
GS*PO*SENDERID*RECEIVERID*20240802*1705*1*X*004010~
ST*850*0001~
BEG*00*NE*4500012345**20240802~
REF*DP*038~
PER*BD*John Doe*TE*1234567890*EM*john.doe@example.com~
FOB*CC~
ITD*01*3*2**30**31~
DTM*002*20240902~
N1*ST*SHIP TO NAME*92*SHIP TO CODE~
N3*123 SHIP TO ADDRESS~
N4*CITY*STATE*12345*US~
PO1*1*10*EA*15.00**BP*123456789012*VP*9876543210*UP*123456789012~
PID*F****PRODUCT DESCRIPTION~
PO4*1*CA*20*LB~
CTT*1~
SE*16*0001~
GE*1*1~
IEA*1*1~
```
