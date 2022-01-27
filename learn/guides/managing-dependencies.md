---
layout: ballerina-managing-dependencies-left-nav-pages-swanlake
title: Managing Dependencies
description: The sections below include information about dependencies, imports, and how they can be used in your package.
keywords: ballerina, programming language, ballerina packages, dependencies, importing modules
permalink: /learn/managing-dependencies/
active: managing-dependencies
intro: The sections below include information about dependencies, imports, and how they can be used in your package.
redirect_from:
- /learn/user-guide/ballerina-packages/dependencies
- /learn/user-guide/ballerina-packages/dependencies/
- /learn/managing-dependencies
---

## Specifying Dependencies

A package can depend on other packages that are available in Ballerina repositories. By default, Ballerina searches for the dependencies in 2 repositories: The distribution repository and the Ballerina Central repository. It also supports a third repository named the `local repository`, which is useful in the package development phase and for bug fixing. The local repository is used to temporarily override dependencies for testing or development purposes.

**Distribution repository**

The distribution repository is a file system repository that comes with the local Ballerina installation. The repository is located at `<BALLERINA_HOME>/repo/bala`.

**Ballerina Central repository**

The Ballerina Central repository is a remote repository, and thereby, it comes with a local file system cache, which is located at 
`<USER_HOME>/.ballerina/repositories/central.ballerina.io/repo/bala`. When resolving a dependency, 
the remote repository will be queried only if the specified version is not present in its local cache.

**Local repository**

