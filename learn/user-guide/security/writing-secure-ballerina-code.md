---
layout: ballerina-left-nav-pages-swanlake
title: Writing Secure Ballerina Code
description: Check out the different security features and controls available within the Ballerina programming language and follow the guidelines on writing secure Ballerina programs.
keywords: ballerina, programming language, security, secure ballerina code
permalink: /learn/user-guide/security/writing-secure-ballerina-code/
active: writing-secure-ballerina-code
intro: The sections below include information on the different security features and controls available within Ballerina. Also, they provide guidelines on writing secure Ballerina programs.
redirect_from:
  - /learn/how-to-write-secure-ballerina-code
  - /learn/how-to-write-secure-ballerina-code/
  - /learn/writing-secure-ballerina-code/
  - /learn/writing-secure-ballerina-code
  - /learn/security/writing-secure-ballerina-code
  - /learn/security/
  - /learn/security
  - /swan-lake/learn/security/writing-secure-ballerina-code/
  - /swan-lake/learn/security/writing-secure-ballerina-code
  - /learn/security/writing-secure-ballerina-code/
  - /learn/security/writing-secure-ballerina-code
  - /learn/user-guide/security/writing-secure-ballerina-code
  - /learn/user-guide/security/
  - /learn/user-guide/security
---

## Securing Sensitive Data using Configurable Variables

A Ballerina runtime can be configured using configurable variables.
For more details, see [Configurable BBE](/learn/by-example/configurable.html).

Configuration values containing passwords or secrets should not be passed with the normal configuration.

Such sensitive data can be passed to runtime using a different TOML file, and you can prioritize it higher than the
normal configuration by prefixing the file path in the `BAL_CONFIG_FILES` environment variable.

The configuration of sensitive data can be handled at the deployment of the Ballerina program.

Consider a Kubernetes environment as an example.

A Kubernetes secret can be used with a pod as files in a volume mounted on one or more of its containers or as 
container environment variables. The TOML file that contains the sensitive data can be stored as a secret resource in 
Kubernetes and can be placed in a volume mount when running a pod. The file path can be specified via an environment 
variable as above.
