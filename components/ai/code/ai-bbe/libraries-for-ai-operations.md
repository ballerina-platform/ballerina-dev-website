---
title: 'Libraries for AI operations'
description: "Built-in mathematical operations such as distance measures, optimizations, etc. are a common building block in AI use cases."
url: 'https://github.com/ballerina-guides/ai-samples/blob/main/compare_similarity_between_two_texts_using_openai/main.bal'
---
```
public function main() returns error? {
    final embeddings:Client openAIEmbeddings = check new ({auth: {token: openAIToken}});

    string text1 = "What are you thinking?";
    string text2 = "you are playing cricket";
    embeddings:CreateEmbeddingRequest embeddingReq = {
        model: "text-embedding-3-small",
        input: [text1, text2]
    };
    embeddings:CreateEmbeddingResponse embeddingRes = check openAIEmbeddings->/embeddings.post(embeddingReq);

    float[] text1Embedding = embeddingRes.data[0].embedding;
    float[] text2Embedding = embeddingRes.data[1].embedding;
    float similarity = vector:cosineSimilarity(text1Embedding, text2Embedding);
    io:println("The similarity between the given two texts : ", similarity);
}
```
