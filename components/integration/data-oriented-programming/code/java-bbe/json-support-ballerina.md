---
title: 'Ballerina'
description: null
---
```
import ballerina/io;

type Employee record {
    int id;
    string name;
    string department;
};

public function main() returns error? {
    json inputJson = {
        "employees": [
            {
                "id": 1,
                "name": "John Doe",
                "department": "Engineering",
                "address": {
                    "apt": "1001",
                    "street": "10 Downing Street",
                    "city": "London",
                    "country": "UK"
                }
            },
            {
                "id": 2,
                "name": "Jane Smith",
                "department": "Sales"
            },
            {
                "id": 3,
                "name": "Bob Johnson",
                "department": "Finance",
                "address": {
                    "apt": "1002",
                    "street": "10 Downing Street",
                    "city": "London",
                    "country": "UK"
                }
            }
        ]
    };

    // Navigate to the employees array
    json empJson = check inputJson.employees;

    // Convert the JSON to a JSON array
    json[] jsonArr = check empJson.cloneWithType();

    // Get the first employee's name
    string firstEmpName = check jsonArr[0].name;
    io:println(firstEmpName);

    // Navigate optioanlly to the first employee's address
    string? firstEmpAptNum = check jsonArr[0]?.address?.apt;
    io:println(firstEmpAptNum);

    string? secondEmpAptNum = check jsonArr[1]?.address?.apt;
    io:println(secondEmpAptNum.toBalString());

    // Convert the JSON array to an Employee records array
    Employee[] employees = check empJson.cloneWithType();

    foreach var item in employees {
        io:println(item.name);
    }
}
```