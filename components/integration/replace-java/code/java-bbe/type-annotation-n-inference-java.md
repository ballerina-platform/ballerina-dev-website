---
title: 'Java'
description: null
---
```
record Employee(String name, int age, List<String> skills) {}

public class Main {
    public static void main(String[] args) {
        List<String> skills = Arrays.asList("Java", "Python", "SQL");
        var employee = new Employee("John Doe", 30, skills);
        
        System.out.println("Name: " + employee.getName());
        System.out.println("Age: " + employee.getAge());
        System.out.println("Skills: " + employee.getSkills());
    }
}
```