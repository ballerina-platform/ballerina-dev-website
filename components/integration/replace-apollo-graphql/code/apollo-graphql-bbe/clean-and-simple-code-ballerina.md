---
title: "Ballerina"
description: null
---

```
import ballerina/graphql;
import ballerina/io;

service on new graphql:Listener(9090) {
    function init() {
        io:println(“💃 Server started at http://localhost:9090”);
    }

    resource function get hello() returns string {
        return "Hello, World!";
    }
}
```