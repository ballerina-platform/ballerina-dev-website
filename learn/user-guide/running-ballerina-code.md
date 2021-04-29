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
  - [Configuring Sensitive Data as Configurable Variables](#configuring-sensitive-data-as-configurable-variables)

## Running Standalone Source Code

A single Ballerina source code file can be placed into any folder. 

If the source file contains at least one entry point, it can be executed using the `run` command.
    
```bash
$ bal run foo.bal
```

You can compile a source file with an entry point into an executable JAR.
    
```bash
$ bal build [-o outputfilename.jar] foo.bal
```  

You can run `.jar` files directly:

```bash
$ bal run filename.jar
```

## Running a Package
A package is a folder that manages modules as part of common versioning, dependency management, build, and execution. You can build and run items collectively or individually as modules. See [How To Structure Ballerina Code](/learn/how-to-structure-ballerina-code) for in-depth structuring of packages.

Running a Ballerina package:

```bash
$ bal run myFirstPackage 
$ bal run <ballerina-package-path>
```

Building a Ballerina package:

```bash
$ bal build myFirstPackage
$ bal build <ballerina-package-path>
```

Alternatively, you can `cd` into the Ballerina package and run:

```bash    
$ bal build
```

Building a Ballerina package will generate a `.jar` inside the `target/bin/` of the package directory.

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

A Ballerina runtime can be configured using configurable variables. The values for `configurable` variables can be provided through command-line parameters and configuration files. 

When loading the values to the configurable variables, command-line arguments get the higher precedence than the configuration TOML files. For more details, see [Configurable BBE](/learn/by-example/configurable.html).

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

`?` denotes that `id` is a required configuration. Hence, the configuration must specify a value for the `id` key. If a default value is assigned, the configuration is optional. Hence, the configuration may or may not contain values for the `name` and `married` configurable variables.

Consider the below `Config.toml` file.

```toml
id = 1001
name = "Jhone"
```

Since the `Config.toml` file contains a value for the `name` key, the program default value will be overridden by the value in the `Config.toml` file.

```bash
$ bal run main.bal
User ID : 1001
User Name : Jhone
Married : true
```

When running a program with configurable values, Ballerina locates the TOML files in the following ways:

- From an environment variable with the name `BAL_CONFIG_FILES` that provides a list of paths to the TOML files
  separated by the OS-specific separator. The file precedence order will be as 
  specified in the environment variable.
  
- From an environment variable with the name `BAL_CONFIG_DATA` that contains the content of the configuration TOML 
  file.
  
- If the above environment variables are not specified, the configuration file is located in the current directory
  with the file name `Config.toml` by default.

Currently, TOML-based configuration is supported for configurable variables of types `int`, `float`, `boolean`, `string`, `decimal`, the arrays of the respective types, and table.

In the example below, you can set the path to the `Config.toml` file using the following command.

```bash
$ export BAL_CONFIG_FILES = <path>
$ bal run main.bal
User ID : 1001
User Name : Jhone
Married : true
```

It is possible to provide the values for configurable variables through command-line arguments in the format of `-Ckey=value`. The key of a command-line argument can be specified as,

```
key:= [[org-name .] module-name .] variable
```

The org-name and module-name is optional for the variable defined in the root module or in a single Ballerina file. Currently, command-line-based configuration is supported for configurable variables of types `int`, `float`, `boolean`, `string`, `decimal`, and `xml`.

In the example below, you can use the following command to pass values from the command-line.

```bash
$ bal run main.bal -- -Cid=1001 -Cname=Jhone -Cmarried=true
User ID : 1001
User Name : Jhone
Married : true
```

### Configuring Sensitive Data as Configurable Variables

You can provide sensitive data to configurable variables through a separate TOML file and specify it using the `BAL_CONFIG_FILES` environment variable with higher priority.

For in-depth details, see [Securing Sensitive Data using configurable variables](/learn/security/writing-secure-ballerina-code/#securing-sensitive-data-using-configurable-variables).