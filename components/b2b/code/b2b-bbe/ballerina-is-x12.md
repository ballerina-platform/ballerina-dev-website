---
title: 'X12? Ballerina is X12'
description: Ballerina's built-in support for X12 messages empowers organizations to seamlessly work with their partner networks using the widely adopted X12 standard. Developers can easily process, parse, and generate X12 messages, ensuring efficient data exchange between partner systems.
url: 'https://github.com/ballerina-guides/b2b-samples/blob/main/ballerina-x12/main.bal'
---
```
import ballerina/io;
import ballerinax/x12.supplychain.v004010.m850;

public function main() returns error? {
    string ediText = check io:fileReadString("resources/messages/850_sample1.edi");
    m850:EDI_850_Purchase_Order purchaseOrder = check m850:fromEdiString(ediText);
    m850:PO1_Loop_GType[] items = purchaseOrder.PO1_Loop;
    float orderValue = 0;
    foreach m850:PO1_Loop_GType item in items {
        float? itemValue = item.Baseline_Item_Data?.Unit_Price * 
                item.Baseline_Item_Data?.Quantity_Ordered;
        if itemValue is float {
            orderValue += itemValue;
        }
    }
    io:println(io:println("Total order value: " + orderValue.toString()));
}
```