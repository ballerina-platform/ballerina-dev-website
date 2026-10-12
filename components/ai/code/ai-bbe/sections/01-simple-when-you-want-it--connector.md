---
lang: ballerina
---
```
import ballerinax/openai.chat;

final chat:Client openAiChat = check new ({auth: {token: openAiApiKey}});

// Provider-specific: ask the OpenAI Chat Completions API for token log probabilities,
// which the provider-neutral ai:ModelProvider interface does not expose.
isolated function intentWithLogprobs(string body) returns chat:CreateChatCompletionResponse|error {
    return openAiChat->/chat/completions.post({
        model: "gpt-4o-mini",
        messages: [
            {role: "system", content: "Reply with one word: ORDER_STATUS, CANCEL_ORDER, REFUND, or OTHER."},
            {role: "user", content: body}
        ],
        logprobs: true,
        top_logprobs: 3,
        max_completion_tokens: 5
    });
}

// ballerinax/openai.chat 5.x is generated from the OpenAI API specification, so request
// and response fields are typed. ballerinax/openai.audio, openai.images, openai.responses,
// and azure.openai.chat cover other provider APIs.
```
