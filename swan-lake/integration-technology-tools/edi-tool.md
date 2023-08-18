---
layout: ballerina-edi-support-left-nav-pages-swanlake
title: EDI tool
description: The EDI tool provides the below set of command line tools to work with EDI files in Ballerina.
keywords: ballerina, programming language, edi, contract
permalink: /learn/edi-tool/
active: edi-tool
intro: The EDI tool provides the below set of command line tools to work with EDI files in Ballerina.
--- 

- **Code generation:** Generate Ballerina records and parsing functions for a given EDI schema
- **Package generation:** Generate Ballerina records, parsing functions, utility methods, and a REST connector for a given collection of EDI schemas, and also organize those as a Ballerina package

## Usage

The below command generates all Ballerina records and parsing functions required for working with data in the given EDI schema, and writes those into the file specified in the output path.

```
$ bal edi codegen <EDI schema path> <output path>
```

The generated parsing function (i.e., `fromEdiString(...)`) can read EDI text files into generated records, which can be accessed from the Ballerina code, similar to accessing any other Ballerina record. Similarly, the generated serialization function (i.e., `toEdiString(...)`) can serialize generated Ballerina records into EDI text.

## Example

A simple EDI schema file is shown below.

```json
{
    "name": "SimpleOrder",
    "delimiters" : {"segment" : "~", "field" : "*"},
    "segments" : {
        "HDR": {
            "tag" : "header",
            "fields" : [{"tag" : "code"}, {"tag" : "orderId"}, {"tag" : "organization"}, {"tag" : "date"}]
        },
        "ITM": {
            "tag" : "items",
            "maxOccurances" : -1,
            "fields" : [{"tag" : "code"}, {"tag" : "item"}, {"tag" : "quantity", "dataType" : "int"}]
        }
    }
}
```

The above schema can be used to parse EDI documents with one HDR segment (mapped to `header`) and any number of ITM segments (mapped to `items`). The HDR segment contains three fields, which are mapped to `orderId`, `organization`, and `date`. Each ITM segment contains two fields mapped to `item` and `quantity`. Below is a sample EDI document that can be parsed using the above schema.

```
HDR*ORDER_1201*ABC_Store*2008-01-01~
ITM*A-250*12
ITM*A-45*100
ITM*D-10*58
ITM*K-80*250
ITM*T-46*28
```

### Generate Ballerina records

Ballerina records for the EDI schema in the `edi-schema.json` file can be generated as follows (the generated Ballerina records will be saved in `orderRecords.bal`).

```
$ bal edi codegen -s resources/edi-schema.json -o modules/hmartOrder/orderRecords.bal
```

The Ballerina records generated for the above schema are shown below.

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

### Read EDI files

The generated `fromEdiString` function can be used to read EDI text files into the generated Ballerina record, as shown below. 

>**Note:** Any data item in the EDI can be accessed using the record's fields, as shown in the example code below.

```ballerina
import ballerina/io;

public function main() returns error? {
    string ediText = check io:fileReadString("resources/edi-sample.edi");
    SimpleOrder order = check hmartOrder:fromEdiString(ediText);
    io:println(order.header.date);
}
```

### Write EDI files

The generated `toEdiString` function can be used to serialize the `SimpleOrder` records into EDI text, as shown below.

```ballerina
import ballerina/io;

public function main() returns error? {
    SimpleOrder salesOrder = {SimpleOrder    salesOrder = {header: {orderId: "ORDER_200", organization: "HMart", date: "17-05-2023"}};
    salesOrder.items.push({item: "A680", quantity: 15});
    salesOrder.items.push({item: "A530", quantity: 2});
    salesOrder.items.push({item: "A500", quantity: 4});
};

string orderEDI = check hmartOrder:toEdiString(salesOrder);
io:println (orderEDI) ;
}
```

Below is the output of the above code.

```
HDRORDER_200HMart17-05-2023~
ITMA68015~
ITMA5302~
ITMA500*4~
```

## Create an EDI package

Usually, organizations have to work with many EDI formats, and integration developers need to have a convenient way to work on EDI data with minimum effort. The Ballerina EDI package facilitates this by allowing organizations to pack all EDI processing the codes of their EDI collections into an importable package. Therefore, integration developers can simply import the package and convert EDI messages into Ballerina records in a single line of code.

The below command can be used to generate the EDI package.

```
$ bal edi libgen -O <org name> -n <package name> -s <EDI schema folder> -o <output folder>
```

A Ballerina package project will be generated in the output folder. This package can be built and published by issuing the `bal pack` and `bal push` commands from the output folder. Then, the generated package can be imported into any Ballerina project, and the generated utility functions of the package can be invoked to parse EDI messages into Ballerina records.

For example, if an organization (`CityMart`) needs to work with `X12 850`, `810`, `820`, and `855` for handling purchase orders, then, its integration developers can put schemas of those `X12` specifications into a folder as follows.

```
|-- CityMart
    |--lib
    |--schemas
       |--850.json
       |--810.json
       |--820.json
       |--855.json
```

Execute the `libgen` command to generate a Ballerina package, as shown below.

```
$ bal edi libgen -O citymart -n porder -s CityMart/schemas -o CityMart/lib
```

The generated Ballerina package will be, as shown below.

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

