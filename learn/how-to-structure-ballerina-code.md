---
layout: ballerina-left-nav-pages
title: How to Structure Ballerina Code
description: Learn how to develop a Ballerina project, structure code, and use the Ballerina Tool to fetch, build, and install Ballerina modules.
keywords: ballerina, programming language, ballerina modules, structure code
permalink: /learn/how-to-structure-ballerina-code/
active: how-to-structure-ballerina-code
redirect_from:
  - /learn/how-to-structure-ballerina-code
  - /v1-2/learn/how-to-structure-ballerina-code
  - /v1-2/learn/how-to-structure-ballerina-code/
---

# How to Structure Ballerina Code
This document demonstrates the development of a Ballerina project and shows how to use the `Ballerina Tool` to fetch, 
build, and install Ballerina modules. These commands work with repositories that are both local and remote.

Ballerina Central is a globally hosted module management system that is used to discover, download, and publish modules.

The `Ballerina Tool` requires you to organize your code in a specific way. This document explains the simplest way to 
get it up and running with a Ballerina installation.

## Overview
* Ballerina programmers can either place their code into a single source code file or in a *project* directory.
* A Ballerina program residing in a single source code file should have a `.bal` extension and an entry point (i.e., either a `main`
  method or a service).
* A Ballerina *program* is a compiled and linked binary.
* A *module* is a directory that contains Ballerina source code files.
* A *repository* is a versioned collection of compiled or source code *modules*.
* A *project* atomically manages a collection of *modules*.

## Programs
A *program* is a runtime executable ending with a `.jar` extension. A *program* is the transitive closure of one 
Ballerina module without including `ballerina/*` modules, since those are dynamically linked within Ballerina's runtime 
engine during execution. A *module*, which is a *program* compiles into a file with a `.jar` extension. Otherwise, it is 
treated as a to-be-linked library that ends with a `.balo` extension.

To generate an executable `.jar` file, the program's module must contain either a `main()` function (a process entry point) or 
a `service` (a network-accessible API).

A program can import dependent *modules* that are stored within a *repository*.

Suppose you have the following structure:

```
/local/ballerina/src
  sample.bal
```

The `sample.bal` file contains both a `main()` entry point and a `service`:

```ballerina
import ballerina/http;
import ballerina/io;
import ballerina/log;

public function main() {
    io:println("Hello, World!");
}

service hello on new http:Listener(9090) {
    resource function sayHello (http:Caller caller, http:Request req) {
        http:Response res = new;
        res.setPayload("Hello, World!");
        var respondResult = caller->respond(res);
        if (respondResult is error) {
            log:printError("Error sending response", err = respondResult);
        }
    }
}
```

### Build and Run Programs
To generate an executable `.jar`, you can build a Ballerina program, which contains a `main()` function or a service(s):

```bash
$ cd /local/ballerina/src
$ ballerina build sample.bal

# This generates 'sample.jar'.
```

You can use the following command to run the `main()` function or services in a generated `.jar` file:
```bash
$ ballerina run sample.jar
```

## Modules
A *module* is a directory, which contains Ballerina source code files and is part of a namespace. Modules facilitate 
collaboration, sharing, and reuse. Modules can include functions, clients, constants, annotations, services, and 
objects. To share a module among programs, projects, and users, you need to push the module into a repository.

Modules:

<ol>
<li>May or may not have a version</li>
<li>However, modules cannot be pushed into a registry for sharing without a version</li>
<li>Are referenced by  <code>&lt;org-name&gt;/&lt;module-name&gt;</code> where <code>&lt;org-name&gt;</code> is a namespace from within a repository.</li>
</ol>

Module names can contain alphanumeric characters including dots (`.`). Dots in a module name has no meaning other
than the last segment after the final dot being used as a default alias within your source code.

### Importing Modules
Your Ballerina source files can import modules:

```ballerina
import [<org-name>]/<module-name> [as <identifier>];
```

When you import a module, you can use its functions, annotations, and other objects in your code. You can also 
reference the objects with a qualified identifier followed by a colon (`:`). For example, `<identifier>:<module-object>`.

Identifiers are either derived or explicit. The default identifier is either the module name or if the module 
name has dots (`.`) included, then the last word after the last dot. For example, `import ballerina/http;` will
have `http:`as the derived identifer and the module `import ballerinax/java.jdbc` would have `jdbc:` as the 
default identifier.

You can have an explicit identifier by using the `as <identifier>` syntax.

```ballerina
import ballerina/http;

// The listener comes from the imported module.
service hello on new http:Listener(9090) {

    // The 'Request' object comes from the imported module.
    resource function sayHello (http:Caller caller, http:Request req) {
        ...
    }
}
```

