---
layout: ballerina-publishing-to-central-left-nav-pages-swanlake
title: Configure proxy
description: Below section describes how to configure proxy for accessing Ballerina Central, or custom repositories
keywords: ballerina, programming language, configuring proxy, proxy, set-up proxy
permalink: /learn/configure-proxy/
active: configure-proxy
intro: Below section describes how to configure proxy for accessing Ballerina Central, or custom repositories
---

## Configure proxy

If you are connected to the internet via an HTTP proxy, you need to configure it in the `Settings.toml` file to carry out the Ballerina Central related operations such as publishing a package, pulling a package or resolving packages. Add the following section to `Settings.toml` and change accordingly.

```toml
[proxy]
host = "localhost"
port = 3128
username = "solomon"
password = "confidential"
```

If your proxy does not require any credentials, keep username, password fields as empty as below.

```toml
[proxy]
host = "localhost"
port = 3128
username = ""
password = ""
```

## [Optional] Add necessary certificates to truststore

If you encounter any certificate related issues as shown below while connecting via proxy

> PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target.

Follow the below steps to trust the certificates provided by the proxy,

1) Navigate to the `dependencies` folder within the Ballerina installation directory. At this point you should be able to see one or more `Java Runtime Environment(JRE)` instances.
2) Next, we need to find certificates provided by proxy. For that, you may need to check your proxy vendors documentation.
3) Execute the below command in an adminstrative privileged command-line.

    ```
    <BALLERINA_JRE>/bin/keytool.exe -import -trustcacerts -file <CERTS_PATH> -alias <ALIAS_NAME> -keystore <BALLERINA_JRE>/lib/security/cacerts
    ```

> **Note:** You may need to follow above steps to all the `Java Runtime Environment(JRE)` instances.