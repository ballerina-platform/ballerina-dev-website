---
layout: ballerina-inner-page
permalink: /v0-991/learn/intellij-plugin/using-the-intellij-plugin
redirect_from:
  - /v0-991/learn/tools-ides/intellij-plugin/using-the-intellij-plugin
  - /v0-991/learn/tools-ides/intellij-plugin/using-the-intellij-plugin/
---

# Using the IntelliJ Ballerina Plugin

Click the links below to start using the IntelliJ Ballerina plugin after [installing it](/v0-991/learn/intellij-plugin).

- [Creating a new Ballerina project](#creating-a-new-ballerina-project)
- [Setting up Ballerina SDK for an existing project](#setting-up-ballerina-sdk-for-an-existing-project)
- [Creating a new Ballerina file](#creating-a-new-ballerina-file)

## Creating a new Ballerina project

Follow the steps below to create a new Ballerina project.

1. Open IntelliJ, click **File** in the top menu, click **New**, and then click **Project**.

2. Select **Ballerina** as the type of the project, and click **Next**.
![Install the plugin via IntelliJ IDEA](/v0-991/learn/images/select-project-type.png)

3. Select a Ballerina SDK for the project, and click **Next**.

    >**Tip:** **If you do not have an already-configured Ballerina SDK to select,** click **Configure**, select the location of the Ballerina distribution, click **Open**, and then click **Next** to continue with the project creation.

    ![Select a Ballerina SDK](/v0-991/learn/images/select-sdk.png)
   
4. Enter a name for the project, a location to save it, and click **Finish**.

    ![Enter project name and location](/v0-991/learn/images/enter-project-name-and-location.png)

Now, you have successfully created a new Ballerina project.

![New Ballerina project](/v0-991/learn/new-ballerina-project.png)

## Setting up Ballerina SDK for an existing project

1. Open the Project to which you want to set up a Ballerina SDK.
2. In the IDE, click **File** in the top menu, and then click **Project Structure**.

    ![Open the project structure](/v0-991/learn/open-project-structure.png)
3. If you do not have an already-configured Ballerina SDK, in the **Project** tab, click **New** under **Project SDK:**, click **Ballerina SDK**, and then click **OK**. 

    >**Tip:** If you have already-configured Ballerina SDKs, select one under **Project SDK:**, and click **OK** to continue.

    ![Add a new Ballerina SDK](/v0-991/learn/images/add-new-sdk.png)
4. Select the location of the Ballerina distribution and click **Open**.

    ![Select the Ballerina distribution](/v0-991/learn/images/select-ballerina-distribution.png)
5. Click **Apply** to save the changes.

    ![Restart IntelliJ to apply the changes](/v0-991/learn/images/apply-changes.png)

    >**Tip** This prompts a restart request. Click **Restart** to apply the changes.

 Now, you have successfully added the Ballerina SDK to an existing project.

## Creating a new Ballerina file

Follow the steps below to create a new Ballerina file within a Ballerina project.

1. Right-click on the name of the project, click **New**, and then click **Ballerina File**.

    ![Create a new Ballerina file](/v0-991/learn/images/create-new-ballerina-file.png)

2. Enter a name for the file, and click **OK**. 

    > **Tip:** In this example, since the default **Main** template is selected as the **Kind**, it creates a new file with a main function.

    ![Select the type of the file template](/v0-991/learn/images/select-file-kind.png)

Now, you have successfully created a new Ballerina file with a **main** function.

![New Ballerina file with a main function](/v0-991/learn/images/new-ballerina-file-with-main-function.png)

## What's next?

 Next, for information on using the features of the IntelliJ Ballerina plugin, see [Using the IntelliJ plugin features](/v0-991/learn/intellij-plugin/using-intellij-plugin-features).
 


 