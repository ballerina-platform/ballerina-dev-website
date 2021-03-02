---
layout: ballerina-tooling-guide-left-nav-pages-swanlake
title: Using the CLI Commands
description: Learn all the command line interface (CLI) commands you need to get started, build, test and run programs, work with Ballerina Central, and manage packages.
keywords: ballerina, cli, command line interface, programming language
permalink: /learn/using-the-cli-tools/using-the-cli-commands/
active: using-the-cli-commands
intro: The Ballerina Tool is your one-stop-shop for all the things you do in Ballerina. 
redirect_from:
  - /learn/cli-commands
  - /learn/cli-commands/
  - /learn/using-the-cli-tools/
  - /learn/using-the-cli-tools
  - /swan-lake/learn/using-the-cli-tools/
  - /swan-lake/learn/using-the-cli-tools
  - /learn/using-the cli-tools/core-commands
---

## Using the Ballerina Tool

The Ballerina Tool is a command-line tool for managing Ballerina source code. It helps you to manage Ballerina packages and modules, test, build, and run programs, etc.

It also enables you to easily install, update, and switch among Ballerina distributions. 

In the CLI, execute the `bal help` command to view all the actions you can perform with the Ballerina Tool as shown below:

```sh
→ bal help
NAME
       The Ballerina tool

SYNOPSIS
       bal <-v | --version>
       bal [command] <-h | --help>
       bal <command> [<args>]


DESCRIPTION
       Ballerina is a statically typed, concurrent programming language, focusing on network interaction and structured
       data. It is intended to be the core of a language-centric middleware platform. It has all the general-purpose
       functionality expected of a modern programming language, but it also has several unusual aspects that make it
       particularly suitable for its intended purpose.

       Find more information at: https://ballerina.io/


OPTIONS
       -v, --version
           Print the Ballerina version information.

       -h, --help
           Print usage details of a command.


BALLERINA COMMANDS
        Here is a list of available subcommands:

   Core Commands:
        build           Compile Ballerina program into an executable
        run             Build and run Ballerina program
        test            Run package tests
        doc             Generate API documentation
        clean           Clean artifacts generated during the build
        format          Format Ballerina sources

   Package Commands:
        new             Create a new Ballerina package
        init            Create a new Ballerina package in the current directory
        add             Create a new Ballerina module in the package
        pull            Pull a package from Ballerina Central
        push            Upload a package to Ballerina Central
        search          Search Ballerina Central for packages

   Other Commands:
        encrypt         Encrypt sensitive data
        grpc            Generate Ballerina sources for the given protobuf definition
        openapi         Generate Ballerina sources for the given OpenAPI definition and vice versa.
        version         Print Ballerina version
        bindgen         Generate Ballerina bindings for Java APIs
        shell           Run ballerina interactive REPL [EXPERIMENTAL]

   Update Commands:
        dist            Manage Ballerina distributions
        update          Update the Ballerina tool


Use 'bal help <command>' for more information on a specific command.
```

You can use it in the below format.

> `bal <THE-COMMAND> <ITS-ARGUEMENTS>`

> **Tip:** You can view details of the commands below by executing the `bal help <COMMAND>`. For example, the below is the output of the `bal help pull` command.

```sh
→ bal help pull
NAME
       ballerina-pull - Fetch packages from Ballerina Central

SYNOPSIS
       bal pull <org-name>/<package-name>[:<version>]


DESCRIPTION
       The pull command downloads the specified package from Ballerina Central
       along with its dependencies. It then caches this package in the
       '.ballerina' directory in the user home.

       Ballerina Central is a package repository hosted at
       https://central.ballerina.io/. A package repository organizes packages
       into a three-level hierarchy: organization, package name, and version.
       Organizations are unique within a repository and can be mapped to an
       individual user or organization registered with the repository.


EXAMPLES
       Pull the latest version of 'gmail' connector in 'wso2' organization
       from Ballerina Central.
          $ bal pull wso2/gmail

       Pull the '1.1.0' version of 'gmail' connector in 'wso2' organization
       from Ballerina Central.
          $ bal pull wso2/gmail:1.1.0
```

## Core Commands

These everyday commands are your best friends! They address the very basics of programming in Ballerina such as compiling, running, testing programs, and generating their documentation.

