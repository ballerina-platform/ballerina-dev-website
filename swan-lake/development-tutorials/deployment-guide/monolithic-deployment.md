---
layout: ballerina-cloud-left-nav-pages-swanlake
title: Monolithic deployment
description: This guide explains how to deploy Ballerina services on virtual machines (VMs), offering a traditional server-based approach without containerization. It covers two deployment strategies, decentralized and centralized.
keywords: ballerina, programming language, services, cloud, kubernetes, docker
active: ballerina-deployment-guideLines
intro: This guide explains how to deploy Ballerina services on virtual machines (VMs), offering a traditional server-based approach without containerization. It covers two deployment strategies, decentralized and centralized.
---


## Centralized deployment

Managing a large number of Ballerina artifacts and their dependencies across different environments can become increasingly complex and difficult to maintain over time. It may also lead to increased resource consumption due to the separate deployment of each artifact. Centralized deployment addresses these challenges by consolidating all Ballerina artifacts into a single, deployable package, offering a more streamlined and resource-efficient approach.  This strategy is well-suited for scenarios involving multiple Ballerina artifacts that need to be deployed together, or where a more efficient deployment process is desired.

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

3. Install any other dependencies your Ballerina application might need (e.g., database drivers, libraries).

4. Create a new Ballerina package.

   ```bash
   $ bal new --template lib <package-name>
   ```

