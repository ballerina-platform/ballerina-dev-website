---
title: 'Ballerina'
description: null
---
```
type Employee record {|
    string name;
    int age;
    string[] skills;
|};

public function main() {
    string[] skills = ["Java", "Python", "SQL"];
    var employee = {
        name: "John Doe",
        age: 30,
        skills: skills
    };

    io:println("Name: " + employee.name);
    io:println("Age: " + employee.age);
    io:println("Skills: " + employee.skills);
}
```