---
title: 'Java'
description: null
---
```
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class Main {
    record Student(int grade, String name, Map<String, Integer> marks) {}

    public static void main(String[] args) {
        final int x = 10;
        // x = 20; // Error: Cannot assign a new value to final variable

        Map<String, Integer> marks = new HashMap<>();
        marks.put("Maths", 75);
        marks.put("English", 90);

        Student student = new Student(12, "John", Collections.unmodifiableMap(marks));
        
//      student.grade = 11; // Error: Cannot assign a new value to final field
//      student.marks.put("English", 95); // Disallowed at runtime
    }
}
```