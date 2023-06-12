---
title: 'Java'
description: null
---
```
record Employee(String name, int age, List<String> skills) {}

public class Main {
    public static void main(String[] args) {
        // Creates a variable explicitly stating the type
        List<String> skills = Arrays.asList("Java", "Python", "SQL");

        // Creates a variable using type inference
        var employee = new Employee("John Doe", 30, skills);
        
        System.out.println("Name: " + employee.getName());
        System.out.println("Age: " + employee.getAge());
        System.out.println("Skills: " + employee.getSkills());
    }
}
```