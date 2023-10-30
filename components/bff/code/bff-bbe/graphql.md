---
title: 'Efficiently Expose Complex Data with GraphQL'
description: With Ballerina's built-in GraphQL functionality, developers can simply expose Ballerina records via GraphQL services, facilitating querying and selectively fetching complex data structures.
url: 'https://github.com/SasinduDilshara/BFF-Samples/tree/dev/ballerina_graphql'
---
```
public type Order record {|
    readonly string orderId;
    string customerId;
    int quantity;
|};

service /sales on new graphql:Listener(9090) {
    resource function get orders(string? customerId) returns Order[]|error {
        if customerId is () {
            return orderTable.toArray();
        }
        return from Order 'order in orderTable
            where 'order.customerId == customerId
            select 'order;
    }
}
```