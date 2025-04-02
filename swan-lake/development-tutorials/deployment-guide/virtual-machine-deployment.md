---
layout: ballerina-cloud-left-nav-pages-swanlake
title: Virtual machine deployment
description: This guide explains how to deploy Ballerina services on virtual machines (VMs), offering a traditional server-based approach without containerization. It covers two deployment strategies, non-centralized and centralized.
keywords: ballerina, programming language, services, cloud, kubernetes, docker
active: ballerina-deployment-guideLines
intro: This guide explains how to deploy Ballerina services on virtual machines (VMs), offering a traditional server-based approach without containerization. It covers two deployment strategies, non-centralized and centralized.
---

## Non-centralized deployment

The non-centralized deployment offers a straightforward approach, ideal for simpler applications or when direct control over individual deployments is preferred. In this method, Ballerina artifacts are developed and published to a registry (a storage location for deployable components). The deployment process retrieves these artifacts and deploys them to the target environment, ensuring all necessary dependencies and configurations are included.

### Continuous Integration (CI)

Continuous Integration (CI) in non-centralized deployment streamlines development by automating the building, testing, and publishing of individual Ballerina artifacts, ensuring faster feedback and fewer integration issues.

The following steps outline the CI process of the non-centralized deployment:

1. Prepare the Server Environment by provisioning the VM or Bare Metal Server.
   - Ensure the server meets the hardware requirements for your application (CPU, memory, disk space, etc.).
   - Configure the server OS (Linux is recommended for production).

