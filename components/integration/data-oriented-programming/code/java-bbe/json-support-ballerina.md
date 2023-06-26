---
title: 'Ballerina'
description: null
---
```
type Employee record {|
    int id;
    string name;
    string department;
|};

public function main() returns error? {
    json inputJson = {
        "employees": [
            {
                "id": 1,
                "name": "John Doe",
                "department": "Engineering"
            },
            {
                "id": 2,
                "name": "Jane Smith",
                "department": "Sales"
            },
            {
                "id": 3,
                "name": "Bob Johnson",
                "department": "Finance"
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

    // Convert the JSON array to an Employee records array
    Employee[] employees = check empJson.cloneWithType();

    foreach var item in employees {
        io:println(item.name);
    }
}
```