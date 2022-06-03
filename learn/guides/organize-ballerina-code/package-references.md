---
layout: ballerina-organizing-code-left-nav-pages-swanlake
title: Package references
description: The sections below include information about the structure of a package directory. It explains the purpose of each file in a package.
keywords: ballerina, programming language, ballerina packages, package structure, package layout
permalink: /learn/organize-ballerina-code/package-references/
active: package-references
intro: The sections below include information about the structure of a package directory. It explains the purpose of each file in a package.
redirect_from:
  - /learn/package-layout
  - /learn/package-layout/
  - /learn/package-references/
  - /learn/package-references/
  - /learn/organize-ballerina-code/package-references
---

## Package layout

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

## The `Ballerina.toml` file

The `Ballerina.toml` identifies the directory as a Ballerina package. It contains all the meta information that is needed to build your package.

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

### The `org` field

The organization is a logical name used for grouping modules together under a common namespace within a repository. Building a library package with `bal build -c` and pushing a library package into a repository will fail without an organization name.

Organization names can only contain alphanumerics, underscore, and the maximum length is 256 characters.

When you run the `bal new` command, the organization name by default will be set to the user name of your machine. You can choose to update the `Ballerina.toml` file to amend the organization name appropriately.

As described in [Organizations](/learn/publish-packages-to-ballerina-central/#organizations), the restrictions for the organization name of a package when publishing to [Ballerina Central](https://central.ballerina.io/) should also be considered before choosing an organization name.


### The `name` field

The package name is an identifier used to refer to the package.

The name can only contain alphanumerics, underscore, period, and the maximum length is 256 characters.

If the package name is not provided in the `Ballerina.toml` file, then the current directory name is set as the package name. If there are any characters in the directory name mismatching the allowed regex, these will be replaced with the `_` character.

#### Hierarchical package names

When a package provides multiple functionalities, it is better to split it into multiple packages instead.  For scenarios like this, you can give a hierarchical name to the package.

For example, if you need to provide a set of APIs to communicate with AWS, you can choose to support APIs to AWS services using multiple packages such as `aws.s3`, `aws.sqs`, `aws.rds`, etc.

#### The split module condition

A `split module condition` occurs when the latest versions of two different packages contain the same module, resulting in a build failure. When using hierarchical package names, ensure that the package repository does not hold another package containing a module with the same name in its latest version.

For example, if you created and published to [Ballerina Central](https://central.ballerina.io/), the `1.0.0` version of `aws.rds` package containing `aws.rds.mysql` module
 and decide to move the `aws.rds.mysql` module to a separate package later, you need to follow the below steps.

1. Push a new version(`1.0.1`) of the `aws.rds` package that does not contain the `aws.rds.mysql` module
2. Push new `aws.rds.mysql` package

### The `version` field

Ballerina strictly follows the rules of [Semantic Versioning](https://semver.org/). Therefore, in general, you should follow the SemVer best practices when versioning a package.

*   If the package is in the initial stages of development, label the package with the zero major version (0.x.y). This will give the user a hint that API changes are frequent and that the package is far from being production-ready.

*   Use versions as three numeric parts `MAJOR.MINOR.PATCH` (E.g. 1.0.0).
    *   Increment the patch version when only backward compatible bug fixes are introduced.
    *   Increment the minor version when new backward compatible functionality is introduced to the public API.
    *   Increment the major version when any backward incompatible changes are introduced to the public API.

*   When you are stabilizing the package to roll out to production, pre-release versions are suitable for versioning (E.g. 1.0.0-alpha).
    Pre-release versions are not considered production-ready. Even though not frequent compared to the initial development phase, API changes are possible.

*   If the changes to pre-release versions are incremental, you can use the numeric pre-release versioning technique (E.g. 1.0.0-alpha.1, 1.0.0-alpha.2).

*   Once the package is production-ready, you can use a stable version (E.g. 1.0.0). Any subsequent minor or patch releases of the same major version should be backward compatible and, should not break existing builds.


### Build options

The `[build-options]` table specifies options that should be applied when building the package. You can provide build options in the `Ballerina.toml` instead of passing them to the `bal build` command.

Ballerina supports the following build options.

```toml
[build-options]
observabilityIncluded = true
offline = true
skipTests = true
testReport = true
codeCoverage = true
cloud = "k8s"
```

### Platform dependencies

When you compile a Ballerina package with `bal build`, the compiler creates an executable JAR file. However, if the package does not contain an entry point, it will produce a non-executable JAR file (a library package), which can be used in another package/program.
In both cases, the Ballerina compiler creates self-contained archives. There are situations in which you need to package JAR files with these archives.

You can store the JAR files anywhere in your file system. As a best practice, maintain Java libraries inside the package.
The platform-specific library information needs to be specified in the `Ballerina.toml` file. Java libraries are considered platform-specific.
You can specify a JAR file dependency in the `Ballerina.toml` file as shown below.

```toml
[[platform.java11.dependency]]
# Absolute or relative path of the JAR file.
path = "<path-to-jar-file-1>"
# An optional comma-separated list of Ballerina module names (to restrict the usage of this JAR).
modules = ["<ballerina-module-1>"]
```


Alternatively, you can also specify Maven dependencies as platform-specific libraries. These specified dependencies get resolved into the `target/platform-libs` directory when building the package. You can specify a Maven dependency in the `Ballerina.toml` file as shown below.

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


## The `Dependencies.toml` file

The [`Dependencies.toml`](/learn/manage-dependencies/#specify-dependency-versions) locks the versions of the dependencies to support repeatable builds.
This file is auto-generated and managed by the Ballerina CLI. It does not need user intervention.

## The `Package.md` file

The `Package.md` file provides a human-readable description of a package. This file is required for publishing a package to a repository. 
It is the first page you will see when you navigate to the package in [Ballerina Central](https://central.ballerina.io/).
This file is in markdown format. It will be auto-generated when you create a library package. For steps to create a library package, see [Create a Library Package](/learn/publish-packages-to-ballerina-central/#create-a-library-package)

## The `target/` directory

The `target/` directory contains artifacts generated by building a package.

## The `resources/`, `tests/` directories, and `Module.md`

These are directories related to the default module. For detailed information, see [Module layout](/learn/package-references/#module-layout).

## The `modules/` directory

This directory contains the other modules. The layout of this directory is explained in the [Module layout](/learn/package-references/#module-layout).

## Module layout

```bash
.
├── app.bal
├── utils.bal
├── tests/
│     ├── main_tests.bal
│     ├── utils_tests.bal
│     └── resources/
│           └── test_resource.json
└── resources/
      └── app.png
```

### Module directories

The root directory of the default module is the root of the package directory. The top-level `modules/` directory contains all the other modules. Each immediate subdirectory of the `modules/` directory becomes a Ballerina module. The subdirectory name becomes the module name. Therefore, the subdirectory name should be a valid Ballerina identifier.

Module names can only contain alphanumerics, underscores, and periods and the maximum length is 256 characters. For the modules belonging to the same package, the value of the first identifier is the package name.

```bash
<package-name>[.<module-directory-name>]
```

You can add other modules using the `bal add` command.

```bash
bal add util
```

### The `.bal` source files

The root of the module directory contains the source files of that module.
The package sources are the `.bal` files in the `root` directory, and `tests/` directory of the module. All other `.bal` files are treated as standalone Ballerina files.

### The `Module.md` file

The `Module.md` file provides a human-readable description of a module. When you visit a package in [Ballerina Central](https://central.ballerina.io/), you should see all the exported modules of that package. It is the first page you will see when you navigate to an exported module of a package.

### The `resources/` directory

The `resources/` directory stores all module resources such as images, default configs, etc.

### The `tests/` directory

The `tests/` directory contains unit tests for the module and tests the module in isolation. The module-level test cases have access to the symbols with module-level visibility.

<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>

 
