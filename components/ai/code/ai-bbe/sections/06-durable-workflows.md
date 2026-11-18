---
title: 'Long-running work. Built to continue.'
id: 'durable-workflows'
description: |
  Run AI-driven processes that span minutes, days, or weeks. Durable workflows wait for approvals and external events, survive restarts, and resume where they left off.

  - **Durable agents**: every model call and tool call runs as a recoverable workflow step.
  - **Wait for people and events**: pause for approvals or external signals without holding resources.
  - **Built-in recovery**: retry policies and failure handling, backed by Temporal.
guide: { label: 'Add human approval and durable execution', url: '/learn/add-human-approval-and-durable-execution/' }
samples:
  - { label: 'Durable refund agent with human approval (GitHub)', url: 'https://github.com/ballerina-guides/ai-samples/tree/main/add-human-approval-and-durable-execution' }
  - { label: 'Agent human approval (GitHub)', url: 'https://github.com/ballerina-platform/module-ballerina-workflow/tree/main/examples/agent-human-approval' }
  - { label: 'Agent order processing (GitHub)', url: 'https://github.com/ballerina-platform/module-ballerina-workflow/tree/main/examples/agent-order-processing' }
tabs:
  - { key: 'code', title: 'Code' }
---
