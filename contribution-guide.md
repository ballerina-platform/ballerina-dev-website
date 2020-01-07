Ballerina is an open source programming language and platform for cloud-era application programmers to easily write software. We are an open-source project under the Apache license and the work of hundreds of contributors.

# The ballerina Contribution Guide

Ballerina is an open source programming language and platform for cloud-era application programmers to easily write software. It is an open-source project under the Apache license and the work of hundreds of contributors.

We appreciate your help!

- [Getting engaged](#getting-engaged)
- [Getting started](#getting-started)
- [Obtaining the source code](#obtaining-the-source-code)
- [Building the project](building-the-project)
- [Setting up the developer environment](setting-up-the-developer-environment)
    - [Setting up IntelliJ IDEA](#setting-up-intelliJ-idea)
    - [Setting up Eclipse](#setting-up-eclipse)
- [Contributing to Ballerina grammar](#contributing-to-ballerina-grammar)
- [Submitting your contribution](#submitting-your-contribution)
- [Accepting the Contributor License Agreement](#accepting-the-contributor-license-agreement)
- [Proposing changes to Ballerina](#proposing-changes-to-ballerina)

## Getting engaged

- The [Ballerina-Dev Google Group](#https://groups.google.com/forum/#!forum/ballerina-dev) is the main Ballerina project discussion forum. Also, you can use [StackOverflow](#https://stackoverflow.com/questions/tagged/ballerina) for support, [Slack](#https://app.slack.com/client/T47EAEKB5/DF818FX9Q) for real-time communications.

- **IMPORTANT:** Send an email to security@ballerina.io to report sensitive security-related issues. For details, see the <a href="https://ballerina.io/security/">security policy</a>.

- Submitting a bug is just as important as contributing to code. Click the **Issues** tab of the below GitHub repos, click **New Issue**, fill out all sections in the issue template, and submit the bug/issue report.

    >**Tip:** If you are unsure whether you have found a bug, search existing issues in GitHub and raise it in the [Ballerina-Dev Google Group](#https://groups.google.com/forum/#!forum/ballerina-dev).
   - compiler, runtime, standard library, or tooling: <a href="https://github.com/ballerina-platform/ballerina-lang/issues">ballerina-lang</a> repo.
   - language specification: <a href="https://github.com/ballerina-platform/ballerina-spec/issues">ballerina-spec</a> repo.
   - website: <a href="https://github.com/ballerina-platform/ballerina-dev-website/issues">ballerina-dev-website</a> repo. 

## Getting started

1. Download [Ballerina](#https://ballerina.io) and go through the [learning resources](#https://ballerina.io/learn).
2. Read the [Ballerina Code of Conduct](#https://ballerina.io/code-of-conduct).
3. Download the Java SE Development Kit (JDK) version 8 from [Oracle](#http://www.oracle.com/technetwork/java/javase/downloads/index.html) or [OpenJDK](#http://openjdk.java.net/install/index.html) and install it.
>**Note:** Set the JAVA_HOME environment variable to the path name of the directory into which you installed JDK.
4. Download [Node.js](#https://nodejs.org/en/download/) (version 8.9.x or the latest LTS release) and intsall it.
5. Download [npm](#https://www.npmjs.com/get-npm) (version 5.6.0 or later) and install it.
6. If you are using IntelliJ IDEA (version 2016.3 or later), download the [Ballerina extension for IntelliJ IDEA](#https://plugins.jetbrains.com/plugin/9520-ballerina) and install it.
7. Install and set up the ANTLR 4 plugin based on your IDE to check and validate a grammar rule you wrote.
8. Start with GitHub issues that can be fixed easily:
    - Browse issues labeled "good first issue" in the <a href="https://github.com/ballerina-platform/ballerina-lang/issues">ballerina-lang</a> repo.
    - Use comments on the issue itself to indicate that you will be working on it and get guidance and help.

## Obtaining the source code 

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
## Building the project

1. Navigate to the <BALLERINA-LANG_REPO> root directory and execute the below Gradle command.
```bash 
./gradlew clean build
```
2. Extract the built Ballerina distributions in the below locations.
-  **runtime only:** <BALLERINA-LANG_REPO>/distribution/zip/jballerina/build/distributions/jballerina-<version>-SNAPSHOT.zip. 
-  **runtime and tools (e.g., Ballerina Composer):** <BALLERINA-LANG_REPO>/distribution/zip/jballerina-tools/build/distributions/jballerina-tools-<version>-SNAPSHOT.zip.
>**Note:** If you face an IOException error stating "Too many open files", this is due to the default number of possible open files being set to a lower number on your operating system than required for Ballerina to be compiled. You may have to increase the number of open files/file descriptors (FD) on your operating system to 1000000 (or higher).

## Setting up the developer environment

See the below sections to set up IntelliJ IDEA or Eclipse as your development environment.

### Setting up IntelliJ IDEA

Follow the steps below to import the Ballerina project to IntelliJ IDEA similar to any other Gradle project.

1. In IntelliJ, click **File** and then click **Open**.
2. Browse the file system and select the <BALLERINA-LANG_REPO> root directory.
>**Tip:** If you are opening the directory for the first time in IntelliJ and if prompted to import it as a Gradle project, select the **Auto import** option.
3. Set Project SDK as Java 1.8.

### Setting up Eclipse

As all Ballerina repositories are developed as Maven or Gradle projects, follow the steps below to import any Ballerina project to Eclipse similar to any Maven or Gradle project.

1. In Eclipse, click **File** and then click **Import..**.
2. Under the **Maven** option, select **Existing Maven Projects**. 
3. Browse the file system and select the Maven module to open it.

## Contributing to Ballerina grammar

Ballerina grammar has been implemented using ANTLR4. To get a basic understanding on ANTLR 4 grammar syntax and concepts before working with Ballerina grammar, go to [Parr, Terence (January 15, 2013), The Definitive ANTLR 4 Reference](#http://lms.ui.ac.ir/public/group/90/59/01/15738_ce57.pdf).

[Ballerina grammar](#https://github.com/ballerina-platform/ballerina-lang/tree/master/compiler/ballerina-lang/src/main/resources/grammar) consists of two files:

- **BallerinaLexer.g4:** contains the lexer rules for Ballerina grammar. Lexer is responsible for tokenizing an input Ballerina source code.
- **BallerinaParser.g4:** contains the parser rules. Parser listens to the token stream generated by the lexer. High level grammar productions/abstractions are defined in the parser using those tokens.

Once a change is done to any of the grammar files, the lexer and the parser need to be re-generated. To generate the lexer and the parser, navigate to the <BALLERINA_LANG_REPO>/compiler/ballerina-lang/src/main/resources/grammar/ directory, and execute the below command. 

>**Tip:** Download the [antlr-complete-4.5.3.jar](#https://jar-download.com/artifacts/org.antlr/antlr4/4.5.3/source-code) file and replace <PATH-TO-ANTLR-JAR> in the below command with the location in which you saved it.

```bash 
java -jar <PATH-TO-ANTLR-JAR>/antlr-4.5.3-complete.jar *.g4 -package org.wso2.ballerinalang.compiler.par
```

For more information about the Ballerina compiler, go to [Ballerina Compiler — Design](#https://medium.com/@sameerajayasoma/ballerina-compiler-design-3406acc2476c?).

## Submitting your contribution

1. Do your changes in the <BALLERINA_LANG_REPO> using Eclipse or IntelliJ IDEA.
2. Add unit tests accordingly. (The build process will automatically execute all the tests.)
3. Commit the changes to your Fork and push them to the original <a href="https://github.com/ballerina-platform/ballerina-lang/issues">ballerina-lang</a> repo by sending a Pull Request. 

>**Tip:** Follow these commit message requirements:

- Separate subject from body with a blank line
- Limit the subject line to 50 characters
- Capitalize the subject line
- Do not end the subject line with a period
- Use the imperative mood in the subject line
- Wrap the body at 72 characters
- Use the body to explain what and why vs. how

For more information, go to [How to Write a Git Commit Message](#https://chris.beams.io/posts/git-commit/).

## Accepting the Contributor License Agreement 

You need to Accept the Ballerina Contributor License Agreement (CLA) here when prompted by GitHub while sending your first Pull Request (PR. Subsequent PRs will not require CLA acceptance.

If the CLA gets changed for some (unlikely) reason, you will get presented with the new CLA text on your first PR, which is sent after the change.

## Proposing changes to Ballerina

Start the discussion on the changes you propose in the [Ballerina-Dev Google Group](#https://groups.google.com/forum/#!forum/ballerina-dev). Once there is enough consensus around the proposal, you will likely be asked to file an Issue in GitHub and label it as 'Proposal' to continue a detailed discussion there.
