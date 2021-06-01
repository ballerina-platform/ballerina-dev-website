---
layout: ballerina-left-nav-pages-swanlake
title: Modules
description: The below are all you need to know about modules. It explains the layout and concept of modules.
keywords: ballerina, programming language, ballerina packages, modules, module layout
permalink: /learn/user-guide/ballerina-packages/modules/
active: modules
intro: The below are all you need to know about modules. It explains the layout and concept of modules.
redirect_from:
- /learn/user-guide/ballerina-packages/modules
---

## Modules

A package is a collection of related modules that are versioned and distributed as a single unit. It is common in small projects to have only one module (default) in a package. As a result, the default module’s content is placed directly in the root of the package directory. But as projects grow in complexity, needs arise to organize code better in terms of functionality and visibility. Therefore, Ballerina allows subdividing the code into multiple modules as well.

Module names can only contain alphanumerics, underscores, and periods and the maximum length is 256 characters. The value of the first identifier of the modules belonging to the same package will always be the package name.

```bash
<package-name>[.<module-directory-name>]
```

### Module Layout

```bash
.
├── app.bal
├── utils.bal
├── tests/
│  ├── main_tests.bal
│  ├── utils_tests.bal
│  └── resources/
│      └── test_res.json
└── resources/
    └── app.png
```

**`.bal` source files**

The source files of a module are placed at the root of the module directory.

The .bal files in directories except for the root directory of the module and tests directory are not considered as the sources of the package. These can be treated as Standalone ballerina files.

**Module.md**

The Module.md file provides a human-readable description of a module. When you visit a package in Ballerina central, you should see all the exported modules of that package. This is the first page you will see when you navigate an exported module of a package.

**resources/ directory**

The resources directory can be used to store all module resources such as images, default configs, etc

**tests/ directory**

The tests directory contains unit tests of the module, and they test the module in isolation. The module-level test cases have access to the symbols with module-level visibility.

#### The default module

When we created a package with `bal new` command, the **_main.bal_** that got created at the root of the package directory belongs to the default module. Similarly, we can add more source files at the root.

Symbols such as functions, variables in one file are visible to other files because they are in the same namespace. This namespace is called the default module of the package. The package name which is specified in the Ballerina.toml file is also the name of the default module.


#### Other modules

The top-level modules directory contains all the other modules. Each immediate subdirectory of the modules directory becomes a Ballerina module and the subdirectory name becomes the module name. Therefore the subdirectory name should be a valid Ballerina identifier.

The module names are derived by combining the package name and the directory name. E.g., If the package name given in Ballerina.toml is “winery” and the module directory name is model, then the module name will be winery.model.

We can add other modules using the `bal add` command:
```bash
$ bal add util
```

Added new Ballerina module at the `modules/util` directory.

This creates the `modules` directory in our package root with a source file. This `modules/util` directory contains the hello_world.util module. Now, our package will have the directory structure below.

```bash
.
├── Ballerina.toml
├── main.bal
└── modules
     └── util
         └── util.bal

2 directories, 3 files
```

#### Exporting modules

Ballerina provides a mechanism to control the visibility of modules outside of the package.

By default, only the default module of a package is exported. Other modules of the package are visible only to the modules in the same package.

If any module should be visible to other packages, the module must be marked as exported in the Ballerina.toml file using 
the key `exported` under the[`[package]` table](/learn/user-guide/ballerina-packages/package-layout#ballerinatoml).