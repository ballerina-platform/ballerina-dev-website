---
layout: debugging-ballerina-programs-left-nav-pages-swanlake
title: Debug Ballerina programs
description: Describes debugging functionalities provided by Ballerina in Visual Studio Code.  
keywords: ballerina debugging, ballerina debug, ballerina debugger, ballerina vscode
permalink: /learn/debug-ballerina-programs/
active: debug-ballerina-programs
---

The Ballerina compiler comes in handy to detect syntax and semantic issues that occur in your code when developing large-scale applications with complex logic. However, it is difficult for the compiler to detect runtime errors like logical errors because they occur during the program execution after a successful compilation. This is where the dedicated debugging tooling support of Ballerina becomes important.

## Debug sessions

The VS Code extension provides the three types of sessions below to debug your Ballerina code.

- Program debug sessions - debug a complete Ballerina program
- Test debug sessions - debug a test function
- Remote debug dessions - debug a Ballerina program that is running remotely 

>**Info:** For more information on the debug sessions, go to <a href="https://wso2.com/ballerina/vscode/docs/debug-the-code/perform-debugging/" target="_blank">Perform debugging</a>.

## Debug methods

There are two ways to debug the above sessions. 

You can either click on the **Debug** CodeLens, which appear at the top of a complete Ballerina program or a test function or create a `launch.json` file with the required configuration attributes (use the defualt configurations or edit them as required) and use either of the options below.

- **Ballerina Debug**
- **Ballerina Test**
- **Ballerina Remote**  


>**Info:** For more information on the debug sessions, go to <a href="https://wso2.com/ballerina/vscode/docs/debug-the-code/perform-debugging/" target="_blank">Perform debugging</a>.

## Debug features

The Ballerina VScode extension currently supports many debugging features that are available in the VS Code editor.

>**Info:** For detailed information on the feature-rich debugging experience for troubleshooting Ballerina applications provided via the Ballerina VS Code extension, go to <a href="https://wso2.com/ballerina/vscode/docs/debug-the-code/use-the-debugging-features" target="_blank">Use the debugging features</a>.
