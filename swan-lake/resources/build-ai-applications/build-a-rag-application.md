---
layout: ballerina-build-a-rag-application-left-nav-pages-swanlake
title: Build a RAG application
description: Learn how to build a retrieval-augmented generation (RAG) application in Ballerina with data loaders, chunkers, embedding providers, vector stores, knowledge bases, and metadata filters.
keywords: ballerina, AI, RAG, retrieval-augmented generation, vector store, embeddings, knowledge base, pgvector, Pinecone, Milvus, Weaviate
permalink: /learn/build-a-rag-application/
active: build-a-rag-application
intro: This guide walks through the ingestion and query workflows of retrieval-augmented generation (RAG) and the abstractions Ballerina provides for each step.
---

## Understand RAG

Retrieval-augmented generation (RAG) grounds the responses of a large language model (LLM) in your own data. It has two workflows.

- **Ingestion**: load documents, split them into chunks, convert the chunks into vector embeddings, and index them in a vector store.
- **Query**: embed the user's question, retrieve the most similar chunks, augment the prompt with them, and call the LLM.

The [`ballerina/ai`](https://central.ballerina.io/ballerina/ai/latest) module provides an abstraction for each step, so the implementations (e.g., the vector database or the embedding model) can be swapped without changing the workflow.

| Step | Abstraction | Reference implementations |
|---|---|---|
| Load documents | `ai:DataLoader` | `ai:TextDataLoader` (PDF, DOCX, Markdown, HTML, PPTX), [`ballerinax/ai.microsoft.sharepoint`](https://central.ballerina.io/ballerinax/ai.microsoft.sharepoint/latest) |
| Chunk documents | `ai:Chunker` | `ai:GenericRecursiveChunker`, `ai:MarkdownChunker`, `ai:HtmlChunker` |
| Embed chunks | `ai:EmbeddingProvider` | `ai:getDefaultEmbeddingProvider()`, [`ballerinax/ai.openai`](https://central.ballerina.io/ballerinax/ai.openai/latest), [`ballerinax/ai.azure`](https://central.ballerina.io/ballerinax/ai.azure/latest), [`ballerinax/ai.openrouter`](https://central.ballerina.io/ballerinax/ai.openrouter/latest), [`ballerinax/ai.googleapis.vertex`](https://central.ballerina.io/ballerinax/ai.googleapis.vertex/latest) |
| Store vectors | `ai:VectorStore` | `ai:InMemoryVectorStore`, [`ballerinax/ai.pgvector`](https://central.ballerina.io/ballerinax/ai.pgvector/latest), [`ballerinax/ai.pinecone`](https://central.ballerina.io/ballerinax/ai.pinecone/latest), [`ballerinax/ai.milvus`](https://central.ballerina.io/ballerinax/ai.milvus/latest), [`ballerinax/ai.weaviate`](https://central.ballerina.io/ballerinax/ai.weaviate/latest) |
| Index and retrieve | `ai:KnowledgeBase` | `ai:VectorKnowledgeBase`, [`ballerinax/ai.azure`](https://central.ballerina.io/ballerinax/ai.azure/latest) (Azure AI Search), custom implementations |

## Set up the providers and the knowledge base

Create an embedding provider, a vector store, and a knowledge base. The knowledge base orchestrates chunking, embedding, storage, and retrieval.

```ballerina
import ballerina/ai;

final ai:EmbeddingProvider embeddingProvider = check ai:getDefaultEmbeddingProvider();
final ai:VectorStore vectorStore = check new ai:InMemoryVectorStore();
final ai:KnowledgeBase knowledgeBase = new ai:VectorKnowledgeBase(vectorStore, embeddingProvider);
```

To use an external vector database, replace the vector store. For example, with pgvector (a PostgreSQL extension), the vector dimension must match the embedding model.

```ballerina
import ballerinax/ai.pgvector;

configurable string pgPassword = ?;

final ai:VectorStore vectorStore = check new pgvector:VectorStore("localhost", "postgres", pgPassword,
        "vector_db", tableName = "policy_vectors", configs = {vectorDimension: 1536});
```

See the [Retrieve from pgvector](/learn/by-example/rag-pgvector-retrieval/), [Retrieve from Pinecone](/learn/by-example/rag-query-with-external-vector-store/), and [Ingest into Pinecone](/learn/by-example/rag-ingestion-with-external-vector-store/) examples. For RAG workflows that use other providers end to end, see the [Retrieve and generate with Google Vertex AI](/learn/by-example/rag-vertex-ai-retrieval/) and [Retrieve and generate with OpenRouter](/learn/by-example/rag-openrouter-retrieval/) examples. To use your own embedding model, see [Configure model and embedding providers](/learn/configure-model-and-embedding-providers/).

## Ingest documents

### Load documents

The `ai:TextDataLoader` loads files as `ai:TextDocument` values and supports the `pdf`, `docx`, `markdown`, `html`, and `pptx` file types.

```ballerina
ai:DataLoader loader = check new ai:TextDataLoader("./employee_handbook.md", "./leave_policy.pdf");
ai:Document|ai:Document[] documents = check loader.load();
```

Documents can also be created directly, for example, from data fetched from another system.

```ballerina
ai:TextDocument document = {content: "Full-time employees are entitled to 20 days of paid annual leave per year."};
```

### Ingest into the knowledge base

A single call to `ingest` takes the loaded documents through the whole ingestion pipeline.

```ballerina
check knowledgeBase.ingest(documents);
```

Internally, the `ai:VectorKnowledgeBase` performs three steps.

1. **Chunking**: each document is split into chunks by the configured chunker. With the default `ai:AUTO` setting, the chunker is chosen from the document's MIME type or file name: Markdown documents use `ai:MarkdownChunker`, HTML documents use `ai:HtmlChunker`, and everything else uses `ai:GenericRecursiveChunker`. The chunkers start from a large unit (e.g., a Markdown header or a paragraph) and recursively fall back to smaller units (e.g., sentences) until each chunk fits the maximum size (200 characters by default, with a 40-character overlap). Chunks that are passed in directly are split further only if they exceed the limit.
2. **Embedding**: all chunks are sent to the embedding provider in a single `batchEmbed` call, which returns one vector per chunk.
3. **Storing**: each chunk is paired with its vector as an `ai:VectorEntry` and added to the vector store, where it becomes searchable.

To control chunking, pass a chunker to the knowledge base when creating it, or pass `ai:DISABLE` to store each document as a single chunk.

```ballerina
final ai:KnowledgeBase knowledgeBase = new ai:VectorKnowledgeBase(vectorStore, embeddingProvider,
        new ai:MarkdownChunker(maxChunkSize = 300, maxOverlapSize = 40));
```

See the [Load documents](/learn/by-example/rag-document-loading/), [Chunk documents](/learn/by-example/rag-document-chunking/), [Implement a custom chunker](/learn/by-example/rag-with-custom-chunker/), [Ingest without chunking](/learn/by-example/rag-without-chunking/), and [Ingest into an in-memory vector store](/learn/by-example/rag-in-memory-vector-store-ingestion/) examples.

## Query the knowledge base

Retrieving is the mirror image of ingesting. A single call to `retrieve` returns the chunks most relevant to a question.

```ballerina
ai:QueryMatch[] matches = check knowledgeBase.retrieve(query, 3);
```

Internally, the knowledge base performs the following steps.

1. **Embed the query**: the question is converted into a vector with the same embedding provider that was used during ingestion, so that it lives in the same vector space as the stored chunks.
2. **Compare**: the vector store is queried with the query vector, the maximum number of results (`topK`, 10 by default), and any metadata filters. The store compares the query vector with the stored vectors and returns the closest ones with a similarity score.
3. **Return the matches**: each result is returned as an `ai:QueryMatch` holding the original chunk and its similarity score, ordered by relevance.

The retrieved chunks are then used to ground the answer. `ai:augmentUserQuery` builds a user message that instructs the model to answer the question based only on the provided context, embeds the chunks as that context, and appends the question. The message is sent to the model with `chat`.

```ballerina
final ai:ModelProvider model = check ai:getDefaultModelProvider();

public function main() returns error? {
    string query = "How much paid vacation do I get?";
    ai:QueryMatch[] matches = check knowledgeBase.retrieve(query, 3);
    ai:ChatUserMessage augmentedQuery = ai:augmentUserQuery(matches, query);
    ai:ChatAssistantMessage response = check model->chat(augmentedQuery);
}
```

See the [Retrieve from an in-memory vector store](/learn/by-example/rag-in-memory-vector-store-retrieval/) and [Retrieve from Pinecone](/learn/by-example/rag-query-with-external-vector-store/) examples. To compare embeddings directly, see the [Generate embeddings with the default WSO2 embedding provider](/learn/by-example/rag-embeddings/) example.

## Filter by metadata

Chunks carry metadata (`ai:Metadata`) with predefined fields such as the file name and chunk index, plus arbitrary custom fields. Metadata filters combine vector similarity with exact conditions, for example, to scope retrieval to a department, a document, or a tenant. The same filters can delete chunks with `deleteByFilter`.

```ballerina
ai:TextChunk[] chunks = [
    {content: "Employees get 20 days of paid annual leave.", metadata: {"department": "HR", "year": 2025}},
    {content: "Production deployments require two approvals.", metadata: {"department": "Engineering", "year": 2025}}
];
check knowledgeBase.ingest(chunks);

ai:QueryMatch[] matches = check knowledgeBase.retrieve(query, 2, {
    condition: ai:AND,
    filters: [
        {key: "department", operator: ai:IN, value: ["HR", "Finance"]},
        {key: "year", operator: ai:GREATER_THAN_OR_EQUAL, value: 2025}
    ]
});

check knowledgeBase.deleteByFilter({filters: [{key: "year", operator: ai:LESS_THAN, value: 2025}]});
```

See the [Filter results by metadata](/learn/by-example/rag-query-with-metadata-filters/) example.

## Use other knowledge bases

Any retrieval backend can be integrated by implementing the `ai:KnowledgeBase` type (`ingest`, `retrieve`, and `deleteByFilter`). The [`ballerinax/ai.azure`](https://central.ballerina.io/ballerinax/ai.azure/latest) module provides a knowledge base backed by Azure AI Search (see the [Retrieve from Azure AI Search](/learn/by-example/rag-azure-ai-search-retrieval/) example). The [`ballerinax/ai.wso2.integration`](https://central.ballerina.io/ballerinax/ai.wso2.integration/latest) module provides a retrieve-only knowledge base hosted on the WSO2 Integration platform, where the documents are ingested (see the [Retrieve from a WSO2 Cloud knowledge base](/learn/by-example/rag-wso2-cloud-knowledge-base-retrieval/) example).

## Use RAG from an agent

A knowledge base can be used as a tool of an agent, so the agent retrieves context only when it decides it is needed, and can combine it with other tools. Wrap the retrieval in a function annotated with `@ai:AgentTool` and pass it to the agent.

```ballerina
import ballerina/ai;
import ballerina/io;

# Searches the HR policy documents and returns the most relevant passages.
# + query - The search query
# + return - The matching passages
@ai:AgentTool
isolated function searchPolicies(string query) returns string[]|error {
    ai:QueryMatch[] matches = check knowledgeBase.retrieve(query, 3);
    return matches.map(queryMatch => queryMatch.chunk.content.toString());
}

final ai:Agent hrAgent = check new ({
    systemPrompt: {
        role: "HR Assistant",
        instructions: string `You answer employee questions about HR policies. 
            Always look up the policy documents using the tools before answering, 
            and base your answer only on the retrieved passages.`
    },
    model: check ai:getDefaultModelProvider(),
    tools: [searchPolicies]
});

public function main() returns error? {
    string response = check hrAgent.run("How many days of annual leave do I get?", "employee-1");
    io:println(response);
}
```

The `knowledgeBase` is the `ai:KnowledgeBase` set up and populated in the earlier sections. See [Build an AI agent](/learn/build-an-ai-agent/) for the agent concepts.

## Learn more

- [Load documents from multiple sources](/learn/by-example/rag-document-sources/), [Load using a custom data loader](/learn/by-example/rag-custom-data-loader/), [Implement a custom chunker](/learn/by-example/rag-with-custom-chunker/), [Implement a custom embedding provider](/learn/by-example/rag-custom-embedding-provider/), [Vector store operations](/learn/by-example/rag-vector-store-operations/), [Implement a custom vector store](/learn/by-example/rag-custom-vector-store/), and [Augment the prompt with retrieved context](/learn/by-example/rag-augment-prompt/) examples
- [Build an AI agent](/learn/build-an-ai-agent/)
- [Configure model and embedding providers](/learn/configure-model-and-embedding-providers/)
- The RAG examples in [Ballerina by Example](/learn/by-example/)
- [`ballerina/ai` module](https://central.ballerina.io/ballerina/ai/latest)
