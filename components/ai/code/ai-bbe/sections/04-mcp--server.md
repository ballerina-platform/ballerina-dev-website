---
lang: ballerina
---
```
import ballerina/mcp;

configurable int port = 9090;

// Streamable HTTP transport: the server endpoint is http://localhost:9090/mcp
listener mcp:StreamableHttpListener mcpListener = new (port);

@mcp:StreamableHttpServiceConfig {
    info: {name: "customer-care-tools", version: "1.0.0"},
    // Tools keep no per-client state, so every request is independent.
    sessionMode: mcp:STATELESS
    // Before exposing the server, add `httpConfig: {auth: [...]}` (JWT + scopes) and TLS.
}
service mcp:StreamableHttpService /mcp on mcpListener {

    # Get the current status of an order. Use this when a customer asks where an order is.
    #
    # + orderId - Order ID in the format ORD-NNNN (for example ORD-1001)
    # + return - The order status, or an explanation if the order is not found
    remote function getOrderStatus(string orderId) returns OrderStatus|ToolMessage {
        return findOrderStatus(orderId);
    }

    # Submit a return request for a delivered order.
    #
    # + orderId - Order ID in the format ORD-NNNN (for example ORD-1001)
    # + reason - The reason for the return in the customer's words
    # + return - The created return request, or an explanation if the return is not allowed
    remote function submitReturnRequest(string orderId, string reason) returns ReturnRequest|ToolMessage {
        // Business rules (delivered orders only, one return per order) are enforced here,
        // not in the tool description.
        return createReturnRequest(orderId, reason);
    }

    # Issue a full refund for an order. For back-office staff only.
    #
    # + orderId - Order ID in the format ORD-NNNN (for example ORD-1001)
    # + return - The issued refund, or an explanation if the order is not found
    remote function issueRefund(string orderId) returns Refund|ToolMessage {
        return createRefund(orderId);
    }
}
```
