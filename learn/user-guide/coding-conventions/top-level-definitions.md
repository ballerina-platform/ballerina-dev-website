---
layout: ballerina-left-nav-pages-swanlake
title: Top-Level Definitions
active: definitions
permalink: /learn/user-guide/coding-conventions/top-level-definitions/
intro: The sections below include the coding conventions with respect to top-level definitions.
redirect_from:
  - /learn/style-guide/definitions/
  - /learn/style-guide/definitions
  - /learn/coding-conventions/definitions
  - /learn/coding-conventions/top-level-definitions
  - /swan-lake/learn/coding-conventions/top-level-definitions/
  - /swan-lake/learn/coding-conventions/top-level-definitions
  - /learn/coding-conventions/top-level-definitions/
  - /learn/coding-conventions/top-level-definitions
  - /learn/user-guide/coding-conventions/top-level-definitions
---

## General Practices

* Do not indent the top-level definitions. 
  
**Do's**

```ballerina

import ballerina/http;

const int MIN_AGE = 20;
int repetitions = 0;
    
service hello on ep1 {
    ...
}

```

**Don'ts**
  
```ballerina
// This import is indented correctly.
import ballerina/http; 
    
    const int MIN_AGE = 20; // Not indented correctly.
    int repetitions = 0; // Not indented correctly.
        
// Not indented correctly.
service hello on ep1 {
    ...
    }
        
```

- [Imports](#imports)
- [Function Definition](#function-definition)
- [Service Definition](#service-definition)
- [Object Definition](#object-definition)
- [Record Definition](#record-definition)
- [Referencing Record or Abstract Object](#referencing-record-or-abstract-object)

## Imports

* Do not keep spaces between the organization name, divider `/`, and module name.

**Example,**

```ballerina
import ballerina/http;
```

* Imports should be sorted alphabetically, first by the organization name and then by the module name.

## Function Definition
* Do not keep spaces between the function name and the open parentheses `(` of the function signature.

**Example,**

```ballerina
function func1() {
}
```

* If the function needs to be split into new lines due to it exceeding the max line length,
  - can break lines from the parameter list by moving a parameter value only to a 
    new line and indenting it with four spaces from the starting position of the function.
    
**Example,**

```ballerina
function getAddress(int value,
    string name) returns (string|()) {
    ...
}
```

- can break before the `returns` keyword and indent it with four spaces from the starting position of the function.
    
**Example,**

```ballerina
function getAddress(int value, string name)
    returns (string|()) {
    ...
}    
```

- can break after the `returns` keyword by moving the return value to a new line
    and indenting it with four spaces from the starting position of the function.
    
**Example,**

```ballerina
function getAddress(int value, string name) returns
    (string|()) {
    ...
}          
```

## Service Definition

* Keep the listener inline with the service signature.
  
**Example,**

```ballerina
service / on new http:Listener(9090) {
  ...
}
```

* When formatting service-level function definitions, block indent each element and
  follow the [function formatting guidelines](/learn/coding-conventions/top-level-definitions#function-definition).
  
**Example,**

```ballerina
import ballerina/http;

service / on new http:Listener(9090) {

    resource function get greeting() returns string {
        return "Hello, World!";
    }
    
}
```

* Block indent each function definition, resource definition, and field definition inside a service definition.
 
## Class Definition

* Block indent each field definition and each function definition on their own line.
* Init function should be placed before all the other functions. 
* For function definitions in the class definition, follow the [function formatting guidelines](/learn/coding-conventions/top-level-definitions#function-definition).

**Example,**

```ballerina
class Person {
    public boolean isMarried = false;
    int age;
    string name;

    function init(string name, int age = 0) {
        self.age = age;
        self.name = name;
    }

    function getName() returns string {
        return self.name;
    }

    function setIsMarried(boolean isMarried) {
        self.isMarried = isMarried;
    }

    function getIsMarried() returns boolean {
        return self.isMarried;
    }
}
```

## Record Definition
Block indent each of the field definitions (including the Rest field) in their own line.

**Example,**

```ballerina
type Person record {
    string name;
    int...;
}

// or

type Person record {|
    int id;
    string name;
|}
```

## Referencing Record or Object 
* Do not keep spaces between the `*`, the abstract object name, or the record name.
  
**Example,**
  
```ballerina
*Person;
```
* Also, block-indent.

**Example:**

```ballerina
type UserId record {
    string id = "";
};
  
type User record {
    *UserId; // Reference to UserId record.
    string name = "john";
    int age = 20;
};

// or
type Person object {
    string name;

    // Object function definitions.
    function getName() returns string;
};

class Employee {
    *Person; // Reference to Person object type.

    function init() {
        self.name = "John Doe";
    }

    function getName() returns string {
        return self.name;
    }
}
```

<div class="cGitButtonContainer"><p data-button="iGitStarText">"Star"</p><p data-button="iGitWatchText">"Watch"</p></div>


<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