As seen in the above project structure, the code for each EDI schema is generated into a separate module to prevent possible conflicts. Now, it is possible to build the above project using the `bal pack` command and publish it into [Ballerina Central](https://central.ballerina.io/) using the `bal push` command. 

Then, any Ballerina project can import this package and use it to work with the EDI files related to purchase orders. An example of using this package for reading an `850` file and writing an `855` file is shown below.

```ballerina
import ballerina/io;
import citymart/porder.m850;
import citymart/porder.m855;

public function main() returns error? {
    string orderText = check io:fileReadString("orders/d15_05_2023/order10.edi");
    m850:Purchase_Order purchaseOrder = check m850:fromEdiString(orderText);
    ...
    m855:Purchase_Order_Acknowledgement    orderAck = {...};
    string orderAckText = check m855:toEdiString(orderAck);
    check io:fileWriteString("acks/d15_05_2023/ack10.edi", orderAckText);
}
```

It is quite common for different trading partners to use variations of the standard EDI formats. In such cases, it is possible to create partner-specific schemas and generate a partner-specific Ballerina package for processing interactions with a particular partner.
## Use the generated EDI package as a standalone REST service

The EDI package generated above can also be compiled into a JAR file (using the `bal build` command) and executed as a standalone Ballerina service that processes EDI files via a REST interface. This is useful for microservices environments where the EDI processing functionality can be deployed as a separate microservice.

For example, the `citymart` package generated above can be built and executed as a JAR file. Once executed, it will expose a REST service to work with `X12 850`, `810`, `820`, and `855` files. 

You can convert `X12 850` EDI text to JSON using a cURL command, as shown below.

```
$curl --request POST \
  --url http://localhost:9090/porderParser/edis/850 \
  --header 'Content-Type: text/plain' \
  --data 'ST*834*12345*005010X220A1~
BGN*00*12456*20020601*1200****~
REF*38*ABCD012354~
AMT*cc payment*467.34*~
N1*P5**FI*999888777~
N1*IN**FI*654456654~
INS*Y*18*025**A***FT~
REF*0F*202443307~
REF*1L*123456001~
NM1*IL*1*SMITH*WILLIAM****ZZ*202443307~
HD*025**DEN~
DTP*348*D8*20020701~
SE*12*12345~'
```

The above REST call will return a JSON response, as shown below.

```json
{
    "Transaction_Set_Header": {
        "Transaction_Set_Identifier_Code": "834",
        "Transaction_Set_Control_Number": "12345",
        "Implementation_Convention_Reference": "005010X220A1"
    },
    "Beginning_Segment": {
        "Transaction_Set_Purpose_Code": "00",
        "Reference_Identification": "12456",
        "Date": "20020601",
        "Time": "1200"
    },
    "Reference_Information": [
        {
            "Reference_Identification_Qualifier": "38",
            "Reference_Identification": "ABCD012354"
        }
    ],
    "Date_or_Time_or_Period": [],
    "Monetary_Amount_Information": [
        {
            "Amount_Qualifier_Code": "cc payment",
            "Monetary_Amount": 467.34
        }
    ],
    "Quantity_Information": [],
    "A_1000_Loop": [
        {
            "Party_Identification": {
                "Entity_Identifier_Code": "P5",
                "Identification_Code_Qualifier": "FI",
                "Identification_Code": "999888777"
            },
            "Additional_Name_Information": [],
            "Party_Location": [],
            "Administrative_Communications_Contact": [],
            "A_1100_Loop": []
        },
        {
            "Party_Identification": {
                "Entity_Identifier_Code": "IN",
                "Identification_Code_Qualifier": "FI",
                "Identification_Code": "654456654"
            },
            "Additional_Name_Information": [],
            "Party_Location": [],
            "Administrative_Communications_Contact": [],
            "A_1100_Loop": []
        }
    ],
    "A_2000_Loop": [
        {
            "Insured_Benefit": {
                "Yes_No_Condition_or_Response_Code": "Y",
                "Individual_Relationship_Code": "18",
                "Maintenance_Type_Code": "025",
                "Benefit_Status_Code": "A",
                "Employment_Status_Code": "FT"
            },
            "Reference_Information_2": [
                {
                    "Reference_Identification_Qualifier": "0F",
                    "Reference_Identification": "202443307"
                },
                {
                    "Reference_Identification_Qualifier": "1L",
                    "Reference_Identification": "123456001"
                }
            ],
            "Date_or_Time_or_Period_2": [],
            "A_2100_Loop": [
                {
                    "Individual_or_Organizational_Name": {
                        "Entity_Identifier_Code": "IL",
                        "Entity_Type_Qualifier": "1",
                        "Name_Last_or_Organization_Name": "SMITH",
                        "Name_First": "WILLIAM",
                        "Identification_Code_Qualifier": "ZZ",
                        "Identification_Code": "202443307"
                    },
                    "Employment_Class": [],
                    "Monetary_Amount_Information_2": [],
                    "Health_Care_Information_Codes": [],
                    "Language_Use": []
                }
            ],
            "A_2200_Loop": [],
            "A_2300_Loop": [
                {
                    "Health_Coverage": {
                        "Maintenance_Type_Code": "025",
                        "Insurance_Line_Code": "DEN"
                    },
                    "Date_or_Time_or_Period_4": [
                        {
                            "Date_Time_Qualifier": "348",
                            "Date_Time_Period_Format_Qualifier": "D8",
                            "Date_Time_Period": "20020701"
                        }
                    ],
                    "Monetary_Amount_Information_3": [],
                    "Reference_Information_3": [],
                    "Identification_Card": [],
                    "A_2310_Loop": [],
                    "A_2320_Loop": []
                }
            ],
            "A_2400_Loop": [],
            "A_2500_Loop": [],
            "A_2600_Loop": []
        }
    ],
    "Transaction_Set_Trailer": {
        "Number_of_Included_Segments": 12,
        "Transaction_Set_Control_Number": "12345"
    }
}
```
