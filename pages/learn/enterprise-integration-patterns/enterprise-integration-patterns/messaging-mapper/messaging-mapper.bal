import ballerina/graphql;
import ballerina/uuid;

public type Item record {|
    string code;
    int quantity;
    decimal unitPrice;
|};

public type PurchasingRequest record {|
    string customerId;
    string agentId;
    Item[] items;
|};

public type Invoice record {|
    *PurchasingRequest;
    readonly string invoiceId;
    decimal total;
|};

final table<Invoice> key(invoiceId) invoices = table [];

service /api/v1 on new graphql:Listener(8080) {

    resource function get invoice(string invoiceId) returns Invoice? {
        return invoices[invoiceId];
    }

    remote function createInvoice(PurchasingRequest purchasingRequest) returns Invoice {
        Invoice invoice = {
            ...purchasingRequest,
            invoiceId: uuid:createType1AsString(),
            total: from var {unitPrice, quantity} in purchasingRequest.items
                   let var itemTotalPrice = unitPrice * quantity
                   collect sum(itemTotalPrice)
        };
        invoices.add(invoice);
        return invoice;
    }
}
