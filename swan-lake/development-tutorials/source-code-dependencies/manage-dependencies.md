---
layout: ballerina-managing-dependencies-left-nav-pages-swanlake
title: Manage dependencies
description: The sections below include information about dependencies, imports, and how they can be used in your package.
keywords: ballerina, programming language, ballerina packages, dependencies, importing modules
permalink: /learn/manage-dependencies/
active: manage-dependencies
intro: The sections below include information about dependencies, imports, and how they can be used in your package.
---

## Specify dependencies

A package can depend on other packages that are available in Ballerina repositories. By default, Ballerina searches for the dependencies in the repositories below.
* The distribution repository
* The Ballerina Central repository

It also supports a third repository named the `local repository`, and temporarily overrides dependencies, which is useful for the package-development and bug-fixing phases. Additionally, a predefined set of custom package repositories are also supported, which are useful to bring third-party repositories into dependency management.

**Distribution repository**

The distribution repository is a file system repository added with the local Ballerina installation. The repository is located at `<BALLERINA_HOME>/repo/bala`.

**Ballerina Central repository**

The Ballerina Central is a remote repository and creates a local file system cache at `<USER_HOME>/.ballerina/repositories/central.ballerina.io/bala`. Ballerina queries the remote repository only if the specified dependency version is not present in its local cache.

> **Note:** If you are connected to the internet via an HTTP proxy, you need to configure the proxy settings to perform operations with the Ballerina Central. For more information on proxy settings, see [Configure a network proxy](/learn/configure-a-network-proxy).

**Local repository**

The local repository is also a file system repository, which will be created in the `<USER_HOME>` location. The repository location is `<USER_HOME>/.ballerina/repositories/local/bala`. 
For more information, see [Local repository](/learn/custom-repositories/local-repository/).

**Custom repositories**

