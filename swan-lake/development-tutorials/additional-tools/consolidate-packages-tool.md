---
layout: ballerina-consolidate-packages-support-left-nav-pages-swanlake
title: Consolidate-packages tool
description: The consolidate-packages tool provides CLI commands and a build tool to consolidate services into a single executable.
keywords: ballerina, programming language, consolidate packages, consolidate-packages, monolith
permalink: /learn/consolidate-packages-tool/
active: consolidate-packages-tool
intro: Ballerina inherently supports microservices-style deployments, which are well-suited for microservice orchestration platforms like Kubernetes. However, if you prefer a server-based deployment model, this tool allows you to consolidate multiple services into a single process, making deployments more manageable and efficient.
---
## Usage

### Create or update a consolidator package

Create a new package and add the `consolidate-packages` tool entry as shown in the below example in the `Ballerina.toml` file with the services required to consolidate. Services can be added or removed as needed by updating the values provided for the `options.services` array. The tool will be automatically pulled during the package build.

```toml
[package]
org = "myorg"
name = "myapp"
version = "0.1.0"

[[tool.consolidate-packages]]
id = "consolidateSvc"
options.services = ["myorg/svc1", "myorg/svc2"]
```

#### Using the CLI tool
Alternatively, the `consolidate-packages` CLI tool can be installed to create the package and add or remove services. This
is typically useful in CI/CD pipelines.

##### Installation

Execute the command below to pull the tool.

```
bal tool pull consolidate-packages
```

##### Creating a new consolidator package

```
$ bal consolidate-packages new --package-path <path> <comma-separated-list-of-services> 
```

For example,

```
$ bal consolidate-packages new --package-path hotel-app myorg/order_service,myorg/payment_service 
```

##### Adding new services to an existing package

Execute the following command from the package root directory.

```
$ bal consolidate-packages add <comma-separated-list-of-services>
```

For example,

```
$ cd hotel-app
$ bal consolidate-packages add myorg/customer_service,myorg/menu_service
```

##### Removing services from an existing package
Execute the following command from the package root directory.

```
$ bal consolidate-packages remove <comma-separated-list-of-services>
```

For example,

```
$ bal consolidate-packages remove myorg/payment_service
```

Run `bal consolidate-services --help` for more information about the commands. 
