---
title: 'Java'
description: null
---
```
import java.util.Arrays;
import java.util.List;

record Employee(String name, int age, List<String> skills) {}

public class ImplicitAndExplicit {
    public static void main(String[] args) {
        // Creates a variable explicitly stating the type
        List<String> skills = Arrays.asList("Java", "Python", "SQL");

        // Creates a variable using type inference
        var employee = new Employee("John Doe", 30, skills);

        System.out.println(employee instanceof Employee);
        System.out.println("Name: " + employee.name());
        System.out.println("Age: " + employee.age());
        System.out.println("Skills: " + employee.skills());
    }
}
```