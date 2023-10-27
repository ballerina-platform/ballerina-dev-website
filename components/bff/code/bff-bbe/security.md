---
title: "Comprehensive Security for Web Backends"
description: Ballerina-based backends simplify securing sensitive data during transit, validating server identity, managing CORS, and enforcing message type restrictions through annotations on relevant services. Additionally, Ballerina services can easily generate HTTP access logs and trace logs, offering deeper insights into message exchanges.
url: 'https://github.com/SasinduDilshara/BFF-Samples/tree/dev/ballerina_comprehensive_security'
---
```
@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:3000", "http://www.hmart-dev.com", "http://www.hmart.com"],
        allowCredentials: false,
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
            allowOrigins: ["http://localhost:3000", "http://www.hmart-dev.com", "http://www.hmart.com"],
            allowCredentials: true
        }
    }
    resource function post orders(Order 'order) returns Order {
        orderTable.add('order);
        return 'order;
    };
}
```