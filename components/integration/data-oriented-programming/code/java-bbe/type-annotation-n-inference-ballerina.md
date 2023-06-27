---
title: 'Ballerina'
description: null
---
```
import ballerina/io;

type Employee record {|
    string name;
    int age;
    string[] skills;
|};

public function main() {
    // Creates a variable explicitly stating the type
    string[] skills = ["Java", "Python", "SQL"];

    // Creates a variable using type inference
    var employee = {
        name: "John Doe",
        age: 30,
        skills
    };

    io:println(employee is Employee);
    io:println(string `${employee.name} is ${employee.age} years old and knows ${employee.skills.toString()}.`);
}
```