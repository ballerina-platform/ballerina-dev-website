---
layout: ballerina-workspaces-left-nav-pages-swanlake
title: Workspaces
description: The sections below explain how to organize multiple Ballerina packages within a single workspace.
keywords: ballerina, programming language, ballerina packages, workspace, multi-package, monorepo
permalink: /learn/workspaces/
active: workspaces
intro: The sections below explain how to organize multiple Ballerina packages within a single workspace.
---

## Workspace Structure

A workspace is a collection of related Ballerina packages that can be organized and managed together in a single directory structure. This feature enables you to develop interdependent packages in a monorepo-style structure, where packages can depend on each other without needing to publish to a repository during development. Workspaces allow packages to reference each other directly, build and test all related packages together, and keep related packages organized in a single project structure.

### Workspace directory structure

A workspace can organize packages in different directory layouts. You can place packages at the root level or in subdirectories:

```
my-workspace/
├── Ballerina.toml          # Workspace configuration
├── order-service/
│   ├── Ballerina.toml      # Package configuration
│   └── service.bal
├── menu-service/
│   ├── Ballerina.toml
│   └── service.bal
└── utils/
    ├── common/
    │   ├── Ballerina.toml
    │   └── common.bal
    └── types/
        ├── Ballerina.toml
        └── types.bal
```

## Create a workspace

Use the `bal new` command with the `--workspace` flag to create a new workspace:

```
$ bal new --workspace my-workspace
```

This creates a new workspace directory with the following structure:

```
my-workspace/
├── Ballerina.toml          # Workspace configuration
└── hello-app/
    ├── Ballerina.toml      # Package configuration  
    └── main.bal
```

The workspace-level `Ballerina.toml` file defines the workspace configuration:

```toml
[workspace]
packages = ["hello-app"]
```

## Add packages to the workspace

You can add additional packages to your workspace using the `bal new` command from within the workspace directory:

```
$ cd my-workspace
$ bal new -t lib utils
```

This creates an additional package in your workspace:

```
my-workspace/
├── Ballerina.toml
├── hello-app/
│   ├── Ballerina.toml
│   └── main.bal
└── utils/
    ├── Ballerina.toml
    └── utils.bal
```

The workspace configuration is automatically updated to include the new package:

```toml
[workspace]
packages = ["hello-app", "utils"]
```

## Import packages from the same workspace

You can import and use modules from other packages in the workspace using standard import statements. The packages are resolved automatically from the workspace without needing to publish them to a repository.

**Example:**

```ballerina

import myorg/utils;        // Import the utils package in workspace

public function main() {
    string result = utils:sanitize("sample data !");
}
```

## Dependency resolution in workspaces

When working with workspaces, the dependency resolution algorithm prioritizes workspace packages over the distribution and Ballerina Central repositories. By default, package imports are searched within the workspace first. If a matching package is found in the workspace, the resolution request is not sent to other repositories. Only if the package is not available in the workspace will the resolver search in the distribution and Ballerina Central repositories.

For more information on dependency management, see [Manage dependencies](/learn/manage-dependencies/).

### Build the workspace

Run `bal build` in the workspace root to build all workspace packages. Executables are produced only for packages that are not dependencies of other workspace packages.

Build all packages:

```
$ bal build
```

Build a specific package:

```
$ bal build hello-app
```

### Test the workspace

Run tests for all packages in the workspace:

```
$ bal test
```

### Run a specific package

To run a specific package in the workspace:

```
$ bal run hello-app
```
