---
title: Build Ballerina from source
description: Follow this guide to build Ballerina from source and contribute to the project..
keywords: ballerina, installing ballerina, programming language, ballerina installation, build from source
---

## Overview

[Building the complete Ballerina distribution](#building-the-complete-ballerina-distribution) provides you access to all the main features of Ballerina such as the runtime, corresponding tools, standard library modules etc.

>**Info:** However, if you need just a plain Ballerina language build with only the basic language features and the JBallerina Java (Java Introp) API in it, you can [build only the Ballerina Runtime with the tools](#building-only-the-ballerina-runtime-with-the-tools)


## Set up the prerequisites

Follow the steps below to set up the prerequisites.

1. Download and [set up](https://adoptopenjdk.net/installation.html) OpenJDK 21 ([Adopt OpenJDK](https://adoptopenjdk.net/) or any other OpenJDK distribution).

   >**Info:** You can also use [Oracle JDK](https://www.oracle.com/java/technologies/javase-downloads.html).

2. Set up a [Personal Access Token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) for your GitHub account and configure the following environment variables (the access token should have the `read` package permission).

   **For Unix/macOS:**

    ```
    export packageUser="<YOUR_GITHUB_USERNAME>";
    export packagePAT="<YOUR_PERSONAL_ACCESS_TOKEN>";
    ```

   **For Windows:**

    ```
    set packageUser=<YOUR_GITHUB_USERNAME>
    set packagePAT=<YOUR_PERSONAL_ACCESS_TOKEN>
    ```

## Build the complete Ballerina distribution

Follow the steps below to build the [`ballerina-distribution` repository](https://github.com/ballerina-platform/ballerina-distribution) to get full access to the complete Ballerina distribution.

1. Fork the `ballerina-distribution` repository to your GitHub account and execute following command to clone it.

    ```
    $ git clone --recursive https://github.com/<GITHUB_USERNAME>/ballerina-distribution.git
    ```

2. Navigate to the `<BALLERINA_DISTRIBUTION_PROJECT>` directory, and execute the command below to start the build (here, the tests are excluded to speed up the build).

   **For Unix/macOS:**

    ```
    $ ./gradlew clean build -x test
    ```

   **For Windows:**

    ```
    $ gradlew clean build -x test
    ```

3. Extract the built Ballerina Language distribution (i.e., the `<BALLERINA_DISTRIBUTION_PROJECT>/ballerina/build/distributions/ballerina-<VERSION>.zip` file) to a preferred location.

4. Configure the environment variables below.

   **For Unix/macOS:**

    ```
    # Set up the `BALLERINA_HOME` environment variable.
    export BALLERINA_HOME="<YOUR_LOCATION>/ballerina-<VERSION>";

    # Include the binaries to the system `PATH`.
    PATH=$BALLERINA_HOME/bin:$PATH;
    export PATH;
    ```

   **For Windows:**

    ```
    # Set up the `BALLERINA_HOME` environment variable.
    set BALLERINA_HOME="<YOUR_LOCATION>\ballerina-<VERSION>";

    # Include the binaries to the system `PATH`.
    set PATH=%PATH%;%BALLERINA_HOME%\bin;
    ```

### Test the distribution build

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

    ```
    $ bal run hello_world_with_io.bal
    ```

   If your build is successful, you view the output below.

    ```
    Hello, World with IO!
    ```

## Build only the Ballerina runtime with the tools

Follow the steps below to build just the Ballerina runtime with the corresponding tools.

1. Fork the [`ballerina-lang` repository](https://github.com/ballerina-platform/ballerina-lang) to your GitHub account and execute following command to clone it.

    ```
    $ git clone --recursive https://github.com/<GITHUB_USERNAME>/ballerina-lang.git
    ```

2. Navigate to the `<BALLERINA_LANG_PROJECT>` directory, and execute the command below to update the Git submodules.

    ```
    $ git submodule update --init
    ```

3. Execute one of the commands below to start the build process.

   **For Unix/macOS:**

    ```
    $ ./gradlew clean build
    ```

   **For Windows:**

    ```
    $ gradlew clean build
    ```

4. Extract the built Ballerina Language distribution (i.e., the `<BALLERINA_LANG_PROJECT>/distribution/zip/jballerina-tools/build/distributions/jballerina-tools-<VERSION>.zip` file) to a preferred location.

5. Configure the environment variables below.

   **For Unix/macOS:**

    ```
    # Set up the `BALLERINA_HOME` environment variable.
    export BALLERINA_HOME="<YOUR_LOCATION>/jballerina-tools-<VERSION>";

    # Include the binaries to the system `PATH`.
    PATH=$BALLERINA_HOME/bin:$PATH;
    export PATH;
    ```

   **For Windows:**

    ```
    # Set up the `BALLERINA_HOME` environment variable.
    set BALLERINA_HOME="<YOUR_LOCATION>\jballerina-tools-<VERSION>";

    # Include the binaries to the system `PATH`.
    set PATH=%PATH%:%BALLERINA_HOME%\bin;
    ```

### Test the runtime build

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

    ```
    $ bal run hello_world.bal
    ```

   If your build is successful, you view the output below.

    ```
    Hello, World!
    ```

