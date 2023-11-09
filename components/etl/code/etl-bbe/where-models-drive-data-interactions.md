---
title: 'Drive data interactions with models'
description: "Ballerina's 'persist' feature seamlessly connects to databases, retrieves data, and kickstarts your ETL process"
url: 'https://github.com/ballerina-guides/ai-samples/blob/main/convert_audio_to_text_and_translate_using_openai/main.bal'
phase: 'Extraction'
---
```
public function getOrderData() returns error? {
    stream<OrderData, persist:Error?> orders = dbClient->/orderdata();
    check from var orderData in orders
        do {
            io:println(orderData);
        };
}

public function getCustomerData() returns error? {
    stream<Customer, persist:Error?> customers = dbClient->/customers();
    check from var customerData in customers
        do {
            io:println(customerData);
        };
}

public function getOrderWithCustomer(string orderId) returns error? {
    OrderWithCustomer orderWithCustomer = check dbClient->/orderdata/[orderId];
    io:println(orderWithCustomer);
}
```