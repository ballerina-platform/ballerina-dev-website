---
lang: text
---
```
Declared interaction (what the code is designed to do; not a recorded run)

Customer      Agent service      ai:McpToolKit       MCP server /mcp
   │ POST /chat     │                  │                    │
   │───────────────►│ getAgent()       │                    │
   │                │ (first request)  │                    │
   │                │─────────────────►│ initialize         │
   │                │                  │───────────────────►│
   │                │                  │ tools/list         │
   │                │                  │───────────────────►│
   │                │                  │◄── 3 tools ────────│
   │                │                  │ keeps 2 permitted  │
   │                │ agent.run: model picks getOrderStatus │
   │                │─────────────────►│ tools/call         │
   │                │                  │───────────────────►│ findOrderStatus
   │                │                  │◄── OrderStatus ────│ (order system)
   │                │ model writes the reply                │
   │◄───────────────│                  │                    │
   │                │                  │                    │

If the MCP server is unreachable when the agent is created, the request fails
with 503 and the next request tries again. The model never sees issueRefund,
because it is not in permittedTools.
```
