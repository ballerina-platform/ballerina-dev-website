---
lang: ballerina
---
```
// No tracing code: spans come from ballerina/ai, the model and embedding providers, and ballerina/http.

final ai:ModelProvider model = check new openai:ModelProvider(openAiApiKey, openai:GPT_4O_MINI,
    serviceUrl = openAiServiceUrl);
final ai:KnowledgeBase policies = new ai:VectorKnowledgeBase(check new ai:InMemoryVectorStore(),
    check new openai:EmbeddingProvider(openAiApiKey, openai:TEXT_EMBEDDING_3_SMALL, serviceUrl = openAiServiceUrl));
final http:Client orderApi = check new (orderApiUrl);

# Gets an order from the order API.
#
# + orderId - The order ID, in the format ORD-1234
# + return - The order, or an error
@ai:AgentTool
isolated function getOrder(string orderId) returns Order|error {
    return orderApi->/orders/[orderId];
}

# Searches the store's return, refund, and shipping policies.
#
# + topic - What to look for
# + return - The most relevant policy passages, with their source file
@ai:AgentTool
isolated function searchPolicies(string topic) returns string[]|error {
    ai:QueryMatch[] matches = check policies.retrieve(topic, 2);
    string[] passages = [];
    foreach ai:QueryMatch m in matches {
        if m.similarityScore >= 0.3 {
            json fileName = m.chunk.metadata?.fileName;
            passages.push(string `[${fileName.toString()}] ${m.chunk.content.toString()}`);
        }
    }
    return passages;
}

final ai:Agent supportAgent = check new (
    systemPrompt = {role: "Order Support", instructions: "Answer using the tools. Cite policy sources."},
    model = model,
    tools = [getOrder, searchPolicies]
);
// ... POST /support/chat service and policy ingestion (see full sample)
```
