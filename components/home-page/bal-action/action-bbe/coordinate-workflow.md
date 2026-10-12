@workflow:Workflow
function purchaseWorkflow(workflow:Context ctx, PurchaseRequest request)
        returns string|error {
    Approval decision = check ctx->awaitHumanTask("approvePurchase",
        {requestId: request.requestId, item: request.item,
            amount: request.amount},
        userRoles = "MANAGER",
        title = string `Approve purchase ${request.requestId}`,
        description = "Review the purchase request.");
    if !decision.approved {
        return string `Purchase ${request.requestId} rejected: ${decision.comment}`;
    }
    string reference = check ctx->callActivity(processPurchase,
        {"requestId": request.requestId});
    return string `Purchase ${request.requestId} processed: ${reference}`;
}
