---
title: 'Java'
description: null
---
```
public static void processValue(Object value) {
   if (value instanceof Integer intVal) {
       Integer i = intVal;
       System.out.println("Received an integer: " + value);
   } else if (value instanceof Float floatVal) {
       Float f = floatVal;
       System.out.println("Received a float: " + value);
   } else if (value instanceof String str) {
       String s = str;
       System.out.println("Received a string: " + value);
   } else {
       Object obj = value;
       System.out.println("Received an unknown value: " + value);
   }
}


public static void main(String[] args) {
   processValue(10);       // Output: Received an integer: 10
   processValue(3.14f);    // Output: Received a float: 3.14
   processValue("Hello");  // Output: Received a string: Hello
   processValue(true);     // Output: Received an unknown value: true
}

```