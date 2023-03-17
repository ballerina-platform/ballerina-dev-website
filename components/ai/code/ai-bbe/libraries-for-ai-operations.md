---
title: 'Libraries for AI operations'
description: "Built in mathematical operations such as distance measures, optimizations etc.  which are a common building block in AI use cases."
url: 'https://github.com/ballerina-guides/ai-samples/blob/main/compare_similarity_between_two_texts_using_openai/main.bal'
---
```
configurable string openAIToken = ?;

public function main() returns error? {

    final embeddings:Client openaiEmbeddings = check new ({auth: {token: openAIToken}});

    string text1 = "What are you thinking?";
    string text2 = "What is on your mind?";

    embeddings:CreateEmbeddingRequest embeddingRequest = {
        model: "text-embedding-ada-002",
        input: [text1, text2]
    }; 

    embeddings:CreateEmbeddingResponse embeddingResponse = 
        check openaiEmbeddings->/embeddings.post(embeddingRequest);

    float[] text1Embedding = embeddingResponse.data[0].embedding;
    float[] text2Embedding = embeddingResponse.data[1].embedding;
    float similarity = check vector:cosineSimilarity(text1Embedding, text2Embedding);

    io:println("The similarity between the given two texts : ", similarity);

}
```