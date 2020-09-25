---
layout: ballerina-left-nav-pages-swanlake
title: Using the IntelliJ Ballerina Plugin
permalink: /swan-lake/learn/setting-up-intellij-idea/using-the-intellij-plugin/
active: using-the-intellij-plugin
redirect_from:
  - /swan-lake/learn/tools-ides/intellij-plugin/using-the-intellij-plugin
  - /swan-lake/learn/tools-ides/intellij-plugin/using-the-intellij-plugin/
  - /swan-lake/learn/intellij-plugin/using-the-intellij-plugin
  - /swan-lake/learn/intellij-plugin/using-the-intellij-plugin/
  - /swan-lake/learn/set-up-ballerina-sdk/
  - /swan-lake/learn/set-up-ballerina-sdk
  - /swan-lake/learn/tools-ides/setting-up-intellij-idea/using-the-intellij-plugin
  - /swan-lake/learn/tools-ides/setting-up-intellij-idea/using-the-intellij-plugin/
  - /swan-lake/learn/setting-up-intellij-idea/using-the-intellij-plugin
  - /swan-lake/learn/using-the-intellij-plugin
  - /swan-lake/learn/using-the-intellij-plugin/
---

# Using the IntelliJ Ballerina Plugin

The below sections include information to start using the IntelliJ Ballerina plugin after [installing it](/swan-lake/learn/intellij-plugin).

- [Creating a New Ballerina Project](#creating-a-new-ballerina-project)
- [Setting Up Ballerina SDK for an Existing Project](#setting-up-ballerina-sdk-for-an-existing-project)
- [Creating a New Ballerina File](#creating-a-new-ballerina-file)
- [Configuring the Plugin Settings](#configuring-the-plugin-settings)
    - [Ballerina Home Auto Detection](#ballerina-home-auto-detection)
    - [Experimental Features](#experimental-features)
    - [Language Server Debug Logs](#language-server-debug-logs)

## Creating a New Ballerina Project

Follow the steps below to create a new Ballerina project.

1. Open IntelliJ, click **File** in the top menu, click **New**, and then click **Project**.

2. Select **Ballerina** as the type of the project, and click **Next**.
![Install the plugin via IntelliJ IDEA](/swan-lake/learn/images/select-project-type.png)

3. Select a Ballerina SDK for the project, and click **Next**.

    >**Tip:** **If you do not have an already-configured Ballerina SDK to select,** click **Configure**, select the location of the Ballerina distribution, click **Open**, and then click **Next** to continue with the project creation. However, if you do not configure, the plugin will auto detect the Ballerina Home by executing the `ballerina home` command.

    ![Select a Ballerina SDK](/swan-lake/learn/images/select-sdk.png)
   
4. Enter a name for the project, a location to save it, and click **Finish**.

    ![Enter project name and location](/swan-lake/learn/images/enter-project-name-and-location.png)

Now, you have successfully created a new Ballerina project.

![New Ballerina project](/swan-lake/learn/images/new-ballerina-project.png)

## Setting Up Ballerina SDK for an Existing Project

Follow the steps below to set up Ballerina SDK for an existing project.

1. Open the Project to which you want to set up a Ballerina SDK.
2. In the IDE, click **File** in the top menu, and then click **Project Structure**.

    ![Open the project structure](/swan-lake/learn/images/open-project-structure.png)
3. If you do not have an already-configured Ballerina SDK, in the **Project** tab, click **New** under **Project SDK:**, click **Ballerina SDK**, and then click **OK**. 

    >**Tip:** If you have already-configured Ballerina SDKs, select one under **Project SDK:**, and click **OK** to continue.

    ![Add a new Ballerina SDK](/swan-lake/learn/images/add-new-sdk.png)
4. Select the location of the Ballerina distribution and click **Open**.

    ![Select the Ballerina distribution](/swan-lake/learn/images/select-ballerina-distribution.png)
5. Click **Apply** to save the changes.

    ![Restart IntelliJ to apply the changes](/swan-lake/learn/images/apply-changes.png)

    >**Tip** This prompts a restart request. Click **Restart** to apply the changes.

 Now, you have successfully added the Ballerina SDK to an existing project.

## Creating a New Ballerina File

Follow the steps below to create a new Ballerina file within a Ballerina project.

1. Right-click on the name of the project, click **New**, and then click **Ballerina File**.

    ![Create a new Ballerina file](/swan-lake/learn/images/create-new-ballerina-file.png)

2. Enter a name for the file, and click **OK**. 

    > **Tip:** In this example, since the default **Main** template is selected as the **Kind**, it creates a new file with a main function.

    ![Select the type of the file template](/swan-lake/learn/images/select-file-kind.png)

Now, you have successfully created a new Ballerina file with a **main** function.

![New Ballerina file with a main function](/swan-lake/learn/images/new-ballerina-file-with-main-function.png)

## Configuring the Plugin Settings

### Ballerina Home Auto Detection

In order to automatically detect the Ballerina Home that is being used (without setting up a Ballerina SDK), enable the **Settings** **->** **Languages and Frameworks** **->** **Ballerina** **->** **Ballerina Home Auto Detection** option.

![Ballerina Home auto detection](/swan-lake/learn/images/auto-detection.png)

### Experimental Features

Ballerina Language Specification supports a set of experimental features such as transactions syntax. In order to be compatible with the experimental features and for supporting language intelligence in IntelliJ plugin, enable the **Allow Experimental** option in **Settings** **->** **Languages and Frameworks** **->** **Ballerina** **->** **Experimental Features**.

![Experimental features](/swan-lake/learn/images/experimental-features.png)

### Language Server Debug Logs

In order to view the plugin debug logs, enable the **Settings** **->** **Languages and Frameworks** **->** **Ballerina** **->** **Language Server Debug Logs** option.

Then, the language server debug logs will be added to the IDEA log files. (Click **Help** **->** **Show Log In Files** option to view them).

![Debug logs](/swan-lake/learn/images/debug-logs.png)

## What's Next?

 Next, for information on using the features of the IntelliJ Ballerina plugin, see [Using the IntelliJ plugin features](/swan-lake/learn/intellij-plugin/using-intellij-plugin-features).
 


 
