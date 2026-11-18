---
lang: toml
---
```
# Development: an in-process engine with no server. State is lost when the program stops.
# [ballerina.workflow]
# mode = "IN_MEMORY"

# Durable: Temporal records every completed model call, tool call, and review decision.
# For a local dev server, run `temporal server start-dev` (localhost:7233).
[ballerina.workflow]
mode = "LOCAL"                       # or SELF_HOSTED / CLOUD, with url, namespace, and auth keys
taskQueue = "REFUND_APPROVAL_QUEUE"
activityRetryMaximumAttempts = 3     # default for activities without a retryPolicy; includes the first attempt

# Reviewers decide through the management API (http://localhost:8234/workflow).
# The x-user-id and x-user-roles headers are not authenticated, so enable an auth scheme and TLS.
[ballerina.workflow.management.rest]
enableManagementApi = true
enableBasicAuth = true
enableTls = true
certFile = "/etc/certs/tls.crt"
keyFile = "/etc/certs/tls.key"

# Not the same as persistent conversation memory: an ai:ShortTermMemory backed by a
# database store (ballerinax/ai.memory.*) keeps chat history, but it does not resume
# unfinished work.
```
