---
lang: ballerina
---
```
// ... imports, model (an ai:ModelProvider), orderApi, Order, and ReturnCase (see full sample)

# A customer's return request, as understood from their message.
type ReturnRequest record {|
    # The reason for the return
    "DAMAGED"|"WRONG_ITEM"|"NOT_AS_DESCRIBED"|"CHANGED_MIND" category;
    # The order ID in the format ORD-1234, only if the customer gave one
    @constraint:String {pattern: re `ORD-[0-9]{4}`}
    string orderId?;
    # A one-sentence summary for the support team
    @constraint:String {minLength: 1, maxLength: 200}
    string summary;
|};

service /support on new http:Listener(8081) {
    resource function post return\-requests(@http:Payload string message)
            returns ReturnCase|http:BadRequest|http:UnprocessableEntity|http:BadGateway {
        if message.trim().length() == 0 {
            return <http:BadRequest>{body: "message must not be empty"};
        }
        ReturnRequest|error request = natural (model) {
            Read this customer return request and classify it.
            Use only information that appears in the message.
            Message: ${message}
        };
        if request is error {                          // model call failed, or response did not fit the type
            log:printError("Could not interpret the return request", request);
            return <http:BadGateway>{body: "Could not interpret the request"};
        }
        ReturnRequest|error valid = constraint:validate(request);
        if valid is error {
            return <http:BadGateway>{body: "Could not interpret the request"};
        }
        string? orderId = valid.orderId;
        if orderId is () {
            return <http:UnprocessableEntity>{body: "Please include your order ID (ORD-1234)"};
        }
        // The type guarantees the shape. Facts are checked against the system of record.
        Order|http:ClientError 'order = orderApi->/orders/[orderId];
        if 'order is http:ClientError {
            return <http:UnprocessableEntity>{body: string `Order ${orderId} was not found`};
        }
        return {orderId, category: valid.category, summary: valid.summary,
                status: 'order.status == "DELIVERED" ? "OPEN" : "NEEDS_REVIEW"};
    }
}
```
