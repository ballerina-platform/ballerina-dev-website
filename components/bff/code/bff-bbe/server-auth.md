---
title: 'Enable advanced user authentications and authorizations with simple annotations'
description: Authenticating users and authorizing access are critical requirements for any front-end application. This is usually facilitated by integrating with identity providers, enabling advanced security features like centralized user management, multi-factor authentication, social logins, and role-based access control. <br><br>Ballerina apps can be seamlessly integrated with any OAuth2-compatible identity provider using a simple set of annotations. All requests for such annotated services will be authenticated and authorized based on tokens issued by corresponding identity providers.
url: 'https://github.com/SasinduDilshara/BFF-Samples/tree/dev/ballerina_rest_asgardio_jwt'
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
    // Add a new order by posting a JSON payload
    resource function post orders(Order 'orders) returns http:Ok {
        orderTable.add('orders);
        return {
            body: {
                message: "Order submitted successfully"
            }
        };
    };

    @http:ResourceConfig {
        // Either "order_insert" or "order_read" scope is required to invoke this resource
        auth: {
            scopes: ["order_read", "order_insert"]
        }
    }
    // Get all orders. Example: http://localhost:9090/sales/orders
    resource function get orders() returns Order[] {
        return orderTable.toArray();
    };

    @http:ResourceConfig {
        auth: {
            scopes: ["cargo_insert"]
        }
    }
    // Add a new cargo by posting a JSON payload
    resource function post cargos(Cargo 'cargos) returns http:Ok {
        cargoTable.add('cargos);
        return {
            body: {
                message: "Cargo submitted successfully"
            }
        };
    };

    @http:ResourceConfig {
        auth: {
            scopes: ["cargo_read", "cargo_insert"]
        }
    }
    // Get all cargos. Example: http://localhost:9090/sales/cargos
    resource function get cargos() returns Cargo[] {
        return cargoTable.toArray();
    };

    @http:ResourceConfig {
        auth: {
            scopes: ["cargo_read", "cargo_insert"]
        }
    }
    // Get cargo by ID. Example: http://localhost:9090/sales/cargos/SP-124
    resource function get cargos/[string id]() returns Cargo|http:NotFound {
        if cargoTable.hasKey(id) {
            return cargoTable.get(id);
        }
        return {
            body: "Cargo not found. Cargo ID: " + id
        };
    };
}
```
