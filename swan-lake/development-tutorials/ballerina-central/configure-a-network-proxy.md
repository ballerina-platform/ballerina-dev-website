---
layout: ballerina-configure-a-network-proxy-left-nav-pages-swanlake
title: Configure a network proxy
description: In corporate environments, direct HTTP internet access is often restricted, with a preference for routing traffic through proxies. The following section provides a detailed guide on configuring your system to ensure access to Ballerina Central, even when working behind a proxy.
keywords: ballerina, programming language, ballerina packages, network proxy
permalink: /learn/configure-a-network-proxy/
active: configure-a-network-proxy
intro: In corporate environments, direct HTTP internet access is often restricted, with a preference for routing traffic through proxy servers. The following section provides a detailed guide on configuring your system to ensure access to Ballerina Central, even when working behind a proxy.
---

## Configure proxy settings

If you are connected to the internet via an HTTP proxy, you need to configure it in the `<USER_HOME>/.ballerina/Settings.toml` file to carry out operations related to the Ballerina Central such as publishing a package, pulling a package, and resolving packages. Below is the TOML syntax for the proxy settings.

```toml
[proxy]
host = "HOST_NAME"
port = PORT
username = "PROXY_USERNAME"
password = "PROXY_PASSWORD"
```

If your proxy does not require any credentials, keep `username` and `password` fields empty as shown below.

```toml
[proxy]
host = "HOST_NAME"
port = PORT
username = ""
password = ""
```

## Add necessary certificates to the truststore

If you encounter any certificate-related issues such as the one below when connecting via a proxy:

> PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target.

 follow the steps below to trust the certificates associated with the proxy.

1) Navigate to the `dependencies/` folder in the Ballerina installation directory. Here, you should notice one or more Java Runtime Environment (JRE) instances.
2) Identify the certificates associated with the proxy. This information is typically found in the documentation provided by your proxy vendor.
3) Execute the below command in a command line with administrative privileges.

    ```
    <BALLERINA_JRE>/bin/keytool.exe -import -trustcacerts -file <CERTS_PATH> -alias <ALIAS_NAME> -keystore <BALLERINA_JRE>/lib/security/cacerts
    ```
> **Note:** If you are using multiple Ballerina distributions, you may need to follow the above steps to all the JRE instances individually for each distribution.

## Configure proxy settings via environment variables

Proxy settings can also be configured via environment variables. This is useful when you want to configure the proxy settings for all the Ballerina distributions in your system.
Following are the environment variables that can be used to configure the proxy settings.

```
BALLERINA_CA_BUNDLE # Path to the CA bundle file
BALLERINA_CA_PASSWORD # Password for the CA bundle file
BALLERINA_CA_CERT # Path to the CA certificate file
```

## Domain access 

Following domains should be accessible from the network to work with Ballerina.

1) Ballerina Central API - `https://api.central.ballerina.io/`
2) Ballerina Central File Server - `https://fileserver.central.ballerina.io/`
3) Maven Central Repository - `https://repo.maven.apache.org/maven2`
4) Docker Hub (For Docker Image Pull) - `https://hub.docker.com/u/ballerina` 
5) Alpine Linux Repository (For Docker Image Updates) - `http://dl-cdn.alpinelinux.org/`


