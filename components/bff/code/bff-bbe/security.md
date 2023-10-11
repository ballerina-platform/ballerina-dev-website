---
title: "Enable comprehensive security for web app backends"
description: Web app backends face several security challenges beyond user authentication and authorization. These include securing sensitive data during transit, server identity validation, CORS management, and message type restrictions. <br><br>Ballerina-based backends simplify these functions, enabling security features via annotations on relevant services. Additionally, Ballerina services can easily generate HTTP access logs and trace logs, providing deeper insights into message exchanges.
url: 'https://github.com/SasinduDilshara/BFF-Samples/tree/dev/ballerina_comprehensive_security'
---
```
import ballerina/http;

@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:3000", "http://www.hmart-dev.com", "http://www.hmart.com"],
        allowCredentials: false,
        allowHeaders: ["REQUEST_ID"],
        exposeHeaders: ["RESPONSE_ID"],
        maxAge: 84900
    }
}
service /sales on new http:Listener(9090, 
        secureSocket = {
            key: {
                certFile: "../resources/public.crt",
                keyFile: "../resources/private.key"
            }
        }) {

    @http:ResourceConfig {
        cors: {
            allowOrigins: ["http://localhost:3000", "http://www.hmart-dev.com", "http://www.hmart.com"],
            allowCredentials: true
        }
    }
    resource function post orders(Order 'order) returns http:Ok {
        orderTable.add('order);
        return <http:Ok> { body: { message: "Order submitted successfully" }};
    };

    resource function get orders() returns Order[] {
        return orderTable.toArray();
    };
}
```