---
layout: ballerina-cli-documentation-left-nav-pages-swanlake
title: Update Tool
description: Learn how to maintain your Ballerina programming language installation and keep it up to date with the latest releases.
keywords: ballerina, programming language, release, update
permalink: /learn/build-and-run/update-tool/
active: update-tool
intro: This guide explains how to maintain your Ballerina installation up to date with the latest patch and minor releases.
redirect_from:
  - /learn/how-to-keep-ballerina-up-to-date
  - /learn/how-to-keep-ballerina-up-to-date/
  - /learn/keeping-ballerina-up-to-date/
  - /learn/keeping-ballerina-up-to-date
  - /swan-lake/learn/keeping-ballerina-up-to-date/
  - /swan-lake/learn/keeping-ballerina-up-to-date
  - /learn/tooling-guide/cli-tools/update-tool
  - /learn/tooling-guide/cli-tools/update-tool/
  - /learn/update-tool
---

## Understand Ballerina distributions 

The Ballerina compiler is a software program, which validates the Ballerina source code and translates it to an executable program. Ballerina has a stable and production-ready official compiler called jBallerina, which targets the JVM.

Also, there is a plan to develop a native compiler called nBallerina in the future, which will target platforms such as Linux, Windows, and macOS.

Ballerina distribution is a term, which refers to these jBallerina and nBallerina compilers.

## Get to know the release channels

Ballerina distributions are released via two different release channels at the moment. Swan Lake release channel is the primary release channel and the other one is the 1.x release channel. It is recommended to use Swan Lake release channel, if you are new to Ballerina.

Ballerina does not have a release channel yet for nightly builds that give you access to the latest perhaps unstable features.

### Patch releases

Patch releases of Ballerina distributions contain bug fixes and fixes for critical stability and security related issues. Occasionally, you would see on-demand patch releases for 2201.x.x.

*Example patch releases: 2201.3.4, 2201.4.1*

## Use the update tool

If you haven’t installed Ballerina yet, see [Install Ballerina](/learn/get-started) for the instructions.

Once the installation is complete, you would see the following directory structure inside the installation directory.

```sh
.
├── bin
│   └── bal
├── dependencies
│   ├── jdk-11.0.15+10-jre
│   └── jdk-11.0.18+10-jre
├── distributions
│   ├── ballerina-2201.5.0
│   ├── ballerina-2201.4.2
│   ├── ballerina-2201.4.0
│   ├── ballerina-2201.3.5
│   ├── jballerina-1.2.38
│   ├── ballerina-version
│   └── installer-version
├── lib
│   └── ballerina-command-1.3.13.jar
└── scripts
    ├── _bal
    └── bal_completion.bash
```

The `distributions` is the directory, in which all your installed distributions are maintained. Only one distribution from the above list can be active at a given time. 

> **Note:** The Ballerina Tool delegates most of the user requests to the active distribution. The commands such as `build`, `test`, `run`, `pull`, and `push` are delegated to the active distribution, while the commands such as `dist` and `version` are handled by the tool itself.
  
  E.g., when you invoke `bal build`, the Ballerina Tool dispatches this request to the active distribution.

