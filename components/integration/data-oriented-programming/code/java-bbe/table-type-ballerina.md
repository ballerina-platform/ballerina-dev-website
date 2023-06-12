---
title: 'Ballerina'
description: null
---
```
import ballerina/io;

type Person record {|
    readonly string name;
    int age;
|};

public function main() {
    // Create a table to store a collection of Person records
    table<Person> key(name) personTable = table [];

    // Add records to the table
    personTable.add({name: "John", age: 30});
    personTable.add({name: "Jane", age: 25});

    // Retrieve records from the table
    Person john = personTable.get("John");
    Person jane = personTable.get("Jane");

    // Adding duplicate table key, throws KeyAlreadyExist error
    // personTable.add({name: "Jane", age: 45});

    // Putting duplicate table key, overrides the existing value
    personTable.put({name: "Jane", age: 45});

    // Print the retrieved records
    io:println(john.name + ": " + john.age.toString());
    io:println(jane.name + ": " + jane.age.toString());
}
```