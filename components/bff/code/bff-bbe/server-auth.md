---
title: 'Simplify User Auth and AuthZ with Annotations'
description: Ballerina apps can be seamlessly integrated with any OAuth2-compatible identity provider using a simple set of annotations. 
url: 'https://github.com/SasinduDilshara/BFF-Samples/tree/dev/ballerina_rest_asgardio_jwt'
---
```
@http:ServiceConfig {
    auth: [{
        jwtValidatorConfig: {
            issuer: issuer,
            audience: audience,
            signatureConfig: {
                jwksConfig: {
                    url: jwksUrl
                }
            }
        },
        scopes: ["order_insert", "order_read"]
    }]
}
service /sales on new http:Listener(9090) {
    @http:ResourceConfig {
        auth: { scopes: ["order_insert"] }
    }
    resource function post orders(Order 'order) returns Order {
        orderTable.add('order);
        return 'order;
    };

    @http:ResourceConfig {
        auth: { scopes: ["order_read", "order_insert"] }
    }
    resource function get orders() returns Order[] {
        return orderTable.toArray();
    };
}
```
