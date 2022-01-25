```
layout: getting-started-with-ballerina-left-nav-pages
title: Getting Started with Ballerina
description: Let’s set up a Ballerina development environment and write a simple Ballerina program.
keywords: ballerina, programming language, ballerina packages, getting started
permalink: /learn/getting-started-with-ballerina
active: getting-started-with-ballerina
intro: Let’s set up a Ballerina development environment and write a simple Ballerina program.
---
```

Let’s get you set up a Ballerina development environment and write a simple Ballerina program.

## Prerequisites

To complete this tutorial, you need:

- A command terminalA text editor.
- [VSCode](https://code.visualstudio.com/) with the [Ballerina extension](https://marketplace.visualstudio.com/items?itemName=WSO2.ballerina) installed is our preferred choice, and it has good support for Ballerina.
- A Ballerina installation. Follow the steps in [Installing Ballerina](https://ballerina.io/learn/installing-ballerina/setting-up-ballerina/).
- Some experience with at least one programming language. 

## Meet `bal`

`bal` is the Ballerina build tool and package manager. Among other things, `bal` helps you to create, build, test, and run your project. 

You can get the latest `bal` tool version with the Ballerina installation. Open your terminal and run the following commands just to make sure everything is ready:

```
$bal
$bal version
```

## Create a new project

Let’s write a Ballerina program that prints “Hello, World!”. Use the `bal new` command to create a new Ballerina project. 

```bash
$ bal new greeter
```

This command creates a new directory called `greeter`. Let’s move into this directory to see what’s in there. 

```
greeter/
├── Ballerina.toml
└── main.bal
```

- `Ballerina.toml` contains metadata that describes your project. Also, `bal` tool uses `Ballerina.toml` to identify the root of a project.
- `main.bal` is a source file, and it should contain Ballerina code that prints “Hello, World!” to the console. You can addput any number of source files into the `greeter` directory.

## Say “Hello, World!”

You can open the project directory in your text editor. If you are using VSCode, run `code .` inside the `greeter` directory. Then, open `main.bal` to see the generated source.

```ballerina
import ballerina/io;

public function main() {
    io:println("Hello, World!");
}
```

In this code:

- The first line is an import statement that makes the capabilities in the `[ballerina/io](https://lib.ballerina.io/ballerina/io/latest)` module available to your program. This module contains functions to write to the console, read from the console, and perform read/write operations on files.,
- The `main` function is your program’s entry point and you can execute it by running the program. 
- This function contains a statement that prints `Hello, World!` in the console. This statement calls the `println` function in the `io` with `Hello, World!`.

If you are interested in learning more about the language, read our [Language Basics](https://ballerina.io/learn/language-basics/) guide. 

Let’s run this project by running `bal run` in your terminal:

```
$ bal run
Compiling source
	example/greeter:0.1.0

Running executable

Hello, World!
```

You can also generate an executable program with `bal build`:

```$ bal buildCompiling source	sameera/greeter:0.1.0
Generating executable	target/bin/greeter.jar
```

Then, use `bal run` as follows.

```
$ bal run target/bin/greeter.jar
Hello, World!
```

## Write a simple REST API

Now let’s change our greeter application to a REST API. Ballerina has first-class abstractions for services, resources, etc., and they make network service development easier and more fun. 

You can replace the `main.bal` content with the following code.

```
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

Let’s take a moment to digest new constructs in this code:

- The `[http](https://lib.ballerina.io/ballerina/http/latest)` module provides high-level abstractions to work with the HTTP protocol. 
- The listener declaration creates a new HTTP listener with port 8080. Listener is the entity that receives the network input and then routes it to the attached service(s).
- The service declaration specifies the listener, to which the service gets attached, and a collection of remotely accessible methods. There are two kinds of methods: `resource` and `remote` methods.
- Services use remote methods to expose services in procedural style: remote methods are named by verbs, and resource methods for data-oriented protocols: resources are named by nouns.
- In this example, there are two resource methods: The first one responds to `HTTP` `GET` requests with the path `/greeting`, and the other one responds to `GET` requests with the path `/greeting/{name}`.
- These resource methods return a `string` value that maps to the content-type `text/plan` in the `HTTP` response.



If you are interested in learning more about services, read our [Network Interaction](https://ballerina.io/learn/distinctive-language-features/network-interaction/) guide. 

Let’s run this project in your terminal:

```
$ bal run
Compiling source
	example/greeter:0.1.0

Running executable
```

In another terminal window, try out the following commands:

```
$ curl localhost:8080/greeting
Hello, World!

$ curl localhost:8080/greeting/Ballerina
Hello Ballerina
```

## Do more with Ballerina

In this short tutorial, you set up your development environment and wrote two Ballerina applications.

To learn more about Ballerina, take a look at the following tutorials:

- Write a REST API
- Write a GraphQL service 
- Write a gRPC service 
- Deploy your application to K8s