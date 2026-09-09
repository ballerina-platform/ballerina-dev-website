---
layout: ballerina-set-up-nexus-left-nav-pages-swanlake
title: Sonatype Nexus
description: Set up Sonatype Nexus as a private repository to host your own Ballerina packages, or as a caching proxy for Ballerina Central.
keywords: ballerina, programming language, ballerina packages, custom repository, maven repository, private packages, proxy alternative, caching proxy, ballerina central proxy, sonatype nexus
permalink: /learn/custom-repositories/set-up-nexus/
active: set-up-nexus
intro: Set up [Sonatype Nexus](https://www.sonatype.com/products/sonatype-nexus-repository) as a private repository to host your own Ballerina packages, or as a caching proxy for Ballerina Central.
---

## Set up a private repository

To host your own private Ballerina packages, create a standard Maven-type (hosted) repository following the [Nexus documentation](https://www.sonatype.com/products/sonatype-nexus-repository).

### Configure and use the repository

Define the repository in the `<USER_HOME>/.ballerina/Settings.toml` file, using the URL you copied above.

```toml
[[repository.maven]]
id = "nexus_1" # This ID is used when pushing/pulling packages
url = "<repository-url>"
username = "<username>"
accesstoken = "<password>"
```

Generate the Ballerina archive and publish it to the repository.

```
$ bal pack
$ bal push --repository nexus_1
```

For more information on defining custom repositories, publishing packages, and using a published package as a dependency, see [Use custom repositories for package management](/learn/manage-dependencies/#use-custom-repositories-for-package-management).

## Configure a proxy repository

Follow the steps below to configure a Maven proxy repository in Sonatype Nexus that points to Ballerina Central.

1. Log in to your Nexus Repository Manager as an administrator.

2. Navigate to **Settings → Repository → Repositories** and click **Create repository**.

3. Select **maven2 (proxy)** as the recipe.

4. Fill in the repository details.

   | Field | Value |
   | --- | --- |
   | **Name** | A unique name for the repository (e.g., `ballerina-central-proxy`) |
   | **Remote storage** | `https://api.central.ballerina.io/2.0/maven` |

5. Under the **Maven 2** section, ensure **Strict Content Type Validation** is **disabled** (unchecked). Ballerina Central serves `.bala` package artifacts alongside customized Maven metadata, and enabling strict content type validation will cause downloads to fail for non-standard MIME types.

6. Under the **Proxy** section, set **Maximum metadata age** to a low value such as `1` minute. This ensures that newly published packages in Ballerina Central are discovered promptly without waiting for a long metadata cache expiry.

   > **Note:** Setting **Maximum metadata age** to `0` forces Nexus to re-fetch metadata on every request, which may increase latency. A value between `1` and `5` minutes is a good balance between freshness and performance.

7. Click **Create repository** to save the configuration.

8. Copy the repository URL displayed on the repository list page. You will use it when [configuring the Ballerina client](/learn/manage-dependencies/#configure-the-ballerina-client-to-proxy-ballerina-central) to use the proxy.
