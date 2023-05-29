---
title: 'Why is Ballerina the way you should write AI applications?'
description: "For many years Python, a wonderful language, has been the de facto choice for data analytics, data science, and machine learning. But using LLMs to add AI to business applications is not about those problems anymore but more about prompt engineering, fine-tuning, calling APIs offered by hosted LLMs, chaining LLMs, and combining them with other APIs.<br/><br/>

Ballerina is your best choice for writing modern cloud-native applications that incorporate LLM-powered AI!
"
url: 'https://github.com/ballerina-guides/ai-samples/blob/main/convert_audio_to_text_and_translate_using_openai/main.bal'
---
```
public function main(string audioURL, string translatingLanguage) returns error? {
    // Creates a HTTP client to download the audio file
    http:Client audioEP = check new (audioURL);
    http:Response httpResp = check audioEP->/get();
    byte[] audioBytes = check httpResp.getBinaryPayload();
    check io:fileWriteBytes(AUDIO_FILE_PATH, audioBytes);

    // Creates a request to translate the audio file to text (English)
    audio:CreateTranslationRequest translationsReq = {
        file: {fileContent: check io:fileReadBytes(AUDIO_FILE_PATH), fileName: AUDIO_FILE},
        model: "whisper-1"
    };

    // Translates the audio file to text (English)
    audio:Client openAIAudio = check new ({auth: {token: openAIKey}});
    audio:CreateTranscriptionResponse transcriptionRes = 
        check openAIAudio->/audio/translations.post(translationsReq);
    io:println("Audio text in English: ", transcriptionRes.text);

    // Creates a request to translate the text from English to another language
    text:CreateCompletionRequest completionReq = {
        model: "text-davinci-003",
        prompt: string `Translate the following text from English to ${
                        translatingLanguage} : ${transcriptionRes.text}`,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    };

    // Translates the text from English to another language
    text:Client openAIText = check new ({auth: {token: openAIKey}});
    text:CreateCompletionResponse completionRes = 
        check openAIText->/completions.post(completionReq);
    string translatedText = check completionRes.choices[0].text.ensureType();
    io:println("Translated text: ", translatedText);
}
```