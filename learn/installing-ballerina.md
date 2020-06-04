---
layout: ballerina-left-nav-pages
title: Installing Ballerina
description: Get started with the Ballerina programming language by following these instructions on installing and setting up Ballerina.
keywords: ballerina, installing ballerina, programming language, ballerina installation
permalink: /learn/installing-ballerina/
active: installing-ballerina
redirect_from:
  - /v1-2/learn/getting-started
  - /learn/getting-started
  - /learn/getting-started/
  - /learn/installing-ballerina
  - /learn/installing-ballerina/#installing-from-source
  - /v1-2/learn/installing-ballerina
  - /v1-2/learn/installing-ballerina/
---

# Installing Ballerina

- [Updating Ballerina](#updating-ballerina)
- [Installing Ballerina via installers](#installing-ballerina-via-installers)
- [Installing via the Ballerina language ZIP file](#installing-via-the-ballerina-language-zip-file)
- [Building from source](#building-from-source)
- [Uninstalling Ballerina](#uninstalling-ballerina)
- [Getting help](#getting-help)
- [What is next](#what-is-next)

## Updating Ballerina

If you already have a jBallerina version installed, you can use the update tool (by executing the below commands) to update to the latest jBallerina version as follows. 

>**Note:** If you are a new user who has not installed jBallerina, install via the [installers](#installing-ballerina-via-installers).

**The jBallerina Version**|**Update Tool Usage**
:-----:|:-----:
jBallerina version 1.2.0 or above|`ballerina dist update`
jBallerina 1.2.0 but switched to a previous version|`ballerina dist pull jballerina-<LATEST-VERSION>`
jBallerina version 1.1.0 or below|Use the [installers](#installing-ballerina-via-installers)


## Installing Ballerina via installers

Ballerina installers support the below operating systems:

- Windows 7 or later
- Ubuntu Linux 
- Red Hat Enterprise Linux
- Cent OS
- Mac OS 

>**Info:** If you are using an unsupported operating system, [install via the Ballerina language ZIP file](#installing-via-the-ballerina-language-zip-file).

Follow the below instructions to download and use the installers to install the latest Ballerina version. The installer will automatically uninstall the old Ballerina version if you have one already installed.

### Installing on Mac OS

[Download the package file](/downloads) and double-click on it to launch the installer. The installer guides you through the installation process and installs the Ballerina distribution in the `/Library/Ballerina` directory.

The package automatically sets your PATH environment variable for you. You may need to restart any open Terminal sessions for the change to take effect.

### Installing on Windows

[Download the MSI file](/downloads) and double-click on it to launch the installer. The installer guides you through the installation process and installs the Ballerina distribution in the `C:\Program Files\Ballerina\` directory.

The installer should put the `C:\Program Files\Ballerina\<ballerina-directory>\bin` directory in your PATH environment variable. You may have to restart any open command prompts for the change to take effect.

### Installing on Linux

[Download the DEB file or RPM file](/downloads) and double-click on it to launch the installer. The installer guides you through the installation process and installs the Ballerina distribution in the `/usr/lib64/ballerina`directory.

> **Info:** Alternatively, you can use either of the below commands to install Ballerina using the downloaded DEB or RPM file. Replace the `ballerina-linux-installer-x64-<BALLERINA-VERSION>.deb` or `ballerina-linux-installer-x64<BALLERINA-VERSION>.rpm` with the actual file path. 

For the DEB file:
```
dpkg -i ballerina-linux-installer-x64-<JBALLERINA-VERSION>.deb 
```

For the RPM file:
```
rpm -i ballerina-linux-installer-x64<JBALLERINA-VERSION>.rpm 
```

## Installing via the Ballerina language ZIP file

> **Note:** Before you install Ballerina using the ZIP file, ensure that you have Java Development Kit (JDK) version 1.8 installed.

1. [Download the Ballerina language ZIP file](/downloads) and unzip it to a preferred location using an archiver tool of your choice. This creates a directory named ballerina-<VERSION> in your system.

2. Follow either of the steps below depending on your operating system to configure your system environment to run Ballerina:

 - **For Linux or Mac OS:** set the PATH environment variable to point to the bin directory of the unzipped Ballerina distribution.
 - **For Windows:** add a new environment variable specifying the following values:
   - **Variable name:** PATH
   - **Variable value:** The location of the bin directory of the unzipped Ballerina distribution. For example, C:\Program Files\Ballerina\ballerina-<VERSION>\bin
  
## Building from source

Alternatively, follow the instructions below to build Ballerina from the source.

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

Usually,the installation location is `/Library/Ballerina/distributions` in Mac OS, `/usr/lib64/Ballerina/distributions` in Linux, and `C:\Program Files\Ballerina\distributions` in Windows. You can either remove a particular jBallerina version or all the jBallerina versions installed in these locations.

Navigate to the corresponding installation location and follow the instructions below. To remove:

- a particluar jBallerina version: execute `ballerina dist remove` or delete the required version from the `/../Ballerina/distributions` directory.
- all the installed jBallerina versions: delete the `/../Ballerina` directory.

## Getting help

To get help when you work with Ballerina, see [Community](/community).

## What is next

Once you have successfully installed Ballerina, click the below links to set up your IDE.

- [Setting up Visual Studio Code](/learn/vscode-plugin/)
- [Setting up IntelliJ IDEA](/learn/intellij-plugin/)
