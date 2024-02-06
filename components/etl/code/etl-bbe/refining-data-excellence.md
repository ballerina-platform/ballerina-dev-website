---
title: 'Refining data excellence'
description: "Ballerina's seamless integration with AI models enhances error correction, ensuring data integrity and precision during transformation."
url: 'https://github.com/ballerina-guides/ai-samples/blob/main/correct_grammar_and_spelling_in_text_using_openai/main.bal'
phase: 'Transformations'
---
```
configurable string openAIToken = ?;

final text:Client openAIText = check new ({auth: {token: openAIToken}});

public function main(string filePath) returns error? {
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
