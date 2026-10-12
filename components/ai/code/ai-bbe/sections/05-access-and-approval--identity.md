---
lang: ballerina
---
```
import ballerina/ai;

// Agent identity: the agent's own ID and secret, registered with an identity
// provider that supports agent identities (for example, Asgardeo).
configurable ai:Credential agentCredential = ?;

# Issues a refund for one of the signed-in customer's orders.
#
# + ctx - Holds the customer ID from the caller's validated JWT (not visible to the model)
# + orderId - Order ID in the format ORD-NNNN
# + amount - Amount to refund, in USD
# + return - The refund, or an error
@ai:AgentTool {
    description: "Issues a refund for one of the signed-in customer's orders.",
    // Before the tool runs, the agent obtains a token for it as the agent
    // and checks that the token grants the required scope.
    auth: {
        baseAuthUrl: authServerUrl,
        clientId: oauthClientId,
        redirectUri: oauthRedirectUri,
        isPkceEnabled: true,
        scopes: ["refunds:write"]
    },
    // Enforced in code: a matching call pauses before it executes.
    requiresApproval: needsApproval
}
isolated function issueRefund(ai:Context ctx, string orderId, decimal amount)
        returns RefundResult|error {
    string customerId = check ctx.getWithType(CUSTOMER_ID); // user identity, never a model argument
    string token = check ctx.getAccessToken("issueRefund"); // agent identity, scoped to this tool
    return refundApi->/customers/[customerId]/refunds.post({orderId, amount},
        {"Authorization": string `Bearer ${token}`});
}

// Same parameters as the tool (without the context): refunds above 50 USD need a person.
isolated function needsApproval(string orderId, decimal amount) returns boolean => amount > 50d;

final ai:Agent refundAgent = check new (
    systemPrompt = {role: "Refund assistant", instructions: "Help customers with refunds."},
    model = model,
    tools = [getOrder, issueRefund],
    credential = agentCredential
);
```
