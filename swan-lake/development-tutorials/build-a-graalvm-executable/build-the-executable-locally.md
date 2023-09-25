---
title: "Build the GraalVM executable locally"
permalink: /learn/build-the-executable-locally/
description: Building the GraalVM executable locally from Ballerina. 
keywords: ballerina, programming language, ballerina packages, language-guide, graalvm, native, executable
active: build-the-executable-locally
intro: This guide walks you through compiling a Ballerina application to a native executable in the local setup.
---

## Prerequisites

To complete this part of the guide, you need:
1. Latest [Ballerina Swan Lake](/downloads) distribution
   > **Note:** If you are using macOS with an ARM64 processor, then, install Ballerina using the [ARM64 installer](/downloads).
2. A text editor
   >**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the  <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina extension</a> installed.
3. GraalVM installed and configured appropriately
4. A command terminal

## Configure GraalVM

1. Install GraalVM using [SDKMAN!](https://sdkman.io/). 
   >**Tip:** For additional download options, see [Get Started with GraalVM](https://www.graalvm.org/jdk17/docs/getting-started/).

      ```
      $ sdk install java 17.0.7-graalce
      ```
      > **Note:** If you have installed Ballerina Swan Lake Update 7(2201.7.x) or lower, you have to install GraalVM JDK 11. For download options, see [Get Started with GraalVM](https://www.graalvm.org/22.3/docs/getting-started/macos/).
2. Set the `GRAALVM_HOME` environment variable to the GraalVM installation directory. If you have installed using SDKMAN! you can set it to `JAVA_HOME`.

> **Note:** 
> - On Windows, the native image requires Visual Studio Code and Microsoft Visual C++ (MSVC). For more details, see [Prerequisites for Native Image on Windows](https://www.graalvm.org/latest/docs/getting-started/windows/#prerequisites-for-native-image-on-windows).
> - The GraalVM native-image tool support for Apple M1 (darwin-aarch64) is still experimental. For more updates, see [Support for Apple M1](https://github.com/oracle/graal/issues/2666).

After the environment is set up, follow the steps below to build a native executable for a simple Ballerina HTTP server application.

## Build the GraalVM executable

1. Execute the command below to create a Ballerina service package.
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

3. Run `bal build --graalvm` to create the GraalVM executable.
   ```
   $ bal build --graalvm

   Compiling source
           ballerina/hello_world:0.1.0

   ===============================================================================================
   GraalVM Native Image: Generating 'hello_world' (executable)...
   ===============================================================================================
   [1/8] Initializing...                                                           (5.8s @ 0.30GB)
    Java version: 17.0.8+7, vendor version: GraalVM CE 17.0.8+7.1
    Graal compiler: optimization level: 2, target machine: armv8-a
    C compiler: cc (apple, arm64, 14.0.3)
    Garbage collector: Serial GC (max heap size: 80% of RAM)
    2 user-specific feature(s)
    - com.oracle.svm.thirdparty.gson.GsonFeature
    - io.ballerina.stdlib.crypto.svm.BouncyCastleFeature
   [2/8] Performing analysis...  [*******]                                        (50.9s @ 2.63GB)
     24,957 (92.94%) of 26,854 types reachable
     81,899 (80.56%) of 101,665 fields reachable
    137,486 (72.86%) of 188,711 methods reachable
      5,160 types,   117 fields, and 3,566 methods registered for reflection
         85 types,    74 fields, and    65 methods registered for JNI access
          5 native libraries: -framework CoreServices, -framework Foundation, dl, pthread, z
   [3/8] Building universe...                                                      (8.1s @ 2.33GB)
   [4/8] Parsing methods...      [***]                                             (5.3s @ 3.01GB)
   [5/8] Inlining methods...     [***]                                             (2.7s @ 3.22GB)
   [6/8] Compiling methods...    [******]                                         (42.5s @ 2.24GB)
   [7/8] Layouting methods...    [***]                                             (7.2s @ 4.20GB)
   [8/8] Creating image...       [***]                                            (11.1s @ 4.29GB)
     84.96MB (57.36%) for code area:    99,712 compilation units
     61.55MB (41.55%) for image heap:  488,592 objects and 34 resources
      1.61MB ( 1.09%) for other data
    148.12MB in total
   -----------------------------------------------------------------------------------------------
   Top 10 origins of code area:       Top 10 object types in image heap:
     62.81MB hello_world.jar            16.05MB byte[] for code metadata
     11.99MB java.base                  13.10MB byte[] for embedded resources
      3.03MB java.xml                    6.59MB java.lang.Class
      1.41MB java.desktop                5.32MB byte[] for java.lang.String
      1.30MB svm.jar (Native Image)      4.81MB java.lang.String
      1.21MB java.net.http               3.80MB byte[] for general heap data
    589.89kB java.naming                 2.09MB com.oracle.svm.core.hub.DynamicHubCompanion
    466.25kB java.management             1.28MB byte[] for reflection metadata
    458.28kB java.rmi                    1.00MB java.lang.String[]
    318.20kB jdk.crypto.ec             928.40kB c.o.svm.core.hub.DynamicHub$ReflectionMetadata
    892.91kB for 21 more packages        6.30MB for 3528 more object types
   -----------------------------------------------------------------------------------------------
   Recommendations:
    HEAP: Set max heap for improved and more predictable memory usage.
    CPU:  Enable more CPU features with '-march=native' for improved performance.
   -----------------------------------------------------------------------------------------------
             18.5s (13.6% of total time) in 109 GCs | Peak RSS: 5.11GB | CPU load: 5.08
   -----------------------------------------------------------------------------------------------
   Produced artifacts:
    /Users/ballerina/hello_world/target/bin/hello_world (executable)
   ===============================================================================================
   Finished generating 'hello_world' in 2m 14s.
   ```

   > **Note:** On Windows, the Microsoft Native Tools for Visual Studio must be initialized before building a native image. You can do this by starting the **x64 Native Tools Command Prompt** that was installed with the Visual Studio Build Tools. In the x64 Native Tools Command Prompt, navigate to your project folder and run `bal build --graalvm`.

4. Execute the command below to run the native executable.
   ```
   $ ./target/bin/hello_world
   ```

5. Test the service with a cURL request.
   ```
   $ curl http://localhost:8080/greeting
   Hello, World!
   ```

Now, you have built and tested a native executable locally for a simple Ballerina HTTP server application. 

## Evaluate GraalVM compatibility

It is recommended to use the JVM for verifying the functionality of the application with sufficient tests and code coverage as running tests against the GraalVM native image could take time. Running tests against the native image is only required when you see GraalVM incompatibility warnings during `bal build --graalvm`. 

```
*********************************************************************************
* WARNING: Some dependencies may not be GraalVM compatible.                     *
*********************************************************************************

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

*********************************************************************************
```

If the application depends on a package that is not verified against the GraalVM native image build, it is recommended to run the tests against the native image by executing the `bal test --graalvm` command to ensure that there are no runtime issues.

Also, GraalVM native testing can be scheduled as a daily check within CI(Continuous Integration) pipelines to maintain compatibility with GraalVM.

Follow the steps below to run the tests with the native image.


1. Follow steps 1 and 2 in [Build the GraalVM executable](#build-the-graalvm-executable).

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
      > **Info:**  This command will build a native executable with tests similar to `bal build --graalvm`, and the tests will be executed by running this native executable.
      ```
               Running Tests
               hello_world
                        [pass] testServiceWithProperName
                        1 passing
                        0 failing
                        0 skipped
      ```

Now, you tested a simple Ballerina HTTP server application for GraalVM compatibility.

> **Note:** Code coverage  and runtime debug features are not supported with GraalVM native image testing. 

## Create GraalVM-compatible library packages

Packages that solely use Ballerina library packages or those that use platform Java libraries provided by the distribution are inferred to be compatible with GraalVM.

If the package utilizes any Java platform libraries specified in the `Ballerina.toml`, it falls upon the package author to ensure that it remains compatible with GraalVM even after incorporating these platform dependencies. In the event that GraalVM compatibility has not been confirmed by the user, the bal pack command will trigger a warning message.

```
**********************************************************************************
* WARNING: Package is not verified with GraalVM.                                 *
**********************************************************************************

The GraalVM compatibility property has not been defined for the package
'<package-name>. This could potentially lead to compatibility issues with GraalVM.

To resolve this warning, please ensure that all Java dependencies of this
package are compatible with GraalVM. Subsequently, update the Ballerina.toml
file under the section '[platform.<java*>]' with the attribute
'graalvmCompatible = true'.

**********************************************************************************
```

In that scenario, the package owner should evaluate the GraalVM-compatibility with `bal test --graalvm`. If the package has sufficient test cases to verify the compatibility, the package can be marked as GraalVM-compatible by adding the following to the Ballerina.toml file.
```toml
[platform.java17]
graalvmCompatible = true
```