2. Install the Ballerina distribution from the [Ballerina Installation options.](https://ballerina.io/downloads/)

3. Install any other dependencies your Ballerina service might need (e.g., database drivers, libraries).

4. Implement the business logic in the Ballerina.

   > **Tip:** Organize the Project: Follow the standard Ballerina project structure, with a `Ballerina.toml` file and source organized in modules if needed. You can visit the [Organize Ballerina code](https://ballerina.io/learn/organize-ballerina-code/) for detailed information about packages and how you can manage the growth of your source code.

5. Build the Ballerina service. This command compiles the Ballerina application to produce the target artifacts. The default build command creates an executable `.jar` file in the `target/bin` directory.

   ```bash
   $ bal build
   ```

   > **Tip**: You can use GraalVM builds to compile Ballerina apps into native binaries, ensuring faster startup and lower memory usage compared to the JVM.
   >
   > ```bash
   > $ bal build --graalvm
   > ```
   >
   > See [Build the GraalVM executable](https://ballerina.io/learn/build-the-executable-locally/) for more information.

6. Publish the artifacts to the registry.

### Continuous Deployment (CD)

The Continuous Deployment (CD) process in a non-centralized setup involves automating the deployment of Ballerina artifacts to the target environment.  This typically involves using a deployment workflow or pipeline to retrieve the built artifacts from the registry, configure the target environment, deploy the application, and verify its successful deployment.

## Centralized deployment

While non-centralized deployment offers simplicity, managing numerous Ballerina artifacts and their dependencies can become complex.  It may also lead to increased resource consumption due to the separate deployment of each artifact.  Centralized deployment addresses these challenges by consolidating all Ballerina artifacts into a single, deployable package, offering a more streamlined and resource-efficient approach.  This strategy is well-suited for scenarios involving multiple Ballerina artifacts that need to be deployed together, or where a more efficient deployment process is desired.

The centralized deployment involves two primary repositories:

- **Source Repository (CI):** Manages Ballerina packages, builds them, and publishes them to Ballerina Central.

- **Deployment Repository (CD):** Consolidates packages from source repositories and deploys the application to the target environment.

### Source Repository

Typically, a single integration can consist of multiple components, each implemented as a separate Ballerina package. These components can represent distinct functionalities or services that collectively form the complete integration solution. By organizing the integration into multiple packages, the source repository ensures modularity, reusability, and easier maintenance. Each package can be developed, tested, and published independently, allowing teams to work on different components in parallel while maintaining a clear separation of concerns.

The continuous integration (CI) process of the centralized deployment is managed by the source repositories.

The following steps outline the CI process in a source repository:

1. Prepare the Server Environment by provisioning the VM or Bare Metal Server.
   - Ensure the server meets the hardware requirements for your application (CPU, memory, disk space, etc.).
   - Configure the server OS (Linux is recommended for production).

2. Install the Ballerina distribution from the [Ballerina Installation options.](/downloads/)

3. Install any other dependencies your Ballerina packages might need (e.g., database drivers, libraries).

4. Create a new Ballerina package.

   ```bash
   $ bal new --template lib <package-name>
   ```

5. Implement the business logic in the Ballerina package.

    > **Tip:**
    > - Utilize the [Ballerina HTTP default listener](/spec/http/#213-default-listener) to efficiently manage multiple HTTP services on a single port, reducing resource consumption.
    > - Follow the standard Ballerina project structure, with a `Ballerina.toml` file and source organized in modules if needed. Visit the [Organize Ballerina code](/learn/organize-ballerina-code/) for detailed information about packages and package management.

6. Generate the Ballerina archive.

    ```bash
    $ bal pack
    ```

7. Push the package to the Ballerina Central repository.

   ```bash
   $ bal push
   ```

   > **Tip**: Visit the [Publish Pacakages to Ballerina Central](/learn/publish-packages-to-ballerina-central/) for more information on how to publish packages to Ballerina Central.

### Continuous Deployment (CD) - Deployment Repository

The deployment repository serves as the central hub for managing and deploying Ballerina applications. It consolidates Ballerina packages from multiple source repositories, ensuring that all components required for the application are organized in one place. This repository streamlines the deployment process by orchestrating the integration of these packages and preparing them for deployment to the target environment. By centralizing deployment management, it simplifies configuration, enhances maintainability, and ensures consistency across environments.

The following steps outline the process of setting up a deployment repository for a Ballerina integration:

1. Prepare the Server Environment by provisioning the VM or Bare Metal Server.
   - Ensure the server meets the hardware requirements for your application (CPU, memory, disk space, etc.).
   - Configure the server OS (Linux is recommended for production).

2. Install the Ballerina distribution from the [Ballerina Installation options.](/downloads/)

3. Install any other dependencies your Ballerina packages might need (e.g., database drivers, libraries).

4. Install Ballerina consolidate packages tool

   ```
   $ bal tool pull consolidate-packages
   ```

5. Consolidate the Ballerina packages from the source repository to create the consolidated project.

   ```
   $ bal consolidate-packages new --package-path <consolidated-project-path> <comma-separated-list-of-package-names>
   ```

    > **Tip**: Visit the [Consolidate-packages tool](/learn/consolidate-packages-tool) for more information on how to consolidate Ballerina packages.

6. Build the consolidated project. This command creates an executable `.jar` file in the `target/bin` directory.

   ```
   $ bal build <consolidated-project-name>
   ```

   > **Tip**: You can use GraalVM builds to compile Ballerina apps into native binaries, ensuring faster startup and lower memory usage compared to the JVM.
   >
   > ```bash
   > $ bal build --graalvm
   > ```
   >
   > See [Build the GraalVM executable](/learn/build-the-executable-locally/) for more information.

The generated Ballerina artifact can be deployed to the target environment, configuring necessary environment variables and system settings.

## Ballerina GitHub Action for CI/CD integration

The [Ballerina GitHub](https://github.com/marketplace/actions/ballerina-action) action provides a seamless way to automate CI/CD workflows for Ballerina projects within GitHub. Refer to the following sample workflow file which demonstrates how to use the Ballerina GitHub action to build and push a Ballerina package to Ballerina Central.

```yaml
name: Ballerina publish example

on: [workflow_dispatch]

jobs:
  build:
    
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v1
    
      - name: Ballerina Build
        uses: ballerina-platform/ballerina-action@master
        with:
          args: 
            pack

      - name: Ballerina Push
        uses: ballerina-platform/ballerina-action@master
        with:
          args: 
            push 
        env: 
            BALLERINA_CENTRAL_ACCESS_TOKEN: ${{ secrets.BallerinaToken }}
```