<table class="cComandTable">
<tr>
<td class="cCommand">build</td>
<td class="cDescription">Compile a standalone `.bal` file, or an entire package into an executable JAR file. For more information, see <a href="/learn/running-ballerina-code">Running Ballerina Code</a>.
</td>
</tr>
<tr>
<td class="cCommand">run</td>
<td class="cDescription">Build and run a standalone `.bal` file, an entire package, or a previously-built program. For more information, see <a href="/learn/running-ballerina-code">Running Ballerina Code</a>.
</td>
</tr>
<tr>
<td class="cCommand">test</td>
<td class="cDescription">Run tests of a Ballerina package. For more information, see <a href="/learn/testing-ballerina-code/testing-quick-start/">Testing Ballerina Code</a>.
</td>
</tr>
<tr>
<td class="cCommand">doc</td>
<td class="cDescription">Format Ballerina source files as per the <a href="/learn/coding-conventions">Coding Conventions</a>.</td>
<td class="cDescription">Generate API documents for all public symbols of a Ballerina package. For more information, see <a href="/learn/documenting-ballerina-code">Documenting Ballerina Code</a>.
</td>
</tr>
<tr>
<td class="cCommand">clean</td>
<td class="cDescription">Clean all artifacts generated by the build command for a package.
</td>
</tr>
<tr>
<td class="cCommand">format</td>
<td class="cDescription">Format Ballerina source files as per the <a href="/learn/coding-conventions">Coding Conventions</a>.</td>
</tr>
</table>

## Package Commands

Ballerina packages are the way to organize real-world Ballerina development tasks. The last 3 commands given below allow you to work with the Ballerina Central and also to share Ballerina packages with others in a safe, secure, and dependable way.

<table class="cComandTable">
<tr>
<td class="cCommand">new</td>
<td class="cDescription">Create a Ballerina package. For more information, see <a href="/learn/structuring-ballerina-code">Structuring Ballerina Code</a>.
</td>
</tr>
<tr>
<td class="cCommand">init</td>
<td class="cDescription">Create a new Ballerina package in the current directory.
</td>
</tr>
<tr>
<td class="cCommand">add</td>
<td class="cDescription">Create a new Ballerina module in a package.
</td>
</tr>
<tr>
<td class="cCommand">pull</td>
<td class="cDescription">Pull a package from Ballerina Central.
</td>
</tr>
<tr>
<td class="cCommand">push</td>
<td class="cDescription">Upload a package to Ballerina Central. For more information, see <a href="/learn/publishing-packages-to-ballerina-central">Publishing Packages to Ballerina Central</a>.
</td>
</tr>
<tr>
<td class="cCommand">search</td>
<td class="cDescription">Search Ballerina Central for packages.
</td>
</tr>
</table>

## Other Commands

These powerful supporting tools extend Ballerina to various ecosystem technologies that are inherently cloud-native. This functionality will grow over time and will even be developer extensible in the future.

<table class="cComandTable">
<tr>
<td class="cCommand">encrypt</td>
<td class="cDescription">Use this tool to encrypt sensitive data and pass them to a Ballerina program via the configuration system.
</td>
</tr>
<tr>
<td class="cCommand">grpc</td>
<td class="cDescription">This is the gRPC stub/skeleton generation tool. For more information, see <a href="/learn/generating-ballerina-code-for-protocol-buffer-definitions">Generating Ballerina Code for Protocol Buffer Definitions</a>.</td>
</tr>
<tr>
<td class="cCommand">openapi</td>
<td class="cDescription">This is the OpenAPI (Swagger) stub/skeleton generation tool. For more information, see <a href="/learn/using-the-openapi-tools">Using the OpenAPI Tools</a>.</td>
</tr>
<tr>
<td class="cCommand">version</td>
<td class="cDescription">Tells you the version of the distribution you are currently using, the language specification version on which it is based, and the update tool version, which is currently in use.</td>
</tr>
<tr>
<td class="cCommand">bindgen</td>
<td class="cDescription">Use this tool for auto-generating Ballerina bridge code for Java APIs. For more information, see <a href="/learn/calling-java-code-from-ballerina">Calling Java Code from Ballerina</a>.</td>
</tr>
<tr>
<td class="cCommand">help</td>
<td class="cDescription">Prints the usage details of any Ballerina command (e.g., `bal help pull`).
</td>
</tr>
</table>

## Update Commands

<table class="cComandTable">
<tr>
<td class="cCommand">dist</td>
<td class="cDescription">Manage Ballerina distributions. For more information, see <a href="/learn/keeping-ballerina-up-to-date/">Keeping Ballerina Up to Date</a>.
</td>
</tr>
<tr>
<td class="cCommand">update</td>
<td class="cDescription">Update the Ballerina Tool. For more information, see <a href="/learn/keeping-ballerina-up-to-date/">Keeping Ballerina Up to Date</a>.
</td>
</tr>
</table>

<style> #tree-expand-all, #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
