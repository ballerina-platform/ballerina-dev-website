---
title: "Java"
description: null
---

```
enum UserType {
  ADMIN, 
  GUEST, 
  MEMBER
}

record User(int id, String name, UserType userType) {
  public User(int id, String name) {
     this(id, name, UserType.GUEST);
  }
}

class Main {
  public static void main(String[] args) {
    User user = new User(1, "John Doe");
    System.out.printf("User '%s' with id '%s' as '%s' created successfully",
user.name(), user.id(), user.userType());
  }
}
```