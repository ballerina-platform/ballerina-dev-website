---
layout: ballerina-getting-started-left-nav-pages-swanlake
title: VS Code Commands
permalink: /learn/getting-started/visual-studio-code-extension/vs-code-commands/
active: vs-code-commands
intro: The VS Code Ballerina extension comprises a set of palette commands to enable easy development using the inherent capabilities of the Ballerina language.
keywords: ballerina, visual studio code, vs code, extension, commands
description: The VS Code Ballerina extension comprises of a set of palette commands to enable easy development using the inherent capabilities of the Ballerina language.
redirect_from:
  - /learn/tooling-guide/vs-code-extension/vs-code-commands
  - /learn/tooling-guide/vs-code-extension/vs-code-commands/
  - /learn/tooling-guide/visual-studio-code-extension/vs-code-commands
  - /learn/tooling-guide/visual-studio-code-extension/vs-code-commands/
  - /learn/getting-started/visual-studio-code-extension/vs-code-commands
---

>**Tip:** Click **View** in the menu bar of the editor and click **Command Palette** to access the command palette. Alternatively, use the VS Code palette shortcut (`⌘ + ↑ + P` on Mac and `Ctrl + Shift + P` on Windows and Linux) to execute the commands.

## Show Examples

It lists the available examples of the Ballerina language. By clicking on each example, you can explore each source code. 

![Show Examples](/learn/images/show-examples.gif)

>**Tip:** If you encounter any errors, check the [Ballerina Home configuration](/learn/tooling-guide/visual-studio-code-extension/configurations/#home).

## Build

It is a quick access to build your Ballerina project. Once executed, the current Ballerina project relative to the currently-opened text editor is built using the `bal build` [CLI command](/learn/tooling-guide/cli-tools/cli-commands/#core-commands).

![Build](/learn/images/build.gif)

## Run

It runs your Ballerina project. Once executed, the opened Ballerina project is built using the `bal run` [CLI command](/learn/tooling-guide/cli-tools/cli-commands/#core-commands).

![Run](/learn/images/run.gif)

>**Tip:** If you use any [configurable variables](/learn/user-guide/configurability/), the relevant `Config.toml` file should be added inside the Ballerina project root in case the `BAL_CONFIG_FILES` and `BAL_CONFIG_DATA` environment variables are not defined.

## Test

It runs all the tests in your Ballerina project using the `bal test` [CLI command](/learn/tooling-guide/cli-tools/cli-commands/#core-commands).

![Test](/learn/images/test-command.gif)

>**Tip:** If you use any [configurable variables](/learn/user-guide/configurability/), the relevant `Config.toml` file should be added inside the corresponding module’s test directory root.

## Build Documentation

It is a quick guide to generate documentation for your Ballerina project. Once executed, the documentation is generated using the `bal doc` [CLI command](/learn/tooling-guide/cli-tools/cli-commands/#core-commands). The generated documentation can be found inside the `apidocs` directory in the project `target`. 

![Document](/learn/images/document.gif)

## Show Diagram

It is a palette reference to access the **Diagrams** [view](/learn/tooling-guide/visual-studio-code-extension/diagram-editor/#diagrams-view). On execution, the diagram editor of the first diagram component listed under the **Diagrams** view is rendered.

![Show Diagram](/learn/images/show-diagram-view.gif)

## Add Module

It adds a [Ballerina module](/learn/user-guide/ballerina-packages/modules/) for the given module name using the `bal add` [CLI command](/learn/tooling-guide/cli-tools/cli-commands/#core-commands). 

![Add Module](/learn/images/add-module.gif)

## Create 'Cloud.toml'

It generates a `Cloud.toml` file for your Ballerina project according to the default [cloud specifications](https://github.com/ballerina-platform/ballerina-spec/blob/master/c2c/code-to-cloud-spec.md).

![Create Cloud.toml](/learn/images/create-cloud-toml.gif)

## Paste JSON as Record 

This command converts a JSON string (that is copied to the clipboard) to a Ballerina record(s) and pastes it in your code.

![Paste JSON as Record](/learn/images/paste-json-as-record.gif)

<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>