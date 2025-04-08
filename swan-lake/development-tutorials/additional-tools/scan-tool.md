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

## Publishing static code analysis reports to SonarQube.

To learn how to publish reports to SonarQube, refer to [Configuration for Platform Plugins](https://github.com/ballerina-platform/static-code-analysis-tool/blob/main/docs/static-code-analysis-tool/ScanFileConfigurations.md#configuration-for-platform-plugins).