---
title: 'Java'
description: null
---
```
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        // Create a stream of integers
        Arrays.stream(new int[]{1, 2, 3, 4, 5})
                // Filter even numbers and map to their squares
                .filter(x -> x % 2 == 0)
                .map(x -> x * x)
                // Consume the resulting stream and print the values
                .forEach(System.out::println);
    }
}
```