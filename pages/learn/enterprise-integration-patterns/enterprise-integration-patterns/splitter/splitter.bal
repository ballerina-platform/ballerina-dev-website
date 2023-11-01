import ballerina/http;
import ballerina/mime;
import ballerina/url;

type ReminderRequest record {
    string date;
    Event[] events;
};

type Event record {|
    string eventName;
    Attendee[] attendees;
|};

type Attendee record {|
    string name;
    string number;
|};

const FROM_NO = "+15005550006";
const TWILIO_SID = "VAC1829a53d52f41b4b2b1cc003c0026aa8";
const API_VERSION = "2010-04-01";

final http:Client twilio = check new ("http://api.twilio.com.balmock.io");

service /api/v1 on new http:Listener(8080) {
    resource function post reminders(ReminderRequest request) returns error? {
        foreach var event in request.events {
            foreach var attendee in event.attendees {
                check sendReminder(attendee, event.eventName, request.date);
            }
        }
    }
}

function sendReminder(Attendee attendee, string eventName, string date) returns error? {
    string body = string `Hi ${attendee.name}, looking forward to meet you at the ${eventName} on ${date}`;
    string payload = "From=" + check url:encode(FROM_NO, "utf-8") +
                     "&To=" + check url:encode(attendee.number, "utf-8") +
                     "&Body=" + check url:encode(body, "utf-8");
    http:Request twilioReq = new;
    twilioReq.setTextPayload(payload, contentType = mime:APPLICATION_FORM_URLENCODED);
    _ = check twilio->/[API_VERSION]/Accounts/[TWILIO_SID]/Messages\.json.post(twilioReq, targetType = http:Response);
}
