---
layout: ballerina-inner-page
permalink: /v0-991/learn/how-to-structure-ballerina-code/

---

# How to Structure Ballerina Code
This document demonstrates the development of a Ballerina project and shows how to use the `ballerina` tool to fetch, build, and install Ballerina modules. These commands work with repositories that are both local and remote.

Ballerina Central is a globally hosted module management system that is used to discover, download, and publish modules.

The `ballerina` tool requires you to organize your code in a specific way. This document explains the simplest way to get up and running with a Ballerina installation.

## Overview
* Ballerina progammers can either place their code into a single source code file or in a *project* directory.
* A Ballerina *program* is a compiled and linked binary.
* A *module* is a directory that contains Ballerina source code files.
* A *repository* is a versioned collection of compiled or source code *modules*.
* A *project* atomically manages a collection of *modules* and *programs*.

## Programs
A *program* is a runtime executable, ending with a `.balx` extension. A *program* is the transitive closure of one Ballerina module without including `ballerina/*` modules, since those are dynamically linked within Ballerina's runtime engine during execution. A *module* that is a *program* compiles into a file with a `.balx` extension, otherwise it is treated as a to-be-linked library that ends with a `.balo` extension.

To generate a `.balx` file, the program's module must contain either a `main()` function (a process entry point) or a `service` (a network-accessible API).

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
To generate a `.balx`, you can build a Ballerina program that contains a `main()` function or services:
```bash
$ cd /local/ballerina/src
$ ballerina build sample.bal

# This generates 'sample.balx'
```

You can use the `ballerina run` command to run the `main()` function or services of a Ballerina file.
```bash
# Run from any location
$ ballerina run /local/ballerina/src/sample.bal

# Run from within the local directory
$ cd /local/ballerina/src
$ ballerina run sample.bal
```

You can use the following command to run the `main()` function or services in a generated `.balx` file:
```bash
$ ballerina run sample.balx
```

## Modules
A *module* is a directory that contains Ballerina source code files and is part of a namespace. Modules facilitate collaboration, sharing, and reuse. Modules can include functions, connectors, constants, annotations, services, and objects. To share a module among programs, projects, and users you need to push the module into a repository.

Modules:

<ol>
<li>May or may not have a version</li>
<li>However, modules cannot be pushed into a registry for sharing without a version</li>
<li>Are referenced by `<org-name>/<module-name>` where `<org-name>` is a namespace from within a repository.</li>
</ol>

Module names can contain alphanumeric characters including dots `.`. Dots in a module name have no meaning other than the last segment after the final dot being used as a default alias within your source code.

### Importing Modules
Your Ballerina source files can import modules:

```ballerina
import [<org-name>]/<module-name> [as <identifier>];
```

When you import a module, you can use its functions, annotations, and other objects in your code. You can also reference the objects with a qualified identifier, followed by a colon `:`. For example, `<identifier>:<module-object>`.

Identifiers are either derived or explicit. The default identifier is either the module name, or if the module name has dots `.` included, then the last word after the last dot. For example, `import ballerina/http;` will have `http:` be the derived identifer. The module `import tyler/net.http.exception` would have `exception:` as the default identifier.

You can have an explicit identifier by using the `as <identifier>` syntax.

```ballerina
import ballerina/http;

// The 'Service' object comes from the imported module.
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
If your source file or module is a part of a project, then you can explicitly manage version dependencies of imported modules within the project by defining it in `Ballerina.toml`:

```toml
[dependencies."tyler/http"]
version = "3.0.1"
```

If an import version is not specified in `Ballerina.toml`, the compiler will use the `latest` module version from a repository, if one exists.

```ballerina
import tyler/http;

