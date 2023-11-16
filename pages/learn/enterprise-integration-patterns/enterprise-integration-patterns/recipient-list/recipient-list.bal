import ballerina/http;

type Recipient readonly & record {|
    string recpientId;
    string catergory;
    string contact;
    "EMAIL"|"SMS"|"NOTIFICATION" subscription;
|};

type Message readonly & record {|
    string subject?;
    string body;
    string signature?;
|};

final map<Recipient[]> recipientList = {};

final http:Client emailManagerClient = check new ("http://api.email.manager.com.balmock.io");
final http:Client smsManagerClient = check new ("http://api.sms.manager.com.balmock.io");
final http:Client notificationManagerClient = check new ("http://api.notification.manager.com.balmock.io");

service /api/v1 on new http:Listener(8080) {

    resource function post quotes/[string catergory](Message message) returns error? {
        foreach var {contact, subscription} in recipientList.get(catergory) {
            match subscription {
                "EMAIL" => {
                    _ = check emailManagerClient->/send/[contact].post(message, targetType = http:Response);
                }
                "SMS" => {
                    _ = check smsManagerClient->/send/[contact].post(message, targetType = http:Response);
                }
                "NOTIFICATION" => {
                    _ = check notificationManagerClient->/send/[contact].post(message, targetType = http:Response);
                }
            }
        }
    }
}
