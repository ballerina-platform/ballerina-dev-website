---
title: 'Beyond text: Multimodal AI at your fingertips'
id: 'multimodal-ai'
description: "Bring documents, images, and audio into enterprise integrations using supported model and connector capabilities. Extract information, transcribe conversations, and pass validated results into business systems."
details: "Turn the invoices, photos, and call recordings that arrive with support and finance cases into typed records that business systems can use. Supported input depends on the provider and the model. In the versions shown, `ballerinax/ai.anthropic` accepts PDFs as `ai:FileDocument`, and only the OpenAI and Azure OpenAI providers accept audio as `ai:AudioDocument` (wav or mp3 bytes, with an audio-capable model). For dedicated speech-to-text, use the provider-specific [`ballerinax/openai.audio`](https://central.ballerina.io/ballerinax/openai.audio/latest) connector. Extracted values can still be wrong, so validate them and let the downstream system check them against its own records."
guide: { label: 'Add an LLM step to an integration', url: '/learn/add-an-llm-step-to-an-integration/#other-ways-to-call-the-model' }
samples:
  - { label: 'Direct LLM calls with multimodal input (BBE)', url: '/learn/by-example/direct-llm-calls-with-multimodal-input/' }
  - { label: 'Multimodal insurance claim analyzer (GitHub)', url: 'https://github.com/ballerina-guides/ai-samples/tree/main/multimodal_insurance_claim_analyzer' }
tabs:
  - { key: 'invoice', title: 'Invoice PDF' }
  - { key: 'photo-call', title: 'Photo and call' }
  - { key: 'result', title: 'Result' }
  - { key: 'support', title: 'Provider support' }
---
