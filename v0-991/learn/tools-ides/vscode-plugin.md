---
layout: ballerina-inner-page
permalink: /v0-991/learn/vscode-plugin/
redirect_from:
  - /v0-991/learn/tools-ides/vscode-plugin
  - /v0-991/learn/tools-ides/vscode-plugin/
---

# The Visual Studio Code Extension

The VS Code Ballerina extension provides the Ballerina development capabilities in VS Code. Click on the below links for instructions on how to download, install, and use the features of the VS Code extension.

- [Downloading VS Code](#downloading-vs-code)
- [Installing the extension](#installing-the-extension)
- [Using the extension](#using-the-extension)

## Downloading VS Code 

Download the [Visual Studio Code editor](https://code.visualstudio.com/download).


## Installing the extension

Use either of the below approaches to install the VS Code Ballerina extension.

- [Installing via the VS Code editor](#installing-via-the-vs-code-editor)
- [Installing by downloading the extension](#installing-by-downloading-the-extension)

### Installing via the VS Code editor

Click **Extensions** on the left-most menu of the editor, search for the Ballerina extension, and click **Install**.

> **Tip**: Click **Reload** to reload the editor to apply the change.

![Install the extension via VS Code](/v0-991/learn/images/install-via-editor.gif)

This downloads the extension and installs it.

### Installing by downloading the extension

1. Download the [Visual Studio Code Ballerina extension](https://marketplace.visualstudio.com/items?itemName=ballerina.ballerina).
2. Follow either of the below approaches to install the extension.
    - [Using the VS Code editor](#using-the-vs-code-editor)
    - [Using the Command Line](#using-the-command-line)

#### Using the VS Code editor

1. Click **View** in the top menu of the editor and click **Command Palette**.
2. In the search bar, type "vsix" and click **Extensions: Install from VSIX...**.
3. Browse and select the VSIX file of the extension you downloaded.

![Install using the Command Palette of the editor.](/v0-991/learn/images/install-via-palette.gif)

#### Using the Command Line
In a new Command Line tab, execute the below command.
```bash
$ code --install-extension <BALLERINA-EXTENSION-DIRECTORY>
```
> **Tip**: In the above command, `<BALLERINA_EXTENSION-DIRECTORY>` refers to the path of the Ballerina extension directory (i.e., the VSIX file) you downloaded.

## Using the extension

Click on the below links to find information on the various capabilities that are facilitated by the VS Code Ballerina extension for the development process.

- [Language intelligence](/v0-991/learn/vscode-plugin/language-intelligence)
- [Run and debug](/v0-991/learn/vscode-plugin/run-and-debug)
- [Run all tests](/v0-991/learn/vscode-plugin/run-all-tests)
- [Graphical Editor](/v0-991/learn/vscode-plugin/graphical-editor)
- [Documentation Viewer](/v0-991/learn/vscode-plugin/documentation-viewer)

