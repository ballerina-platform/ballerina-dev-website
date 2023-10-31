---
title: 'Make data extraction smarter'
description: "With Ballerina, AI integration paves the way for a transformed data extraction process, 
effortlessly unlocking the doors to valuable insights with precision and simplicity.
"
url: 'https://github.com/ShammiL/ETL-code-samples/blob/main/reviewSummary/main.bal'
phase: 'Extractions'
---
```
final chat:Client openAiChat = check new ({auth: {token: openAIKey}});

service /api/reviews on new http:Listener(8080) {
    resource function post summary(SummaryRequest summaryRequest) returns error? {
        chat:CreateChatCompletionRequest request = {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: string `
                    Extract the following details in JSON from the reviews given.
                        {
                            good_points: string,
                            bad_points: string,
                            improvement_points: string
                        }
                    The fields should contain points extracted from all reviews
                    Here are the reviews:
                    ${string:'join(",", ...summaryRequest.reviews)}
                    `
                }
            ]
        };
        do {
            chat:CreateChatCompletionResponse SummaryResponse = check openAiChat->/chat/completions.post(request);
            if SummaryResponse.choices.length() < 1 {
                check error("No summary received.");
            }
            string content = check SummaryResponse.choices[0].message?.content.ensureType(string);
            io:println(content);
        } on fail error e {
            io:println(e.message());
        }
    }
}
```