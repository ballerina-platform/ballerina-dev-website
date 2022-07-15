---
layout: ballerina-style-guide-left-nav-pages-swanlake
title: Expressions
description: The Ballerina Style Guide aims at maintaining a standard coding style among the Ballerina community. The Ballerina code formatting tools are based on this guide.
keywords: ballerina, programming language, ballerina style guide, expressions
active: expressions
permalink: /learn/style-guide/expressions/
intro: The sections below include the coding conventions with respect to expressions.
redirect_from:
  - /learn/style-guide/expressions
  - /learn/coding-conventions/expressions
  - /swan-lake/learn/coding-conventions/expressions/
  - /swan-lake/learn/coding-conventions/expressions
  - /learn/coding-conventions/expressions/
  - /learn/coding-conventions/expressions
  - /learn/user-guide/coding-conventions/expressions
  - /learn/user-guide/coding-conventions/expressions/
  - /learn/user-guide/code-organization/coding-conventions/expressions/
  - /learn/user-guide/code-organization/coding-conventions/expressions
  - /learn/user-guide/style-guide/coding-conventions/expressions
  - /learn/user-guide/style-guide/coding-conventions/expressions/
---

## Function invocation

* Do not keep spaces between the function name and opening parentheses `(`.
  
* If it is not possible to keep the function invocation in a single line due to it exceeding the maximum line length, split it into a new line based on the best practices given in [Line breaks](/learn/style-guide/coding-conventions/#line-breaks).
    
**Example,**

```ballerina
setAgeForEmployee(employeeName,
    employeeID);
```

## Record literal

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

* Do not keep any spaces between the key and the colon. Also, keep only one space between the colon and the value.
  
**Example,**

```ballerina
Person person = {
    name: "john" // in this field key is the "name" and value is "john".
};
```

* You can define the fields in new lines. If you do so, make sure each field is in a separate line and is block-indented.

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

## Map literal

* For map literals, follow the same formatting guidelines as [Record literals](/learn/style-guide/expressions/#record-literal).
  
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
[string, int] tuple = 
    [nameOfEmployee, ageOfTheEmployee];
```

## Array literal

* Place simple arrays in a single line.
* Do not keep any spaces between the opening bracket, value, and the closing bracket.
  
**Example,**

```ballerina
string[] names = ["john", "doe", "jane", "doe"];
```

* If an array cannot be placed on a single line due to it exceeding the maximum line length, split each value in the array to its own block-indented line.
    
**Example,**

```ballerina
string[] names = [
    "john",
    "doe",
    "jane",
    "doe"
];
```

## Type casting

* Do not keep spaces between the type and the angle brackets (i.e., `<string>`).
* Do not keep spaces between the closing angle bracket and value reference, which will be casted.

**Example,**

```ballerina
string name = <string>person.name;
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

## Table literal

* Follow the formatting guidelines of [Record literals](/learn/style-guide/expressions/#record-literal) when formatting a table block.
  
**Example,**
  
```ballerina
type Employee record {
    readonly int id;
    string name;
    float salary;
};

type EmployeeTable table<Employee> key(id);

public function main() {

    EmployeeTable employeeTab = table [
        {id: 1, name: "John", salary: 300.50},
        {id: 2, name: "Bella", salary: 500.50},
        {id: 3, name: "Peter", salary: 750.0}
    ];
}
```
  
<div class="cGitButtonContainer"><p data-button="iGitStarText">"Star"</p><p data-button="iGitWatchText">"Watch"</p></div>


<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;display: none;} </style>
