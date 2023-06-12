---
title: 'Ballerina'
description: null
---
```
public function processValue(any value) {
   if value is int {
       int _ = value;
       io:println("Received an integer: " + value.toString());
   } else if value is float {
       float _ = value;
       io:println("Received a float: " + value.toString());
   } else if value is string {
       string _ = value;
       io:println("Received a string: " + value);
   } else {
       any _ = value;
       io:println("Received an unknown value: " + value.toString());
   }
}


public function main() {
   processValue(10);       // Output: Received an integer: 10
   processValue(3.14);     // Output: Received a float: 3.14
   processValue("Hello");  // Output: Received a string: Hello
   processValue(true);     // Output: Received an unknown value: true
}
```