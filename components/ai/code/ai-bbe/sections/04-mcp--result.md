---
lang: text
---
```
Captured locally: the MCP server above, the client toolkit, and curl (no LLM involved)
Captured with the server on Ballerina 2201.13.6 (ballerina/mcp 1.3.0)

tools/list → 3 tools, generated from the remote functions
  {"name":"getOrderStatus", "description":"Get the current status of an order. ...",
   "inputSchema":{"type":"object", "required":["orderId"], "properties":{"orderId":
     {"type":"string", "description":"Order ID in the format ORD-NNNN (for example ORD-1001)"}}}}
  {"name":"submitReturnRequest", ...}  {"name":"issueRefund", ...}

Tools loaded by the agent's ai:McpToolKit
  ["getOrderStatus","submitReturnRequest"]

tools/call getOrderStatus {"orderId":"ORD-1002"}
  {"content":[{"type":"text", "text":"{\"orderId\":\"ORD-1002\",\"state\":\"SHIPPED\",
    \"skus\":[\"SP-300\",\"CB-400\"],\"placedOn\":\"2026-10-05\",\"deliveredOn\":null}"}]}

tools/call submitReturnRequest {"orderId":"ORD-1002", "reason":"Changed my mind"}
  {"content":[{"type":"text", "text":"{\"outcome\":\"NOT_ALLOWED\",\"message\":
    \"Order ORD-1002 is SHIPPED. Only delivered orders can be returned.\"}"}]}

tools/call getOrderStatus {}        ← rejected before the function runs
  {"content":[{"type":"text", "text":"missing required argument 'orderId'"}], "isError":true}

resources/list                      ← not supported by ballerina/mcp
  {"error":{"code":-32601, "message":"Method not found"}}

POST /support/chat while the MCP server is down
  HTTP/1.1 503 Service Unavailable
  Customer care is temporarily unavailable.
```
