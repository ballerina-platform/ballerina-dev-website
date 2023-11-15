---
title: "Comprehensive Security for Web Backends"
description: Ballerina-based backends can simplify securing sensitive data during transit, validating server identity, managing CORS, and enforcing message type restrictions via annotations.
url: 'hhttps://github.com/SasinduDilshara/BFF-Samples/tree/dev/comprehensive_security'
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