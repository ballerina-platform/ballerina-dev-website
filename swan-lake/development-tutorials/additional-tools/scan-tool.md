---
title: Scan Tool
description: Learn how to dump and inspect the currently available strands of a Ballerina program.
keywords: ballerina runtime, troubleshoot, scan, thread dump
permalink: /learn/scan-tool/
active: scan-tool
---

The Ballerina Scan Tool is a static code analysis tool that performs analysis on Ballerina projects and identifies potential code smells, bugs, and vulnerabilities without executing them.

>**Note:** Ballerina Scan is an experimental feature that supports only a limited set of rules.

## Install the Tool

Execute the command below to pull the Scan Tool from [Ballerina Central](https://central.ballerina.io/ballerina/wsdl/latest).

```
$ bal tool pull scan
```

## Usage Guide for Ballerina Scan Tool

The Ballerina Scan Tool helps you analyze your Ballerina project for potential issues, enforce coding standards, and generate detailed reports. Below are various ways you can use the tool to fit your development workflow.

### Scan a Ballerina Project

To run a full analysis across all Ballerina files in your project, use the following command:

```
$ bal scan --scan-report
```

This will produce the HTML report and scan results inside the `target/report` directory.

### List All Available Analysis Rules

If you’d like to explore the full set of rules the tool can apply, run:

```
$ bal scan --list-rules
```

This will display a comprehensive list of available rules for your project, which you can include or exclude in future scans.

### Run Analysis for Specific Rules

If you want to apply a specific set of rules, list them as a comma-separated string by specifying the rule ID:

```
$ bal scan --include-rules="ballerina:1, ballerina/io:2"
```

To ignore a specific set of rules during the analysis, use the following command:

```
$ bal scan --exclude-rules="ballerina:1, ballerina/io:2"
```
