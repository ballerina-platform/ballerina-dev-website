---
lang: ballerina
---
```
# Retrieves an order, including its status, items, total, and tracking number.
#
# + ctx - The agent context, used to report backend outages to the caller
# + orderId - The order ID, in the format ORD-1234
# + return - The order, or an error that describes why it could not be retrieved
@ai:AgentTool
isolated function getOrder(ai:Context ctx, string orderId) returns Order|error {
    check validateOrderId(orderId);
    Order|http:ClientError 'order = orderApi->/orders/[orderId];
    if 'order is http:ClientError {
        return toToolError(ctx, 'order);
    }
    return 'order;
}

// ... cancelOrder(ctx, orderId, reason) follows the same pattern

// Exposes the read-only shipment tracking API as a tool, without writing a function for it.
final ai:HttpServiceToolKit shipmentToolKit = check new (orderApiUrl, [
    {
        name: "getShipment",
        description: "Retrieves the carrier, status, and estimated delivery date of a shipment. " +
            "Use the trackingNumber field of the order.",
        method: ai:GET,
        path: "/shipments/{trackingNumber}",
        parameters: {
            trackingNumber: {
                location: ai:PATH,
                description: "The tracking number, in the format TRK-12345",
                schema: {'type: ai:STRING, pattern: "^TRK-[0-9]{5}$"}
            }
        }
    }
]);

isolated function toToolError(ai:Context ctx, http:ClientError err) returns error {
    if err is http:ClientRequestError { // 4xx: a business error the model can explain
        ErrorBody|error body = err.detail().body.ensureType();
        return error(body is ErrorBody ? body.message : "The request was rejected by the order system.");
    }
    log:printError("Order API call failed", err);
    ctx.set(BACKEND_UNAVAILABLE, true); // outage: the service fails the request
    return error("The order system is unavailable. Do not retry.");
}
```
