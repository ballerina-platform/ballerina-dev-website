---
title: 'Data validation at the boundary'
description: Boundary data validation is crucial for data-oriented programming. It ensures only valid and reliable data enters the system, improving data integrity, downstream processing, and security. <br><br>Ballerina, with its built-in language features handle data validation automatically. In Java, libraries like Hibernate Validator and Apache Commons Validator provide tools for enforcing validation rules.
url: https://github.com/ballerina-guides/integration-samples/tree/main/boundary-validation-for-dop
---
```
import ballerina/http;
import ballerina/constraint;
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