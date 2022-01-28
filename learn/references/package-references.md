---
layout: ballerina-package-references-left-nav-pages-swanlake
title: Package References
description: The sections below include information about the structure of a package directory. It explains the purpose of each file in a package.
keywords: ballerina, programming language, ballerina packages, package structure, package layout
permalink: /learn/package-references/
active: package-layout
intro: The sections below include information about the structure of a package directory. It explains the purpose of each file in a package.
redirect_from:
  - /learn/package-layout
  - /learn/package-layout/
---

```bash
.
├── Ballerina.toml
├── Dependencies.toml
├── Package.md
├── Module.md
├── main.bal
├── utils.bal
├── tests/
│     ├── main_tests.bal
│     └── utils_tests.bal
├── resources/
│     └── app.png
├── modules/
│     ├── model/
│     └── module1.test/
└── target/
```

## The `Ballerina.toml` File

The `Ballerina.toml` identifies the directory as a Ballerina package. It contains all the meta-information that is needed to build your package.

```toml
[package]
org = "samjs"
name = "winery"
version = "0.1.0"
export = ["winery", "winery.model"]

[build-options]
observabilityIncluded = true
```

The `[package]` table contains the meta information about the package.

### The `org` Field

The organization is a logical name used for grouping modules together under a common namespace within a repository. Building a library package with `bal build -c` and pushing a library package into a repository will fail without an organization name.

Organization names can only contain alphanumerics, underscore, and the maximum length is 256 characters.

When you run the `bal new` command, the organization name by default will be set to the user name of your machine. You can choose to update the `Ballerina.toml` file to amend the organization name appropriately.