public function main() {
  http:Person x = http:getPerson();
}
```

### Compiled Modules
A compiled module is the compiled representation of a single module of Ballerina code, which includes transitive dependencies into the compiled unit.

Modules can only be created, versioned, and pushed into a repository as part of a *project*.

### Running Compiled Modules
An entrypoint such as a `main()` or a `service` that is compiled as part of a named module is automatically linked into a `.balx`. You can run the compiled module `.balx`:

```bash
ballerina run module.balx
```

## Projects
* A *project* is a directory that atomically manages a collection of *modules* and *programs*. It has:
  * A user-managed manifest file, `Ballerina.toml`
  * A Ballerina-managed `.ballerina/` folder with implementation metadata and cache
  * A project repository for storing dependencies

Projects are atomically managed, so dependency management, compilation, unit tests, and artifact generation are done collectively across the source code files and modules defined within a project.

### Create a Project
You can create a project from any folder:

```bash
ballerina init [-i]
```

The `init` command initializes a simple project with a module inside of it. If the folder where this command is run has Ballerina source files or subfolders, those will be placed into the new project.

You can optionally run `init` in interactive mode where you can specify overrides for the default files and folders that are created. We will extend the `init` command in the future to be a general purpose template generator creating projects from templates defined by others than the Ballerina team.

### Create a Module
Each subdirectory of the project root folder defines a single module. The subdirectory's name will be used to name the module. Any additional subdirectories within the module have no semantic meaning and can be used by the developer for organizing files. The module subdirectories can have as many Ballerina source files and all will be included within the module when it is built.

The folders `.ballerina/`, `tests/`, and `resources/` are reserved folder names that can exist within the project root that are ignored as modules. These folders may also exist within a module and are ignored, instead treated as special case folders that contain unit tests or other files that must be included within a module.

### Project Structure
```
/
  .gitignore
  Ballerina.toml       # Configuration that defines project intent
  .ballerina/          # Internal cache management and contains project repository
                       # Project repository contains compiled module binaries
    module1.balo
    
  main.bal             # Part of the “unnamed” module, compiled into a main.balx
                       # You can have many files in the "unnamed" module, though unadvisable

  module1/            # The source in this directory will be named “<org-name>/module1”
    Module.md         # Optional, contains descriptive metadata for display at Ballerina Central
    *.bal              # In this dir and recursively in subdirs except tests/ and resources/
    [tests/]           # Module-specific unit and integration tests
    [resources/]       # Module-specific resources

  modules.can.include.dots.inthe.dir.name/
    Module.md
    *.bal
    [tests/]         
    [resources/]     

  target/              # Compiled executables and other artifacts end up here
      main.balx
      Ballerina.lock   # Generated during build, used to rebuild identical binary
