---
layout: ballerina-tooling-guide-left-nav-pages-swanlake
title: Run and Debug
permalink: /learn/tooling-guide/visual-studio-code-extension/run-and-debug/
active: run-and-debug
intro: The VS Code Ballerina extension allows you to either run your Ballerina program (without debugging) or debug them easily by launching its debugger. 
redirect_from:
  - /learn/tools-ides/vscode-plugin/run-and-debug
  - /learn/tools-ides/vscode-plugin/run-and-debug/
  - /learn/vscode-plugin/run-and-debug/
  - /learn/vscode-plugin/run-and-debug
  - /learn/tools-ides/setting-up-visual-studio-code/run-and-debug
  - /learn/tools-ides/setting-up-visual-studio-code/run-and-debug/
  - /learn/setting-up-visual-studio-code/run-and-debug
  - /learn/setting-up-visual-studio-code/run-and-debug/
  - /learn/run-and-debug
  - /learn/run-and-debug/
  - /swan-lake/learn/getting-started/setting-up-visual-studio-code/run-and-debug/
  - /swan-lake/learn/getting-started/setting-up-visual-studio-code/run-and-debug
  - /learn/tooling-guide/vs-code-extension/run-and-debug
  - /learn/tooling-guide/vs-code-extension/run-and-debug/
  - /learn/tooling-guide/visual-studio-code-extension/run-and-debug
---

## Running Without Debugging

Follow the steps below to run you program.

1. Click **Run** in the top menu, and then click **Run Without Debugging**.
2. Select the **Environment**.

## Starting a Debug Session

The VS Code Ballerina extension gives you the same debugging experience as the conventional VS Code Debugger. Follow the steps below to start a debug session. 

1. Click **Run** in the top menu, and click **Start Debugging**.

>**Tip:** Alternatively, press the **Control + Shift + D** keys (for Mac: **Command + Shift +D**) to launch the Debugger view.

2. Click **create a launch.json** file and then select **Ballerina Debug**.

You view the opened `launch.json` file. 

3. Add/edit the relevant configurations for remote debugging (e.g., `debuggeeHost`, `debbuggeePort`) in the `launch.json` file.

4. Select the `.bal` file to be debugged (e.g., `main.bal`).

5. Add the debug points you require by clicking in front of the line numbers of the required file.

6. Open the terminal, and execute the `bal` command, depending on the debugging you want to perform.

>**Info:** The below are the supported remote debugging commands in Ballerina.
  - Debugging a ballerina package/ single file: `bal run --debug <DEBUGGEE_PORT> <BAL_FILE_PATH/PACKAGE_PATH>`
  - Debugging ballerina tests: `bal test --debug <DEBUGGEE_PORT>`
  - Debugging ballerina tests during the build: `bal build --debug <DEBUGGEE_PORT>`

The terminal will show the following log:

```bash
Listening for transport dt_socket at address: 5005
```

7. Select **Ballerina Remote** from the drop down available in the upper left corner.

8. Click **Run** button in the upper left corner to start remote debugging.

You view the output in the **DEBUG CONSOLE**.

![Run and debug](/learn/images/run-and-debug.gif)

For more information on debugging your code using VS Code, go to [VS Code Documentation](https://code.visualstudio.com/docs/editor/debugging).


## Using the Debugging Features

Visual Studio Code allows you to debug Ballerina programs through the Ballerina extension. The debugging features below are supported by Ballerina.

- Launch/Attach
- Breakpoints
- Pause & Continue
- Step In/Out/Over
- Variables
- Call Stacks
- Strands
- Expression Evaluation

>**Info** The Ballerina debugger is an open-source project and contributors are mostly welcome to get engaged with it via the [ballerina-lang](https://github.com/ballerina-platform/ballerina-lang) GitHub repository. If you encounter any difficulties when using this feature, feel free to create an issue in it.

For more information on the above features, see [Using the Debugging Features](/learn/tooling-guide/visual-studio-code-extension/run-and-debug/using-the-debugging-features/).

## Troubleshooting
- Stepping over code lines in non-blocking paths (eg: action invocations) will not pause VM on the next line
    - workaround: manually put a breakpoint to the next line
- There are some cases where stepping over gives unexpected behavior
    - E.g., when there are multiple workers and a wait expression waiting for them, even though it steps over to hit and pass the wait line in the source, the workers may not have finished the execution yet.
