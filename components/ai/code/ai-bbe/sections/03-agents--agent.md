---
lang: ballerina
---
```
// Keeps the most recent messages of each session (by sessionId) in memory.
final ai:ShortTermMemory memory = check new (check new ai:InMemoryShortTermMemoryStore(memorySize));

final ai:Agent orderSupportAgent = check new (
    systemPrompt = {role: "Order Support Assistant", instructions: supportInstructions},
    model = model,
    tools = [getOrder, cancelOrder, shipmentToolKit],
    memory = memory,
    maxIter = maxIterations
);

service /support on new http:Listener(servicePort) {
    resource function post chat(ai:ChatReqMessage request)
            returns ai:ChatRespMessage|http:BadRequest|http:ServiceUnavailable|http:InternalServerError {
        // ... validate sessionId and message (400 Bad Request)

        // A new context per request. Tools use it to report backend outages.
        ai:Context ctx = new;
        string|ai:Error answer = orderSupportAgent.run(request.message, request.sessionId, ctx);

        if ctx.hasKey(BACKEND_UNAVAILABLE) {
            return <http:ServiceUnavailable>{body: "The order system is temporarily unavailable"};
        }
        if answer is ai:Error && isModelUnreachable(answer) {
            log:printError("Model provider is unreachable", answer);
            return <http:ServiceUnavailable>{body: "The assistant is temporarily unavailable"};
        }
        if answer is ai:MaxIterationExceededError {
            log:printWarn("Agent exceeded the iteration limit", sessionId = request.sessionId);
            return <http:InternalServerError>{body: "The assistant could not complete the request"};
        }
        // ... any other ai:Error returns 500 Internal Server Error
        return {message: answer};
    }
}
```
