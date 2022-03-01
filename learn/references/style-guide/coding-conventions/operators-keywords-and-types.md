---
layout: ballerina-style-guide-left-nav-pages-swanlake
title: Operators, keywords, and types
description: The Ballerina Style Guide aims at maintaining a standard coding style among the Ballerina community. The Ballerina code formatting tools are based on this guide.
keywords: ballerina, programming language, ballerina style guide, operators, keywords, types
active: operators-keywords-and-types
permalink: /learn/style-guide/operators-keywords-and-types/
intro: The sections below include the coding conventions with respect to operators, keywords, and types.
redirect_from:
  - /learn/style-guide/operators_keywords_and_types
  - /learn/coding-conventions/operators_keywords_and_types
  - /swan-lake/learn/coding-conventions/operators_keywords_and_types/
  - /swan-lake/learn/coding-conventions/operators_keywords_and_types
  - /learn/coding-conventions/operators_keywords_and_types/
  - /learn/coding-conventions/operators_keywords_and_types
  - /learn/user-guide/coding-conventions/operators_keywords_and_types
  - /learn/user-guide/coding-conventions/operators_keywords_and_types/
  - /learn/user-guide/code-organization/coding-conventions/operators_keywords_and_types/
  - /learn/user-guide/code-organization/coding-conventions/operators_keywords_and_types
  - /learn/user-guide/style-guide/coding-conventions/operators-keywords-and-types
  - /learn/user-guide/style-guide/coding-conventions/operators-keywords-and-types/
---

## Keywords and Types
* Do not keep spaces between the type and the pipe operator when it is in a union type (e.g., `string|int`).
  
**Example,**

```ballerina
type method "POST"|"GET"|"PUT";
    
(int|string) variable = 0;
  
function getValue(string key) returns (string|error) {
    ...
}
  
function getName() returns string|error {
    (string|error) valueOrError = getValue("name");
    ...
}
```

* Do not keep spaces between the type and the optional operator `?`.
  
**Example,**

```ballerina
string? name;
```

* Avoid line breaks inside constrained types.
  
**Do's**

```ballerina
map<int|string> x;// map reference type
```
  
**Don'ts**

```ballerina
map<
    int
    |
    string
> x;
```

## Operators
* Keep only a single space before and after the `=` operator.
  
**Example,**

```ballerina
int a = 0;
```

* Do not keep spaces around the semicolon `;`.
* Do not keep spaces between the unary operator and the expression.

**Example,**

```ballerina
a = -a;
``` 

* Keep a single space before and after any `binary` or `ternary` operator.

**Example,**

```ballerina
var fullName = firstName + lastName;
  
string|() name = isNameAvailable() ? getName() : "Unknown";
  
var elvisOperator = name ?: "Unknown";
```

* Keep a single space before and after a compound operator such as `-=` and `+=`.

**Example,**

```ballerina
name += lastName;
```

* When accessing a function, object, class or record from another module, do not keep spaces around `:`.
  
**Example,**
  
```ballerina
io:println("john");
http:Response res = new();
```

<div class="cGitButtonContainer"><p data-button="iGitStarText">"Star"</p><p data-button="iGitWatchText">"Watch"</p></div>


<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;display: none;} </style>