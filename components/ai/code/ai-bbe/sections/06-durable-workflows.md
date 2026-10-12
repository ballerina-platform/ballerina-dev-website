---
title: 'Long-running work. Built to continue.'
id: 'durable-workflows'
description: "Coordinate agents and integration steps through durable workflows. Wait for approvals or external events, apply retry policies, and recover progress through the configured workflow runtime."
details: "A `workflow:DurableAgent` runs each model call and tool call as a workflow activity. A refund waits for a support lead without holding a thread, and a failed payment call goes to payments operations for review. To wait for an external event instead, such as a carrier scanning the returned item, a `@workflow:Workflow` function waits on an event future (`wait events.returnScanned`) that the integration completes with `workflow:sendData`. The workflow runtime provides the durability: `ballerina/workflow` 1.0.0 (Ballerina 2201.14.0 or later) on Temporal. `IN_MEMORY` mode is for development only. Durable execution is different from persistent conversation memory, which keeps chat history but does not resume unfinished work. The engine does not repeat a completed activity, but a manual rerun or a crash after the side effect can run it again. So the payment carries an idempotency key that the gateway must honor, because retries alone do not guarantee exactly-once effects. The sample allows one refund per order, so the key comes from the order. The timeline was captured with the in-memory engine and a scripted model. The Temporal restart step comes from the guide."
guide: { label: 'Add human approval and durable execution', url: '/learn/add-human-approval-and-durable-execution/' }
samples:
  - { label: 'Agent human approval (GitHub)', url: 'https://github.com/ballerina-platform/module-ballerina-workflow/tree/main/examples/agent-human-approval' }
  - { label: 'Agent order processing (GitHub)', url: 'https://github.com/ballerina-platform/module-ballerina-workflow/tree/main/examples/agent-order-processing' }
tabs:
  - { key: 'code', title: 'Code' }
  - { key: 'timeline', title: 'Timeline' }
  - { key: 'recovery', title: 'Failure and recovery' }
  - { key: 'config', title: 'Config' }
---
