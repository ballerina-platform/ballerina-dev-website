---
title: 'Validate payload constraints in Web backends'
description: With Ballerina's native JSON capabilities, JSON data can be directly mapped into Ballerina records with features like constraint validations.
url: 'https://github.com/SasinduDilshara/BFF-Samples/tree/dev/constraint_validation'
---
```
type Order record {|
    readonly string id;
    @constraint:String {
        pattern: {
            value: re `C-[0-9]{3}`,
            message: "Customer id should be in the format C-XXX"
        }
    }
    string customerId;
    string? shipId;
    string date;
    OrderStatus status;
    @constraint:Int {
        minValue: {value: 1, message: "Quantity should be greater than one"},
        maxValue: {value: 10, message: "Quantity should not exceed 10"}
    }
    int quantity;
    string item;
|};

service /sales on new http:Listener(9090) {
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
