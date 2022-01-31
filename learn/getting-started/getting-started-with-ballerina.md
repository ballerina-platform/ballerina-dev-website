---
layout: ballerina-getting-started-left-nav-pages-swanlake
title: Getting Started with Ballerina
description: Let’s set up a Ballerina development environment and write a simple Ballerina program.
keywords: ballerina, programming language, ballerina packages, getting started
permalink: /learn/getting-started-with-ballerina/
active: getting-started-with-ballerina
intro: Let’s set up a Ballerina development environment and write a simple Ballerina program.
redirect_from:
- /learn/getting-started-with-ballerina
- /learn/getting-started/hello-world/creating-your-first-ballerina-package
- /learn/getting-started/hello-world/creating-your-first-ballerina-package/
- /learn/getting-started/hello-world/writing-your-first-ballerina-program
- /learn/getting-started/hello-world/writing-your-first-ballerina-program/
---

## Setting up the Prerequisites

To complete this tutorial, you need the below.

1. A command terminal
2. A text editor
    >**Tip:** Preferably, [Visual Studio Code](https://code.visualstudio.com/) with the [Ballerina extension](https://marketplace.visualstudio.com/items?itemName=WSO2.ballerina) installed.
3. A [Ballerina installation](https://ballerina.io/learn/installing-ballerina/setting-up-ballerina/)

## Meeting `bal`

`bal` is the Ballerina build tool and package manager. Among other things, `bal` helps you to create, build, test, and run your project. The latest `bal` tool version is available with the latest Ballerina installation. 

Open your terminal, and run the following commands to make sure everything is ready.

```bash
$ bal
$ bal version
```

## Creating a New Project

Let's write a Ballerina program, which prints `Hello, World!`. Use the `bal new` command to create a new Ballerina project. 

```bash
$ bal new greeter
```

This command creates a new directory called `greeter` with the content below.

```bash
greeter/
├── Ballerina.toml
└── main.bal
```

- The `Ballerina.toml` file contains metadata that describes your project. Also, the `bal` tool uses the `Ballerina.toml` file to identify the root of a project.
- The `main.bal` file is a source file and it contains the Ballerina code that prints `Hello, World!` to the console. You can add any number of source files into the `greeter` directory.

## Saying `Hello, World!`

You can open the project directory in your text editor. If you are using VSCode, run `code .` inside the `greeter` directory. Then, open the `main.bal` file to see the generated source.

```ballerina
import ballerina/io;

public function main() {
    io:println("Hello, World!");
}
```

In this code:

- The first line is an import statement that makes the functionality in the [`ballerina/io`](https://lib.ballerina.io/ballerina/io/latest) module available to your program. This module contains functions to write to the console, read from the console, and perform read/write operations on the files.
- The `main` function is your program's entry point, and you can execute it by running the program. 
- This function contains a statement, which prints `Hello, World!` to the console. This statement calls the `println` function in the `io` module with `"Hello, World!"` as an argument.

>**Info:** To learn more about the language, see [Language Basics](/learn/language-basics/). 

## Running the Project

Run `bal run` in your terminal to run this project.

```bash
$ bal run
Compiling source
	example/greeter:0.1.0

Running executable

Hello, World!
```

You can also generate an executable program with `bal build`,

```bash
$ bal build
Compiling source
	example/greeter:0.1.0

Generating executable
	target/bin/greeter.jar
```

and then, use `bal run` as follows.

```bash
$ bal run target/bin/greeter.jar
Hello, World!
```

## Writing a Simple REST API

Now, let's change the `greeter` application to a REST API. Ballerina has first-class abstractions for services, resources, etc., and they make network service development easier and more fun. 

Replace the `main.bal` content with the code below.

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

Let's take a moment to digest the new constructs in this code:

- The [`http`](https://lib.ballerina.io/ballerina/http/latest) module provides high-level abstractions to work with the HTTP protocol. 
- The listener declaration creates a new HTTP listener with the port `8080`. Listener is the entity that receives the network input and then routes it to the attached service(s).
- The service declaration specifies the listener to which the service gets attached and a collection of remotely accessible methods. There are two kinds of methods: `resource` and `remote` methods.
- Services use remote methods to expose services in procedural style: `remote` methods are named by verbs, and `resource` methods for data-oriented protocols: resources are named by nouns.
- In this example, there are two `resource` methods: The first one responds to HTTP GET requests with the `/greeting` path, and the other one responds to `GET` requests with the `/greeting/{name}` path.
- These `resource` methods return a `string` value, which maps to the `text/plan` content-type in the HTTP response.

>**Info:** To learn more about services, see [Network Interaction](/learn/distinctive-language-features/network-interaction/). 

Let's run this project in your terminal:

```bash
$ bal run
Compiling source
	example/greeter:0.1.0

Running executable
```

Run the commands below in another terminal window.

```bash
$ curl localhost:8080/greeting
Hello, World!

$ curl localhost:8080/greeting/Ballerina
Hello Ballerina
```

## Learning More

In this guide, you set up your development environment and wrote two Ballerina programs. Now, see the other [guides](/learn/) to learn more about Ballerina.

