---
layout: proxy-ballerina-central-with-maven-repository-left-nav-pages-swanlake
title: Proxy Ballerina Central with a Maven Repository
description: Organizations use repository managers such as Nexus or Artifactory to serve as a caching proxy for a remotely managed repository. The sections below include information about configuring such caching proxy for Ballerina Central.
keywords: ballerina, programming language, ballerina packages, proxy alternative, caching proxy, ballerina central proxy
permalink: /learn/proxy-ballerina-central-with-maven-repository/
active: publish-packages-to-ballerina-central
intro: Organizations use repository managers such as Nexus or Artifactory to serve as a caching proxy for a remotely managed repository. The sections below include information about configuring such caching proxy for Ballerina Central.
---

## Setting up the repository

The organization should have a repository manager hosted on-premises or in the cloud with the following requirements satisfied.

- Should support Maven repository format
- Should support caching proxy repositories
- Should support flexible MIME types

Both JFrog Artifactory and Sonatype Nexus have been tested and verified against the above requirements. The sections below describe how to configure each of them.

### Configure Sonatype Nexus

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

8. Copy the repository URL displayed on the repository list page. You will use it when configuring the Ballerina client.

### Configure JFrog Artifactory

Follow the steps below to configure a Maven remote repository in JFrog Artifactory that proxies Ballerina Central.

1. Log in to your Artifactory instance as an administrator.

2. Navigate to **Administration → Repositories** and click **Create a Repository**, then select **Remote**.

3. Select **Maven** as the package type.

4. Fill in the repository details.

   | Field | Value |
   | --- | --- |
   | **Repository Key** | A unique key for the repository (e.g., `ballerina-central-remote`) |
   | **URL** | `https://api.central.ballerina.io/2.0/maven` |

5. Under the **Advanced** tab, apply the following settings.

   - **Block Mismatching MIME Types** — Ensure this is **disabled**. Ballerina Central serves `.bala` artifacts that do not conform to standard Maven MIME types. Enabling this option will cause artifact retrieval to fail.

   - **Bypass HEAD Requests** — Ensure this is **enabled**. Ballerina Central does not fully support HTTP `HEAD` requests for all artifact paths. Enabling this bypass ensures that Artifactory falls back to a `GET` request when a `HEAD` request fails, preventing resolution errors.

   - **Metadata Retrieval Cache Period** — Set this to a low value such as `60` seconds. This controls how long Artifactory caches repository metadata before re-fetching it from the remote. A lower value ensures that newly published packages in Ballerina Central become available in your proxy repository sooner.

     > **Note:** Setting **Metadata Retrieval Cache Period** to `0` disables caching entirely and fetches metadata on every request, which may impact performance. A value between `60` and `300` seconds is a reasonable balance between freshness and performance.

6. Click **Save & Finish** to create the repository.

7. Copy the repository URL from the **Artifacts** view. You will use it when configuring the Ballerina client.

## Setting up the Ballerina client

You can configure only one proxy repository in the `<USER_HOME>/.ballerina/Settings.toml` file to use in place of Ballerina Central. A typical configuration looks like the following.

```toml
[[repository.maven]]
id = "<repository-id>"        # This ID is used when pushing/pulling packages
url = "<repository-url>"
username = "<username>/<userId>"
accesstoken = "<password>/<accesstoken>"
proxyCentral = true
```

Replace the placeholders as follows.

| Placeholder | Description |
| --- | --- |
| `<repository-id>` | A unique identifier for the repository entry (e.g., `nexus-ballerina-proxy` or `artifactory-ballerina-proxy`) |
| `<repository-url>` | The full URL of the proxy repository you created in Nexus or Artifactory |
| `<username>/<userId>` | Your Nexus or Artifactory username or user ID |
| `<password>/<accesstoken>` | Your Nexus or Artifactory password or access token |

Once the configuration is done, all Ballerina Central calls will be redirected through this Maven-based proxy repository.

> **Note:** Only one `[[repository.maven]]` entry with `proxyCentral = true` is allowed at a time. If multiple entries have `proxyCentral = true`, the Ballerina will return an error.
