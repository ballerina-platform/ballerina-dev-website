---
layout: ballerina-left-nav-pages-swanlake
title: Working With Ballerina Modules
description: Ballerina modules allow you to organize the code further in a package namespace.
keywords: ballerina, programming language, ballerina modules, structure code
permalink: /swan-lake/learn/structuring-ballerina-code/working-with-ballerina-modules/
active: working-with-ballerina-modules
intro: Ballerina modules allow you to organize the code further in a package namespace. 
redirect_from:
  - /swan-lake/learn/how-to-structure-ballerina-code
  - /swan-lake/learn/how-to-structure-ballerina-code/
  - /swan-lake/learn/structuring-ballerina-code
--- 

## Creating Ballerina Modules

A [package](/swan-lake/learn/structuring-ballerina-code/#working-with-ballerina-packages/) is a collection of related modules that are versioned and distributed as a single unit.

A module name can contain one or more Ballerina identifiers separated by dots (.):

`identifier[.identifer]* `

The value of the first identifier of the modules belonging to the same package will always be the package name.

For example, let’s create a package called `winery` to demonstrate Ballerina modules. This package exposes an API to list the available wine types and to get details about a particular wine. You can organize the source code with three modules named `winery`, `winery.model`, and `winery.storage`.

>**Tip:** If you are still inside the previous `helloword` directory, use the `cd ..` command to go to the parent directory. Then, execute the `ballerina new winery` command to create the `winery` package. 

The generated `winery` package will have the directory structure below. 

```bash
winery
├── Ballerina.toml
└── main.bal

0 directories, 2 files
```

### The Default Module

The `main.bal` file is at the root of the package directory. Similarly, you can have more source files at the root. Symbols such as functions, variables in one file are visible to other files because they are in the same namespace. 

This namespace is called the default module of the package. The name of the default module is the same as the package name. Therefore in this example, the name of the default module is `winery`. 

### Other Modules

The other modules of a package should be placed inside the `modules` directory of the package. Each top-level directory inside the `modules` directory will become a Ballerina module. 

The module names are derived by combining the package name and the directory name. E.g., If the directory name is `storage`, then the module name will be `winery.storage`. 

Navigate to the `winery` directory and execute the `ballerina add model` command to add the `winery.model` module. 

>**Tip:** You need to provide the module name without the package name to the `add` command. 

```bash
$ ballerina add model
Added new ballerina module at ‘modules/model’
$ tree
.
├── Ballerina.toml
├── main.bal
└── modules
    └── model
        └── model.bal

2 directories, 3 files
```

This creates the `modules` directory and places the `model` directory in it. This `modules/model` directory contains the `winery.model` module. 

Open the `modules/model/model.bal` file and add the content below to define the `Wine` record type. 

```ballerina
public type Wine record {
   string id;
   string name;
   string color;
   string country;
};
```

Execute the `ballerina add storage` command to create another `winery.storage` module to retrieve a list of wines from a storage. 

```bash
$ ballerina add storage
Added new ballerina module at ‘modules/storage’
$ tree
.
├── Ballerina.toml
├── main.bal
└── modules
    ├── model
    │   └── model.bal
    └── storage
        └── storage.bal

3 directories, 4 files	
```

Replace the content of the `storage.bal` file with the content below.

```ballerina
import winery.model;

public function getWineList() returns model:Wine[] {
    return [{
        id: "W125678",
        name: "Corton-Charlemagne Grand Cru, Coche-Dury",
        color: "White",
        country: "France"
    }, {
        id: "W425478",
        name: "Échezeaux, Dom. de la Romanée-Conti",
        color: "Red",
        country: "France"
    }];
}
```

Now, there are three modules in the `winery` package as follows.

- `winery` (the default module)
- `winery.model`
- `winery.storage`

## Importing Modules

### Importing Modules in the Current Package

In Ballerina, before you refer to any public symbol from another module, you need to import the particular module using an `import` declaration. The below is the import declaration syntax.

```ballerina
import [org-name /] module-name [as import-prefix];
```

- The `org-name` is optional if you are importing a module from the current package.
- The `import-prefix` has to be a valid Ballerina identifier and the `import-prefix` is used to refer to public symbols in the declared module. 
- The `import-prefix` is also optional. If it is not available, you can use the last part of the `module-name`. 

The below is a sample import declaration.

```ballerina
import examples/winery.model
```

Since the `import-prefix` is not given here, you can use `model` to refer to the symbols in the `winery.model` module. Here, `model:Wine` is called a qualified identifier.

```ballerina
model:Wine[] wines = [];
```

Replace the content in the `main.bal` file at the root of the package with the function below to use it in the default module’s main function. 

```ballerina
import ballerina/io;
import examples/winery.storage;
import winery.model;

public function main() {
    model:Wine[] wines = storage:getWineList();
    foreach var wine in wines {
        io:println(wine);
    }
}
```

>**Note:** Notice the usage of the `examples` organization name in the second import declaration. The organization name is optional if the module is in the current package.

### Importing Modules in Other Packages

You would have noticed the following import in the `main.bal` file in the previous example.

```ballerina
import ballerina/io
```

It is possible to figure out the package name from an import declaration because the first part of the module name is always the package name. Therefore, here, the default module `io` is being imported from the `io` package in the `ballerina` organization. The organization name is required when you are importing modules in other packages. 

## Declaring Dependencies in a Package

When you add import declarations for required modules in your code and perform a build, the compiler automatically figures out the latest compatible versions of the required packages. Also, the compiler updates the `Ballerina.toml` file with those resolved dependencies. 

Build and run this example as follows.

```bash

$ ballerina build

Compiling source
	examples/winery:0.1.0

Running Tests

	winery.model
	No tests found

winery.storage
	No tests found

winery
	No tests found

Generating executable
	target/bin/winery.jar

$ ballerina run target/bin/winery.jar
{"id":"W125678","name":"Corton-Charlemagne Grand Cru, Coche-Dury","color":"White","country":"France"}
{"id":"W425478","name":"Échezeaux, Dom. de la Romanée-Conti","color":"Red","country":"France"}
```

The `Ballerina.toml` file will now have the content below.

```toml
[package]
org = "examples"
name = "winery"
version = "0.1.0"

[build-options]
observabilityIncluded = true

[[dependency]]
org = "ballerina"
name = "io"
version = "0.5.3”
```

The compiler has added a dependency to the `ballerina/io` package in the `Ballerina.toml` file.

From the second build onwards, the compiler honors the version declared in the TOML file unless there are version conflicts. 

You can also update the dependencies in the `Ballerina.toml` file. If you found a newer version of the `ballerina/io` package and you want to use it in your code, you can either delete the corresponding dependency declaration from the TOML file or update the version. If you delete the dependency declaration, then the compiler updates the file with the latest version during the next build. 
