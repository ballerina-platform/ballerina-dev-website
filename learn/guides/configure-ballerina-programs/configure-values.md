---
layout: ballerina-configurable-left-nav-pages-swanlake
title: Configure values 
description: Below are a few advanced usecases in which you configure values using configurable variables.
intro: Below are a few advanced usecases in which you configure values using configurable variables.
keywords: ballerina, programming language, configurable, variables, kubernetes, pod
permalink: /learn/configure-ballerina-programs/configure-values/
active: configure-values
redirect_from:
    - /learn/making-ballerina-programs-configurable/configuring-values-in-kubernetes-environment
    - /learn/configuring-ballerina-programs/configuring-values-in-kubernetes-environment
    - /learn/configuring-ballerina-programs/configuring-values-in-kubernetes-environment/
    - /learn/configure-ballerina-programs/configure-values-in-kubernetes-environment
    - /learn/guides/configuring-ballerina-programs/configuring-values-in-kubernetes-environment/
    - /learn/guides/configuring-ballerina-programs/configuring-values-in-kubernetes-environment
    - /learn/configure-ballerina-programs/configure-values
    - /learn/configure-ballerina-programs/provide-values-to-configurable-variables/#providing-module-information-of-the-configurable-variable/
    - /learn/configure-ballerina-programs/provide-values-to-configurable-variables/#providing-module-information-of-the-configurable-variable
---

## Configure in multiple modules

The configurable variables can be defined in different modules. Therefore, it is necessary to provide the information of the module in which the variable is defined.

The module information requirement can be explained in the following table according to the variable definition.
<br/>
<table width="100%">
<thead>
<tr>
<th style="text-align:center" colspan="2"><strong>Place where the variable is defined</strong></th>
<th style="text-align:center" colspan="2"><strong>Module information</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center"><strong>Package</strong></td>
<td style="text-align:center"><strong>Module</strong></td>
<td style="text-align:center"><strong>Organization name</strong></td>
<td style="text-align:center"><strong>Module Name</strong></td>
</tr>
<tr>
<td style="text-align:center">Root package</td>
<td style="text-align:center">Root module</td>
<td style="text-align:center">optional</td>
<td style="text-align:center">optional</td>
</tr>
<tr>
<td style="text-align:center">Root package</td>
<td style="text-align:center">Non-root module</td>
<td style="text-align:center">optional</td>
<td style="text-align:center">mandatory</td>
</tr>
<tr>
<td style="text-align:center">Non-root package</td>
<td style="text-align:center">Root/ Non-root module</td>
<td style="text-align:center">mandatory</td>
<td style="text-align:center">mandatory</td>
</tr>
</tbody>
</table>
<br/>

>**Note:** The module information is not needed for configuring single `bal` file execution.

The format of providing module information in each configuration syntax is described below.

#### Command line argument syntax

The key of a CLI parameter can be specified as,

```
-Ckey=value
```

The key can contain module information as follows.

```
key:= [[org-name .] module-name .] variable
```

#### TOML syntax

The following format is used to provide the module information of a variable in the TOML based configuration.

```toml
[org-name.module-name]
variable-name = "value"
```


## Configure in a Kubernetes environment

In the Kubernetes environment, a pod can use the configuration TOML file that contains the configuration values in the
following ways.

- as files in a data volume that is mounted on one or more of its containers
- as environment variables for the containers

## Configure sensitive values

Configuration values containing passwords or secrets should not be passed with the normal configuration.

Such sensitive data can be passed to runtime using a different TOML file, and we can prioritize it higher than the
normal configuration by prefixing the file path in the `BAL_CONFIG_FILES` environment variable.

The configuration of sensitive data can be handled at the deployment of the Ballerina program.

In a Kubernetes environment, a Kubernetes secret can be used to inject sensitive data into the containers. The TOML file
that contains the sensitive data can be stored as a secret resource in Kubernetes and can be placed in a volume mount
when running a pod. The file path can be specified via an environment variable as above.

<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
