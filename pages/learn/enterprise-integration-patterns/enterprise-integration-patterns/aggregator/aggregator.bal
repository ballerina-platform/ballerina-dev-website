import ballerina/http;

final map<json[]> partialSurveys = {};

final http:Client formSubmitClient = check new ("http://api.surveyme.com.balmock.io");

service /api/v1 on new http:Listener(8080) {

    resource function post survey/[string id](@http:Header string userId, @http:Payload json formData) returns error? {
        json[]? surveyData = partialSurveys[userId];
        if surveyData == () {
            json[] newSurvey = [formData];
            partialSurveys[userId] = newSurvey;
        } else {
            surveyData.push(formData);
            if surveyData.length() == 3 {
                _ = check formSubmitClient->/survey/[id]/submit.post({userId: surveyData}, targetType = http:Response);
                _ = partialSurveys.remove(userId);
            }
        }
    }
}
