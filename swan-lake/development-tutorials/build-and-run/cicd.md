---
layout: ballerina-cli-documentation-left-nav-pages-swanlake
title: Configure CI/CD for Ballerina projects
description: Learn how to configure a CI/CD pipeline for a Ballerina project.
keywords: ballerina, programming language, CICD, CI/CD, pipeline, github actions, gitlab, bitbucket
permalink: /learn/build-and-run/ci-cd/
active: cicd
intro: This guide explains how to create a CI/CD pipeline for a Ballerina project.
---

Continuous Integration and Continuous Deployment (CI/CD) pipelines are essential for modern software development. They automate the process of building, testing, and deploying applications, ensuring faster delivery and higher quality. 

### Why CI/CD for Ballerina?

Ballerina is designed for building cloud-native applications, making it a great fit for modern development practices.
A CI/CD pipeline for Ballerina offers several benefits.

- Automate testing to catch bugs early.
- Build and package your application for deployment.
- Push your Ballerina modules to Ballerina Central or container registries.
- Ensure consistency across development, testing, and production environments.

With Ballerina, you gain the flexibility to implement CI/CD pipelines universally across automation-supporting platforms.
Whether you prefer GitHub, GitLab, Bitbucket, or another CI/CD tool, the core steps remain the same. 
Below are the sample configurations for popular platforms to get started quickly.

### GitHub Actions for Ballerina

