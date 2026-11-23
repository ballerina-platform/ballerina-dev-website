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

### The `[[platform]]` entry

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
- SonarQube with Sonar Plugin API 13.4 or later installed. The plugin is tested on SonarQube Community Build 26.11.
- SonarScanner CLI installed, and added to your system `PATH`.
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
    > StartSonar.bat
    ```

   You can access the SonarQube dashboard at http://localhost:9000 once the server is up.

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
    - Ensure `sonar.host.url` is set correctly.

### Configure the Ballerina project

1. Download the [SonarQube platform plugin](https://github.com/ballerina-platform/sonar-ballerina/packages/2580149).

2. Create a `sonar-project.properties` file at the root of your Ballerina project with the following content.
   ```properties
   sonar.projectKey=<your-project-key>
   sonar.projectName=<your-project-name>
   ```

3. Create a `Scan.toml` at the root of your Ballerina project. Add additional SonarQube configurations by referencing the `sonar-project.properties` file.
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
reads SARIF. It installs Ballerina and the scan tool, scans each package, and merges the reports into one SARIF 2.1.0
file with paths relative to the repository root. Any file it changes during a scan, such as `Scan.toml`, is restored
when that scan ends.

> **Note:** `v0` is a pre-release that tracks the latest `v0.x.y` release. For reproducible runs, pin a release tag
> whose `action.yml` declares the inputs used on this page, or a commit SHA, and set `ballerina-version` and
> `tool-version`. Otherwise, a new scan tool release can change the rule IDs, severities, and findings that the rule
> filters and the gate depend on.

### Upload to GitHub code scanning

```yaml
jobs:
  scan:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write
      pull-requests: write # Only needed to comment on suppressions in pull requests
      actions: read # Only needed in private repositories
    steps:
      - uses: actions/checkout@v4
      - uses: ballerina-platform/scan-ballerina@v0
        with:
          platforms: github-code-scanning
```

The findings appear as alerts under **Security and quality > Code scanning**, attributed to the Ballerina Scan Tool.
In a pull request, code scanning comments on the lines that introduce new alerts.

### Publish to SonarQube

The SonarQube server needs the [SonarQube Ballerina plugin](https://github.com/ballerina-platform/sonar-ballerina).
The action installs the SonarScanner CLI and the scan tool's SonarQube platform plugin, and passes the server URL, token,
and project key to the scan:

```yaml
permissions:
  contents: read
  packages: read # The platform plugin is downloaded from GitHub Packages
steps:
  - uses: actions/checkout@v4
    with:
      fetch-depth: 0 # SonarQube needs the history for blame and new code detection
  - uses: ballerina-platform/scan-ballerina@v0
    with:
      platforms: sonarqube
      platform-config: |
        sonarqube:
          host-url: '${{ vars.SONAR_HOST_URL }}'
          token: '${{ secrets.SONAR_TOKEN }}'
          project-key: my-project
```

`platform-config` is a YAML mapping keyed by platform. Settings left out of it are read from the package's `Scan.toml`
and `sonar-project.properties`. To scan several packages, give each one its own project key, and its own server and
token if needed, under `packages`:

```yaml
platform-config: |
  sonarqube:
    host-url: https://sonar.example.com
    token: '${{ secrets.SONAR_TOKEN }}'
    packages:
      - path: services/orders
        project-key: orders
      - path: services/payments
        host-url: https://sonar.payments.example.com
        token: '${{ secrets.PAYMENTS_SONAR_TOKEN }}'
        project-key: payments
```

- Put each `${{ }}` value in single quotes, since GitHub inserts it into the YAML text before the action parses it.
- Every server URL must use `https`, and a `packages` item that sets `host-url` must also set `token`.
- Workspaces are not supported with SonarQube yet. When `sonarqube` is selected, listing a workspace root or a directory
  above it in `paths`, including the default `.`, fails the step. List the member package directories instead.
  Workspaces are fully supported for the SARIF file.
- The action caches the SonarScanner CLI and the analyzers it downloads, so later jobs and runs restore them instead of
  downloading them again.

See [SonarQube](https://github.com/ballerina-platform/scan-ballerina/blob/main/docs/sonarqube.md) for how each setting
is resolved.

### Use the SARIF file elsewhere

With no `platforms`, the action only produces the merged SARIF file, which the `sarif-file` output points to. Pass it to
any other tool:

```yaml
steps:
  - uses: actions/checkout@v4
  - id: scan
    uses: ballerina-platform/scan-ballerina@v0
  - run: ./upload-to-defectdojo.sh "${{ steps.scan.outputs.sarif-file }}"
```

To save it as a workflow artifact, set `artifacts: true`. Give each scan in a job its own `category`, since artifact
names must be unique within a workflow run.

### Fail the workflow on findings

```yaml
- uses: ballerina-platform/scan-ballerina@v0
  with:
    platforms: github-code-scanning
    fail-on-severity: medium # Fail on MEDIUM or higher findings
    fail-on-count: 5         # ...when there are five or more of them
