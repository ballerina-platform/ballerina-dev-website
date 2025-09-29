---
layout: ballerina-consolidate-packages-support-left-nav-pages-swanlake
title: Consolidate-packages tool
description: The consolidate-packages tool provides CLI commands and a build tool to consolidate services into a single executable.
keywords: ballerina, programming language, consolidate packages, consolidate-packages, monolith
permalink: /learn/consolidate-packages-tool/
active: consolidate-packages-tool
intro: The consolidate-packages tool allows you to create a single executable by consolidating multiple Ballerina services. These services can either be pulled from Ballerina Central or used directly from your local environment without needing to publish them to a remote repository.
---

## Consolidate packages from the Ballerina Central

### Define the consolidator package
Create a new package and add the `consolidate-packages` tool entry, along with the required services for consolidation, in the `Ballerina.toml` file, as shown in the example below. Services can be added or removed as needed by updating the values provided for the `options.services` array.

```toml
[package]
org = "myorg"
name = "myapp"
version = "0.1.0"

[[tool.consolidate-packages]]
id = "consolidateSvc"
options.services = ["myorg/order", "myorg/checkout"]
```

## Consolidate locally published packages

In some projects, services are developed together but do not require publishing to a remote repository, as they are consumed within the same project. For these cases, the tool enables the consolidation of multiple packages into a single executable without requiring publication to any remote repository. The packages can be published to the local repository and consolidated using the steps below:

1. Publish packages required to consolidate to the local repository using the `bal push` command.

   ```
   $ bal push --repository local
   ```

2. Include the packages as local dependencies in the `Ballerina.toml` of the consolidator package.

   ```toml
   [[dependency]]
   org = "myorg"
   name = "menu"
   version = "1.1.0"
   repository = "local"
   ```

## Using the CLI tool

The CLI tool helps automate the consolidation process, which is typically useful in CI/CD workflows.

### Installation

Execute the command below to pull the tool.

```
$ bal tool pull consolidate-packages
```

### Creating a new consolidator package

```
$ bal consolidate-packages new --package-path <path> <comma-separated-list-of-services> 
```

For example,

```
$ bal consolidate-packages new --package-path hotel-app myorg/order,myorg/checkout
```

#### Create a consolidated package using locally published packages

```
$ bal consolidate-packages new --package-path hotel-app myorg/menu:0.1.0,myorg/ad:0.1.0 --repository=local
```
>**Note:** The version is mandatory when specifying a package from the local repository

### Adding new services to an existing package

Execute the following command from the package root directory.

```
$ bal consolidate-packages add <comma-separated-list-of-services>
```

For example,

```
$ cd hotel-app
$ bal consolidate-packages add myorg/customer,myorg/inventory
```

#### Add locally published packages

```
$ cd hotel-app
$ bal consolidate-packages add myorg/customer:0.1.0,myorg/inventory:0.1.0 --repository=local
```

### Removing services from an existing package
Execute the following command from the package root directory.

```
$ bal consolidate-packages remove <comma-separated-list-of-services>
```

For example,

```
$ bal consolidate-packages remove myorg/menu,myorg/ad
```

Run `bal consolidate-packages --help` for more information about the commands. 
