---
title: 'Java'
description: null
---
```
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

class Main {
    record Student(int grade, String name, Map<String, Integer> marks) {}

    public static void main(String[] args) {
        Map<String, Integer> marks = new HashMap<>();
        marks.put("Maths", 75);
        marks.put("English", 90);

        Student student1 = new Student(12, "John", marks);

        // student1.course.credits = 4; // Compile time error
        // student1.marks = new HashMap<>(); // Compile time error

        student1.marks.put("English", 95); // Shallow immutability

        Student student2 = new Student(12, "John", Collections.unmodifiableMap(marks));
        student2.marks.put("English", 95); // Fails at runtime
    }
}
```