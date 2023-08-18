---
title: 'Data immutability'
description: Immutable data ensures data integrity, simplifies reasoning about code, and reduces the potential for unexpected side effects. <br><br>Ballerina and Java approach data immutability differently. In Ballerina, immutability is emphasized by default, providing deep immutability for data. On the other hand, in Java, a `record` is considered to be shallowly immutable. 
url: https://github.com/ballerina-guides/integration-samples/blob/main/data-oriented-programming/immutability/ballerina/main.bal
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