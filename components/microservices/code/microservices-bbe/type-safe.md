---
title: 'Type-safe'
description: Ballerina emphasizes type safety in inter-service communication. This enables compile-time checks, reducing errors and enhancing code quality. Additionally, it simplifies maintenance and acts as clear documentation for microservices. As a result, services interact seamlessly with precise data types, preventing data mismatches and ensuring robust communication between microservices in a type-safe manner, improving reliability and maintainability of the microservices architecture.
---
import ballerina/http;

type UserRecord record {
string userId;
string username;
int age;
};

// In-memory store for user data
map<UserRecord> userStore = {};

// HTTP service to manage users
service / on new http:Listener(8080) {

    // UserRecord record type guarantees that the payload sent to user endpoint with a POST
    // method is always of shape UserRecord
    resource function post user(UserRecord user) returns json {
        userStore[user.userId] = user;
        json response = {"message": "User created successfully"};
        return response;
    }

    // UserRecord record type guarantees that the response sent back to client  with a GET
    // method is always of shape UserRecord
    resource function get user(string userId) returns UserRecord? {
        UserRecord? user = userStore[userId];
        return user;
    }
}
```