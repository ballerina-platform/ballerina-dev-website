---
title: 'Efficiently expose complex data with GraphQL'
description: Web and mobile apps act as the interface for vast amounts of consolidated data, often requiring users to perform advanced data retrieval operations. With Ballerina's built-in GraphQL functionality, backend developers can simply expose Ballerina records via GraphQL services, facilitating querying and selectively fetching complex data structures. 
url: 'https://github.com/ballerina-guides/b2b-samples/blob/main/simple-edi-schema/main.bal'
---
```
import ballerina/io;
import ballerina/graphql;

type Order record {|
    readonly string orderId;
    string customerId;
    string? shipId;
    Address? shippingAddress;
    string date;
    OrderStatus status;
    int quantity;
    string item;
|};

type Address record {|
    string number;
    string street;
    string city;
    string state;
|};

service /sales on new graphql:Listener(9090) {

    // Query orders via the GraphQL URL: http://localhost:9090/sales
    // Example query: 
    // query {
    //     orders(customerId:"C-124") { customerId, item, shippingAddress: {city} }
    // }
    resource function get orders(string? customerId) returns Order[]|error {
        io:println("Get orders for customer: " + (customerId?: "Any"));
        if customerId is () {
            return orderTable;
        }
        Order[] customerOrders = [];
        foreach Order 'order in orderTable {
            if ('order.customerId == customerId) {
                customerOrders.push('order);
            }
        }
        return customerOrders;
    }
}
```

