import ballerina/http;
import ballerina/lang.runtime;

enum Status {
    CREATED,
    CAPTURED,
    DENIED,
    PENDING
}

type PaypalResponse record {|
    string id;
    Status status;
    Amount amount;
    Payee payee;
|};

type Amount record {|
    string value;
    string currency_code;
|};

type Payee record {|
    string email_address;
    string merchant_id;
|};

final http:Client paypalClient = check new ("http://api-m.paypal.com.balmock.io");

service /api/v1 on new http:Listener(8080) {
    resource function get payment(string paymentId) returns string|error {
        foreach int _ in 0 ..< 10 {
            PaypalResponse response = check paypalClient->/v2/payments/authorizations/[paymentId]();
            if response.status == CREATED || response.status == PENDING {
                runtime:sleep(5); // sleep does not block the underlying thread
            } else {
                return response.status;
            }
        }
        return error("Payment timed out");
    }
}
