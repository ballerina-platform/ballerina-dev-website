---
layout: ballerina-left-nav-pages-swanlake
title: Keeping Ballerina Up to Date
description: Learn how to maintain your Ballerina programming language installation and keep it up to date with the latest releases.
keywords: ballerina, programming language, release, update
permalink: /swan-lake/learn/keeping-ballerina-up-to-date/
active: keeping-ballerina-up-to-date
intro: This guide explains how to maintain your Ballerina installation up to date with the latest patch and minor releases.
redirect_from:
  - /swan-lake/learn/how-to-keep-ballerina-up-to-date
  - /swan-lake/learn/how-to-keep-ballerina-up-to-date/
  - /swan-lake/learn/keeping-ballerina-up-to-date
---

### Understanding Ballerina Distributions 

The Ballerina compiler is a software program, which validates the Ballerina source code and translates it to an executable program. Ballerina has a stable and production-ready official compiler called jBallerina, which targets the JVM.

Also, there is a plan to develop a native compiler called nBallerina in the future, which will target platforms such as Linux, Windows and Mac OS.

Ballerina distribution is a term, which refers to these jBallerina and nBallerina compilers.

### Getting to know the Release Channels

Ballerina distributions are released via two different release channels at the moment. One is the stable 1.x release channel and the other one is the Swan Lake release channel.

Ballerina yet does not have a release channel for nightly builds that give you access to the latest perhaps unstable features.

#### Versioning of the releases

Currently, the 1.x channel of the Ballerina distribution releases strictly follows [SemVer](https://semver.org/) with `major.minor.patch` version numbers.

#### Patch Releases

Patch releases of Ballerina distributions contain bug fixes and fixes for critical stability and security related issues. Occasionally,  you would see on-demand patch releases as well.

*Example patch releases: 1.0.6, 1.1.5, 1.1.10*

#### Minor Releases

These are feature releases of Ballerina distributions. Ballerina programs that you’ve written today should continue to work on these minor releases. There will be four minor releases a year. You will get access to a minor release on the 3rd Wednesday of the 3rd month of every quarter.

*Example minor releases: 1.1.0, 1.2.0, 1.3.0*

#### Release Maintenance

In the 1.x stable release channel, a minor release 1.x.0 is manitained by issuing a series of patch releases as 1.x.y. The maintenance of a particular minor release stops when there are two newer minor releases available.

In other words, patch releases for 1.x.0 stop when jBallerina 1.(x+2).0 is released. E.g., when 1.2 is available, maintaining 1.0.0 will be stopped.

## Installing Ballerina

If you haven’t installed Ballerina yet, see [Installing Ballerina](/swan-lake/learn/installing-ballerina/) for the instructions.

Once the installation is complete, you would see the directory structure below inside the installation directory.

```sh
.
├── bin
│   └── ballerina
├── dependencies
│   └── jdk8u202-b08-jre
├── distributions
│   ├── ballerina-slp4
│   ├── jballerina-1.1.0
│   ├── jballerina-1.2.8
│   └── ballerina-version
└── lib
    └── ballerina-command-0.8.8.jar
```

The `distributions` is the directory, in which all your installed distributions are maintained. Only one distribution from the above list can be active at a given time. 

> **Note:** The Ballerina tool delegates most of the user requests to the active distribution. The commands such as build, test, run, pull, and push are delegated to the active distribution, while the commands such as dist and version are handled by the tool itself.  
  
  E.g., when you invoke `ballerina build`, the Ballerina tool dispatches this request to the active distribution.

You can [change this active distribution](#changing-the-active-distribution) at any time or manage it using the Ballerina Tool. However, first, you need to update the Ballerina Tool to its latest version.

### Updating the Ballerina Tool

The `ballerina update` command updates the Ballerina Tool itself to the latest version. Ballerina Tool versions are independent from the Ballerina distribution versions. These tool updates are expected to be rare compared to distribution releases.

```sh
→ ballerina update
Fetching the latest version from the remote server...
Downloading ballerina-command-0.8.8
Downloading ballerina-tool-0.8.8 100% [====================================] 1/1 MB

Updated to latest tool version: 0.8.8
Cleaning old files...
Ballerina tool updated successfully
```

## Managing your Ballerina Distributions

After updating the Ballerina Tool, you can use the `ballerina dist` command of it to manage Ballerina distributions. The `ballerina help dist` output below shows all the details about the `ballerina dist` command.

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

Most of these subcommands are self-explanatory. Therefore, the sections below introduce them briefly.

### Listing All Local and Remote Distributions

The `ballerina dist list` command lists the installed distributions in your local environment. It also lists the distributions available for you to download.

```sh
→ ballerina dist list
Distributions available locally:

  [1.1.0] jballerina version 1.1.0
  [1.2.5] jballerina version 1.2.5
* [1.2.8] jballerina version 1.2.8
  [slp3] ballerina version slp3

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
  [1.2.5] jballerina version 1.2.5
  [1.2.6] jballerina version 1.2.6
  [1.2.7] jballerina version 1.2.7
  [1.2.8] jballerina version 1.2.8

Swan Lake channel

  [slp1] Preview 1
  [slp2] Preview 2
  [slp3] Preview 3
  [slp4] Preview 4

Use 'ballerina help dist' for more information on specific commands.

```

> **Note:** The star (*) indicates the active distribution.

### Removing a Distribution

The `ballerina dist remove <distribution>` command allows you to delete a particular distribution from your local environment. If you’ve been updating Ballerina regularly, you may have accumulated many unused distribution versions. This command helps you to clean them up.

```sh
→ ballerina dist remove 1.2.5
Distribution '1.2.5' successfully removed
```

### Updating to the Latest Preview/Patch Version

The `ballerina dist update` command updates your active distribution to the latest patch version.

E.g., If the active distribution in your environment is `1.2.7` and there exists the patch version `1.2.8` in our servers, this command will fetch and set it as the active distribution.

```sh
→ sudo ballerina dist update
Fetching the latest patch distribution for 'jballerina-1.2.8' from the remote server...
Fetching the '1.2.8' distribution from the remote server...
Downloading 1.2.8 100% [==========================================================] 96/96 MB
Successfully set the latest patch distribution '1.2.8' as the active distribution
```

>**Note:** If If the active distribution in your environment is `1.2.7`, it will bump to the next Swan Lake Preview version, which is `1.2.8` and will update to it.

### Pulling a Specific Distribution

The `ballerina dist pull <distribution>` command downloads a particular distribution and stores it in your local environment. It also sets the fetched distribution as the active distribution.

```sh
→ ballerina dist pull 1.2.5
Fetching the '1.2.5' distribution from the remote server...
Downloading 1.2.5 100% [=====================================================================================] 236/236 MB (0:03:33 / 0:00:00)

Fetching the dependencies for '1.2.5' from the remote server...
Dependency 'jdk8u202-b08-jre' is already available locally
'1.2.5' successfully set as the active distribution
```

### Changing the Active Distribution

The `ballerina dist use <distribution>` command sets a particular distribution version as the active one.  See the following workflow.

```sh
→ ballerina dist use 1.2.5
'1.2.5' is the current active distribution version
```