As described in [organization](/learn/user-guide/publishing-packages-to-ballerina-central/), the restrictions for the organization name of a package when publishing to [Ballerina Central](https://central.ballerina.io/) should also be considered before choosing an organization name.


### The `name` Field

The package name is an identifier used to refer to the package.

The name can only contain alphanumerics, underscore, period and the maximum length is 256 characters.

If the package name is not provided in the `Ballerina.toml` file, then the current directory name is set as the package name. If there are any characters in the directory name mismatching the allowed regex, these will be replaced with the `_` character.

#### Hierarchical Package Names

When there are various functionalities to be provided, it would make more sense to split them into multiple packages instead of adding it all into a single package.  For scenarios like this, you can give a hierarchical name to the package.

For example, if you need to provide a set of APIs to communicate with AWS, you can choose to support APIs to AWS services using multiple packages such as `aws.s3`, `aws.sqs`, `aws.rds`, etc.

#### The Split Module Condition

If the same module exists in the latest versions of two different packages, this instance is called a "split module condition" and an error would be reported failing the build. Therefore, when using hierarchical package names, it is important to ensure that the package repository does not hold another package containing a module with the same name in its latest version.

For example, if you created the `aws.rds` package that contains the `aws.rds.mysql` module and that you published the version `1.0.0` to [Ballerina Central](https://central.ballerina.io/). Now you have decided to move the `aws.rds.mysql` module to its own package. In this case, you first need to push a newer version of the `aws.rds` package that does not contain the `aws.rds.mysql` module and then push the newly-created `aws.rds.mysql` package.


### The `version` Field

Ballerina strictly follows the rules of [Semantic Versioning](https://semver.org/). Therefore, in general, you should follow the SemVer best practices when versioning a package.

*   If the package is in the initial stages of development, label the package with the zero major version (0.x.y). This will give the user a hint that API changes are frequent and that the package is far from being production-ready.
*   Use versions as three numeric parts `MAJOR.MINOR.PATCH` (E.g. 1.0.0).
    *   Increment the patch version when only backward compatible bug fixes are introduced.
    *   Increment the minor version when new backward compatible functionality is introduced to the public API.
    *   Increment the major version when any backward incompatible changes are introduced to the public API.
*   When you are improving the package towards the stabilization to roll out to production, pre-release versions are suitable for versioning (E.g. 1.0.0-alpha). Though the changes are not at the rate of the initial development phase, API changes are still likely to happen and so pre-release versions are not considered as production-ready.
*   If the changes to pre-release versions are incremental, you can use the numeric pre-release versioning technique (E.g. 1.0.0-alpha.1, 1.0.0-alpha.2).
*   Once the package is production-ready, you can use a stable version (E.g. 1.0.0). Any subsequent minor or patch releases of the same major version should be backward compatible and thus, should not break existing builds.


### Build Options

The `[build-options]` table specifies options that should be applied when building the package. You can provide build options in the `Ballerina.toml` instead of passing them to the `bal build` command.

Ballerina supports the following build options.

```toml
[build-options]
observabilityIncluded = true
sticky = true
offline = true
skipTests = true
testReport = true
codeCoverage = true
cloud = "k8s"
```

### Packaging Java Libraries

When you compile a Ballerina package with `bal build`, the compiler creates an executable JAR file. However, if the package does not contain an entry point, it will produce a non-executable JAR file (a library package), which can be used in another package/program. In both cases, the Ballerina compiler produces self-contained archives. There are situations in which you need to package JAR files with these archives.

You can store the JAR files anywhere in your file system. As a best practice, maintain Java libraries inside the package.
The platform-specific library information need to be specified in the `Ballerina.toml` file. Java libraries are considered as platform-specific libraries.
You can specify a JAR file dependency in the `Ballerina.toml` file as shown below.

```toml
[[platform.java11.dependency]]
# Absolute or relative path of the JAR file.
path = "<path-to-jar-file-1>"
# An optional comma-separated list of Ballerina module names (to restrict the usage of this JAR).
modules = ["<ballerina-module-1>"]
```

Alternatively, you can also specify Maven dependencies as platform-specific libraries. These specified dependencies would then get resolved into the `target/platform-libs` directory when building the package. You can specify a Maven dependency in the `Ballerina.toml` file as shown below.

```toml
[[platform.java11.dependency]]
# An optional comma-separated list of Ballerina module names (to restrict the usage of this JAR).
modules = ["<ballerina-module-1>"]
# Group ID of the Maven dependency.
groupId = "<group-id>"
# Artifact ID of the Maven dependency.
artifactId = "<artifact-id>"
# Version of the Maven dependency.
version = "<version>"
```

If you wish to use a custom Maven repository, you can specify it in the `Ballerina.toml` file as shown below.
```toml
[[platform.java11.repository]]
id = "<maven-repository-id>"
url = "<maven-repository-url>"
username = "<maven-repository-username>"
password = "<maven-repository-password>"
```

If your package has only the default root module, then you can attach all the JAR file dependencies to your default root module as the best practice.

If your package is a Ballerina library package, then you should specify the JAR file dependencies in each Ballerina module if that module depends on the JAR file.

The `bal build` packages all JARs specified in the `Ballerina.toml` file with the executable JAR file.

## The `Dependencies.toml` File

The [`Dependencies.toml`](/learn/managing-dependencies/#specifying-dependency-versions) locks the versions of the dependencies so that you can have a repeatable build.
This file is auto-generated by the compiler and managed by the Ballerina CLI and does not need user intervention.

## The `Package.md` File

The `Package.md` file provides a human-readable description of a package. This is the first page that you will see when you navigate to the package in [Ballerina Central](https://central.ballerina.io/). This file is written in markdown format.

## The `target/` Directory

The `target/` directory contains artifacts generated by building a package.

## The `resources/`, `tests/` Directories, and `Module.md`

These are directories related to the default module. For detailed information, see [Module Layout](/learn/package-references/#module-layout).

## The `modules/` Directory

This directory contains the other modules. The layout of this directory is explained in the [Module Layout](/learn/package-references/#module-layout).

## Module Layout

```bash
.
├── app.bal
├── utils.bal
├── tests/
│     ├── main_tests.bal
│     ├── utils_tests.bal
│     └── resources/
│           └── test_res.json
└── resources/
      └── app.png
```

### Module Directories

The root directory of the default module is the root of the package directory. The top-level `modules/` directory contains all the other modules. Each immediate subdirectory of the `modules/` directory becomes a Ballerina module and the subdirectory name becomes the module name. Therefore, the subdirectory name should be a valid Ballerina identifier.

Module names can only contain alphanumerics, underscores, and periods and the maximum length is 256 characters. The value of the first identifier of the modules belonging to the same package will always be the package name.

```bash
<package-name>[.<module-directory-name>]
```

You can add other modules using the `bal add` command:

```bash
bal add util
```

### The `.bal` Source Files

The source files of a module are placed at the root of the module directory. 

The `.bal` files in the directories except for the root directory of the module and `tests/` directory are not considered as the sources of the package. These can be treated as standalone Ballerina files.

### The `Module.md` File

The `Module.md` file provides a human-readable description of a module. When you visit a package in [Ballerina Central](https://central.ballerina.io/), you should see all the exported modules of that package. This is the first page you will see when you navigate to an exported module of a package.

### The `resources/` Directory

The `resources/` directory can be used to store all module resources such as images, default configs, etc.

### The `tests/` Directory

The `tests/` directory contains unit tests of the module and they test the module in isolation. The module-level test cases have access to the symbols with module-level visibility.

<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>

 
