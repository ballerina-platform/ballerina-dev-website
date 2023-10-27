---
title: 'Automate Data Access with Ballerina'
description: Ballerina's persistence features offer a straightforward way to create a data access layer for any complex application. The persistence package can generate all data access functions by directly mapping database tables to Ballerina's built-in record types, providing a simplified interface for CRUD operations.
url: 'https://github.com/SasinduDilshara/BFF-Samples/tree/dev/ballerina_persists'
---
```
Client dbClient = check new ();

service /sales on new http:Listener(9090) {
    resource function post orders(Order[] orders) returns string[]|error {
        string[] orderIds = check dbClient->/orders.post(orders);
        return orderIds;
    };
    
    resource function get orders/[string id]() returns Order|http:BadRequest {
        Order|error 'order = dbClient->/orders/[id];
        if 'order is error {
            http:BadRequest res = {
                body: {
                    message: 'order.message()
                }
            };
            return res;
        }
        return 'order;
    };
}
```