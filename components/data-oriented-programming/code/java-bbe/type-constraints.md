---
title: 'Data validation at the boundary'
description: Boundary data validation is a critical aspect of data-oriented programming as it ensures that only valid and reliable data is allowed into the system enhancing data integrity, downstream processing, and security. <br><br>Ballerina, with its built-in language features, handles the validation process automatically, ensuring that only valid data is accepted.
url: https://github.com/ballerina-guides/integration-samples/blob/main/data-oriented-programming/data-validation/ballerina/main.bal
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