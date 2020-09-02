---
layout: ballerina-left-nav-pages-swanlake
title: Expressions
active: expressions
permalink: /swan-lake/learn/coding-conventions/expressions/
redirect_from:
  - /swan-lake/learn/style-guide/expressions/
  - /swan-lake/learn/style-guide/expressions
  - /swan-lake/learn/coding-conventions/expressions
---

# Expressions

- [Function Invocation](#function-invocation)
- [Record Literal](#record-literal)
- [Map Literal](#map-literal)
- [Tuple](#tuple)
- [Array Literal](#array-literal)
- [Type Casting](#type-casting)
- [Table Literal](#table-literal)

## Function Invocation

* Do not keep spaces between the function name and opening parentheses `(`.
  
* If it is unable to keep the function invocation in a single line due to it exceeding the max line length, split each argument to its own block-indented line.
    
**Example,**

```ballerina
    
setAgeForEmployee(
    employeeName,
    employeeID
   );
```

## Record Literal

* If empty, keep it as an empty block.
      
**Example,**

```ballerina
Person p = {};
```

* In a record literal, arrange the fields in a single line.
  Then, add a space after the comma and leave no spaces between the braces and fields.
      
**Example,**

```ballerina  
Person p = {name: "john", age: 20};
``` 

* Do not keep any spaces between the key and the colon. Also, Keep only one space between the colon and the value.
  
**Example,**

```ballerina
Person person = {
    name: "john", // in this field Key is the "name" and value is "john".
};
```

* You can define the fields in new lines. If so, make sure all the fields are in a separate line and they are block indented.

**Do's**

```ballerina
Person p = {
    name: "john",
    age: 20
};
``` 

**Don'ts**

```ballerina
Person p = {name: "john",
    age: 20};
  
//Or
  
Person p = {
name: "john",
age: 20
};
  
//Or
  
Person p = {
    name: "john",
    age: 20};
```

## Map Literal

* For Map literals, follow the same formatting guidelines as [record literals](/swan-lake/learn/style-guide/expressions#record-literal). 
  
**Example,**

```ballerina
  
// Inline map literal.
map<string> mapOfString1 = {name: "john", id: "0"};
  
// Mulitline map literal.
map<string> mapOfString2 = {
    name: "john",
    id: "0"
}
```

## Tuple

* Always, place a tuple in a single line.

**Example,**

```ballerina
[string, int] tuple = ["john", 20];
```

* If a tuple exceeds the maximum line length limit, move the whole tuple to a new line and indent with four spaces from the starting position of the statement or definition.
  
**Example,**

```ballerina
(string, int) tuple = 
(nameOfEmployee, ageOfTheEmployee);
```

## Array Literal

* Place simple arrays in a single line.
* Do not keep any spaces between the opening bracket, value, and the closing bracket.
  
**Example,**

```ballerina
string[] names = ["john", "doe", "jane", "doe"];
```

* If an array cannot be placed on a single line due to it exceeding the max line length, split each value in the array to its own block-indented line.
    
**Example,**

```ballerina
    
string[] names = [
    "john",
    "doe",
    "jane",
    "doe"
];
    
```

## Type Casting

* Do not keep spaces between the type and the angle brackets (i.e., `<string>`).
* Do not keep spaces between the closing angle bracket and value reference, which will be casted.

**Example,**

```ballerina
string name = <string>json.name;
```

* Avoid line breaks in type casting.
  
**Do's**

```ballerina
<string>
```
  
**Don'ts**

```ballerina
<
    string
>
```

## Table Literal

* Follow [record literals](/swan-lake/learn/style-guide/expressions#record-literal) formatting when formatting a table block.
  
**Example,**
  
```ballerina
table<Employee> employee1 = table {
    {key id, name, address}
};
      
table<Employee> employee2 = table {
    {
        key id,
        name,
        address
    },
    [{"1", "test", "No:123 hty RD"}, {"1", "john", "No:123"}]
};
      
table<Employee> employee3 = table {
    {id, name, address},
    [
        {"1", "john", "No:123"},
        {"2", "jane", "No:342"}
    ]
 };

table<Employee> employee4 = table {
    {id, name, address},
    [
        {
            "1",
            "john",
            "No:123"
        },
        {"2", "jane", "No:342"}
    ]
}
```
  