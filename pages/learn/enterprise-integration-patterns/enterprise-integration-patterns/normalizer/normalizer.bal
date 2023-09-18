import ballerina/http;

type ZendeskResponse record {
    record {|
        string url;
        int id;
        string subject;
    |} ticket;
};

final http:Client zendeskClient = check new ("http://api.zendesk.com.balmock.io");

service /api/v1 on new http:Listener(8080) {

    resource function post ticket(@http:Payload json|xml request) returns string|error {
        json normalizedRequest;
        if request is json {
            normalizedRequest = normalize(check request.subject, check request.comment);
        } else {
            normalizedRequest = normalize((request/<subject>).data(), (request/<comment>).data());
        }
        ZendeskResponse zendeskResponse = check zendeskClient->/api/v2/tickets.post(normalizedRequest);
        return zendeskResponse.ticket.url;
    }
}

function normalize(string subject, string comment) returns json {
    return {
        ticket: {
            subject,
            comment: {
                body: comment
            }
        }
    };
}
