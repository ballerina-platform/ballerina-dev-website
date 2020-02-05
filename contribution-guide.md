---
layout: ballerina-inner-page
title: The Ballerina Contribution Guide
permalink: /contribution-guide/
---

# The Ballerina Contribution Guide

Ballerina is an open source programming language and platform for cloud-era application programmers to easily write software. It is licensed under the [Apache license](https://www.apache.org/licenses/LICENSE-2.0) and is nurtured by all the contributors of the Ballerina community.

We appreciate your help!

- [Get started](#get-started)
- [Set up the Prerequisites](#set-up-the-prerequisites)
- [Obtain the source code](#obtain-the-source-code)
- [Build the project](#build-the-project)
- [Set up the development environment](#set-up-the-development-environment)
    - [Set up the Ballerina plugin](#set-up-the-ballerina-plugin)
    - [Set up the ANTLR4 plugin](#set-up-the-antlr4-plugin)
- [Contribute to Ballerina grammar](#contribute-to-ballerina-grammar)
- [Submit your contribution](#submit-your-contribution)
- [Accept the Contributor License Agreement](#accept-the-contributor-license-agreement)
- [Propose changes to Ballerina](#propose-changes-to-ballerina)

## Get started

- Join the conversations at:

 <div class="col-sm-12 col-md-12 cBallerinaLearnWrapper cGrayWrapper cCommunityLinks">
  <div class="col-sm-12 col-md-3 cBoxContainer cCommunityIconsContainer">
      <div class="cBallerina-Box">
      <a class="cCommunityIcons" href="https://twitter.com/ballerinalang"><img src="/img/twitter.svg"></a>
      </div>
   </div>
   <div class="col-sm-12 col-md-3 cBoxContainer cCommunityIconsContainer">
      <div class="cBallerina-Box">
      <a class="cCommunityIcons" href="/community/slack"><img src="/img/slack.svg"></a>
      </div>
   </div>
      <div class="col-sm-12 col-md-3 cBoxContainer cCommunityIconsContainer">
      <div class="cBallerina-Box">
      <a class="cCommunityIcons" href="https://stackoverflow.com/questions/tagged/ballerina"><img src="/img/stackoverflow.svg"></a>
      </div>
   </div>
   <div class="col-sm-12 col-md-3 cBoxContainer cCommunityIconsContainer">
      <div class="cBallerina-Box">
      <a class="cCommunityIcons" href="https://groups.google.com/forum/#!forum/ballerina-dev"><img src="/img/google-groups.svg"></a>
      </div>
   </div>
</div>

- Submitting a bug is just as important as contributing to code. Report an issue in the relevant repo out of the GitHub repos listed below. 

    >**Tip:** If you are unsure whether you have found a bug, search existing issues in the corresponding repo on GitHub and raise it in the [Ballerina-Dev Google Group](#https://groups.google.com/forum/#!forum/ballerina-dev).
    - Compiler, runtime, standard library, or tooling: <a href="https://github.com/ballerina-platform/ballerina-lang/issues">ballerina-lang</a> repo
    - Language specification: <a href="https://github.com/ballerina-platform/ballerina-spec/issues">ballerina-spec</a> repo
    - Website: <a href="https://github.com/ballerina-platform/ballerina-dev-website/issues">ballerina-dev-website</a> repo
    - Security flaw: send an email to security@ballerina.io. For details, see the <a href="https://ballerina.io/security/">security policy</a>.

-  Start with GitHub issues that can be fixed easily:
    - Browse issues labeled "good first issue" in the <a href="https://github.com/ballerina-platform/ballerina-lang/issues">ballerina-lang</a> repo.
    - Use comments on the issue itself to indicate that you will be working on it and get guidance and help.

## Set up the prerequisites
1. Download [Ballerina](https://ballerina.io) and go through the [learning resources](https://ballerina.io/learn).
2. Read the [Ballerina Code of Conduct](https://ballerina.io/code-of-conduct).
3. Download the Java SE Development Kit (JDK) version 8 from one of the following locations and install it.
    - [Oracle](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
    - [OpenJDK](http://openjdk.java.net/install/index.html) 
>**Note:** Set the `JAVA_HOME` environment variable to the path name of the directory into which you installed JDK.
4. Download [Node.js](https://nodejs.org/en/download/) (version 8.9.x or the latest LTS release) and install it.
5. Download [npm](https://www.npmjs.com/get-npm) (version 5.6.0 or later) and install it.

## Obtain the source code 

1. Execute the below command to clone the ballerina-lang Git repo.
```bash 
git clone --recursive https://github.com/ballerina-platform/ballerina-lang.git
```
>**Tip:** If you have already forked the repository to your GitHub account, then execute the below command replacing `<YOUR-GITHUB-USERNAME>` with your Git username.
```bash 
git clone --recursive https://github.com/<YOUR-GITHUB-USERNAME>/ballerina-lang.git
```
2. Execute the below command to update the Git submodules.
```bash 
git submodule update --init
```
## Build the project

1. Navigate to the root directory of the Ballerina project (i.e., `<BALLERINA_PROJECT_ROOT>`) and execute the below Gradle command.
```bash 
./gradlew clean build
```
2. Extract the built Ballerina distributions in the below locations.
-  **runtime only:** `<BALLERINA_PROJECT_ROOT>/distribution/zip/jballerina/build/distributions/jballerina-<version>-SNAPSHOT.zip`
-  **runtime and tools (e.g., Ballerina Language Server):** `<BALLERINA_PROJECT_ROOT>/distribution/zip/jballerina-tools/build/distributions/jballerina-tools-<version>-SNAPSHOT.zip`
>**Note:** If you face an IOException error stating "Too many open files", this is due to the default number of possible open files being set to a lower number on your operating system than required for Ballerina to be compiled. You may have to increase the number of open files/file descriptors (FD) on your operating system to 1000000 (or higher).

## Set up the development environment

See the below sections to set up the required plugins in your preferred IDEs/Editors.

### Set up the Ballerina plugin

Currently, Ballerina has the below plugins developed for IntelliJ IDEA and VS Code. 
- [Ballerina plugin for IntelliJ IDEA](https://plugins.jetbrains.com/plugin/9520-ballerina)
    
    For installation instructions, see [Ballerina IntelliJ Plugin Documentation](https://ballerina.io/learn/vscode-plugin).
- [Ballerina plugin for VS Code](https://plugins.jetbrains.com/plugin/9520-ballerina)
    
    For installation instructions, see [Ballerina VS Code Documentation](https://ballerina.io/learn/vscode-plugin).

### Set up the ANTLR4 plugin

This plugin will be useful to check and validate a [grammar rule](#contributing-to-ballerina-grammar) you wrote. For instructions on installing the ANTLR4 plugin based on your preferred IDE/Editor (which supports antlr 4.x version), go to [ANTLR Documentation](https://www.antlr.org/tools.html).

## Contribute to Ballerina grammar

Ballerina grammar has been implemented using ANTLR plugin version 4.5.3. To get a basic understanding of ANTLR grammar syntax and concepts before working with Ballerina grammar, go to [Parr, Terence (January 15, 2013), The Definitive ANTLR 4 Reference](https://www.oreilly.com/library/view/the-definitive-antlr/9781941222621/).

[Ballerina grammar](https://github.com/ballerina-platform/ballerina-lang/tree/master/compiler/ballerina-lang/src/main/resources/grammar) consists of two files:

- **BallerinaLexer.g4:** contains the lexer rules for Ballerina grammar. Lexer is responsible for tokenizing an input Ballerina source code.
- **BallerinaParser.g4:** contains the parser rules. Parser listens to the token stream generated by the lexer. High level grammar productions/abstractions are defined in the parser using those tokens.

Once a change is done to any of the grammar files, the lexer and the parser need to be re-generated. To generate the lexer and the parser, navigate to the `<BALLERINA_PROJECT_ROOT>/compiler/ballerina-lang/src/main/resources/grammar/` directory, and execute the below command. 

>**Tip:** Download the [antlr-complete-4.5.3.jar](https://jar-download.com/artifacts/org.antlr/antlr4/4.5.3/source-code) file and replace `<PATH-TO-ANTLR-JAR>` in the below command with the location in which you saved it.

```bash 
java -jar <PATH-TO-ANTLR-JAR>/antlr-4.5.3-complete.jar *.g4 -package org.wso2.ballerinalang.compiler.parser.antlr4 -o <BALLERINA_PROJECT_ROOT>/compiler/ballerina-lang/src/main/java/org/wso2/ballerinalang/compiler/parser/antlr4/
```

**Info:** The above command will autogenerate some Java classes. The Ballerina AST builder is written on top of the auto-generated `BallerinaParserBaseListener.java` class. Thus, if any new rules are added to the `BallerinaParser.g4`, above command will generate new methods in the `BallerinaParserBaseListener.java` and you need to override those newly-added methods inside the `BLangParserListener.java` accordingly.

For more information about the Ballerina compiler, go to [Ballerina Compiler — Design](https://medium.com/@sameerajayasoma/ballerina-compiler-design-3406acc2476c?).

## Submit your contribution

1. Do your changes in the source code.
2. Add unit tests accordingly. (The build process will automatically execute all the tests.)
3. Commit the changes to your fork and push them to the corresponding original repo by sending a Pull Request (PR). 

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
