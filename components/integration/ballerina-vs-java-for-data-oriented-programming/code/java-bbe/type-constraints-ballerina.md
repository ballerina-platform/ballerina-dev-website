---
title: 'Ballerina'
description: null
---
```
import ballerina/constraint;
import ballerina/http;
import ballerina/io;

type User record {
    @constraint:String {
        minLength: 1,
        maxLength: 8
    }
    string username;
    @constraint:String {
        pattern: re `^[\S]{4,}$`
    }
    string password;
};

service / on new http:Listener(9090) {
    resource function post user(User user) returns http:Created {
        io:println(string `User ${user.username} signed up successfully`);
        return http:CREATED;
    }
}
```