---
title: Scan tool
description: Learn how to perform static code analysis on Ballerina projects to identify potential code smells, bugs, and vulnerabilities.
keywords: ballerina runtime, troubleshoot, scan, thread dump
permalink: /learn/scan-tool/
active: scan-tool
---

The Ballerina scan tool is a static code analysis tool that performs analysis on Ballerina projects and identifies
potential code smells, bugs, and vulnerabilities without executing them.

> **Note:** Ballerina scan is an experimental feature that supports only a limited set of rules.

## Install the tool

Execute the command below to pull the scan tool
from [Ballerina Central](https://central.ballerina.io/ballerina/scan/latest).

```
$ bal tool pull scan
```

To verify the installation and check the version:

```
$ bal tool list
```

For more information about managing Ballerina tools, refer to
the [Ballerina CLI tool command documentation](https://ballerina.io/learn/cli-commands/#tool-commands).

## Command syntax

The Ballerina scan tool follows this general syntax:

```
$ bal scan [OPTIONS] [<package>|<source-file>]
```

### Arguments

- `<package>`: Analyzes all Ballerina files in the specified package (optional, defaults to current directory)
- `<source-file>`: Analyzes a specific standalone Ballerina file (`.bal` extension required)

> **Important:** Analyzing individual Ballerina files that are part of a package is not allowed.
> You must analyze the entire package or work with standalone files.

### Available options

| Option                         | Description                                            |
|--------------------------------|--------------------------------------------------------|
| `--target-dir=<path>`          | Specify target directory for analysis reports          |
| `--scan-report`                | Generate HTML report with detailed analysis results    |
| `--format=<ballerina\|sarif>`  | Specify the format of the report. Default is ballerina |
| `--list-rules`                 | Display all available analysis rules                   |
| `--include-rules=<rule1, ...>` | Run analysis for specific rules only                   |
| `--exclude-rules=<rule1, ...>` | Exclude specific rules from analysis                   |
| `--platforms=<platform1, ...>` | Define platforms for result reporting                  |

## Running analysis

You can analyze all Ballerina files in the current package by running the following command inside the package
directory:

```
$ bal scan
```

This command will:

- Compile and analyze all `.bal` files in the current package
- Print results to the console
- Save results in JSON format in the `target/scan` directory

If you want to analyze a specific package, you can provide the package name as an argument:

```
$ bal scan mypackage
```

If you want to analyze a specific standalone Ballerina file, you can provide the file name as an argument:

```
$ bal scan myfile.bal
```

## Report generation

To generate a detailed HTML report of the analysis results, use the `--scan-report` option:

```
$ bal scan --scan-report
```

This will produce a HTML report and scan results in JSON format inside the `target/report` directory.

The HTML report includes a summary of the number of code smells, bugs, and vulnerabilities found in each file.

![scan-report-summary-view](/learn/images/scan-tool-html-report-summary-view.png)

To investigate further, you can click on a file name to view a detailed breakdown of the issues.
This view highlights the exact lines where problems were detected, along with a description, and the severity level.

![scan-report-file-view](/learn/images/scan-tool-html-report-file-view.png)

## Custom target directory

You can specify a custom target directory for the analysis results using the `--target-dir` option.
This is useful if you want to store the results in a specific location or if you are working with multiple projects.

```
$ bal scan --target-dir="path/to/your/target/directory"
```

## Report formats

By default, the scan tool generates reports in `JSON` format.
However, you can specify the report format using the `--format` option.

The available formats are `ballerina` and `sarif`. The `ballerina` format is the default, while `sarif` is a
standardized format for static analysis results.

To generate a report in the `sarif` format, use the following command:

```
$ bal scan --format=sarif
```

## List available rules

To view all available rules for your project, you can use the `--list-rules` option:

```
$ bal scan --list-rules
```

This will display a comprehensive list of available rules for your project, which you can include or exclude in future
scans.

The output will look something like this:

![list-rules](/learn/images/scan-tool-list-rules.png)

> **Note:** The displayed rules are project-specific and determined by your project's dependencies.

## Include specific rules

You can run the analysis for specific rules by using the `--include-rules` option.
This allows you to focus on particular areas of your codebase that you want to analyze.

```
$ bal scan --include-rules="ballerina:1"
```

You can also include multiple rules by listing them as a comma-separated string:

```
$ bal scan --include-rules="ballerina:1, ballerina/io:2"
```

## Exclude specific rules

You can exclude specific rules from the analysis using the `--exclude-rules` option.
This is useful if you want to ignore certain rules that are not relevant to your project or if you have already
addressed them.

```
$ bal scan --exclude-rules="ballerina:1"
```

To exclude multiple rules, provide them as a comma-separated list:

```
$ bal scan --exclude-rules="ballerina:1, ballerina/io:2"
```

## Platform integration

You can report the analysis results to platforms such as SonarQube using the `--platforms` option.

```
$ bal scan --platforms="sonarqube"
```

To specify more than one platform, separate them with commas:

```
$ bal scan --platforms="sonarqube, semgrep, codeql"
```

### Publishing static code analysis reports to SonarQube

To learn how to publish reports to SonarQube, refer
to [Configuration for Platform Plugins](https://github.com/ballerina-platform/static-code-analysis-tool/blob/main/docs/static-code-analysis-tool/ScanFileConfigurations.md#configuration-for-platform-plugins).
