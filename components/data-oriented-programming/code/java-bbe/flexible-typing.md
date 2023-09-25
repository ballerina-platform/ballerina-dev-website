---
title: 'Be conservative in what you send, be liberal in what you accept'
description: Ballerina employs "be conservative in what you send, be liberal in what you accept" by using structural types that support openness. <br><br>These types serve a dual purpose, enhancing static typing within programs and describing service interfaces accurately. While outgoing messages are tightly controlled to ensure protocol adherence, incoming data is handled with a degree of flexibility. The result is a balance of strictness and tolerance that enhances interoperability and resilience. This makes Ballerina a robust and adaptable choice for constructing cloud-native applications.
url: https://github.com/ballerina-guides/integration-samples/blob/main/data-oriented-programming/model-constrained-flexible-data/ballerina/main.bal
---
```
import ballerina/io;

// closed record
type PersonalDetails record {|
    string name;
    int age;
|};

// open record
type EmployeeDetails record {
    string designation;
    float salary;
};

public function main() {
    // Create a new employee record with closed fields
    PersonalDetails personalDetails = {name: "John Doe", age: 30};

    // Access and modify closed record fields using dot notation
    personalDetails.name = "Jane Smith";
    personalDetails.age = personalDetails.age + 1;

    // Create a new employee record with open and closed fields
    EmployeeDetails employeeInfo = {designation: "n/a", salary: 3000.0, ...personalDetails};

    // Access and modify open record fields using dot notation
    employeeInfo.designation = "Software Engineer";
    employeeInfo.salary = 5000.0;

    // Access and modify record fields using bracket notation
    employeeInfo["name"] = "John Smith";

    // Add a new field to the employee record
    employeeInfo["address"] = "123 Main St";

    // Print the updated employee information
    io:println(personalDetails);
    io:println(employeeInfo);
}
```