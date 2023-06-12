---
title: 'Java'
description: null
---
```
import java.util.HashMap;
import java.util.Map;

record Person(String name, int age) {};

public class TableType {
        public static void main(String[] args) {
            // Create a Map to store a collection of Person objects
            Map<String, Person> personMap = new HashMap<>();

            // Add objects to the map
            personMap.put("John", new Person("John", 30));
            personMap.put("Jane", new Person("Jane", 25));
            
            // Adding duplicate map key, overrides the existing value
            personMap.put("Jane", new Person("Jane", 45));

            // Retrieve objects from the map
            Person john = personMap.get("John");
            Person jane = personMap.get("Jane");

            // Print the retrieved objects
            System.out.println(john.name() + ": " + john.age());
            System.out.println(jane.name() + ": " + jane.age());
        }
}
```