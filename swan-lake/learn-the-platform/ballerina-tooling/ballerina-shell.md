---
layout: ballerina-ballerina-shell-left-nav-pages-swanlake
title: Ballerina Shell
permalink: /learn/ballerina-shell/
description: The Ballerina Shell is a Read-Evaluate-Print Loop (REPL) for Ballerina.
keywords: ballerina shell, REPL, ballerina, programming language
active: ballerina-shell
intro: The Ballerina Shell is a Read-Evaluate-Print Loop (REPL) for Ballerina.
redirect_from:
  - /learn/tooling-guide/ballerina-shell
  - /learn/tooling-guide/ballerina-shell/
  - /learn/ballerina-shell
---

It allows you to evaluate snippets of code without having to write complete programs. 

This will particularly be useful if you are looking to try out the language and its new features, and also for debugging purposes.

>**Note:** Ballerina Shell currently supports a subset of the language features. Ballerina Shell doesn't support 
> services and isolation features. Also, Ballerina Shell provides limited feature support for worker-related implementations.

## Set up the prerequisites

Ballerina Shell is a part of the Ballerina distribution. Therefore, if you have already installed Ballerina, you are all set. If not, for information on installing the latest version of Ballerina, see [downloads](https://ballerina.io/downloads/).

## Start the Shell

Execute the command below to start Ballerina Shell.

```bash
$ bal shell
Welcome to Ballerina Shell REPL.
Type /exit to exit and /help to list available commands.

=$ 
```

## Available commands

Execute the `/help` command to view the available commands.

```bash
=$ /help                 
| Ballerina Shell Help
| 
| Type a Ballerina language expression, statement, or declaration.
| Or, type one of the following commands:
| 
| /exit           - Exit the shell.
| /debug          - Toggle the debug mode ON/OFF.
| /reset          - Reset the REPL state.
|                   All the previous code snippets will be removed from the REPL memory.
| /file <FILE>    - Load declarations defined in the <FILE> (e.g., /file my_file.bal).
| /remove <NAMES> - Delete the declarations specified by <NAMES> (e.g., /remove function1 var1 var2).
| /imports        - List the available imports.
| /vars           - List the declared variables and their values.
| /dclns          - List the user-defined module-level declarations.
| /help           - Displays the help text.
| /help <TOPIC>   - Get help on the <TOPIC> (e.g., /help var).
| /help topics    - See all the available topic names.
```

## Evaluate code snippets

The types of code snippets below are supported in the Shell.

- Import declarations
- Statements
- Expressions
- Module-level declarations

### Import a module

A module can be imported as follows. Once a module is imported, it can be used in any subsequent snippet run in that particular Shell session. This is true for other module-level declarations as well.

```bash
=$ import ballerina/io
```

Execute the `/imports` command to view the list of the imported modules.

```bash
=$ /imports
| (io) import ballerina/io;
```

### Execute statements

Any valid Ballerina statement can be evaluated in the Shell. The example below evaluates a variable declaration statement.

```bash
=$ string name = "Ballerina Shell"
```


### Evaluate expressions

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

### Define variables

Variables defined in the Shell prompt will be treated as module-level variables. Once defined, these can be used in any subsequent evaluation.

```bash
=$ int a = 10  
```

Execute the `/vars` command as shown below to view the declared variables.

```bash
=$ /vars
| (a) int a = 10
```

### Remove variables

The `/remove` command can be used to remove declarations.

```bash
=$ /remove a
```

Execute the `/vars` command as shown below to view the declared variables.

```bash
=$ /vars
|
```

### Define functions

Functions can be written just as you write them in a source file. The Shell supports multi-line snippets.

```bash
=$ function sum(int a, int b) returns int {
 > int sum = a + b;
 > return sum;
 > }
```

Execute the `/dclns` command to view the module-level declarations.

```bash
=$ /dclns
| (sum) function sum(int a, int b) returns int {int sum = a + b;return sum;}
```
The defined function can be called and assigned to a variable.

```bash
=$ var total = sum(10, 20)

=$ total
30
```

###  Define types

Type definitions can be written the same as a function.

```bash
=$ type Person record {
 > string name;
 > int age;
 > }
```

Now, the list of declarations includes the `Person` record as well.

```bash
=$ /dclns
| (sum) function sum(int a, int b) returns int {int sum = a + b;return sum;}
| (Person) type Person record {string name;int age;};
```

### Modify definitions

A definition can be modified by providing a new definition with the same name. This effectively overwrites the previous definition with the same name. 

The example below modifies the `sum()` function.

```bash
=$ function sum(float a, float b) returns float => a + b
                                                                                                                                                            
=$ /dclns
| (sum) function sum(float a, float b) returns float => a + b;
| (Person) type Person record {string name;int age;};
```

Now, `sum()` is a function accepting float parameters and returning a float value.

>**Caution:** Modifying definitions can cause undefined behaviors in some cases.

### Load definitions from a file

If you have any definitions in source files, you can load these definitions to the Shell through the `/file <FILE_PATH>` command. 

If the source file contains the main function, the Shell will disregard it.

For example, see the sample `test.bal` file below.

```ballerina
import ballerina/io;

function add(int a, int b) returns int {
    return a + b;
}

function subtract(int a, int b) returns int {
    return a - b;
}

function multiply(int a, int b) returns int {
    return a * b;
}

public function main() {
    int a = 5;
    int b = 10;
    
    io:println(add(a,b));
    io:println(subtract(a,b));
    io:println(multiply);
}    
```

```bash
=$ /file test.bal                                                                                      

=$ /dclns
| (subtract) function subtract(int a, int b) returns...                        return a - b ;}
| (add) function add(int a, int b) returns int ...                         return a + b;}
| (mulitply) function mulitply(int a, int b) returns...                         return a * b;}
```

## Reset the state

The `/reset` command can be used to clear the current definitions in the memory of the Shell.

```bash
=$ /dclns
| (subtract) function subtract(int a, int b) returns...                        return a - b ;}
| (add) function add(int a, int b) returns int ...                         return a + b;}
| (mulitply) function mulitply(int a, int b) returns...                         return a * b;}

=$ /reset
| REPL state was reset.

=$ /dclns                                                                                               
| 
```

## Stop the Shell

Execute the `/exit` command to exit the Shell.

```bash
=$ /exit
| Bye!!!                                          
```

## Help commands

### View available topics

Execute the `/help topics` command to view the available topics.

### View specific topic details

Execute the `/help <TOPIC>` command to view details related to the mentioned topic.

For example, see below.

```bash
=$ /help strings
| 
| Topic description :
| 
|  The `string` type represents immutable sequence of zero or more Unicode characters. 
|  There is no separate character type: a character is represented by a `string` of length 1.
|  Two `string` values are `==` if both sequences have the same characters.
|  You can use `<`, `<=`, `>`, and `>=` operators on `string` values and they work by comparing code points.
|  Unpaired surrogates are not allowed.
| 
| For examples, visit https://ballerina.io/learn/by-example/strings
```