```

`fail-on-severity` and `fail-on-count` work like the `bal scan` options of the same names (see
[Fail the scan on findings](/learn/scan-tool-configuration/#fail-the-scan-on-findings)), but the action applies them to
the findings of every scanned package together. The findings are uploaded before the gate is applied, so they reach the
platforms even when the gate fails. The action turns off the `[gate]` of each package's `Scan.toml` with
`--fail-on-severity=NONE`. `bal scan` warns about this only when the package sets `failOnSeverity` to a value other
than `NONE`. A `[gate]` that sets only `failOnCount` is turned off without a warning.

The gate counts every finding in the scanned packages, not only those a pull request introduces. To block only new
findings, upload to code scanning and add a
[code scanning merge protection rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets#set-code-scanning-merge-protection)
to a ruleset.

### Suppressions in GitHub Actions

The action applies [`@scan:Suppress` annotations](/learn/scan-tool-configuration/#suppress-issues) by default:

- Suppressed findings are left out of the counts, the gate, and the annotations, and the `suppressed-count` output gives
  their number. The SARIF file keeps them, each with a SARIF suppression, so the accepted risk stays auditable.
  SonarQube receives only the findings that are not suppressed.
- Code scanning ignores SARIF suppressions, so on the default branch, in `push`, `schedule`, and `workflow_dispatch`
  runs, the action dismisses the alert of each suppressed finding as "won't fix", with the suppression's reason as the
  comment. It reopens the alert once the suppression is removed or the finding is gone, so that code scanning sets it to
  fixed. Alerts dismissed by hand for other reasons are left alone.
- Other branches and events, including every pull request, leave the alerts as they are, so a finding that a pull
  request newly suppresses is still a new alert until the merge.
- In `pull_request` and `pull_request_target` runs, the action warns at each `@scan:Suppress` annotation the pull request
  adds or removes. Unless `suppression-comments` is `false`, it also posts the suppression's reason as a review comment,
  which needs `pull-requests: write`. `pull_request` runs for pull requests from forks and Dependabot have a read-only
  token, so they skip the comments. `pull_request_target` runs have a write token, so they still post them. However, do not check out, scan, or run the
  pull request's code in a `pull_request_target` run, since it would run with the base repository's secrets and the
  write token. Scan pull requests in `pull_request` runs instead.

To report every finding as if no suppression existed, for example, in an audit job, set `suppressions: false`. The
action then passes `--ignore-suppressions` to `bal scan` and leaves the code scanning alerts as they are.
`[suppression] enabled = false` in a package's `Scan.toml` still turns suppressions off for that package.

See [In-source suppressions](https://github.com/ballerina-platform/scan-ballerina/blob/main/docs/suppressions.md) for
how alerts are dismissed and reopened, and how pull requests are commented.

### Inputs

| Input | Default | Description |
|---|---|---|
| `platforms` | Empty | Comma-separated platforms to send the findings to: `github-code-scanning`, `sonarqube`. Empty produces the SARIF file only. |
| `platform-config` | Empty | YAML mapping, keyed by platform, with the settings and credentials each selected platform needs. |
| `paths` | `.` | Paths to scan. Every package and workspace in them, including their subdirectories, is scanned. |
| `exclude-paths` | Empty | Globs, relative to the repository root, for the packages and files to leave out. An excluded package or workspace is not scanned, so it reaches no platform. A workspace is scanned as one unit, so excluding one of its member packages drops only the member's findings, and a member that fails to compile still fails the step. To scan only some members, list their directories in `paths` instead. Excluded files within a scanned package are dropped only from the SARIF file, the counts, and code scanning, so SonarQube still receives their findings. Use `sonar.exclusions` to leave them out of SonarQube too. |
| `exclude-tests` | `true` | Leave the test sources out with `bal scan --exclude-tests`. `false` scans them. |
| `include-rules`, `exclude-rules` | Empty | Comma-separated rule IDs to report or leave out. They cannot be combined. |
| `fail-on-severity` | `none` | Fail when findings are at or above `low`, `medium`, or `high`. |
| `fail-on-count` | `1` | Fail when this many findings, or more, are at or above `fail-on-severity`. |
| `suppressions` | `true` | Apply the `@scan:Suppress` annotations. `false` reports every finding. |
| `suppression-comments` | `true` | Comment on the suppressions a pull request adds or removes. |
| `annotations` | `false` | Show each counted finding as a file and line annotation on the run. |
| `job-summary` | `true` | Write the result and the counts by severity to the job summary. |
| `artifacts` | `false` | Save the merged SARIF file as a workflow artifact. |
| `category` | `bal-scan` | Name for this scan. Use a different one for each scan in a job. |
| `ballerina-version` | Compatible | Ballerina version to install, or `latest`. Empty uses the Ballerina on the path if it can run the scan tool. When `tool-version` is also empty, the Ballerina on the path is used only if it is 2201.13.0 or later; otherwise, the latest is installed. |
| `tool-version` | Latest compatible | Scan tool version, or `latest`. Empty uses the latest version compatible with the Ballerina version. |

The action also sets the `result`, `sarif-file`, `high-count`, `medium-count`, `low-count`, `total-count`,
`suppressed-count`, `packages-scanned`, and `uploads` outputs. To read them after the gate fails, use a later step with
`if: always()`. See the [action's Marketplace page](https://github.com/marketplace/actions/scan-ballerina) for every
input and output, the severity mapping, and the failure behavior.

### Details

- The action supports `bal scan` 0.13.0 and later, with Ballerina 2201.13.0 and later, and `bal scan` 0.11.1 and later
  of 0.11.x, with Ballerina 2201.12.x. Scan tool versions 0.11.0 and 0.12.x do not support suppressions or
  `--exclude-tests`, so the action rejects them before installing the scan tool.
- Workspaces need Ballerina 2201.13.0 and `bal scan` 0.13.0 or later.
- Unlike `bal scan`, the action leaves the test sources out by default. Its `exclude-tests` input overrides
  `[analysis] excludeTests` in `Scan.toml`.
- Commit `Dependencies.toml` with each package, or run `bal build` in an earlier step, since `bal scan` fails a package
  without it. See [Dependency resolution](/learn/scan-tool/#dependency-resolution).
- A `configPath` in `Ballerina.toml` that points to a remote `Scan.toml` must use `https`, since the scan tool loads the
  platform plugin JARs that the file names.
- Findings never fail the step unless `fail-on-severity` is set. Problems with the setup, the scan, or an upload do.
