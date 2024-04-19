---
title: 'Refining data excellence'
description: "Ballerina's seamless integration with AI models enhances error correction, ensuring data integrity and precision during transformation."
url: 'https://github.com/ballerina-guides/etl-samples/blob/main/refine-data-using-ai/main.bal'
phase: 'Transformations'
---
```
configurable string openAIToken = ?;
final http:Client openAIClient = check new ("https://api.openai.com", {auth: {token: openAIToken}});

public function main(string filePath) returns error? {
    string inputString = check io:fileReadString(filePath);

    OpenAiChatResponse response = check openAIClient->/v1/chat/completions.post(
        {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: "Fix grammar and spelling mistakes."
                },
                {
                    role: "user",
                    content: inputString
                }
            ]
        }
    );

    io:println(string `Corrected: ${response.choices[0].message.content}`);
}
```
