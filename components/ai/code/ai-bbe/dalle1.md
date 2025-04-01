```
public function main() returns error? {
    chat:CreateChatCompletionRequest request = {
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: [
                    {
                        'type: "text",
                        text: "What is in this image?"
                    },
                    {
                        'type: "image_url",
                        image_url: {
                            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
                        }
                    }
                ]
            }
        ]
    };
    chat:CreateChatCompletionResponse completionRes = check openAIChat->/chat/completions.post(request);

    string content = check completionRes.choices[0].message.content.ensureType();
    io:println("Photo Description: ", content);   
}
```
