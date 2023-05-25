```
type GreetingDetails record {|
    string occasion;
    string recipientEmail;
    string emailSubject;
    string specialNotes?;
|};

service / on new http:Listener(8080) {
    resource function post greetingCard(@http:Payload GreetingDetails req) returns error? {
        string occasion = req.occasion;
        string specialNotes = req.specialNotes ?: "";

        fork {
            // Generate greeting text and design in parallel
            worker greetingWorker returns string|error? {
                text:CreateCompletionRequest textPrompt = {
                    prompt: string `Generate a greeting for a/an ${
                                    occasion}.${"\n"}Special notes: ${specialNotes}`,
                    model: "text-davinci-003",
                    max_tokens: 100
                };
                text:CreateCompletionResponse completionRes = 
                    check openAIText->/completions.post(textPrompt);
                return completionRes.choices[0].text;
            }
            worker imageWorker returns string|error? {
                images:CreateImageRequest imagePrompt = {
                    prompt: string `Greeting card design for ${occasion}, ${
                                    specialNotes}`
                };
                images:ImagesResponse imageRes = 
                    check openAIImages->/images/generations.post(imagePrompt);
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
            recipient: req.recipientEmail,
            subject: req.emailSubject,
            messageBody: string `<p>${greeting}</p> <br/> <img src="${imageURL}">`,
            contentType: gmail:TEXT_HTML
        };
        _ = check gmail->sendMessage(messageRequest, userId = "me");
    }
}
```