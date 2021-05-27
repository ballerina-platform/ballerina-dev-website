---
layout: ballerina-tooling-guide-left-nav-pages-swanlake
title: Language Support
permalink: /learn/tooling-guide/visual-studio-code-extension/language-support/
active: intellisense
intro: The Visual Studio Code Ballerina extension brings in language support to enhance the development experience and increase its efficiency. This is built into the extension via a Language Server implementation, which consists of the below features.
description: The Visual Studio Code Ballerina extension brings in language support to enhance the development experience and increase its efficiency. This is built into the extension via a Language Server implementation, which consists of the below features.
redirect_from:
  - /learn/tools-ides/vscode-plugin/language-intelligence
  - /learn/tools-ides/vscode-plugin/language-intelligence/
  - /learn/vscode-plugin/language-intelligence/
  - /learn/vscode-plugin/language-intelligence
  - /learn/tools-ides/setting-up-visual-studio-code/language-intelligence
  - /learn/tools-ides/setting-up-visual-studio-code/language-intelligence/
  - /learn/setting-up-visual-studio-code/language-intelligence
  - /learn/setting-up-visual-studio-code/language-intelligence/
  - /learn/language-intelligence
  - /learn/language-intelligence/
  - /swan-lake/learn/getting-started/setting-up-visual-studio-code/language-intelligence/
  - /swan-lake/learn/getting-started/setting-up-visual-studio-code/language-intelligence
  - /learn/tooling-guide/vs-code-extension/language-support/language-intelligence
  - /learn/tooling-guide/vs-code-extension/language-support/language-intelligence/
  - /learn/tooling-guide/visual-studio-code-extension/language-support/language-intelligence
  - /learn/tooling-guide/visual-studio-code-extension/language-support/language-intelligence/
  - /learn/tooling-guide/visual-studio-code-extension/language-support
---

## IntelliSense

The below are the features related to IntelliSense.

### Code Completion

The extension provides you with suggestions on variables, keywords, and code snippets of language constructs (such as functions, type definitions, services, iterable constructs, etc.)

![Code Completion](/learn/images/code-completion.gif)

#### Symbol Information on Hover

When hovering over a symbol name, you will be provided with quick information about the particular symbol. For example, when hovering over a function name, you will be prompted with the associated documentation.

![Symbol Information on Hover](/learn/images/symbol-information-on-hover.gif)

#### Signature Help

When typing a function/method call expression, the signature help will show information such as the function/method call’s description and parameter information. Signature help will be triggered when typing the open parenthesis and comma.

![Signature Help](/learn/images/signature-help.gif)

## Code Navigation

The below are the features related to code navigation.

### Go to Definition 

For a symbol, this feature will navigate you to the definition of the particular symbol. For example, when invoking the go to definition from a function call expression, you will be navigated to the definition of the function. Apart from jumping to the definition, the peek definition will also be supported. The behaviour will be the same not only for the constructs within the sources in the current package but also for external modules and standard libraries as well.

![Go to Definition](/learn/images/go-to-definition.gif)

### Find all References

Invoking the references on a symbol will prompt you with all the symbol references in the current package.

![Find all References](/learn/images/find-all-references.gif)

## Diagnostics

The diagnostics show you the syntax and semantic errors in the source code. Varieties of diagnostics such as errors and warnings will be shown. For a selected set of diagnostics, you can see the quick fixes. For example, the `variable assignment is required` diagnostic will have two associated quick fixes to create a new variable and ignore the return value.

![Diagnostics](/learn/images/diagnostics.gif)

## Refactoring and Code Fixes

The below are the features related to refactoring and code fixes.

### Code Formatting

Code formatting has the two options below. 

  - Formatting a document 

  ![Formatting a Document](/learn/images/format-document.gif)

  - Formatting a selected range in the document

  ![Formatting a Document Range](/learn/images/format-document-range.gif)

### Rename Symbols

This feature allows you to rename symbols by renaming all the references of the particular symbol.

![Rename Symbols](/learn/images/rename-symbols.gif)

### Code Actions

There are two types of code actions suggested based on the node at a given cursor position and based on the diagnostic at a given cursor position.

For more information, see [Code Actions](/learn/tooling-guide/visual-studio-code-extension/language-support/code-actions).

### Code Lenses

The below are the features related to code lenses.

#### Documentation Code Lens

The `Document This` code lens is shown for the public functions without documentation. 

![Documentation Code Lens](/learn/images/documentation-code-lens.gif)

#### Run and Debug Code Lenses

Run and debug code lenses are shown for the entry points of the Ballerina project and for its test cases. The entry points include the main function and the services within the default module of the project.

![Run and Debug Code Lenses](/learn/images/run-and-debug-code-lenses.gif)











