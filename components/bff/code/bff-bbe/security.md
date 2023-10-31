---
title: "Comprehensive Security for Web Backends"
description: Ballerina-based backends can simplify securing sensitive data during transit, validating server identity, managing CORS, and enforcing message type restrictions via annotations.
url: 'https://github.com/SasinduDilshara/BFF-Samples/tree/dev/ballerina_comprehensive_security'
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
service /sales on new http:Listener(9090, secureSocket = {
        key: {
            certFile: "../resources/public.crt",
            keyFile: "../resources/private.key"
        }
    }) {

    @http:ResourceConfig {
        cors: {
            allowOrigins: ["http://localhost:3000", "http://www.hmart.com"],
            allowCredentials: true
        }
    }
    resource function post orders(Order 'order) returns Order {
        orderTable.add('order);
        return 'order;
    };
}
```