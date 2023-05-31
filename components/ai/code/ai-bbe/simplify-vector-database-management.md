---
title: 'Simplify vector database management'
description: "Ballerina comes with built-in connectors for vector databases, which are a common building block in AI use cases that support the storage and retrieval of high-dimensional vectors."
url: 'https://github.com/ballerina-guides/ai-samples/blob/main/answer_questions_using_vector_search_weaviate/main.bal'
---
```
service / on new http:Listener(8080) {
    resource function get answer(string question) returns weaviate:JsonObject|error? {
        // Retrieve OpenAI embeddings for the input question
        embeddings:CreateEmbeddingResponse embeddingResponse = check openai->/embeddings.post({
                model: MODEL,
                input: question
            }
        );
        float[] vector = embeddingResponse.data[0].embedding;

        // Querying Weaviate for the closest vector using GraphQL
        string graphQLQuery = string `{
                                    Get {
                                        ${CLASS_NAME} (
                                        nearVector: {
                                            vector: ${vector.toString()}
                                            }
                                            limit: 1
                                        ){
                                        question
                                        answer
                                        _additional {
                                            certainty,
                                            id
                                            }
                                        }
                                    }
                                }`;

        weaviate:GraphQLResponse results = check weaviate->/graphql.post({query: graphQLQuery});

        return results.data;
    }
}
```