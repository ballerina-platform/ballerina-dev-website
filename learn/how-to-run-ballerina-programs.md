---
layout: ballerina-left-nav-pages
title: How to Run Ballerina Programs and Services
description: Learn how to run Ballerina programs and services using the CLI tool.
keywords: ballerina, programming language, services
permalink: /learn/how-to-run-ballerina-programs/
active: how-to-run-ballerina-programs
redirect_from:
  - /learn/how-to-deploy-and-run-ballerina-programs
  - /v1-2/learn/how-to-deploy-and-run-ballerina-programs
  - /v1-2/learn/how-to-deploy-and-run-ballerina-programs/
---

# How to Run Ballerina Programs and Services

A Ballerina application can have:

1. A [`main()`](/learn/by-example/the-main-function.html) function that runs as a terminating process.

2. A [`service`](/learn/by-example/hello-world-service.html), which is a hosted non-terminating process.

Both of these are considered as entry points for program execution. 

These applications can be structured into a single program file or a Ballerina module. A collection of modules can be managed together with versioning and dependency management as part of a Ballerina project. 

Source files and modules can contain zero or more entrypoints, and the runtime engine has precedence and sequence rules for choosing which entrypoint to execute.

### Running Standalone Source Code
A single Ballerina source code file can be placed into any folder. 

If the source file contains at least one entry point, it can be executed using the `run` command.
    
```bash
$ ballerina run foo.bal
```

You can compile a source file with an entry point into an executable jar.
    
```bash
$ ballerina build [-o outputfilename.jar] foo.bal
```  

And you can run `.jar` files directly:
```bash
$ ballerina run filename.jar
```

### Running a Project
A project is a folder that manages modules as part of a common versioning, dependency management, build, and execution. You can build and run items collectively or individually as modules. See [How To Structure Ballerina Code](/learn/how-to-structure-ballerina-code) for in-depth structuring of projects.

Build all modules of a project:
```bash    
$ ballerina build
```

Build a single module in a project:
```bash
$ ballerina build <module-name>
```

Options for running programs with entrypoints in a project:  
```bash
$ ballerina run main.bal
$ ballerina run main.jar
```

## Configuring Your Ballerina Runtimes

### Ballerina Runtime Configuration Files

A Ballerina runtime can be configured using configuration parameters, which are arbitrary key/value pairs with structure. The `ballerina/config` module provides an API for sourcing configuration parameters and using them within your source code. See [Config API Documentation](/learn/api-docs/ballerina/config/index.html) for details.

The configuration APIs accept a key and an optional default value. If a mapping does not exist for the specified key, the default value is returned as the configuration value. The default values of these optional configurations are the default values of the return types of the functions.

### Sourcing Parameters Into Ballerina Programs
Configuration parameters for your programs and apps can be defined on the CLI, as an environment variable, or from a configuration file, with loading and override precedence in the same order.

#### Sourcing CLI Parameters
Consider the following example, which reads a Ballerina config value and prints it.

```ballerina
import ballerina/io;
import ballerina/config;

public function main() {
  string name = config:getAsString("hello.user.name");
  io:println("Hello, " + name + " !");
}
```

The config key is `hello.user.name`. To pass a value to this config from the CLI, we can use `--key=value` format as the following command.
```bash
$ ballerina run  main.bal --hello.user.name=Ballerina
Hello, Ballerina !
```

#### Sourcing Configuration Values

The value can be passed as a config file as well. A configuration file should conform to the [TOML](https://github.com/toml-lang/toml) format. Ballerina only supports the following features of TOML: value types (string, int, float, and boolean), tables, and nested tables. Given below is a sample `ballerina.conf`:

```toml
[hello.user]
name="Ballerina"
```

When running a program with config API lookups, Ballerina looks for a `ballerina.conf` file in the directory where the source files are located.

If `ballerina.conf` resides in the same directory as `main.bal`, `balllerina run` can be used without any argument.
```bash
$ ballerina run main.bal
Hello, Ballerina !
```
To explicitly specify a configuration file, use the `--b7a.config.file` property. The path to the configuration file can be either an absolute or a relative path. 
```bash
$ ballerina run main.bal --b7a.config.file=path/to/conf/file/custom-config-file-name.conf
Hello, Ballerina !
```

#### Configure Secrets as Configuration Items
Ballerina provides support for encrypting sensitive data such as passwords and allows access to them securely through the configuration API in the code.

##### Creating a Secured Value
The `ballerina encrypt` command will encrypt parameters that can be securely sourced from your code files. For example, let's create a secure parameter named `Ballerina` with the value `12345` as the secret.

```ballerina
$ ballerina encrypt
Enter value:
Enter secret:
Re-enter secret to verify:
Add the following to the runtime config:
<key>="@encrypted:{Z1CfAJwCEzmv2JNXIPnR/9AXHqOJqnDaaAQ7HsggGLQ=}"

Or add to the runtime command line:
--<key>=@encrypted:{Z1CfAJwCEzmv2JNXIPnR/9AXHqOJqnDaaAQ7HsggGLQ=}
```

##### Using the Secured Value at Runtime
The secured value can be placed in a config file as a value or passed on the command line. 

```
[hello.user]
name="@encrypted:{Z1CfAJwCEzmv2JNXIPnR/9AXHqOJqnDaaAQ7HsggGLQ=}"
```

or (Enter secret `12345` when prompted.):

```bash
$ ballerina run main.bal --hello.user.name=@encrypted:{Z1CfAJwCEzmv2JNXIPnR/9AXHqOJqnDaaAQ7HsggGLQ=}
ballerina: enter secret for config value decryption:

Hello, Ballerina !
```

##### Decrypting the Value
If a configuration contains an encrypted value, Ballerina looks for a `secret.txt` file in the directory where the source files are located. The `secret.txt` should contain the secret used to encrypt the value. The `secret.txt` file will be deleted after it is read.
```bash
$ echo 12345 > secret.txt
$ ballerina run main.bal --b7a.config.file=ballerina.conf
Hello, Ballerina !
```


If the `secret.txt` file is not present, then CLI prompts the user for the secret. Enter secret `12345` when prompted.
```bash
$ ballerina run main.bal --b7a.config.file=ballerina.conf
ballerina: enter secret for config value decryption:

Hello, Ballerina !
```
