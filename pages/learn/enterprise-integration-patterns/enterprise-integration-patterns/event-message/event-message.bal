import ballerina/http;
import ballerina/mime;
import ballerina/url;

type IncidentRequest record {
    string phoneNo;
    Incident incident;
};

type Incident record {|
    string description;
    string date;
    string time;
|};

const FROM_NO = "+15005550006";
const API_VERSION = "2010-04-01";
const TWILIO_SID = "VBC1849a56d52g41s4b2b2cc004c0027aa8";

final http:Client twilio = check new ("http://api.twilio.com.balmock.io");

service /api/v1 on new http:Listener(8080) {
    resource function post incidents(IncidentRequest req) returns error? {
        string body = string `Incident ${req.incident.description} reported: 
                              ${req.incident.date} at ${req.incident.time}.`;
        http:Request twilioReq = new;
        string payload = "From=" + check url:encode(FROM_NO, "utf-8") +
                         "&To=" + check url:encode(req.phoneNo, "utf-8") +
                         "&Body=" + check url:encode(body, "utf-8");
        twilioReq.setTextPayload(payload, contentType = mime:APPLICATION_FORM_URLENCODED);
        _ = check twilio->/[API_VERSION]/Accounts/[TWILIO_SID]/Messages\.json.post(twilioReq,
            targetType = http:Response);
    }
}
