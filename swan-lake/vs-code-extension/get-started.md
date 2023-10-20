# Get started

The sections below walk you through how to get started with the Ballerina VS Code extension by installing it and opening a Ballerina package via it.

## Install the Ballerina extension

Follow the steps below to set up the required prerequisites and install the Ballerina extension.

1. Install the [Visual Studio Code editor](https://code.visualstudio.com/download) version `1.60.0` or later.

2. Download and install [Ballerina](https://ballerina.io/downloads/).
 
3. Install the [Ballerina VS Code Extension](https://marketplace.visualstudio.com/items?itemName=WSO2.ballerina). 

4. Open a [single Ballerina package](#open-a-single-ballerina-package) or [multiple Ballerina packages](#open-multiple-ballerina-packages) to activate the extension.

## Open Ballerina packages

You can either work on a single [Ballerina package](https://ballerina.io/learn/package-references/) at a time or use [multi-root workspaces](https://code.visualstudio.com/docs/editor/multi-root-workspaces) of VS Code to work on several related Ballerina packages at the same time. 

!!! Info
    When the extension is activated properly, you can see the `Ballerina SDK: <version>` in the status bar at the bottom left corner.

<img src="https://wso2.com/ballerina/vscode/docs/img/get-started/show-version-on-vscode.png" class="cInlineImage-threeQuarter"/>

### Open a single Ballerina package

Use one of the following options to open a Ballerina package:

1. From the command line, navigate to the directory path of the package, and execute the `code .` command.

2. From the top menu of the VS Code editor, click **File > Open Folder...**, and select the package.

### Open multiple Ballerina packages

To open multiple Ballerina packages as a VS Code workspace, add all the related Ballerina packages to the workspace using one of the following methods. 

!!! Info
    If you already have one Ballerina package opened in the VS Code editor, you can add other related packages to the same workspace. For instructions, see [adding folders to multi-root workspaces](https://code.visualstudio.com/docs/editor/multi-root-workspaces#_adding-folders).

1. Add each Ballerina package to the workspace using the **Add folder to workspace** option in the top menu of the VS Code editor.

2. Click the **VS Code workspace file** option in the top menu of the VS Code editor to import the packages of an already created workspace to a new workspace.
