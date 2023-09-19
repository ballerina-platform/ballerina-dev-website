---
title: 'Simplify backend development with native REST features'
description: Most web apps rely on REST APIs, with JSON serving as the predominant data exchange format. Handling REST API elements like path parameters, query parameters, HTTP headers, status codes, and complex JSON structures is crucial for web app backends. Ballerina addresses these needs effectively by incorporating all these REST features as first-class citizens within the language itself.
url: 'https://github.com/ballerina-guides/b2b-samples/blob/main/simple-edi-schema/main.bal'
---
```
import ballerina/log;
import ballerina/http;

service /sales on new http:Listener(9090) {

    // Get all orders
    resource function get orders() returns Order[] {
        return orderTable;
    };

    // Get order by ID. Example: http://localhost:9090/sales/orders/HM-238
    resource function get orders/[string id]() returns Order|http:NotFound {
        foreach Order item in orderTable {
            if item.orderId == id {
                return item;
            }
        }
        http:NotFound res = {
            body: "Order not found. Order ID: " + id
        };
        return res;
    };

    // Query orders by customer ID and order status
    // Example: http://localhost:9090/sales/orders?customer=C-124&status=PENDING
    resource function get customerOrders(string customer, string status) returns Order[] {
        Order[] customerOrders = [];
        foreach Order item in orderTable {
            if item.customerId == customer && item.status == status {
                customerOrders.push(item);
            }
        }
        return customerOrders;
    };

    // Add a new order by posting a JSON payload
    // Request ID is passed as a header for logging purposes
    resource function post orders(@http:Header string requestId, Order 'order) returns http:Ok {
        log:printInfo("Order received: " + requestId);
        orderTable.push('order);
        http:Ok res = {
            body: "Order submitted successfully"
        };
        return res;
    };
}
```