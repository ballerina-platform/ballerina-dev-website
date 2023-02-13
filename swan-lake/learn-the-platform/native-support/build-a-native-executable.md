---
title: "[Experimental] Build a native executable"
permalink: /learn/build-a-native-executable/
description: This guide walks you through compiling a Ballerina application to a native executable and packing the native executable in a container.
keywords: ballerina, programming language, restful-api, ballerina packages, language-guide
active: build-a-native-executable
intro: This guide walks you through compiling a Ballerina application to a native executable and packing the native executable in a container.
---

This feature was introduced as an experimental feature in the Swan Lake Update 3 release and it will become official with the following releases. In case you come across any issues do report them as the Ballerina community will be aggressively addressing them.

The key aspects below help you understand the native executable generating process better.

## GraalVM

Building a Ballerina native executable requires the [GraalVM](https://www.graalvm.org) [native-image](https://www.graalvm.org/22.3/reference-manual/native-image/) compiler. GraalVM is a high-performance, cloud native, and polyglot JDK designed to accelerate the execution of applications. There are three different distributions on GraalVM: Oracle GraalVM Community Edition (CE), Oracle GraalVM Enterprise Edition (EE), and Mandrel. You can install any to use the Ballerina native functionality.

- GraalVM CE is the free version of GraalVM, which is distributed under GPLv2+CE.
- GraaLVM EE is the paid version of GraalVM, which comes with a few additional features such as options for GC, debugging, and other optimizations.
- Mandrel is a downstream distribution of the Oracle GraalVM CE, which is maintained by Red Hat.

This article uses GraalVM CE to discuss the following topics.

## Native executable vs. Uber Jar

When compiling a  Ballerina application using the `bal build` command the output is an uber JAR file. As you already know, running the JAR requires a JVM. JVM uses a Just In Time (JIT) compiler to generate native code during runtime.

On the other hand, when compiling a Ballerina application using `bal build --native`, the output is the native executable local to the host machine. In order to build the native executable, GraalVM uses Ahead Of Time compilation (AOT), which requires the generated uber JAR as the input to produce the native executable. Native Image generation performs aggressive optimizations such as unused code elimination in the JDK and its dependencies, heap snapshotting, and static code initializations.

The difference between both approaches result in different pros and cons as depicted in the spider graph below.

<img src="/learn/images/aot-vs-jit.png" alt="AOT vs JIT" height="520" style="width: auto !important; padding-top: 20px; padding-bottom: 20px">

As depicted in the image, AOT compilation with GraalVM provides the following advantages over the standard JIT compilation making it ideal for container runtimes.
- Use a fraction of the resources required by the JVM.
- Applications start in milliseconds.
- Deliver peak performance immediately with no warmup.
- Can be packaged into lightweight container images for faster and more efficient deployments.
- Reduced attack surface.

The only downside is that the GraalVM native image build is a highly complicated process, which may consume a lot of memory and CPU resulting in an extended build time. However, the GraalVM community is continuously working on improving its performance.

## Ballerina native image

From Ballerina 2201.3.0 (SwanLake) onwards, Ballerina supports GraalVM AOT compilation to generate standalone executables by passing the native flag in the build command: `bal build --native`. The generated executable contains the modules in the current package, their dependencies, Ballerina runtime, and statically linked native code from the JDK.

> **Info:** Apart from the Ballerina runtime and [standard libraries](/learn/ballerina-specifications/#standard-library-specifications), the following Ballerina extended modules are GraalVM-compatible :
>  - [`nats`](https://central.ballerina.io/ballerinax/nats)
>  - [`kafka`](https://central.ballerina.io/ballerinax/kafka)
>  - [`rabbitmq`](https://central.ballerina.io/ballerinax/rabbitmq)
>  - [`jdbc`](https://central.ballerina.io/ballerinax/java.jdbc)
>  - [`mssql`](https://central.ballerina.io/ballerinax/mssql)
>  - [`mysql`](https://central.ballerina.io/ballerinax/mysql)
>  - [`oracledb`](https://central.ballerina.io/ballerinax/oracledb)
>  - [`postgresql`](https://central.ballerina.io/ballerinax/postgresql)

## Build a native executable locally

### Set up the prerequisites

To complete this part of the guide, you need:
1. [Ballerina 2201.3.0 (Swan Lake)](/learn/install-ballerina/set-up-ballerina/) or greater
2. A text editor
   >**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the  <a href="https://wso2.com/ballerina/vscode/docs/get-started/install-the-extension/" target="_blank">Ballerina extension</a> installed.
3. GraalVM installed and configured appropriately
4. A command terminal

### Configure GraalVM

1. Install GraalVM if you have not done it already.
    - Install GraalVM on Linux, macOS, and Windows (via Git Bash, Cygwin, or WSL) using the following command.
      ```
      $ bash <(curl -sL https://get.graalvm.org/jdk)  graalvm-ce-java11-22.3.0
      ```
      > **Note:** The above command installs the native-image tool, which is required to generate the native images along with GraalVM. Follow the instructions in the output log to resolve prerequisites for GraalVM native image.
    - For additional information, see [Get Started with GraalVM](https://www.graalvm.org/22.3/docs/getting-started).
2. Configure the runtime environment. Set the `GRAALVM_HOME` environment variable to the GraalVM installation directory as directed at the end of the execution of the above command.

> **Note:** 
> - On Windows, the native image requires Visual Studio Code and Microsoft Visual C++ (MSVC). For instructions on installing Visual Studio Code with the Windows 10 SDK, go to [Using GraalVM and Native Image on Windows 10](https://medium.com/graalvm/using-graalvm-and-native-image-on-windows-10-9954dc071311).
> - The GraalVM native-image tool support for Apple M1 (darwin-aarch64) is still experimental. For more updates, see [Support for Apple M1](https://github.com/oracle/graal/issues/2666).

After the environment is set up, follow the steps below to build a native executable for a simple Ballerina HTTP server application.

### Build a native executable

1. Execute the command below to create a Ballerina service package :
   ```
   $ bal new hello_world -t service
   ```

2. Replace the content of the `service.bal` file with the following.
   ```ballerina
   import ballerina/http;

   service / on new http:Listener(8080) {
       resource function get greeting() returns string { 
              return "Hello, World!"; 
       }
   }
   ```

3. Run `bal build --native` to create the native executable.
   ```
   $ bal build --native
   WARNING: GraalVM Native Image generation in Ballerina is an experimental feature
   Compiling source
       user/hello_world:0.1.0

   Generating executable with Native image
   =======================================================================================================
   GraalVM Native Image: Generating 'hello_world' (executable)...
   =======================================================================================================
   [1/7] Initializing...                                                                  (15.7s @ 0.40GB)
    Version info: 'GraalVM 22.3.0 Java 11 CE'
    Java version info: '11.0.17+8-jvmci-22.3-b08'
    C compiler: cc (apple, x86_64, 14.0.0)
    Garbage collector: Serial GC
    2 user-specific feature(s)
    - com.oracle.svm.thirdparty.gson.GsonFeature
    - io.ballerina.stdlib.crypto.svm.BouncyCastleFeature
   [2/7] Performing analysis...  [************]                                          (169.1s @ 4.48GB)
     24,836 (94.74%) of 26,215 classes reachable
     81,216 (82.54%) of 98,394 fields reachable
    145,899 (76.07%) of 191,785 methods reachable
      1,392 classes,   712 fields, and 2,478 methods registered for reflection
         91 classes,    94 fields, and    66 methods registered for JNI access
          6 native libraries: -framework CoreServices, -framework Foundation, dl, pthread, stdc++, z
   [3/7] Building universe...                                                             (13.3s @ 3.25GB)
   [4/7] Parsing methods...      [******]                                                 (23.7s @ 3.12GB)
   [5/7] Inlining methods...     [***]                                                    (12.4s @ 4.63GB)
   [6/7] Compiling methods...    [***************]                                       (130.8s @ 4.54GB)
   [7/7] Creating image...                                                                (19.1s @ 5.45GB)
     88.47MB (60.32%) for code area:   105,528 compilation units
     57.72MB (39.36%) for image heap:  478,129 objects and 30 resources
    484.48KB ( 0.32%) for other data
    146.66MB in total
   -------------------------------------------------------------------------------------------------------
   Top 10 packages in code area:                 Top 10 object types in image heap:
     17.96MB ballerina.http/2                      15.60MB byte[] for code metadata
      4.49MB ballerina.http/2.types                 9.81MB byte[] for embedded resources
      2.58MB ballerina.io/1                         6.59MB java.lang.Class
      1.85MB ballerina.file/1                       5.02MB byte[] for java.lang.String
      1.72MB ballerina.jwt/2                        4.62MB java.lang.String
      1.57MB sun.security.ssl                       3.58MB byte[] for general heap data
      1.30MB ballerina.oauth2/2                     2.27MB com.oracle.svm.core.hub.DynamicHubCompanion
      1.23MB java.lang.invoke                       1.26MB byte[] for reflection metadata
      1.18MB com.sun.media.sound                  959.04KB java.lang.String[]
   1011.31KB ballerina.lang$0046query/0           919.38KB c.o.svm.core.hub.DynamicHub$ReflectionMetadata
     52.84MB for 847 more packages                  6.45MB for 3500 more object types
   -------------------------------------------------------------------------------------------------------
               103.7s (15.9% of total time) in 62 GCs | Peak RSS: 5.65GB | CPU load: 2.53
   -------------------------------------------------------------------------------------------------------
   Produced artifacts:
   /Users/user/Documents/hello_world/target/bin/hello_world (executable)
   /Users/user/Documents/hello_world/target/bin/hello_world.build_artifacts.txt (txt)
   =======================================================================================================
   Finished generating 'hello_world' in 6m 24s.
   ```

   > **Note:** On Windows, the Microsoft Native Tools for Visual Studio must be initialized before building a native-image. You can do this by starting the **x64 Native Tools Command Prompt** that was installed with the Visual Studio Build Tools. In the x64 Native Tools Command Prompt, navigate to your project folder and run `bal build --native`.

4. Execute the command below to run the native executable.
   ```
   $ ./target/bin/hello_world
   ```

5. Test the service with a cURL request :
   ```
   $ curl http://localhost:8080/greeting
   Hello, World!
   ```

Now, you have built and tested a native executable locally for a simple Ballerina HTTP server application. 

## Pack the native executable in a container

### Set up the prerequisites

To complete this part of the guide, you need:
1. [Ballerina 2201.3.0 (Swan Lake)](/learn/install-ballerina/set-up-ballerina/) or greater
2. A text editor
   >**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the  <a href="https://wso2.com/ballerina/vscode/docs/get-started/install-the-extension/" target="_blank">Ballerina extension</a> installed.
3. [Docker](https://www.docker.com) installed and configured in your machine
   >**Tip:** Since the GraalVM native build consumes a significant amount of memory, it is recommended to increase the memory allocated to Docker to at least 8GB and potentially add more CPUs as well. For more details, see [How to assign more memory to docker container](https://stackoverflow.com/questions/44533319/how-to-assign-more-memory-to-docker-container/44533437#44533437).
4. A command terminal

After the environment is set up, follow the steps below to build the native executable and pack it in a container.

### Build a native executable in a container

1. Execute the command below to create a Ballerina service package :
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

3. Execute `bal build --native --cloud=docker` to generate the artifacts with the native executable. Optionally, you can create a file named `Cloud.toml` in the package directory to add cloud related configurations. For more information, see the [docker](https://ballerina.io/learn/by-example/c2c-docker-deployment/) and [k8s](https://ballerina.io/learn/by-example/c2c-k8s-deployment/) documentation.
    ```
   $ bal build --native --cloud=docker
   Compiling source
       user/hello_docker:0.1.0

   Generating executable

   Generating artifacts

   Building the native image. This may take a while

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
   ========================================================================================================
   GraalVM Native Image: Generating 'hello_docker' (executable)...
   ========================================================================================================
   [1/7] Initializing...                                                                   (38.4s @ 0.41GB)
    Version info: 'GraalVM 22.2.0 Java 11 CE'
    Java version info: '11.0.16+8-jvmci-22.2-b06'
    C compiler: gcc (redhat, x86_64, 8.5.0)
    Garbage collector: Serial GC
    2 user-specific feature(s)
    - com.oracle.svm.thirdparty.gson.GsonFeature
    - io.ballerina.stdlib.crypto.svm.BouncyCastleFeature
   [2/7] Performing analysis...  [************]                                           (171.7s @ 3.36GB)
     25,054 (94.83%) of 26,419 classes reachable
     81,841 (82.43%) of 99,283 fields reachable
    147,544 (76.50%) of 192,861 methods reachable
      1,392 classes,   712 fields, and 2,489 methods registered for reflection
         91 classes,    93 fields, and    69 methods registered for JNI access
          7 native libraries: dl, m, pthread, rt, stdc++, z
   [3/7] Building universe...                                                              (13.5s @ 3.48GB)
   [4/7] Parsing methods...      [*****]                                                   (26.3s @ 2.43GB)
   [5/7] Inlining methods...     [***]                                                      (8.7s @ 2.73GB)
   [6/7] Compiling methods...    [************]                                           (155.1s @ 2.74GB)
   [7/7] Creating image...                                                                 (15.5s @ 2.95GB)
     93.75MB (61.13%) for code area:   106,991 compilation units
     59.04MB (38.49%) for image heap:  477,025 objects and 91 resources
    594.88KB ( 0.38%) for other data
    153.37MB in total
   --------------------------------------------------------------------------------------------------------
   Top 10 packages in code area:                  Top 10 object types in image heap:
     19.30MB ballerina.http/2                       15.89MB byte[] for code metadata
      4.50MB ballerina.http/2.types                 10.36MB byte[] for embedded resources
      2.82MB ballerina.io/1                          6.83MB java.lang.Class
      1.91MB ballerina.file/1                        5.03MB byte[] for java.lang.String
      1.80MB ballerina.jwt/2                         4.60MB java.lang.String
      1.60MB sun.security.ssl                        3.60MB byte[] for general heap data
      1.42MB ballerina.oauth2/2                      2.29MB com.oracle.svm.core.hub.DynamicHubCompanion
      1.25MB java.lang.invoke                        1.28MB byte[] for reflection metadata
      1.22MB com.sun.media.sound                   974.95KB java.lang.String[]
      1.06MB ballerina.lang$0046query/0            926.91KB c.o.svm.core.hub.DynamicHub$ReflectionMetadata
     56.09MB for 865 more packages                   6.28MB for 3527 more object types
   --------------------------------------------------------------------------------------------------------
              58.4s (12.6% of total time) in 124 GCs | Peak RSS: 5.41GB | CPU load: 6.50
   --------------------------------------------------------------------------------------------------------
   Produced artifacts:
    /app/build/hello_docker (executable)
    /app/build/hello_docker.build_artifacts.txt (txt)
   ========================================================================================================
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
   Successfully tagged hello_docker:latest

   Execute the below command to run the generated Docker image: 
       docker run -d -p 8080:8080 hello_docker:latest
   ```

   The Docker file :
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

4. Execute the Docker image :
   ```
   $ docker run -d -p 8080:8080 hello_docker:latest
   ```

5. Test the service with a cURL request :
   ```
   $ curl http://localhost:8080/greeting
   Hello, Docker!
   ```
   
## Known issues

- [Native image build is not working on Mac with Apple M1 chip](https://github.com/ballerina-platform/ballerina-lang/issues/39003)
- [Native image build is failing with `non-reducible loop requires too much duplication` error](https://github.com/ballerina-platform/ballerina-lang/issues/38072)
