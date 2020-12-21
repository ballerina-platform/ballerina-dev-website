---
layout: ballerina-left-nav-pages
title: Using the CLI Tools
description: Learn all the command line interface (CLI) commands need to get started, build, test and run programs, work with Ballerina Central, and manage projects.
keywords: ballerina, cli, command line interface, programming language
permalink: /learn/using-the-cli-tools/
active: using-the-cli-tools
intro: The Ballerina Tool is your one-stop-shop for all the things you do in Ballerina. 
redirect_from:
  - /v1-2/learn/cli-commands
  - /v1-2/learn/cli-commands/
  - /learn/cli-commands/
  - /learn/cli-commands
  - /learn/using-the-cli-tools
---

## Using the Ballerina Tool

In the CLI, execute the `ballerina help` command to view all the actions you can perform with it as shown below.

```sh
→ ballerina help 
NAME
       The Ballerina build tool

SYNOPSIS
       ballerina <-v | --version>
       ballerina [command] <-h | --help>
       ballerina <command> [<args>]


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
        test            Run module tests
        doc             Generate API documentation
        clean           Clean artifacts generated during the build
        format          Format Ballerina sources

   Module Commands:
        pull            Pull a module from Ballerina Central
        push            Upload module to the Ballerina Central
        search          Search Ballerina Central for modules

   Project Commands:
        new             Create a new Ballerina project
        add             Create a new Ballerina module in a project

   Other Commands:
        encrypt         Encrypt sensitive data
        grpc            Generate Ballerina sources for the given protobuf definition
        openapi         Generate Ballerina sources for the given OpenAPI definition and vice versa.
        version         Print Ballerina version
        bindgen         Generate Ballerina bindings for Java APIs

   Update Commands:
        dist            Manage Ballerina distributions
        update          Update the Ballerina Tool


Use 'ballerina help <command>' for more information on a specific command.
```

 You can use the `ballerina` command in the below format.

> `ballerina <THE-COMMAND> <ITS-ARGUEMENTS>`

> **Tip:** You can view details of any of the commands below by executing `ballerina help <COMMAND>`. For example, the below is the output of the `ballerina help pull` command.

```sh
→ ballerina help pull
NAME
       ballerina-pull - Fetch modules from Ballerina Central

SYNOPSIS
       ballerina pull <org-name>/<module-name>[:<version>]


DESCRIPTION
       Pull downloads the specified module from Ballerina Central
       along with its dependencies. It then caches this module at
       '.ballerina' directory in user home.

       Ballerina Central is a module repository hosted at
       https://central.ballerina.io/. A module repository organizes modules
       into a three-level hierarchy: organization, module name, and version.
       Organizations are unique within a repository and can be mapped to an
       individual user or organization registered with the repository.


EXAMPLES
       Pull the latest version of 'gmail' connector in 'wso2' organization
       from Ballerina Central.
          $ ballerina pull wso2/gmail

       Pull the '1.1.0' version of 'gmail' connector in 'wso2' organization
       from Ballerina Central.
          $ ballerina pull wso2/gmail:1.1.0
```

## Core Commands

These everyday commands are your best friends! They address the very basics of programming in Ballerina such as compiling, running, testing programs, and generating their documentation.

<table class="cComandTable">
<tr>
<td class="cCommand">build</td>
<td class="cDescription">Compile a Ballerina program, a single BAL file, an entire project, or a single root module into an executable JAR file.
</td>
</tr>
<tr>
<td class="cCommand">run</td>
<td class="cDescription">Build and run a Ballerina program, a single BAL file, a module, an entire project, or a previously-built program. For more information, see <a href="/learn/running-ballerina-code">Running Ballerina Code</a>.
</td>
</tr>
<tr>
<td class="cCommand">test</td>
<td class="cDescription">Run tests of a particular module or all the modules of a Ballerina project. For more information, see <a href="/learn/testing-ballerina-code/testing-quick-start/">Testing Ballerina Code</a>.
</td>
</tr>
<tr>
<td class="cCommand">doc</td>
<td class="cDescription">Generate API documents for all public symbols of a Ballerina module or project. For more information, see <a href="/learn/documenting-ballerina-code">Documenting Ballerina Code</a>.
</td>
</tr>
<tr>
<td class="cCommand">clean</td>
<td class="cDescription">Clean all artifacts generated by the build command for a project.
</td>
</tr>
<tr>
<td class="cCommand">format</td>
<td class="cDescription">Format Ballerina source files as per the <a href="/learn/coding-conventions">Coding Conventions</a>.</td>
</tr>
</table>

## Module Commands

These commands allow you to work with the Ballerina Central to share Ballerina modules with others in a safe, secure, and dependable way.

<table class="cComandTable">
<tr>
<td class="cCommand">pull</td>
<td class="cDescription">Pull a module from Ballerina Central.
</td>
</tr>
<tr>
<td class="cCommand">push</td>
<td class="cDescription">Upload a module to Ballerina Central. For more information, see <a href="/learn/publishing-modules-to-ballerina-central">Publishing Modules to Ballerina Central</a>.
</td>
</tr>
<tr>
<td class="cCommand">search</td>
<td class="cDescription">Search Ballerina Central for modules.
</td>
</tr>
</table>

## Project Commands

Ballerina projects are the way to organize real world Ballerina development tasks. 

<table class="cComandTable">
<tr>
<td class="cCommand">new</td>
<td class="cDescription">Create a Ballerina project. For more information, see <a href="/learn/structuring-ballerina-code">Structuring Ballerina Code</a>.
</td>
</tr>
<tr>
<td class="cCommand">add</td>
<td class="cDescription">Create a new Ballerina module in a project. For more information, see <a href="/learn/structuring-ballerina-code">Structuring Ballerina Code</a>.
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
<td class="cDescription">Prints the usage details of any Ballerina command (e.g., `ballerina help pull`).
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
