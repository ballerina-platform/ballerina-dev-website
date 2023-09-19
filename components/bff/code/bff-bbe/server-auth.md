---
title: 'Enable advanced user authentications and authorizations with simple annotations'
description: Authenticating users and authorizing access are critical requirements for any front-end application. This is usually facilitated by integrating with identity providers, enabling advanced security features like centralized user management, multi-factor authentication, social logins, and role-based access control. <br><br>Ballerina apps can be seamlessly integrated with any OAuth2-compatible identity provider using a simple set of annotations. All requests for such annotated services will be authenticated and authorized based on tokens issued by corresponding identity providers.
url: 'https://github.com/ballerina-guides/b2b-samples/blob/main/ballerina-edifact/main.bal'
---
```
import ballerina/http;

configurable string issuer = ?;
configurable string audience = ?;
configurable string jwksUrl = ?;

@http:ServiceConfig {
    cors: {
        allowOrigins: ["*"]
    },
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
    // "order_insert" scope is required to invoke this resource
    @http:ResourceConfig {
        auth: {
            scopes: ["order_insert"]
        }
    }
    resource function post orders(Order 'orders) returns http:Ok {
        orderTable.push('orders);
        http:Ok res = {
            body: {
                message: "Order submitted successfully"
            }
        };
        return res;
    };

    // Either "order_insert" or "order_read" scope is required to invoke this resource
    @http:ResourceConfig {
        auth: {
            scopes: ["order_read", "order_insert"]
        }
    }
    resource function get orders() returns Order[] {
        return orderTable;
    };
```
