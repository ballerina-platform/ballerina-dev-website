---
lang: ballerina
---
```
import ballerina/ai;
import ballerina/http;

service /support on new http:Listener(8080) {

    // Customer: authenticated with the customer's own JWT (scope `support:chat`).
    resource function post chat(http:Headers headers, ChatRequest req)
            returns json|http:Unauthorized|http:Forbidden|error {
        string|http:Unauthorized|http:Forbidden customerId = authenticate(headers, "support:chat");
        if customerId !is string {
            return customerId;
        }
        ai:Context ctx = new;
        ctx.set(CUSTOMER_ID, customerId);
        string sessionId = string `${customerId}:${req.sessionId}`; // scope memory to the user
        string|ai:Error answer = refundAgent.run(req.message, sessionId, ctx);
        return toResponse(customerId, answer);
    }

    // Reviewer: a different person, with scope `refunds:approve`.
    resource function post approvals/[string requestId](http:Headers headers, Decision decision)
            returns json|http:Unauthorized|http:Forbidden|http:NotFound|error {
        string|http:Unauthorized|http:Forbidden reviewerId = authenticate(headers, "refunds:approve");
        if reviewerId !is string {
            return reviewerId;
        }
        Pending? p = peekPending(requestId); // check before anything is consumed
        if p is () {
            return <http:NotFound>{};
        }
        if p.customerId == reviewerId {
            return <http:Forbidden>{body: "You cannot approve your own request."};
        }
        ai:HumanDecision & readonly outcome = decision.approved
            ? {outcome: ai:APPROVE} : {outcome: ai:REJECT, reason: decision.reason};
        ai:Context ctx = new;
        ctx.set(CUSTOMER_ID, p.customerId);
        // Resumes the paused run: issueRefund executes only on APPROVE.
        ai:Resume resume = {decisions: {[requestId]: outcome}};
        string|ai:Error answer = refundAgent.run(resume, p.sessionId, ctx);
        if answer !is ai:Error || answer is ai:ApprovalRequiredError {
            removePending(requestId); // on other errors, keep it so a reviewer can retry
        }
        return toResponse(p.customerId, answer);
    }
}

isolated function toResponse(string customerId, string|ai:Error answer) returns json|error {
    if answer is ai:ApprovalRequiredError {
        // Nothing has executed. Park the proposed calls for a reviewer.
        ai:ApprovalRequest[] requests = answer.detail().requests;
        park(customerId, requests);
        return {status: "PENDING_APPROVAL", requests: requests.toJson()};
    }
    return {reply: check answer};
}
```
