---
title: "Build the GraalVM executable in a container"
permalink: /learn/build-the-executable-in-a-container/
description: Building and packing the GraalVM executable from Ballerina in a container. 
keywords: ballerina, programming language, ballerina packages, language-guide, graalvm, native, executable, container, docker
active: build-the-executable-in-a-container
intro: This guide walks you through compiling a Ballerina application to a native executable and packing the GraalVM executable in a container.
---

## Prerequisites

To complete this part of the guide, you need:
1. [Ballerina 2201.7.0 (Swan Lake)](/downloads) or greater
2. A text editor
   >**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the  <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina extension</a> installed.
3. [Docker](https://www.docker.com) installed and configured in your machine
   >**Tip:** Since the GraalVM native build consumes a significant amount of memory, it is recommended to increase the memory allocated to Docker to at least 8GB and potentially add more CPUs as well. For more details, see [How to assign more memory to Docker container](https://stackoverflow.com/questions/44533319/how-to-assign-more-memory-to-docker-container/44533437#44533437).
4. A command terminal

After the environment is set up, follow the steps below to build the native executable and pack it in a container.

## Build the GraalVM executable in a container

1. Execute the command below to create a Ballerina service package.

   ```
   $ bal new hello_docker -t service
   ```

2. Replace the content of the file `service.bal` with the following.

   ```ballerina
   import ballerina/http;

   service / on new http:Listener(8080) {
       resource function get greeting() returns string {   
           return "Hello, Docker!";   
       }
   }
   ```

3. Execute `bal build --graalvm --cloud=docker` to generate the artifacts with the native executable. 

   >**Info:** Optionally, you can create a file named `Cloud.toml` in the package directory to add cloud related configurations. For more information, see [Docker](/learn/by-example/c2c-docker-deployment/) and [Kubernetes](/learn/by-example/c2c-k8s-deployment/) documentation.

   ```
   $ bal build --graalvm --cloud=docker
   Compiling source
           user/hello_docker:0.1.0
   
   Generating artifacts
   
   Building the native image. This may take a while
   
   [+] Building 263.1s (16/16) FINISHED                                                  
    => [internal] load build definition from Dockerfile                                  0.0s
    => => transferring dockerfile: 395B                                                  0.0s
    => [internal] load .dockerignore                                                     0.0s
    => => transferring context: 2B                                                       0.0s
    => [internal] load metadata for docker.io/library/debian:11-slim                     5.7s
    => [internal] load metadata for docker.io/ballerina/native-builder:2201.7.x         10.1s
    => [auth] ballerina/native-builder:pull token for registry-1.docker.io               0.0s
    => [auth] library/debian:pull token for registry-1.docker.io                         0.0s
    => [build 1/4] FROM docker.io/ballerina/native-builder:2201.7.x                      1.7s
    => => resolve docker.io/ballerina/native-builder:2201.7.x                            0.0s
    => CACHED [stage-1 1/4] FROM docker.io/library/debian:11-slim                        0.0s
    => [internal] load build context                                                     0.3s
    => => transferring context: 38.39MB                                                  0.3s
    => [stage-1 2/4] RUN useradd -ms /bin/bash ballerina                                 0.5s
    => [stage-1 3/4] WORKDIR /home/ballerina                                             0.0s
    => [build 2/4] WORKDIR /app/build                                                    0.1s
    => [build 3/4] COPY hello_docker.jar .                                               0.1s
    => [build 4/4] RUN sh build-native.sh hello_docker.jar hello_docker                250.5s
    => [stage-1 4/4] COPY --from=build /app/build/hello_docker .                         0.3s
    => exporting to image                                                                0.3s
    => => exporting layers                                                               0.3s
    => => writing image                                                                  0.0s
    => => naming to docker.io/library/hello_docker:latest                                0.0s
   
   Execute the below command to run the generated Docker image: 
           docker run -d -p 8080:8080 hello_docker:latest
   ```

   **The Docker file:**

   ```	
   # Auto Generated Dockerfile
   FROM ballerina/native-builder:latest as build
   WORKDIR /app/build
   COPY hello_docker.jar .
   
   RUN sh build-native.sh hello_docker.jar hello_docker
   
   FROM debian:11-slim
   RUN useradd -ms /bin/bash ballerina
   WORKDIR /home/ballerina
   EXPOSE  8080
   USER ballerina
   COPY --from=build /app/build/hello_docker .
   
   CMD ["./hello_docker"]
   ```

4. Execute the Docker image.

   ```
   $ docker run -d -p 8080:8080 hello_docker:latest
   ```

5. Test the service with the cURL request below.

   ```
   $ curl http://localhost:8080/greeting
   Hello, Docker!
   ```
