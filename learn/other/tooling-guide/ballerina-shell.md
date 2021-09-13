---
layout: ballerina-tooling-guide-left-nav-pages-swanlake
title: Ballerina Shell
permalink: /learn/tooling-guide/ballerina-shell/
description: The Ballerina Shell is a Read-Evaluate-Print Loop (REPL) for Ballerina.
active: ballerina-shell
intro: The Ballerina Shell is a Read-Evaluate-Print Loop (REPL) for Ballerina.
redirect_from:
  - /learn/tooling-guide/ballerina-shell
redirect_to:
  - /learn/
---

It allows you to evaluate snippets of code without having to write complete programs. 

This will particularly be useful if you are looking to try out the language and its new features, and also for debugging purposes.

## Setting up the Prerequisites

The Ballerina Shell is a part of the Ballerina distribution. It was first shipped with Ballerina Swan Lake Alpha1. Therefore, if you are using Swan Lake Alpha1 or a later version, you are all set. If not, for information on installing the latest version of Ballerina, see [downloads](https://ballerina.io/downloads/).

## Starting the Shell

Execute the command below to start Ballerina Shell.

```bash
$ bal shell
Welcome to Ballerina Shell REPL.
Type /exit to exit and /help to list available commands.

=$ 
```

## Stopping the Shell

Execute the `/exit` command to exit the Shell.

```bash
=$ /exit                                                                                                                                                                                                           
| Bye!!!
```

## Evaluating Code Snippets

The types of code snippets below are supported in the Shell.

- Import declarations
- Module-level declarations (except services)
- Statements
- Expressions

### Importing a Module

A module can be imported as follows. Once a module is imported, it can be used in any subsequent snippet run in that particular Shell session. This is true for other module-level declarations as well.

```bash
=$ import ballerina/io
```

Execute the `/imports` command to view the list of the imported modules.

```bash
=$ /imports
| ('io) import ballerina/'io as 'io;
```

### Executing Statements

Any valid Ballerina statement can be evaluated in the Shell. The example below evaluates a variable declaration statement.

```bash
=$ string name = "Ballerina Shell" 
```


### Evaluating Expressions

An expression always produces a value when evaluated. You can use the Shell to evaluate any arbitrary expression. It will output the result of the evaluation.

```bash
=$ 10 + 20 * 5                                                                                                                                                                                                       
110
```

A reference to a variable is also an expression. Thus, evaluating the name of the previously-defined variable will return its value.

```bash
=$ name                                                                                                                                                                                                            
"Ballerina Shell"
```

###  Defining Types

Type definitions can be written just as you write them in a source file. The Shell supports multi-line snippets.

```bash
=$ type Person record {                                                                                                                                                                                              
 > string name;
 > int age;
 > }
```

Execute the `/dclns` command to view the defined types (and other module-level declarations).

```bash
=$ /dclns                                                                                                                                                                                                          
| ('Person) type Person record {string name;int age;};
```

### Defining Variables

Variables defined in the Shell prompt will be treated as module-level variables. Once defined, these can be used in any subsequent evaluation.

```bash
=$ Person person = {name: "Bal Shell", age: 4}  
```

Execute the `/vars` command as shown below to view the declared variables.

```bash
=$ /vars                                                                                                                                                                                                             
| ('person) Person 'person = {"name":"Bal Shell","age":4}
```

### Defining Functions

The same rules described above apply when defining a function.

```bash
=$ function sum(int a, int b) returns int {                                                                                                                                                                        
 > int sum = a + b;
 > return sum;
 > }
```

Now, the list of declarations includes the `sum()` function as well.

```bash
=$ /dclns                                                                                                                                                                                                          
| ('Person) type Person record {string name;int age;};
| ('sum) function sum(int a, int b) returns int {int sum = a + b;return sum;}
```


The function can in turn be called and assigned to a variable. 

```bash
=$ var total = sum(10, 20)                                                                                                                                                                                           

=$ total                                                                                                                                                                                                          
30
```

### Modifying Definitions

A definition can be modified by providing a new definition with the same name. This effectively overwrites the previous definition with the same name. 

The example below modifies the `sum()`function.

```bash
=$ function sum(float a, float b) returns float => a + b 
                                                                                                                                                            
=$ /dclns                                                                                                                                                                                                           
| ('sum) function sum(float a, float b) returns float => a + b;
```


Now, `sum()` is an expression-bodied function accepting float parameters and returning a float value.

>**Caution:** Modifying definitions in incompatible ways will lead to undefined behavior.

## Loading Definitions from a File

If you have any definitions in source files, you can load these definitions to the REPL through the `/file <FILE_PATH>` command. 

If the source file contains a main function, the Shell will disregard it.

```bash
=$ /file test.bal                                                                                                                                                                                                  

=$ /dclns                                                                                                                                                                                                           
| ('Pet) type Pet record {    string name;};
| ('PI) const PI = 3.14;
```

## Resetting the State

The `/reset` command can be used to clear the current definitions in the memory of the Shell.

```bash
=$ /dclns                                                                                                                                                                                                          
| ('Pet) type Pet record {    string name;};
| ('PI) const PI = 3.14;

=$ /reset                                                                                                                                                                                                            
| REPL state was reset.

=$ /dclns                                                                                                                                                                                                          
| 
```
