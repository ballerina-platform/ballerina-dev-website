---
title: Configure the scan tool
description: Learn how to choose which rules and sources the Ballerina scan tool analyzes, suppress issues, fail the scan on findings, and share settings in Scan.toml.
keywords: ballerina, scan, static code analysis, scan.toml, suppress, gate, exit codes
permalink: /learn/scan-tool-configuration/
active: scan-tool-configuration
---

This page shows how to control what the [scan tool](/learn/scan-tool/) analyzes and when it fails. Most settings can be
given as a command option for a single run, or as a key in a `Scan.toml` file at the package root to apply to every run.
Each section shows both forms and how they combine. See [Share settings in Scan.toml](#share-settings-in-scantoml) for
where the file is read from.

## Include and exclude rules

To run only specific rules, use the `--include-rules` option. To skip rules that are not relevant to your project, use
the `--exclude-rules` option. Both take a comma-separated list of rule IDs:

```
$ bal scan --include-rules="ballerina:1, ballerina/io:2"
$ bal scan --exclude-rules="ballerina:1"
```

To apply the same selection to every run, use the `[rule]` table of `Scan.toml`:

```toml
[rule]
exclude = ["ballerina:1"]
```

The rules given on the command line are added to the list in `Scan.toml` for that run. For example, with
`exclude = ["ballerina:1"]` in `Scan.toml`, `--exclude-rules=ballerina:2` excludes both rules.

A scan either includes or excludes rules, never both. Passing both options, or an option that conflicts with the other
list in `Scan.toml`, is a usage error that exits with code `2`. For example, with `exclude = ["ballerina:1"]` in
`Scan.toml`, `--include-rules=ballerina:2` exits with code `2`. Setting both `include` and `exclude` in `Scan.toml`
exits with code `1`.

To accept a single issue rather than turning a rule off for the whole project, see [Suppress issues](#suppress-issues).

### Details

A rule ID that no scanned package provides is an error that exits with code `2`, in both options. In a workspace, a
rule provided by at least one package is accepted. To see the rules available to a project, see
[List rules](/learn/scan-tool/#list-rules).

## Exclude test sources

By default, the test sources of each package are scanned along with the rest of the package. To leave them out, use
the `--exclude-tests` option, either alone or set to `true`:

```
$ bal scan --exclude-tests
$ bal scan --exclude-tests=true
```

To leave them out of every run, use the `[analysis]` table of `Scan.toml`:

```toml
[analysis]
excludeTests = true
```

Written alone, the option means `true`. Pass `--exclude-tests=false` to scan the test sources for a single run even
when `excludeTests = true` is set.

### Details

- The option covers the `tests` folder of the package and of each module.
- Excluded test sources are still compiled, so a compilation error in a test still fails the scan.
- `@scan:Suppress` annotations in excluded test sources are neither applied nor reported as unmatched.
- For a single Ballerina file, the option has no effect, and `--exclude-tests` (or `--exclude-tests=true`) prints a
  warning.

## Suppress issues

To accept an individual issue in the source, use the `@scan:Suppress` annotation from the `ballerina/scan` package.
Unlike excluding a rule, which turns it off for the whole project, a suppression applies only to the construct it is
attached to and records why the issue is accepted:

```ballerina
import ballerina/scan;

public function main() {
    @scan:Suppress {
        rules: ["ballerina:1"],
        reason: "The value is a literal that always parses, so the error cannot occur"
    }
    int count = checkpanic int:fromString("12");
}
```

See the [`ballerina/scan` package documentation](https://central.ballerina.io/ballerina/scan/latest) for examples of
each option, the checks done during `bal build`, and the editor's code actions.

### Placement

The annotation applies to issues reported within the construct it is attached to: a variable or constant declaration,
a function, method, or resource, a parameter, a return type, a field, a type, a class, a service, a listener, a worker,
or an `external` function body.

- A suppression on a service, class, object type, or object constructor does not reach issues inside its members.
- An annotation cannot be attached to a statement that is not a declaration, such as `check f();`. An issue in such a
  statement is covered by a suppression on the enclosing function, method, or resource. To suppress it on its own,
  turn the statement into a declaration, for example, `var _ = check f();`.
- A suppression the scan cannot apply, such as one on a destructuring declaration or on the return type of a function
  type, is reported as a warning and ignored.

### Fields

Both fields are optional. Without `rules`, every issue in the construct is suppressed. Without `reason`, the reports
carry no justification. The annotation can be attached more than once to give each rule its own reason.

### Suppressed issues in the results

Suppressed issues are not printed to the console or sent to platforms, and the issue summary counts them, such as
`3 issue(s), 2 suppressed`. They remain in the saved JSON and SARIF reports with a `suppressions` entry of kind
`inSource` and status `accepted`, whose `justification` carries the reason when one is given, so every accepted issue
stays reviewable. The HTML report counts them separately from the active issues and lists them, with their reason when
one is given and the rules the annotation names, under the `Suppressed` or `All` status filter.

### Require a reason or rule ID

By default, both fields of `@scan:Suppress` are optional. Two requirements make them mandatory:

| Command option                   | Scan.toml key    | Effect                                                                                                        |
|----------------------------------|------------------|---------------------------------------------------------------------------------------------------------------|
| `--require-suppression-reason`   | `requireReason`  | Every `@scan:Suppress` annotation must set `reason`, so each accepted issue records why.                      |
| `--require-suppression-rule-id`  | `requireRuleId`  | Every `@scan:Suppress` annotation must set `rules`, so no annotation suppresses every issue in its construct. |

To apply them to a single run, pass the command options:

```
$ bal scan --require-suppression-reason --require-suppression-rule-id
```

To apply them to every run, set the keys in the `[suppression]` table of `Scan.toml`:

```toml
[suppression]
requireReason = true
requireRuleId = true
```

A suppression that does not meet a requirement fails the scan before anything is reported: the errors are printed, and
no issues are printed, saved to the target directory, or sent to platforms.

The command options can only make suppressions stricter, never looser. Passing an option turns its requirement on for
that run even when `Scan.toml` does not set it. Unlike `--exclude-tests`, these options do not accept
`=false`, so when `Scan.toml` sets `requireReason = true` or `requireRuleId = true`, the requirement cannot be turned
off from the command line.

When suppressions are disabled with `--ignore-suppressions` or `enabled = false` (see
[Audit suppressed issues](#audit-suppressed-issues)), the requirements are not checked, since every issue is reported
regardless of its annotations.

> **Note:** In a workspace, every package is compiled and scanned, and its suppressions are validated, before the
> results of any package are reported. If any package fails with an error, such as a compilation error or a
> suppression that does not meet a requirement, the scan lists the errors of every failed package and reports no
> results for any package, including those that scanned successfully.

### Audit suppressed issues

To report every issue as though no suppression existed, use the `--ignore-suppressions` option. Rule inclusion and
exclusion still apply.

```
$ bal scan --ignore-suppressions
```

To disregard suppressions for every run of a project, for example, from a shared `Scan.toml`, set `enabled = false` in
the `[suppression]` table. The command line cannot turn suppressions back on when `enabled = false` is set.

### Details

**Rule ID validation:** The compiler plugin of `ballerina/scan` reports a malformed rule ID or an empty rule list as a
compile error, and `bal scan` reports them as errors too, so that an empty rule list is never mistaken for a
suppression of no rules. `bal scan` checks that each rule exists, among the core rules and the rules of every analyzer
it engages, and fails before reporting anything when one does not. A rule of an analyzer the scan does not engage
cannot be verified and is reported as a warning.

**Unmatched suppressions:** A suppression that matches no issue, for example, because the issue was fixed, is reported
as a warning.

- A suppression is not reported for a rule left out by `--include-rules`, `--exclude-rules`, or `Scan.toml`.
- A suppression without `rules` is only reported when every rule is scanned, since whether it is still needed cannot be
  told from a narrowed scan.
- An unknown rule still fails the scan, before anything is reported.
- A rule that an earlier annotation on the same construct already names is reported as already suppressed instead,
  since that annotation is the one that applies.
- A second annotation without `rules` on a construct is reported as suppressing rules that are already suppressed.

## Fail the scan on findings

By default, findings never fail the scan. To fail it on one or more `BLOCKER` or `HIGH` issues, use the
`--fail-on-severity` option:

```
$ bal scan --fail-on-severity=HIGH
```

To fail only when there are several such issues, add the `--fail-on-count` option. For example, to fail on 5 or more
`BLOCKER`, `HIGH`, or `MEDIUM` issues:

```
$ bal scan --fail-on-severity=MEDIUM --fail-on-count=5
```

To apply the same gate to every run, use the `[gate]` table of `Scan.toml`:

```toml
[gate]
failOnSeverity = "MEDIUM"
failOnCount = 5
```

When the gate is tripped, the scan exits with code `1`. Each option replaces only its own setting in `Scan.toml` for
that run, so a setting left off the command line is still read from `Scan.toml`. For example, `--fail-on-count=2` with
`failOnSeverity = "HIGH"` in `Scan.toml` fails on 2 or more issues at or above `HIGH`. The table shows when the scan
fails for the combined settings:

| Severity | Count | Fails when |
|---|---|---|
| Not set | Not set | Never. The gate is off. |
| Not set | `n` | There are `n` or more issues of any severity. |
| `X` | Not set | There is at least one issue at or above `X`. |
| `X` | `n` | There are `n` or more issues at or above `X`. |
| `NONE` | Any | Never. The gate is off. |

The severity is one of `BLOCKER`, `HIGH`, `MEDIUM`, `LOW`, `INFO`, or `NONE`, in any case. The count must be a whole
number of 1 or more.

### Exit codes

`bal scan` exits with the following codes, so scripts, Git hooks, and CI/CD pipelines can act on the result:

| Code | Meaning |
|---|---|
| `0` | The scan completed, and no gate is set or the gate was not tripped. |
| `1` | The gate was tripped, or the scan could not be completed. |
| `2` | The command-line input is invalid. |
| `3` | The path is not a Ballerina package, workspace, or standalone file, or is a `.bal` file inside a package. |
| `130` | The scan was interrupted. |

Besides a tripped gate, the scan exits with code `1` when:

- `Scan.toml` is invalid.
- A package cannot be loaded, such as one whose `Ballerina.toml` has an error.
- A package has no `Dependencies.toml`.
- The source has a compilation error or an invalid suppression.
- The package is empty. An empty workspace member is skipped with a warning instead.
- A platform named in `--platforms` is not declared, or its JAR does not provide it.
- A plugin fails, or a report cannot be written.

The scan exits with code `2` on an invalid option value, an unknown option, both `--include-rules` and
`--exclude-rules`, a rule option that conflicts with the `[rule]` table of `Scan.toml`, `--platforms` with a single
Ballerina file, or a rule ID in `--include-rules` or `--exclude-rules` that no scanned package provides.

Every failure other than an interrupt is reported on standard error as `bal scan: error: <message>`, followed by the
problems that caused it, such as `Scan.toml:2:18: error: <message>`. An error in a workspace package is reported as
`<package>: error: <message>`, and a usage error is followed by a `Usage:` line and a `Try 'bal scan --help'` hint.
Warnings are reported as `bal scan: warning: <message>`, or as `<file>:<line>:<col>: warning: <message>` when they
point to a source location, such as an unmatched suppression. Warnings never change the exit code.

### Details

- `--fail-on-count` does not turn on a gate that `NONE` turns off. With `--fail-on-severity=NONE`, `--fail-on-count`
  is ignored with a warning, and with `failOnSeverity = "NONE"` in `Scan.toml`, the scan warns that the count has no
  effect.
- The gate counts the issues left after rule selection and suppressions.
- The gate runs after the reports are written, so a failing scan still leaves a full report.
- An error always takes precedence over a tripped gate, so the gate is not checked when a platform fails.
- In a workspace, each package is checked against its own gate with the issues of that package only, whether the gate
  comes from the command line, the workspace `Scan.toml`, or the package `Scan.toml`.

## Share settings in Scan.toml

`Scan.toml` holds the settings that every run of a package or workspace should use, so a team can share them through
version control. The scan tool picks up a `Scan.toml` in the package or workspace root, or the file (local path or URL)
specified in its `Ballerina.toml`:

```toml
[scan]
configPath = "path/to/Scan.toml"
```

`Scan.toml` is only read for Ballerina packages and workspaces. A sample `Scan.toml` that shows every table. The values
are examples: replace the placeholders and keep only the settings you need.

```toml
# Rules to include or exclude; combined with --include-rules/--exclude-rules
[rule]
include = ["ballerina:1", "ballerina/io:2"]
# exclude = ["ballerina:1"]

# Platform plugins that --platforms can report results to
# [[platform]]
# name = "sonarqube"
# path = "<path-to-sonar-platform-plugin-jar>"

# Static code analyzer plugins to run
# [[analyzer]]
# org = "<analyzer-org>"
# name = "<analyzer-name>"

# How @scan:Suppress annotations are applied
[suppression]
enabled = true        # false reports every issue, same as --ignore-suppressions
requireReason = true  # same as --require-suppression-reason
requireRuleId = true  # same as --require-suppression-rule-id

# When the scan fails on its findings (same as --fail-on-severity and --fail-on-count)
[gate]
failOnSeverity = "MEDIUM"
failOnCount = 5

# Leave the test sources out of the scan (same as --exclude-tests)
[analysis]
excludeTests = true
```

When a command option, including the gate options, `--exclude-tests`, and the suppression options, differs from
`Scan.toml`, the scan warns that the option overrides the setting for that run.

The `[rule]`, `[suppression]`, `[gate]`, and `[analysis]` tables accept only the keys shown, each with a plain value of
the TOML type shown. Unknown keys in these tables and wrongly typed values fail the scan with exit code `1`, and every
error is listed with its line and column.

See [Scan file configurations](https://github.com/ballerina-platform/static-code-analysis-tool/blob/main/docs/static-code-analysis-tool/ScanFileConfigurations.md)
for all available options, including how platform paths and arguments are resolved.

### Settings only in Scan.toml

Two tables have no command option:

- `[[analyzer]]` adds static code analyzer plugins to the scan. They are not dependencies of the package, so the scan
  resolves them itself. Besides `org` and `name`, an entry accepts further keys, such as `version` and `repository`.
- `[[platform]]` declares the platforms that `--platforms` can report results to. See
  [Integrate the scan tool](/learn/scan-tool-integration/#platform-integration).

### Workspace Scan.toml

A workspace can have its own `Scan.toml`, at the workspace root or at the `configPath` set in the workspace
`Ballerina.toml`. It applies to every package of the workspace that has no `Scan.toml` of its own, even when that
package is scanned on its own.

The two files are never merged: a package's own `Scan.toml` replaces the workspace file as a whole, and the scan warns
about the workspace settings that the package file does not set. `[[platform]]` cannot be set in the workspace file, so
declare platforms in the `Scan.toml` of each package. Since that file replaces the workspace file, copy into it every
workspace setting the package still needs, such as `[gate]`, `[rule]`, `[suppression]`, and `[analysis]`. Otherwise,
the package is scanned without them.

## Command syntax and options

The scan tool follows this general syntax:

```
$ bal scan [OPTIONS] [<workspace>|<package>|<source-file>]
```

### Arguments

- `<workspace>`: Analyzes each package in the specified workspace in dependency order
- `<package>`: Analyzes all Ballerina files in the specified package (optional, defaults to current directory)
- `<source-file>`: Analyzes a specific standalone Ballerina file (`.bal` extension required)

> **Note:** Analyzing individual Ballerina files that are part of a package is not supported.
> You must analyze the entire package or work with standalone files.

### Available options

All options are optional.

| Option | Description | Default |
|---|---|---|
| `--target-dir=<path>` | Specify the target directory for analysis reports, which are written to its `report` folder (only for Ballerina projects). See [Custom target directory](/learn/scan-tool/#custom-target-directory) | The project's `target` directory |
| `--scan-report` | Generate HTML report with detailed analysis results (only for Ballerina projects). See [HTML report](/learn/scan-tool/#html-report) | Disabled |
| `--format=<json\|sarif>` | Specify the format of the report. See [Report formats](/learn/scan-tool/#report-formats) | `json` |
| `--list-rules` | List the rules available to the project, along with their kind and severity. See [List rules](/learn/scan-tool/#list-rules) | Disabled |
| `--include-rules=<rule1, ...>` | Run analysis for specific rules only. See [Include and exclude rules](#include-and-exclude-rules) | All available rules are included |
| `--exclude-rules=<rule1, ...>` | Exclude specific rules from analysis. See [Include and exclude rules](#include-and-exclude-rules) | No rules are excluded |
| `--exclude-tests[=<true\|false>]` | Leave the test sources of each package out of the scan. See [Exclude test sources](#exclude-test-sources) | Test sources are scanned |
| `--ignore-suppressions` | Disregard `@scan:Suppress` annotations and report every issue. See [Audit suppressed issues](#audit-suppressed-issues) | Disabled |
| `--require-suppression-reason` | Fail the scan when a `@scan:Suppress` annotation does not give a reason. See [Require a reason or rule ID](#require-a-reason-or-rule-id) | Disabled |
| `--require-suppression-rule-id` | Fail the scan when a `@scan:Suppress` annotation does not name the rules it suppresses. See [Require a reason or rule ID](#require-a-reason-or-rule-id) | Disabled |
| `--fail-on-severity=<BLOCKER\|HIGH\|MEDIUM\|LOW\|INFO\|NONE>` | Fail the scan on issues at or above this severity. `NONE` turns the gate off. See [Fail the scan on findings](#fail-the-scan-on-findings) | No gate is set |
| `--fail-on-count=<n>` | Fail the scan when there are `n` or more issues at or above the severity. See [Fail the scan on findings](#fail-the-scan-on-findings) | No gate is set |
| `--platforms=<platform1, ...>` | Report results to platforms declared in the `[[platform]]` table of `Scan.toml` (only for Ballerina projects). See [Platform integration](/learn/scan-tool-integration/#platform-integration) | Results are not reported to any platform |
