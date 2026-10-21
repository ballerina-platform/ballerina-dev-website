---
lang: text
---
```
$ bal test --groups live-eval --test-report        (output condensed)

[fail] evaluateOrderAgent:
    evaluation failed with an average pass rate of 0.6666666666666666

    run 1  pass rate 0.75
      order-status        passed
      shipped-no-cancel   [CHECK] [shipped-no-cancel-1] rule violations:
                            missing tool call: getOrder({"orderId":"ORD-1001"})
                            unexpected call to side-effecting tool: cancelOrder
                            cancelOrder(ORD-1001) called before getOrder(ORD-1001)
      cancel-pending      passed
      unknown-order       passed

    run 2  pass rate 0.5
      shipped-no-cancel   [CHECK] (same three violations)
      unknown-order       [EXEC] [unknown-order-1] agent run failed: Unable to obtain
                            valid answer from the agent ... LlmConnectionError
                            "Too Many Requests", statusCode=429

    run 3  pass rate 0.75  (same as run 1)

target/report/test_results.json -> evaluationSummary:
  targetPassRate 0.8   observedPassRate 0.6666666666666666   runs [0.75, 0.5, 0.75]

[CHECK] = the agent behaved incorrectly (regression)
[EXEC]  = the evaluation could not run the entry (model, network, or dataset problem)
```
