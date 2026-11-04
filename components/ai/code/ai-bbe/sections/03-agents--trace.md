---
lang: text
---
```
Captured run: real service, tools, mock order API, and memory. The model was replaced by a
scripted OpenAI-compatible stub, so the tool choices and replies are placeholders. A live model
makes its own tool choices and writes its own replies.

session customer-42  POST /support/chat "Where is my order ORD-1001?"
  model call 1  [system, user]                   -> getOrder {"orderId": "ORD-1001"}
    tool        GET /api/orders/ORD-1001         <- SHIPPED, trackingNumber "TRK-55501"
  model call 2  [.., assistant, tool]            -> getShipment {trackingNumber: "TRK-55501"}
    toolkit     GET /api/shipments/TRK-55501     <- 200 FastShip, "In transit", 2026-10-15
  model call 3  [.., assistant, tool]            -> final answer
  -> 201 {"message": "Your order ORD-1001 has shipped with FastShip. It is in transit ..."}

session customer-42  "Can I still cancel it?"
  model call 1  [system, 6 earlier messages from memory, user] -> answer, no tool call
  -> 201 {"message": "Order ORD-1001 has already shipped, so it can't be cancelled."}

Tool failures returned to the model as tool results (bal test):
  cancelOrder {"orderId": "ORD-1001"}  <- "Order ORD-1001 is SHIPPED and cannot be cancelled" (409)
  getOrder {"orderId": "1001"}         <- "'1001' is not a valid order ID. ..." (no API call)

Order API down (orderApiUrl points to a closed port)
  getOrder  ERROR "Order API call failed" (Connection refused)
            tool result "The order system is unavailable. Do not retry."
  -> 503 Service Unavailable  "The order system is temporarily unavailable"
```
