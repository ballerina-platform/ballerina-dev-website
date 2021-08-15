---
layout: ballerina-getting-started-left-nav-pages-swanlake
title: Configurations
permalink: /learn/getting-started/visual-studio-code-extension/configurations/
active: configurations
intro: The Ballerina extension provides a set of configurations to allow customizations as per your preferences. 
keywords: ballerina, visual studio code, vs code, extension, configurations
description: The Ballerina extension provides a set of configurations to allow customizations as per your preferences. 
redirect_from:
  - /learn/tooling-guide/vs-code-extension/configurations
  - /learn/tooling-guide/vs-code-extension/configurations
  - /learn/tooling-guide/visual-studio-code-extension/configurations
  - /learn/tooling-guide/visual-studio-code-extension/configurations/
  - /learn/getting-started/visual-studio-code-extension/configurations
---

## Code Lens - All: Enabled

It enables all code lens features irrespective of the **Code Lens - Docs: Enabled** and **Code Lens - Executor: Enabled** settings and is enabled by default.

## Code Lens - Docs: Enabled

It enables the **Documentation** [code lens](/learn/tooling-guide/visual-studio-code-extension/language-support/#documentation-code-lens) feature, which provides Ballerina document generation capabilities and is enabled by default. This configuration is overridden by the **Code Lens - All: Enabled** setting.

## Code Lens - Executor: Enabled

It enables the **Executor** [code lens](/learn/tooling-guide/visual-studio-code-extension/language-support/#run-and-debug-code-lenses) feature, which provides quick run and debug capabilities for the Ballerina language. It is enabled by default. This configuration is overridden by the **Code Lens - All: Enabled** setting.

>**Tip:** The **Debug** code lens honors the **debug.saveBeforeStart** setting of the VS Code editor.

## Data Mapper: Enabled

It enables the **Data Mapper** [code actions](/learn/tooling-guide/visual-studio-code-extension/language-support/#data-mapping) and is disabled by default.

## Data Mapper: Url

It specifies the URL of the [data mapping](/learn/tooling-guide/visual-studio-code-extension/language-support/#data-mapping) service backend.

## Debug Log

It enables printing debug messages on to the Ballerina output channel and is disabled by default. These debug logs mainly include additional logs added for troubleshooting the extension.

![Debug Log](/learn/images/debug-log.gif)

## Enable File Watcher

It enables watching file change events of the Ballerina project and is enabled by default.

## Enable Telemetry

It enables the Ballerina [telemetry](https://code.visualstudio.com/docs/getstarted/telemetry) service and is enabled by default. 

>**Tip:** This honors the **telemetry.enableTelemetry** setting of the VS Code editor.

## Home

It specifies the Ballerina home directory path and is only applicable if the 
**Plugin - Dev: Mod**  [setting](/learn/tooling-guide/visual-studio-code-extension/configurations/#plugin---dev-mod) is enabled.

>**Tip:** Enclose the parts of the path on Windows with quotations if it includes spaces. E.g., `C:\"Program Files"\Ballerina`

## Plugin - Dev: Mod

It enables the plugin development mode and is disabled by default. If it is disabled, the extension picks up the Ballerina runtime installed in the environment. Also, if it is enabled, the extension picks up the Ballerina runtime defined in the **Home** [configuration](/learn/tooling-guide/visual-studio-code-extension/configurations/#home).

## Trace Log

It enables printing trace messages onto the Ballerina output channel and is disabled by default. These trace logs mainly include the details of the requests sent from the extension to the Ballerina Language Server.

![Trace Log](/learn/images/trace-log.gif)

<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>

