---
layout: ballerina-tooling-guide-left-nav-pages-swanlake
title: Using the Debugging Features
description: Describes the existing ballerina debugging features in vscode
keywords: ballerina debugging, ballerina debug, ballerina debugger, ballerina vscode, expression evaluation
permalink: /learn/tooling-guide/visual-studio-code-extension/run-and-debug/using-the-debugging-features/
active: using-the-debugging-features
intro: Visual Studio Code allows you to debug Ballerina programs through the Ballerina extension. The debugging features below are supported by Ballerina. 
redirect_from:
  - /learn/tooling-guide/visual-studio-code-extension/run-and-debug/using-the-debugging-features
---

>**Info** The Ballerina debugger is an open-source project and contributors are mostly welcome to get engaged with it via the [ballerina-lang](https://github.com/ballerina-platform/ballerina-lang) GitHub repository. If you encounter any difficulties when using this feature, feel free to create an issue in it.

## Expression Evaluation

Ballerina expression evaluator allows evaluating Ballerina variables and expressions at runtime allowing them to be viewed when the IDE is in the break mode.

The Ballerina VSCode debugger lets you evaluate expressions in the ways below.

### Using the Debug Console

![Debugger Evaluation Console](/learn/images/debugger-evaluation-console.gif)

### Using the Watch Window

![Debugger Watch Window](/learn/images/debugger-watch-window.gif)

### Existing Limitations

The features below are currently not supported.

- Anonymous function, query, let, and constructor expressions
- Qualified identifiers (Hence, cannot evaluate imported module entities.)
- Function invocations with rest arguments

