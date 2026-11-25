---
title: Integrate the scan tool
description: Learn how to report Ballerina scan tool results to platforms such as SonarQube and GitHub code scanning.
keywords: ballerina, scan, static code analysis, platform, sonarqube, github actions, code scanning
permalink: /learn/scan-tool-integration/
active: scan-tool-integration
---

This page shows how to report the results of the [scan tool](/learn/scan-tool/) to platforms such as SonarQube, and
how to scan a repository in [GitHub Actions](#scan-in-github-actions).

## Platform integration

To report the results to a platform, declare its plugin in a `[[platform]]` entry of the package's `Scan.toml`:

```toml
[[platform]]
name = "sonarqube"
path = "<path-to-sonar-platform-plugin-jar>"
```

Then name the platform in the `--platforms` option:

```
$ bal scan --platforms="sonarqube"
```

The results are printed and saved first, and are then sent to each named platform. `--platforms` accepts a
comma-separated list, so results can be reported to several platforms in a single scan:

```
$ bal scan --platforms="sonarqube, <another-platform>"
```

> **Note:** `sonarqube` is currently the only platform plugin available.

Results are reported only to the platforms named in `--platforms`, and `--platforms` can name only platforms declared
in `Scan.toml`. The named platforms run one after another. If a platform plugin fails with an error, the scan lists
every failure and exits with code `1`.

### Platform entry fields

- Each entry needs both a `name` and a `path`, and an entry missing either is ignored.
- The `name` must match the name of a plugin that the JAR provides, such as `sonarqube`. Otherwise, naming that
  platform in `--platforms` fails the scan with exit code `1`.
- The `path` points to the platform plugin JAR, as a local path relative to the folder of the `Scan.toml` file, or as a
  URL to download it from. When the `configPath` in `Ballerina.toml` is a URL, a relative local path is resolved
  against the package or workspace root instead.
- An entry can also carry platform-specific arguments, such as `sonarProjectPropertiesPath`. See
  [Scan file configurations](https://github.com/ballerina-platform/static-code-analysis-tool/blob/main/docs/static-code-analysis-tool/ScanFileConfigurations.md)
  for how platform paths and arguments are resolved.

### Details

- The plugin JAR is checked, or downloaded, only when its platform is named. A path that is then neither an existing
  file nor a URL stops the scan with an error.
- For a package, naming a platform that is not declared fails the scan with exit code `1`.
- In a workspace, platforms are declared in the `Scan.toml` of each package, since `[[platform]]` cannot be set in the
  workspace `Scan.toml`. A package that does not declare a named platform is still scanned, saved, and checked against
  its gate, but its results are not sent to that platform, and the scan warns about it. The scan fails only when no
  package declares the platform.
- Using `--platforms` with a single Ballerina file is a usage error and exits with code `2`.
- A failed platform takes precedence over the gate, so the gate is not checked when a platform fails. See
  [Fail the scan on findings](/learn/scan-tool-configuration/#fail-the-scan-on-findings).
- When a platform runs the scan itself, such as the SonarQube Ballerina plugin during a SonarScanner analysis, the
  results are not printed or saved to the target directory, except that a workspace scan still writes the combined
  workspace report. No gate is applied, since the platform applies its own quality gate. The results are reported to
  every platform declared in `Scan.toml`, unless `--platforms` names some.

## Publish static code analysis reports to SonarQube

SonarQube is a popular open-source platform for continuous inspection of code quality.
It provides static code analysis, code coverage,
and other features to help developers maintain clean, maintainable codebases.
The Ballerina scan tool can be integrated with SonarQube to publish static code analysis reports,
enabling seamless integration into your CI/CD pipelines.

This guide walks you through the process of configuring SonarQube and publishing Ballerina static code analysis reports.
For more configuration options, see the [SonarQube Ballerina plugin README](https://github.com/ballerina-platform/sonar-ballerina#readme).

### Prerequisites
- SonarQube Community Build 26.x or later. The plugin is tested on SonarQube Community Build 26.11.
- SonarScanner CLI 4.8.0 or later installed, and added to your system `PATH`.
- [SonarQube Ballerina plugin](https://github.com/ballerina-platform/sonar-ballerina/packages/2580146), and [SonarQube platform plugin](https://github.com/ballerina-platform/sonar-ballerina/packages/2580149) downloaded.

### Configure the SonarQube server

1. Install [Java 21](https://adoptium.net/en-gb/temurin/releases/?version=21) in your machine.
    - If Java 21 is not the default Java installation, override it.

      **For Unix/macOS:**
       ```
       export SONAR_JAVA_PATH="path/to/java21_home/bin/java"
       ```

      **For Windows:**
       ```
       setx SONAR_JAVA_PATH "path\to\java21_home\bin\java.exe"
       ```

       `setx` does not update the current command window. Open a new command window before you start the SonarQube server.

2. Set up SonarQube Community Build 26.11.
    - Download SonarQube Community Build from [here](https://www.sonarsource.com/products/sonarqube/downloads/).
    - Extract the downloaded zip file.

3. Add the [SonarQube Ballerina plugin](https://github.com/ballerina-platform/sonar-ballerina/packages/2580146).
    - Download the latest Ballerina SonarQube plugin JAR.
    - Place the JAR file into the `extensions/plugins/` directory of your SonarQube installation.

4. Navigate to the appropriate `bin/<OS>/` directory and run the SonarQube server.

   **For Unix/macOS** (`bin/linux-x86-64/` or `bin/macosx-universal-64/`):
    ```
    $ ./sonar.sh start
    ```

   **For Windows** (`bin\windows-x86-64\`):
    ```
    $ StartSonar.bat
    ```

   You can access the SonarQube dashboard at http://localhost:9000 once the server is up.

   To verify that the Ballerina plugin is installed, navigate to `Policies` -> `Rules` and filter by the `Ballerina` language.

   ![sonarqube-ballerina-rules](/learn/images/sonarqube-ballerina-rules.png)

5. Create a new project in SonarQube.
    - Log in to the SonarQube dashboard.
    - Click on `Create Project` and choose whether to import the repository from a DevOps platform or create a local project manually.
    - Follow the prompts to set up your project. Note the project key you provide, as it is required when [configuring the Ballerina project](#configure-the-ballerina-project).
    - When prompted to provide a token, generate a token as follows and use it in the prompt.
        - Navigate to `My Account` -> `Security` in the SonarQube UI.
        - Enter a name for the token and click `Generate`.
        - Copy the generated token and store it securely, as it is not shown again. This token is also required when [publishing reports to SonarQube](#publish-reports-to-sonarqube).

6. Install and configure SonarScanner CLI.
    - Download SonarScanner CLI from [here](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/scanners/sonarscanner/).
    - Add it to your system `PATH`.

### Configure the Ballerina project

1. Download the [SonarQube platform plugin](https://github.com/ballerina-platform/sonar-ballerina/packages/2580149).

2. Create a `sonar-project.properties` file at the root of your Ballerina project with the following content.
   ```properties
   sonar.projectKey=<your-project-key>
   sonar.projectName=<your-project-name>
   sonar.host.url=<your-sonarqube-server-url>
   ```

   Set `sonar.host.url` to the URL of your SonarQube server, such as `http://localhost:9000` for a local server.

3. Create a `Scan.toml` at the root of your Ballerina project to declare the SonarQube platform.
   ```toml
   [[platform]]
   name = "sonarqube"
   path = "<path-to-sonar-platform-plugin>"
   ```

   SonarScanner reads the `sonar-project.properties` file from the directory where you run `bal scan`. If you run
   `bal scan` from the project root, no further configuration is needed. Otherwise, or if the file is elsewhere, point
   to it with `sonarProjectPropertiesPath`. A relative path is resolved against the directory where you run `bal scan`.
   ```toml
   [[platform]]
   name = "sonarqube"
   path = "<path-to-sonar-platform-plugin>"
   sonarProjectPropertiesPath = "<path-to-sonar-project.properties>"
   ```

### Publish reports to SonarQube

1. Make sure you have completed the steps in [Configure the SonarQube server](#configure-the-sonarqube-server) and [Configure the Ballerina project](#configure-the-ballerina-project), which link your Ballerina source repository to the SonarQube server.

2. Authenticate using a token.
    - Set the token generated when [creating the SonarQube project](#configure-the-sonarqube-server) as an environment variable.

      **For Unix/macOS:**
       ```
       $ export SONAR_TOKEN=<your-token>
       ```

      **For Windows:**
       ```
       $ set SONAR_TOKEN=<your-token>
       ```

3. Run the scan tool to publish the reports to SonarQube.
   ```
   $ bal scan --platforms=sonarqube
   ```

### After the scan
- Once the scan completes, navigate to your project in the SonarQube dashboard.
- View issues, vulnerabilities, code smells, and other static analysis results directly from the SonarQube UI.

## Scan in GitHub Actions

The [Scan Ballerina](https://github.com/marketplace/actions/scan-ballerina) GitHub Action runs `bal scan` on every
Ballerina package in a repository and sends the findings to GitHub code scanning, SonarQube, or any other platform that
reads SARIF. It installs Ballerina and the scan tool, scans each package, and merges the reports into one SARIF file.

### Upload to GitHub code scanning

```yaml
jobs:
  scan:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write
    steps:
      - uses: actions/checkout@v4
      - uses: ballerina-platform/scan-ballerina@v0
        with:
          platforms: github-code-scanning
```

The findings appear as alerts under **Security and quality > Code scanning**.

### Publish to SonarQube

The SonarQube server needs the [SonarQube Ballerina plugin](https://github.com/ballerina-platform/sonar-ballerina).
The action installs the SonarScanner CLI and the SonarQube platform plugin, and passes the server URL, token, and
project key to the scan:

```yaml
permissions:
  contents: read
  packages: read
steps:
  - uses: actions/checkout@v4
    with:
      fetch-depth: 0
  - uses: ballerina-platform/scan-ballerina@v0
    with:
      platforms: sonarqube
      platform-config: |
        sonarqube:
          host-url: '${{ vars.SONAR_HOST_URL }}'
          token: '${{ secrets.SONAR_TOKEN }}'
          project-key: my-project
```

### Learn more

The action can also fail the workflow on findings, apply `@scan:Suppress` annotations, and expose the merged SARIF file
for other tools. See the [action's Marketplace page](https://github.com/marketplace/actions/scan-ballerina) for every
input and output, multi-package SonarQube configuration, suppression handling, and supported Ballerina and scan tool
versions.
