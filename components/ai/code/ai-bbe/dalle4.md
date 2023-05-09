```
public function main(*EmailDetails emailDetails) returns error? {
    fork {
        worker poemWorker returns string|error? {
            text:CreateCompletionRequest textPrompt = {
                prompt: string `Generate a creative poem on the topic ${emailDetails.topic}.`,
                model: "text-davinci-003",
                max_tokens: 1000
            };
            text:CreateCompletionResponse completionRes = 
                check openAIText->/completions.post(textPrompt);
            return completionRes.choices[0].text;
        }

        worker imageWorker returns byte[]|error {
            stabilityai:TextToImageRequestBody payload = 
                {text_prompts: [{"text": emailDetails.topic, "weight": 1}]};
            stabilityai:ImageRes listResult = 
                check stabilityAI->/v1/generation/stable\-diffusion\-v1/
                text\-to\-image.post(payload);
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
        recipient: emailDetails.recipientEmail,
        subject: emailDetails.topic,
        messageBody,
        contentType: gmail:TEXT_HTML,
        inlineImagePaths: [{imagePath: "./image.png", mimeType: "image/png"}]
    };
    _ = check gmail->sendMessage(messageRequest, userId = "me");
}
```