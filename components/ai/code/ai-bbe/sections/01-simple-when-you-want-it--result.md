---
lang: text
---
```
# Classified by the model (illustrative: model output varies between calls)
POST /support/messages
{"customerId": "C-42", "body": "My keyboard from ORD-1001 arrived with broken keys. I want my money back."}
-> 201 Created
{"caseId": "CASE-0002", "customerId": "C-42", "queue": "priority-support", "intent": "REFUND",
 "orderId": "ORD-1001", "priority": "HIGH", "triagedBy": "MODEL",
 "summary": "Customer reports a keyboard delivered with broken keys and requests a refund."}

# Model call fails (captured run, invalid API key)
WARN "Classification unusable, routing to manual triage" error="LLM call failed: Unauthorized"
-> 201 Created
{"caseId": "CASE-0001", "customerId": "C-42", "queue": "manual-triage", "intent": "OTHER",
 "priority": "MEDIUM", "summary": "Needs manual classification", "triagedBy": "FALLBACK"}

# Correct shape, but a constraint is broken (captured with bal test)
{intent: "REFUND", orderId: "1001", ...}
-> Validation failed for '$.orderId:pattern' constraint(s).  -> routed to manual-triage

# Invalid request: rejected before any data reaches the model provider (captured)
POST /support/messages {"customerId": "C-42", "body": ""}
-> 400 Bad Request
payload validation failed: Validation failed for '$.body:minLength' constraint(s).
```
