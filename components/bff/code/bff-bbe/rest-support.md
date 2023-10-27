---
title: 'Simplified Backend with Native REST'
description: Most web/mobile apps rely on REST APIs, predominantly using JSON for data exchange. Effectively managing path and query parameters, HTTP headers, status codes, and complex JSON structures is crucial for web backends. Ballerina seamlessly integrates these REST features as first-class citizens within the language itself.
url: 'https://github.com/SasinduDilshara/BFF-Samples/tree/dev/ballerina_rest'
---
```
service /sales on new http:Listener(9090) {
    resource function get orders() returns Order[] {
        return orderTable.toArray();
    };

    resource function get orders/[string id]() returns Order|http:NotFound {
        if orderTable.hasKey(id) {
            return orderTable.get(id);
        }
        return {
            body: string `Order not found. ID: ${id};`
        };
    };

    resource function post orders(Order 'order) returns Order {
        orderTable.add('order);
        return 'order;
    };
}
```