---
title: "Java"
description: null
---

```
enum UserType {
    ADMIN,
    CUSTOMER,
    GUEST
}

record User(int id, String name, UserType userType) {
    public User(int id, String name) {
        this(id, name, UserType.GUEST);
    }
}

class Main {
    public static void main(String[] args) {
        User customer = new User(1, "John Doe");
        System.out.printf("User '%s' with id '%s' as '%s' created successfully",
                customer.name(), customer.id(), customer.userType());
    }
}
```