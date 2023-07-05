---
title: 'Model optionality'
description: In data-oriented programming, where data is at the forefront, modeling optionality provides a powerful mechanism to express the presence or absence of data in a concise and type-safe manner. <br><br>Optional typing allows indicating when a value may be absent or nullable, while optional fields provide flexibility in representing varying data states. <br><br> Ballerina has built-in support for optional types and fields, eliminating the risk of null pointer exceptions and related bugs. In Java, handling optional types and fields typically involves using external libraries or annotations, which can introduce additional complexity and potential for errors.
url: https://github.com/ballerina-guides/integration-samples/tree/main/model-optionality-for-dop
---
```
import ballerina/io;

type Person record {|
    int id;
    string name;
    //optional typed field
    int? age;
    //optional field
    string email?;
|};

public function main() returns error? {
    json jsonInput = {
        id: 1,
        "name": "John Doe",
        "age": null
    };

    Person person = check jsonInput.fromJsonWithType();

    io:println(person.age.toBalString()); //output: ()

    //optional type access
    int age = person.age ?: -1;
    io:println(age); //output: -1

    //optional field access
    io:println(person.hasKey("email")); //output: false
    string email = person.email ?: "Email is not provided";
    io:println(email); //output: Email is not provided
}
```