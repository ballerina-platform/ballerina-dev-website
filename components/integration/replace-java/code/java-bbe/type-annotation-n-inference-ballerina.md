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

    io:println("Name: " + employee.name);
    io:println("Age: " + employee.age.toString());
    io:println("Skills: " + employee.skills.toString());
}
```