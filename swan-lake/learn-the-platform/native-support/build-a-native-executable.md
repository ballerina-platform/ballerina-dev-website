---
title: "Build a GraalVM executable"
permalink: /learn/build-graalvm-executable/
description: This guide walks you through the GraalVM native executable support in Ballerina, starting with compiling a Ballerina application to a native executable and packing. 
keywords: ballerina, programming language, ballerina packages, language-guide, graalvm
active: build-a-graalvm-executable
intro: This guide walks you through the GraalVM native executable support in Ballerina, starting with compiling a Ballerina application to a native executable and packing.
---

This feature was officially supported in the Swan Lake Update 7 release. In case you come across any issues do report them as the Ballerina community will be aggressively addressing them.

The key aspects below help you understand the GraalVM executable generating process better.

## GraalVM

Building a Ballerina native executable requires the [GraalVM](https://www.graalvm.org) [native-image](https://www.graalvm.org/22.3/reference-manual/native-image/) compiler. GraalVM is a high-performance, cloud-native, and polyglot JDK designed to accelerate the execution of applications. There are three different distributions of GraalVM: Oracle GraalVM Community Edition (CE), Oracle GraalVM Enterprise Edition (EE), and Mandrel. You can install any to use the Ballerina native functionality.

- GraalVM CE is the free version of GraalVM, which is distributed under GPLv2+CE.
- GraaLVM EE is the paid version of GraalVM, which comes with a few additional features such as options for GC, debugging, and other optimizations.
- Mandrel is a downstream distribution of the Oracle GraalVM CE, which is maintained by Red Hat.

This article uses GraalVM CE to discuss the following topics.

## GraalVM executable vs. Uber Jar

When compiling a  Ballerina application using the `bal build` command the output is an uber JAR file. As you already know, running the JAR requires a JVM. JVM uses a Just In Time (JIT) compiler to generate native code during runtime.

On the other hand, when compiling a Ballerina application using `bal build --graalvm`, the output is the GraalVM executable local to the host machine. In order to build the GraalVM executable, GraalVM uses Ahead Of Time compilation (AOT), which requires the generated uber JAR as the input to produce the native executable. Native Image generation performs aggressive optimizations such as unused code elimination in the JDK and its dependencies, heap snapshotting, and static code initializations.

The difference between both approaches results in different pros and cons as depicted in the spider graph below.

<img src="/learn/images/aot-vs-jit.png" alt="AOT vs JIT" height="520" style="width: auto !important; padding-top: 20px; padding-bottom: 20px">

As depicted in the image, AOT compilation with GraalVM provides the following advantages over the standard JIT compilation making it ideal for container runtimes.
- Use a fraction of the resources required by the JVM.
- Applications start in milliseconds.
- Deliver peak performance immediately with no warmup.
- Can be packaged into lightweight container images for faster and more efficient deployments.
- Reduced attack surface.

The only downside is that the GraalVM native image build is a highly complicated process, which may consume a lot of memory and CPU resulting in an extended build time. However, the GraalVM community is continuously working on improving its performance.

## Ballerina native image

From Ballerina 2201.7.0 (SwanLake) onwards, Ballerina supports GraalVM AOT compilation to generate standalone executables by passing the `graalvm` flag in the build command: `bal build --graalvm`. The generated executable contains the modules in the current package, their dependencies, Ballerina runtime, and statically linked native code from the JDK.

Ballerina runtime, [standard libraries](/learn/ballerina-specifications/#standard-library-specifications), and the Ballerina extended modules are GraalVM-compatible. Therefore packages developed only using these libraries are also GraalVM-compatible. Furthermore, Ballerina reports warnings when the GraalVM build is executed for a project with GraalVM-incompatible packages.

## Build the native executable locally

### Set up the prerequisites

To complete this part of the guide, you need:
1. [Ballerina 2201.7.0 (Swan Lake)](/learn/install-ballerina/set-up-ballerina/) or greater
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
> - On the ARM64 architecture of macOS, the Ballerina native image build will work with Ballerina 2201.5.0 (Swan Lake) or greater. For more information, see [this issue comment](https://github.com/ballerina-platform/ballerina-lang/issues/39003#issuecomment-1498765016).
> - The GraalVM native-image tool support for Apple M1 (darwin-aarch64) is still experimental. For more updates, see [Support for Apple M1](https://github.com/oracle/graal/issues/2666).

After the environment is set up, follow the steps below to build a native executable for a simple Ballerina HTTP server application.

### Build the GraalVM executable

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

3. Run `bal build --graalvm` to create the graalvm executable.
   ```
   $ bal build --graalvm

   Compiling source
        user/hello_world:0.1.0

   ==============================================================================================
   GraalVM Native Image: Generating 'hello_world' (executable)...
   ==============================================================================================
   [1/7] Initializing...                                                          (7.3s @ 0.47GB)
    Version info: 'GraalVM 22.3.1 Java 11 CE'
    Java version info: '11.0.18+10-jvmci-22.3-b13'
    C compiler: cc (apple, arm64, 14.0.3)
    Garbage collector: Serial GC
    2 user-specific feature(s)
    - com.oracle.svm.thirdparty.gson.GsonFeature
    - io.ballerina.stdlib.crypto.svm.BouncyCastleFeature
   [2/7] Performing analysis...  [***********]                                  (116.0s @ 2.63GB)
     24,926 (93.71%) of 26,599 classes reachable
     81,454 (81.08%) of 100,467 fields reachable
    134,363 (72.76%) of 184,660 methods reachable
      1,477 classes,    15 fields, and 2,740 methods registered for reflection
         91 classes,    94 fields, and    66 methods registered for JNI access
          6 native libraries: -framework CoreServices,-framework Foundation,dl,pthread,stdc++,z
   [3/7] Building universe...                                                    (12.4s @ 4.55GB)
   [4/7] Parsing methods...      [*****]                                         (21.1s @ 3.22GB)
   [5/7] Inlining methods...     [***]                                            (7.3s @ 4.51GB)
   [6/7] Compiling methods...    [********]                                      (75.3s @ 4.54GB)
   [7/7] Creating image...                                                        (9.9s @ 5.48GB)
     87.22MB (58.51%) for code area:    97,270 compilation units
     60.14MB (40.34%) for image heap:  472,434 objects and 32 resources
      1.72MB ( 1.15%) for other data
    149.07MB in total
   ----------------------------------------------------------------------------------------------
   Top 10 packages in code area:         Top 10 object types in image heap:
     15.91MB ballerina.http/2              14.81MB byte[] for code metadata
      4.17MB ballerina.http/2.types         3.09MB byte[] for embedded resources
      2.83MB ballerina.io/1                 6.54MB java.lang.Class
      1.59MB sun.security.ssl               5.06MB byte[] for java.lang.String
      1.37MB ballerina.file/1               4.62MB java.lang.String
      1.19MB com.sun.media.sound            3.64MB byte[] for general heap data
      1.19MB ballerina.jwt/2                2.28MB com.oracle.svm.core.hub.DynamicHubCompanion
      1.14MB ballerina.http/2.creators      1.19MB byte[] for reflection metadata
      1.07MB ballerina.oauth2/2           963.28KB java.lang.String[]
      1.06MB ballerina.lang$0046query/0   922.42KB c.o.svm.core.hub.DynamicHub$ReflectionMetadata
     55.13MB for 889 more packages        6.12MB for 3467 more object types
   ----------------------------------------------------------------------------------------------
              36.0s (13.6% of total time) in 60 GCs | Peak RSS: 3.53GB | CPU load: 3.18
   ----------------------------------------------------------------------------------------------
   Produced artifacts:
    /Users/user/hello_world/target/bin/hello_world (executable)
    /Users/user/hello_world/target/bin/hello_world.build_artifacts.txt (txt)
   ==============================================================================================
   Finished generating 'hello_world' in 4m 24s.
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

## Pack the GraalVM executable in a container

### Set up the prerequisites

To complete this part of the guide, you need:
1. [Ballerina 2201.7.0 (Swan Lake)](/learn/install-ballerina/set-up-ballerina/) or greater
2. A text editor
   >**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the  <a href="https://wso2.com/ballerina/vscode/docs/get-started/install-the-extension/" target="_blank">Ballerina extension</a> installed.
3. [Docker](https://www.docker.com) installed and configured in your machine
   >**Tip:** Since the GraalVM native build consumes a significant amount of memory, it is recommended to increase the memory allocated to Docker to at least 8GB and potentially add more CPUs as well. For more details, see [How to assign more memory to Docker container](https://stackoverflow.com/questions/44533319/how-to-assign-more-memory-to-docker-container/44533437#44533437).
4. A command terminal

After the environment is set up, follow the steps below to build the native executable and pack it in a container.

### Build the GraalVM executable in a container

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

3. Execute `bal build --graalvm --cloud=docker` to generate the artifacts with the native executable. Optionally, you can create a file named `Cloud.toml` in the package directory to add cloud related configurations. For more information, see [Docker](/learn/by-example/c2c-docker-deployment/) and [Kubernetes](/learn/by-example/c2c-k8s-deployment/) documentation.
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
   
## Evaluate GraalVM compatibility

It is recommended to use the JVM for verifying the functionality of the application with sufficient tests and code coverage as running tests against the GraalVM native image could take time. Running tests against the native image is only required when you see GraalVM incompatibility warnings during `bal build --graalvm`. 

```
***************************************************************************
* WARNING: Some dependencies may not be GraalVM compatible.               *
***************************************************************************

The following Ballerina dependencies in your project could pose compatibility
issues with GraalVM. 

Packages pending compatibility verification with GraalVM:

- PackageA
- PackageB
- PackageC

Packages marked as incompatible with GraalVM:

- PackageA
- PackageB
- PackageC

Please note that generating a GraalVM native image may fail or result in runtime
issues if these packages rely on features that are not supported by GraalVM's
native image generation process.

It is recommended to review the API documentation or contact the maintainers of
these packages for more information on their GraalVM compatibility status. You
may need to adjust or find alternatives for these packages before proceeding
with GraalVM native image generation.

****************************************************************************
```

Therefore, if the application depends on a package that is not verified against the GraalVM native image build, it is recommended to run the tests against the native image to ensure that there are no runtime issues by executing the `bal test --graalvm` command.

Also, native testing can be scheduled as a daily check within CI(Continuous Integration) pipelines to maintain compatibility with GraalVM.

Follow the steps below to run the tests with the native image.


1. Follow steps 1 and 2 in [Build the native executable](#build-the-native-executable).

2. Replace the content of the `service_test.bal` file with the following under the `tests` folder.  
   ```ballerina
   import ballerina/http;
   import ballerina/test;

   http:Client testClient = check new ("http://localhost:8080");

   @test:Config {}
   function testServiceWithProperName() {
      string|error response = testClient->get("/greeting");
      test:assertEquals(response, "Hello, World!");
   }

   ```

3.  Run `bal test --graalvm` to run the tests using the GraalVM executable. 
      > **Info:**  This command will build a native executable with tests similar to `bal build --native` , and the tests will be executed by running this native executable.
      ```
               Running Tests
               hello_world
                        [pass] testServiceWithProperName
                        1 passing
                        0 failing
                        0 skipped
      ```

Now, you  tested a simple Ballerina HTTP server application for GraalVM compatibility.

> **Note:** Code coverage  and runtime debug features are not supported with native image testing. 

## Create GraalVM-compatible library packages

Packages that solely use Ballerina standard libraries and connectors or those that use platform Java libraries provided by the distribution are inferred to be compatible with GraalVM.

If the package utilizes any Java platform libraries specified in the Ballerina.toml, it falls upon the package author to ensure that it remains compatible with GraalVM even after incorporating these platform dependencies. In the event that GraalVM compatibility has not been confirmed by the user, the bal pack command will trigger a warning message.

```
****************************************************************************
* WARNING: Package is not verified with GraalVM.                           *
****************************************************************************

The GraalVM compatibility property has not been defined for the package
'<package-name>. This could potentially lead to compatibility issues with GraalVM.

To resolve this warning, please ensure that all Java dependencies of this
package are compatible with GraalVM. Subsequently, update the Ballerina.toml
file under the section '[platform.<java*>]' with the attribute
'graalvmCompatible = true'.

****************************************************************************
```

In that scenario, the package owner should evaluate the GraalVM-compatibility with `bal test --graalvm`. If the package has sufficient test cases to verify the compatibility, the package can be marked as GraalVM-compatible by adding the following to the Ballerin.toml file.
```toml
[platform.java11]
graalvmCompatible = true
```

## Configure GraalVM native image build options

GraalVM native image has build options that can be passed to the native-image builder. For a Ballerina application, these options can be configured in the Ballerina.toml file as follows.
```toml
[build-options]
graalvmBuildOptions = "--verbose --static"
```

The options can be also passed as an argument to the build and test commands.
```
$ bal build --graalvm --graalvm-build-options="--static"
```
```
$ bal test --graalvm --graalvm-build-options="--static"
```
