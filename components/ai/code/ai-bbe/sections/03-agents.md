---
title: 'Agents that work with your systems.'
id: 'agents'
description: "Give agents tools backed by enterprise APIs and connectors. Combine instructions, conversation memory, and typed tool interfaces so agents can retrieve information and perform defined tasks."
details: "An order-support agent uses an existing order API and a shipment API as its source of truth. Typed function tools validate their input before calling the backend, and an `ai:HttpServiceToolKit` exposes a read-only endpoint without extra code. Memory is kept per `sessionId`, and `maxIter` bounds each run. A business error, such as an order that has already shipped, goes back to the model so that it can explain it. An outage fails the request with `503`. The system prompt asks the agent to confirm before cancelling, but that is guidance, not enforcement. The section *The right access. The right approval.* shows an enforced approval gate."
guide: { label: 'Build an agent that uses enterprise systems', url: '/learn/build-an-agent-that-uses-enterprise-systems/' }
samples:
  - { label: 'Personal AI assistant (GitHub)', url: 'https://github.com/ballerina-platform/module-ballerina-ai/tree/main/examples/personal-ai-assistant' }
tabs:
  - { key: 'agent', title: 'Code' }
---
