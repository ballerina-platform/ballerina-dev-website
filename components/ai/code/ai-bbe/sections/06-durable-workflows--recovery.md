---
lang: text
---
```
Payment gateway failure (TKT-5002, gatewayFailuresBeforeSuccess = 1): captured
  issueRefund attempt 1       failure: Payment gateway unavailable (attempt 1)
  review task created         trigger ON_FAILURE, userRoles [PAYMENTS_OPS],
                              "Review failed activity: issueRefund"
  GET /refunds/TKT-5002       202 IN_PROGRESS: the run waits, and no work is lost
  proceed by omar             rerun with the original input: RF-ORD-1001, COMPLETED

Repeated external operation (TKT-5003, same order, approved): captured
  payment gateway             "Duplicate refund request ignored"
                              idempotencyKey="refund-ORD-1001": the mock gateway
                              deduplicates by key, and the sample's business rule
                              is one refund per order, so no second payment

Restart with mode = "IN_MEMORY": captured
  GET /refunds/TKT-5001       {"status":"NOT_FOUND"}: the state was in process memory

Restart with mode = "LOCAL" (Temporal): from the guide, not captured here
  The pending review is still listed after the restart. Approving it continues
  the run. Completed model and tool calls are taken from the recorded history
  and are not executed again.
```
