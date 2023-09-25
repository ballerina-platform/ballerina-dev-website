---
title: "GraalVM executable overview"
permalink: /learn/graalvm-executable-overview/
description: The overview of GraalVM and the native executable. 
keywords: ballerina, programming language, ballerina packages, language-guide, graalvm, native, executable
active: graalvm-executable-overview
intro: With the release of Swan Lake Update 7, generating GraalVM executables is officially supported in Ballerina.
---

Building a Ballerina GraalVM native executable requires the [GraalVM](https://www.graalvm.org) [native-image](https://www.graalvm.org/22.3/reference-manual/native-image/) compiler. GraalVM is a high-performance, cloud-native, and polyglot JDK designed to accelerate the execution of applications. There are four different distributions of GraalVM: GraalVM Community Edition (CE), GraalVM Enterprise Edition (EE), Oracle GraalVM and Mandrel. You can install any to use the Ballerina GraalVM native functionality.

- GraalVM CE is the free version of GraalVM, which is distributed under GPLv2+CE.
- GraaLVM EE is the paid version of GraalVM, which comes with a few additional features such as options for GC, debugging, and other optimizations.
- Oracle GraalVM is the new distribution from Oracle available under the [GraalVM Free Terms and Conditions license](https://www.oracle.com/downloads/licenses/graal-free-license.html).
- Mandrel is a downstream distribution of the Oracle GraalVM CE, which is maintained by Red Hat.

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

## Ballerina GraalVM executable

From Ballerina 2201.7.0 (SwanLake) onwards, Ballerina supports GraalVM AOT compilation to generate standalone executables by passing the `graalvm` flag in the build command: `bal build --graalvm`. The generated executable contains the modules in the current package, their dependencies, Ballerina runtime, and statically linked native code from the JDK.

The Ballerina runtime and [Ballerina library](https://central.ballerina.io/search?q=org%3Aballerina%2Cballerinax&page=1) are GraalVM-compatible. Therefore packages developed only using these libraries are also GraalVM-compatible. Furthermore, Ballerina reports warnings when the GraalVM build is executed for a project with GraalVM-incompatible packages.

## Configure GraalVM native image build options

GraalVM native image has build options that can be passed to the native-image builder. For a Ballerina application, these options can be configured in the `Ballerina.toml` file as follows.
```toml
[build-options]
graalvmBuildOptions = "--verbose -H:+StaticExecutableWithDynamicLibC"
```

The options can be also passed as an argument to the build and test commands.
```
$ bal build --graalvm --graalvm-build-options="-H:+StaticExecutableWithDynamicLibC"
```
```
$ bal test --graalvm --graalvm-build-options="-H:+StaticExecutableWithDynamicLibC"
```

## Build the GraalVM executable

There are two ways to build the GraalVM native executable for a Ballerina application using the GraalVM Community Edition (CE).

- [Build the GraalVM executable in a container](/learn/build-the-executable-in-a-container)
- [Build the GraalVM executable locally](/learn/build-the-executable-locally)
