---
title: 'Simple when you want it. Powerful when you need it.'
id: 'simple-when-you-want-it'
description: "Add an LLM call to an existing integration using a common model-provider interface and typed responses. When you need provider-specific capabilities, use typed connectors to access the underlying APIs."
details: "A support inbox classifies each customer message into a typed `Triage` record. Constraints are validated after generation, deterministic code picks the queue, and the case is created in a downstream case API. The type ensures the response has the right shape. It does not make the classification correct, so any failed or unusable model call routes the message to manual triage."
guide: { label: 'Add an LLM step to an integration', url: '/learn/add-an-llm-step-to-an-integration/' }
samples:
  - { label: 'Direct LLM calls (BBE)', url: '/learn/by-example/direct-llm-calls/' }
  - { label: 'Direct LLM calls with history (BBE)', url: '/learn/by-example/direct-llm-calls-with-history/' }
  - { label: 'Constraint validation (BBE)', url: '/learn/by-example/constraint-validations/' }
tabs:
  - { key: 'code', title: 'Code' }
  - { key: 'result', title: 'Result' }
  - { key: 'connector', title: 'Provider connector' }
---
