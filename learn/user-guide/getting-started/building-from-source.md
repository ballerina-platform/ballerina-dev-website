---
layout: ballerina-left-nav-pages-swanlake
title: Building from Source
description: The sections below will guide you to build and use the basic Ballerina runtime build and also the complete Ballerina distribution build. 
keywords: ballerina, installing ballerina, programming language, build from source, distribution build, runtime build
permalink: /learn/user-guide/getting-started/building-from-source/
active: building-from-source
intro: The sections below will guide you to build and use the basic Ballerina runtime build and also the complete Ballerina distribution build. 
redirect_from:
    - /learn/user-guide/getting-started/building-from-source
---

## Setting up the Prerequisites

Follow the steps below to set up the prerequisites.

1. Download and [set up](https://adoptopenjdk.net/installation.html) OpenJDK 11 ([Adopt OpenJDK](https://adoptopenjdk.net/) or any other OpenJDK distribution).

    >**Info:** You can also use [Oracle JDK](https://www.oracle.com/java/technologies/javase-downloads.html).

2. Set up a Personal Access Token for your GitHub account and configure the following environment variables (the access token should have the `read` package permission).

    **For Unix/macOS:**

    ```bash
    export packageUser="<YOUR_GITHUB_USERNAME>";
    export packagePAT="<YOUR_PERSONAL_ACCESS_TOKEN>";
    ```

    **For Windows:**

    ```bash
    set packageUser=<YOUR_GITHUB_USERNAME>
    set packagePAT=<YOUR_PERSONAL_ACCESS_TOKEN>
    ```

## Building the Ballerina Runtime with the Tools

Follow the steps below to build the Ballerina runtime with the corresponding tools.

1. Execute the command below to fork the [`ballerina-lang` repository](https://github.com/ballerina-platform/ballerina-lang) to your GitHub account and clone it.

    ```bash
    git clone --recursive https://github.com/<GITHUB_USERNAME>/ballerina-lang.git
    ```

2. Navigate to the `<BALLERINA_LANG_PROJECT>` directory, and execute the command below to update the Git submodules.

    ```bash
    git submodule update --init
    ```

3. Execute one of the commands below to start the build process.

    **For Unix/macOS:**

    ```bash
    ./gradlew clean build
    ```

    **For Windows:**

    ```bash
    gradlew clean build
    ```

4. Extract the built Ballerina Language distribution (i.e., the `<BALLERINA_LANG_PROJECT>/distribution/zip/jballerina-tools/build/distributions/jballerina-tools-<VERSION>.zip` file) to a preferred location.
    
5. Configure the environment variables below.

    **For Unix/macOS:**

    ```bash
    # Set up the `BALLERINA_HOME` environment variable.
    export BALLERINA_HOME="<YOUR_LOCATION>/jballerina-tools-<VERSION>";

    # Include the binaries to the system `PATH`.
    PATH=$BALLERINA_HOME/bin:$PATH;
    export PATH;
    ```

    **For Windows:**

    ```bash
    # Set up the `BALLERINA_HOME` environment variable.
    set BALLERINA_HOME="<YOUR_LOCATION>\jballerina-tools-<VERSION>";

    # Include the binaries to the system `PATH`.
    set PATH=%PATH%;%BALLERINA_HOME%\bin;
    ```

### Testing the Runtime Build

Since this runtime build is just a plain Ballerina language build, you only have the basic language features and JBallerina Java (Java Introp) API in it. 

Therefore, follow the steps below to write a basic Ballerina program using only those functionalities to test the runtime build.

1. Create a `hello_world.bal` file with the code below.

    ```ballerina
    import ballerina/jballerina.java;

    public function main(string... args) {
        var systemOut = out();
        println(systemOut, java:fromString("Hello, World!"));
    }

    // Retrieves the current System output stream
    public function out() returns handle = @java:FieldGet {
        name: "out",
        'class: "java.lang.System"
    } external;

    // Calls `println` method of the  `PrintStream`
    function println(handle receiver, handle message) = @java:Method {
        paramTypes: ["java.lang.String"],
        'class: "java.io.PrintStream"
    } external;
    ```

2. Execute the command below to build and run this program.

    ```bash
    bal run hello_world.bal
    ```

    If your build is successful, you view the output below.

    ```bash
    Hello, World!
    ```

## Building the Complete Ballerina Distribution

With the [basic language distribution](#building-the-ballerina-runtime-with-the-tools), you will not get access to the Ballerina Standard Library Packages, which is one of the main features of Ballerina.

Therefore, follow the steps below to build the [`ballerina-distribution` repository](https://github.com/ballerina-platform/ballerina-distribution) as well (to get full access to the complete Ballerina distribution).

1. Execute the command below to fork the `ballerina-distribution` repository to your GitHub account and clone it.

    ```bash
    git clone --recursive https://github.com/<GITHUB_USERNAME>/ballerina-distribution.git
    ```

2. Navigate to the `<BALLERINA_DISTRIBUTION_PROJECT>` directory, and execute the command below to start the build (here, the tests are excluded to speed up the build).

    **For Unix/macOS:**

    ```bash
    ./gradlew clean build -x test
    ```

    **For Windows:**

    ```bash
    gradlew clean build -x test
    ```

3. Extract the built Ballerina Language distribution (i.e., the `<BALLERINA_DISTRIBUTION_PROJECT>/ballerina/build/distributions/ballerina-<VERSION>.zip` file) to a preferred location.
    
4. Configure the environment variables below.

    **For Linux/Unix/macOS:**

    ```bash
    # Set up the `BALLERINA_HOME` environment variable.
    export BALLERINA_HOME="<YOUR_LOCATION>/ballerina-<VERSION>";

    # Include the binaries to the system `PATH`.
    PATH=$BALLERINA_HOME/bin:$PATH;
    export PATH;
    ```

    **For Windows:**

    ```bash
    # Set up the `BALLERINA_HOME` environment variable.
    set BALLERINA_HOME="<YOUR_LOCATION>\ballerina-<VERSION>";

    # Include the binaries to the system `PATH`.
    set PATH=%PATH%;%BALLERINA_HOME%\bin;
    ```

### Testing the Distribution Build

Since this is a complete Ballerina distribution build, this will have all the Standard Library module dependencies included in it. 

Therefore, follow the steps below to write a simple program using the Ballerina [`io` module](https://github.com/ballerina-platform/module-ballerina-io/) to test the distribution build.

1. Create a `hello_world_with_io.bal` file with the code below.

    ```ballerina
    import ballerina/io;

    // ballerina hello world program
    public function main() {
    io:println("Hello, World with IO!");
    }
    ```

2. Execute the command below to build and run this program.

    ```bash
    bal run hello_world_with_io.bal
    ```

    If your build is successful, you view the output below.

    ```bash
    Hello, World with IO!
    ```