The local repository is also a file system repository, which will be created in the `<USER_HOME>` location. The repository location is `<USER_HOME>/.ballerina/repositories/local/repo/bala`. 
For details on using the local repository, see [local repository](/learn/user-guide/ballerina-packages/dependencies/#local-repository).

### Importing a Module

By using an import statement in the Ballerina code, you can use exported modules of any of the packages. This enables access to all public symbols in the imported module. 

The import declaration syntax is as follows.

```bash
import [org-name /] module-name [as import-prefix];
```

* The `import-prefix` has to be a valid Ballerina identifier and the import-prefix is used to refer to public symbols in the declared module.
* The import-prefix is optional. If it is not available, the last part of the module name can be used.

You can import a module by providing the organization name and the module name. The module name is constructed using the package name and the name of the root directory of the module. 
The module name of the default module is always the package name. 

The following example shows how we can import modules from the `ballerina/io` package.

```bal
import ballerina/io;`// imports default module of io package

public function main() {
	io:println("Hello world!");
}
```
The following is another example that shows the usage of multiple modules from different libraries.

```bal
// Imports the default module from the `ballerina/log` package.
import ballerina/log;
// Imports the default module from the `googleapis.gmail` package with an import prefix.
import ballerinax/googleapis.gmail as gmail;
// Imports the only non-default module from the `googleapis.gmail` package with an import prefix.
import ballerinax/googleapis.gmail.'listener as gmailListener;

configurable string refreshToken = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;
configurable int port = ?;
configurable string project = ?;
configurable string pushEndpoint = ?;

gmail:ConnectionConfig gmailConfig = {
    auth: {
        refreshUrl: gmail:REFRESH_URL,
        refreshToken: refreshToken,
        clientId: clientId,
        clientSecret: clientSecret
        }
};

listener gmailListener:Listener gmailEventListener = new(port, gmailConfig, project, pushEndpoint);

service / on gmailEventListener {
   remote function onNewEmail(gmail:Message message) returns error? {
           log:printInfo("New Email : " , message = message);
   }   
}

```

## Specifying Dependency Versions

The dependency versions are automatically figured out by the compiler when a package is built. The latest compatible versions of the dependencies are resolved by searching the packages of dependencies in the distribution repository and the Ballerina Central repository and if specified from the local repository as well.

When you execute `bal build` for the first time on the package, the CLI operation will auto-generate the `Dependencies.toml` in the package root. 
This will contain the resolved dependency versions. From thereon, the versions locked in the `Dependencies.toml` are considered as the minimum required versions for the subsequent builds.

In the subsequent builds, the compiler will automatically update the versions of the dependencies at the patch level. Therefore, if any patch release has been done for a dependency, 
the compiler will intelligently pick the latest patch version when the package is built.

>**Note:** Automatic updates for minor and major versions are not supported by the compiler yet but you can achieve it by deleting the `Dependencies.toml` file if it is absolutely necessary.

The `Dependencies.toml` file is auto-generated and managed by the Ballerina CLI and does not need user intervention. 
Updating the versions of the existing dependencies, adding dependency entries related to a newly-added import statement, and deleting entries 
of a removed import statement are handled by the CLI itself. 

## Using Dependencies from the Local Repository

The local repository is useful to test a package that is in the development phase or else for fixing bugs. To specify a dependency from the local repository, first, you need to publish it to the local repository by following the steps below.

1. Create the Ballerina archive.

```bash
bal pack
```

2. Publish to the local repository.
```bash
bal push -–repository local
```

If you already have the Ballerina Archive, then you can simply execute the following command:

```bash
bal push –-repository local <path-to-bala-archive>
```

3. Specify the dependency in the `Ballerina.toml` file.

```toml
[[dependency]]
org = "ballerinax"
name = "googleapis.gmail"
version = "2.1.1"
repository = "local"
```

Once the above steps are completed, the dependency will be picked from the local repository when the package is built. 
During the compilation, the version specified in the `Ballerina.toml` is considered as the minimum required version for that particular dependency 
and the dependency will be resolved from the local repository. Nonetheless, if the compiler finds a newer patch version in distribution or Ballerina central repositories, 
then, the latest version is always given priority. At this point, the compiler resolves the latest version and ignores the dependency version in the local repository. 

## Achieving Reproducible Builds

By default, the compiler always looks up the latest compatible versions of the dependencies in the repositories when building a package. 
This minimizes the hassle of managing dependency versions to the package developer since the compiler is smart enough to 
keep the package updated with latest compatible dependencies all the time. However, if you want to repeat a constant behavior to make the build more predictable, 
then, Ballerina facilitates this using offline and sticky modes.

### Sticky mode

Using the `--sticky` flag with `bal build` will force the compiler to stick to the exact versions locked in the `Dependencies.toml`. 
In other words, the automatic-update feature is disabled when the `--sticky` flag is provided.
This can also be set in the `Ballerina.toml` file under the `[build-options]` table as follows:

```toml
[build-options]
sticky = true
```
### Offline mode

Using the` –-offline` flag with `bal build` will run the build offline without connecting to Ballerina Central. 
This will save time of the build since the packages are resolved using the distribution repository and the filesystem cache of the Ballerina Central repository. 

Using the `--offline` flag along with the `--sticky` flag will ensure a predictable build with optimal time for compilation. 

>**Note:** To optimize the time between frequent builds, the automatic update is restricted to run once a day. The `target/build` file is used for this purpose.

## Version Compatibility

Abiding by the specifications of [Semantic Versioning](https://semver.org/), Ballerina considers two versions to be **compatible if the major versions are equal and not zero**.

A few examples would be as follows:

* `0.2.3` and `0.2.4` are considered incompatible since the major version is zero. The major version zero is considered as unstable.
* `1.2.3`, `1.2.4`, and `1.4.5` are compatible. `1.4.5` will be considered as the latest.
* `1.2.3-alpha`, `1.2.3-alpha.2`, and `1.2.3-beta` are compatible and `1.2.3-beta` is considered as the latest.
* `1.2.3-alpha`, `1.2.3-beta`, `1.2.4-alpha` are compatible and `1.2.4-alpha` is considered as the latest.
* `1.0.0` and `2.0.0` are considered incompatible since the major versions are different.

When building the dependency graph, if there are more than one version for a specific dependency, the versions are chosen as follows:
* if the versions are compatible, the latest version is picked
* if the versions are incompatible, an error will be thrown with a build failure.

For example, if one dependency in your package depends on the `1.0.0` version of the `ballerina/observe` package and another dependency depends on `0.9.0` of the same, the build will fail with the following error message.

```bash
error: compilation failed: Two incompatible versions exist in the dependency graph: ballerina/observe versions: 0.9.0, 1.0.0
```

