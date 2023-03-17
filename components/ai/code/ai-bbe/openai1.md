```
text:Client openaiText = check new ({auth: {token: openAIToken}});
string fileContent = check io:fileReadString(filePath);
io:println(string `Content: ${fileContent}`);

string prompt = string `Summarize:\n" ${fileContent}`;
text:CreateCompletionRequest textPrompt = {
    prompt: prompt,
    model: "text-davinci-003",
    max_tokens: 2000
};
text:CreateCompletionResponse completionRes = check openaiText->/completions.post(textPrompt);
string summary = <string>completionRes.choices[0].text;
io:println(string `Summary: ${summary}`);
```