import ballerina/http;

type Customer record {|
    string customerId;
    string customerName;
    decimal totalEligibleClaimAmount;
|};

type ClaimRequest record {|
    string customerId;
    string policyNumber;
    decimal claimAmount;
    string accidentType;
    string claimLocation;
    ClaimDate claimDate;
|};

type ClaimDate record {|
    string year;
    string month;
    string day;
|};

type Claim record {|
    *ClaimRequest;
    "APPROVED"|"REJECTED"|"PENDING" status;
|};

type ClaimHistory record {|
    string customerId;
    Claim[] claims;
|};

final http:Client claimHistory = check new ("http://api.claimhistory.firebase.com.balmock.io");
final http:Client customerDetails = check new ("http://api.customerdetails.firebase.com.balmock.io");

service /api/v1 on new http:Listener(8080) {
    isolated resource function post claim(ClaimRequest claimRequest) returns decimal|error {
        ClaimHistory claimHostory = check claimHistory->/claims/[claimRequest.customerId]/claims\.json();
        Customer customer = check customerDetails->/customers/[claimRequest.customerId]/details\.json();
        return calculateClaimAmount(claimRequest, claimHostory, customer.totalEligibleClaimAmount);
    }
}

isolated function calculateClaimAmount(ClaimRequest claimRequest, ClaimHistory claimHistory, decimal totalElegibleAmount) returns decimal {
    decimal totalClaimedAmount = from var {claimAmount, claimDate, status} in claimHistory.claims
        where claimDate.year == claimRequest.claimDate.year && status == "APPROVED"
        collect sum(claimAmount);
    decimal remainingAmount = totalElegibleAmount - totalClaimedAmount;
    return decimal:max(remainingAmount, claimRequest.claimAmount * 0.2);
}
