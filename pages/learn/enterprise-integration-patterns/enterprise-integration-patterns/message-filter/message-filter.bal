import ballerina/http;

type Ticket record {|
    string id;
    string url;
    string subject;
    HIGH_PRIORITY|MEDUIM_PRIORITY|LOW_PRIORITY priority;
|};

const HIGH_PRIORITY = 1;
const MEDUIM_PRIORITY = 2;
const LOW_PRIORITY = 3;

final http:Client notificationChannel = check new ("http://api.notification.channel.com.balmock.io");

service /api/v1 on new http:Listener(8080) {
    
    resource function post ticket(Ticket ticket) returns error? {
        if ticket.priority == 1 {
            _ = check notificationChannel->/email/notify.post(ticket, targetType = http:Response);
        }
    }
}
