---
lang: json
---
```
{
  "id": "order-support",
  "name": "Order support agent",
  "description": "Expected behavior of the order support agent",
  "threads": [
    {
      "id": "shipped-no-cancel",
      "description": "A shipped order must not be cancelled",
      "traces": [
        {
          "id": "shipped-no-cancel-1",
          "userMessage": {"role": "user", "content": "Please cancel my order ORD-1001."},
          "iterations": [],
          "toolCalls": [{"name": "getOrder", "arguments": {"orderId": "ORD-1001"}}],
          "output": {"role": "assistant", "content": "Order ORD-1001 has already shipped, so it can't be cancelled."},
          "tools": [],
          "startTime": "2026-10-01T09:05:00Z",
          "endTime": "2026-10-01T09:05:04Z"
        }
      ]
    },
    {
      "id": "cancel-pending",
      "description": "A pending order is looked up and then cancelled",
      "traces": [
        {
          "id": "cancel-pending-1",
          "userMessage": {"role": "user", "content": "Please cancel ORD-1002. I ordered the wrong size."},
          "iterations": [],
          "toolCalls": [
            {"name": "getOrder", "arguments": {"orderId": "ORD-1002"}},
            {"name": "cancelOrder", "arguments": {"orderId": "ORD-1002"}}
          ],
          "output": {"role": "assistant", "content": "I cancelled order ORD-1002."},
          "tools": [],
          "startTime": "2026-10-01T09:10:00Z",
          "endTime": "2026-10-01T09:10:06Z"
        }
      ]
    }
  ]
}
```
