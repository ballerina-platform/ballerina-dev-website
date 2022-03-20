---
layout: ballerina-left-nav-pages-swanlake
title: Using the IntelliJ Ballerina plugin
permalink: /learn/setting-up-intellij-idea/using-the-intellij-plugin/
active: using-the-intellij-plugin
intro: The sections below include information to start using the IntelliJ Ballerina plugin after installing it.
redirect_from:
  - /learn/tools-ides/intellij-plugin/using-the-intellij-plugin
  - /learn/tools-ides/intellij-plugin/using-the-intellij-plugin/
  - /learn/intellij-plugin/using-the-intellij-plugin
  - /learn/intellij-plugin/using-the-intellij-plugin/
  - /learn/set-up-ballerina-sdk/
  - /learn/set-up-ballerina-sdk
  - /learn/tools-ides/setting-up-intellij-idea/using-the-intellij-plugin
  - /learn/tools-ides/setting-up-intellij-idea/using-the-intellij-plugin/
  - /learn/setting-up-intellij-idea/using-the-intellij-plugin
  - /learn/setting-up-intellij-idea/using-the-intellij-plugin/
  - /learn/using-the-intellij-plugin
  - /learn/using-the-intellij-plugin/
  - /swan-lake/learn/setting-up-intellij-idea/using-the-intellij-plugin/
  - /swan-lake/learn/setting-up-intellij-idea/using-the-intellij-plugin
redirect_to:
  - /learn/
---

## Creating a new Ballerina project

Follow the steps below to create a new Ballerina project.

1. Open IntelliJ, click **File** in the top menu, click **New**, and then click **Project**.

2. Select **Ballerina** as the type of the project, and click **Next**.
![Install the plugin via IntelliJ IDEA](/learn/images/select-project-type.png)

3. Select a Ballerina SDK for the project, and click **Next**.

    >**Tip:** **If you do not have an already-configured Ballerina SDK to select,** click **Configure**, select the location of the Ballerina distribution, click **Open**, and then click **Next** to continue with the project creation. However, if you do not configure, the plugin will auto detect the Ballerina Home by executing the `ballerina home` command.

    ![Select a Ballerina SDK](/learn/images/select-sdk.png)
   
4. Enter a name for the project, a location to save it, and click **Finish**.

    ![Enter project name and location](/learn/images/enter-project-name-and-location.png)

Now, you have successfully created a new Ballerina project.

![New Ballerina project](/learn/images/new-ballerina-project.png)

## Setting up Ballerina SDK for an existing project

Follow the steps below to set up Ballerina SDK for an existing project.

1. Open the Project to which you want to set up a Ballerina SDK.
2. In the IDE, click **File** in the top menu, and then click **Project Structure**.

    ![Open the project structure](/learn/images/open-project-structure.png)
3. If you do not have an already-configured Ballerina SDK, in the **Project** tab, click **New** under **Project SDK:**, click **Ballerina SDK**, and then click **OK**. 

    >**Tip:** If you have already-configured Ballerina SDKs, select one under **Project SDK:**, and click **OK** to continue.

    ![Add a new Ballerina SDK](/learn/images/add-new-sdk.png)
4. Select the location of the Ballerina distribution and click **Open**.

    ![Select the Ballerina distribution](/learn/images/select-ballerina-distribution.png)
5. Click **Apply** to save the changes.

    ![Restart IntelliJ to apply the changes](/learn/images/apply-changes.png)

    >**Tip** This prompts a restart request. Click **Restart** to apply the changes.

 Now, you have successfully added the Ballerina SDK to an existing project.

## Creating a new Ballerina file

Follow the steps below to create a new Ballerina file within a Ballerina project.

1. Right-click on the name of the project, click **New**, and then click **Ballerina File**.

    ![Create a new Ballerina file](/learn/images/create-new-ballerina-file.png)

2. Enter a name for the file, and click **OK**. 

    > **Tip:** In this example, since the default **Main** template is selected as the **Kind**, it creates a new file with a main function.

    ![Select the type of the file template](/learn/images/select-file-kind.png)

Now, you have successfully created a new Ballerina file with a **main** function.

![New Ballerina file with a main function](/learn/images/new-ballerina-file-with-main-function.png)

## Configuring the plugin settings

### 'Ballerina Home' auto detection

In order to automatically detect the Ballerina Home that is being used (without setting up a Ballerina SDK), enable the **Settings** **->** **Languages and Frameworks** **->** **Ballerina** **->** **Ballerina Home Auto Detection** option.

![Ballerina Home auto detection](/learn/images/auto-detection.png)

### Experimental features

Ballerina Language Specification supports a set of experimental features such as the transactions syntax. In order to be compatible with the experimental features and for supporting language intelligence in IntelliJ plugin, enable the **Allow Experimental** option in **Settings** **->** **Languages and Frameworks** **->** **Ballerina** **->** **Experimental Features**.

![Experimental features](/learn/images/experimental-features.png)

### Language server debug logs

In order to view the plugin debug logs, enable the **Settings** **->** **Languages and Frameworks** **->** **Ballerina** **->** **Language Server Debug Logs** option.

Then, the language server debug logs will be added to the IDEA log files. (Click **Help** **->** **Show Log In Files** option to view them).

![Debug logs](/learn/images/debug-logs.png)

## What's next?

 Next, for information on using the features of the IntelliJ Ballerina plugin, see [Using the IntelliJ plugin features](/learn/intellij-plugin/using-intellij-plugin-features).
 


 
