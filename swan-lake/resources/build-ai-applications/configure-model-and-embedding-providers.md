---
layout: ballerina-configure-model-and-embedding-providers-left-nav-pages-swanlake
title: Configure model and embedding providers
description: Learn how to use the default WSO2 model provider and provider-specific modules such as OpenAI, Azure OpenAI, Anthropic, Ollama, and others for LLM calls and embeddings in Ballerina.
keywords: ballerina, AI, LLM, model provider, embedding provider, OpenAI, Azure OpenAI, Anthropic, Ollama, Mistral, DeepSeek
permalink: /learn/configure-model-and-embedding-providers/
active: configure-model-and-embedding-providers
intro: This guide explains how to choose and configure the large language model (LLM) and embedding model used by natural expressions, direct LLM calls, agents, and RAG workflows.
---

Every LLM interaction in Ballerina goes through the `ai:ModelProvider` type, and every embedding operation goes through the `ai:EmbeddingProvider` type. Both are implemented by the default WSO2 providers in the [`ballerina/ai`](https://central.ballerina.io/ballerina/ai/latest) module and by the provider-specific `ballerinax/ai.<provider>` modules. Because your code depends only on these abstract types, switching providers means changing one initialization line.

Store keys in the `Config.toml` file through configurable variables and never commit them to source control.

## Model providers

A model provider is the LLM behind natural expressions, direct LLM calls, and agents. It exposes two operations:

- `generate`: a single prompt whose response is bound to the expected Ballerina type.
- `chat`: a multi-turn conversation, with optional tool definitions.

### Use the default WSO2 model provider

The default model provider lets you get started without managing API keys.

```ballerina
import ballerina/ai;

final ai:ModelProvider model = check ai:getDefaultModelProvider();
```

It reads its configuration from the `ballerina.ai.wso2ProviderConfig` configurable in the `Config.toml` file. If you are using VS Code with the Ballerina extension, generate the configuration as follows.

1. Open the project in VS Code.
2. Log in to the Ballerina Copilot when prompted.
3. Open the command palette (`Ctrl + Shift + P` on Windows/Linux or `command + shift + P` on macOS).
4. Run the `Configure default WSO2 Model Provider` command.

This adds the configuration below to the `Config.toml` file of the open project (creating the file if it does not exist).

```toml
[ballerina.ai.wso2ProviderConfig]
serviceUrl = "<service-url>"
accessToken = "<access-token>"
```

> **Note:** The default provider is subject to rate limits and other usage constraints. The access token is valid for a limited time; if the provider starts returning authentication errors, re-run the command to refresh the configuration.

### Use the OpenAI model provider

```ballerina
import ballerina/ai;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;

final ai:ModelProvider model = check new openai:ModelProvider(openAiApiKey, openai:GPT_4O_MINI,
        temperature = 0.2);
```

The model names are available as enum values (e.g., `openai:GPT_4O`, `openai:GPT_4_1`, `openai:GPT_5`), and the `apiType` parameter selects between the Chat Completions API (the default) and the Responses API.

Reasoning models such as GPT-5 do not support a custom temperature. Set `temperature` to `()` so that it is not sent with the request, and use the `reasoningEffort` parameter to control how much reasoning the model does before it responds.

```ballerina
import ballerina/ai;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;

final ai:ModelProvider model = check new openai:ModelProvider(openAiApiKey, openai:GPT_5,
        temperature = (), reasoningEffort = openai:LOW);
```

### Use the Azure OpenAI model provider

The Azure OpenAI provider supports two URL styles. With the v1 URL (`https://<resource>.services.ai.azure.com/openai/v1` or `https://<resource>.openai.azure.com/openai/v1`), no `api-version` is required. With the legacy URL (`https://<resource>.openai.azure.com/openai`), the `apiVersion` argument (e.g., `"2024-06-01"`) is required. See the [Azure OpenAI API version lifecycle](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/api-version-lifecycle) for details.

```ballerina
import ballerina/ai;
import ballerinax/ai.azure;

configurable string azureServiceUrl = ?;
configurable string azureApiKey = ?;
configurable string azureDeploymentId = ?;

// v1 URL: the `apiVersion` argument is not required.
final ai:ModelProvider model = check new azure:OpenAiModelProvider(azureServiceUrl, azureApiKey,
        azureDeploymentId, temperature = 0.2);

// Legacy URL: pass the `apiVersion` argument.
final ai:ModelProvider legacyModel = check new azure:OpenAiModelProvider(
        "https://<resource>.openai.azure.com/openai", azureApiKey, azureDeploymentId,
        apiVersion = "2024-06-01");
```

Set `temperature` to `()` for reasoning models (e.g., the GPT-5 and o-series models) that do not support it, and use the `reasoningEffort` parameter to control their reasoning effort.

### Use the Anthropic model provider

```ballerina
import ballerina/ai;
import ballerinax/ai.anthropic;

configurable string anthropicApiKey = ?;

final ai:ModelProvider model = check new anthropic:ModelProvider(anthropicApiKey,
        anthropic:CLAUDE_SONNET_4_5);
```

### Use the Ollama model provider for local models

[Ollama](https://ollama.com/) runs open-source models locally, and no API key is required. Pull the model first (e.g., `ollama pull llama3.2`). The default service URL is `http://localhost:11434`.

```ballerina
import ballerina/ai;
import ballerinax/ai.ollama;

final ai:ModelProvider model = check new ollama:ModelProvider("llama3.2");
```

### Use other model providers

The following modules follow the same pattern. See the module documentation for the constructor arguments of each.

| Module | Provider |
|---|---|
| [`ballerinax/ai.deepseek`](https://central.ballerina.io/ballerinax/ai.deepseek/latest) | DeepSeek |
| [`ballerinax/ai.mistral`](https://central.ballerina.io/ballerinax/ai.mistral/latest) | Mistral |
| [`ballerinax/ai.openrouter`](https://central.ballerina.io/ballerinax/ai.openrouter/latest) | OpenRouter |
| [`ballerinax/ai.googleapis.vertex`](https://central.ballerina.io/ballerinax/ai.googleapis.vertex/latest) | Google Vertex AI |

### Use the model provider in your code

Once initialized, a model provider is used the same way regardless of the implementation.

```ballerina
type Summary record {|
    string title;
    string[] keyPoints;
|};

public function main() returns error? {
    Summary summary = check model->generate(`Summarize the following text: ${text}`);
}
```

The same value can be passed to a natural expression (`natural (model) { ... }`), to an agent (the `model` field of the agent configuration), or used in a RAG workflow to generate the final answer.

## Embedding providers

An embedding provider converts text chunks into vectors so that semantically similar text can be found with vector similarity search. It is used by retrieval-augmented generation (RAG) both when ingesting documents and when retrieving context for a query. It exposes two operations:

- `embed`: embeds a single chunk.
- `batchEmbed`: embeds several chunks in one request.

### Use the default WSO2 embedding provider

The default embedding provider lets you generate embeddings without managing API keys.

```ballerina
import ballerina/ai;

final ai:EmbeddingProvider embeddingProvider = check ai:getDefaultEmbeddingProvider();
```

It uses the same `ballerina.ai.wso2ProviderConfig` configuration as the default model provider. If you have not generated it yet and you are using VS Code with the Ballerina extension, follow these steps.

1. Open the project in VS Code.
2. Log in to the Ballerina Copilot when prompted.
3. Open the command palette (`Ctrl + Shift + P` on Windows/Linux or `command + shift + P` on macOS).
4. Run the `Configure default WSO2 Model Provider` command.

This adds the `[ballerina.ai.wso2ProviderConfig]` section with the `serviceUrl` and `accessToken` values to the `Config.toml` file of the project. The same configuration serves both the default model provider and the default embedding provider, so it only needs to be generated once.

### Use the OpenAI embedding provider

```ballerina
import ballerina/ai;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;

final ai:EmbeddingProvider embeddingProvider =
        check new openai:EmbeddingProvider(openAiApiKey, openai:TEXT_EMBEDDING_3_SMALL);
```

### Use the Azure OpenAI embedding provider

The `apiVersion` argument follows the same rule as the model provider: pass `()` for v1 URLs, and a date-based version for legacy URLs.

```ballerina
import ballerina/ai;
import ballerinax/ai.azure;

configurable string azureServiceUrl = ?;
configurable string azureApiKey = ?;
configurable string azureEmbeddingDeploymentId = ?;

final ai:EmbeddingProvider embeddingProvider = check new azure:EmbeddingProvider(azureServiceUrl,
        azureApiKey, (), azureEmbeddingDeploymentId);
```

### Use other embedding providers

| Module | Provider |
|---|---|
| [`ballerinax/ai.openrouter`](https://central.ballerina.io/ballerinax/ai.openrouter/latest) | OpenRouter |
| [`ballerinax/ai.googleapis.vertex`](https://central.ballerina.io/ballerinax/ai.googleapis.vertex/latest) | Google Vertex AI |

### Use the embedding provider in your code

An embedding provider is typically passed to an `ai:VectorKnowledgeBase` together with a vector store; the knowledge base embeds chunks during ingestion and embeds queries during retrieval.

```ballerina
final ai:KnowledgeBase knowledgeBase =
        new ai:VectorKnowledgeBase(check new ai:InMemoryVectorStore(), embeddingProvider);
```

## Configure the keys

Add the configurable values to the `Config.toml` file next to your program. For example, for the Azure OpenAI providers:

```toml
azureServiceUrl = "https://<resource>.services.ai.azure.com/openai/v1"
azureApiKey = "<your-api-key>"
azureDeploymentId = "<your-deployment-name>"
azureEmbeddingDeploymentId = "<your-embedding-deployment-name>"
```

> **Tip:** Ballerina reports an error for values in the `Config.toml` file that are not used by the program, so include only the values the program declares as configurable variables.

## Learn more

- [Direct LLM calls](/learn/by-example/direct-llm-calls/), [Direct LLM calls with a specific model provider](/learn/by-example/direct-llm-calls-with-model-provider/), and [Direct LLM calls with a local model using Ollama](/learn/by-example/direct-llm-calls-with-ollama/) examples
- [Embeddings with a specific embedding provider](/learn/by-example/rag-embedding-provider/) example
- [Natural expressions with a specific model provider](/learn/by-example/natural-expressions-with-model-provider/) example
- [Build a RAG application](/learn/build-a-rag-application/)
- [`ballerina/ai` module](https://central.ballerina.io/ballerina/ai/latest)
