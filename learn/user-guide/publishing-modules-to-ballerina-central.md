---
layout: ballerina-left-nav-pages-swanlake
title: Publishing Packages to Ballerina Central
description: Learn how to use the CLI tool in the Ballerina programming language to push packages to Ballerina Central.
keywords: ballerina, programming language, ballerina central, ballerina packages
permalink: /learn/publishing-packages-to-ballerina-central/
active: publishing-packages-to-ballerina-central
intro: The sections below include information about publishing packages to Ballerina Central.
redirect_from:
  - /learn/how-to-publish-packages
  - /learn/how-to-publish-packages/
  - /learn/publishing-packages-to-ballerina-central
  - /swan-lake/learn/publishing-packages-to-ballerina-central/
  - /swan-lake/learn/publishing-packages-to-ballerina-central
---

## The CLI Command

Pushing a package uploads it to [Ballerina Central](https://central.ballerina.io/).

``` bash
$ cd myFirstPackage
$ bal push
```

## Setting Up

Before you push your package, you must enter your Ballerina Central access token in `Settings.toml` in your home repository (`<USER_HOME>/.ballerina/`).

To get your token, register on Ballerina Central and visit the user dashboard at [https://central.ballerina.io/dashboard](https://central.ballerina.io/dashboard).

If you are connected to the internet via an HTTP proxy, add the following section to `Settings.toml` and change accordingly.

```
[proxy]
host = "localhost"
port = "3128"
username = ""
password = ""
```

To successfully push your package, your package should contain `Package.md` file containing an overview of the package.

## Organizations

When you push a package to Ballerina Central, the runtime validates organizations for the user against the `org` defined in your package’s `Ballerina.toml` file. Therefore, when you have more than one organization in Ballerina Central, be sure to pick the organization name that you intend to push the package into and set that as the `org` in the `Ballerina.toml` file inside the package directory.
