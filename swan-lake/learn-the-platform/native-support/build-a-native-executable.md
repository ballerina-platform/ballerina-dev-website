---
title: Build a Native Executable [Experimental]
permalink: /learn/build-a-native-executable/
description: This guide walks you through compiling a Ballerina application to a native executable and packing the native executable in a container.
keywords: ballerina, programming language, restful-api, ballerina packages, language-guide
active: build-a-native-executable
intro: This guide walks you through compiling a Ballerina application to a native executable and packing the native executable in a container.
---

This guide walks you through compiling a Ballerina application to a native executable and packing the native executable in a container. This feature is introduced as an experimental feature in update3 and hopes to make it official with the following releases. In case you come across any issues do report them as the Ballerina team will be aggressively addressing them.

Before getting started, let's first understand some key aspects which can be helpful to understand  the native executable generating process better.

## GraalVM

Building a Ballerina native executable requires the [GraalVM](https://www.graalvm.org) [native-image](https://www.graalvm.org/22.3/reference-manual/native-image/) compiler. GraalVM is a high-performance, cloud native and polyglot JDK designed to accelerate the execution of applications. There are three different distributions on GraalVM: Oracle GraalVM Community Edition (CE), Oracle GraalVM Enterprise Edition (EE) and Mandrel. You can install any to use Ballerina native functionality.

- GraalVM CE is the free version of GraalVM which is distributed under GPLv2+CE at the time of this writing.
- GraaLVM EE is the paid version of GraalVM which comes with a few additional features such as options for GC, debugging and other optimizations.
- Mandrel is a downstream distribution of the Oracle GraalVM CE which is maintained by RedHat.

This article uses GraalVM CE to discuss the following topics.

## Native Executable vs Uber Jar

When compiling a  Ballerina application using bal build, the output is an uber jar. As you already know, running the jar requires a JVM. JVM uses Just In Time (JIT) compiler to generate native code during runtime.

On the other hand, when compiling a Ballerina application using `bal build --native`, the output is the native executable local to the host machine. In order to build the native executable, GraalVM uses Ahead Of Time compilation (AOT) which requires the generated uber jar as the input to produce the native executable. Native Image generation performs aggressive optimizations such as unused code elimination in the JDK and its dependencies, heap snapshotting, and static code initializations.

The difference between the both approaches result in different pros and cons as depicted in the below diagram.

The following spider graph illustrates the key differences:

![AOT Vs JIT](/learn/images/aot-vs-jit.jpeg)

As depicted in the image, AOT compilation with GraalVM provides the following advantages over the standard JIT compilation, making it ideal for container runtimes.
- Use a fraction of the resources required by the JVM.
- Applications start in milliseconds.
- Deliver peak performance immediately, no warmup.
- Can be packaged into lightweight container images for faster and more efficient deployments.
- Reduced attack surface.

The only downside is, the GraalVM native Image build is a highly complicated process which may consume a lot of memory and CPU, resulting in extended build time. However, the GraalVM community is continuously working on improving its performance.

## Ballerina Native Image

From Ballerina 2201.3.0 (SwanLake), Ballerina supports GraalVM AOT compilation to generate standalone executables by passing the native flag in the build command: `bal build --native` . The generated executable contains the modules in the current package, their dependencies, Ballerina runtime, and statically linked native code from the JDK.

## Build a native executable locally

### Set up the prerequisites

To complete this part of the guide, you need:
1. [Ballerina 2201.3.0 (Swan Lake)](/learn/install-ballerina/set-up-ballerina/) or greater
2. A text editor
   >**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the  <a href="https://marketplace.visualstudio.com/items?itemName=WSO2.ballerina" target="_blank">Ballerina extension</a> installed.
3. GraalVM installed and configured appropriately
4. A command terminal

### Configure GraalVM

1. Install GraalVM if you have not already.
    - Install GraalVM with one line!
      ```
      $ bash <(curl -sL https://get.graalvm.org/jdk)  graalvm-ce-java11-22.3.0
      ```
      > **Tip:** Above command does install the native-image tool which is required to generate the native images along with GraalVM.
    - For additional information check [GraalVM startup guide](https://www.graalvm.org/22.2/docs/getting-started/)
2. Configure the runtime environment. Set the `GRAALVM_HOME` environment variable to the GraalVM installation directory as directed at the end of the execution of the above command.

> **Note:** On Windows, Native Image requires Visual Studio Code and Microsoft Visual C++(MSVC). Follow this [guide](https://medium.com/graalvm/using-graalvm-and-native-image-on-windows-10-9954dc071311) to install Visual Studio Code with the Windows 10 SDK.

Since the environment is set up for building a native executable, let's see how to build a  native executable for a simple Ballerina HTTP server application.

### Build a native executable

1. Create a ballerina service package :
   ```
   $ bal new hello_world -t service
   ```

2. Replace the content of the file service.bal :
   ```ballerina
   import ballerina/http;

   listener http:Listener httpListener = new (8080);
   service / on httpListener {
       resource function get greeting() returns string { 
       return "Hello, World!"; 
       }
   }
   ```

3. Create native executable :
   ```
   $ bal build --native
   WARNING : Native image generation is an experimental feature, which supports only a limited set of functionality
   Compiling source
       user/hello_world:0.1.0

   Generating executable
       target/bin/hello_world.jar

   Generating GraalVM native image
   ================================================================================================================
   GraalVM Native Image: Generating 'hello_world' (executable)...
   ================================================================================================================
   [1/7] Initializing...                                                                           (15.7s @ 0.40GB)
    Version info: 'GraalVM 22.3.0 Java 11 CE'
    Java version info: '11.0.17+8-jvmci-22.3-b08'
    C compiler: cc (apple, x86_64, 14.0.0)
    Garbage collector: Serial GC
    2 user-specific feature(s)
    - com.oracle.svm.thirdparty.gson.GsonFeature
    - io.ballerina.stdlib.crypto.svm.BouncyCastleFeature
   [2/7] Performing analysis...  [************]                                                   (269.1s @ 4.48GB)
     24,836 (94.74%) of 26,215 classes reachable
     81,216 (82.54%) of 98,394 fields reachable
    145,899 (76.07%) of 191,785 methods reachable
      1,392 classes,   712 fields, and 2,478 methods registered for reflection
         91 classes,    94 fields, and    66 methods registered for JNI access
          6 native libraries: -framework CoreServices, -framework Foundation, dl, pthread, stdc++, z
   [3/7] Building universe...                                                                      (33.3s @ 3.25GB)
   [4/7] Parsing methods...      [******]                                                          (43.7s @ 3.12GB)
   [5/7] Inlining methods...     [***]                                                             (12.4s @ 4.63GB)
   [6/7] Compiling methods...    [***************]                                                (230.8s @ 4.54GB)
   [7/7] Creating image...                                                                         (19.1s @ 5.45GB)
     88.47MB (60.32%) for code area:   105,528 compilation units
     57.72MB (39.36%) for image heap:  478,129 objects and 30 resources
    484.48KB ( 0.32%) for other data
    146.66MB in total
   ---------------------------------------------------------------------------------------------------------------
   Top 10 packages in code area:                          Top 10 object types in image heap:
     17.96MB ballerina.http/2                               15.60MB byte[] for code metadata
      4.49MB ballerina.http/2.types                          9.81MB byte[] for embedded resources
      2.58MB ballerina.io/1                                  6.59MB java.lang.Class
      1.85MB ballerina.file/1                                5.02MB byte[] for java.lang.String
      1.72MB ballerina.jwt/2                                 4.62MB java.lang.String
      1.57MB sun.security.ssl                                3.58MB byte[] for general heap data
      1.30MB ballerina.oauth2/2                              2.27MB com.oracle.svm.core.hub.DynamicHubCompanion
      1.23MB java.lang.invoke                                1.26MB byte[] for reflection metadata
      1.18MB com.sun.media.sound                           959.04KB java.lang.String[]
   1011.31KB ballerina.lang$0046query/0                    919.38KB c.o.svm.core.hub.DynamicHub$ReflectionMetadata
     52.84MB for 847 more packages                           6.45MB for 3500 more object types
   ----------------------------------------------------------------------------------------------------------------
               103.7s (15.9% of total time) in 62 GCs | Peak RSS: 5.65GB | CPU load: 2.53
   ----------------------------------------------------------------------------------------------------------------
   Produced artifacts:
    /Users/user/Documents/GraalVM/mocking-test/hello_world/target/bin/hello_world (executable)
    /Users/user/Documents/GraalVM/mocking-test/hello_world/target/bin/hello_world.build_artifacts.txt (txt)
   ================================================================================================================
   Finished generating 'hello_world' in 4m 16s.

   GraalVM image generated
       /Users/user/Documents/GraalVM/mocking-test/hello_world/target/bin/hello_world
   ```

   > **Note:** On Windows, the Microsoft Native Tools for Visual Studio must first be initialized before building a native-image. You can do this by starting the x64 Native Tools Command Prompt that was installed with the Visual Studio Build Tools. At x64 Native Tools Command Prompt you can navigate to your project folder and run `bal build --native`.

4. Running the native executable :
   ```
   $ ./target/bin/hello_world
   ```

5. Testing the service with a curl request :
   ```
   $ curl http://localhost:8080/greeting
   Hello, World!
   ```

Great! Now you have built and tested a native executable for a simple Ballerina HTTP server application. Let’s see how to build the native executable and pack it in a container.

## Pack the native executable in a container

### Set up the prerequisites

To complete this part of the guide, you need:
1. [Ballerina 2201.3.0 (Swan Lake)](/learn/install-ballerina/set-up-ballerina/) or greater
2. A text editor
   >**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the  <a href="https://marketplace.visualstudio.com/items?itemName=WSO2.ballerina" target="_blank">Ballerina extension</a> installed.
3. [Docker](https://www.docker.com) installed and configured in your machine
4. A command terminal

### Build a native executable in a container

1. Create a ballerina service package :
   ```
   $ bal new hello_docker -t service
   ```

2. Replace the content of the file service.bal :
   ```ballerina
   import ballerina/http;

   listener http:Listener helloEP = new(9090);

   service /helloWorld on helloEP {
       resource function get sayHello() returns string {   
       return "Hello, Docker!";   
       }
   }
   ```

3. Generate the artifacts with native executable
    ```
   $ bal build --native --cloud=docker
   Compiling source
       user/hello_docker:0.1.0

   Generating executable

   Generating artifacts

   Building the native image. This my take a while

   Sending build context to Docker daemon  34.99MB
   Step 1/11 : FROM ballerina/native-builder:latest as build
   latest: Pulling from ballerina/native-builder
   e54b73e95ef3: Pull complete 
   610e102c116f: Pull complete 
   1c4500f6be50: Pull complete 
   6d96a89dde23: Pull complete 
   Digest: sha256:ad5bccc29f6f317283454c16321cce8d7521273032cf346364eb32b077abac0f
   Status: Downloaded newer image for ballerina/native-builder:latest
    ---> a8caa408cd81
   Step 2/11 : WORKDIR /app/build
    ---> Running in 14262200d0d3
   Removing intermediate container 14262200d0d3
    ---> 750b429d3412
   Step 3/11 : COPY hello_docker.jar .
    ---> 75c2e6ab58bd
   Step 4/11 : RUN sh build-native.sh hello_docker.jar hello_docker
    ---> Running in ba1e3c6403eb
   WARNING: Unknown module: org.graalvm.nativeimage.llvm specified to --add-exports
   WARNING: Unknown module: org.graalvm.nativeimage.llvm specified to --add-exports
   WARNING: Unknown module: org.graalvm.nativeimage.llvm specified to --add-exports
   ================================================================================================================
   GraalVM Native Image: Generating 'hello_docker' (executable)...
   ================================================================================================================
   [1/7] Initializing...                                                                           (38.4s @ 0.41GB)
    Version info: 'GraalVM 22.2.0 Java 11 CE'
    Java version info: '11.0.16+8-jvmci-22.2-b06'
    C compiler: gcc (redhat, x86_64, 8.5.0)
    Garbage collector: Serial GC
    2 user-specific feature(s)
    - com.oracle.svm.thirdparty.gson.GsonFeature
    - io.ballerina.stdlib.crypto.svm.BouncyCastleFeature
   [2/7] Performing analysis...  [************]                                                   (171.7s @ 3.36GB)
     25,054 (94.83%) of 26,419 classes reachable
     81,841 (82.43%) of 99,283 fields reachable
    147,544 (76.50%) of 192,861 methods reachable
      1,392 classes,   712 fields, and 2,489 methods registered for reflection
         91 classes,    93 fields, and    69 methods registered for JNI access
          7 native libraries: dl, m, pthread, rt, stdc++, z
   [3/7] Building universe...                                                                      (13.5s @ 3.48GB)
   [4/7] Parsing methods...      [*****]                                                           (26.3s @ 2.43GB)
   [5/7] Inlining methods...     [***]                                                              (8.7s @ 2.73GB)
   [6/7] Compiling methods...    [************]                                                   (155.1s @ 2.74GB)
   [7/7] Creating image...                                                                         (15.5s @ 2.95GB)
     93.75MB (61.13%) for code area:   106,991 compilation units
     59.04MB (38.49%) for image heap:  477,025 objects and 91 resources
    594.88KB ( 0.38%) for other data
    153.37MB in total
   ----------------------------------------------------------------------------------------------------------------
   Top 10 packages in code area:                          Top 10 object types in image heap:
     19.30MB ballerina.http/2                               15.89MB byte[] for code metadata
      4.50MB ballerina.http/2.types                         10.36MB byte[] for embedded resources
      2.82MB ballerina.io/1                                  6.83MB java.lang.Class
      1.91MB ballerina.file/1                                5.03MB byte[] for java.lang.String
      1.80MB ballerina.jwt/2                                 4.60MB java.lang.String
      1.60MB sun.security.ssl                                3.60MB byte[] for general heap data
      1.42MB ballerina.oauth2/2                              2.29MB com.oracle.svm.core.hub.DynamicHubCompanion
      1.25MB java.lang.invoke                                1.28MB byte[] for reflection metadata
      1.22MB com.sun.media.sound                           974.95KB java.lang.String[]
      1.06MB ballerina.lang$0046query/0                    926.91KB c.o.svm.core.hub.DynamicHub$ReflectionMetadata
     56.09MB for 865 more packages                           6.28MB for 3527 more object types
   ----------------------------------------------------------------------------------------------------------------
              58.4s (12.6% of total time) in 124 GCs | Peak RSS: 5.41GB | CPU load: 6.50
   ----------------------------------------------------------------------------------------------------------------
   Produced artifacts:
    /app/build/hello_docker (executable)
    /app/build/hello_docker.build_artifacts.txt (txt)
   ================================================================================================================
   Finished generating 'hello_docker' in 6m 32s.
   Removing intermediate container ba1e3c6403eb
    ---> e7e7bce1a5e8
   Step 5/11 : FROM debian:11-slim
   11-slim: Pulling from library/debian
   e9995326b091: Pull complete 
   Digest: sha256:e8ad0bc7d0ee6afd46e904780942033ab83b42b446b58efa88d31ecf3adf4678
   Status: Downloaded newer image for debian:11-slim
    ---> acdab49503b5
   Step 6/11 : RUN useradd -ms /bin/bash ballerina
    ---> Running in 7c97f3c18072
   Removing intermediate container 7c97f3c18072
    ---> 5fbbfaaf8178
   Step 7/11 : WORKDIR /home/ballerina
    ---> Running in e6d305ff82b5
   Removing intermediate container e6d305ff82b5
    ---> dd05ecf72a90
   Step 8/11 : EXPOSE  8080
    ---> Running in 562d3824217c
   Removing intermediate container 562d3824217c
    ---> f38b549838cd
   Step 9/11 : USER ballerina
    ---> Running in eaf7546d5caa
   Removing intermediate container eaf7546d5caa
    ---> a3731c04eb7e
   Step 10/11 : COPY --from=build /app/build/hello_docker .
    ---> bf5d0ff0d524
   Step 11/11 : CMD ["./hello_docker"]
    ---> Running in 6f65341da08a
   Removing intermediate container 6f65341da08a
    ---> 47c7a10a79ef
   Successfully built 47c7a10a79ef
   Successfully tagged wso2inc/hello:v0.1.0

   Execute the below command to run the generated Docker image: 
       docker run -d -p 8080:8080 wso2inc/hello:v0.1.0

       target/bin/hello_docker.jar
   ```

   Further optionally you can create a file named Cloud.toml in the package directory and add the content below. The values below describe the image being generated. For more information please see the [docker](https://ballerina.io/learn/by-example/c2c-docker-deployment/) and [k8s](https://ballerina.io/learn/by-example/c2c-k8s-deployment/) documentation.

   ```toml
   [container.image]
   repository="wso2inc" # ex - Docker hub name
   name="hello" # container name
   tag="v0.1.0"
   ```

   The docker file :
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

4. Execute the docker image :
   ```
   $ docker run -d -p 8080:8080 wso2inc/hello:v0.1.0
   ```

5. Testing the service with a curl request :
   ```
   $ curl http://localhost:8080/greeting
   Hello, Docker!
   ```
