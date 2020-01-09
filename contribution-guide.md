---
layout: ballerina-inner-page
title: The Ballerina Contribution Guide
permalink: /contribution-guide/
---

# The Ballerina Contribution Guide

Ballerina is an open source programming language and platform for cloud-era application programmers to easily write software. It is licensed under the Apache license and is nurtured by all the contributors of the Ballerina community.

We appreciate your help!

- [Gett started](#get-started)
- [Set up the Prerequisites](#set-up-the-prerequisites)
- [Set up the developer environment](#set-up-the-developer-environment)
    - [Set up IntelliJ IDEA](#set-up-intellij-idea)
    - [Set up Eclipse](#set-up-eclipse)
- [Obtain the source code](#obtain-the-source-code)
- [Build the project](#build-the-project)
- [Contribute to Ballerina grammar](#contribute-to-ballerina-grammar)
- [Submit your contribution](#submit-your-contribution)
- [Accept the Contributor License Agreement](#accept-the-contributor-license-agreement)
- [Propose changes to Ballerina](#propose-changes-to-ballerina)

## Gett started

- Join the conversations at:

    - [Ballerina-Dev Google Group](https://groups.google.com/forum/#!forum/ballerina-dev): to join the developer team mailing list to discuss Ballerina roadmap, features, issues that are in progress etc.
    - [StackOverflow](https://stackoverflow.com/questions/tagged/ballerina): to get help with Ballerina. (Use the Ballerina tag for your questions there.) 
    - [Slack](https://app.slack.com/client/T47EAEKB5/DF818FX9Q): for real-time communications with the team and community.

- **IMPORTANT:** Send an email to security@ballerina.io to report sensitive security-related issues. For details, see the <a href="https://ballerina.io/security/">security policy</a>.

- Submitting a bug is just as important as contributing to code. Create a new issue in the relevant GitHub repo using the below links, fill out all sections in the issue template, and submit the bug/issue report. 

    >**Tip:** If you are unsure whether you have found a bug, search existing issues in the corresponding repo on GitHub and raise it in the [Ballerina-Dev Google Group](#https://groups.google.com/forum/#!forum/ballerina-dev).
   - compiler, runtime, standard library, or tooling: <a href="https://github.com/ballerina-platform/ballerina-lang/issues">ballerina-lang</a> repo.
   - language specification: <a href="https://github.com/ballerina-platform/ballerina-spec/issues">ballerina-spec</a> repo.
   - website: <a href="https://github.com/ballerina-platform/ballerina-dev-website/issues">ballerina-dev-website</a> repo. 

-  Start with GitHub issues that can be fixed easily:
    - Browse issues labeled "good first issue" in the <a href="https://github.com/ballerina-platform/ballerina-lang/issues">ballerina-lang</a> repo.
    - Use comments on the issue itself to indicate that you will be working on it and get guidance and help.

## Set up the prerequisites
1. Download [Ballerina](https://ballerina.io) and go through the [learning resources](https://ballerina.io/learn).
2. Read the [Ballerina Code of Conduct](https://ballerina.io/code-of-conduct).
3. Download the Java SE Development Kit (JDK) version 8 from one of the following locations:
    - [Oracle](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
    - [OpenJDK](http://openjdk.java.net/install/index.html) and install it.
>**Note:** Set the JAVA_HOME environment variable to the path name of the directory into which you installed JDK.
4. Download [Node.js](https://nodejs.org/en/download/) (version 8.9.x or the latest LTS release) and install it.
5. Download [npm](https://www.npmjs.com/get-npm) (version 5.6.0 or later) and install it.

## Set up the developer environment

See the below sections to set up IntelliJ IDEA or Eclipse as your development environment.

### Set up IntelliJ IDEA

Follow the steps below to import the Ballerina project to IntelliJ IDEA similar to any other Gradle project.

1. In IntelliJ, click **File** and then click **Open**.
2. Browse the file system and select the <BALLERINA-LANG_REPO> root directory.
>**Tip:** If you are opening the directory for the first time in IntelliJ and if prompted to import it as a Gradle project, select the **Auto import** option.
3. Set Project SDK as Java 1.8.
4. Install the following plugins:
    - [Ballerina plugin for IntelliJ IDEA](https://plugins.jetbrains.com/plugin/9520-ballerina)
    
        For installation instructions, see [Ballerina IntelliJ Plugin Documentation](https://ballerina.io/learn/tools-ides/intellij-plugin).
    - [ANTLR plugin for IntelliJ IDEA](https://plugins.jetbrains.com/plugin/7358-antlr-v4-grammar-plugin)
        
        This will be useful to check and validate a [grammar rule](#contributing-to-ballerina-grammar) you wrote.

### Set up Eclipse

As all Ballerina repositories are developed as Maven or Gradle projects, follow the steps below to import any Ballerina project to Eclipse similar to any Maven or Gradle project.

1. In Eclipse, click **File** and then click **Import..**.
2. Under the **Maven** option, select **Existing Maven Projects**. 
3. Browse the file system and select the Maven module to open it.

## Obtain the source code 

1. Execute the below command to clone the ballerina-lang Git repo.
```bash 
git clone --recursive https://github.com/ballerina-platform/ballerina-lang.git
```
>**Tip:** If you have already forked the repository to your GitHub account, then execute the below command replacing 'YOUR-GITHUB-USERNAME' with your Git username.
```bash 
git clone --recursive https://github.com/<YOUR-GITHUB-USERNAME>/ballerina-lang.git
```
2. Execute the below command to update the Git submodules.
```bash 
git submodule update --init
```
## Build the project

1. Navigate to the <BALLERINA-LANG_REPO> root directory and execute the below Gradle command.
```bash 
./gradlew clean build
```
2. Extract the built Ballerina distributions in the below locations.
-  **runtime only:** <BALLERINA-LANG_REPO>/distribution/zip/jballerina/build/distributions/jballerina-<version>-SNAPSHOT.zip. 
-  **runtime and tools (e.g., Ballerina Composer):** <BALLERINA-LANG_REPO>/distribution/zip/jballerina-tools/build/distributions/jballerina-tools-<version>-SNAPSHOT.zip.
>**Note:** If you face an IOException error stating "Too many open files", this is due to the default number of possible open files being set to a lower number on your operating system than required for Ballerina to be compiled. You may have to increase the number of open files/file descriptors (FD) on your operating system to 1000000 (or higher).

## Contribute to Ballerina grammar

Ballerina grammar has been implemented using ANTLR plugin version 4.5.3. To get a basic understanding on ANTLR grammar syntax and concepts before working with Ballerina grammar, go to [Parr, Terence (January 15, 2013), The Definitive ANTLR 4 Reference](https://www.oreilly.com/library/view/the-definitive-antlr/9781941222621/).

[Ballerina grammar](https://github.com/ballerina-platform/ballerina-lang/tree/master/compiler/ballerina-lang/src/main/resources/grammar) consists of two files:

- **BallerinaLexer.g4:** contains the lexer rules for Ballerina grammar. Lexer is responsible for tokenizing an input Ballerina source code.
- **BallerinaParser.g4:** contains the parser rules. Parser listens to the token stream generated by the lexer. High level grammar productions/abstractions are defined in the parser using those tokens.

Once a change is done to any of the grammar files, the lexer and the parser need to be re-generated. To generate the lexer and the parser, navigate to the <BALLERINA_LANG_REPO>/compiler/ballerina-lang/src/main/resources/grammar/ directory, and execute the below command. 

>**Tip:** Download the [antlr-complete-4.5.3.jar](https://jar-download.com/artifacts/org.antlr/antlr4/4.5.3/source-code) file and replace <PATH-TO-ANTLR-JAR> in the below command with the location in which you saved it.

```bash 
java -jar <PATH-TO-ANTLR-JAR>/antlr-4.5.3-complete.jar *.g4 -package org.wso2.ballerinalang.compiler.par
```

For more information about the Ballerina compiler, go to [Ballerina Compiler — Design](https://medium.com/@sameerajayasoma/ballerina-compiler-design-3406acc2476c?).

## Submit your contribution

1. Do your changes in the <BALLERINA_LANG_REPO> using Eclipse or IntelliJ IDEA.
2. Add unit tests accordingly. (The build process will automatically execute all the tests.)
3. Commit the changes to your fork and push them to the original <a href="https://github.com/ballerina-platform/ballerina-lang/issues">ballerina-lang</a> repo by sending a Pull Request (PR). 

>**Tip:** Follow these commit message requirements:

- Separate subject from body with a blank line
- Limit the subject line to 50 characters
- Capitalize the subject line
- Do not end the subject line with a period
- Use the imperative mood in the subject line
- Wrap the body at 72 characters
- Use the body to explain what and why vs. how

For more information, go to [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/).

## Accept the Contributor License Agreement 

You need to Accept the Ballerina Contributor License Agreement (CLA) here when prompted by GitHub while sending your first Pull Request (PR). Subsequent PRs will not require CLA acceptance.

If the CLA gets changed for some (unlikely) reason, you will be presented with the new CLA text when sending your first PR after the change.

## Propose changes to Ballerina

Start the discussion on the changes you propose in the [Ballerina-Dev Google Group](https://groups.google.com/forum/#!forum/ballerina-dev). Once there is enough consensus around the proposal, you will likely be asked to file an issue on GitHub and label it as 'Proposal' to continue a detailed discussion there.
