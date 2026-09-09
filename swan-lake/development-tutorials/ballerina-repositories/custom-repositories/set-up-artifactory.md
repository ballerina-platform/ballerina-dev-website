---
layout: ballerina-set-up-artifactory-left-nav-pages-swanlake
title: JFrog Artifactory
description: Set up JFrog Artifactory as a private repository to host your own Ballerina packages, or as a caching proxy for Ballerina Central.
keywords: ballerina, programming language, ballerina packages, custom repository, maven repository, private packages, proxy alternative, caching proxy, ballerina central proxy, sbom, vulnerability scanning, jfrog artifactory, jfrog xray, sca
permalink: /learn/custom-repositories/set-up-artifactory/
active: set-up-artifactory
intro: Set up [JFrog Artifactory](https://jfrog.com/artifactory/) as a private repository to host your own Ballerina packages, or as a caching proxy for Ballerina Central.
---

## Configure a private repository

If you're using Artifactory to host your own private Ballerina packages, create it as a **Generic repository with a Maven layout** instead of a Maven-type repository, to support vulnerability scanning with JFrog Xray.

Follow the steps below to set up a Generic repository in Artifactory.

1. Create a local repository

   > **Click Create a Repository → Choose a Repository Type**

   ![Create a local repository in Artifactory](/learn/images/artifactory-repo-type.png "Create a local repository in Artifactory")

2. Select the Generic package type

   From the package type grid, select Generic.

   ![Select the Generic package type](/learn/images/artifactory-select-repository.png "Select the Generic package type")

3. Configure the repository key and layout

   Set the Repository Key (this becomes part of the repository's base URL), and set Repository Layout to `maven-2-default`.

   ![Set the repository key and Maven 2 layout](/learn/images/artifactory-create-repository.png "Set the repository key and Maven 2 layout")

4. Verify Xray indexing is enabled to enable vulnerability scanning

   Scroll down to the `JFrog Xray Integration` section and confirm that `Enable Indexing In Xray` is turned on, since Xray only scans repositories that are indexed. Then, click `Create Local Repository`.

   ![Enable indexing in Xray for the repository](/learn/images/xray-indexing.png "Enable indexing in Xray for the repository")

### Configure and use the repository

Define the repository in the `<USER_HOME>/.ballerina/Settings.toml` file, using the base URL you copied above.

```toml
[[repository.maven]]
id = "artifactory_1" # This ID is used when pushing/pulling packages
url = "https://<artifactory-host>/artifactory/<repository-key>"
username = "<username>"
accesstoken = "<access-token>"
```

Generate the Ballerina archive and publish it to the repository.

```
$ bal pack
$ bal push --repository artifactory_1
```

For more information on defining custom repositories, publishing packages, and using a published package as a dependency, see [Use custom repositories for package management](/learn/manage-dependencies/#use-custom-repositories-for-package-management).

### Scan packages in the repository for vulnerabilities

> **Note:** Only supported for a private repository set up as described above — not for a repository used to proxy Ballerina Central.

Starting from the Ballerina distribution `2201.13.6`, `bal pack` generates a [CycloneDX](https://cyclonedx.org/) Software Bill of Materials (SBOM) for the package, alongside the `.bala` file. `bal push` automatically publishes this SBOM alongside the bala as a raw file named `<package-name>-<version>.cdx.json`, at the same repository location the bala itself is deployed to. See [Publish a Ballerina package to the custom repository](/learn/manage-dependencies/#publish-a-ballerina-package-to-the-custom-repository) for the `bal push` steps.

If the repository was set up as a Generic repository with Xray indexing enabled (see above), Xray scans this published SBOM automatically and shows the security issues found, along with the software components listed in the SBOM.

![Xray scan results for a published SBOM](/learn/images/artifactory-xray-scan.png "Xray scan results for a published SBOM")

## Configure a proxy repository

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

7. Copy the repository URL from the **Artifacts** view. You will use it when [configuring the Ballerina client](/learn/manage-dependencies/#configure-the-ballerina-client-to-proxy-ballerina-central) to use the proxy.
