import ballerina/http;

public type SalesData record {|
    Customer customer;
    Oppotunity[] opportunities;
|};

public type Customer record {|
    string id;
    string name;
    string email;
|};

public type Oppotunity record {|
    string id;
    decimal amount;
    string closeDate;
|};

public type QuickBooksInvoice record {|
    string customerId;
    Invoice[] invoices;
|};

public type Invoice record {|
    string id;
    decimal amount;
    string invoiceDate;
|};

final http:Client quickBooks = check new ("http://api.quickbooks.com.balmock.io");

service /api/v1/analytics on new http:Listener(8080) {

    resource function post sales(SalesData salesData) returns error? {
        QuickBooksInvoice quickBooksInvoice = translate(salesData);
        _ = check quickBooks->/v3/company/REALM012/invoice.post(quickBooksInvoice, targetType = http:Response);
    }
}

function translate(SalesData salesData) returns QuickBooksInvoice {
    return {
        customerId: salesData.customer.id,
        invoices: from var oppotunity in salesData.opportunities
                  select {
                      id: oppotunity.id,
                      amount: oppotunity.amount,
                      invoiceDate: oppotunity.closeDate
                  }
    };
}
