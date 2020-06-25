---
layout: ballerina-left-nav-pages-swanlake
title: Keeping Ballerina Up to Date
description: Learn how to maintain your Ballerina programming language installation and keep it up to date with the latest patch and minor releases.
keywords: ballerina, programming language, release, update
permalink: /swan-lake/learn/keeping-ballerina-up-to-date/
active: keeping-ballerina-up-to-date
redirect_from:
  - /swan-lake/learn/how-to-keep-ballerina-up-to-date
  - /swan-lake/learn/how-to-keep-ballerina-up-to-date/
  - /swan-lake/learn/keeping-ballerina-up-to-date
---

# Keeping Ballerina Up to Date

This guide explains how to maintain your Ballerina installation up to date with the latest patch and minor releases. If you haven’t installed Ballerina yet, visit [installation guide](/swan-lake/learn/installing-ballerina/).

- [Terminology](#terminology)
  - [The Ballerina tool](#the-ballerina-tool)
  - [Ballerina distributions](#ballerina-distributions)
  - [Release channels](#release-channels)
  - [Release maintenance](#release-maintenance)
- [Keeping Ballerina upto date](#keeping-ballerina-upto-date)
  - [The “active” distribution](#the-active-distribution)
  - [The `ballerina dist` command](#the-ballerina-dist-command)
  - [List local and remote distributions](#list-local-and-remote-distributions)
  - [Update the Ballerina tool](#update-the-ballerina-tool)
  - [Pull a specific distribution](#pull-a-specific-distribution)
  - [Change the active distribution](#change-the-active-distribution)
  - [Remove distributions](#remove-distributions)
  
  

## Terminology

This section introduces various terms used throughout this guide. We recommend that you read this section before proceeding to the next.  

### The Ballerina tool

**Ballerina** is a command-line tool for managing Ballerina source code. It helps you to manage Ballerina projects and modules, test, build, and run programs, etc.

It also enables you to easily install, update, and switch among Ballerina distributions. The main focus of this guide is to teach you how to perform these actions but first, let’s talk about Ballerina distributions.

### Ballerina distributions

- The language specification defines the syntax and semantics of Ballerina programming language. Ballerina compiler is a software program that validates the Ballerina source code and translates it to an executable program. There exist a production-ready official compiler called  jBallerina. We also have a plan to do a native compiler called nBallerina.
- jBallerina
  - Ballerina compiler that targets the JVM.
  - The most stable and production-ready compiler.
- nBallerina
  - Ballerina compiler that targets platforms such as Linux, Windows and Mac OS.
  - Not available yet.

Ballerina distribution is a term that we use to refer to jBallerina and nBallerina compilers.

### Release channels

Ballerina distributions of the Swan Lake channel are currently released as preview releases. 

For example: Swan Lake Preview 1

#### Release maintenance

The maintenance of a particular preview release stops when the stable version of it is available. For example, the preview releases of Swan Lake will stop when the stable Swan Lake GA version is released.

## Keeping Ballerina upto date

Now that you are familiar with the terminology, let’s look at how you can keep your Ballerina distributions up to date.

- The first step is to install Ballerina. Visit our [installation guide](/swan-lake/learn/installing-ballerina/) guide for details. Once the installation is complete, you would see the following directory structure inside the installation directory.

```sh
.
├── bin/
│   └── ballerina
├── lib/
│   └── ballerina-command-0.8.0.jar
├── dependencies/
│   └── jdk8u202-b08-jre/
└── distributions/
    ├── ballerina-version
    ├── jballerina-1.0.5/
    ├── jballerina-1.1.0/
    └── jballerina-1.1.1/
```

>**Info:** “distributions” is the directory in which we maintain all your installed distributions.

### The "active" distribution

- Only one distribution from the above list can be active at a given time.
- Ballerina tool delegates most of the user requests to the active distribution. The commands such as build, test, run, pull, and push are delegated to the active distribution, while the commands such as dist and version are handled by the tool itself.  E.g., when you invoke `ballerina build`, the Ballerina tool dispatches this request to the active distribution.
- You can change the active distribution at any time. Refer the [Change the active distribution](#change-the-active-distribution) section for more details.  

### The `ballerina dist` command

Ballerina tool comes with various subcommands to help you manage Ballerina source code. The `ballerina dist` and `ballerina update` commands are the ones that will be explained in this guide. The `ballerina dist` command allows you to manage Ballerina distributions whereas the `ballerina update` command updates the tool itself.

The dist command has few other subcommands. Here is the output of `ballerina help dist`.

```sh
→ ballerina help dist
NAME
       ballerina-dist - Manage Ballerina distributions

SYNOPSIS
       ballerina dist <command> <-h | --help>
       ballerina dist <command> [<args>]


DESCRIPTION
       Dist enables you to install, update, and switch among Ballerina distributions
       from patch and minor release channels.


OPTIONS
       -h, --help
           Print usage details of a command.


BALLERINA COMMANDS
       Here is a list of available subcommands:

       update     Update to the latest patch version of the active distribution
       pull       Fetch a distribution and set it as the active version
       use        Set a distribution as the active distribution
       list       List locally and remotely available distributions
       remove     Remove distributions in your local environment


Use 'ballerina help dist <command>' for more information on a specific command.
```

Most of these subcommands are self-explanatory. Therefore, the following sections introduce them briefly.


### List local and remote distributions

The `ballerina dist list` command lists the installed distributions in your local environment. It also lists the distributions available for you to download.

```sh
→ ballerina dist list
* [slp1] ballerina version slp1
  [1.1.0] jballerina version 1.1.0
  [1.2.4] jballerina version 1.2.4

Distributions available remotely:

1.* channel

  [1.0.0] jballerina version 1.0.0
  [1.0.1] jballerina version 1.0.1
  [1.0.2] jballerina version 1.0.2
  [1.0.3] jballerina version 1.0.3
  [1.0.4] jballerina version 1.0.4
  [1.0.5] jballerina version 1.0.5
  [1.1.0] jballerina version 1.1.0
  [1.1.1] jballerina version 1.1.1
  [1.1.2] jballerina version 1.1.2
  [1.1.3] jballerina version 1.1.3
  [1.1.4] jballerina version 1.1.4
  [1.2.0] jballerina version 1.2.0
  [1.2.1] jballerina version 1.2.1
  [1.2.2] jballerina version 1.2.2
  [1.2.3] jballerina version 1.2.3
  [1.2.4] jballerina version 1.2.4

Swan Lake channel

  [slp1] Preview 1

Use 'ballerina help dist' for more information on specific commands.

```

The star (*) indicates the active distribution.

### Update the Ballerina tool

- The `ballerina update` command updates the Ballerina tool itself to the latest version. Ballerina tool versions are independent from distribution versions. We expect these tool updates to be rare compared to distribution releases.

```sh
→ ballerina update
Fetching the latest tool version from the remote server...
Downloading ballerina-command-0.8.8 100% [=====================================================================================================================================================================] 1/1 MB (0:00:01 / 0:00:00)
Tool version updated to the latest version: 0.8.8
Cleaning old files...
Update successfully completed

If you want to update the Ballerina distribution, use 'ballerina dist update'
```

### Pull a specific distribution

- The `ballerina dist pull <distribution>` command downloads a particular distribution and stores it in your local environment. It also sets the fetched distribution as the active distribution.

```sh
→ sudo ballerina pull slp1
Downloading slp1 100% [====================================================================================================================================================================================] 186/186 MB (0:02:43 / 0:00:00)

Fetching the dependencies for 'slp1' from the remote server...
Dependency 'jdk8u202-b08-jre' is already available locally
'slp1' successfully set as the active distribution
```

### Change the active distribution

The `ballerina dist use <distribution>` command sets a particular distribution version as the active one.  See the following workflow.

```sh
→ ballerina dist use 1.0.4
'1.1.0' successfully set as the active distribution

→ ballerina dist list
Distributions available locally:

  [1.0.0] jballerina version 1.0.5
* [1.0.4] jballerina version 1.1.0
  [1.0.5] jballerina version 1.0.5
  [1.1.0] jballerina version 1.1.0

…
```

### Remove distributions

The `ballerina dist remove <distribution>` command allows you to delete a particular distribution from your local environment. If you’ve been updating Ballerina regularly, you may have accumulated many unused distribution versions. This command helps you to clean them up.

```sh
→ ballerina dist remove 1.0.5
Distribution '1.0.5' successfully removed
```




