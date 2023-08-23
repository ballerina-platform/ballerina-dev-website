import ballerina/http;

type DetailedReimbursementTemplate record {
    string reimbursementTypeID;
    string reimbursementTypeName;
    float fixedAmount;
};

type ReimbursementTemplate record {
    string reimbursementTypeID;
    float fixedAmount;
};

type Reimbursement record {
    string id;
    record {
        string reimbursementTypeID;
        float fixedAmount;
    }[] reimbursementTemplates;
};

service /payroll on new http:Listener(8080) {

    resource function post employees/[string id]/paytemplate/reimbursements(DetailedReimbursementTemplate[] templates) returns Reimbursement|error {
        http:Client xero = check new ("http://api.xero.com.balmock.io");
        ReimbursementTemplate[] reimbursementRequests = from var {reimbursementTypeID, fixedAmount} in templates
                                                        select {reimbursementTypeID, fixedAmount};
        return xero->/payrollxro/employees/[id]/paytemplate/reimbursements.post(reimbursementRequests);
    }
}
