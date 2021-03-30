---
layout: ballerina-left-nav-pages-swanlake
title: Running Ballerina Code
description: Learn how to run Ballerina programs and services using the CLI tool.
keywords: ballerina, programming language, services
permalink: /learn/user-guide/running-ballerina-code/
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
  - /learn/user-guide/running-ballerina-code
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
  - [Configuring Sensitive Data as configurable variables](#configuring-sensitive-data-as-configurable-variables)

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

A Ballerina runtime can be configured using configurable variables.
The values for `configurable` variables can be provided through CLI parameters, and configuration files, with 
loading and override precedence in the same order.

User may or may not provide configuration values for configurable variables that are used in the program.
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

`?` denotes that `id` is a required configuration, hence the configuration must specify a value for key `id`.
If a default value assigned, the configuration is optional, hence the configuration may or may not contain a values for
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

When running a program with configurable values, Ballerina locates the TOML files in the following ways:

- From an environment variable with the name `BAL_CONFIG_FILES` that provides a list of paths to TOML files 
  separated by the OS-specific separator. The file precedence order will be as 
  specified in the environment variable.
  
- From an environment variable with the name `BAL_CONFIG_DATA` that contains the content of configuration TOML 
  file.
  
- If the above environment variables are not specified, the configuration file is located in the current directory 
  with the file name `Config.toml`, by default.

Currently, TOML-based configuration is supported for configurable variables of types `int`, `float`, `boolean`, 
`string`, `decimal`, the arrays of the respective types, and table.

In the example, we can set the path to `Config.toml` file using the following command.

```bash
$ export BAL_CONFIG_FILES = <path>
$ bal run main.bal
User ID : 1001
User Name : Jhone
Married : true
```

It is possible to provide the values for configurable variables through CLI arguments in the format of `-Ckey=value`.
The key of a CLI argument can be specified as,
```
key:= [[org-name .] module-name .] variable
```
The org-name and module-name is optional for the variable defined in the root module or single Ballerina file. 
Currently, CLI-based configuration is supported for configurable variables of types `int`, `float`, `boolean`,
`string`, `decimal`, and `xml`.

In the example, we can use the following command to pass values from CLI.

```bash
$ bal run main.bal -- -Cid=1001 -Cname=Jhone -Cmarried=true
User ID : 1001
User Name : Jhone
Married : true
```

### Configuring Sensitive Data as configurable variables

Ballerina provides support for configuring sensitive data using a different TOML file with the name 
`Config-secrets.toml`. The values provided through the `Config-secrets.toml` are prioritised higher than normal 
configuration.

See [Securing Sensitive Data using configurable variables](/learn/security/writing-secure-ballerina-code/#securing-sensitive-data-using-configurable-variables) 
for in-depth details.