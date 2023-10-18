import ballerina/http;

type SurveyUpdateRequest record {
    string title;
    string from_template_id;
    boolean footer;
    string folder_id;
    int theme_id;
};

final http:Client surveyMonkey = check new ("http://api.surveymonkey.com/v3/surveys");

public function main() returns error? {
    SurveyUpdateRequest message = {
        title: "Customer Satisfaction Survey 2023",
        from_template_id: "customer_satisfaction_template_7",
        footer: true,
        folder_id: "customer_satisfaction",
        theme_id: 789
    };
    _ = check surveyMonkey->/v3/surveys/["1267"].put(message, targetType = http:Response);
}
