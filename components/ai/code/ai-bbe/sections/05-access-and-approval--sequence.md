---
lang: text
---
```
Declared interaction (what the code is designed to do; not a recorded run)

Customer (user identity)      JWT: sub=CUS-42, scope=support:chat
 1 ─► Support service         validates the JWT and scope; puts CUS-42 in ai:Context
 2 ─► ai:Agent.run            the model proposes issueRefund(ORD-1001, 80)
 3    approval gate           needsApproval(80) is true, so the run pauses.
                              issueRefund has NOT executed.
 4 ◄─ PENDING_APPROVAL        ApprovalRequest: id, toolName, arguments

Reviewer (a different person) JWT: sub=maya, scope=refunds:approve
 5 ─► POST /approvals/{id}    APPROVE, or REJECT with a reason; the requester
                              cannot approve their own refund (403)
 6 ─► ai:Agent.run(Resume)    REJECT: the tool never runs; the model gets the reason

Agent (agent identity)        agent ID + secret, not the customer's token
 7 ─► Identity provider       gets a token for issueRefund; the agent checks
                              the refunds:write scope before the tool runs
 8 ─► Refund API              POST /customers/CUS-42/refunds
                              Authorization: Bearer <agent token>
 9    Refund API authorizes   verifies the signature, audience, and refunds:write scope,
                              and that ORD-1001 belongs to CUS-42; otherwise 401/403
```
