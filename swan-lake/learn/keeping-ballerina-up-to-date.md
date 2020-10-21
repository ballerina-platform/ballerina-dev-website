---
layout: ballerina-left-nav-pages-swanlake
title: Keeping Ballerina Up to Date
description: Learn how to maintain your Ballerina programming language installation and keep it up to date with the latest patch and minor releases.
keywords: ballerina, programming language, release, update
permalink: /swan-lake/learn/keeping-ballerina-up-to-date/
active: keeping-ballerina-up-to-date
intro: This guide explains how to maintain your Ballerina installation up to date with the latest patch and minor releases.
redirect_from:
  - /swan-lake/learn/how-to-keep-ballerina-up-to-date
  - /swan-lake/learn/how-to-keep-ballerina-up-to-date/
  - /swan-lake/learn/keeping-ballerina-up-to-date
---

If you haven’t installed Ballerina yet, visit [installation guide](/swan-lake/learn/installing-ballerina/).

## Terminology

This section introduces various terms used throughout this guide. We recommend that you read this section before proceeding to the next.  

### The Ballerina Tool

**Ballerina** is a command-line tool for managing Ballerina source code. It helps you to manage Ballerina projects and modules, test, build, and run programs, etc.

It also enables you to easily install, update, and switch among Ballerina distributions. The main focus of this guide is to teach you how to perform these actions but first, let’s talk about Ballerina distributions.

### Ballerina Distributions

- The language specification defines the syntax and semantics of Ballerina programming language. Ballerina compiler is a software program that validates the Ballerina source code and translates it to an executable program. There exist a production-ready official compiler called  jBallerina. We also have a plan to do a native compiler called nBallerina.
- jBallerina
  - Ballerina compiler that targets the JVM.
  - The most stable and production-ready compiler.
- nBallerina
  - Ballerina compiler that targets platforms such as Linux, Windows and Mac OS.
  - Not available yet.

Ballerina distribution is a term that we use to refer to jBallerina and nBallerina compilers.

### Release Channels

Ballerina distributions are released on two different release channels at the moment: patch releases and minor releases. Both these channels distribute stable versions. Ballerina yet does not have a release channel for nightly builds that give you access to the latest perhaps unstable features.

Ballerina distribution releases strictly follow [SemVer](https://semver.org/) with major.minor.patch version numbers.

#### Patch Release Channel

This channel gives you access to the patch releases of Ballerina distributions that contain bug fixes and fixes for critical stability and security related issues. These releases are strictly time-bound and happen every two weeks. Occasionally,  you would see on-demand patch releases as well.

*Example patch releases: 1.0.6, 1.1.5, 1.1.10*

#### Minor Release Channel

This channel gives you access to feature releases of Ballerina distributions. Ballerina programs that you’ve written today should continue to work on these minor releases. There will be four minor releases a year. You will get access to a minor release on the 3rd Wednesday of the 3rd month of every quarter.

*Example minor releases: 1.1.0, 1.2.0, 1.3.0*

#### Release Maintenance

- We maintain a minor release 1.x.0 by issuing a series of patch releases 1.x.y. The maintenance of a particular minor release stops when there are two newer minor releases available.
- In other words, patch releases for 1.x.0 stop when jBallerina 1.(x+2).0 is released. E.g., when 1.2 is available, maintaining 1.0.0 will be stopped.

## Keeping Ballerina Upto Date

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

“distributions” is the directory where we maintain all your installed distributions.

### The 'active' Distribution

- One only distribution from the above list can be active at a given time.
- Ballerina tool delegates most of the user requests to the active distribution. The commands such as build, test, run, pull, and push are delegated to the active distribution, while the commands such as dist and version are handled by the tool itself.  E.g., when you invoke `ballerina build`, the Ballerina tool dispatches this request to the active distribution.
- You can change the active distribution at any time. Refer the [Change the active distribution](#change-the-active-distribution) section for more details.  

### The 'ballerina dist' Command

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

### Update to the Latest Patch Version

The `ballerina dist update` command updates your active distribution to the latest patch version.

E.g., If the active distribution in your environment is 1.1.0 and there exists the patch version 1.1.4 in our servers, this command will fetch and set it as the active distribution.

```sh
→ sudo ballerina dist update
Fetching the latest patch distribution for '1.0.4' from the remote server...
Fetching the '1.0.5' distribution from the remote server...
Downloading 1.0.5 100% [==========================================================] 96/96 MB
Successfully set the latest patch distribution '1.0.5' as the active distribution
```

### List Local and Remote Distributions

The `ballerina dist list` command lists the installed distributions in your local environment. It also lists the distributions available for you to download.

```sh
→ ballerina dist list
Distributions available locally:

  [1.0.5] jballerina version 1.0.5
* [1.1.0] jballerina version 1.1.0

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

  [slp1b1] Preview 1

Use 'ballerina help dist' for more information on specific commands.

```

The star (*) indicates the active distribution.

### Remove Distributions

The `ballerina dist remove <distribution>` command allows you to delete a particular distribution from your local environment. If you’ve been updating Ballerina regularly, you may have accumulated many unused distribution versions. This command helps you to clean them up.

```sh
→ ballerina dist remove 1.0.5
Distribution '1.0.5' successfully removed
```

### Change the Active Distribution

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

### Pull a Specific Distribution

The `ballerina dist pull <distribution>` command downloads a particular distribution and stores it in your local environment. It also sets the fetched distribution as the active distribution.

#### For jBallerina 1.2.5 and Above (for Update Tool Version 0.8.8 and Above):

```sh
→ sudo ballerina dist pull 1.2.6
Fetching the 'jballerina-1.2.6' distribution from the remote server...
Downloading jballerina-1.2.6 100% [==================================] 96/96 MB 'jballerina-1.2.6' successfully set as the active distribution
```

#### For Versions Below jBallerina 1.2.5 (for Update Tool Versions Below 0.8.8):

```sh
→ sudo ballerina dist pull jballerina-1.2.4
Fetching the 'jballerina-1.2.4' distribution from the remote server...
Downloading jballerina-1.2.4 100% [==================================] 96/96 MB 'jballerina-1.2.4' successfully set as the active distribution
```

### Update the Ballerina Tool

- The `ballerina update` command updates the Ballerina tool itself to the latest version. Ballerina tool versions are independent from distribution versions. We expect these tool updates to be rare compared to distribution releases.

```sh
→ ballerina update
Fetching the latest version from the remote server...
Downloading ballerina-command-0.8.1
Downloading ballerina-tool-0.8.1 100% [====================================] 1/1 MB

Updated to latest tool version: 0.8.1
Cleaning old files...
Ballerina tool updated successfully
```
