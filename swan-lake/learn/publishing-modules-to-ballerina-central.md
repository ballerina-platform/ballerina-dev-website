---
layout: ballerina-left-nav-pages-swanlake
title: Publishing Modules to Ballerina Central
description: Learn how to use the CLI tool in the Ballerina programming language to push modules to Ballerina Central.
keywords: ballerina, programming language, ballerina central, ballerina modules
permalink: /swan-lake/learn/publishing-modules-to-ballerina-central/
active: publishing-modules-to-ballerina-central
intro: The sections below include information about publishing modules to Ballerina Central.
redirect_from:
  - /swan-lake/learn/how-to-publish-modules
  - /swan-lake/learn/how-to-publish-modules/
  - /swan-lake/learn/publishing-modules-to-ballerina-central
---

## The CLI Command

Pushing a module uploads it to [Ballerina Central](https://central.ballerina.io/).

```
ballerina push <module-name>
```

## Setting Up

Before you push your module, you must enter your Ballerina Central access token in `Settings.toml` in your home repository (`<USER_HOME>/.ballerina/`).

To get your token, register on Ballerina Central and visit the user dashboard at [https://central.ballerina.io/dashboard](https://central.ballerina.io/dashboard).

If you are connected to the internet via an HTTP proxy, add the following section to `Settings.toml` and change accordingly.

```
[proxy]
host = "localhost"
port = "3128"
username = ""
password = ""
```

## Organizations

When you push a module to Ballerina Central, the runtime validates organizations for the user against the org-name defined in your module’s `Ballerina.toml` file. Therefore, when you have more than one organization in Ballerina Central, be sure to pick the organization name that you intend to push the module into and set that as the `org-name` in the `Ballerina.toml` file inside the project directory.
