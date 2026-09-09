---
layout: ballerina-local-repository-left-nav-pages-swanlake
title: Local repository
description: Use the local repository to temporarily override package dependencies during package development and bug-fixing.
keywords: ballerina, programming language, ballerina packages, local repository, dependencies
permalink: /learn/custom-repositories/local-repository/
active: local-repository
intro: Use the local repository to temporarily override package dependencies during package development and bug-fixing.
---

The local repository is also a file system repository, which will be created in the `<USER_HOME>` location. The repository location is `<USER_HOME>/.ballerina/repositories/local/bala`.

## Use dependencies from the local repository

The local repository is useful to test a package in the development phase or to fix bugs. To specify a dependency from the local repository, first, you need to publish it to the local repository by following the steps below.

1. Generate the Ballerina archive after editing the package source files as required.

   ```
   $ bal pack
   ```

2. Publish to the local repository.
   ```
   $ bal push --repository local
   ```

   If you already have the path of Ballerina archive, then you can simply execute the following command.

    ```
    $ bal push --repository local <path-to-bala-archive>
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
Ballerina considers the version specified in the `Ballerina.toml` file as the minimum required version and uses the local repository to resolve the dependency.
However, the compiler gives priority to the latest version if a new patch version is found in the distribution or Ballerina Central repositories.
At this point, the compiler resolves the latest version and ignores the dependency version in the local repository.
