import ballerina/http;
import ballerina/io;

public type ActivateLine readonly & record {|
    string customerId;
    string phoneNumber;
    "NEW ACTIVATION"|"TRANSFER" activationType;
    string planCode;
    string activationDate;
|};

type ActivationResponse readonly & record {|
    string phoneNumber;
    "REJECTED"|"APPROVED" status;
|};

type ActivationSuccess readonly & record {|
    string phoneNumber;
|};

type ActivationFailureError error;

public class LineConnectionManager {

    private final http:Client lineClinet;

    public function init() returns error? {
        self.lineClinet = check new ("http://api.telcox.com.balmock.io");
    }

    public function activateLine(ActivateLine activateLine) returns ActivationSuccess|ActivationFailureError {
        ActivationResponse|error activationResponse =
            self.lineClinet->/plans/[activateLine.planCode]/activate.post(activateLine);
        if activationResponse is error || activationResponse.status == "REJECTED" {
            return error("Connection activation failure", phoneNumber = activateLine.phoneNumber);
        }
        return {phoneNumber: activateLine.phoneNumber};
    }
}

public function main() returns error? {
    ActivateLine activateLine = {
        customerId: "USER-USW-0012300912",
        phoneNumber: "555-555-5555",
        activationType: "NEW ACTIVATION",
        planCode: "PLN123",
        activationDate: "2023-09-19"
    };

    LineConnectionManager lineConnectionManager = check new;
    ActivationSuccess|ActivationFailureError activateLineResult = lineConnectionManager.activateLine(activateLine);
    io:println(activateLineResult);
}
