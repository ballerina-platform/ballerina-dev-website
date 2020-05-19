---
layout: ballerina-inner-page
title: Installing Ballerina
permalink: /1.1/learn/installing-ballerina/
redirect_from:
  - /1.1/learn/getting-started
  - /1.1/learn/getting-started/
  - /v1-1/learn/getting-started
  - /v1-1/learn/getting-started/
  - /v1-1/learn/installing-ballerina/
  - /v1-1/learn/installing-ballerina
---

# Installing Ballerina

- [Prerequisites](#prerequisites)
- [Installing Ballerina via installers](#installing-ballerina-via-installers)
- [Installing from source](#installing-from-source)
- [Uninstalling Ballerina](#uninstalling-ballerina)
- [Getting help](#getting-help)
- [What's next](#what's-next)

## Prerequisites

Ballerina binary distributions are available for the following supported operating systems and architectures. Ensure that your system meets the below requirements before you proceed with the installation.
- Windows Vista SP2 x64 or later
- Ubuntu Linux 12.04 x64 - LTS and above
- OS X 10.8.3 x64 and above

## Installing Ballerina via installers

Follow the below instructions to download and use the installers to install the latest Ballerina version. The installer will automatically uninstall the old Ballerina version if you have one already installed.

>**Info:** If a binary distribution is not available for your combination of operating system and architecture, try [installing from source](#installing-from-source). 

### Installing on OS X

[Download the package file](/downloads) and double-click on it to launch the installer. The installer guides you through the installation process and installs the Ballerina distribution to `/Library/Ballerina`.

The package automatically sets your PATH environment variable for you. You may need to restart any open Terminal sessions for the change to take effect.

### Installing on Windows

[Download the MSI file](/downloads) and double-click on it to launch the installer. The installer guides you through the installation process and installs the Ballerina distribution to `C:\Program Files\Ballerina\`.

The installer should put the `C:\Program Files\Ballerina\<ballerina-directory>\bin` directory in your PATH environment variable. You may have to restart any open command prompts for the change to take effect.

### Installing on Linux

[Download the DEB file](/downloads) and double-click on it to launch the installer. The installer guides you through the installation process and installs the Ballerina distribution to `/usr/lib/ballerina`.

> **Info:** Alternatively, you can use the below command to install Ballerina using the downloaded DEB file. Replace `<ballerina-home>/<ballerina-binary>.deb` with the actual file path.

```
dpkg -i <ballerina-binary>.deb
```
  
## Installing from source

Alternatively, follow the instructions below to install Ballerina from the source.

### Setting up the prerequisites

You need to download and install the below to build the Ballerina modules.
1. Java SE Development Kit (JDK) version 8 (from one of the following locations) 
    - [Oracle](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
    - [OpenJDK](http://openjdk.java.net/install/index.html)
    >**Note:** Set the JAVA_HOME environment variable to the path name of the directory into which you installed JDK.
2. [Node.js (version 8.9.x or the latest LTS release)](https://nodejs.org/en/download/)
3. [npm (version 5.6.0 or later)](https://www.npmjs.com/get-npm)

### Obtaining the source code
Follow the steps below to obtain the Ballerina source code.

1. Execute the below command to clone the ['ballerina-lang'](https://github.com/ballerina-platform/ballerina-lang) source repository.

    ```
    git clone --recursive https://github.com/ballerina-platform/ballerina-lang.git
    ```
    >**Tip:** If you have already forked the repository to your GitHub account, then execute the below command replacing `<YOUR-GITHUB-USERNAME>` with your Git username.

    ```
    git clone --recursive https://github.com/<YOUR-GITHUB-USERNAME>/ballerina-lang.git
    ```

2. Execute the below command to update the Git submodules.

    ```
    git submodule update --init
    ```

### Building the source

Follow the steps below to build the project of the obtained source.

1. Navigate to the root directory of the Ballerina repo (i.e., `<BALLERINA_PROJECT_ROOT>`) and execute one of the below Gradle commands to build the project using Gradle.

    - **On Unix/Mac OS:** ```./gradlew build ```
    - **Windows:** ```gradlew build ```

2. Extract the built Ballerina distributions created in the below locations: 

    - **runtime only:** `<BALLERINA_PROJECT_ROOT>/distribution/zip/jballerina/build/distributions/jballerina-<version>-SNAPSHOT.zip`
    - **runtime and tools (e.g., Ballerina Language Server):** `<BALLERINA_PROJECT_ROOT>/distribution/zip/jballerina-tools/build/distributions/jballerina-tools-<version>-SNAPSHOT.zip`

>**Note:** If you face an IOException error stating “Too many open files”, this is due to the default number of possible open files being set to a lower number on your operating system than required for Ballerina to be compiled. You may have to increase the number of open files/file descriptors (FD) on your operating system to 1000000 (or higher).

## Uninstalling Ballerina

To remove an existing Ballerina installation, go to the Ballerina installation location and delete the Ballerina directory.

> **Note**:
> - The installation location is usually `/Library/Ballerina` in Mac OS X, `/usr/lib/ballerina/` in Ubuntu and `C:\Program Files\Ballerina\` in Windows.

## Getting help

To get help when you work with Ballerina, see [Community](/community).

## What's next

Once you have successfully installed Ballerina, try out the [Quick Tour](/1.1/learn/quick-tour) and take Ballerina for its first spin.
