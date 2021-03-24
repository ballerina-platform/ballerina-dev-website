---
layout: ballerina-tooling-guide-left-nav-pages-swanlake
title: Installing the VS Code Extension
permalink: /learn/tooling-guide/visual-studio-code-extension/installing-the-vs-code-extension/
active: installing-the-vs-code-extension
intro: The VS Code Ballerina extension provides the Ballerina development capabilities in VS Code. The below sections include instructions on how to download, install, and use the features of the VS Code extension.
redirect_from:
  - /learn/tools-ides/vscode-plugin
  - /learn/tools-ides/vscode-plugin/
  - /learn/vscode-plugin
  - /learn/vscode-plugin/
  - /learn/tools-ides/setting-up-visual-studio-code
  - /learn/tools-ides/setting-up-visual-studio-code/
  - /learn/setting-up-visual-studio-code
  - /learn/setting-up-visual-studio-code/
  - /swan-lake/learn/getting-started/setting-up-visual-studio-code/
  - /swan-lake/learn/getting-started/setting-up-visual-studio-code
  - /learn/setting-up-visual-studio-code
  - /learn/tooling-guide/
  - /learn/tooling-guide
  - /learn/tooling-guide/vs-code-extension/
  - /learn/tooling-guide/vs-code-extension
  - /learn/tooling-guide/vs-code-extension/installing-the-vs-code-extension
  - /learn/tooling-guide/vs-code-extension/installing-the-vs-code-extension/
  - /learn/tooling-guide/visual-studio-code-extension/installing-the-vs-code-extension
  - /learn/tooling-guide/visual-studio-code-extension/
  - /learn/tooling-guide/visual-studio-code-extension
---

## Downloading VS Code 

Download the [Visual Studio Code editor](https://code.visualstudio.com/download).

>**Tip:** If you installed a new Ballerina version recently, you might need to restart the VS Code Editor to pick the new Ballerina version. If you are using macOS, press `Command+Q` keys to quit the app and reopen it.

## Downloading the VS Code Extension

Download the Visual Studio Code Ballerina Extension from below.

<link rel="stylesheet" href="/css/download-page.css">
<script src="/js/download-page.js"></script>
<div class="row cDownloads">
<div class="container">
  <div class=" ">
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 ">
        <h3 class="cVSCode">Visual Studio Code</h3>
        <a id="packWindows" href="https://github.com/ballerina-platform/plugin-vscode/releases/download/vswan-lake-alpha3/ballerina-swan-lake-alpha3.vsix" class="cGTMDownload cDownload cDownloadNew" data-download="downloads">
              <div class="cSize">Extension  vsix <span id="packWindowsName">2.7mb</span></div>
        </a>
        <ul class="cDiwnloadSubLinks">
            <li><a id="packWindowsMd5" href="https://github.com/ballerina-platform/plugin-vscode/releases/download/vswan-lake-alpha3/ballerina-swan-lake-alpha3.vsix.md5">md5</a></li>
            <li><a id="packWindowsSha1" href="https://github.com/ballerina-platform/plugin-vscode/releases/download/vswan-lake-alpha3/ballerina-swan-lake-alpha3.vsix.sha1">SHA-1</a></li>
            <li><a id="packWindowsAsc" href="https://github.com/ballerina-platform/plugin-vscode/releases/download/vswan-lake-alpha3/ballerina-swan-lake-alpha3.vsix.asc">asc</a></li>
        </ul>
</div></div></div></div>

## Installing the Extension

Follow either of the below approaches to install the extension.
  - [Using the VS Code editor](#using-the-vs-code-editor)
  - [Using the Command Line](#using-the-command-line)

### Installing via the VS Code Editor

1. Click **View** in the top menu of the editor and click **Command Palette**.
2. In the search bar, type "vsix" and click **Extensions: Install from VSIX...**.
3. Browse and select the VSIX file of the extension you downloaded.

![Install using the Command Palette of the editor](/learn/images/install-via-palette.gif)

### Installing via the Command Line
In a new Command Line tab, execute the below command.
```bash
$ code --install-extension <BALLERINA-EXTENSION-DIRECTORY>
```
> **Tip**: In the above command, `<BALLERINA_EXTENSION-DIRECTORY>` refers to the path of the Ballerina extension directory (i.e., the VSIX file) you downloaded.









