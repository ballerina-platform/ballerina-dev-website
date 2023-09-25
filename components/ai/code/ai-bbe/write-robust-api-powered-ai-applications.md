---
title: 'Write robust API-powered AI applications'
description: "Take on the unpredictable world of distributed systems with the built-in language features and Ballerina library features. Writing robust API-powered AI applications is now a breeze for every developer, no matter the challenges!"
url: 'https://github.com/ballerina-guides/ai-samples/blob/main/correct_grammar_and_spelling_in_text_using_openai/main.bal'
---
```
public function main(string filePath) returns error? {
    http:RetryConfig retryConfig = {
        interval: 5, // Initial retry interval in seconds.
        count: 3, // Number of retry attempts before stopping.
        backOffFactor: 2.0 // Multiplier of the retry interval.
    };
    final text:Client openAIText = check new ({auth: {token: openAIToken}, retryConfig});

    text:CreateEditRequest editReq = {
        input: check io:fileReadString(filePath),
        instruction: "Fix grammar and spelling mistakes.",
        model: "text-davinci-edit-001"
    };
    text:CreateEditResponse editRes = check openAIText->/edits.post(editReq);
    string text = check editRes.choices[0].text.ensureType();
    io:println(string `Corrected: ${text}`);
}
```