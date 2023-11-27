---
title: 'Simplify user authentications and authorizations'
description: Ballerina apps can be seamlessly integrated with any OAuth2-compatible identity provider using a simple set of annotations. 
url: 'https://github.com/ballerina-guides/bff-samples/tree/main/connect_with_asgardeo_for_building_secure_services'
---
```
@http:ServiceConfig {
    auth: [
        {
            jwtValidatorConfig: {
                issuer: issuer,
                audience: audience,
                signatureConfig: {
                    jwksConfig: {
                        url: jwksUrl
                    }
                }
            },
            scopes: ["order_insert", "order_read", "cargo_insert", "cargo_read"]
        }
    ]
}
service /sales on new http:Listener(9090) {
    @http:ResourceConfig {
        auth: {
            scopes: ["order_insert"]
        }
    }
    resource function post orders(Order orders) returns http:Ok {
        orderTable.add(orders);
        return <http:Ok>{body: {message: "Order submitted successfully"}};
    };
}
```
