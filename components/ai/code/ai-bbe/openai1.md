```
public function main(string filePath) returns error? {
    text:Client openAIText = check new ({auth: {token: openAIToken}});

    string fileContent = check io:fileReadString(filePath);
    io:println(string `Content: ${fileContent}`);

    text:CreateCompletionRequest textPrompt = {
        prompt: string `Summarize:\n" ${fileContent}`,
        model: "text-davinci-003",
        max_tokens: 2000
    };
    text:CreateCompletionResponse completionRes = 
        check openAIText->/completions.post(textPrompt);
    string? summary = completionRes.choices[0].text;

    if summary is () { 
        return error("Failed to summarize the given text.");    
    } 
    io:println(string `Summary: ${summary}`);
}
```