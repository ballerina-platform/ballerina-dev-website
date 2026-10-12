---
lang: ballerina
---
```
import ballerina/ai;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;
configurable string mcpServerUrl = "http://localhost:9090/mcp";

final ai:ModelProvider model = check new openai:ModelProvider(openAiApiKey, openai:GPT_4O);

// `issueRefund` is a back-office tool, so the customer-facing agent never sees it.
final string[] & readonly permittedTools = ["getOrderStatus", "submitReturnRequest"];

// Created on first use, so the service starts even if the MCP server is down.
isolated ai:Agent? customerCareAgent = ();

isolated function getAgent() returns ai:Agent|ai:Error {
    lock {
        ai:Agent? existing = customerCareAgent;
        if existing is ai:Agent {
            return existing;
        }
        // Connects over Streamable HTTP, lists the server's tools once,
        // and keeps only the permitted ones.
        ai:McpToolKit orderTools = check new (mcpServerUrl, permittedTools,
            {name: "customer-care-agent", version: "1.0.0"}, timeout = 30);
        ai:Agent agent = check new (
            systemPrompt = {
                role: "Customer Care Agent",
                instructions: "Help customers with order status and returns. Use the tools; do not guess."
            },
            model = model,
            tools = [orderTools], // MCP toolkits, local function tools, and other toolkits can be mixed
            maxIter = 10
        );
        customerCareAgent = agent;
        return agent;
    }
}
```
