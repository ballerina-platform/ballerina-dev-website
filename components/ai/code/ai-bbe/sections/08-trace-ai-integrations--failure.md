---
lang: text
---
```
Captured with tracesLogConsole against local mocks (Ballerina 2201.14.0, ballerina/ai 1.16.0)

POST /support/chat  {"sessionId":"cust-43","message":"Where is my order ORD-9999?"}

post /chat                                        39.0 ms  status=OK
└─ invoke_agent Order Support                     37.3 ms  status=OK
   ├─ chat gpt-4o-mini                            10.7 ms  finish=tool_calls
   ├─ execute_tool getOrder                       12.5 ms  status=OK
   │    gen_ai.tool.arguments = {"orderId":"ORD-9999"}
   │    gen_ai.tool.output    = error ClientRequestError ("Not Found",statusCode=404,
   │                            ... body={"message":"Order ORD-9999 not found"})
   │  └─ ballerina/http/Client  GET /orders/ORD-9999  11.4 ms  status=ERROR
   │       error=true  http.status_code=404  http.base_url=http://localhost:9090
   └─ chat gpt-4o-mini                             9.8 ms  finish=stop

Reply: "I couldn't find order ORD-9999. Please check the order number."

A tool error does not fail the agent run. It goes back to the model as the
tool output, and the HTTP span carries the error status. In a second captured
run, the mock model returned 429: the chat and invoke_agent spans ended with
status ERROR, and the service returned 502.
```
