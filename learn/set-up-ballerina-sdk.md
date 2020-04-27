---
layout: ballerina-left-nav-pages
title: Setting up Ballerina SDK
permalink: /learn/set-up-ballerina-sdk/
active: set-up-ballerina-sdk
redirect_from:
  - /learn/set-up-ballerina-sdk
  - /v1-2/learn/set-up-ballerina-sdk
  - /v1-2/learn/set-up-ballerina-sdk/
---

# Setting up Ballerina SDK

After [installing the IntelliJ Ballerina plugin](intellij-plugin-doc.md), you need to set up Ballerina SDK for your Ballerina projects to activate all the capabilities of the plugin. 

Click on the below links for instructions on how to set up Ballerina SDK.

- [Setting up for a new project](#setting-up-for-a-new-project)
- [Setting up for an existing project](#setting-up-for-an-existing-project)

## Setting up for a new project

Follow the steps below to set up Ballerina SDK when creating a new Ballerina project.

1. In the editor, click **File** in the top menu, click **New**, and then click **Project**. 

![Create a new Ballerina project in IntelliJ IDEA](images/create-intellij-project.png)

2. Click **Ballerina** and then click **Next**.

![Select Ballerina as the type of the project](images/select-a-ballerina-project-in-intellij.png)

3. If you do not have an already-configured Ballerina SDK, click **Configure** to add a new Ballerina SDK.

>**Tip:** If you have already-configured Ballerina SDKs, you can select one of them and click **Next** to continue with the project creation.

![Configure a new Ballerina SDK](images/click-configure.png)

4. Select the location of the Ballerina distribution and click **Open**.

![Select the Ballerina distribution](images/select-ballerina-distribution.png)

Now, you have successfully added the Ballerina SDK. Click **Next** and continue with the project creation.

![The new Ballerina SDK](images/new-ballerina-sdk.png)

## Setting up for an existing project

Follow the steps below to set up Ballerina SDK for an exisitng Ballerina project.

1. Open the Project to which you want to set up a Ballerina SDK.

2. In the editor, click **File** in the top menu, click **Project Structure**.

![Open the project structure](images/open-project-structure.png)

3. If you do not have an already-configured Ballerina SDK, in the **Project** tab, click **New** under **Project SDK:**, click **Ballerina SDK**, and then click **OK**. 

>**Tip:** If you have already-configured Ballerina SDKs, select one under **Project SDK:** and click **OK** to continue.

![Add a new Ballerina SDK](images/add-new-sdk.png)


4. Select the location of the Ballerina distribution and click **Open**.

![Select the Ballerina distribution](images/select-ballerina-distribution.png)

5. Click **Apply** to save the changes.

![Restart the editor to apply the changes](images/apply-changes.png)

>**Tip** This prompts a restart request. Click **Restart** to apply the changes.

Now, you have successfully added the Ballerina SDK to this project.
