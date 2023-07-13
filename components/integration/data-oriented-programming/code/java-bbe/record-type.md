---
title: 'Model data as data'
description: Data-oriented programming promotes the idea of representing data in its purest form. Ballerina's records simplify this approach, enabling concise and effective data representation.
url: https://github.com/ballerina-guides/integration-samples/blob/main/data-oriented-programming/model-data-as-data/ballerina/main.bal
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