Or you can override the default identifier:
```ballerina
import ballerina/http as network;

service hello on new network:Listener(9090) {

    // The 'Request' object comes from the imported module.
    resource function sayHello (network:Caller caller, network:Request req) {
        ...
    }
}
```

### Module Version Dependency
If your source file or module is a part of a project, then you can explicitly manage version dependencies of imported 
modules within the project by defining it in the `Ballerina.toml` file:

```toml
[dependencies]
"wso2/twitter" = "2.3.4"
"wso2/github" = { path = "path/to/github.balo", version = "1.2.3"}
```
Often, you would want to depend on a module of another project, which you have not pushed to the Ballerina Central. This can be 
achieved using a path dependency as shown above with the `wso2/github` dependency.

If an import version is not specified in `Ballerina.toml`, the compiler will use the latest module version from a 
repository, if one exists.

```ballerina
import foo/http;

public function main() {
  http:Person x = http:getPerson();
}
```

### Compiled Modules
A compiled module is the compiled representation of a single module of Ballerina code, which includes transitive 
dependencies into the compiled unit.

Modules can only be created, versioned, and pushed into a repository as part of a *project*.

### Running Compiled Modules
An entrypoint such as a `main()` or a `service` that is compiled as part of a named module is automatically linked 
into a `.jar`. You can run the compiled module `.jar`:

```bash
ballerina run module.jar
```

## Projects
* A *project* is a directory, which atomically manages a collection of *modules*. It has:
  * A user-managed manifest file, `Ballerina.toml`
  * An `src` folder with module source code

Projects are managed atomically. Therefore, dependency management, compilation, unit tests, and artifact generation are done 
collectively across the source code files and modules defined within a project.

### Create a Project
You can create a project using the `ballerina new` command:

```bash
ballerina new <project-name>
```

The `new` command will create a project directory with the given name. A Ballerina project cannot reside in another 
ballerina project. If you run `ballerina new` from inside a Ballerina project directory or from inside a sub directory of a Ballerina project,
it will give an error.

It will create the `Ballerina.toml` file, and `src` folder.

### Add a Module
Once the project is initialized, a module can be created inside the project using the `ballerina add` command. 
Each subdirectory of the project `src` folder defines a single module. The subdirectory's name will be used to name the 
module. 

```bash
ballerina add <module-name>
```

The folders `tests/` and `resources/` are reserved folder names within the module. The `tests/` folder contains 
unit test files of the module and the `resources/` folder contains the resources of the module that will be available at runtime. Any 
additional subdirectories within the module have no semantic meaning and can be used by the developer for organizing 
files. The module subdirectories can have as many Ballerina source files and all will be included within the 
module when it is built. 

### Project Structure
```
/
    project-name/
        .gitignore
        Balleirna.lock             # Generated during the build and used to rebuild identical binary
        Ballerina.toml             # Configuration, which  defines project intent
        
        src/
            module1/               # The source in this directory will be named “<org-name>/module1”
                Module.md          # Contains descriptive metadata for display at Ballerina Central
                main.bal           # Contains the default main method
                *.bal              # In this dir and recursively in subdirs except tests/ and resources/
                [tests/]           # Module-specific unit and integration tests
                    main_test.bal  # The test file for main
                    [resources]    # Resources for the tests
                [resources/]       # Module-specific resources  
                
            module2/
                Module.md
                *.bal
                [tests/]
                [resources/]   
            
        target/                    # Compiled executables and other artifacts end up here
            balo/                  # BALO files, one per each module, will be created here
            bin/                   # Executables will be created here
            caches/
                bir_cache/
                jar_cache/
```

### Build a Project
A project should be built if it is required to generate the executable JAR files from the modules in the project. The
executable JAR files will be generated only if there are entry points (main method or a service) in the module. Building
a project will build all modules found in the project's root folder. Building a project runs through phases including
dependency resolution, compilation, artifact generation, and unit test execution.

```bash
ballerina build -a
```

### Build a Module
You can build a single module contained within a project:

```bash
ballerina build <module-name>
```
Use the `--skip-tests` flag with the `ballerina build` command to skip running the tests during the build process.

```bash
ballerina build --skip-tests <module-name>
```


### Compile a Project
A project should be compiled if it is required to generate the libraries (i.e., BALOs) from the modules in the project.
Compiling a project will compile all the modules found in the project's root folder. Building a project runs through phases
including dependency resolution, compilation, artifact generation, and unit test execution.

```bash
ballerina build -c -a
```

### Compile a Module
You can build a single module contained within a project:

