import ballerina/http;

type BankAccountReq record {|
    string name;
    string accountNumber;
    string routingNumber;
    string? country;
|};

type IbanRequest record {|
    "json"|"xml" format = "json";
    string country_iso;
    string nid;
|};

type IbanResponse record {
    string bank_code;
};

type BankAccount record {
    *BankAccountReq;
    string id;
    string? bankCode;
};

final http:Client iban = check new ("http://api.iban.com.balmock.io");
final http:Client intuit = check new ("http://api.intuit.com.balmock.io");

service /finance on new http:Listener(8080) {

    resource function post customers/[int id]/accounts(BankAccountReq req) returns BankAccount|error {
        IbanRequest ibanReq = {country_iso: req.country ?: "US", nid: req.accountNumber};
        IbanResponse ibanRes = check iban->/clients/api/banksuite/nid.post(ibanReq);
        return check intuit->/quickbooks/v4/customers/[id]/bank\-accounts.post({...req, bankCode: ibanRes.bank_code});
    }
}
