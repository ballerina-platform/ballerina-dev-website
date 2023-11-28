---
title: 'Automate data access with Ballerina'
description: Ballerina's persistence features offer a straightforward way to create a data access layer for any complex application by providing a simplified interface for CRUD operations.
url: 'https://github.com/ballerina-guides/bff-samples/tree/main/persistently-store-data-using-Ballerina'
---
```
Client dbClient = check new ();

service /sales on new http:Listener(9090) {
    resource function get orders() returns Order[]|error {
        return from Order entry in orderDatabase->/orders(Order)
            select entry;
    };

    resource function post orders(Order orderEntry)
            returns http:Ok|http:InternalServerError|http:BadRequest {
        orderEntry.cargoId = getCargoId();
        string[]|persist:Error result = orderDatabase->/orders.post([orderEntry]);
        if result is string[] {
            return http:OK;
        } 
        if result is persist:ConstraintViolationError {
            return <http:BadRequest>{
                body: {message: string `Invalid cargo id: ${orderEntry.cargoId}`}
            };
        }
        return http:INTERNAL_SERVER_ERROR;
    };
}
```