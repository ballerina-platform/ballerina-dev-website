---
layout: ballerina-cli-documentation-left-nav-pages-swanlake
title: CLI commands
description: Learn all the command-line interface (CLI) commands you need to get started, build, test and run programs, work with Ballerina Central, and manage packages.
keywords: ballerina, cli, command-line interface, programming language
permalink: /learn/build-and-run/bal-command/cli-commands/
active: cli-commands
intro: The Ballerina Tool is your one-stop-shop for all the things you do in Ballerina. 
---

## Use the Ballerina tool

The Ballerina Tool is a command-line tool for managing Ballerina source code. It helps you to manage Ballerina packages and modules, test, build, and run programs, etc.

It also enables you to easily install, update, and switch among Ballerina distributions. 

In the CLI, execute the `bal help` command to view all the actions you can perform with the Ballerina Tool as shown below.

>**Info:** The `Tool Commands` section in the output below will be displayed only if you already installed a tool by executing the `bal tool pull` command. For more information, see [Tool commands](#tool-commands).

```
$ bal help
NAME
       The build system and package manager of Ballerina

SYNOPSIS
       bal <command> [args]
       bal [OPTIONS]


OPTIONS
       -v, --version
           Print version information.

       -h, --help
           Print the usage details of a command.


COMMANDS
        The available subcommands are:

   Core Commands:
        build           Compile the current package
        run             Compile and run the current package
        test            Run package tests
        doc             Generate current package's documentation
        pack            Create distribution format of the current package

   Package Commands:
        new             Create a new Ballerina package
        add             Add a new Ballerina module to the current package
        pull            Pull a package from Ballerina Central
        push            Publish a package to Ballerina Central
        search          Search Ballerina Central for packages
        semver          Show SemVer compatibility and local package changes against
                        published packages in Ballerina Central
        graph           Print the dependency graph in the console
        deprecate       Deprecate a package in Ballerina Central

   Other Commands:
        clean           Clean the artifacts generated during the build
        format          Format Ballerina source files
        grpc            Generate the Ballerina sources for a given Protocol
                        Buffer definition
        graphql         Generate the Ballerina client sources for a GraphQL 
                        config file, the GraphQL schema for a GraphQL service, 
                        and Ballerina service sources for a GraphQL schema
        openapi         Generate the Ballerina sources for a given OpenAPI
                        definition and vice versa
        asyncapi        Generate the Ballerina sources for a given AsyncAPI definition
        persist         Manage data persistence
        bindgen         Generate the Ballerina bindings for Java APIs
        shell           Run Ballerina interactive REPL [Experimental]
        tool            Manage Ballerina CLI tools
        version         Print the Ballerina version
        profile         Start Ballerina Profiler [Experimental]

   Tool Commands:
        edi             Generate the Ballerina records and parsing functions or a 
                        Ballerina package for a given EDI schema or collection of schemas
        health          Generate the Ballerina packages or API templates for a given 
                        FHIR implementation guide.

   Update Commands:
        dist            Manage Ballerina distributions
        update          Update the Ballerina tool

Use 'bal help <command>' for more information on a specific command.
```

You can use it in the following format.

```
$ bal <COMMAND> <ARGUMENTS>
```

> **Tip:** You can view details of the commands by executing the `bal help <COMMAND>`. For example, the following is the output of the `bal help pull` command.

```
$ bal help pull
NAME
       ballerina-pull - Fetch packages from Ballerina Central or a custom
       package repository

SYNOPSIS
       bal pull <org-name>/<package-name>[:<version>]


DESCRIPTION
       Download the specified package from Ballerina Central along with its
       dependencies and cache it in the '.ballerina' directory in the user home.

       Ballerina Central is a package repository hosted at
       https://central.ballerina.io/. A package repository organizes packages
       into a three-level hierarchy: organization, package name, and version.
       Organizations are unique within a repository and can be mapped to an
       individual user or organization registered with the repository.

       To download a package from a custom repository, configure it in the Settings.toml
       file and pass the given id with the --repository flag.

OPTIONS
       --repository
           Pull a package from a custom repository.
           The repository must be configured in the <USER_HOME>/.ballerina/Settings.toml file.


EXAMPLES
       Pull the latest version of the 'gmail' connector in the 'wso2'
       organization from Ballerina Central.
           $ bal pull wso2/gmail

       Pull the '1.1.0' version of the 'gmail' connector in the 'wso2'
       organization from Ballerina Central.
           $ bal pull wso2/gmail:1.1.0

       Pull the '1.1.0' version of the 'gmail' connector in the 'wso2'
       organization from the github package repository defined in the Settings.toml file.
           $ bal pull wso2/gmail:1.1.0 --repository=wso2
```

## Core commands

These everyday commands are your best friends! They address the very basics of programming in Ballerina such as compiling, running, testing programs, and generating their documentation.

<table class="cComandTable">
<tr>
<td class="cCommand">build</td>
<td class="cDescription">Compile a standalone <code>.bal</code> file, or an entire package into an executable JAR file. For more information, see <a href="/learn/get-started/">Getting started with Ballerina</a>.
</td>
</tr>
<tr>
<td class="cCommand">run</td>
<td class="cDescription">Build and run a standalone <code>.bal</code> file, an entire package, or a previously-built program. For more information, see <a href="/learn/get-started/">Getting started with Ballerina</a>.
</td>
</tr>
<tr>
<td class="cCommand">test</td>
<td class="cDescription">Run tests of a Ballerina package. For more information, see <a href="/learn/test-ballerina-code/test-a-simple-function/">Testing a Simple Function</a>.
</td>
</tr>
<tr>
<td class="cCommand">doc</td>
<td class="cDescription">Generate API documents for all public symbols of a Ballerina package. For more information, see <a href="/learn/generate-code-documentation">Generating code documentation</a>.
</td>
</tr>
<tr>
<td class="cCommand">pack</td>
<td class="cDescription">Create the distribution format (<code>.bala</code>) of the current package.
</td>
</tr>
<tr>
<td class="cCommand">tool</td>
<td class="cDescription">Pull, remove, update, switch between versions, and search Ballerina command line tools.
</td>
</tr>
</table>

## Package commands

Ballerina packages are the way to organize real-world Ballerina development tasks. The last five commands given below allow you to work with the Ballerina Central and also to share Ballerina packages with others in a safe, secure, and dependable way.

<table class="cComandTable">
<tr>
<td class="cCommand">new</td>
<td class="cDescription">Create a Ballerina package. For more information, see <a href="/learn/get-started/#create-a-new-package">Create a new package</a>.
</td>
</tr>
<tr>
<td class="cCommand">add</td>
<td class="cDescription">Add a new module to the current package.
</td>
</tr>
<tr>
<td class="cCommand">graph</td>
<td class="cDescription">Print the dependency graph in the console.
</td>
</tr>
<tr>
<td class="cCommand">search</td>
<td class="cDescription">Search Ballerina Central for packages.
</td>
</tr>
<tr>
<td class="cCommand">semver</td>
<td class="cDescription">Validate <a href="https://semver.org/">SemVer</a> compatibility of the local package changes against any previously published version(s) in Ballerina Central.
</td>
</tr>
<tr>
<td class="cCommand">pull</td>
<td class="cDescription">Pull a package from Ballerina Central.
</td>
</tr>
<tr>
<td class="cCommand">push</td>
<td class="cDescription">Publish a package to Ballerina Central. For more information, see <a href="/learn/publish-packages-to-ballerina-central">Publish packages to Ballerina Central</a>.
</td>
</tr>
<tr>
<td class="cCommand">deprecate</td>
<td class="cDescription">Deprecate a version of a package in Ballerina Central.
</td>
</tr>
</table>

## Other commands

These powerful supporting tools extend Ballerina to various ecosystem technologies that are inherently cloud-native. This functionality will grow over time and will even be developer extensible in the future.

<table class="cComandTable">
<tr>
<td class="cCommand">clean</td>
<td class="cDescription">Clean all artifacts generated by the build command for a package.
</td>
</tr>
<tr>
<td class="cCommand">format</td>
<td class="cDescription">Format Ballerina source files as per the <a href="/learn/style-guide/coding-conventions/">Coding Conventions</a>.</td>
</tr>
<tr>
<td class="cCommand">grpc</td>
<td class="cDescription">This is the gRPC stub/skeleton generation tool. For more information, see <a href="/learn/grpc-tool">gRPC tool</a>.</td>
</tr>
<tr>
<td class="cCommand">graphql</td>
<td class="cDescription">This is the GraphQL client/schema/service generation tool. For more information, see <a href="/learn/graphql-tool/">Ballerina GraphQL tool support</a>.</td>
</tr>
<tr>
<td class="cCommand">openapi</td>
<td class="cDescription">This is the OpenAPI (Swagger) stub/skeleton generation tool. For more information, see <a href="/learn/openapi-tool">Ballerina OpenAPI support</a>.</td>
</tr>
<tr>
<td class="cCommand">asyncapi</td>
<td class="cDescription">Tool to generate Ballerina sources for a given AsyncAPI definition. For more information, see <a href="/learn/asyncapi-tool">Ballerina AsyncAPI support</a>.</td>
</tr>
<tr>
<td class="cCommand">persist</td>
<td class="cDescription">Manage data persistence. For more information, see <a href="/learn/bal-persist-overview/">Bal persist overview</a>.</td>
</tr>
<tr>
<td class="cCommand">bindgen</td>
<td class="cDescription">Use this tool for auto-generating Ballerina bridge code for Java APIs. For more information, see <a href="/learn/call-java-code-from-ballerina">Call Java code from Ballerina</a>.</td>
</tr>
<tr>
<td class="cCommand">shell</td>
<td class="cDescription"> Use this to run a REPL instance of Ballerina and execute small snippets of code.</td>
</tr>
<tr>
<td class="cCommand">version</td>
<td class="cDescription">Tells you the version of the distribution you are currently using, the language specification version on which it is based, and the update tool version, which is currently in use.</td>
</tr>
<tr>
<td class="cCommand">profile</td>
<td class="cDescription">Profile a Ballerina package and generate a flame graph. For more information, see <a href="/learn/ballerina-profiler">Ballerina Profiler</a>.
</td>
</tr>
<tr>
<td class="cCommand">help</td>
<td class="cDescription">Prints the usage details of any Ballerina command (e.g., <code>bal help pull</code>).
</td>
</tr>
</table>

## Tool commands

These tools extend the Ballerina CLI to support additional functionalities and are not installed by default. They can be pulled from the Ballerina Central and are managed using the `bal tool` command.

The following tool sub commands can be used to manage the tools.

<table class="cComandTable">
<tr>
<td class="cCommand">pull</td>
<td class="cDescription">Pull a tool from Ballerina Central.
</td>
</tr>
<tr>
<td class="cCommand">remove</td>
<td class="cDescription">Remove a tool from the local bal tool chain.
</td>
</tr>
<tr>
<td class="cCommand">update</td>
<td class="cDescription">Update to the latest patch version of the currently active version.
</td>
</tr>
<tr>
<td class="cCommand">use</td>
<td class="cDescription">Set the specified version of a tool as the active version.
</td>
</tr>
<tr>
<td class="cCommand">list</td>
<td class="cDescription">List the tool IDs and the versions of all locally available tools.
</td>
</tr>
<tr>
<td class="cCommand">search</td>
<td class="cDescription">Search Ballerina Central for tools using a given keyword.
</td>
</tr>
</table>

## Update commands

<table class="cComandTable">
<tr>
<td class="cCommand">dist</td>
<td class="cDescription">Manage Ballerina distributions. For more information, see <a href="/learn/update-tool/">Update Tool</a>.
</td>
</tr>
<tr>
<td class="cCommand">update</td>
<td class="cDescription">Update the Ballerina Tool. For more information, see <a href="/learn/update-tool/">Update Tool</a>.
</td>
</tr>
</table>

<style> #tree-expand-all, #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
