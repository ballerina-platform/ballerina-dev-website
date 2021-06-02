---
layout: ballerina-left-nav-pages-swanlake
title: Dependencies
description: The below are all you need to know about dependencies. It explains imports and how they can be used in your package.
keywords: ballerina, programming language, ballerina packages, dependencies, importing modules
permalink: /learn/user-guide/ballerina-packages/dependencies/
active: dependencies
intro: The below are all you need to know about dependencies. It explains imports and how they can be used in your package.
redirect_from:
- /learn/user-guide/ballerina-packages/dependencies
---

### Importing Modules

In Ballerina, you can access any public symbol from another module by importing the particular module using an import declaration. The import declaration syntax is as follows.

```bal
import [org-name /] module-name [as import-prefix];
```

* The `_org-name_` is optional for importing a module from the current package.
* The `_import-prefix_` has to be a valid Ballerina identifier and the import-prefix is used to refer to public symbols in the declared module.
* The `_import-prefix_` is also optional. If it is not available, the last part of the module name can be used.

**Note:** The source code of the `main.bal` file in your package will have the import statement below.

```bal
import ballerina/io;
```

You can import a module by providing the organization name and the module name. The module name of the default module is always the package name.

#### Importing Modules of the Same Package

The organization name can be omitted only if you are importing a module from the same package. 

This is the directory structure of your package after adding the `hello_world.util` module.

```bash
.
├── Ballerina.toml
├── main.bal
└── modules
     └── util
         └── util.bal

2 directories, 3 files
```

You can add a public function in the `hello_world.util` module and use this function in the `main.bal` file in [the default module](/learn/user-guide/ballerina-packages/modules/#the-default-module).

```bal
import hello_world.util

String formattedMsg = util:properCaseMessage(“hello world!”);
```

Since the import-prefix is not given here, use `util` to refer to the symbols in the `hello_world.util` module. Here, `util:properCaseMessage` is called a qualified identifier.

### Managing Dependencies

When you build a package that has dependencies to other packages, the compiler automatically figures out the latest compatible versions of the required packages. 
For identifying the latest versions of these dependencies, by default, Ballerina searches for the packages of dependencies in 2 repositories: The distribution repository and the Ballerina Central repository.

**Distribution repository**

The distribution repository is a file system repository that comes with the local ballerina installation. The repository is located at `<BALLERINA_HOME>/repo/bala`.

**Ballerina Central repository**

Ballerina Central repository is a remote repository, and thereby, it comes with a local file system cache, which is located at `<USER_HOME>/.ballerina/repositories/central.ballerina.io/repo/bala`. When resolving a dependency, the remote repository will be queried only if the specified version is not present in its local cache.

#### 'Dependencies.toml'

```toml
[[dependency]]
org = "ballerinax"
name = "aws.s3"
version = "0.99.4”
```

When you execute `bal build`, the `Dependencies.toml` is created if at least one dependency is referred to its stable version. From the second build onwards, the compiler honors the version declared in the `Dependencies.toml` until you update the file.

When you find a newer version of the `ballerina/io` package, which you want to use in your code, either delete the corresponding dependency declaration from the `Dependencies.toml` file or update the version. If you delete the dependency declaration, then the compiler updates the file with the latest version during the next build.

When the `Dependencies.toml` is updated by a build, only the stable versions are recorded. If any pre-release versions are used that need to be locked, then they must be added manually to the file.

### Version Compatibility

Abiding by the specifications of [Semantic Versioning](https://semver.org/), Ballerina considers two versions to be **compatible if the major versions are equal and not zero**.

A few examples would be as follows:

* `0.2.3` and `0.2.4` are considered incompatible since the major version is zero. The major version zero is considered as unstable.
* `1.2.3`, `1.2.4`, and `1.4.5` are compatible. `1.4.5` will be considered as the latest.
* `1.2.3-alpha`, `1.2.3-alpha.2`, and `1.2.3-beta` are compatible and `1.2.3-beta` is considered as the latest.
* `1.2.3-alpha`, `1.2.3-beta`, `1.2.4-alpha` are compatible and `1.2.4-alpha` is considered as the latest.

This rule is used during the package resolution process and if any two incompatible versions of the same package are found in the dependency graph, an error will be thrown failing the build.

For example, if one dependency in your package depends on the `1.0.0` version of the `ballerina/log` package and another dependency depends on `2.0.0-beta.1` of the same, the build will fail with the following error in the console.

```bash
error: compilation failed: Two incompatible versions exist in the dependency graph: ballerina/log versions: 1.0.0, 2.0.0-beta.1
```

### Overriding Dependencies

The needto override a dependency can arise through a number of scenarios. The most common scenario out of them is the need to test a package 
before [publishing to the Ballerina Central](/learn/user-guide/ballerina-packages/sharing-a-library-package/#publishing-a-library-package-to-ballerina-central). This can be achieved with the local repository.

#### The Local Repository

The local repository is a custom repository in the local file system. You can push a package to the repository by providing the `--repository=local` option  with the `bal push` command below.

```bash
bal push --repository=local
```

Then, by specifying the repository for the preferred dependencies in the `Dependencies.toml` file, you can force to resolve a package from the local repository.

```toml
[[dependency]]
org= "ballerinax"
name= "aws.s3"
version= "0.99.4"
repository="local"
```
