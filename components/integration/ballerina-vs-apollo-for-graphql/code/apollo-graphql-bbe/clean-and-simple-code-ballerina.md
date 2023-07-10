---
title: "Ballerina"
description: null
---

```ballerina
import ballerina/graphql;

type Book record {|
    string title;
    string author;
|};

Book[] books = [
    {
        title: "Harry Potter",
        author: "J. K. Rowling"
    },
    {
        title: "The Lord of the Rings",
        author: "J. R. R. Tolkien"
    }
];

service on new graphql:Listener(9090) {
    resource function get books() returns Book[] => books;
}
```
