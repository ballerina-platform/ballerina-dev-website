import ballerina/http;
import ballerina/io;
import ballerina/workflow;
import ballerina/workflow.management;

type Claim record {|
    string claimId;
    string policyNo;
    decimal amount;
|};

type ApprovalDecision record {|
    boolean approved;
    string comment;
|};

@workflow:Workflow
function claimApprovalWorkflow(workflow:Context ctx, Claim claim) returns string|error {
    boolean verified = check ctx->callActivity(verifyClaim, {"claim": claim});
    if !verified {
        return string `Claim ${claim.claimId} was rejected during verification.`;
    }
    ApprovalDecision decision = check ctx->awaitHumanTask("approveClaim", "MANAGER",
            payload = {claimId: claim.claimId, policyNo: claim.policyNo, amount: claim.amount},
            title = string `Approve claim ${claim.claimId}`,
            description = "Review the claim and approve or reject the payment.");
    if !decision.approved {
        return string `Claim ${claim.claimId} rejected by manager: ${decision.comment}`;
    }
    string paymentRef = check ctx->callActivity(makePayment, {"claimId": claim.claimId, "amount": claim.amount});
    return string `Claim ${claim.claimId} approved. Payment reference: ${paymentRef}`;
}

@workflow:Activity
function verifyClaim(Claim claim) returns boolean|error {
    io:println(string `Verifying claim ${claim.claimId} against policy ${claim.policyNo}`);
    return claim.amount <= 1000.0d;
}

@workflow:Activity
function makePayment(string claimId, decimal amount) returns string|error {
    io:println(string `Paying ${amount} for claim ${claimId}`);
    return string `PAY-${claimId}`;
}

service /claims on new http:Listener(8080) {

    resource function post .(Claim claim) returns json|error {
        string workflowId = check workflow:run(claimApprovalWorkflow, claim);
        return {claimId: claim.claimId, workflowId, status: "PENDING_APPROVAL"};
    }

    resource function get [string workflowId]() returns json|error {
        // Check the status first instead of blocking on the result:
        // getWorkflowResult waits until the workflow completes.
        management:WorkflowExecutionInfo info = check management:getWorkflowInfo(workflowId);
        if info.status != "COMPLETED" {
            return {workflowId, status: info.status};
        }
        anydata result = check workflow:getWorkflowResult(workflowId);
        return {workflowId, status: info.status, result: check result.cloneWithType(json)};
    }
}
