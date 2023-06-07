---
title: 'Smart Endpoints'
description: Ballerina's support for smart endpoints enhances data-oriented programming by providing a declarative and intuitive way to define endpoints and handle data transformations and routing. With smart endpoints, you can easily handle different data formats, such as Records, JSON, XML, and more, and perform operations on the data within the endpoints themselves. This approach simplifies the code and makes it easier to reason about the data flow. 
---
```
import ballerina/http;
import ballerina/io;

type Album readonly & record {
    string title;
    string artist;
};

public function main() returns error? {
    // Creates a new client with the Basic REST service URL.
    http:Client albumClient = check new ("localhost:9090");

    // Binding the payload to a `record` array type.
    // The contextually expected type is inferred from the LHS variable type.
    Album[] albums = check albumClient->/albums;
    io:println("First artist name: " + albums[0].artist);
}
```