---
title: 'Java'
description: null
---
```
record Author(String firstName, String lastName) {};

record AuthorWithFullName(Author author, String fullName) {};

public static void main(String[] args) {
   Author author = new Author("Chiran", "Fernando");
   AuthorWithFullName authorWithFullName = new AuthorWithFullName(author, author.firstName() + author.lastName());
   System.out.println(authorWithFullName);
}
```