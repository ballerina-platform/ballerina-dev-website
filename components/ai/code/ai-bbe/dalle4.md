```
public function main(*EmailDetails emailDetails) returns error? {

    fork {
        worker poemWorker returns string|error? {
            chat:CreateChatCompletionRequest request = {
                model: "gpt-4o-mini",
                messages: [
                    {
                        "role": "user",
                        "content": string `Generate a creative poem on the topic ${emailDetails.topic}.`
                    }
                ],
                max_tokens: 1000
            };

            chat:CreateChatCompletionResponse response = check openAIChat->/chat/completions.post(request);
            return response.choices[0].message.content;
        }

        worker imageWorker returns byte[]|error {
            stabilityai:TextToImageRequestBody payload = {text_prompts: [{"text": emailDetails.topic, "weight": 1}]};
            stabilityai:ImageRes listResult = check stabilityAI->/v1/generation/["stable-diffusion-512-v2-1"]/text\-to\-image.post(payload);

            string? imageBytesString = listResult.artifacts[0].'base64;
            if imageBytesString is () {
                return error("Image byte string is empty.");
            }
            byte[] imageBytes = imageBytesString.toBytes();
            var decodedImage = check mime:base64Decode(imageBytes);
            if decodedImage !is byte[] {
                return error("Error in decoding the image byte string.");
            }
            return decodedImage;
        }
    }

    record {|
        string|error? poemWorker;
        byte[]|error imageWorker;
    |} results = wait {poemWorker, imageWorker};

    string? poem = check results.poemWorker;
    byte[]? image = check results.imageWorker;
    if poem !is string || image !is byte[] {
        return error("Error while generating the poem and the image.");
    }

    io:Error? fileWrite = io:fileWriteBytes("./image.png", image);
    if fileWrite is io:Error {
        return error("Error while writing the image to a file.");
    }

    string messageBody = poem.trim();
    string:RegExp r = re `\n`;
    messageBody = r.replaceAll(messageBody, "<br>");

    gmail:MessageRequest messageRequest = {
        to: [emailDetails.recipientEmail],
        subject: emailDetails.topic,
        bodyInHtml: messageBody,
        inlineImages: [{path: "./image.png", mimeType: "image/png", name: "dew", contentId: "fwes"}]
    };

    gmail:Message sendResult = check gmail->/users/me/messages/send.post(messageRequest);
    io:println(sendResult);
}
```
