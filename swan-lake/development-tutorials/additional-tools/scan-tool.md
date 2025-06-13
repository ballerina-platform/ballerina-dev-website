---
title: Scan tool
description: Learn how to perform static code analysis on Ballerina projects to identify potential code smells, bugs, and vulnerabilities.
keywords: ballerina runtime, troubleshoot, scan, thread dump
permalink: /learn/scan-tool/
active: scan-tool
---

The Ballerina scan tool is a static code analysis tool that performs analysis on Ballerina projects and identifies potential code smells, bugs, and vulnerabilities without executing them.

>**Note:** Ballerina scan is an experimental feature that supports only a limited set of rules.

## Install the tool

Execute the command below to pull the scan tool from [Ballerina Central](https://central.ballerina.io/ballerina/wsdl/latest).

```
$ bal tool pull scan
```

To learn more about managing Ballerina tools, refer to the [Ballerina CLI tool command documentation](https://ballerina.io/learn/cli-commands/#tool-commands).

## Usage Guide for Ballerina scan tool

The Ballerina scan tool helps you analyze your Ballerina project for potential issues, enforce coding standards, and generate detailed reports. 

The scan tool supports several command-line options as follows.

``` bash
$ bal scan [--target-dir] <target-dir>
        [--scan-report] 
        [--list-rules]
        [--include-rules] <id(s)-of-rule(s)-to-include>
        [--exclude-rules] <id(s)-of-rule(s)-to-exclude>
        [--platforms] <platform(s)-to-report-results>
```

Below are various ways you can use the tool to fit your development workflow.

### Scan a Ballerina project

To run a full analysis across all Ballerina files in your project, use the following command:

```
$ bal scan --scan-report
```

This will produce the HTML report and scan results inside the `target/report` directory.

The report includes a summary of the number of code smells, bugs, and vulnerabilities found in each file.

![scan-report-summary-view](/learn/images/scan-tool-html-report-summary-view.png)

To investigate further, you can click on a file name to view a detailed breakdown of the issues. This view highlights the exact lines where problems were detected, along with a description, and the severity level.

![scan-report-file-view](/learn/images/scan-tool-html-report-file-view.png)

### List all available analysis rules

If you’d like to explore the full set of rules the tool can apply, run:

```
$ bal scan --list-rules
```

This will display a comprehensive list of available rules for your project, which you can include or exclude in future scans.

The output will look something like this:

![list-rules](/learn/images/scan-tool-list-rules.png)

> **Note:** The list of displayed rules is specific to the current Ballerina project and is determined based on its dependencies.

### Run analysis for specific rules

If you want to apply a specific set of rules, list them as a comma-separated string by specifying the rule ID:

```
$ bal scan --include-rules="ballerina:1, ballerina/io:2"
```

To ignore a specific set of rules during the analysis, use the following command:

```
$ bal scan --exclude-rules="ballerina:1, ballerina/io:2"
```

## Publish static code analysis reports to SonarQube.

SonarQube is a popular open-source platform for continuous inspection of code quality. It provides static code analysis, code coverage, and other features to help developers maintain clean, maintainable codebases. The Ballerina scan tool can be integrated with SonarQube to publish static code analysis reports, enabling seamless integration into your CI/CD pipelines.

This guide walks you through the process of configuring SonarQube and publishing Ballerina static code analysis reports.

### Prerequisites
- SonarQube 9.9 LTA Community Edition installed.
- SonarScanner CLI 4.8.0 or later installed and added to your system `PATH`.
- [SonarQube Ballerina plugin](TODO), and [SonarQube platform plugin](TODO) downloaded.

### Configure the SonarQube server

1. Install Java 17 in your machine.
   - If Java 17 is not the default Java installation, override it:

      **For Unix/macOS:**
      ```bash
      export SONAR_JAVA_PATH="path/to/java17_home/bin/java"
      ```

      **For Windows:**
      ```bash
      setx SONAR_JAVA_PATH="path\to\java17_home\bin\java"
      ```

2. Download and Install SonarQube 9.9 LTA. 

3. Add the [SonarQube Ballerina plugin](TODO).
   - Download the latest Ballerina SonarQube plugin JAR.
   - Place the JAR file into the `extensions/plugins/directory` of your SonarQube installation.

4. Navigate to the appropriate `bin/<OS>/` directory and run:
   ```bash
   $ ./sonar.sh start
   ```

   You can access the SonarQube dashboard at http://localhost:9000 once the server is up.

5. Install and Configure SonarScanner CLI.
   - Download SonarScanner CLI.
   - Add it to your system `PATH`.
   - Ensure `sonar.host.url` is set correctly (either via a properties file or CLI parameter).

### Configure the Ballerina project

1. Download the [SonarQube platform plugin](TODO).

2. Create a Scan.toml at the root of your Ballerina project:
   ```toml
   [[platform]]
   name = "sonarqube"
   path = "<path-to-sonar-platform-plugin>"
   ```

3. Optional: Add Additional SonarQube Configurations by referencing a `sonar-project.properties` file.
   ```toml
   [[platform]]
   name = "sonarqube"
   path = "<path-to-sonar-platform-plugin>"
   sonarProjectPropertiesPath = "<path-to-sonar-project.properties>"
   ```

### Publish reports to SonarQube

1. Link a ballerina source repo to the SonarQube server from a DevOps platform or manually.

2. Authenticate Using a Token.
   - Generate a token from the `My Account`->`Security` section in the SonarQube UI.
   - Set the token as an environment variable:

      **For Unix/macOS:**
      ```bash
      $ export SONAR_TOKEN=<your-token>
      ```

      **For Windows:**
      ```bash
      $ set SONAR_TOKEN=<your-token>
      ```

3. Run the scan tool to publish the reports to SonarQube.
   ```bash
   $ bal scan
   ```

### After the Scan
- Once the scan completes, navigate to your project in the SonarQube dashboard.
- View issues, vulnerabilities, code smells, and other static analysis results directly from the SonarQube UI.
