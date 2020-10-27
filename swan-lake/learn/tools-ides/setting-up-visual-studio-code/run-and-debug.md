---
layout: ballerina-left-nav-pages-swanlake
title: Run and Debug
permalink: /swan-lake/learn/setting-up-visual-studio-code/run-and-debug/
active: run-and-debug
intro: The VS Code Ballerina extension gives you the  same debugging experience as the conventional VS Code Debugger. Thus, you can run or debug your Ballerina programs easily via the VS Code Ballerina extension by launching its debugger. 
redirect_from:
  - /swan-lake/learn/tools-ides/vscode-plugin/run-and-debug
  - /swan-lake/learn/tools-ides/vscode-plugin/run-and-debug/
  - /swan-lake/learn/vscode-plugin/run-and-debug/
  - /swan-lake/learn/vscode-plugin/run-and-debug
  - /swan-lake/learn/tools-ides/setting-up-visual-studio-code/run-and-debug
  - /swan-lake/learn/tools-ides/setting-up-visual-studio-code/run-and-debug/
  - /swan-lake/learn/setting-up-visual-studio-code/run-and-debug
  - /swan-lake/learn/run-and-debug
  - /swan-lake/learn/run-and-debug/
---

## Starting a Debug Session

Follow the steps below to start a debug session. 

1. Click the **Debug** icon in the left menu or press the **Control + Shift + D** keys, to launch the Debugger view.
2. Add the debug points you require by clicking on the respective line numbers of the file.
3. Click **No Configurations** and select **Add Configuration...**. 
4. Click **Ballerina Debug**. This opens the *launch.json* file. You can edit this file to change the debug configuration options as required.
5. Click on the name of the file that you want to debug.
6. Click the **Start Debugging** icon.

You view the output in the **DEBUG CONSOLE**.

![Run and debug](/swan-lake/learn/images/run-and-debug.gif)

For more information on debugging your code using VS Code, go to [VS Code Documentation](https://code.visualstudio.com/docs/editor/debugging).

## Troubleshooting
- Stepping over code lines in non-blocking paths (eg: action invocations) will not pause VM on next line
    - workaround: manually put a breakpoint to next line
- There are some cases where stepping over gives unexpected behavior
    - Eg: When there are multiple workers and a wait expression waiting for them, even though step over hit and pass wait line in source, workers are not yet finished execution.

## What's Next?

 - For information on the next capability of the VS Code Ballerina extension, see [Graphical View](/swan-lake/learn/vscode-plugin/graphical-editor).
 - For information on the VS Code Ballerina extension, see [The Visual Studio Code Ballerina Extension](/swan-lake/learn/vscode-plugin).