[GitHub Actions](https://github.com/marketplace/actions/ballerina-action) is a powerful CI/CD tool integrated directly into GitHub repositories. Here’s how you can set up a pipeline for your Ballerina project.

1. In your repository, create a `.github/workflows/ballerina-ci.yml` file.

2. Below is an example workflow that tests, builds, and pushes your Ballerina project.

   ```yaml
   name: Ballerina CI/CD Pipeline

   on: [push, pull_request]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest

       steps:
         - name: Checkout Code
           uses: actions/checkout@v3

         - name: Set up Ballerina
           uses: ballerina-platform/ballerina-action@v1
           with:
             version: 2201.11.0 # Specify the Ballerina version

         - name: Cache Ballerina Dependencies
           uses: actions/cache@v3
           with:
             path: ~/.ballerina
             key: ballerina-deps-${{ hashFiles('**/Ballerina.toml') }}
             restore-keys: |
               ballerina-deps-

         - name: Run Tests
           run: bal test

         - name: Build Ballerina Project
           run: bal pack

         - name: Push to Ballerina Central
           run: bal push
           env:
             BALLERINA_CENTRAL_ACCESS_TOKEN: ${{ secrets.BALLERINA_CENTRAL_ACCESS_TOKEN }}

         # Optional: Docker Build and Push
         - name: Build Docker Image
           run: bal build --cloud=docker

         - name: Push Docker Image
           run: | # Replace my-ballerina-app with your Docker image name
             echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
             docker push my-ballerina-app:${{ github.sha }} 
   ```

- **Dependency caching**: Speeds up builds by caching Ballerina dependencies.
- **Ballerina Central integration**: Pushes modules to Ballerina Central using a secure token.
- **Docker support**: Builds and pushes Docker images if your project requires containerization.

To use this workflow, you need to add the `BALLERINA_CENTRAL_ACCESS_TOKEN` and `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets to your repository. Ballerina Central access token can be generated from [Ballerina Central](https://ballerina.io/learn/publish-packages-to-ballerina-central/#publish-a-package-to-ballerina-central). 
Docker username and password can be obtained from [Docker Hub](https://hub.docker.com/).

### GitLab CI/CD for Ballerina

[GitLab CI/CD](https://docs.gitlab.com/ci/) is another popular tool for automating software development workflows. Here’s how to set up a pipeline for a Ballerina project.

1. Create a `.gitlab-ci.yml` file in the root of your repository.

2. Add the following pipeline configuration to the file.
```yaml
   stages:
   - test
   - build
   - push

   variables:
      BALLERINA_VERSION: "2201.11.0" # Specify the Ballerina version

   cache:
      key: ballerina-deps-$CI_COMMIT_REF_SLUG
      paths:
         - ~/.ballerina/

   before_script:
      - apt-get update && apt-get install -y curl unzip
      - curl -L -o ballerina-$BALLERINA_VERSION-swan-lake-linux-x64.deb https://dist.ballerina.io/downloads/$BALLERINA_VERSION/ballerina-$BALLERINA_VERSION-swan-lake-linux-x64.deb
      - dpkg -i ballerina-$BALLERINA_VERSION-swan-lake-linux-x64.deb
      - bal version

   test:
      stage: test
      script:
         - bal test

   build:
      stage: build
      script:
         - bal build

   push:
      stage: push
      script:
         - bal pack
         - bal push
      only:
         - main
      environment:
         name: production
      variables:
         BALLERINA_CENTRAL_ACCESS_TOKEN: $BALLERINA_CENTRAL_ACCESS_TOKEN

```

- **Ballerina setup**: Automatically installs the specified Ballerina version.
- **Dependency caching**: Caches dependencies to speed up builds.
- **Ballerina Central integration**: Pushes modules to Ballerina Central.

To use this workflow, you need to add the `BALLERINA_CENTRAL_ACCESS_TOKEN` secret to your repository. Ballerina Central access token can be generated from [Ballerina Central](https://ballerina.io/learn/publish-packages-to-ballerina-central/#publish-a-package-to-ballerina-central).

### Bitbucket pipelines for Ballerina

[Bitbucket Pipelines](https://www.atlassian.com/software/bitbucket/features/pipelines) is a CI/CD tool integrated into Bitbucket repositories. Here’s how to set up a pipeline for your Ballerina project.

1. Create a `bitbucket-pipelines.yml` file in the root of your repository.

2. Add the following pipeline configuration to the file.

   ```yaml
   image: ballerina/ballerina:2201.11.0 # Specify the Ballerina version

   pipelines:
     default:
       - step:
           name: Run Tests
           caches:
             - ballerina
           script:
             - bal test
       - step:
           name: Build Project
           caches:
             - ballerina
           script:
             - bal pack
       - step:
           name: Push to Ballerina Central
           script:
             - export BALLERINA_CENTRAL_ACCESS_TOKEN=$BALLERINA_CENTRAL_ACCESS_TOKEN 
             - bal push

     pull-requests:
       "**":
         - step:
             name: Build and Test PR
             caches:
               - ballerina
             script:
               - bal test
               - bal pack

   definitions:
     caches:
       ballerina: ~/.ballerina
   ```

- **Dependency caching**: Caches Ballerina dependencies for faster builds.
- **Pull request support**: Runs tests and builds for pull requests.
- **Ballerina Central integration**: Pushes modules to Ballerina Central.

To use this workflow, you need to add the `BALLERINA_CENTRAL_ACCESS_TOKEN` secret to your repository. Ballerina Central access token can be generated from [Ballerina Central](https://ballerina.io/learn/publish-packages-to-ballerina-central/#publish-a-package-to-ballerina-central).

### Best practices for Ballerina CI/CD pipelines

1. **Use environment variables**:
   Store sensitive data like tokens and credentials in environment variables or secrets.

2. **Cache dependencies**:
   Cache Ballerina dependencies to speed up builds.

3. **Add notifications**:
   Integrate notifications (e.g., Slack, email) to alert teams about build status.

4. **Test across multiple Ballerina versions**:
   Use matrix builds to test your project against multiple Ballerina versions.

5. **Containerize your application**:
   If your project requires containerization, add Docker build and push steps to your pipeline.

Setting up a CI/CD pipeline for your Ballerina project is a straightforward process that can significantly improve your development workflow. Whether you use GitHub Actions, GitLab CI/CD, or Bitbucket Pipelines, automating your build, test, and deployment processes ensures faster delivery and higher-quality applications. By following the steps and best practices outlined in this article, you’ll be well on your way to building a robust CI/CD pipeline for your Ballerina projects.
