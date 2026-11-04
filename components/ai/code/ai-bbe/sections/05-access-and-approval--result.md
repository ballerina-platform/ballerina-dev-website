---
lang: text
---
```
Captured locally with ballerina/ai 1.16.0 and a scripted model (no LLM, no identity provider)

30 USD refund: below the threshold, so it runs without a pause
  issueRefund executed for CUS-42, ORD-1001, 30

80 USD refund: run() returns ai:ApprovalRequiredError, and the tool has not run
  Human approval is required to execute 1 tool call(s).
  [{"id":"951cfe5d-20ff-4bdb-ad48-182eaca47f8f", "sessionId":"CUS-42:s2",
    "toolName":"issueRefund", "arguments":{"orderId":"ORD-1001", "amount":80},
    "toolCallId":"call_1", "batchIndex":0}]

A new message on the paused session does not get past the gate
  1 tool call(s) are still awaiting approval for session 'CUS-42:s2'; resume it
  (pass a Resume) before starting a new run.

REJECT: the tool never runs, and the model receives the reason as the tool result
  The human reviewer rejected this tool call. Reason: Partial refund only; item can be repaired

APPROVE: the tool runs once, and the run continues
  issueRefund executed for CUS-42, ORD-1001, 80

Resume after the approval was already used
  ai:ApprovalNotFoundError: No pending approval found for session 'CUS-42:s3'.
```
