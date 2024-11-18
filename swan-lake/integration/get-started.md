---
layout: ballerina-getting-started-left-nav-pages-swanlake
title: Get started 
description: Let’s set up a Ballerina development environment and write a simple Ballerina program.
keywords: ballerina, programming language, ballerina packages, getting started
permalink: /learn/get-started/
active: get-started
intro: Let’s set up a Ballerina development environment and write a simple Ballerina program.
---

## Install Ballerina

[Download](/downloads/) and install Ballerina based on your operating system.

>**Tip:** For more information, see [Installation options](/downloads/installation-options/).

## Set up the editor

Set up a text editor to write Ballerina code.

>**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the Ballerina VS Code extension installed. For more information about the features of this extension, check <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina VS Code extension documentation</a>.

## Meet `bal`

`bal` is the Ballerina build tool and package manager. Among other things, it helps you create, build, test, and run your package. The latest version of the `bal` tool is included with the latest Ballerina installation. 

Open your terminal, and run the following commands to verify that everything is ready.

```
$ bal
```

```
$ bal version
```

Let's create a Ballerina program that prints `Hello, World!`.

## Create a new package

Use the `bal new` command to create a new Ballerina package, which is the primary unit for organizing and managing Ballerina code. 

>**Info:** For more information about packages, see [Organize Ballerina code](/learn/organize-ballerina-code/).

```
$ bal new greeter
```

This command creates a new directory named `greeter` with the following content:

```
greeter/
├── Ballerina.toml
└── main.bal
```

- The `Ballerina.toml` file contains metadata that describes your package. The `bal` tool also uses the `Ballerina.toml` file to identify the root of a package.
- The `main.bal` file is a source file and it contains the Ballerina code that prints `Hello, World!` to the console. You can add any number of source files in the `greeter` directory.

## Say `Hello, World!`

Open the package directory in your text editor. If you are using VS Code, you could navigate to the `greeter` directory and run `code .` to open the directory in VS Code. 

Then, open the `main.bal` file to see the generated source.

```ballerina
import ballerina/io;

public function main() {
    io:println("Hello, World!");
}
```

In this code:

- The first line is an import statement, which makes the functionality in the <a href="https://lib.ballerina.io/ballerina/io/latest" target="_blank">`ballerina/io`</a> module available to your program. This module contains functions to write to the console, read from the console, and perform read/write operations on files.
- The `main` function is your program's entry point, and you can execute it by running the program. 
- The `main` function contains a statement that prints `Hello, World!` to the console. This statement calls the `println` function in the `io` module with `"Hello, World!"` as an argument.

>**Info:** To learn more about the basics of the language, see [Language basics](/learn/language-basics/). 

## Run the package

Run `bal run` in your terminal to run this package.

```
$ bal run
Compiling source
	example/greeter:0.1.0

Running executable

Hello, World!
```

Alternatively, you can generate an executable file with `bal build`,

```
$ bal build
Compiling source
	example/greeter:0.1.0

Generating executable
	target/bin/greeter.jar
```

and run it using `bal run`.

```
$ bal run target/bin/greeter.jar
Hello, World!
```

## Write a simple REST API

Now, let's change the `greeter` application into a REST API. Ballerina has first-class abstractions for services, resources, etc., and they make network service development easier and more fun. 

Replace the contents of the `main.bal` file with the following code:

```ballerina
import ballerina/http;

listener http:Listener httpListener = new (8080);

service / on httpListener {
    resource function get greeting() returns string { 
        return "Hello, World!"; 
    }

    resource function get greeting/[string name]() returns string { 
        return "Hello " + name; 
    }
}
```

Let's take a moment to understand the new constructs in this code:

- The <a href="https://lib.ballerina.io/ballerina/http/latest" target="_blank">`http`</a> module provides high-level abstractions to work with the HTTP protocol. 
- The listener declaration creates a new HTTP listener that will listen on port `8080`. The `listener` is the entity that receives network input and routes it to the attached service(s).
- The service declaration specifies the listener to which the service gets attached and a collection of remotely accessible methods. There are two kinds of methods: `resource` methods and `remote` methods. Services use `remote` methods to expose services in a procedural style and are named using verbs, whereas `resource` methods are used for data-oriented protocols and are named using nouns.
- In this example, there are two `resource` methods: the first one responds to HTTP GET requests with the `/greeting` path, and the other one responds to `GET` requests with the `/greeting/{name}` path.
- These `resource` methods return a `string` value, which maps to the `text/plain` content-type in the HTTP response.

>**Info:** To learn more about services, see [Network interaction](/learn/network-interaction/). 

## Run the simple REST API

Let's run this package in your terminal:

```
$ bal run
Compiling source
	example/greeter:0.1.0

Running executable
```

Now, open another terminal window and run the following commands to invoke the REST API.

```
$ curl localhost:8080/greeting
Hello, World!

$ curl localhost:8080/greeting/Ballerina
Hello Ballerina
```

Alternatively, you can use the built-in `Try it` feature by clicking on the `Try it` CodeLens above the service declaration on VS Code.

## Learn more

In this guide, you set up your development environment and wrote two Ballerina programs. For more learning resources, see [Learn](/learn/).
