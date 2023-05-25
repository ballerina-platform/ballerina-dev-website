---
title: 'Concurrency simplified for AI development'
description: "Ballerina's concurrency model is ideal for writing API-powered AI applications. Its sequence diagrams and concurrency control capabilities make it easy to manage and visualize complex operations leading to more efficient and reliable AI solutions."
url: 'https://github.com/ballerina-guides/ai-samples/blob/main/create_and_send_customized_greeting_cards_using_openai/service.bal'
---
```
fork {
    // Generate greeting text and design in parallel
    worker greetingWorker returns string|error? {
        string prompt = 
            string `Generate a greeting for a/an ${occasion}
                .${"\n"}Special notes: ${specialNotes}`;
        text:CreateCompletionRequest textPrompt = {
            prompt,
            model: "text-davinci-003",
            max_tokens: 100
        };
        text:CreateCompletionResponse completionRes = 
            check openaiText->/completions.post(textPrompt);
        return completionRes.choices[0].text;
    }
    worker imageWorker returns string|error? {
        string prompt = string `Greeting card design for ${occasion}, ${specialNotes}`;
        images:CreateImageRequest imagePrompt = {
            prompt
        };
        images:ImagesResponse imageRes = 
            check openaiImages->/images/generations.post(imagePrompt);
        return imageRes.data[0].url;
    }
}
```