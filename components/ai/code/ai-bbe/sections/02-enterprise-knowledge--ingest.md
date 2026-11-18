---
lang: ballerina
---
```
final ai:EmbeddingProvider embeddingProvider =
        check new openai:EmbeddingProvider(openAiApiKey, openai:TEXT_EMBEDDING_3_SMALL);

final ai:VectorStore vectorStore = check new ai:InMemoryVectorStore();

// Documents are chunked explicitly in `chunkPolicy`, so chunking is disabled in the knowledge base.
final ai:KnowledgeBase knowledgeBase = new ai:VectorKnowledgeBase(vectorStore, embeddingProvider, ai:DISABLE);

function ingestPolicies(string[] paths) returns error? {
    ai:DataLoader loader = check new ai:TextDataLoader(...paths);
    ai:Document|ai:Document[] loaded = check loader.load();
    ai:Document[] documents = loaded is ai:Document[] ? loaded : [loaded];

    ai:Chunk[] chunks = [];
    foreach ai:Document document in documents {
        chunks.push(...check chunkPolicy(document));
    }
    check knowledgeBase.ingest(chunks);
}

isolated function chunkPolicy(ai:Document document) returns ai:Chunk[]|error {
    // ... read the document title from its first heading
    ai:Chunker chunker = new ai:MarkdownChunker(maxChunkSize, maxOverlapSize);

    ai:Chunk[] chunks = [];
    foreach ai:Chunk chunk in check chunker.chunk(document) {
        // ... find the section headings that the chunk belongs to
        chunks.push(withSourceMetadata(chunk, title, sections));
    }
    return chunks;
}

isolated function withSourceMetadata(ai:Chunk chunk, string title, string[] sections) returns ai:Chunk {
    ai:Metadata metadata = (chunk.metadata ?: {}).clone();
    metadata["documentTitle"] = title;
    metadata["sections"] = sections;
    ai:Chunk result = chunk.clone();
    result.metadata = metadata;
    return result;
}
```
