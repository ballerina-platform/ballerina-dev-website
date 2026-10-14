import ballerina/http;
import ballerina/io;
import ballerina/workflow;

type PurchaseRequest record {|
    string requestId;
    string item;
    decimal amount;
|};

type Approval record {|
    boolean approved;
    string comment;
|};

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

@workflow:Activity
function processPurchase(string requestId) returns string|error {
    io:println("Processing approved purchase ", requestId);
    return string `PO-${requestId}`;
}

service /purchases on new http:Listener(8080) {
    resource function post .(PurchaseRequest request) returns json|error {
        string workflowId = check workflow:run(purchaseWorkflow, request);
        return {requestId: request.requestId, workflowId,
            status: "PENDING_APPROVAL"};
    }
}
