---
layout: ballerina-left-nav-pages
title: The IntelliJ IDEA Ballerina Plugin
permalink: /learn/intellij-plugin/
active: intellij-plugin
redirect_from:
  - /v1-2/learn/tools-ides/intellij-plugin
  - /v1-2/learn/tools-ides/intellij-plugin/
  - /learn/tools-ides/intellij-plugin/
  - /learn/tools-ides/intellij-plugin
  - /learn/intellij-plugin
  - /v1-2/learn/intellij-plugin
  - /v1-2/learn/intellij-plugin/
---

# The IntelliJ IDEA Ballerina Plugin

The IntelliJ Ballerina plugin provides the Ballerina development capabilities in IntelliJ IDEA. The below sections include instructions on how to download, install, and use the features of the IntelliJ plugin.

- [Prerequisites](#prerequisites)
- [Installing the plugin](#installing-the-plugin)
- [Using the plugin](#using-the-plugin)
- [Using the features of the plugin](#using-the-features-of-the-plugin)

## Prerequisites

You need [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) installed.

>**Note:** Your IntelliJ IDE version should be compatible with the corresponding Ballerina plugin version (i.e., the same as the Ballerina distribution version) as shown in the below table.

**Plugin Version**|**Platform Version Compatibility**
:-----:|:-----:
0.8.0 - 0.8.2|IntelliJ IDEA 2016.3 - 2016.4
0.8.3 - 0.981.0|IntelliJ IDEA 2016.3 - 2017.2
0.982.0 - 0.991.0|IntelliJ IDEA 2017.3 - 2018.2
0.991.1 - 1.2.1 | IntelliJ IDEA 2018.3 - 2019.3
1.2.2+ | IntelliJ IDEA 2018.3+

## Installing the plugin

Use either of the below approaches to install the IntelliJ Ballerina plugin.

- [Installing via the IntelliJ IDE](#installing-via-the-intellij-ide)
- [Installing using the ZIP file](#installing-using-the-zip-file)

### Installing via the IntelliJ IDE

1. Open IntelliJ, click **IntelliJ IDEA** in the top menu, click **Preferences**, and then click **Plugins**. 
> **Tip:** If you are using Ubuntu/Windows, click **File**, click **Settings**, and then click **Plugins**.
2. In the search bar, type "Ballerina" and press the **Enter** key. 
3. Click **Install**, and then click **Accept**.
4. Click **Restart IDE**, and then click **Restart**.

![Install the plugin via IntelliJ IDEA](/learn/images/install-plugin-via-intellij.gif)

This downloads the plugin and installs it.

### Installing using the ZIP file

Follow the steps below to install the plugin using its ZIP file.

1. [Obtaining the ZIP file](#obtaining-the-zip-file)
2. [Installing the ZIP file via the IDE](#installing-the-zip-file-via-the-ide)

#### Obtaining the ZIP file

Follow either of the below approaches to obtain the ZIP file of the Ballerina plugin.

- [Downloading from the JetBrains Plugin Repository](#downloading-from-the-jetbrains-plugin-repository)
- [Building from the source](#building-from-the-source)

##### Downloading from the JetBrains Plugin Repository

Download the [IntelliJ Ballerina plugin](https://plugins.jetbrains.com/plugin/9520-ballerina).


##### Building from the source

Follow the steps below to obtain the ZIP file by building it from its source.

1. Clone the [ballerina-lang](https://github.com/ballerina-platform/ballerina-lang) GitHub repo.
2. In a new Command Line tab, navigate to the source directory of the plugin (i.e., the `<CLONED_BALLERINA_DIRECTORY>/tool-plugins/intellij` directory), and execute the below command.
    > **Info**: In the above step,`<CLONED_BALLERINA_DIRECTORY>` refers to the path of the *ballerina-lang* Git repository, which you cloned locally. 
    > **Tip:** You need to install the [Gradle Build Tool](https://gradle.org/) to execute the below command.

    ```bash
    ./gradlew buildPlugin
    ```

This creates the `/build/distributions/ballerina-intellij-idea-plugin-[VERSION].zip` file locally in the `<CLONED_BALLERINA_DIRECTORY>/tool-plugins/intellij` directory.

#### Installing the ZIP file via the IDE

After obtaining the ZIP file using either of the above approaches, follow the steps below to install it using the IntelliJ IDE.


1. Open IntelliJ, click **IntelliJ IDEA** in the top menu, click **Preferences**, and then click **Plugins**. 
> **Tip:** If you are using Ubuntu/Windows, click **File**, click **Settings**, and then click **Plugins**.
2. Click the cogwheel icon, and then click **Install plugin from disk...**.
3. Browse and select the ZIP file of the plugin you downloaded.
> **Important:** Make sure you install the ZIP file and not the extracted JAR files. This is because the ZIP file contains of an additional library that is required by the plugin to function as expected.
4. Click the **Installed** tab, click **Restart IDE**, and then click **Restart**.

![Install using the Preferences option of the IDE.](/learn/images/install-via-editor-preferences.gif)

## Using the plugin

The below sections include information on using the IntelliJ Ballerina plugin to write Ballerina programs.

- [Creating a new Ballerina project](/learn/intellij-plugin/using-the-intellij-plugin#creating-a-new-ballerina-project)
- [Setting up Ballerina SDK for an existing project](/learn/intellij-plugin/using-the-intellij-plugin#setting-up-ballerina-sdk-for-an-existing-project)
- [Creating a new Ballerina file](/learn/intellij-plugin/using-the-intellij-plugin#creating-a-new-ballerina-file)
- [Configuring the plugin settings](/learn/intellij-plugin/using-the-intellij-plugin#configuring-the-plugin-settings)

## Using the features of the plugin

The below sections include information on the various capabilities that are facilitated by the IntelliJ Ballerina plugin for the development process.

- [Running Ballerina programs](/learn/intellij-plugin/using-intellij-plugin-features#running-ballerina-programs)
- [Debugging Ballerina programs](/learn/intellij-plugin/using-intellij-plugin-features#debugging-ballerina-programs)
- [Viewing the sequence diagram](/learn/intellij-plugin/using-intellij-plugin-features#viewing-the-sequence-diagram)
- [Importing modules on the fly](/learn/intellij-plugin/using-intellij-plugin-features#importing-modules-on-the-fly)
- [Importing unambiguous modules](/learn/intellij-plugin/using-intellij-plugin-features#importing-unambiguous-modules)
- [Formatting Ballerina codes](/learn/intellij-plugin/using-intellij-plugin-features#formatting-ballerina-codes)
- [Viewing documentation](/learn/intellij-plugin/using-intellij-plugin-features#viewing-documentation)
- [Adding annotation fields via suggestions](/learn/intellij-plugin/using-intellij-plugin-features#adding-annotation-fields-via-suggestions)
- [Using file templates](/learn/intellij-plugin/using-intellij-plugin-features#using-file-templates)
- [Using code snippet templates](/learn/intellij-plugin/using-intellij-plugin-features#using-code-snippet-templates)
- [Checking spellings](/learn/intellij-plugin/using-intellij-plugin-features#checking-spellings)
- [Analyzing semantics](/learn/intellij-plugin/using-intellij-plugin-features#analyzing-semantics)
- [Code folding](/learn/intellij-plugin/using-intellij-plugin-features#code-folding)
- [Go to definition](/learn/intellij-plugin/using-intellij-plugin-features#go-to-definition)
