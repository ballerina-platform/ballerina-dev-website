---
title: 'Ballerina'
description: null
---
```
type Student record {|
    int grade;
    string name;
    map<int> marks;
|};

public function main() {
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

    // student.grade = 11; // Compile time error

    // student.marks["Maths"] = 80; // Compile time error
}
```