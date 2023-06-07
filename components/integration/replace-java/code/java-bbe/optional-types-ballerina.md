---
title: 'Ballerina'
description: null
---
```
import ballerina/io;

type Person record {
    string name;
    int? age;
    string? email;
};

public function main() returns error? {
    json jsonInput = {
        "name": "John Doe",
        "email": "abc@mail.com",
        "age": null,
        id: 1
    };
    Person person = check jsonInput.fromJsonWithType();

    //optional value access
    int? ageInFiveYears = person.age + 5;
    io:println(ageInFiveYears);

    var {name: _, email, name: _} = person;
    boolean emailValid = email !is null 
        ? email.matches(re `^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$`) 
        : false;
    io:println(emailValid);
}
```