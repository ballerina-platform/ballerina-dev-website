---
title: 'Java'
description: null
---
```
public class Immutability {
    public class Main {
        public static void main(String[] args) {
            final int x = 10;
            // x = 20; // Error: Cannot assign a new value to final variable

            final StringBuilder sb = new StringBuilder("Hello");
            sb.append(", World"); // Modifying the state of the StringBuilder object

            System.out.println(sb.toString()); // Output: Hello, World
        }
    }

}
```