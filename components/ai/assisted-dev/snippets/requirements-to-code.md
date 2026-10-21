---
title: 'Requirements in. Code out. Drift caught.'
id: 'natural-programming-vs-code-features'
description: "Keep requirements, code, and documentation in sync. Generate an implementation and tests from high-level business requirements, then check later changes for drift between what the requirements say and what the code does."
details: "Requirements-to-code and drift detection are offered through Copilot's `/natural-programming` command, which the WSO2 Integrator documentation labels **experimental** (platform-specific). Drift checks use a model at development time, so treat each finding as a suggestion to review, not as proof that the code matches or violates a requirement. Tests generated from requirements give you a repeatable check that does not depend on the model."
links:
  - { label: 'Copilot capabilities: /natural-programming (WSO2 Integrator documentation)', url: 'https://wso2.com/integration-platform/docs/develop/copilot/copilot-capabilities', action: 'Read the documentation' }
  - { label: 'Introducing natural programming (blog)', url: 'https://blog.ballerina.io/posts/2025-04-26-introducing-natural-programming/', action: 'Read the post' }
tabs:
  - { key: 'requirements', title: 'Code from requirements', src: '/images/np_code_generation_from_requirements.png', width: 1414, height: 809, alt: 'Copilot receiving claim management requirements through the experimental /natural-programming command and generating a Ballerina expense-claims service.' }
  - { key: 'drift', title: 'Drift detection and fixes', src: '/images/np_drift_check.gif', width: 656, height: 654, alt: 'Animation of a drift check in VS Code underlining code in an expense-claims service that no longer matches the requirements.' }
  - { key: 'tests', title: 'Tests from requirements', src: '/images/np_test_generation_from_requirements.png', width: 2829, height: 1616, alt: 'Copilot receiving "/natural-programming (experimental) Generate tests against the requirements" and producing a test plan and Ballerina tests for claim submission and status retrieval.' }
---
