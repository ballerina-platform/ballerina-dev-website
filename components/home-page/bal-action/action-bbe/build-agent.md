import ballerina/ai;
import ballerina/http;
import ballerina/io;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;

// In-process enterprise backend fixtures, replace URLs for real systems.
service /orders on new http:Listener(9091) {
    resource function get [string id]() returns json {
        return {orderId: id, shipmentId: "S-100", item: "Travel mug"};
    }
}
service /shipments on new http:Listener(9092) {
    resource function get [string id]() returns json {
        return {shipmentId: id, status: "In transit", eta: "2026-10-15"};
    }
}

@ai:AgentTool
isolated function lookupOrder(string orderId) returns json|error {
    io:println("Tool: lookupOrder ", orderId);
    http:Client backend = check new ("http://localhost:9091");
    return backend->/orders/[orderId];
}

@ai:AgentTool
isolated function lookupShipment(string shipmentId) returns json|error {
    io:println("Tool: lookupShipment ", shipmentId);
    http:Client backend = check new ("http://localhost:9092");
    return backend->/shipments/[shipmentId];
}

public function main() returns error? {
    ai:ModelProvider model = check new openai:ModelProvider(
        openAiApiKey, modelType = openai:GPT_4O_MINI);
    ai:Agent agent = check new (
        systemPrompt = {role: "Delivery assistant", instructions:
            "Use order lookup and shipment lookup before answering delivery questions."},
        model = model,
        tools = [lookupOrder, lookupShipment]);
    string answer = check agent.run("When will order O-100 arrive?");
    io:println(answer);
}
