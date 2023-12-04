---
title: "Comprehensive security for web back-ends"
description: Ballerina-based back-ends can simplify securing sensitive data during transit, validating server identity, managing CORS, and enforcing message type restrictions via annotations.
url: 'https://github.com/ballerina-guides/bff-samples/tree/main/comprehensive-security-for-web-backends'
---
```
@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:3000", "http://www.hmart.com"],
        allowHeaders: ["REQUEST_ID"],
        exposeHeaders: ["RESPONSE_ID"],
        maxAge: 84900
    }
}
service /sales on new http:Listener(9090,
    secureSocket = {
        key: {
            certFile: "../path/to/cert",
            keyFile: "../path/to/private-key"
        }
    }
) {
    @http:ResourceConfig {
        cors: {
            allowOrigins: ["http://localhost:3000", "http://www.hmart.com"],
            allowCredentials: true
        }
    }
    resource function post orders(Order orderEntry) returns http:Ok {
        orderTable.add(orderEntry);
        return <http:Ok>{body: {message: "Order submitted successfully"}};
    };
}
```