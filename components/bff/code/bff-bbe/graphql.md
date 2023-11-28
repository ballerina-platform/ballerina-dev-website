---
title: 'Efficiently expose complex data with GraphQL'
description: With Ballerina's built-in GraphQL functionality, developers can simply expose Ballerina records via GraphQL services, facilitating querying and selectively fetching complex data structures.
url: 'https://github.com/ballerina-guides/bff-samples/tree/main/expose_complex_data_with_graphql'
---
```
type Order record {|
    readonly string id;
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
    resource function get orders(string? customerId) returns Order[] {
        if customerId is () {
            return orders.toArray();
        }
        return from Order entry in orders
            where entry.customerId == customerId
            select entry;
    }
}
```