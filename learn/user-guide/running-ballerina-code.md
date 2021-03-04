---
layout: ballerina-left-nav-pages-swanlake
title: Running Ballerina Code
description: Learn how to run Ballerina programs and services using the CLI tool.
keywords: ballerina, programming language, services
permalink: /learn/running-ballerina-code/
active: running-ballerina-code
intro: The sections below include information on running Ballerina programs.
redirect_from:
  - /learn/how-to-deploy-and-run-ballerina-programs
  - /learn/how-to-run-ballerina-programs/
  - /learn/how-to-deploy-and-run-ballerina-programs/
  - /learn/running-ballerina-code
  - /swan-lake/learn/running-ballerina-code/
  - /swan-lake/learn/running-ballerina-code
  - /learn/running-ballerina-code/
  - /learn/running-ballerina-code
---

## Understanding the Structure

A Ballerina application can have:

1. A [`main()`](/learn/by-example/the-main-function.html) function that runs as a terminating process.

2. A [`service`](/learn/by-example/hello-world-service.html), which is a hosted non-terminating process.

Both of these are considered as entry points for program execution. 

These applications can be structured into a single program file or a Ballerina module. A collection of modules can be managed together with versioning and dependency management as part of a Ballerina package. 

Source files and modules can contain zero or more entry points, and the runtime engine has precedence and sequence rules for choosing which entry point to execute.

- [Running Standalone Source Code](#running-standalone-source-code)
- [Running a Package](#running-a-package)
- [Configuring Your Ballerina Runtimes](#configuring-your-ballerina-runtimes)
  - [Ballerina Runtime Configurable Variables](#ballerina-runtime-configurable-variables)

## Running Standalone Source Code
A single Ballerina source code file can be placed into any folder. 

If the source file contains at least one entry point, it can be executed using the `run` command.
    
```bash
$ bal run foo.bal
```

You can compile a source file with an entry point into an executable jar.
    
```bash
$ bal build [-o outputfilename.jar] foo.bal
```  

You can run `.jar` files directly:
```bash
$ bal run filename.jar
```

## Running a Package
A package is a folder that manages modules as part of common versioning, dependency management, build, and execution. You can build and run items collectively or individually as modules. See [How To Structure Ballerina Code](/learn/how-to-structure-ballerina-code) for in-depth structuring of packages.

Running a ballerina package:
```bash
$ bal run myFirstPackage 
$ bal run <ballerina-package-path>
```

Build a ballerina package:
```bash
$ bal build myFirstPackage
$ bal build <ballerina-package-path>
```
Alternatively you can `cd` into ballerina package and run:
```bash    
$ bal build
```
Building a ballerina package will generate `.jar` inside `target/bin/` of the package directory.

You can run the `.jar` file directly:
```bash
$ bal run target/bin/testPackage.jar
```

Options for running programs with entry points in a package:  
```bash
$ bal run main.bal
$ bal run main.jar
```

## Configuring Your Ballerina Runtimes

### Ballerina Runtime Configurable Variables

A Ballerina runtime can be configured using configurable variables, which can be configured using `Config.toml` file. 
`Config.toml` file may or may not provide configuration values for configurable variables that are used in the program. 
Ballerina currently supports configurable variables of types `int`, `float`, `boolean`, `string`, `decimal` and the arrays of respective types. 
See [Configurable BBE](/learn/by-example/configurable.html) for more details.

Consider the following example, which uses configurable variables.

```ballerina
import ballerina/io;

configurable int id = ?;
configurable string name = "Ann";
configurable boolean married = true;

public function main() {
  io:println("User ID : ", id);
  io:println("User Name : ", name);
  io:println("Married : ", married);
}
```

`?` denotes that `id` is a required configuration, hence `Config.toml` file must contain a value for key `id`.
If a default value assigned, the configuration is optional, hence `Config.toml` file may or may not contain a values for
configurable variables `name` and `married`.
Consider the below `Config.toml` file.
```toml
id = 1001
name = "Jhone"
```
 Since `Config.toml` file contains a value for key `name`, the program default
value will be overridden by the value in the `Config.toml` file.

```bash
$ bal run main.bal
User ID : 1001
User Name : Jhone
Married : true
```

When running a program with configurable values, Ballerina looks for a `Config.toml` file in the current working directory. 
You can set the path to `Config.toml` file via environment variable `BALCONFIGFILE`.

```bash
$ export BALCONFIGPATH = <path>
$ bal run main.bal
User ID : 1001
User Name : Jhone
Married : true
```
