```
// Creates a HTTP client to download the audio file
http:Client podcastEP = check new (podcastURL);
http:Response httpResp = check podcastEP->/get();
byte[] audioBytes = check httpResp.getBinaryPayload();
check io:fileWriteBytes(AUDIOFILEPATH, audioBytes);

// Creates a request to translate the audio file to text (English)
audio:CreateTranscriptionRequest transcriptionsReq = {
    file: {
        fileContent: (check io:fileReadBytes(AUDIOFILEPATH)).slice(0, BINARYLENGTH), 
        fileName: AUDIOFILE
    },
    model: "whisper-1"
};

// Converts the audio file to text (English) using OpenAI speach to text API
audio:Client openAIAudio = check new ({auth: {token: openAIToken}});
audio:CreateTranscriptionResponse transcriptionsRes = 
    check openAIAudio->/audio/transcriptions.post(transcriptionsReq);

io:println("Text from the audio :", transcriptionsRes.text);

// Creates a request to summarize the text
string prmt = "Summarize the following text to 100 characters : " + transcriptionsRes.text;
text:CreateCompletionRequest textCompletionReq = {
    model: "text-davinci-003",
    prompt: prmt,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
};

// Summarizes the text using OpenAI text completion API
text:Client openAIText = check new ({auth: {token: openAIToken}});
text:CreateCompletionResponse completionRes = 
    check openAIText->/completions.post(textCompletionReq);

string summerizedText = check completionRes.choices[0].text.ensureType();
io:println("Summarized text: ", summerizedText);

// Tweet it out!
twitter:Client twitter = check new (twitterConfig);
var tweet = check twitter->tweet(summerizedText);
io:println("Tweet: ", tweet);
```