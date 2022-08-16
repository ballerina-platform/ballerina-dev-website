---
layout: ballerina-style-guide-left-nav-pages-swanlake
title: Coding conventions
description: The Ballerina Style Guide aims at maintaining a standard coding style among the Ballerina community. The Ballerina code formatting tools are based on this guide.
keywords: ballerina, programming language, ballerina style guide
permalink: /learn/style-guide/coding-conventions/
active: coding-conventions
intro: This Ballerina Style Guide aims at maintaining a standard coding style among the Ballerina community. Therefore, the Ballerina code formatting tools are based on this guide.
redirect_from:
  - /learn/style-guide/
  - /learn/style-guide
  - /swan-lake/learn/coding-conventions/
  - /swan-lake/learn/coding-conventions
  - /learn/coding-conventions/
  - /learn/coding-conventions
  - /learn/user-guide/coding-conventions
  - /learn/user-guide/coding-conventions/
  - /learn/user-guide/code-organization/coding-conventions
  - /learn/user-guide/code-organization/coding-conventions/
  - /learn/user-guide/style-guide/coding-conventions
  - /learn/user-guide/style-guide/coding-conventions/
  - /learn/user-guide/style-guide/
  - /learn/user-guide/style-guide
  - /learn/style-guide/coding-conventions
---

## Indentation and line length
* Use four spaces (not tabs) for each level of indentation.
* Keep the maximum length of a line to 120 characters. 

> **Note:** You can configure tools and plugins to use spaces when indenting and to change the maximum number of characters in a line.

## Line spacing

* Use only a single space to separate keywords, types, and identifiers. 
   
**Do's**

```ballerina
public function getFullName() returns string {
    string fullName = "john doe";
    return fullName;
}
```

**Don'ts**

```ballerina
public   function   getFullName()   returns   string {
    string   fullName = "john doe";
    return     fullName;
}
```

Few exceptions for this rule are:
- Do not keep spaces around a type when it is enclosed using angle brackets `<string>`. 
      
**Example,**

```ballerina
map<string> names = {};
```

- Do not keep spaces between the type and the opening bracket in the array definition `string[]`.
      
**Example,**

```ballerina
    string[] names = [];
```

* If it is a list of values separated by commas, add only a single space after each comma and don't add spaces before the comma.
  
**Example,**

```ballerina
[string, int, boolean] tupleVar = ["", 0, false];

int[] arrayOfInteger = [1, 2, 3, 4];

map<string> stringMap = {one: st1, two: st2, three: st3};

Person personRecord = {name: "marcus", id: 0};

function foo(string name, int id) {
}
    
service / on ep1, ep2 {
    ...
}
```

## Blank lines

Separate both statements and top-level definitions by zero or one blank lines.

**Example,**
  
```ballerina
import ballerina/http;
import ballerina/io;

const string CITY = "Colombo";
const int CITY_NO = 1;

function getName() returns string {
    string firstName = "john";
    string lastName = "doe";

    return firstName + lastName;
}

function setName(string name) {
}

function setAge(int age) {
}
```
 
## Blocks
* Opening curly braces of a block should be placed inline.
  
**Do's**

```ballerina
if true {
}
  
function setName(string name) {
    ...
}
```

**Don'ts**

```ballerina
if true
{
    
}

function setName(string name)
{
  
}
```

* Add a single space before the opening curly braces. 

**Example,**

```ballerina

function func1() {
    if true {
    }
}

```

* If an inline block is empty, do not keep spaces in between the opening and closing braces.
  
**Example,**

```ballerina
function func1() {
}
``` 

* Indent all the statements inside a block to be at the same level.
* Indent the closing brace of a block to align it with the starting position of the block statement.

**Example,**
  
```ballerina
if false {
   int x = 2;
   string a = "hello";
}
  
match a {
   ...
}
```

## Parentheses and brackets
* Do not have spaces after opening parenthesis/bracket and before closing parenthesis/bracket.
  
**Example,**

```ballerina
[string, int] tupleVar = ["", 0];

function setValue(string value) {
    ...
}

public function main() {
   setValue("value");
}
```

* To define empty parentheses/brackets, do not keep spaces between the opening and closing parentheses/brackets. i.e. `()` ,`[]`.
  
**Example,**

```ballerina
int[] a = [];
int|() result = getResult();
```
  
## Line breaks

* Have only one statement in a line.
* When splitting lines, which contain operator(s), split them right before an operator.
  
**Example,**
  
```ballerina
// Binary operations.
string s = "added " + People.name
    + " in to database.";
  
// Function invocation.
string s = person
    .getName();
  
// Binary operations in if condition
if isNameAvailable
    && (i == 1) {
    ...
}
```

* When splitting lines, which contains separator(s), split them right after a separator.
  
**Example,**
    
```ballerina
// Function parameters.
function getName(int id, int age,
    string searchValue) returns string {
    ...
}
```

* If there isn't any operator or separator to break the line from, move the whole expression to a new line.
  
**Example,**

```ballerina
// String literal.
string s1 =
    "My name is not in this description";
  
// Function invocation.
string s2 =
    getPersonNameWithUpperCaseLetters();
``` 

* If a line exceeds the maximum line length, start from the end of the line and come towards the start of the line until you find a point, which matches the above rules to break the line.
* Indent split lines with relation to the starting position of the statement or definition.
  
**Example,**

```ballerina
if isNameAvailable
    && (i == 1) {
    ...
}
  
// Function parameters.
function getName(int id, int age,
    string searchValue) returns string {
    ...
}
```  

* However, if you cannot add the type-casting expression or statement with the constrained type in a single line 
  due to it exceeding the max line length, 
  - move the casting type with the operators to a new line.
  
**Example,**
      
```ballerina
string name =
    <string>person.name;
```
  
  - keep the constrained type on the same line by splitting the statement from a point before the constraint type.
      
**Example,**

```ballerina
map<int|string> registry = {
    name: "marcus"
};
```

<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
