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

[Download](/downloads/) Ballerina based on the operating system you are using and install it.

>**Tip:** For more information on installing Ballerina, see [Installation options](/downloads/installation-options/).

## Set up the editor

Set up a text editor to write Ballerina code.

>**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the Ballerina VS Code extension installed. For detailed information of the functionalities of this extension, go to the <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina VS Code extension documentation</a>.

## Meet `bal`

`bal` is the Ballerina build tool and package manager. Among other things, `bal` helps you to create, build, test, and run your package. The latest `bal` tool version is available with the latest Ballerina installation. 

Open your terminal, and run the following commands to make sure everything is ready.

```
$ bal
$ bal version
```

## Create a new package

Let's write a Ballerina program, which prints `Hello, World!`. Use the `bal new` command to create a new Ballerina package. 

>**Info:** For more information on packages, see [Organize Ballerina code](/learn/organize-ballerina-code/).

```
$ bal new greeter
```

This command creates a new directory called `greeter` with the content below.

```
greeter/
├── Ballerina.toml
└── main.bal
```

- The `Ballerina.toml` file contains metadata, which describes your package. Also, the `bal` tool uses the `Ballerina.toml` file to identify the root of a package.
- The `main.bal` file is a source file and it contains the Ballerina code that prints `Hello, World!` to the console. You can add any number of source files into the `greeter` directory.

## Say `Hello, World!`

You can open the package directory in your text editor. If you are using VS Code, run `code .` from inside the `greeter` directory. Then, open the `main.bal` file to see the generated source.

```ballerina
import ballerina/io;

public function main() {
    io:println("Hello, World!");
}
```

In this code:

- The first line is an import statement, which makes the functionality in the <a href="https://lib.ballerina.io/ballerina/io/latest" target="_blank">`ballerina/io`</a> module available to your program. This module contains functions to write to the console, read from the console, and perform read/write operations on the files.
- The `main` function is your program's entry point, and you can execute it by running the program. 
- This function contains a statement, which prints `Hello, World!` to the console. This statement calls the `println` function in the `io` module with `"Hello, World!"` as an argument.

>**Info:** To learn more about the language, see [Language basics](/learn/language-basics/). 

## Run the package

Run `bal run` in your terminal to run this package.

```
$ bal run
Compiling source
	example/greeter:0.1.0

Running executable

Hello, World!
```

Alternatively, you can generate an executable program with `bal build`,

```
$ bal build
Compiling source
	example/greeter:0.1.0

Generating executable
	target/bin/greeter.jar
```

and then, use `bal run` as follows.

```
$ bal run target/bin/greeter.jar
Hello, World!
```

## Write a simple REST API

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

- The <a href="https://lib.ballerina.io/ballerina/http/latest" target="_blank">`http`</a> module provides high-level abstractions to work with the HTTP protocol. 
- The listener declaration creates a new HTTP listener with the port `8080`. The `listener` is the entity, which receives the network input and then routes it to the attached service(s).
- The service declaration specifies the listener to which the service gets attached and a collection of remotely accessible methods. There are two kinds of methods as `resource` and `remote`.
- Services use `remote` methods to expose services in a procedural style and they are named by verbs whereas `resource` methods are used for data-oriented protocols and they are named by nouns.
- In this example, there are two `resource` methods: The first one responds to HTTP GET requests with the `/greeting` path and the other one responds to `GET` requests with the `/greeting/{name}` path.
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

Also, run the commands below in another terminal window to invoke the REST API.

```
$ curl localhost:8080/greeting
Hello, World!

$ curl localhost:8080/greeting/Ballerina
Hello Ballerina
```

## Learn more

In this guide, you set up your development environment and wrote two Ballerina programs. For more learning resources, see [Learn](/learn/).