```bash
ballerina build -c <module-name>
```
Use the `--skip-tests` flag with the `ballerina compile` command to skip running the tests during the compile process.

```bash
ballerina build -c --skip-tests <module-name>
```

### Version a Module
Modules in a project are assigned their version from within the `Ballerina.toml` file:

```toml
# The current version, obeying [semver](https://semver.org/)
version = "string"
```

All modules built in a project are assigned the same version. If you need two modules to have different versions, then 
those modules should be placed into different projects.

Version labels must follow [Semantic Versioning 2.0 rules](https://semver.org/).

### Assign an Organization Name to a Module
A module is assigned an `<org-name>` when it is pushed into a repository. The `<org-name>` is defined in the 
`Ballerina.toml` and all modules in the same project are assigned the same organization name:

```toml
# Org name assigned to modules when installed into a repository
org-name = "foo"
```

## Module Caches

### Caches

Ballerina will maintain several caches to speed up the compile and build process. Following artifacts will be cached by 
Ballerina.

* BALO files fetched from Central.
* BIR files generated during the compilation.
* JAR file generated during the compilation

Here, the BALO cache will be common across any version of Ballerina and the BIR and JAR caches will be specific to the Ballerina version.  

#### BALO Cache

BALO cache is responsible for keeping BALOs of dependent modules. There is a BALO cache inside the Ballerina 
distribution, which contains the BALOs of libraries that will get packed into the distribution. There is another cache 
at the user's home repository, which is used to cache the BALOs fetched from Central. 

#### BIR Cache

BIR files of the standard library that gets packed into a distribution are generated during the distribution build time. 
The BIR files of the other dependencies will be kept inside the target directory when compiling a Ballerina project. 

#### JAR Cache

The JAR files generated during the build will be kept inside the target directory when building a Ballerina project. The
JAR file will be generated only if there is an entry point (`main` function or service) within the module.


## Module Repository - Ballerina Central
A repository is a collection of compiled Ballerina modules. A repository helps to organize modules used by multiple 
programs by managing their versions and assets in a central location. [Ballerina Central]
(http://central.ballerina.io) is the only module repository for Ballerina developers.

### Organizations
An organization is a logical name used for grouping modules together under a common namespace within a repository.

All modules installed into a repository must have an organization name. Any installation or pushing of a module into a 
repository will fail without an organization name.

Organization names can contain lowercase alphanumeric characters and underscores. None of the characters in an 
organization name have any semantic meaning.

The organization names `ballerina` and `ballerinax` are reserved for system use. Modules in `ballerina` and 
`ballerinax` are included within the system distribution.

At Ballerina Central, every account is assigned a personal organization name, which is chosen by a 
user when creating their account initially or is derived from the email address of the user.

When pushing a module from a local computer into Ballerina Central, the user's organization name in the Ballerina 
Central MUST match the `<org-name>` assigned in the `Ballerina.toml` file. If the names do not match, then the push operation 
will fail. This enforcement may seem arbitrary. However, it is a simple way to ensure organization naming consistency 
across remote and local development environments.

### Pulling Remote Modules
You can install modules that exist in Ballerina Central into your BALO cache in the home directory via "pulling" them. 
Pulling a module discovers and downloads the module source and binaries from Ballerina Central and installs them into the 
BALO cache. 

```bash
ballerina pull <org-name>/<module-name>[:<version>]
```

If a version is not specified for the module to be pulled, the latest version of the module will be pulled from the 
Ballerina Central. Projects that perform dependency analysis will automatically pull modules into the BALO cache in the home
directory.

### Pushing Modules
"Pushing" a module uploads the associated module files and installs the module into Ballerina Central.

The org-name and the version of the module will be read from the manifest file `Ballerina.toml` inside the project.
It is required to build the module before pushing it to Ballerina Central.
                                                                                                
```
# Push a single module
ballerina push <module-name>
```
### Configure Ballerina Central Access

Ballerina Central requires an account in order to push modules. Your account is represented by a CLI token that is 
installed into your local Ballerina configuration file, i.e., `~/.ballerina/Settings.toml`. The CLI token is 
automatically installed into this file the first time you perform a `ballerina push` as Ballerina redirects to an 
OAuth authorization screen, configures your account, and then copies your CLI token from Ballerina Central into your 
local CLI configuration. To get your token, register on Ballerina Central and visit the 
[Ballerina Central Dashboard](https://central.ballerina.io/dashboard).

Every push of the same module into Ballerina Central REQUIRES a new version even for minor text updates. 
This policy is enforced to ensure that projects, which make use of dependencies cannot experience accidental behavior drift across 
two versions of the same module given the same version. Essentially, there is no way to "update" a module for a specific 
version in Ballerina Central.
