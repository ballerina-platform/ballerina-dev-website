---
layout: ballerina-getting-started-left-nav-pages-swanlake
title: Installing Ballerina
description: Get started with the Ballerina programming language by following these instructions on installing and setting up Ballerina.
keywords: ballerina, installing ballerina, programming language, ballerina installation
permalink: /swan-lake/learn/getting-started/installing-ballerina/
active: installing-ballerina
intro: The sections below include information about installing Ballerina.
redirect_from:
  - /swan-lake/learn/installing-ballerina
  - /swan-lake/learn/installing-ballerina/
  - /swan-lake/learn/installing-ballerina/#installing-from-source
  - /swan-lake/learn/installing-ballerina/#installing-from-source/
---

## Installing Ballerina via Installers

Follow the instructions below to install the latest Ballerina version using the installer. The installer will automatically uninstall the old Ballerina version if you have one already installed.

>**Info:** Ballerina installers support operating systems such as Windows, Ubuntu, Red Hat Enterprise Linux, macOS, and CentOS. If you are using an unsupported operating system, [install via the Ballerina language ZIP file](#installing-via-the-ballerina-language-zip-file).

### Installing on macOS

[Download the package file](/downloads) and double-click on it to launch the installer. The installer guides you through the installation process and installs the Ballerina distribution in the `/Library/Ballerina` directory.

The package automatically sets your PATH environment variable for you. You may need to restart any open Terminal sessions for the change to take effect.

### Installing on Windows

[Download the MSI file](/downloads) and double-click on it to launch the installer. The installer guides you through the installation process and installs the Ballerina distribution in the `C:\Program Files\Ballerina` directory.

The installer should put the `C:\Program Files\Ballerina\<BALLERINA-DIRECTORY>\bin` directory in your PATH environment variable. You may have to restart any open command prompts for the change to take effect.

### Installing on Linux

[Download the DEB file or RPM file](/downloads) and double-click on it to launch the installer. The installer guides you through the installation process and installs the Ballerina distribution in the `/usr/lib64/ballerina` directory.

> **Info:** Alternatively, you can use either of the commands below to install Ballerina using the downloaded DEB or RPM file. Replace the `ballerina-linux-installer-x64-<BALLERINA-VERSION>.deb` or `ballerina-linux-installer-x64<BALLERINA-VERSION>.rpm` with the actual file path. 

For example, for the DEB file:
```
dpkg -i ballerina-linux-installer-x64-swan-lake-preview1.deb 
```

For example, for the RPM file:
```
rpm -i ballerina-linux-installer-x64-swan-lake-preview1.rpm 
```

## Installing via the Ballerina Language ZIP File

> **Note:** Before you install Ballerina using the ZIP file, ensure that you have a supported Java Runtime Environment (JRE) installed. It is recommended to use the [AdoptOpenJRE](https://adoptopenjdk.net/) version 11 or above.

1. <a id="packWindows" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/ballerina-{{ site.data.swanlake-latest.metadata.version }}.zip" class="cGTMDownload cDownload" data-download="downloads" data-pack="{{ site.data.swanlake-latest.metadata.zip-installer }}"> Download the Ballerina language ZIP file </a> <a href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/ballerina-{{ site.data.swanlake-latest.metadata.version }}.zip.md5">(md5, </a> <a href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/ballerina-{{ site.data.swanlake-latest.metadata.version }}.zip.sha1">SHA-1, </a> <a href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/ballerina-{{ site.data.swanlake-latest.metadata.version }}.zip.asc">asc)</a> and unzip it to a preferred location using an archiver tool of your choice. This creates a directory named `ballerina-<VERSION>` in your system.

2. Follow either of the steps below depending on your operating system to configure your system environment to run Ballerina:
    - **For Linux or macOS:** set the PATH environment variable to point to the bin directory of the unzipped Ballerina distribution.
    - **For Windows:** add a new environment variable specifying the following values:
        - **Variable name:** PATH
        - **Variable value:** The location of the bin directory of the unzipped Ballerina distribution. For example, `C:\Program Files\Ballerina\ballerina-<VERSION>\bin`

## Updating Ballerina

If you already have a jBallerina version above 1.1.0 installed, you can use the update tool to update to the latest jBallerina version by executing either of the commands below.

**Command**|**Description**
:-----:|:-----:
`bal dist update`|Update to the latest patch version of the active distribution
`bal dist pull <JBALLERINA-VERSION>`|Fetch a specific distribution and set it as the active version

For more information, see [Keeping Ballerina Up to Date](/swan-lake//learn/keeping-ballerina-up-to-date/).
  
## Building from Source

Alternatively, follow the instructions below to build Ballerina from the source.

### Setting Up the Prerequisites

You need to download and install the below to build the Ballerina modules.
1. OpenJDK 11 ([Adopt OpenJDK](https://adoptopenjdk.net/) or any other OpenJDK distribution) 
    
    >**Info:** You can also use [Oracle JDK](https://www.oracle.com/java/technologies/javase-downloads.html). Set the JAVA_HOME environment variable to the pathname of the directory into which you installed JDK.

2. [Node.js (version 8.9.x)](https://nodejs.org/en/download/)
3. [npm (version 5.6.0 or later)](https://www.npmjs.com/get-npm)

### Obtaining the Source Code
Follow the steps below to obtain the Ballerina source code.

1. Execute the command below to clone the [`ballerina-lang`](https://github.com/ballerina-platform/ballerina-lang) source repository.

    ```
    git clone --recursive https://github.com/ballerina-platform/ballerina-lang.git
    ```
    >**Tip:** If you have already forked the repository to your GitHub account, then execute the below command replacing `<YOUR-GITHUB-USERNAME>` with your GitHub username.

    ```
    git clone --recursive https://github.com/<YOUR-GITHUB-USERNAME>/ballerina-lang.git
    ```

2. Execute the command below to update the Git submodules.

    ```
    git submodule update --init
    ```

### Building the Source

Follow the steps below to build the project of the obtained source.

1. Navigate to the root directory of the Ballerina repo (i.e., `<BALLERINA_PROJECT_ROOT>`) and execute one of the Gradle commands below to build the project using Gradle.

    - **On Unix/macOS:** ```./gradlew build ```
    - **Windows:** ```gradlew build ```

2. Extract the built Ballerina distributions created in the locations below: 

    - **Runtime only:** `<BALLERINA_PROJECT_ROOT>/distribution/zip/jballerina/build/distributions/jballerina-<version>-SNAPSHOT.zip`
    - **Runtime and tools (e.g., Ballerina Language Server):** `<BALLERINA_PROJECT_ROOT>/distribution/zip/jballerina-tools/build/distributions/jballerina-tools-<version>-SNAPSHOT.zip`

>**Note:** If you face an IOException error stating “Too many open files”, this is due to the default number of possible open files being set to a lower number on your operating system than required for Ballerina to be compiled. You may have to increase the number of open files/file descriptors (FD) on your operating system to 1000000 (or higher).

## Uninstalling Ballerina

Usually, the installation location is `/Library/Ballerina/distributions` in macOS, `/usr/lib64/Ballerina/distributions` in Linux, and `C:\Program Files\Ballerina\distributions` in Windows. You can either remove a particular jBallerina version or all the jBallerina versions installed in these locations.

To remove:

- a specific jBallerina version (via the update tool): execute `bal dist remove` 
- all the installed jBallerina versions: delete the `/../Ballerina` directory in the respective installation location

## What's Next?

Once you have successfully installed Ballerina, click the links below to set up your IDE.

>**Tip:** To get help when you work with Ballerina, see [Community](/community).

- [Setting up Visual Studio Code](/swan-lake/learn/vscode-plugin/)
- [Setting up IntelliJ IDEA](/swan-lake/learn/intellij-plugin/)