You can [change this active distribution](#change-the-active-distribution) at any time or manage it using the Ballerina Tool. However, first, you need to update the Ballerina Tool to its latest version.

### Update the Ballerina tool

The `bal update` command updates the Ballerina Tool itself to the latest version. Ballerina Tool versions are independent of the Ballerina distribution versions. These tool updates are expected to be rare compared to distribution releases.

```
$ bal update
```

You view the output below.

```
Fetching the latest tool version from the remote server...
Downloading ballerina-command-1.3.15 100% [=====================================================================================================================================================================] 1/1 MB (0:00:01 / 0:00:00) 
Updating environment variables
Update tool version updated to the latest version: 1.3.15
Cleaning old files...
Update successfully completed

If you want to update the Ballerina distribution, use 'bal dist update'
```

## Manage your Ballerina distributions

After updating the Ballerina Tool, you can use the `bal dist` command to manage Ballerina distributions. The `bal help dist` output below shows all the details about the `bal dist` command.

```
$ bal help dist
```

You view the output below.

```
NAME
       bal dist - Manage Ballerina distributions

SYNOPSIS
       bal dist
       bal dist <command> [<-h> | <--help>]
       bal dist <command> <args>

DESCRIPTION
       Display details of all the commands that are available to install, update,
       and switch between Ballerina distributions from the patch and minor
       release channels.

OPTIONS
       -h, --help
           Print the usage details of all commands.

BALLERINA COMMANDS
       The below is a list of available subcommands:

       update     Update to the latest Ballerina version
       pull       Fetch a distribution and set it as the active version
       use        Set a distribution as the active distribution
       list       List locally and remotely available distributions
       remove     Remove distributions in your local environment

Use 'bal help dist <command>' for more information on a specific command.

EXAMPLES
       Manage Ballerina distributions.
          $ bal dist

       Print the usage details of all commands.
          $ bal dist --help

       Print the usage details of the `bal dist update` command.
          $ bal help dist update
```

Most of these subcommands are self-explanatory. Therefore, the sections below introduce them briefly.

### List all local and remote distributions

The `bal dist list` command lists the installed distributions in your local environment. It also lists the distributions available for you to download.

```
$ bal dist list
```

You view the output below.

```
Distributions available locally: 

* 2201.5.0
  2201.4.2
  2201.4.0
  2201.3.5
  1.2.38 

Distributions available remotely:

Swan Lake channel

* 2201.6.0 - latest
  2201.5.0
  2201.4.2
  2201.4.1
  2201.4.0
  2201.3.5
  2201.3.4
  2201.3.3
  2201.3.2
  2201.3.1

1.* channel

  1.2.40 - latest
  1.2.39
  1.2.38 
  1.2.37
  1.2.36
  1.2.35
  1.2.34
  1.2.33
  1.2.32
  1.2.31
  1.2.30

Use 'bal dist list -a' to list all the distributions under each channel.
Use 'bal help dist' for more information on specific commands.
```

> **Note:** The star (*) indicates the active distribution.

### Update to the latest version

The `bal dist update` command updates your distribution to the latest Ballerina version.

```
$ sudo bal dist update
```

You view the output below.

```
Fetching the latest distribution from the remote server...
Fetching the '2201.6.0' distribution from the remote server...
Downloading 2201.6.0 100% [================================================================================================================================================================================] 319/319 MB (0:01:21 / 0:00:00) 

Fetching the dependencies for '2201.6.0' from the remote server...
Dependency 'jdk-11.0.18+10-jre' is already available locally
Successfully set the distribution '2201.6.0' as the active distribution
```

### Pull a specific distribution

The `bal dist pull <distribution>` command downloads a particular distribution and stores it in your local environment. It also sets the fetched distribution as the active distribution.

```
$ bal dist pull 2201.4.1
```

You view the output below.

```
Fetching the '2201.4.1' distribution from the remote server...
Downloading 2201.4.1 100% [================================================================================================================================================================================] 287/287 MB (0:01:26 / 0:00:00) 
  
Fetching the dependencies for '2201.4.1' from the remote server...
Dependency 'jdk-11.0.15+10-jre' is already available locally
'2201.4.1' successfully set as the active distribution
```

### Change the active distribution

The `bal dist use <distribution>` command sets a particular distribution version as the active one.

```
$ bal dist use 2201.4.2
```

You view the output below.

```
2201.4.2 successfully set as the active distribution
```

### Remove a distribution

The `bal dist remove <distribution>` command allows you to delete a particular distribution from your local environment. If you have been updating Ballerina regularly, you may have accumulated many unused distribution versions. This command helps you to clean them up.

```
$ bal dist remove 2201.4.0
```

You view the output below.

```
Distribution '2201.4.0' successfully removed
```