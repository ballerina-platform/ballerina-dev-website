import ballerina/http;

type ReimbursementRequest record {|
    string employee_id;
    string reason;
    string amount;
|};

type TraceId record {|
    string id;
|};

final http:Client internalClient = check new ("http://api.internal.balmock.io");
final http:Client logClient = check new ("http://api.internal-log.balmock.io");
const HISTORY_HEADER = "x-message-history";

service /finance on new http:Listener(8080) {
    resource function post reimburse(ReimbursementRequest request) returns http:Response|error {
        http:Response response = check internalClient->post("/reimbursements", request);
        http:Response outbound = new;
        outbound.setPayload(check response.getJsonPayload());
        outbound.statusCode = response.statusCode;

        string traceId = check logAndGetTraceId(request);
        if response.hasHeader(HISTORY_HEADER) {
            string existingHeader = check response.getHeader(HISTORY_HEADER);
            outbound.setHeader(HISTORY_HEADER, existingHeader + ";" + traceId);
        } else {
            outbound.setHeader(HISTORY_HEADER, traceId);
        }
        return outbound;
    }
}

function logAndGetTraceId(anydata message) returns string|error {
    TraceId traceId = check logClient->post("/log_message", message);
    return traceId.id;
}
