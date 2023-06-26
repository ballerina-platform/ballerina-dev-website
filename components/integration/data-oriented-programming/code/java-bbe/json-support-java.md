---
title: 'Java'
description: null
---
```
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

record Employee(int id, String name, String department) {}

class Main {
    public static void main(String[] args) {

        String jsonStr = "{" +
                "\"employees\":[" +
                        "{" +
                            "\"id\":1," +
                            "\"name\":\"John Doe\"," +
                            "\"department\":\"Engineering\"" +
                        "}," +
                        "{" +
                            "\"id\":2," +
                            "\"name\":\"Jane Smith\"," +
                            "\"department\":\"Sales\"" +
                        "}," +
                        "{" +
                            "\"id\":3," +
                            "\"name\":\"Bob Johnson\"," +
                            "\"department\":\"Finance\"" +
                        "}" +
                    "]" +
                "}";

        // Parse the JSON string
        Gson gson = new Gson();
        JsonObject jsonObj = gson.fromJson(jsonStr, JsonObject.class);

        // Navigate and convert to JSON array
        JsonArray employeesArray = jsonObj.getAsJsonArray("employees");

        // Get the first employee's name
        JsonObject firstEmployee = employeesArray.get(0).getAsJsonObject();
        String firstEmpName = firstEmployee.get("name").getAsString();
        System.out.println(firstEmpName);

        // Convert the JSON array to an Employee records array
        Employee[] employeesWrapper = gson.fromJson(employeesArray, Employee[].class);

        // Print all employee names
        for (Employee employee : employeesWrapper) {
            System.out.println(employee.name());
        }
    }
}
```