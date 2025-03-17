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
    final chat:Client openAIChat = check new ({auth: {token: openAIToken}, retryConfig});

    chat:CreateChatCompletionRequest request = {
        model: "gpt-4o-mini",
        messages: [
            {
                "role": "user",
                "content": string `Fix grammar and spelling mistakes of the content ${check
                io:fileReadString(filePath)}`
            }
        ]
    };

    chat:CreateChatCompletionResponse response = check openAIChat->/chat/completions.post(request);
    string text = check response.choices[0].message.content.ensureType();
    io:println(string `Corrected: ${text}`);
}
```
