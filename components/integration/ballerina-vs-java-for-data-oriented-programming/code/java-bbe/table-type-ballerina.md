---
title: 'Ballerina'
description: null
---
```
import ballerina/io;

// Define a type for tabular data
type Employee record {|
    readonly int id;
    string name;
    readonly string department;
    int salary;
|};

// Create an in-memory table with compound keys
table<Employee> key(id, department) employeeTable = table [
    {id: 1, name: "John Doe", department: "Engineering", salary: 5000},
    {id: 2, name: "Jane Smith", department: "Sales", salary: 4000}
];

public function main() {
    // Add an employee to the table
    employeeTable.add({id: 3, name: "William Smith", department: "Engineering", salary: 4500});

    // Adding duplicate record, throws KeyAlreadyExist error
    // employeeTable.add({id: 2, name: "Jane Smith", department: "Sales", salary: 5000});

    // Putting duplicate record, overrides the existing value
    employeeTable.put({id: 2, name: "Jane Smith", department: "Sales", salary: 5000});

    // Retrieve an employee using the compound key
    Employee? employee = employeeTable[1, "Engineering"];
    if (employee is Employee) {
        io:println("Employee Found: " + employee.name);
    } else {
        io:println("Employee Not Found");
    }

    // Calculate the total salary in the Engineering department
    int totalSalary = from var {department, salary} in employeeTable
        where department == "Engineering"
        collect int:sum(salary);
    io:println(string `Total Salary in Engineering Department: ${totalSalary}`);
}
```