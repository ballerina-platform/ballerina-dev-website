---
title: 'Why is Ballerina the way you should write AI applications?'
description: "For many years Python, a wonderful language, has been the de facto choice for data analytics, data science and machine learning.  But using LLMs to add AI to business applications is not about those problems any more but more about prompt engineering, fine tuning, calling APIs offered by hosted LLMs and chaining LLMs & combining them with other APIs.<br/><br/>

Ballerina is a modern programming language that has been designed specifically for cloud-native application development.<br/><br/>

Ballerina has inherent support for network service consumption & production and a network friendly data-oriented programming model. Ballerina provides a statically typed environment that helps to prevent errors and improve code reliability. The ability to automatically visualize any Ballerina program as a sequence diagram makes it easy to see how applications use external APIs.<br/><br/>

Ballerina is your best choice for writing modern cloud-native applications that incorporate LLM powered AI!
<br/><br/>
<a href='https://central.ballerina.io/search?q=package%3Aopenai.' target='_blank' title='Explore Ballerina’s OpenAI connectors'>Explore Ballerina’s OpenAI connectors</a>
<br/>
<a href='https://central.ballerina.io/ballerina/math.vector' target='_blank' title='EExplore Ballerina’s vector library'>Explore Ballerina’s vector library</a>
<br/>
<small><i>Coming soon: Support for Azure AI APIs, Google AI APIs, vector databases and more.</i></small>

"
url: 'https://github.com/ballerina-guides/ai-samples/blob/main/convert_audio_to_text_and_translate_using_openai/'
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