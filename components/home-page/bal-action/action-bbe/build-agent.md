import ballerina/ai;
import ballerina/http;
import ballerina/log;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;

@ai:AgentTool
isolated function lookupOrder(string orderId) returns json|error {
    http:Client backend = check new ("http://localhost:9091");
    return backend->/orders/[orderId];
}

@ai:AgentTool
isolated function lookupShipment(string shipmentId) returns json|error {
    http:Client backend = check new ("http://localhost:9092");
    return backend->/shipments/[shipmentId];
}

public function main() returns error? {
    openai:ModelProvider model = check new openai:ModelProvider(
        openAiApiKey, modelType = openai:GPT_4O_MINI
    );
    ai:Agent agent = check new (
        systemPrompt = {
            role: string `Delivery assistant`,
            instructions: string `You help customers track their orders and shipments.
                When a user asks about an order or delivery:
                1. If they give an order id (e.g. "O-100"), call the order lookup tool first to find the linked shipment id.
                2. Use the shipment id from the order lookup to call the shipment lookup tool and get the current status and ETA.
                3. If they give a shipment id directly, call the shipment lookup tool right away.

                Always call the relevant tool(s) before answering; never guess or fabricate order or shipment details.
                Answer in a concise, friendly tone, including the order item, shipment status and ETA when available.
                If an order or shipment id cannot be found, tell the user clearly and ask them to double-check the id.`
        },
        model = model,
        tools = [lookupOrder, lookupShipment]
    );
    string answer = check agent.run("When will order O-100 arrive?");
    log:printInfo(answer);
}
