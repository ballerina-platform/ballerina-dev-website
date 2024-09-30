# Connector Contributor Guide - Ballerina Hacktoberfest 2024 -

Welcome to the Ballerina Hacktoberfest connector hackathon and, we are excited to have you contribute to the Ballerina ecosystem! 

This guide will walk you through the process of participating in the hackathon and contributing your connector. Please follow the instructions carefully to ensure your contribution is eligible for the reward.

## Connector Categories & Rewards

You can contribute to one of the following categories:

1. Category 1: Connectors generated via existing OpenAPI specification
    - Contribution involves creating a connector using a pre-defined OpenAPI spec.
    - Reward: 50 Credits

2. Category 2: Connectors generated via an manually-written OpenAPI specification
    - Contribution requires defining the OpenAPI spec first, followed by generating the connector.
    - Reward: 75 Credits

3. Category 3: Manually developed (handwritten) connectors
    - Contribution involves building a connector from scratch without relying on an OpenAPI spec, typically for APIs that don't provide one.
    - Reward: 100 Credits

## Contribution Process

### Step 1: Select a Connector

- Go through the project ideas listed in the [Ballerina Hacktoberfest 2024 Project Board](https://github.com/orgs/ballerina-platform/projects/376/views/5) and choose one connector to work on.
- Once you've selected a connector, leave a comment on its GitHub issue indicating your interest in contributing to it.

### Step 2: Get Assigned to the Issue

- A Ballerina team member will review your comment and confirm your request. After confirmation, the connector will be officially assigned to you.

### Step 3: Repository Setup

- Once confirmed, the Ballerina team will create a new repository for the connector under the `ballerina-platform` organization and set up the initial project structure.

### Step 4: Follow the Connector Development Guide 

- You can start working on your connector by following the steps defined in the [Create Your First Ballerina Connector](https://ballerina.io/learn/how-to-create-your-first-ballerina-connector/) guide.

#### Note for Category 2 Connectors:

#### Note for Handwritten Connectors (Category 3):
The guide is mainly for generated connectors, so the steps related to the client generation will not be applicable for handwritten connectors. However, the steps for tests, documentation, and examples will remain the same.

### Step 5: Contribution Workflow

You will need to create individual pull requests (PRs) for each area of your contribution:
- Client generation with required sanitizations (if applicable)
- Test cases
- Documentation
- Examples

All PRs should reference the related connector issue in their description, to ensure that all the contributions are properly tracked.

### Step 6: Code Reviews & Improvements

- Ballerina team member(s) will review your pull requests and may request changes or improvements. You are required to address these code reviews and resubmit the PRs if necessary.

### Step 7: Completion & Rewards

- After all the tasks (client, tests, docs, examples) are successfully completed and merged, the Ballerina team will arrange the prizes and incentives.

- **Important**: You must complete all the required steps to be eligible for the full reward. Partial submissions will not be eligible for any rewards.

## Additional Resources

- New to Ballerina? Start with [Ballerina By Example](https://ballerina.io/learn/by-example/) to get familiar with the language.

- For technical questions, ask on [StackOverflow](https://stackoverflow.com/) using the "ballerina" tag, and the team will be notified.

- Follow the [Connector Development Process](https://github.com/ballerina-platform/ballerina-library/blob/main/docs/connector-development-process.md) for a detailed guide on building connectors.

- Review [Ballerina Best Practices](https://learn-ballerina.github.io/index.html) to write clean, efficient code.

- Need help? Comment on the GitHub issue or ask in the [Ballerina Discord](https://discord.gg/ballerinalang).

- Ensure your contributions follow the [Ballerina Code of Conduct](https://ballerina.io/community/code-of-conduct/).

We can't wait to see your contributions!
