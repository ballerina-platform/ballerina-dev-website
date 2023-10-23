---
title: 'Simplified Backend with Native REST'
description: Most web/mobile apps rely on REST APIs, predominantly using JSON for data exchange. Effectively managing path and query parameters, HTTP headers, status codes, and complex JSON structures is crucial for web backends. Ballerina seamlessly integrates these REST features as first-class citizens within the language itself.
url: 'https://github.com/SasinduDilshara/BFF-Samples/tree/dev/ballerina_rest'
---
```
@http:ServiceConfig {
    cors: {
        allowOrigins: ["*"]
    }
}
service /sales on new http:Listener(9090) {

    // Get all orders. Example: http://localhost:9090/sales/orders
    resource function get orders() returns Order[] {
        return orderTable.toArray();
    };

    // Get order by ID. Example: http://localhost:9090/sales/orders/HM-238
    resource function get orders/[string id]() returns Order|http:NotFound {
        if orderTable.hasKey(id) {
            return orderTable.get(id);
        }
        http:NotFound res = {
            body: "Order not found. Order ID: " + id
        };
        return res;
    };

    // Query orders by customer ID and order status
    // Example: http://localhost:9090/sales/customerOrders?customer=C-124&status=PENDING
    resource function get customerOrders(string customer, string status) returns Order[] {
        return from Order item in orderTable
               where item.customerId == customer && item.status == status
               select item;
    };

    // Add a new order by posting a JSON payload
    // Request ID is passed as a header for logging purposes
    resource function post orders(@http:Header string requestId, Order 'order) returns http:Ok {
        log:printInfo("Order received: " + requestId);
        orderTable.add('order);
        http:Ok res = {
            body: "Order submitted successfully"
        };
        return res;
    };
}
```