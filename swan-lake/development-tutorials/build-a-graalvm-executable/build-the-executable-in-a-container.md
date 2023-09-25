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
1. Latest [Ballerina Swan Lake](/downloads) distribution
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

   >**Info:** Optionally, you can create a file named `Cloud.toml` in the package directory to add cloud related configurations. For more information, see [Docker](/learn/by-example/#docker) and [Kubernetes](/learn/by-example/#kubernetes) documentation.

   ```
   $ bal build --graalvm --cloud=docker
   Compiling source
           user/hello_docker:0.1.0
   
   Generating artifacts
   Building the native image. This may take a while

   [+] Building 193.8s (13/13) FINISHED                                                                                                                                        docker:default
    => [internal] load .dockerignore                                                                                              0.0s
    => => transferring context: 2B                                                                                                0.0s
    => [internal] load build definition from Dockerfile                                                                           0.0s
    => => transferring dockerfile: 416B                                                                                           0.0s
    => [internal] load metadata for gcr.io/distroless/base:latest                                                                 3.2s
    => [internal] load metadata for ghcr.io/graalvm/native-image-community:17-ol8                                                 4.2s
    => [build 1/4] FROM ghcr.io/graalvm/native-image-community:17-ol8@sha256                                                      0.0s
    => [internal] load build context                                                                                              0.2s
    => => transferring context: 38.38MB                                                                                           0.2s
    => [stage-1 1/3] FROM gcr.io/distroless/base@sha256:73deaaf6a207c1a33850257ba74e0f196bc418636cada9943a03d7abea980d6d          0.0s
    => CACHED [stage-1 2/3] WORKDIR /home/ballerina                                                                               0.0s
    => CACHED [build 2/4] WORKDIR /app/build                                                                                      0.0s
    => [build 3/4] COPY hello_world.jar .                                                                                         0.1s
    => [build 4/4] RUN native-image -jar hello_world.jar -H:Name=hello_world --no-fallback -H:+StaticExecutableWithDynamicLibC  188.7s
    => [stage-1 3/3] COPY --from=build /app/build/hello_world .                                                                   0.2s 
    => exporting to image                                                                                                         0.3s 
    => => exporting layers                                                                                                        0.2s 
    => => writing image sha256:0129932fea465e620849b5842b42cb8136ab2daabf25e1817a7879207f6d861b                                   0.0s 
    => => naming to docker.io/library/hello_world:latest                                                                          0.0s 
                                                                                                                                                                                           
    Execute the below command to run the generated Docker image: 
           docker run -d -p 8080:8080 hello_world:latest
   ```

   **The Docker file:**

   ```	
   # Auto Generated Dockerfile
   FROM ghcr.io/graalvm/native-image-community:17-ol8 as build

   WORKDIR /app/build

   COPY hello_world.jar .

   RUN native-image -jar hello_world.jar -H:Name=hello_world --no-fallback -H:+StaticExecutableWithDynamicLibC

   FROM gcr.io/distroless/base

   WORKDIR /home/ballerina

   EXPOSE  8080
   COPY --from=build /app/build/hello_world .

   CMD ["./hello_world"]
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