Ballerina supports one or more custom remote repositories, which can be configured in the `<USER_HOME>/.ballerina/Settings.toml` file. A local filesystem cache is maintained per repository at `<USER_HOME>/.ballerina/repositories/<REPOSITORY_ID>/bala`. Ballerina queries the remote repository only if the specified dependency version is not present in its local cache. For more information, see [Use custom repositories for package management](#use-custom-repositories-for-package-management).

### Import a module

To use exported modules of any package, add an import statement in the Ballerina code. It enables access to all public symbols in the imported module.

The import declaration syntax is as follows.

```ballerina
import [org_name/] module_name [as import_prefix];
```

* The `import_prefix` has to be a valid Ballerina identifier, and it is used to refer to public symbols in the declared module.
* The `import_prefix` is optional. You can use the last part of the module name if an `import_prefix` is unavailable.

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
// Imports the default module from the `salesforce` package
// with an import prefix.
import ballerinax/salesforce as sf;
// Imports a non-default module from the `salesforce` package
// with an import prefix.
import ballerinax/salesforce.bulk as sfBulk;

configurable string baseUrl = ?;
configurable string token = ?;

sf:ConnectionConfig sfConfig = {baseUrl, auth: {token}};

public function main() returns error? {
    string contacts = "Name,Email\n"
        + "John,john434@gmail.com\n"
        + "Peter,peter77@gmail.com";

    sfBulk:Client bulkClient = check new (sfConfig);
    sfBulk:BulkJob insertJob = check bulkClient->createJob("insert", "Contact", "CSV");
    sfBulk:BatchInfo batch = check bulkClient->addBatch(insertJob, contacts);

    log:printInfo(batch.id.length() > 0 ? "Batch Added Successfully" : "Failed to add the Batch");
}
```

## Specify dependency versions

When building a package, the compiler figures out the dependency versions automatically. Ballerina searches the latest compatible versions of the package dependencies in the distribution repository, Ballerina Central repository, custom repositories, and the local repository (if specified).

When you execute `bal build` for the first time on the package, the CLI operation will generate the `Dependencies.toml` in the package root. 
This will contain the latest compatible dependency versions. From thereon, the versions locked in the `Dependencies.toml` are considered as the minimum required versions for the subsequent builds. The `Dependencies.toml` file is generated and managed by the Ballerina CLI and does not need user intervention.

### Update dependency versions

The `Dependencies.toml` file generated during the compiler will automatically update the versions of the dependencies at the patch level. Therefore, if any patch release is available for a dependency, the compiler will pick the latest patch version.

>**Note:** The automatic update runs only once a day to optimize the time taken during frequent builds. Run the `bal clean` command if you want to enable automatic updates for the next build.

To update the minor version of a dependency, specify the dependency version in the `Ballerina.toml` file. The provided version is considered as the minimum required version for compiling the package, which will update the dependency to the latest version that is compatible with the version provided in the `Ballerina.toml` as well as the version locked in the `Dependencies.toml`.

For example, the minimum version of the `ballerinax/mysql` dependency can be specified in the following way.

```toml
[[dependency]]
org = "ballerinax"
name = "mysql"
version = "1.5.0"
```

### Upgrading packages to use new Swan Lake update distributions

When a new Swan Lake update distribution is released, it may include incompatible language improvements. When upgrading an existing package to use new Swan Lake update distributions, the Ballerina compiler automatically updates the `Dependencies.toml` file with the latest compatible minor versions of the dependencies of the new distribution. This enables the existing projects to benefit from improvements in the new update releases without requiring significant modifications.

## Use dependencies from the local repository

The local repository is useful to test a package in the development phase or to fix bugs. To use a dependency from the local repository, publish it there with `bal push --repository local`, then reference it in the `Ballerina.toml` file with `repository = "local"`. For more information on this, see [Local repository](/learn/custom-repositories/local-repository/).

## Use custom repositories for package management

Ballerina supports Maven repositories such as [Nexus](https://www.sonatype.com/products/sonatype-nexus-repository), [Artifactory](https://jfrog.com/artifactory/), [GitHub Packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-maven-registry), and [GitLab packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/) to be set up as custom repositories — either to host your organization's own private Ballerina packages, or as a caching proxy for Ballerina Central.

### Create the repository

Before configuring Ballerina, create the repository in your chosen repository manager.

* For **Artifactory**, see [JFrog Artifactory](/learn/custom-repositories/set-up-artifactory).
* For **Nexus**, see [Sonatype Nexus](/learn/custom-repositories/set-up-nexus).
* In **GitLab packages** and **GitHub Packages**, each publishes to an existing project or repository. See the official [GitLab](https://docs.gitlab.com/user/packages/package_registry/) or [GitHub](https://docs.github.com/en/packages/working-with-a-github-packages-registry) documentation to find the Maven registry endpoint for your project or repository.

### Define the custom repository

You can configure one or multiple custom repositories in the `<USER_HOME>/.ballerina/Settings.toml` file to integrate them into the package resolution. Use the base URL of the repository you created above as the `url`.

```toml
[[repository.maven]]
id = "<repository-id>" # This ID is used when pushing/ pulling packages
url = "<repository-url>"
username = "<username>/<userId>"
accesstoken = "<password>/<accesstoken>"
```

Below is a sample GitLab repository configuration.

```toml
[[repository.maven]]
id = "gitlab_1" # This ID is used when pushing/pulling balas
url = "https://gitlab.com/api/v4/projects/12345678/packages/maven"
username = "jackson12"
accesstoken = "glpat-hnMlJsjshhdtdt5367389920020hHfrdrd"
```

The sections below show how to configure the above package repository to resolve a specific dependency.

### Publish a Ballerina package to the custom repository

Follow the steps below to publish a Ballerina package to the custom repository you configured above.

1. Generate the Ballerina archive for the package.

   ```
   $ bal pack
   ```

2. Publish to the custom repository.

   ```
   $ bal push --repository <repository-id>
   ```

    If you already have the path of the Ballerina archive, execute the command below.

    ```
    $ bal push --repository <repository-id> <path-to-bala-archive>
    ```

For more information on using the published package as a dependency, see [Specify dependencies](#specify-dependencies).

## Proxy Ballerina Central with a Maven repository

Organizations use repository managers such as [JFrog Artifactory](https://jfrog.com/artifactory/) or [Sonatype Nexus](https://www.sonatype.com/products/sonatype-nexus-repository) to serve as a caching proxy for Ballerina Central.

### Set up the proxy repository

The organization should have a repository manager hosted on-premises or in the cloud with the following requirements satisfied.

- Support for Maven repository format
- Support for caching proxy repositories
- Support for flexible MIME types

Both [JFrog Artifactory](https://jfrog.com/artifactory/) and [Sonatype Nexus](https://www.sonatype.com/products/sonatype-nexus-repository) have been tested and verified against the above requirements.

* For **Artifactory**, see [JFrog Artifactory](/learn/custom-repositories/set-up-artifactory/#configure-a-proxy-repository).
* For **Nexus**, see [Sonatype Nexus](/learn/custom-repositories/set-up-nexus/#configure-a-proxy-repository).

### Configure the Ballerina client to proxy Ballerina Central

You can configure only one proxy repository in the `<USER_HOME>/.ballerina/Settings.toml` file to use in place of Ballerina Central. A typical configuration looks like the following.

```toml
[[repository.maven]]
id = "<repository-id>"        # This ID is used when pushing/pulling packages
url = "<repository-url>"
username = "<username> or <userId>"
accesstoken = "<password> or <accesstoken>"
proxyCentral = true
```

Replace the placeholders as follows.

| Placeholder | Description |
| --- | --- |
| `<repository-id>` | A unique identifier for the repository entry (e.g., `nexus-ballerina-proxy` or `artifactory-ballerina-proxy`) |
| `<repository-url>` | The full URL of the proxy repository you created in Nexus or Artifactory |
| `<username> or <userId>` | Your Nexus or Artifactory username or user ID |
| `<password> or <accesstoken>` | Your Nexus or Artifactory password or access token |

Once the configuration is done, all Ballerina Central calls will be redirected through this Maven-based proxy repository.

> **Note:** Only one `[[repository.maven]]` entry with `proxyCentral = true` is allowed at a time. If multiple entries have `proxyCentral = true`, Ballerina will return an error.

## Achieve reproducible builds

By default, the compiler always looks up the latest compatible versions of the dependencies in the repositories when building a package.

It minimizes the hassle of managing dependency versions to the package developer since the compiler is smart enough to keep the package updated with the latest compatible dependencies all the time. However, if you need to repeat a constant behavior to make the build more predictable, Ballerina facilitates this using offline and sticky modes.

### The sticky mode

Using the `--sticky` flag with `bal build` will force the compiler to stick to the exact versions locked in the `Dependencies.toml`. 
In other words, the CLI disables the automatic-update feature when you provide the `--sticky` flag.
   
```
$ bal build --sticky
```

>**Note:** The automatic update runs only once a day to optimize the time taken during frequent builds.

### The offline mode

Using the` –-offline` flag will run the compilation offline without connecting to Ballerina Central or any configured Maven repositories. This will save the compilation time since the packages are resolved using the distribution repository, and the file system cache of the Ballerina Central repository/Maven repositories.

Using the `--offline` flag along with the `--sticky` flag will ensure a predictable build with optimal time for compilation. 

## Version compatibility

Abiding by the specifications of <a href="https://semver.org/" target="_blank">Semantic Versioning</a>, Ballerina considers two versions to be **compatible if the major versions are equal and not zero**.

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

```
error: compilation failed: Two incompatible versions exist in the dependency graph:
ballerina/observe versions: 0.9.0, 1.0.0
```

## Manage platform dependencies

A Ballerina package can depend on JAVA code that is shipped with the JVM, from a remote package repository, or from a JAR file located in the user’s machine. Libraries shipped with the JVM can be used seamlessly and libraries used from other locations must be specified in the `Ballerina.toml` as shown below.

## Specify a Maven dependency

The following example shows how a dependency from a public Maven repository can be specified.

```toml
[[platform.java11.dependency]]
# Group ID of the Maven dependency.
groupId = "<group-id>"
# Artifact ID of the Maven dependency.
artifactId = "<artifact-id>"
# Version of the Maven dependency.
version = "<version>"
```

When building the package, these specified Maven dependencies will be resolved and can be found in the `target/platform-libs` directory. 

### Specify a local JAR file path

The following example uses a JAR file located in the user's machine as a platform dependency.

```toml
[[platform.java11.dependency]]
# Group ID of the dependency.
groupId = "<group-id>"
# Artifact ID of the dependency.
artifactId = "<artifact-id>"
# Version of the dependency.
version = "<version>"
# Absolute or relative path of the JAR file.
path = "<path-to-jar-file-1>"
```

The Ballerina compiler will copy the specified JAR file from the provided path when creating the archive.

>**Info:** You can also provide custom package repositories such as GitHub Packages and private Maven repositories. You can also specify different scopes to control how platform dependencies are used during program execution. For more information on this, see [Package references](/learn/package-references/).

## Manage tool dependencies

Similar to package dependencies, tools specified in `Ballerina.toml` and executed in the package build are also resolved from the distribution repository and the Ballerina Central repository. The tool dependency resolution mechanism is akin to package dependencies. Once resolved, the tool versions are automatically recorded in the `Dependencies.toml` file and used as the minimum required versions for subsequent builds.
