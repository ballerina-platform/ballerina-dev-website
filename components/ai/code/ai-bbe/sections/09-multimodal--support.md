---
lang: text
---
```
Document types each provider accepts in generate() (read from the provider source)

ballerinax/ai.openai 1.4.1     text, image (URL or bytes),
                               audio (wav/mp3 bytes, Chat Completions API only)
                               no file/PDF input
ballerinax/ai.azure 1.5.1      same as OpenAI, depending on the deployed model
ballerinax/ai.anthropic 1.3.5  text, image (URL, or bytes with mimeType),
                               file/PDF (URL, file ID, or bytes with mimeType)
                               no audio input
ballerinax/ai.ollama 1.2.5     text, image (with a local vision model)

The model must also support the input, for example a vision or audio model.

Unsupported combinations fail before any request is sent (captured locally):

openai + ai:FileDocument
  -> Only text, image and audio documents are supported.
openai + ai:AudioDocument without a format
  -> Please specify the audio format in the 'format' field of the metadata;
     supported values are 'mp3' and 'wav'
anthropic + ai:AudioDocument
  -> Only text, image and file documents are supported.
anthropic + ai:ImageDocument (bytes, no mimeType)
  -> Please specify the mimeType for the image document.
```
