```
public function main(string filePath) returns error? {
    text:Client openaiText = check new ({auth: {token: openAIToken}});

    string fileContent = check io:fileReadString(filePath);
    io:println(string `Content: ${fileContent}`);

    text:CreateCompletionRequest textPrompt = {
        prompt: string `Summarize:\n" ${fileContent}`,
        model: "text-davinci-003",
        max_tokens: 2000
    };
    text:CreateCompletionResponse completionRes = 
        check openaiText->/completions.post(textPrompt);
    string summary = <string>completionRes.choices[0].text;
    io:println(string `Summary: ${summary}`);
}
```