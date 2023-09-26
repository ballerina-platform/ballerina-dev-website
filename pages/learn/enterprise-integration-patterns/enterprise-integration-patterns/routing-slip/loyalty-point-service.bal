import ballerina/http;

type Request record {|
    string storeCode;
    string mobileNumber;
    string[] routingSlip;
|};

type Points record {|
    float loyaltyPoints = 0.0;
    float mobilePoints = 0.0;
    float crypto = 0.0;
|};

service /loyaltyPoints on new http:Listener(8081) {
    resource function post points(Request request) returns Points|error {
        Points totalPoints = {};
        foreach string process in request.routingSlip {
            match process {
                "CustomerLoyaltyPoints" => {
                    totalPoints.loyaltyPoints = check getShopLoyaltiPoints(request);
                }
                "MobilePoints" => {
                    totalPoints.mobilePoints = check getMobilePoints(request);
                }
                "Crypto" => {
                    totalPoints.crypto = check getCrypto(request);
                }
            }
        }
        return totalPoints;
    }
}

function getShopLoyaltiPoints(Request request) returns float|error {
    http:Client openLoyalty = check new ("http://openloyalty.customer.com.balmock.io");
    record {float loyaltyPoints;} points = check openLoyalty->/api/[request.storeCode]/redemption/[request.mobileNumber].get();
    return points.loyaltyPoints;
}

function getMobilePoints(Request request) returns float|error {
    http:Client mobPoints = check new ("http://mob.points.com.balmock.io");
    record {float mobilePoints;} points = check mobPoints->/api/[request.mobileNumber]/redemption.get();
    return points.mobilePoints;
}

function getCrypto(Request request) returns float|error {
    http:Client crypto = check new ("http://crypto.com.balmock.io");
    record {float crypto;} points = check crypto->/api/[request.mobileNumber].get();
    return points.crypto;
}
