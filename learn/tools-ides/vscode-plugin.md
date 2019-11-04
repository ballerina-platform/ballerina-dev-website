---
layout: ballerina-inner-page
title: The Visual Studio Code Plugin
permalink: /learn/tools-ides/vscode-plugin/
---

# The Visual Studio Code Plugin

The VS Code Ballerina plugin provides the Ballerina development capabilities in VS Code. Click on the below links for instructions on how to download, install, and use the features of the VS Code plugin.

- [Downloading VS Code](#downloading-vs-code)
- [Installing the plugin](#installing-the-plugin)
- [Using the plugin](#using-the-plugin)

## Downloading VS Code 

Download the [Visual Studio Code editor](https://code.visualstudio.com/download).


## Installing the plugin

Use either of the below approaches to install the VS Code Ballerina plugin.

- [Installing via the VS Code editor](#installing-via-the-vs-code-editor)
- [Installing by downloading the plugin](#installing-by-downloading-the-plugin)

### Installing via the VS Code editor

Click **Extensions** on the left-most menu of the editor, search for the Ballerina plugin, and click **Install**.

> **Tip**: Click **Reload** to reload the editor to apply the change.

![Install the plugin via VS Code](/learn/images/install-via-editor.gif)

This downloads the plugin and installs it.

### Installing by downloading the plugin

1. Download the [Visual Studio Code Ballerina plugin](https://marketplace.visualstudio.com/items?itemName=ballerina.ballerina).
2. Follow either of the below approaches to install the plugin.
    - [Using the VS Code editor](#using-the-vs-code-editor)
    - [Using the Command Line](#using-the-command-line)

#### Using the VS Code editor

1. Click **View** in the top menu of the editor and click **Command Palette**.
2. In the search bar, type "vsix" and click **Extensions: Install from VSIX...**.
3. Browse and select the VSIX file of the plugin you downloaded.

![Install using the Command Palette of the editor.](/learn/images/install-via-palette.gif)

#### Using the Command Line
In a new Command Line tab, execute the below command.
```bash
$ code --install-extension <BALLERINA-PLUGIN-DIRECTORY>
```
> **Tip**: In the above command, `<BALLERINA_PLUGIN-DIRECTORY>` refers to the path of the Ballerina plugin directory (i.e., the VSIX file) you downloaded.

## Using the plugin

> **Tip:** Ballerina Language Specification supports a set of experimental features such as transactions syntax. In order to be compatible with the experimental features and for supporting language intelligence in VSCode Plugin, enable the Allow Experimental option in user settings.

> **Troubleshooting**: If you installed a new Ballerina version recently, you might need to restart the VS Code Editor to pick the new Ballerina version. Herein, If you are using Mac OS, press 'Command+Q' keys to quit the app and reopen it.

Click on the below links to find information on the various capabilities that are facilitated by the VS Code Ballerina plugin for the development process.

- [Language intelligence](/learn/tools-ides/vscode-plugin/language-intelligence)
- [Run and debug](/learn/tools-ides/vscode-plugin/run-and-debug)
- [Graphical View](/learn/tools-ides/vscode-plugin/graphical-editor)
- [Documentation Viewer](/learn/tools-ides/vscode-plugin/documentation-viewer)

