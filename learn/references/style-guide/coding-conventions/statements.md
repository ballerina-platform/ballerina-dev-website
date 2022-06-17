---
layout: ballerina-style-guide-left-nav-pages-swanlake
title: Statements
description: The Ballerina Style Guide aims at maintaining a standard coding style among the Ballerina community. The Ballerina code formatting tools are based on this guide.
keywords: ballerina, programming language, ballerina style guide, statements
active: statements
permalink: /learn/style-guide/statements/
intro: The sections below include the coding conventions with respect to statements.
redirect_from:
  - /learn/style-guide/statements
  - /learn/coding-conventions/statements
  - /swan-lake/learn/coding-conventions/statements/
  - /swan-lake/learn/coding-conventions/statements
  - /learn/coding-conventions/statements/
  - /learn/coding-conventions/statements
  - /learn/user-guide/coding-conventions/statements
  - /learn/user-guide/coding-conventions/statements/
  - /learn/user-guide/code-organization/coding-conventions/statements/
  - /learn/user-guide/code-organization/coding-conventions/statements
  - /learn/user-guide/style-guide/coding-conventions/statements
  - /learn/user-guide/style-guide/coding-conventions/statements/

---

## If statement

* Avoid enclosing the condition with parentheses.
  
**Do's**

```ballerina
if true {
    ...
} else if false {
    ...
}
```
  
**Don'ts**


```ballerina
if (true) {
    ...
} else if (false) {
    ...
}
```

* Keep the `else` and `else if` keywords in the same line with the matching `if` or `else if` block's
  closing brace separated only by a single space.

### Empty block

* Do not have any empty `if`, `else if`, or `else` blocks.
* If empty, add an empty line between the opening and closing braces.
      
**Example,**

```ballerina
if inProperSallaryRange {
      
} else if inSallaryRange {
      
} else {
      
}
```

## Match statement

### Match patterns clause

* Block indent each pattern clause in its own line.
* Keep a single space before and after the `=>` sign.

**Example,**

```ballerina
function foo(string|int|boolean a) returns string {
    match a {
        12 => {
            return "Value is '12'";
        }
    }
  
    return "Value is 'Default'";
}
```

* If a pattern clause has more than one statement, block indent each statement in its own line.

**Example,**

```ballerina
match x {
    var (s, i) if s is string => {
        io:println("string");
    }
    var (s, i) if s is int => {
        io:println("int");
    }
}
```

* If the pattern body is empty, then keep it as an empty block.
  
  
  **Example,**

```ballerina
match x {
    var (s, i) if s is string => {}
    var (s, i) if s is int => {}
}
```
