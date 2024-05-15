---
layout: ballerina-installing-ballerina-left-nav-pages-swanlake
title: Installation options
description: Get started with the Ballerina programming language by following these instructions on installing and setting up Ballerina.
keywords: ballerina, installing ballerina, programming language, ballerina installation
permalink: /learn/install-ballerina/installation-options/
active: installation-options
intro: The sections below include information about installing Ballerina.
---

## Install Ballerina via installers

Follow the instructions below to install the latest Ballerina version using the installer. The installer will automatically set the latest version as the active distribution after the installation.

>**Info:** Ballerina installers support operating systems such as Windows, Ubuntu, Red Hat Enterprise Linux, macOS, and CentOS. If you are using an unsupported operating system, [install via the Ballerina language ZIP file](#install-via-the-ballerina-language-zip-file).

### Install on macOS

[Download the package file](/downloads) and double-click on it to launch the installer. The installer guides you through the installation process and installs the Ballerina distribution in the `/Library/Ballerina` directory.

The package automatically sets your `PATH` environment variable for you. You may need to restart any open terminal sessions for the change to take effect.

#### Install via Homebrew

Alternatively, you can install Ballerina using [Homebrew](https://brew.sh/) by executing the commands below.

```
$ brew install bal
```

Homebrew installs the Ballerina distribution in the <code class="language-plaintext highlighter-rouge">/usr/local/Cellar/ballerina/&lt;BALLERINA-VERSION&gt;/libexec</code> directory.

### Install on Windows

[Download the MSI file](/downloads) and double-click on it to launch the installer. The installer guides you through the installation process and installs the Ballerina distribution in the `C:\Program Files\Ballerina` directory.

The installer sets the `C:\Program Files\Ballerina\<BALLERINA-DIRECTORY>\bin` directory in your PATH environment variable. You may have to restart any open command prompts for the change to take effect.

### Install on Linux

[Download the DEB file or RPM file](/downloads) and double-click on it to launch the installer. The installer guides you through the installation process and installs the Ballerina distribution in the following directory.
- For DEB file:  `/usr/lib/ballerina`
- For RPM file:  `/usr/lib64/ballerina`

> **Info:** Alternatively, you can use either of the commands below to install Ballerina using the downloaded DEB or RPM file. Replace the `ballerina-<BALLERINA-VERSION>-linux-x64.deb` or `ballerina-<BALLERINA-VERSION>-linux-x64.rpm` with the actual file path. 

For example, for the DEB file:
```
$ dpkg -i ballerina-<VERSION>-swan-lake-linux-x64.deb 
```

For example, for the RPM file:
```
$ rpm -i ballerina-<VERSION>-swan-lake-linux-x64.rpm 
```

## Install via the Ballerina language ZIP file

> **Note:** Before you install Ballerina using the ZIP file, ensure that you have a supported Java Runtime Environment (JRE) installed. It is recommended to use the <a href="https://adoptopenjdk.net" target="_blank">AdoptOpenJRE</a> version 11 for Ballerina Update 7 or below and version 17 for Ballerina Update 8 or above.

1. <a id="packWindows" href="{{ dist_server }}/downloads/{{ version }}/{{ other-artefacts | first }}" class="cGTMDownload cDownload" data-download="downloads" data-pack="{{ zip-installer }}"> Download the Ballerina language ZIP file </a> and unzip it to a preferred location using an archiver tool of your choice. This creates a directory named `ballerina-<VERSION>` in your system.

2. Follow either of the steps below depending on your operating system to configure your system environment to run Ballerina:
    - **For Linux or macOS:** 
        - set the PATH environment variable to point to the `bin` directory of the unzipped Ballerina distribution.
            ```
            $ PATH=<YOUR_LOCATION>/ballerina-<VERSION>/bin:$PATH;
            $ export PATH;
            ```
        - set the `JAVA_HOME` environment variable to your Java installation directory or to the root directory of the installed JRE. 
    - **For Windows:** add a new environment variable specifying the following values:
        - set the `PATH` environment variable to point to the `bin` directory of the unzipped Ballerina distribution.
            - **Variable name:** PATH
            - **Variable value:** The location of the `bin` directory of the unzipped Ballerina distribution. For example, `C:\Program Files\Ballerina\ballerina-<VERSION>\bin`
        - set the `JAVA_HOME` environment variable to your Java installation directory or to the root directory of the installed JRE.


## Verify the installation

After installing Ballerina, run the following test to verify if Ballerina has been successfully installed. 

Execute the command below from the command shell of the operating system.

```
$ bal version
```

Make certain the command output shows the version that you downloaded as shown below.

```
Ballerina <VERSION> (Swan Lake Update <MINOR_VERSION>)
Language specification <SPEC_VERSION>
Update Tool <UPDATE_TOOL_VERSION>
```

## Build from source

For instructions, see <a href="https://github.com/ballerina-platform/ballerina-distribution/blob/master/docs/build-ballerina-from-source.md" target="_blank">Build Ballerina from source</a>.

## Update Ballerina

If you already have a Ballerina version above 1.1.0 installed, you can use the update tool to update to the latest Ballerina version and set it as the active version by executing either of the commands below.

> **Info:** You might need to first update the update tool to its latest version. If you have an update tool version below 0.8.14, execute the `ballerina update` command or else execute the `bal update` command to do this.

**Command**|**Description**
:-----:|:-----:
`bal dist update`|Update to the latest patch version of the active distribution
`bal dist pull latest`|Update to the latest Ballerina version
`bal dist pull <VERSION>`|Fetch a specific distribution 

For more information, see [Update Tool](/learn/update-tool/).

## Uninstall Ballerina

Usually, the installation location is `/Library/Ballerina/` in macOS, `/usr/lib/ballerina/` for DEB and `/usr/lib64/ballerina/` for RPM in Linux, and `C:\Program Files\Ballerina\` in Windows.

To remove:

- a specific Ballerina version (via the update tool): execute `bal dist remove <VERSION>` 
- all non-active distributions (via the update tool): execute `bal dist remove -a` 
- all the installed Ballerina versions: delete the `/../Ballerina` directory in the respective installation location

> **Info:** Alternatively, you can uninstall Ballerina using the commands below by replacing the actual package name in Linux and from the control panel in Windows.

For example, for the DEB file:
```
$ apt-get remove ballerina-<VERSION>-swan-lake
```

For example, for the RPM file:
```
$ rpm -e ballerina-<VERSION>-swan-lake
```