5. Implement the business logic in the Ballerina package.

    > **Tip:**
    > - Utilize the [Ballerina HTTP default listener](/spec/http/#213-default-listener) to efficiently manage multiple HTTP services on a single port, reducing resource consumption.
    > - Follow the standard Ballerina project structure, with a `Ballerina.toml` file and source organized in modules if needed. Visit the [Organize Ballerina code](/learn/organize-ballerina-code/) for detailed information about packages and package management.

6. Add tests to the created package.

   > **Tip:** You can use the [Ballerina test framework](/learn/test-ballerina-code/write-tests/) to write and run tests for your Ballerina packages. The Ballerina test framework provides a simple way to write unit tests, integration tests, and end-to-end tests for your Ballerina code.

7. Generate the Ballerina archive.

    ```bash
    $ bal pack
    ```

8. Push the package to the Ballerina Central repository.

   ```bash
   $ bal push
   ```

   > **Tip**: Visit the [Publish Pacakages to Ballerina Central](/learn/publish-packages-to-ballerina-central/) for more information on how to publish packages to Ballerina Central.

> **Tip**: The above steps of the CI process can be automated using the [Ballerina GitHub action](/learn/monolithic-deployment/#ballerina-github-action-for-cicd-integration).

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

6. Add integration tests to the consolidated project.

   > **Tip:** You can use the [Ballerina test framework](/learn/test-ballerina-code/write-tests/) to write and run tests for your Ballerina packages. The Ballerina test framework provides a simple way to write unit tests, integration tests, and end-to-end tests for your Ballerina code.

7. Build the consolidated project. This command creates an executable `.jar` file in the `target/bin` directory.

   ```
   $ bal build <consolidated-project-name>
   ```

   > **Tip**: You can use GraalVM builds to compile Ballerina apps into native binaries, ensuring faster startup and lower memory usage compared to the JVM.
   >
   > ```bash
   > $ bal build --graalvm <consolidated-project-name>  
   > ```
   >
   > See [Build the GraalVM executable](/learn/build-the-executable-locally/) for more information.

The generated Ballerina artifact can be deployed to the target environment, configuring necessary environment variables and system settings.

> **Tip**: The above steps of the CD process can be automated using the [Ballerina GitHub action](/learn/monolithic-deployment/#ballerina-github-action-for-cicd-integration).

#### Hot deployment

Hot deployments refer to the process of updating or redeploying software components with zero downtime and maintaining high availability in production systems.

Here the hot deployment strategy works by orchestrating multiple service instances through a NGINX load balancer, allowing you to update and restart services without interrupting user traffic. The load balancer automatically routes requests away from instances undergoing updates and back to them once they are healthy again.

**1. Active-Active** 

   All instances actively serve traffic simultaneously. NGINX uses passive health monitoring through `max_fails` and `fail_timeout` directives. When an instance fails to respond successfully `max_fails` times within the `fail_timeout` window, NGINX temporarily removes it from the load balancing pool.

   This passive approach relies on actual client requests to detect server failures, meaning the load balancer only discovers problems when real traffic encounters them. Passive monitoring is reactive and depends on the natural flow of requests to identify unhealthy servers. The default load balancing method is `round-robin`, distributing requests evenly across all available servers, though this can be changed to other algorithms like `least connections` or `IP hash` based on application requirements.

   Failed requests are automatically retried on other available instances, as a fault tolerance mechanism.

   **NGINX configuration**

   ```nginx
   events {}

   http {
      upstream backend {
         server 127.0.0.1 max_fails=3 fail_timeout=30s;
         server 127.0.0.2 max_fails=3 fail_timeout=30s;
      }

      server {
         location / {
               proxy_pass http://backend;
         }
      }
   }
   ```

**2. Active-Active (with health checks)** 

   This configuration requires NGINX Plus, which supports active health checks. NGINX proactively polls a specified health endpoint (e.g., /health) on each instance to determine availability.

   Unlike passive health checks that only detect failures when client requests fail, active health checks continuously monitor server health in the background, providing faster failure detection and more reliable service availability. This proactive approach allows NGINX to remove unhealthy servers from the pool before they impact user requests, significantly reducing the mean time to detection and improving overall system reliability.

   **NGINX configuration**

   ```nginx
   events {}

   http {
      upstream backend {
         server 127.0.0.1 max_fails=3 fail_timeout=30s;
         server 127.0.0.2 max_fails=3 fail_timeout=30s;
      }

      server {
         listen 80;
         location / {
               proxy_pass http://backend;
               health_check uri=/health interval=5s;
         }
      }
   }
   ```

**3. Active-Passive** 

   Primary server handles all traffic, backup only activates on failure. The backup server remains idle until the primary fails, ensuring you always have a failover target.

   When the primary server fails to send a response, the load balancer immediately redirects the request to backup server. This failover process is automatic and transparent to the client, occurring within milliseconds of detecting the failure. The backup server must be pre-configured with identical application code and dependencies.

   Nginx tracks failed requests against `max_fails` threshold and after reaching threshold, server is marked as unavailable for `fail_timeout` duration. And then keep sending request to one of the backup servers. Once a server is marked as unavailable, Nginx will not attempt to send requests to it until the `fail_timeout` period expires, ensuring that the backup server handles all incoming traffic consistently. If multiple backup servers are configured, Nginx will select the first available backup server in the order they are defined, maintaining the single-active-server principle of active-passive architecture.

   After `fail_timeout` period, Nginx attempts to route traffic back to primary server. If successful, primary server resumes active role and backup servers return to standby mode. This recovery process is gradual and intelligent - Nginx sends a small number of test requests to the recovered primary server before fully transitioning traffic back. If the primary server successfully handles these test requests without errors, it regains its active status and the backup server automatically transitions back to standby mode. However, if the primary server continues to fail during the recovery attempt, it remains marked as unavailable for another fail_timeout period, and the backup server continues to handle all traffic until the next recovery cycle.

   **NGINX Configuration**

   ```nginx
   events {}

   http {
      upstream backend {
         server 127.0.0.1 max_fails=3 fail_timeout=30s;
         server 127.0.0.2 max_fails=3 fail_timeout=30s;
      }

      server {
         listen 80;

         location / {
               proxy_pass http://backend;
         }
      }
   }
   ```

## Decentralized deployment

The decentralized deployment offers a straightforward approach, ideal for simpler applications or when direct control over individual deployments is preferred. In this method, Ballerina artifacts are developed and published to a registry (a storage location for deployable components). The deployment process retrieves these artifacts and deploys them to the target environment, ensuring all necessary dependencies and configurations are included.

### Continuous Integration (CI)

Continuous Integration (CI) in decentralized deployment streamlines development by automating the building, testing, and publishing of individual Ballerina artifacts, ensuring faster feedback and fewer integration issues.

The following steps outline the CI process of the decentralized deployment:

1. Prepare the Server Environment by provisioning the VM or Bare Metal Server.
   - Ensure the server meets the hardware requirements for your application (CPU, memory, disk space, etc.).
   - Configure the server OS (Linux is recommended for production).

2. Install the Ballerina distribution from the [Ballerina Installation options.](https://ballerina.io/downloads/)

3. Install any other dependencies your Ballerina integration might need (e.g., database drivers, libraries).

4. Implement the business logic in the Ballerina.

   > **Tip:** Organize the Project: Follow the standard Ballerina project structure, with a `Ballerina.toml` file and source organized in modules if needed. You can visit the [Organize Ballerina code](https://ballerina.io/learn/organize-ballerina-code/) for detailed information about packages and how you can manage the growth of your source code.

5. Add tests to the created integration.

   > **Tip:** You can use [Ballerina test framework](https://ballerina.io/learn/test-ballerina-code/write-tests/) to write and run tests for your Ballerina applications. The Ballerina test framework provides a simple way to write unit tests, integration tests, and end-to-end tests for your Ballerina code.

6. Build the Ballerina integration. This command compiles the Ballerina application to produce the target artifacts. The default build command creates an executable `.jar` file in the `target/bin` directory.

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

7. Publish the artifacts to the registry.

> **Tip**: The above steps of the CI process can be automated using the [Ballerina GitHub action](/learn/monolithic-deployment/#ballerina-github-action-for-cicd-integration).

### Continuous Deployment (CD)

The Continuous Deployment (CD) process in a decentralized setup involves automating the deployment of Ballerina artifacts to the target environment.  This typically involves using a deployment workflow or pipeline to retrieve the built artifacts from the registry, configure the target environment, deploy the application, and verify its successful deployment.

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
