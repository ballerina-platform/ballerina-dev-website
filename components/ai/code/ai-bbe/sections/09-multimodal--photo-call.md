---
lang: ballerina
---
```
import ballerina/ai;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;

// Image input: a vision-capable model (OpenAI, Azure OpenAI, Anthropic, or a local Ollama vision model).
final ai:ModelProvider visionModel = check new openai:ModelProvider(openAiApiKey, openai:GPT_4O);
// Audio input: OpenAI (and Azure OpenAI) audio models only, wav or mp3 bytes, Chat Completions API.
final ai:ModelProvider audioModel = check new openai:ModelProvider(openAiApiKey, openai:GPT_4O_AUDIO_PREVIEW);

type DamageCheck record {|
    # Whether the photo shows visible damage to the delivered item
    "DAMAGED"|"NOT_DAMAGED"|"UNCLEAR" verdict;
    # What is visible in the photo, in one sentence
    string observation;
|};

type CallSummary record {|
    # The order ID the customer mentions, in the format ORD-1234, if any
    string orderId?;
    # What the customer wants, in one sentence
    string request;
    # Verbatim transcript of the call
    string transcript;
|};

isolated function checkDamagePhoto(byte[] jpeg) returns DamageCheck|error {
    ai:ImageDocument photo = {content: jpeg, metadata: {mimeType: "image/jpeg"}};
    return visionModel->generate(`Does this customer photo show the delivered item damaged? ${photo}`);
}

isolated function summarizeCall(byte[] wav) returns CallSummary|error {
    ai:AudioDocument recording = {content: wav, metadata: {"format": "wav"}};
    return audioModel->generate(`Transcribe this support call and summarize the request: ${recording}`);
}
```
