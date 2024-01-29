---
title: 'Refining data excellence'
description: "Ballerina's seamless integration with AI models enhances error correction, ensuring data integrity and precision during transformation."
url: 'https://github.com/ballerina-guides/ai-samples/blob/main/correct_grammar_and_spelling_in_text_using_openai/main.bal'
phase: 'Transformations'
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
    string? text = editRes.choices[0].text;

    if text is () { 
        return error("Failed to correct grammar and spelling in the given text.");
    }
    io:println(string `Corrected: ${text}`);
}
```
