---
title: 'Ballerina'
description: null
---
```
type Author record {
   string firstName;
   string lastName;
};

public function main() {
   Author author = {
       firstName: "Chiran",
       lastName: "Fernando"
   };
  
   author["fullName"] = "Chiran Fernando";
}
```