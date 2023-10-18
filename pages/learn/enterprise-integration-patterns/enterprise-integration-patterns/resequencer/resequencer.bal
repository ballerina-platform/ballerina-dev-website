import ballerina/http;

type Approval record {
    TEAM_LEAD|MANAGER|SENIOR_MANAGER leadLevel;
    int score;
    int nextPromotionLevel;
};

const TEAM_LEAD = 1;
const MANAGER = 2;
const SENIOR_MANAGER = 3;

final map<Approval[]> incompleteApprovals = {};

final http:Client hrClient = check new ("http://api.wso2hr.com.balmock.io");

service /api/v1 on new http:Listener(8080) {

    resource function post employees/[string emoloyeeId]/approval(Approval approvalReq) returns error? {
        Approval[]? approvals = incompleteApprovals[emoloyeeId];
        if approvals == () {
            incompleteApprovals[emoloyeeId] = [approvalReq];
            return;
        }
        approvals.push(approvalReq);
        if approvals.length() < 3 {
            return;
        }
        from Approval approval in approvals
        order by approval.leadLevel
        do {
            _ = check hrClient->/promotions/employees/[emoloyeeId]/approval.post(approval, targetType = json);
        };
        _ = incompleteApprovals.remove(emoloyeeId);
    }
}
