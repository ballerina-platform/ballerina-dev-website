---
title: 'Simplify back-end development with native REST features'
description: Ballerina provides REST features like path/query parameters, HTTP headers, status codes, and complex JSON structures as first-class citizens within the language itself.
url: 'https://github.com/ballerina-guides/bff-samples/tree/main/restful-order-service'
---
```
service /sales on new http:Listener(9090) {

    resource function get orders() returns Order[] {
        return orders.toArray();
    };

    resource function get orders/[string id]() returns Order|http:NotFound {
        return orders[id] ?: <http:NotFound>{
            body: string `Order not found. Order ID: ${id}`
        };
    };

    resource function post orders(Order orderRequest)
            returns Order|http:BadRequest {
        if orders.hasKey(orderRequest.id) {
            return <http:BadRequest>{
                body: string `Order id already exists.`
            };
        }
        orders.add(orderRequest);
        return orderRequest;
    }
}
```