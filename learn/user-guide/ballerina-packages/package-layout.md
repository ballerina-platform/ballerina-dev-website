---
layout: ballerina-left-nav-pages-swanlake
title: Package Layout
description: The below is the structure of a package directory. It explains the purpose of each file in a package.
keywords: ballerina, programming language, ballerina packages, package structure, package layout
permalink: /learn/user-guide/ballerina-packages/package-layout/
active: package-layout
intro: The below is the structure of a package directory. It explains the purpose of each file in a package.
redirect_from:
- /learn/user-guide/ballerina-packages/package-layout
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

## 'Ballerina.toml'

The `Ballerina.toml` identifies the directory as a Ballerina package. It contains all the meta-information that is needed to build your package.

```toml
[package]
org = "samjs"
name = "winery"
version = "0.1.0"
exported = [winery, winery.model]

[build-options]
observabilityIncluded = true
```

The `[package]` table contains the meta information about the package.

### The 'org' Field

The organization is a logical name used for grouping modules together under a common namespace within a repository. Building a library package with `bal build -c` and pushing a library package into a repository will fail without an organization name.

Organization names can only contain alphanumerics, underscore, and the maximum length is 256 characters.

When you run the `bal new` command, the organization name by default will be set to the user name of your machine. You can choose to update the `Ballerina.toml` file to amend the organization name appropriately.

As described in [organization](/learn/user-guide/ballerina-packages/sharing-a-library-package/#publishing-a-library-package-to-ballerina-central), the restrictions for the organization name of a package when publishing to [Ballerina Central](https://central.ballerina.io/) should also be considered before choosing an organization name.


### The 'name' Field

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

*   If the package is in the initial stages of development, label the package with the zero major version (0.x.y). This will give you a hint that API changes are frequent and that the package is far from being production-ready.
*   Use the versions as three numeric parts `MAJOR.MINOR.PATCH` (e.g., `1.0.0`).
    *   Increment the patch version when only backward-compatible bug fixes are introduced.
    *   Increment the minor version when new backward-compatible functionality is introduced to the public API.
    *   Increment the major version when any backward-incompatible changes are introduced to the public API.
*   When you are improving the package towards the stabilization to roll out to production, pre-release versions are suitable for versioning (e.g., `1.0.0- alpha`). Though the changes are not at the rate of the initial development phase, API changes are still likely to happen, and thereby, the pre-release versions are not considered as production-ready.
*   If the changes to pre-release versions are incremental, you can use the numeric pre-release versioning technique (e.g., `1.0.0-alpha.1`, `1.0.0-alpha.2`).
*   Once the package is production-ready, you can use a stable version (e.g., `1.0.0`). Any subsequent minor or patch releases of the same major version should be backward compatible, and thereby, should not break the existing builds.


### Build Options

The `[build-options]` table specifies options that should be applied when building the package. You can provide build options in the `Ballerina.toml` instead of passing them to the `bal build` command.

Ballerina supports the following build options.

```toml
[build-options]
observabilityIncluded=true
experimental=true
offline=true
skipTests=true
testReport=true
codeCoverage=true
cloud="k8s"
```

**`Dependencies.toml`**

The [`Dependencies.toml`](/learn/user-guide/ballerina-packages/dependencies/#dependenciestoml) locks the versions of the dependencies so that you can have a repeatable build.

**`Package.md`**

The `Package.md` file provides a human-readable description of a package. This is the first page that you will see when you navigate to the package in [Ballerina Central](https://central.ballerina.io/). This file is written in markdown format.

**`target` directory**

The `target/` directory contains artifacts generated by building a package.

**`resources/`, `tests/` directories and `Module.md`**

These are directories related to the default module. For detailed information, see [Modules](/learn/user-guide/ballerina-packages/modules).

**`modules/` directory**

This directory contains the other modules. The layout of this directory is explained in the [Module Layout](/learn/user-guide/ballerina-packages/modules/#module-layout).

<style>
.cBallerinaTocContainer {
    display: none !important;
}
</style>
