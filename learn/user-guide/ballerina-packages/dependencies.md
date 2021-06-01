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

In Ballerina, we can access any public symbol from another module by importing the particular module using an import declaration. The import declaration syntax is as follows:

```bal
import [org-name /] module-name [as import-prefix];
```

* The _org-name_ is optional for importing a module from the current package.
* The _import-prefix_ has to be a valid Ballerina identifier and the import-prefix is used to refer to public symbols in the declared module.
* The _import-prefix_ is also optional. If it is not available, the last part of the module-name can be used.

If we notice the source code of the main.bal file in our package, we can see the following import statement.

```bal
import ballerina/io;
```

We can import a module by providing the organization name and the module name. The module name of the default module is always the package name.

#### Importing modules of the same package

The organization name can be omitted only if we are importing a module from the same package. Let’s see how we can import a module from the same package.

This is the directory structure of our package after adding the `hello_world.util` module.
```bash
.
├── Ballerina.toml
├── main.bal
└── modules
     └── util
         └── util.bal

2 directories, 3 files
```
We can add a public function in the `hello_world.util` module and use this function in the main.bal file in the [default module](/learn/user-guide/ballerina-packages/modules#default-module).

```bal
import hello_world.util

String formattedMsg = util:properCaseMessage(“hello world!”);
```

Since the import-prefix is not given here, we use `util` to refer to the symbols in the hello_world.util module. Here, `util:properCaseMessage` is called a qualified identifier.

### Managing Dependencies

When we build a package that has dependencies to other packages, the compiler automatically figures out the latest compatible versions of the required packages. 
For identifying the latest versions of these dependencies, by default, Ballerina searches for the packages of dependencies in 2 repositories: The Distribution repository and the Ballerina Central repository.

**Distribution repository**

The Distribution repository is a file system repository that comes with the local ballerina installation. The repository is located at `<BALLERINA_HOME>/repo/bala`.

**Ballerina Central repository**

Ballerina Central repository is a remote repository and hence it comes with a local file system cache which is located at `<USER_HOME>/.ballerina/repositories/central.ballerina.io`. When resolving a dependency, the remote repository will be queried only if the specified version is not present in the local cache.

#### Dependencies.toml
```toml
[[dependency]]
org = "ballerinax"
name = "aws.s3"
version = "0.99.4”
```

When we execute `bal build`, the Dependencies.toml is created if at least one dependency is referred to its stable version. From the second build onwards, the compiler honors the version declared in the Dependencies.toml file until we choose to update the Dependencies.toml file.

We can also update the dependencies in the Dependencies.toml file. When we find a newer version of the ballerina/io package which we want to use in our code, we have the option to either delete the corresponding dependency declaration from the TOML file or update the version. If we delete the dependency declaration, then the compiler updates the file with the latest version during the next build.

When the Dependencies.toml is updated by a build, only stable versions are recorded. If any pre-release versions are used that need to be locked, then they must be manually added to the file.


### Version compatibility

Abiding by the common convention of [Semantic Versioning](https://semver.org/), Ballerina considers versions to be **compatible if the major versions are equal and NOT zero**.
A few examples would be as follows:

* 0.2.3 and 0.2.4 are considered incompatible since the major version is zero
* 1.2.3, 1.2.4, and 1.4.5 are compatible; 1.4.5 will be considered as the latest
* 1.2.3-alpha, 1.2.3-alpha.2 and 1.2.3-beta are compatible, 1.2.3-beta is considered as the latest
* 1.2.3-alpha, 1.2.3-beta, 1.2.4-alpha are compatible, 1.2.4-alpha is considered as the latest

This rule is used during the package resolution process and if any two incompatible versions are found in the dependency graph an error will be thrown failing the build.

For example, if one dependency in your package depends on version `1.0.0` of `ballerina/log` package and another dependency depends on `2.0.0-beta.1` of the same, the build will fail with the following error in the console.

```bash
error: compilation failed: Two incompatible versions exist in the dependency graph: ballerina/log versions: 1.0.0, 2.0.0-beta.1
```

### Overriding dependencies

The desire to override a dependency can arise through a number of scenarios. The most common scenario out of them is the need to test a package 
before [publishing to the Ballerina Central](/learn/user-guide/ballerina-packages/sharing-a-library-package#publishing-a-library-package-to-ballerina-central). 
This can be achieved with the local repository.

#### Local repository

The local repository is a custom repository in the local file system. We can push a package to the repository by providing the option `--repository=local` with bal push command.

```bash
$ bal push --repository=local
```

Then, by specifying the repository for the preferred dependencies in the Dependencies.toml file we can force it to resolve a package from the local repository

```toml
[[dependency]]
org= "ballerinax"
name= "aws.s3"
version= "0.99.4"
repository="local"
```
