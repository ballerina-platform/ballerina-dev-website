---
title: 'Model optionality'
description: In data-oriented programming, where data takes precedence, modeling optionality is crucial for expressing the presence or absence of data in a concise and type-safe manner. <br><br>Optional typing enables the indication of nullable or absent values, while optional fields offer flexibility in representing different data states.<br><br>Ballerina has built-in support for optional types and fields, eliminating the risk of null pointer exceptions and related bugs, ensuring more robust code.
url: https://github.com/ballerina-guides/integration-samples/blob/main/data-oriented-programming/model-optionality/ballerina/main.bal
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