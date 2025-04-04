```
public function main() returns error? {
    ParamterSchema param = {
        'type: "object",
        properties: {
            "location": {
                'type: "string",
                description: "City and country e.g. Bogotá, Colombia"
            }
        },
        required: ["location"],
        additionalProperties: false
    };
    chat:CreateChatCompletionRequest request = {
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: string `What is the weather like in Paris today?`
            }
        ],
        tools: [
        {
            'type: "function",
            'function: {
                name: "get_weather",
                description: "Get current temperature for a given location.",
                parameters: param,
                strict: true
            }
        }
        ]
    };
    chat:CreateChatCompletionResponse completionRes = check openAIChat->/chat/completions.post(request);

    chat:ChatCompletionMessageToolCalls toolCalls = check completionRes.choices[0].message.tool_calls.ensureType();
    io:println("Tool Calls: ", toolCalls);
}
```
