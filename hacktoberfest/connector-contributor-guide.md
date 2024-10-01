---
title: Connector Contributor Guide - Ballerina Hacktoberfest 2024
description: This guide will walk you through the process of participating in the Ballerina Hacktoberfest connector event.
keywords: ballerina, hacktoberfest, connector, contribution, guide, hackathon
intro: This provides a step-by-step guide for contributing to the Ballerina Hacktoberfest connector event.
---

Welcome to the [Ballerina Hacktoberfest]( https://ballerina.io/hacktoberfest/) connector event! We're excited to have you contribute to the Ballerina ecosystem. This guide will walk you through the process of participating in the [Hacktoberfest](https://hacktoberfest.com/) and contributing your connector. Please follow the instructions carefully to ensure your contribution is eligible for rewards.

## Connector Categories & Rewards

You can contribute to one of the following categories:

1. Category 1: Connectors generated via existing OpenAPI specifications
   - Contribution involves creating a connector using a pre-defined OpenAPI spec.
   - Reward: 60 Credits

2. Category 2: Connectors generated via manually written OpenAPI specifications
   - Contribution requires defining the OpenAPI spec first, followed by generating the connector.
   - Reward: 80 Credits

3. Category 3: Manually developed (handwritten) connectors
   - Contribution involves building a connector from scratch without relying on an OpenAPI spec, typically for APIs that don’t provide one.
   - Reward: 100 Credits

## Contribution Process

### Step 1: Select a Connector

- Browse the project ideas listed in the [Ballerina Hacktoberfest 2024 Project Board](https://github.com/orgs/ballerina-platform/projects/376/views/5) and choose a connector to work on.
- After selecting a connector, leave a comment on its GitHub issue to indicate your interest in contributing.
- Ballerina team will review your comment and confirm your request. Once confirmed, the connector will be officially assigned to you.

### Step 2: Repository Setup

- After confirmation, the Ballerina team will create a new repository for the connector under the [ballerina-platform](https://github.com/ballerina-platform/) GitHub organization and, set up the initial project structure.

### Step 3: Follow the Connector Development Guide

- Start working on your connector by following the steps in the [Create Your First Ballerina Connector](https://ballerina.io/learn/how-to-create-your-first-ballerina-connector/) guide.

> Note on Handwritten Connectors (Category 3): Since the guide primarily covers generated connectors, steps related to client generation won't apply. However, the steps for testing, documentation, and examples are the same.

### Step 4: Contribution Workflow

For each area of your contribution, create individual pull requests (PRs):
- Client generation with required sanitization (if applicable)
- Test cases
- Documentation
- Examples

Ensure all PRs reference the related connector issue in the description to properly track your contributions.

### Step 5: Code Reviews & Improvements

- Ballerina team will review your PRs and may request changes or improvements. Address the feedback and resubmit the PRs as needed.

### Step 6: Completion & Rewards

- Once all tasks (client, tests, docs, examples) are completed and merged, the Ballerina team will arrange for the rewards.

- **Important**: You must complete all the required steps to be eligible for the full reward. Partial submissions are not eligible for rewards.

## Additional Resources

- New to Ballerina? Start with [Ballerina By Example](https://ballerina.io/learn/by-example/) to get familiar with the language.
- For technical questions, ask on [StackOverflow](https://stackoverflow.com/) using the [ballerina](https://stackoverflow.com/questions/tagged/ballerina) tag, and the team will be notified.
- Follow the [Connector Development Process](https://github.com/ballerina-platform/ballerina-library/blob/main/docs/connector-development-process.md) for a detailed guide on building connectors.
- Review [Ballerina Best Practices](https://learn-ballerina.github.io/index.html) to write clean, efficient code.
- Need help? Comment on the GitHub issue or ask in the [Ballerina Discord](https://discord.gg/ballerinalang).
- Ensure your contributions follow the [Ballerina Code of Conduct](https://ballerina.io/community/code-of-conduct/).

We can't wait to see your contributions!
