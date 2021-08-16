---
layout: ballerina-guides-left-nav-pages-swanlake
title: Defining Configurable Variables
description: Ballerina supports configurability through the configurable, module-level variables.
keywords: ballerina, programming language, configurable, variables, 
permalink: /learn/making-ballerina-programs-configurable/defining-configurable-variables/
active: defining-configurable-variables
intro: Ballerina supports configurability through the configurable, module-level variables.
redirect_from:
- /learn/user-guide/configurability/defining-configurable-variables
- /learn/user-guide/configurability/defining-configurable-variables/
- /learn/user-guide/configurability/
- /learn/user-guide/configurability
- /learn/making-ballerina-programs-configurable/
- /learn/making-ballerina-programs-configurable
- /learn/making-ballerina-programs-configurable/defining-configurable-variables
---

## Initialising Configurable Variables

The `configurable` keyword is used to declare a configurable variable. The initialization of configurable variables can be done in the ways below.

1. A configurable variable that is defined with `?` as the initializer expression mandates a value to be specified through the configuration. 

    ```ballerina
    configurable string host = ?;
    ```

2. If a configurable variable is defined with any other initializer expression, the configuration of that variable is optional. The value provided in the initializer can be overridden by a value specified through the configuration. 

    ```ballerina
    configurable string host = “0.0.0.0”;
    ```

The values of configurable variables would always be a subtype of `anydata`. A configurable variable is implicitly `final` and cannot be assigned outside the declaration. The static type of the configurable variable is implicitly `readonly`. Therefore, it can always be referenced within an isolated function.

## Providing Values to Configurable Variables

Ballerina supports providing the values for configurable variables through configuration files, command-line arguments, and environment variables. The precedence order for retrieving configurable values is as follows.

>**Tip:** For more information on the methods below, see [Providing Values to Configurable Variables](/learn/user-guide/configurability/providing-values-to-configurable-variables/).

### Using Command-Line Arguments

The module information of the configurable variable can be provided with command-line argument. For more information, see [Providing Configurable Values Through Command-Line Arguments](/learn/user-guide/configurability/providing-values-to-configurable-variables/#providing-values-through-command-line-arguments).

### Using Configuration Files

The values can be provided through configuration files in the [TOML(v0.4) format](https://toml.io/en/v0.4.0). The file location can be set through an environment variable with the name `BAL_CONFIG_FILES`. It is possible to specify multiple configuration files using the OS-specific separator. The file precedence order will be as specified in the environment variable. If an environment variable is not specified, it is located in the current working  directory with the file name `Config.toml`.

### Using Environment Variables

The values can be provided through an environment variable with the name `BAL_CONFIG_DATA` in which the content is expected to be in the [TOML(v0.4) format](https://toml.io/en/v0.4.0). 

## Securing Sensitive Data Using Configurable Variables

Configuration values containing passwords or secrets should not be passed with the normal configuration.
Such sensitive data can be passed to runtime using a different TOML file, and you can prioritize it higher than the normal configuration by prefixing the file path in the `BAL_CONFIG_FILES` environment variable.
The configuration of sensitive data can be handled at the deployment of the Ballerina program.

For example, in a Kubernetes environment, a Kubernetes secret can be used with a pod as files in a volume mounted on one or more of its containers or as container environment variables. The TOML file, which contains the sensitive data can be stored as a secret resource in Kubernetes and can be placed in a volume mount when running a pod. The file path can be specified via an [environment variable](#using-environment-variables).

## Trying it Out

For example on defining configurable variables in a Ballerina program, see [Trying it Out](/learn/user-guide/configurability/trying-it-out/).
