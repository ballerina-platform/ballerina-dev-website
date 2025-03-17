---
title: 'Concurrency simplified for AI development'
description: "Ballerina's concurrency model is ideal for writing API-powered AI applications. Its sequence diagrams and concurrency control capabilities make it easy to manage and visualize complex operations leading to more efficient and reliable AI solutions."
url: 'https://github.com/ballerina-guides/ai-samples/blob/main/create_and_send_customized_greeting_cards_using_openai/service.bal'
---
```
fork {
    // Generate greeting text and design in parallel
    worker greetingWorker returns string|error? {
        chat:CreateChatCompletionRequest request = {
            model: "gpt-4o-mini",
            messages: [
                {
                    "role": "user",
                    "content": string `Generate a greeting for a/an ${occasion}.${"\n"}Special notes: ${specialNotes}`
                }
            ]
        };

        chat:CreateChatCompletionResponse response = check openAIChat->/chat/completions.post(request);
        return response.choices[0].message.content;
    }

    worker imageWorker returns string|error? {
        images:CreateImageRequest imagePrompt = {
            prompt: string `Greeting card design for ${occasion}, ${specialNotes}`
        };
        images:ImagesResponse imageRes = check openAIImages->/images/generations.post(imagePrompt);
        return imageRes.data[0].url;
    }
}
```
