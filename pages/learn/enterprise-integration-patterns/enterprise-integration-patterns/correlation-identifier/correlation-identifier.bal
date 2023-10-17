import ballerina/http;
import ballerinax/kafka;

type OrderRequest record {|
    string orderId;
    string name;
    string address;
    string phoneNumber;
    OrderItem[] items;
|};

type OrderItem record {|
    string itemCode;
    int quantity;
    float unitPrice;
|};

type InvoiceDetails record {|
    string orderId;
    string invoiceId;
|};

const INVOICE_GENERATING = "INVOICE_GENERATING";
const INVOICE_GENERATED = "INVOICE_GENERATED";

type InvoiceGenerating record {|
    INVOICE_GENERATING status = INVOICE_GENERATING;
|};

type InvoiceGenerated record {|
    INVOICE_GENERATED status = INVOICE_GENERATED;
    string invoiceId;
|};

final map<InvoiceGenerating|InvoiceGenerated> processedOrders = {};

service /api/v1 on new http:Listener(8080) {

    private final kafka:Producer kafkaPublisher;

    function init() returns error? {
        self.kafkaPublisher = check new (kafka:DEFAULT_URL);
    }

    resource function post process/'order(OrderRequest orderRequest) returns error? {
        check self.kafkaPublisher->send({
            topic: "order-events",
            value: orderRequest
        });
        processedOrders[orderRequest.orderId] = {
            "status": INVOICE_GENERATING
        };
    }
}

listener kafka:Listener orderListener = new (kafka:DEFAULT_URL, {
    groupId: "order-group-id",
    topics: "invoice-events"
});

service on orderListener {
    remote function onConsumerRecord(InvoiceDetails[] invoices) returns error? {
        foreach var invoice in invoices {
            processedOrders[invoice.orderId] = {
                "status": INVOICE_GENERATED,
                "invoiceId": invoice.invoiceId
            };
        }
    }
}
