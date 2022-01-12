---
layout: ballerina-configurable-left-nav-pages-swanlake 
title: Configure values in Kubernetes Environment 
description: In Kubernetes environments, the configuration TOML files can be used to configure values at deployment. 
keywords: ballerina, programming language, configurable, variables, kubernetes, pod 
permalink: /learn/configuring-ballerina-programs/configure-values-in-kubernetes-environment/ 
active: configure-values-in-kubernetes-environment 
intro: In Kubernetes environments, a pod can use the configuration TOML files to configure values at deployment. 

redirect_from:
- /learn/making-ballerina-programs-configurable/configure-values-in-kubernetes-environment
- /learn/configuring-ballerina-programs/configure-values-in-kubernetes-environment

---

## Configure values in Kubernetes Environment

In Kubernetes environment, a pod can use the configuration TOML file that contains the configuration values in the
following ways.

- as files in a data volume that is mounted on one or more of its containers
- as environment variables for the containers

### Securing sensitive data using configurable variables

Configuration values containing passwords or secrets should not be passed with the normal configuration.

Such sensitive data can be passed to runtime using a different TOML file, and we can prioritize it higher than the
normal configuration by prefixing the file path in the `BAL_CONFIG_FILES` environment variable.

The configuration of sensitive data can be handled at the deployment of the Ballerina program.

In a Kubernetes environment , a Kubernetes secret can be used to inject sensitive data to the containers. The TOML file
that contains the sensitive data can be stored as a secret resource in Kubernetes and can be placed in a volume mount
when running a pod. The file path can be specified via an environment variable as above.

<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
