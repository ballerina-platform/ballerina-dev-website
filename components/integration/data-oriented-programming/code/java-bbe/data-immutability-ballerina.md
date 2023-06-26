---
title: 'Ballerina'
description: null
---
```
const int x = 10;

type Student record {|
    int grade;
    string name;
    map<int> marks;
|};

public function main() {
    // x = 20; // Error: Cannot assign a new value to immutable variable
    
    Student & readonly student = {
        grade: 12,
        name: "John",
        // The applicable contextually-expected type for marks now is `map<int> & readonly`.
        // Thus, the value for marks will be constructed as an immutable map.
        marks: {
            "Maths": 75,
            "English": 90
        }
    };
    // student.grade = 11; // Error: Cannot assign a new value to readonly field
    // student.marks["Maths"] = 80; // Error: Cannot assign a new value to readonly field
}
```