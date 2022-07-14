---
layout: ballerina-managing-dependencies-left-nav-pages-swanlake
title: Manage dependencies
description: The sections below include information about dependencies, imports, and how they can be used in your package.
keywords: ballerina, programming language, ballerina packages, dependencies, importing modules
permalink: /learn/manage-dependencies/
active: manage-dependencies
intro: The sections below include information about dependencies, imports, and how they can be used in your package.
redirect_from:
- /learn/user-guide/ballerina-packages/dependencies
- /learn/user-guide/ballerina-packages/dependencies/
- /learn/managing-dependencies
- /learn/managing-dependencies/
- /learn/manage-dependencies
- /learn/guides/managing-dependencies/
- /learn/guides/managing-dependencies
---

## Specify dependencies

A package can depend on other packages that are available in Ballerina repositories. By default, Ballerina searches for the dependencies in the repositories below.
* The distribution repository
* The Ballerina Central repository

It also supports a third repository named the `local repository`. It temporarily overrides dependencies, which is useful for the package development and bug fixing phases.

**Distribution repository**

The distribution repository is a file system repository added with the local Ballerina installation. The repository is located at `<BALLERINA_HOME>/repo/bala`.

**Ballerina Central repository**

The Ballerina Central is a remote repository and creates a local file system cache at `<USER_HOME>/.ballerina/repositories/central.ballerina.io/bala`. Ballerina queries the remote repository only if the specified dependency version is not present in its local cache.

**Local repository**

The local repository is also a file system repository, which will be created in the `<USER_HOME>` location. The repository location is `<USER_HOME>/.ballerina/repositories/local/bala`. 
For more information, see [Use dependencies from the local repository](/learn/manage-dependencies/#use-dependencies-from-the-local-repository).

### Import a module

To use exported modules of any package, add an import statement in the Ballerina code. It enables access to all public symbols in the imported module.

The import declaration syntax is as follows.

```bash
import [org-name/] module-name [as import-prefix];
```

* The `import-prefix` has to be a valid Ballerina identifier, and it is used to refer to public symbols in the declared module.
* The `import-prefix` is optional. You can use the last part of the module name if an `import-prefix` is unavailable.

You can import a module by providing the organization name, and the module name. The module name consists of the package name, and the name of the module root directory.
The module name of the default module is always the package name. 

The following example shows how to import modules from the `ballerina/io` package.

```ballerina
import ballerina/io; // Imports the default module of io package

public function main() {
	io:println("Hello world!");
}
```

The following is another example that shows the usage of multiple modules from different libraries.

```ballerina
// Imports the default module from the `ballerina/log` package.
import ballerina/log;
// Imports the default module from the `googleapis.gmail` package
// with an import prefix.
import ballerinax/googleapis.gmail as gmail;
// Imports the only non-default module from the `googleapis.gmail` package
// with an import prefix.
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

listener gmailListener:Listener gmailEventListener =
                            new (port, gmailConfig, project, pushEndpoint);

service / on gmailEventListener {
    remote function onNewEmail(gmail:Message message) returns error? {
        log:printInfo("New Email : ", message = message);
    }
}
```

## Specify dependency versions

When building a package, the compiler figures out the dependency versions automatically. Ballerina searches the latest compatible versions of the package dependencies in the distribution repository, Ballerina Central repository, and the local repository(if specified).

When you execute `bal build` for the first time on the package, the CLI operation will auto-generate the `Dependencies.toml` in the package root. 
This will contain the resolved dependency versions. From thereon, the versions locked in the `Dependencies.toml` are considered as the minimum required versions for the subsequent builds.

In the subsequent builds, the compiler will automatically update the versions of the dependencies at the patch level. Therefore, if any patch release is available for a dependency, the compiler will intelligently pick the latest patch version during package build.

>**Note:** Automatic updates for minor and major versions are not supported by the compiler yet, but you can achieve it by deleting the `Dependencies.toml` file if it is absolutely necessary.

The `Dependencies.toml` file is auto-generated and managed by the Ballerina CLI and does not need user intervention. 
Updating the versions of the existing dependencies, adding dependency entries related to a newly-added import statement, and deleting entries 
of a removed import statement are handled by the CLI itself. 

## Use dependencies from the local repository

The local repository is useful to test a package in the development phase or to fix bugs. To specify a dependency from the local repository, first, you need to publish it to the local repository by following the steps below.

1. Generate the Ballerina archive after editing the package source files as required.

   ```bash
   bal pack
   ```

2. Publish to the local repository.
   ```bash
   bal push --repository local
   ```

   If you already have the path of Ballerina archive, then you can simply execute the following command.

    ```bash
    bal push --repository local <path-to-bala-archive>
    ```

3. Specify the dependency in the `Ballerina.toml` file.

    ```toml
    [[dependency]]
    org = "ballerinax"
    name = "googleapis.gmail"
    version = "2.1.1"
    repository = "local"
    ```

Once you complete the above steps, the dependency will be picked from the local repository when building the package.
Ballerina considers the version specified in the Ballerina.toml as the minimum required version and uses the local repository to resolve the dependency.
However, the compiler gives priority to the latest version if a new patch version is found in distribution or Ballerina Central repositories.
At this point, the compiler resolves the latest version and ignores the dependency version in the local repository.

## Achieve reproducible builds

By default, the compiler always looks up the latest compatible versions of the dependencies in the repositories when building a package.
 It minimizes the hassle of managing dependency versions to the package developer since the compiler is smart enough to keep the package updated with the latest compatible dependencies all the time.
 However, if you need to repeat a constant behavior to make the build more predictable, Ballerina facilitates this using offline and sticky modes.

### The sticky mode

Using the `--sticky` flag with `bal build` will force the compiler to stick to the exact versions locked in the `Dependencies.toml`. 
In other words, the CLI disables the automatic-update feature when you provide the `--sticky` flag.
   
```bash
bal build --sticky
```

### The offline mode

Using the` –-offline` flag with `bal build` will run the build offline without connecting to Ballerina Central. 
This will save build time since the packages are resolved using the distribution repository, and the file system cache of the Ballerina Central repository.

Using the `--offline` flag along with the `--sticky` flag will ensure a predictable build with optimal time for compilation. 

>**Note:** The automatic update runs only once a day to optimize the time taken during frequent builds. The `target/build` file is used for this purpose.

## Version compatibility

Abiding by the specifications of [Semantic Versioning](https://semver.org/), Ballerina considers two versions to be **compatible if the major versions are equal and not zero**.

A few examples would be as follows:

* `0.2.3` and `0.2.4` are considered incompatible since the major version is `0`. The major version `0` is unstable.
* `1.2.3`, `1.2.4`, and `1.4.5` are compatible. `1.4.5` will be considered as the latest.
* `1.2.3-alpha`, `1.2.3-alpha.2`, and `1.2.3-beta` are compatible and `1.2.3-beta` is considered the latest.
* `1.2.3-alpha`, `1.2.3-beta`, `1.2.4-alpha` are compatible and `1.2.4-alpha` is considered the latest.
* `1.0.0` and `2.0.0` are considered incompatible since the major versions are different.

When building the dependency graph, if there is more than one version for a specific dependency, the versions are chosen according to the following.
* If the versions are compatible, pick the latest version.
* If the versions are incompatible, throw an error with a build failure.

For example, assume one dependency in your package depends on the `1.0.0` version of the `ballerina/observe` package, and another dependency depends on `0.9.0` of the same. The build fails with the following error message.

```bash
error: compilation failed: Two incompatible versions exist in the dependency graph:
ballerina/observe versions: 0.9.0, 1.0.0
```

