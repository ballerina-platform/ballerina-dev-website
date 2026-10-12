---
lang: text
---
```
POST /support/chat  {"sessionId":"cust-42","message":"Can I return order ORD-1003? It arrived damaged."}

post /chat                                           149.9 ms
└─ invoke_agent Order Support                        134.4 ms  gen_ai.conversation.id=cust-42
   ├─ chat gpt-4o-mini                                34.3 ms  tokens in=201 out=18  finish=tool_calls
   │  └─ ballerina/http/Client:post /chat/completions  25.7 ms
   ├─ execute_tool getOrder                           21.4 ms  args={"orderId":"ORD-1003"}
   │  └─ ballerina/http/Client  GET /orders/ORD-1003  14.0 ms  200
   ├─ chat gpt-4o-mini                                18.5 ms  tokens in=281 out=18  finish=tool_calls
   ├─ execute_tool searchPolicies                     18.5 ms  args={"topic":"return a damaged item"}
   │  └─ knowledge_base_retrieve VectorKnowledgeBase  16.0 ms  limit=2
   │     └─ embeddings text-embedding-3-small          6.7 ms  tokens in=6
   └─ chat gpt-4o-mini                                11.6 ms  tokens in=378 out=49  finish=stop

Token usage (sum of gen_ai.usage.* on the chat spans): 860 input, 85 output
Reply: "Yes. Order ORD-1003 was delivered on 2026-10-06, and damaged items can be
        returned within 30 days ... [returns-policy.md]"

Captured with tracesLogConsole on Ballerina 2201.14.0, ballerina/ai 1.16.0, and
ballerinax/ai.openai 1.4.1. The model and order endpoints were local mocks, so the
latencies and token counts are not representative. Provider wrapper spans and most
HTTP client spans are omitted.
```
