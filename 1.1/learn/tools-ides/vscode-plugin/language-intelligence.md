---
layout: ballerina-inner-page
title: Language Intelligence
permalink: /1.1/learn/vscode-plugin/language-intelligence
redirect_from:
  - /1.1/learn/tools-ides/vscode-plugin/language-intelligence
  - /1.1/learn/tools-ides/vscode-plugin/language-intelligence/
  - /v1-1/learn/tools-ides/vscode-plugin/language-intelligence
  - /v1-1/learn/tools-ides/vscode-plugin/language-intelligence/
  - /v1-1/learn/vscode-plugin/language-intelligence
  - /v1-1/learn/vscode-plugin/language-intelligence
---

# Language Intelligence

The VS Code Ballerina extension brings in language intelligence to enhance the development experience and increase its efficiency.

Language intelligence is built in to the extension via a Language Server implementation, which consists of the below language intelligence options.

- [Semantic and syntactic diagnostics](#semantic-and-syntactic-diagnostics)
- [Suggestions and auto completion](#suggestions-and-auto-completion)
- [Code actions](#code-actions)
- [Hover support](#hover-support)

## Semantic and syntactic diagnostics

When there are syntax or semantic errors in your code, you will be notified with appropriate diagnostics during the development time. 

> **Tip**: The detailed description that appears when you hover over the lines underlined in red will be consistent with the error message that you get during compile-time.

![Semantic and syntactic diagnostics](/1.1/learn/images/semantic-and-syntactic.gif)

## Suggestions and auto completion

The extension provides you with suggestions on keywords, variables, and code snippets of language constructs (such as functions, services, and iterable constructs etc.).

![Suggestions and auto completion](/1.1/learn/images/suggestions.gif)

> **Tip**: You can use these suggestions to access the contents of the modules available in your Ballerina home repo as well as in the Ballerina distribution.

## Code actions

These allow you to perform the below tasks easily based on the diagnostics and the current scope where the cursor resides. 

- Add documentation for an entity such as a function, service, resource, object, record etc.
- Add documentation for all the available entities in the current file
- Add missing imports 
- Create variable definitions
- Create an undefined function

For example, you can add documentation for a function as shown below.

 ![Code actions](/1.1/learn/images/code-actions.gif)

## Hover support

 Hover support provides you quick access to information about a certain entity. 
 
 For an example, if you hover over a function name, you can view its description, information about its parameters, and the description of its return type as shown below.

  ![Hover support](/1.1/learn/images/hover-support.gif)
 
 > **Tip**: Likewise, if you hover over an entity name of an object or a record, you can view the description of the object/record as well as descriptions of its fields.

Above are the language intelligence features that are currently available in the Ballerina VS Code Extension.

## What's next?

 - For information on the next capability of the VS Code Ballerina extension, see [Run and Debug](/1.1/learn/vscode-plugin/run-and-debug).
 - For information on the VS Code Ballerina extension, see [The Visual Studio Code Ballerina Extension](/1.1/learn/vscode-plugin).
