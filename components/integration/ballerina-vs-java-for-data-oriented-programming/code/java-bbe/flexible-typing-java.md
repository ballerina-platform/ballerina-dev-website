---
title: 'Java'
description: null
---
```
import java.util.HashMap;
import java.util.Map;

final class PersonalDetails {
    String name;
    int age;

    PersonalDetails(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return "PersonalDetails{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}

final class EmployeeDetails {
    String designation;
    float salary;
    Map<String, Object> otherFields;

    EmployeeDetails(String designation, float salary, Map<String, Object> otherFields) {
        this.designation = designation;
        this.salary = salary;
        this.otherFields = otherFields;
    }

    @Override
    public String toString() {
        return "EmployeeDetails{" +
                "designation='" + designation + '\'' +
                ", salary=" + salary +
                ", otherFields=" + otherFields +
                '}';
    }
};

class Main {
    public static void main(String[] args) {
        // Create a new PersonalDetails populating defined fields
        PersonalDetails personalDetails = new PersonalDetails("John Doe", 30);

        // Access and modify defined fields
        personalDetails.name = "Jane Smith";
        personalDetails.age = personalDetails.age + 1;

        // Create a new EmployeeDetails with dynamic fields
        EmployeeDetails employeeInfo = new EmployeeDetails("n/a", 3000.0f,
                convertToMap(personalDetails));

        // Access and modify defined fields
        employeeInfo.designation = "Software Engineer";
        employeeInfo.salary = 5000.0f;

        // Access and modify dynamically added fields
        employeeInfo.otherFields.put("name", "John Smith");

        // Add a new dynamic field
        employeeInfo.otherFields.put("address", "123 Main St");

        // Print the updated data
        System.out.println(personalDetails);
        System.out.println(employeeInfo);
    }

    static Map<String, Object> convertToMap(Object obj) {
        Map<String, Object> map = new HashMap<>();
        for (var field : obj.getClass().getDeclaredFields()) {
            try {
                map.put(field.getName(), field.get(obj));
            } catch (IllegalAccessException ignored) {
            }
        }
        return map;
    }
}
```