import ballerina/http;

final map<json[]> partialSurveys = {};

final http:Client formSubmitClient = check new ("http://api.survayme.com.balmock.io");

service /api/v1 on new http:Listener(8080) {

    resource function post survay/[string id](@http:Header string userId, @http:Payload json formData) returns error? {
        json[]? survayData = partialSurveys[userId];
        if survayData == () {
            json[] newSurvay = [formData];
            partialSurveys[userId] = newSurvay;
        } else {
            survayData.push(formData);
            if survayData.length() == 3 {
                _ = check formSubmitClient->/survay/[id]/submit.post({userId: survayData}, targetType = http:Response);
                _ = partialSurveys.remove(userId);
            }
        }
    }
}
