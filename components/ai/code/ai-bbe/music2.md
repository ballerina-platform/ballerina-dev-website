```
public function main(string podcastURL) returns error? {
    // Creates a HTTP client to download the audio file
    http:Client podcastEP = check new (podcastURL);
    http:Response httpResp = check podcastEP->get("");
    byte[] audioBytes = check httpResp.getBinaryPayload();
    check io:fileWriteBytes(AUDIO_FILE_PATH, audioBytes);

    // Creates a request to translate the audio file to text (English)
    audio:CreateTranscriptionRequest transcriptionsReq = {
        file: {fileContent: (check io:fileReadBytes(AUDIO_FILE_PATH)), fileName: AUDIO_FILE},
        model: "whisper-1"
    };

    // Converts the audio file to text (English) using OpenAI speach to text API
    audio:Client openAIAudio = check new ({auth: {token: openAIToken}});
    audio:CreateTranscriptionResponse transcriptionsRes = check openAIAudio->/audio/transcriptions.post(transcriptionsReq);
    io:println("Text from the audio :", transcriptionsRes.text);

    // Creates a request to summarize the text
    chat:CreateChatCompletionRequest request = {
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: string `Summarize the following text to 100 characters : ${transcriptionsRes.text}`
            }
        ],
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    };

    // Summarizes the text using OpenAI text completion API
    final chat:Client openAIChat = check new ({auth: {token: openAIToken}});
    chat:CreateChatCompletionResponse completionRes = check openAIChat->/chat/completions.post(request);

    string? summerizedText = completionRes.choices[0].message.content;
    if summerizedText is () {
        return error("Failed to summarize the given audio.");
    }
    io:println("Summarized text: ", summerizedText);

    // Tweet it out!
    final twitter:Client twitter = check new ({auth: {token: token}});
    twitter:TweetCreateResponse tweet = check twitter->/tweets.post({text: summerizedText});
    io:println("Tweet: ", tweet);
}
```
