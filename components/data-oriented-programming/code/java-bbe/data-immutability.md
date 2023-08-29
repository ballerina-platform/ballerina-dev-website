---
title: 'Data immutability'
description: Immutable data is a key aspect that ensures data integrity, simplifies code reasoning, and minimizes the risk of unexpected side effects. <br><br>In Ballerina, immutability is emphasized by default, offering deep immutability for data. This approach promotes a safer programming environment, where data remains unchanged once created, enhancing code reliability and predictability.
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