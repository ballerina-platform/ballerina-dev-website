---
title: 'Drive data interactions with models'
description: "Ballerina's `persist` feature seamlessly connects to databases, retrieves data, and kickstarts your ETL process."
url: 'https://github.com/ballerina-guides/etl-samples/blob/main/extract-data-from-database/main.bal'
phase: 'Extraction'
---
```
function getOrderData() returns error? {
    stream<OrderData, persist:Error?> orders = dbClient->/orderdata();
    check from var orderData in orders
        do {
            io:println(orderData);
        };
}

function getCustomerData() returns error? {
    stream<CustomerData, persist:Error?> customers = dbClient->/customers();
    check from var customerData in customers
        do {
            io:println(customerData);
        };
}

function getOrderWithCustomer(string orderId) returns error? {
    OrderWithCustomer orderwithCustomer = check dbClient->/orderdata/[orderId];
    io:println(orderwithCustomer);
}
```
