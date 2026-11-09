---
title: AI coding assistants
description: The Ballerina agent skills give an AI coding assistant the context, live library data, and language tooling it needs to write real Ballerina.
keywords: ballerina, ai coding assistant, agent skills, claude code, plugin, mcp, language server, ballerina central
intro: The Ballerina agent skills give an AI coding assistant the context, live library data, and language tooling it needs to write, build, run, and test Ballerina. The coding skill works in any agent that supports skills, and a companion plugin adds library discovery, the language server, and automatic activation.
---

The Ballerina agent skills are open source and distributed in two forms:

- A **coding skill** that works in any agent that supports agent skills.
- A **plugin** that bundles the coding skill with library discovery over MCP, the Ballerina Language Server, and activation hooks.

Both are maintained in the [`ballerina-platform/skills`](https://github.com/ballerina-platform/skills) repository under the Apache 2.0 license.

## Prerequisites

- [Ballerina](https://ballerina.io/downloads/) 2201.12.0 (Swan Lake Update 12) or later, with `bal` available on the `PATH`.
- Node.js 18 or later, required by the bundled library-discovery server.

## Install in Claude Code

Follow the steps below to install the plugin.

1. Register the marketplace and install the plugin.

    ```
    /plugin marketplace add ballerina-platform/skills
    /plugin install ballerina@ballerina-skills
    ```

2. Restart the session to activate the language server, the `ballerina` skill, the library-discovery agent, and the activation hooks.

    >**Info:** The MCP server ships pre-built, so no `npm install` or build step is required.

The skill activates automatically when a request involves Ballerina. To invoke it directly, use the `/ballerina` command.

```
/ballerina <request>
```

## Use with other agents

The coding skill is portable. Install it for agents such as Codex, Cursor, Gemini CLI, and GitHub Copilot with the Open Agent Skills CLI.

```
$ npx skills add ballerina-platform/skills
```

>**Tip:** Pass `--agent <name>` to target a specific agent.

This channel installs the `ballerina` skill only. The language server, the library-discovery MCP server, and the activation hooks are Claude Code plugin features. On other agents, library discovery uses the `bal search` command.

## What's included

The coding skill works in any agent. The plugin provides the other three components.

- **Coding skill.** The assistant's working knowledge of Ballerina: the language idioms, the project structure, and the build, run, and test workflow. It applies conventions such as typed records over `json`, named arguments, and `configurable` values for external inputs, and it resolves dependencies with `bal build` instead of hand-editing `Dependencies.toml`.
- **Library discovery.** Instead of guessing a connector's API, the assistant queries [Ballerina Central](https://central.ballerina.io) and gets back a compact summary of the package: the organization and module, the client type, and the function signatures and record shapes.
- **Language server.** The plugin registers the Ballerina Language Server for `.bal` files, so the assistant can hover for a type or signature, go to a definition or implementation, and find references and symbols.
- **Activation hooks.** The hooks keep the assistant anchored to the skill and route library lookups to the discovery agent, so the support engages automatically when you work in Ballerina.

## How it works

**Coding skill.** `SKILL.md` is a short router that links to deeper files as they are needed: the full conventions, a langlib reference, and a troubleshooting index that maps a symptom to a single page. The assistant loads detail on demand rather than holding all of it at once.

**Library discovery.** The `get_library` operation fetches a package's API documentation from Ballerina Central and rewrites it as a compact Ballerina-syntax summary of types, clients, functions, and services. The discovery agent narrows a search to the most suitable package, calls `get_library`, and keeps only the signatures the task needs.

**Language server.** The language server provides navigation backed by the compiler, so the assistant can confirm an API against its source while writing code. Checking for errors is a separate step: `bal build` from the command line is the source of truth, not the language server.

**Activation hooks.** One hook returns the assistant to the skill when you edit or run code, and another records when the skill activates.

## Learn more

The skill, the code rules, and the discovery server are open source. For the full documentation, issues, and contributions, see the [`ballerina-platform/skills`](https://github.com/ballerina-platform/skills) repository.
