---
title: "Java"
description: null
---

```
import java.util.UUID;

record Customer(UUID id, String name) {
    public Customer(String name) {
        this(UUID.randomUUID(), name);
    }
}

public class RecordType {
    public static void main(String[] args) {
        Customer customer = new Customer("John Doe");
        System.out.printf("Customer '%s' with id '%s' created successfully", customer.name(), customer.id());
    }
}
```