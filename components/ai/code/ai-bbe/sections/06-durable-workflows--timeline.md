---
lang: text
---
```
TKT-5001, captured locally (IN_MEMORY engine, scripted model in place of an LLM)

+0.00s  POST /refunds                 202 {"instanceId":"TKT-5001","status":"IN_PROGRESS"}
+0.08s  activity llmChat              the model asks for getOrder
+0.10s  activity getOrder             ORD-1001: DELIVERED, total 120.00, refunded 0
+0.12s  activity llmChat              the model proposes issueRefund(ORD-1001, 40.0)
+0.14s  review task created           trigger PRE_RUN, userRoles [SUPPORT_LEAD],
                                      "Approve refund", taskInput {amount: 40.0, ...}
        ── the run is suspended: no thread is held, and issueRefund has not run ──
  ...   GET /refunds/TKT-5001         202 IN_PROGRESS
  ...   POST /refunds (same ticket)   202: joins the running instance (USE_EXISTING)
+11.27s proceed-with-input by maya    the amount is changed from 40.0 to 35.0
+11.28s activity issueRefund          gateway accepts refund-ORD-1001: RF-ORD-1001, 35.0
+11.30s activity notifyCustomer       "Your refund has been issued."
+11.31s workflow closed               outcome success
        GET /refunds/TKT-5001         {"status":"COMPLETED", "summary":"Refund issued ..."}
        POST /refunds (same ticket)   409 Conflict: Ticket TKT-5001 was already processed
```