```

Any source files located in the project root are assumed to be part of the unnamed module. They are each assumed to be entry points and compiled into `target/<file-name>.balx`. This structure is to simplify new development, but not recommended for large projects. Large projects should place the entrypoint or entry service into a named module.

### Build a Project
Building a project will build all projects and source files found in the project's root folder. Building a project runs through phases including dependency resolution, compilation, artifact generation, and unit test execution.

```bash
ballerina build
```

### Build a Module
You can build a single module contained within a project:

```bash
ballerina build <module-name>
```
Use the `--skiptests` flag with the `ballerina build` command to skip running the tests during the build process.

```bash
ballerina build --skiptests
```

### Version a Module
Modules in a project are assigned their version from within the `Ballerina.toml` file:

```toml
# The current version, obeying [semver](https://semver.org/)
version = “string”
```

All modules built in a project are assigned the same version. If you need two modules to have different versions, then those modules should be placed into different projects.

Version labels must follow [Semantic Versioning 2.0 rules](https://semver.org/).

### Assign an Organization Name to a Module
A module is assigned an `<org-name>` when it is pushed into a repository. The `<org-name>` is defined in the `Ballerina.toml` and all modules in the same project are assigned the same organization name:

```toml
# Org name assigned to modules when installed into a repository
org-name = “tyler”
```

## Repositories
A repository is a collection of modules. A repository helps organize modules used by multiple programs by managing their versions and assets in a central location.

There are four kinds of repositories:

1. Project Repository. This repository is located in a project's `.ballerina/` folder and contains installed versions of modules from the project.  

2. Home Repository. This repository is located on a developer's machine at the location of `BALLERINA_HOME_DIR` or `~\.ballerina` if not specified.

3. System Repository. A special repository that is embedded within the Ballerina distribution which contains `ballerina/*` core modules.

4. Ballerina Central. Located at [http://central.ballerina.io](http://central.ballerina.io), this centrally managed repository is a community hub to discover, download, and publish Ballerina modules.

### Repository Precedence
When building a Ballerina program with a project, the build system will search repositories for any imported dependencies. Dependencies are searched in the system, then project, then home, then Ballerina Central repositories for the dependency. Once found, it will be used to resolve the dependencies of the Ballerina program.

If a module is discovered at Ballerina Central, the build system will download the module's files before installing into the home repository for reuse.

### Module Installation
When building a module in a project, that module is automatically installed into the project's local repository. That module can be shared across other projects by installing it into the home repository.

The org-name and the version of the module will be read from the manifest file `Ballerina.toml` inside the project.

By default the sources will be built before installing the module to the home repository. The building of the sources before installing can be skipped by having the `--no-build` flag.

To install a single module in a project:
```bash
ballerina install <module-name>

# Alternate form:
ballerina push <module-name> --repository home
```
To install a single module in a project without building the sources:
```bash
ballerina install <module-name> --no-build
```

### Uninstalling Modules
Modules that are installed to the home repository which are shared across other projects can be uninstalled or removed.

```bash
ballerina uninstall <org-name>/<module-name>:<version>
```
### Organizations
An organization is a logical name used for grouping modules together under a common namespace within a repository.

All modules installed into a repository must have an organization name. Any installation or pushing of a module into a repository will fail without an organization name.

Organization names can contain lowercase alphanumeric characters and underscores. None of the characters in an organization name have any semantic meaning.

The organization names `ballerina` and `ballerinax` are reserved for system use. Modules in `ballerina` and `ballerinax` are included within the system distribution.

Remotely hosted repositories, such as Ballerina Central, can each have their own approach for assigning a user's organization name. At Ballerina Central, every account is assigned a personal organization name, which is chosen by a user when first creating their account or derived from the email address of the user.

When pushing a module from a local computer into a remote repository, such as Ballerina Central, the user's organization name in the remote repository MUST match the `<org-name>` assigned in the Ballerina.toml. If the names do not match, then the push operation will fail. This enforcement may seem arbitrary, however, it is a simple way to ensure organization naming consistency across remote and local development environments.

### Pulling Remote Modules
You can install modules that exist in a remote repository into your home repository through "pulling". Pulling a module discovers and downloads the module source and binaries from a remote repository and installs it into the home repository. The module will be pulled from Ballerina Central.

```bash
ballerina pull <org-name>/<module-name>[:<version>]
```

If a version is not specified for the module to be pulled, the latest version of the module will be pulled from the remote repository. Projects that perform dependency analysis will automatically pull modules into the home repository.

### Pushing Modules Into Remote Repositories
"Pushing" a module uploads the associated module files and installs the module into a remote repository, which is Ballerina Central.

The org-name and the version of the module will be read from the manifest file `Ballerina.toml` inside the project.

By default the sources will be built before pushing the module to Ballerina Central. The building of the sources before pushing can be skipped by having the `--no-build` flag.
                                                                                                
```
# Push a single module
ballerina push <module-name>

# Push a single module without building the sources.
ballerina push <module-name> --no-build
```

Ballerina Central requires an account in order to push modules. Your account is represented by a CLI token that is installed into your local Ballerina configuration file, located at `~/.ballerina/Settings.toml`. The CLI token is automatically installed into this file the first time you perform a `ballerina push` as Ballerina redirects to an OAuth authorization screen, configures your account, and then copies your CLI token from Ballerina Central into your local CLI configuration.

Every push of the same module into Ballerina Central REQUIRES a new version, even for minor text updates. We enforce this policy to ensure that projects that make use of dependencies cannot experience accidental behavior drift across two versions of the same module given the same version. Essentially, there is no way to "update" a module for a specific version at Ballerina Central.
