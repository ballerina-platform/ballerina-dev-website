---
title: 'Ballerina'
description: null
---
```
import ballerina/io;

type Person record {|
    int id;
    string name;
    // optional typed field
    int? age;
    // optional field
    string email?;
|};

public function main() returns error? {
    json jsonInput = {
        id: 1,
        "name": "John Doe",
        "age": null
    };

    Person person = check jsonInput.fromJsonWithType();

    io:println(person.age.toBalString()); // output: ()

    // optional type access
    int age = person.age ?: -1;
    io:println(age); // output: -1

    // optional field access
    io:println(person.hasKey("email")); // output: false
    string email = person.email ?: "Email is not provided";
    io:println(email); // output: Email is not provided
}
```