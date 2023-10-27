---
title: 'Where Models Drive Data Interactions'
description: "Ballerina's persist feature seamlessly connects to databases, retrieves data, and kickstarts your ETL process. With its intuitive syntax and built-in database support, Ballerina empowers developers to effortlessly interact with databases.
"
url: 'https://github.com/ballerina-guides/ai-samples/blob/main/convert_audio_to_text_and_translate_using_openai/main.bal'
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
    OrderWithCustomer orderwithCustomer = check dbClient->/orderdata/[orderId];
    io:println(orderwithCustomer);
}
```