---
title: 'EDI? Ballerina is EDI'
description: EDI data can be loaded into Ballerina records using the built-in EDI handling capabilities. This allows developers to manipulate EDI data using the usual Ballerina syntax. Ballerina also supports the conversion of records back into EDI formats, making it possible to exchange processed data seamlessly with partner networks. With Ballerina, working with EDI data becomes as straightforward as working with any other Ballerina data type.
url: 'https://github.com/ballerina-guides/b2b-samples/blob/main/simple-edi-schema/main.bal'
---
```
import simple_edi_schema.hmart;
import ballerina/io;

public function main() returns error? {
   string ediText = check io:fileReadString("resources/in-message.edi");
   hmart:HMartOrder hmartOrder = check hmart:fromEdiString(ediText);
   foreach hmart:Items_Type item in hmartOrder.items {
       io:println(string `Item: ${item.name}, Quantity: ${item.quantity}`);
   }
   hmartOrder.items[0].quantity = 5;
   string outputEdi = check hmart:toEdiString(hmartOrder);
   io:println(outputEdi);
}
```