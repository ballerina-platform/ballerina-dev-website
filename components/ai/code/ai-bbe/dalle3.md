```
service / on new http:Listener(8080) {
    isolated resource function post greetingCard(@http:Payload GreetingDetails req) returns error? {
        final string occasion = req.occasion;
        final string specialNotes = req.specialNotes ?: "";

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

        record {|
            string|error? greetingWorker;
            string|error? imageWorker;
        |} resutls = wait {greetingWorker, imageWorker};

        string? greeting = check resutls.greetingWorker;
        string? imageURL = check resutls.imageWorker;
        if greeting !is string || imageURL !is string {
            return error("Error while generating greeting card");
        }

        // Send an email with the greeting and the image using the email connector
        gmail:MessageRequest messageRequest = {
            to: [req.recipientEmail],
            subject: req.emailSubject,
            bodyInHtml: string `<p>${greeting}</p> <br/> <img src="${imageURL}">`
        };

        gmail:Message sendResult = check gmail->/users/me/messages/send.post(messageRequest);
    }
}
```
