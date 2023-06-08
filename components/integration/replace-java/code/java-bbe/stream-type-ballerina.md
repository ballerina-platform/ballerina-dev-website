---
title: 'Ballerina'
description: null
---
```
import ballerina/io;

public function main() {
    // Create a stream of integers
    [1, 2, 3, 4, 5].toStream()
    // Filter even numbers and map to their squares
    .filter(x => x % 2 == 0).map(x => x * x)
    // Consume the resulting stream and print the values
    .forEach(x => io:println(x));
}
```