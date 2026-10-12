---
title: 'The right access. The right approval.'
id: 'access-and-approval'
description: "Give agents their own identity, limit access through scoped permissions, and require human approval before selected actions execute. Enforce these controls in the integration and its backend services."
details: "The integration keeps three identities separate. The **customer** is identified by the caller's validated JWT and reaches the tools through `ai:Context`, never as a model argument. The **agent** has its own ID and secret, and gets a token for each tool with only that tool's scopes. The **reviewer** is a different person with the `refunds:approve` scope. `requiresApproval` pauses the run in code before the call executes. The service refuses self-approval and releases a pending request only after the resumed run succeeds. A system prompt that asks the model to confirm is not an approval mechanism. The refund API still verifies the token, the scope, and order ownership. Agent identity needs `ballerina/ai` 1.11 or later and an identity provider that supports agent identities, such as Asgardeo (platform-specific). Approval gates need 1.13 or later and keep the pending state in agent memory, which is in process by default. The result was captured with a scripted model and no identity provider."
guide: { label: 'Observe and secure AI integrations', url: '/learn/observe-and-secure-ai-integrations/' }
samples:
  - { label: 'Approve tool calls in an interactive agent (guide)', url: '/learn/add-human-approval-and-durable-execution/#approve-tool-calls-in-an-interactive-agent' }
  - { label: 'HTTP service JWT authentication (BBE)', url: '/learn/by-example/http-service-jwt-authentication/' }
  - { label: 'OAuth2 client credentials (BBE)', url: '/learn/by-example/http-client-oauth2-client-credentials-grant-type/' }
tabs:
  - { key: 'identity', title: 'Agent tool' }
  - { key: 'approval', title: 'Approval gate' }
  - { key: 'sequence', title: 'Sequence' }
  - { key: 'result', title: 'Result' }
---
