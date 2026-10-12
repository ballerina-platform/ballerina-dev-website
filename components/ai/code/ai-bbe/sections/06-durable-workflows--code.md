---
lang: ballerina
---
```
import ballerina/workflow;

final workflow:DurableAgent refundAgent = check new ({
    systemPrompt: {role: "Refund assistant", instructions: refundInstructions},
    model: model,
    inputType: RefundRequest,
    activities: [
        {
            activity: getOrder,
            description: "Returns an order, including its status, total, and the amount already refunded."
        },
        {
            activity: issueRefund,
            description: "Refunds an amount to the customer's original payment method. " +
                "Returns status ISSUED with a refund ID, or status REJECTED with the reason.",
            // Every refund waits durably for a support lead before the payment is made.
            approvalPolicy: {
                userRoles: "SUPPORT_LEAD",
                title: "Approve refund",
                description: "The refund assistant proposes a refund. Approve, edit the amount, or reject."
            },
            // If the payment gateway call fails, payments operations decide whether to rerun it.
            retryPolicy: {userRoles: "PAYMENTS_OPS"}
        },
        {
            activity: notifyCustomer,
            description: "Sends a short message to the customer.",
            retryPolicy: {maxRetries: 5, retryDelay: 2}
        }
    ],
    maxIter: 8
});

// service.bal: the ticket ID is the instance ID. A resubmitted ticket joins the
// running instance, and a ticket whose run has closed is rejected (409).
string|error instanceId = refundAgent.runWithId(request.ticketId, request.customerMessage, request,
        ifRunning = workflow:USE_EXISTING, ifClosed = workflow:REJECT_DUPLICATE);

// activities.bal: the business rule here is one refund per order, so the key is derived
// from the order. The gateway deduplicates requests that carry the same key.
GatewayRequest gatewayResult = check submitRefund(refundKey(orderId), orderId, amount, reason);
```
