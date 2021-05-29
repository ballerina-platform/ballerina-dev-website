---
layout: ballerina-tooling-guide-left-nav-pages-swanlake
title: Debugging
description: Describes the existing run and debugging functionalities provided by Ballerina in Visual Studio Code.  
keywords: ballerina debugging, ballerina debug, ballerina debugger, ballerina vscode
permalink: /learn/tooling-guide/visual-studio-code-extension/debugging/
active: debugging
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
  - /learn/tooling-guide/visual-studio-code-extension/debugging
---

## Running Without Debugging

Follow the steps below to run your program (without debugging).

1. On the VSCode editor, open the Ballerina program file you want to run.

2. Click **Run** in the top menu, and then click **Run Without Debugging**.

3. Select **Ballerina Debug** as the **Environment**.

You view the program being executed in the **DEBUG CONSOLE** as shown below.

![Run Without Debugging](/learn/images/run-without-debugging.gif)

<br/>

>**Info:** For more information on debugging your code using VS Code, go to the [VS Code Documentation](https://code.visualstudio.com/docs/editor/debugging).

## Starting a Debug Session

The VS Code Ballerina extension gives you the same debugging experience as the conventional VS Code Debugger. Follow the steps below to start a debug session.

![Start Debug Session](/learn/images/start-debug-session.gif)

<br/>

1. Open the folder, which includes the Ballerina program you want to debug and select the file.

2. Press the **Control + Shift + D** keys (for Mac: **Command + Shift +D**) to launch the Debugger view.

3. Click **create a launch.json** file and then select **Ballerina Debug** as the **Environment**.

    You view the opened `launch.json` file. 

4. Add/edit the relevant configurations for debugging in the `launch.json` file.

5. Add the debug points you require by clicking in front of the line numbers of the file you want to debug.

Then, you can start a program, test, or remote debug session as shown below.

>**Info:** If you launch the debug session through VS Code, the working directory will be the Ballerina package root. However, you can use remote debugging for alternative working directories.

<br/>

### Starting a Program Debug Session

Follow the steps below to start a program debug session.

1. Select **Ballerina Debug** from the drop-down available in the upper left corner to start a program debugging session.

2. Click the **Start Debugging** icon on the upper left corner to start debugging.

    You view the output in the **DEBUG CONSOLE**.

    ![Program Debug](/learn/images/program-debug.gif)

<br/>

### Starting a Test Debug Session

Follow the steps below to start a test debug session.

1. Select **Ballerina Test** from the drop-down available in the upper left corner to start a test debugging session.

2. Click the **Start Debugging** icon on the upper left corner to start debugging.

    You view the output in the **DEBUG CONSOLE**.

    ![Test Debug](/learn/images/test-debug.gif)

<br/>

### Starting a Remote Debug Session

Follow the steps below to start a remote debug session.

1. Select **Ballerina Remote** from the drop-down available in the upper left corner to start a remote debugging session.

2. Open the Terminal and execute the Ballerina command, which you want to debug, out of the supported remote debugging commands below. 

    - Debugging a Ballerina package or a single file: 

    ```bash
    bal run --debug <DEBUGGEE_PORT> <BAL_FILE_PATH/PACKAGE_PATH>
    ```

   - Debugging Ballerina executable JAR:  

    ```bash 
    bal run --debug <DEBUGGEE_PORT> <EXECUTABLE_JAR_FILE_PATH>
    ```

    - Debugging Ballerina tests: 

    ```bash
    bal test --debug <DEBUGGEE_PORT> <PACKAGE_PATH>
    ```

    - Debugging Ballerina tests during the build:  

    ```bash 
    bal build --debug <DEBUGGEE_PORT> <PACKAGE_PATH>
    ```
    
    The terminal will show the following log:

    ```bash
    Listening for transport dt_socket at address: 5005
    ```

3. Click the **Start Debugging** icon on the upper left corner to start debugging.

    You view the output in the **DEBUG CONSOLE**.

    ![Remote Debug](/learn/images/remote-debug.gif)

<br/>

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

>**Info** The Ballerina debugger is an open-source project and contributors are most welcome to get engaged with it via the [ballerina-lang](https://github.com/ballerina-platform/ballerina-lang) GitHub repository. If you encounter any difficulties when using this feature, feel free to create an issue on it.

<!--For more information on the above features, see [Using the Debugging Features](/learn/tooling-guide/visual-studio-code-extension/run-and-debug/using-the-debugging-features/).-->

### Using Expression Evaluation

Ballerina expression evaluator allows evaluating Ballerina variables and expressions at runtime allowing them to be viewed when the IDE is in the break mode.

The Ballerina VSCode debugger lets you evaluate expressions in the ways below.

#### Using the Debug Console

![Debugger Evaluation Console](/learn/images/debugger-evaluation-console.gif)

<br/>

#### Using the Watch Window

![Debugger Watch Window](/learn/images/debugger-watch-window.gif)

<br/>

#### Existing Limitations

The features below are currently not supported.

- Anonymous function, query, let, and constructor expressions
- Qualified identifiers (Hence, cannot evaluate imported module entities.)
- Function invocations with rest arguments
- Action invocations





