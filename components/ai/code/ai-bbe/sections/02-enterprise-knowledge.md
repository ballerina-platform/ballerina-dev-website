---
title: 'Your enterprise knowledge. In every answer.'
id: 'enterprise-knowledge'
description: "Connect model responses to your organization's documents and data with retrieval-augmented generation. Load and index content, retrieve relevant passages, and include supporting sources in the response."
details: "An HR policy assistant answers from the company's own policy documents and returns the document and section behind each answer. When no retrieved passage meets the similarity threshold, it returns a \"not found\" answer without calling the model. Citation checks confirm that every cited source was retrieved, but they do not prove the answer text is supported, so grounding reduces unsupported answers without eliminating them. The sample uses an in-memory vector store. The `ballerinax/ai.pgvector`, `ai.pinecone`, `ai.milvus`, and `ai.weaviate` packages provide persistent stores behind the same `ai:VectorStore` interface."
guide: { label: 'Ground responses with enterprise data', url: '/learn/ground-responses-with-enterprise-data/' }
samples: []
tabs:
  - { key: 'answer', title: 'Code' }
---
