import ballerina/http;

type PaymentRequest record {|
    string mobileNumber;
    string customerName;
    float totalAmount;
    string storeCode;
    record {}[] items;
|};

type PaymentStatus record {|
    string status;
    record {
        float totalPoints;
        float redeemedAmount;
        float totalAmount;
    } details;
|};

type Message record {|
    *PaymentRequest;
    string storeCode;
    string[] routingSlip = [];
|};

type Points record {
    float loyaltyPoints = 0.0;
    float mobilePoints = 0.0;
};

service /api/v1 on new http:Listener(8080) {
    resource function post payments(PaymentRequest request) returns PaymentStatus|error {
        string[] routingSlip = check lookupMessageSlip(request);
        Message message = {...request, routingSlip: routingSlip};
        Points points = {};
        if message.routingSlip.length() > 0 {
            http:Client pointHandler = check new ("http://localhost:8081/loyaltyPoints");
            json payload = {
                storeCode: message.storeCode,
                mobileNumber: message.mobileNumber,
                routingSlip: message.routingSlip
            };
            points = check pointHandler->/points.post(payload);
        }
        return checkout(message, points);
    }
}

function checkout(Message message, Points points) returns PaymentStatus {
    float totalPoints = points.loyaltyPoints + points.mobilePoints;
    return {
        status: "SUCCESS",
        details: {
            totalPoints: totalPoints,
            redeemedAmount: totalPoints * 50,
            totalAmount: message.totalAmount - (totalPoints * 50)
        }
    };
}

function lookupMessageSlip(PaymentRequest request) returns string[]|error {
    http:Client openLoyalty = check new ("http://openloyalty.com.balmock.io");
    anydata|error customer = openLoyalty->/api/[request.storeCode]/member/'check/get();
    string[] routingSlip = [];
    if customer is anydata {
        routingSlip.push("CustomerLoyaltyPoints");
    }
    if check isRegisteredToPointsService(request.mobileNumber) {
        routingSlip.push("MobilePoints");
    }
    return routingSlip;
}

function isRegisteredToPointsService(string mobileNumber) returns boolean|error {
    http:Client openLoyalty = check new ("http://mob.points.hub.com.balmock.io");
    anydata|error memberCheck = openLoyalty->/api/[mobileNumber]/member/'check/get();
    return memberCheck is error ? false : true;
}
