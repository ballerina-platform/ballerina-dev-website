```
public function main(string filePath) returns error? {
    chat:Client openAIChat = check new ({auth: {token: openAIToken}});

    string fileContent = check io:fileReadString(filePath);
    io:println(string `Content: ${fileContent}`);

    chat:CreateChatCompletionRequest request = {
        model: "gpt-4o-mini",
        messages: [
            {
                "role": "user",
                "content": string `Summarize:\n" ${fileContent}`
            }
        ],
        max_tokens: 2000
    };

    chat:CreateChatCompletionResponse response = check openAIChat->/chat/completions.post(request);
    string? summary = response.choices[0].message.content;

    if summary is () {
        return error("Failed to summarize the given text.");
    }
    io:println(string `Summary: ${summary}`);
}
```
