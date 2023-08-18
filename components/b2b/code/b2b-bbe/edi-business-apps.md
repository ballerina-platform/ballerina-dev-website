---
title: 'Unlock EDI data for business apps'
description: Developers can create Ballerina apps that perform actions on EDI data, such as calling external services with relevant EDI fields, making intelligent decisions, storing extracted data in databases, and performing data manipulations like filtering, replacing, and enrichment. These capabilities empower organizations to effectively utilize EDI data, enabling the implementation of data-driven processes and enhancing overall operational efficiency.

url: 'https://github.com/ballerina-guides/b2b-samples/blob/main/edi-in-business-apps/main.bal'
---
```
import edi_in_business_apps.hmart;
import ballerina/http;
import ballerina/io;

http:Client salesEp = check new (url = "http://kwLogistics");

public function main() returns error? {
   string ediText = check io:fileReadString("inFolder/message.edi");
   hmart:HMartOrder hmartOrder = check hmart:fromEdiString(ediText);
   int totalQuantity = 0;
   foreach hmart:Items_Type item in hmartOrder.items {
       totalQuantity += item.quantity;
   }
   if totalQuantity > 100 {
       json response = check salesEp->/largeOrders.post(
           {salesOrder: hmartOrder, totalQuantity});
       io:println(response);
   } else {
       json response = check salesEp->/orders.post(
           {salesOrder: hmartOrder});
       io:println(response);
   }  
}
```