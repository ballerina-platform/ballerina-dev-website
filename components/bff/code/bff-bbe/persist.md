---
title: 'Automate Data Access with Ballerina'
description: Ballerina's persistence features offer a straightforward way to create a data access layer for any complex application. The persistence package can generate all data access functions by directly mapping database tables to Ballerina's built-in record types, providing a simplified interface for CRUD operations.
url: 'https://github.com/SasinduDilshara/BFF-Samples/tree/dev/ballerina_persists'
---
```
Client ordersDatabase = check new ();

@http:ServiceConfig {
    cors: {
        allowOrigins: ["*"]
    }
}
service /sales on new http:Listener(9090) {
    function init() {
        addCargos();
    }

    // Add a new order to the database
    resource function post orders(Order 'order) returns http:Ok|http:BadRequest {
        'order.cargoId = assignCargoId();
        string[]|error submitResult = ordersDatabase->/orders.post(['order]);
        if submitResult is string[] {
            http:Ok res = {};
            return res;
        }
        http:BadRequest res = {
            body: {
                message: submitResult.message()
            }
        };
        return res;
    };

    // Get all orders from the database. Example: http://localhost:9090/sales/orders
    resource function get orders() returns Order[]|error {
        return from Order 'order in ordersDatabase->/orders(targetType = Order)
            select 'order;
    };

    // Get the order with the given 'orderId'. Example: http://localhost:9090/sales/orders/HM-238
    resource function get orders/[string id]() returns Order|http:BadRequest {
        Order|error 'order = ordersDatabase->/orders/[id];
        if 'order is Order {
            return 'order;
        }
        http:BadRequest res = {
            body: {
                message: 'order.message()
            }
        };
        return res;
    };


    // Get all orders with the given 'cargoId' sorted by 'quantity'
    resource function get cargoOrders(string cargoId) returns Order[]|error {
        return from Order 'order in ordersDatabase->/orders(targetType = Order)
            where 'order.cargoId == cargoId
            order by 'order.quantity descending
            select 'order;
    };
}
```