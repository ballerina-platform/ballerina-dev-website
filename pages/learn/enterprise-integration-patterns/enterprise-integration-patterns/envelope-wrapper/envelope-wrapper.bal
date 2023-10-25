import ballerina/http;

type RefundRequest record {|
    string request_id;
    string email;
    string client_id;
    string capture_id;
|};

type PaypalRespose record {|
    string status;
    string message;
|};

final http:Client paypalClient = check new ("http://api-m.sandbox.paypal.com.balmock.io");
final string encodedHeader = {alg: "none"}.toString().toBytes().toBase64();

service /paypal on new http:Listener(8080) {
    resource function post refund(RefundRequest refundReq) returns PaypalRespose|error {
        // Generate PayPal-Auth-Assertion.
        string authAssertionValue = getAuthAssertionValue(refundReq.client_id, refundReq.email);

        http:Request request = new;
        request.addHeader("PayPal-Request-Id", refundReq.request_id);
        request.addHeader("PayPal-Auth-Assertion", authAssertionValue);
        return paypalClient->/v2/payments/captures/[refundReq.capture_id]/refund.post(request);
    }
}

isolated function getAuthAssertionValue(string client_id, string email) returns string {
    map<string> payload = {
        iss: client_id,
        payer_id: email
    };
    string encodedPayload = payload.toString().toBytes().toBase64();
    return string `${encodedHeader}.${encodedPayload}.`;
}
