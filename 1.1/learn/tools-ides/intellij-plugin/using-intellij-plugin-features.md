---
layout: ballerina-inner-page
title: Using the features of the IntelliJ plugin
permalink: /1.1/learn/intellij-plugin/using-intellij-plugin-features
redirect_from:
  - /1.1/learn/tools-ides/intellij-plugin/using-intellij-plugin-features
  - /1.1/learn/tools-ides/intellij-plugin/using-intellij-plugin-features/
  - /v1-1/learn/tools-ides/intellij-plugin/using-intellij-plugin-features
  - /v1-1/learn/tools-ides/intellij-plugin/using-intellij-plugin-features/
  - /v1-1/learn/intellij-plugin/using-intellij-plugin-features
  - /v1-1/learn/intellij-plugin/using-intellij-plugin-features/
---

# Using the features of the IntelliJ plugin

The below sections include information on the various capabilities that are facilitated by the IntelliJ Ballerina plugin for the development process.

- [Running Ballerina programs](#running-ballerina-programs)
- [Debugging Ballerina programs](#debugging-ballerina-programs)
- [Viewing the sequence diagram](#viewing-the-sequence-diagram)
- [Importing modules on the fly](#importing-modules-on-the-fly)
- [Importing unambiguous modules](#importing-unambiguous-modules)
- [Formatting Ballerina codes](#formatting-ballerina-codes)
- [Viewing documentation](#viewing-documentation)
- [Adding annotation fields via suggestions](#adding-annotation-fields-via-suggestions)
- [Using file templates](#using-file-templates)
- [Using code snippet templates](#using-code-snippet-templates)
- [Checking spellings](#checking-spellings)
- [Analyzing semantics](#analyzing-semantics)
- [Code folding](#code-folding)

## Running Ballerina programs

You can run Ballerina main/service programs with a single click without adding or changing any configurations.

The below sections include instructions on how to run different elements of a Ballerina file.

- [Running the main method](#running-the-main-method)
- [Running Ballerina services](#running-ballerina-services)

### Running the main method

Follow the steps below to run the main function of a Ballerina file.

1. Click the green color icon located near the main function.

    ![Click the Run Application icon](/1.1/learn/images/run-application-icon.png)

2. Click the corresponding **Run <FILE_NAME>** command.

    ![Click the Run command](/1.1/learn/images/select-run-command.png)

This executes the main function of the Ballerina file and displays the output in the **Run** window.

![Output of running the main function](/1.1/learn/images/output-of-main-function.png)

> **Tip:** Alternatively, you can right click on the name of the file and run the main method of it.

### Running Ballerina services

Follow the steps below to run a service of a Ballerina file.

1. Click the green color icon located near the definition of the service.

2. Click the corresponding **Run *<FILE_NAME>*** command.

This starts the service and displays the output in the **Run** window. If you have multiple services in the Ballerina file, this starts all of them.

![Output of running a service](/1.1/learn/images/output-of-ballerina-service.png)

> **Tip:** Alternatively, you can right click on the name of the file and run the service(s) of it.


## Debugging Ballerina programs

You can debug Ballerina main/service programs with a few clicks.

![Debug Ballerina programs](/1.1/learn/images/debug-ballerina-intellij.gif)

### Troubleshooting
- Stepping over code lines in non-blocking paths (eg: action invocations) will not pause VM on next line
    - workaround: manually put a breakpoint to next line
- There are some cases where stepping over gives unexpected behavior
    - Eg: When there are multiple workers and a wait expression waiting for them, even though step over hit and pass wait line in source, workers are not yet finished execution.

## Viewing the sequence diagram

The underlying language semantics of Ballerina were designed by modeling how independent parties communicate via structured interactions. Subsequently, every Ballerina program can be displayed as a sequence diagram of its flow including endpoints as well as synchronous and asynchronous calls.

To view the sequence diagram of a Ballerina file, click the (![design view icon](https://raw.githubusercontent.com/ballerina-platform/ballerina-lang/2fd0bdd4e7d081adf23901ed65eca32623d81889/tool-plugins/vscode/docs/show-diagram-icon.png)) in the top right corner of the IDE window as shown in the below example.

![HTTP circuit breaker sequence diagram](/1.1/learn/images/circuit-breaker-sequence-diagram.gif)

## Importing modules on the fly

You can add import declarations to your Ballerina programs on the fly. When you select the module name from the lookup list, the module declaration will be added automatically.

![Import modules on the fly](/1.1/learn/images/import-modules-on-the-fly.gif)

## Importing unambiguous modules 

When you copy and paste Ballerina code to IntelliJ, this feature allows you to import unambiguous imports. You can apply these imports by clicking on the module name and pressing **Alt + Enter** keys.

>**Note:** This is disabled by default since this might cause issues if the file contains grammar mistakes. Follow the steps below to enable it.
>1. Open IntelliJ, click **IntelliJ IDEA** in the top menu, click **Preferences**, and then click **Languages and Frameworks**. 
>- **Tip:** If you are using Windows, click **File**, click **Settings**, and then click **Languages and Frameworks**.
>2. Click **Ballerina** and then click **Auto Import**.
>3. Select the **Add unambiguous imports on the fly** checkbox and click **OK**.

![Import unambiguous modules](/1.1/learn/images/import-unambiguous-modules.gif)

## Formatting Ballerina codes

You can reformat the Ballerina codes by pressing the **Ctrl+Alt+L** keys.

![Formatting Ballerina codes](/1.1/learn/images/format-code.gif)

## Viewing documentation

You can view the documentation of a function, remote function, etc. by pressing the **Ctrl+Q** keys or by hovering over the element while pressing the **Ctrl** key.

![Viewing documentation](/1.1/learn/images/view-documentation.gif)

## Adding annotation fields via suggestions

You can add annotation fields to your code using the annotation field names that are suggested inside annotation attachments.

![Adding annotation fields via suggestions](/1.1/learn/images/annotation-field-suggestion.gif)

## Using file templates

Three types of Ballerina file templates are available.

1. **Ballerina Main** - contains a sample main program
2. **Ballerina Service** - contains a sample service
3. **Empty File** - contains an empty file

![Using file templates](/1.1/learn/images/file-templates.gif)

## Using code snippet templates

Code snippet templates contain boilerplate codes and allows you to write your code efficiently. 

![Using code snippet templates](/1.1/learn/images/code-snippet-templates.gif)

## Checking spellings

The spell-checker is enabled for all identifiers. You can rename all of the definitions and references as well.

![Checking spellings](/1.1/learn/images/check-spellings.gif)

## Analyzing semantics

The Ballerina IDEA plugin provides capabilities to diagnose and analyze semantics of your Ballerina programs through the Ballerina Language Server.

![Analyzing semantics](/1.1/learn/images/analyzing-semantics.gif)

## Code folding

You expand/collapse the following Ballerina code segments using the icons in the IntelliJ IDE.

- imports
- services 
- objects
- records
- functions and object functions
- annotations
- markdown documentation
- multiline comments
 
![Code folding](/1.1/learn/images/code-folding.gif)

## What's next?

- For more information on the IntelliJ IDEA Ballerina plugin, see [IntelliJ IDEA Ballerina Plugin](/1.1/learn/intellij-plugin).
- For information on all the tools and IDEs that are supported by Ballerina, see [Learn](/1.1/learn/).
