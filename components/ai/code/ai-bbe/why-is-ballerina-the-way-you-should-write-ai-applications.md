---
title: 'Why is Ballerina the way you should write AI applications?'
description: "Python remains the go-to for machine learning, data science, and analytics—but integrating AI into modern business applications is a different challenge. It’s now about invoking LLMs, prompt engineering, and embedding AI into workflows. Ballerina, a cloud-native language built for integration, offers powerful abstractions to connect with LLMs and seamlessly weave AI into your applications to deliver real value."
url: 'https://github.com/xlight05/ai-samples/blob/usecase-samples/hr_agent_rag_app/main.bal'
---
```
service /agent on hrAgent {
    resource function post chat(@http:Payload agent:ChatReqMessage request) returns agent:ChatRespMessage|error {
        string query = request.message;
        float[] embeddings = check getEmbeddings(query);
        string retrievedChunks = check retrieveChunksFromPinecone(embeddings);
        string hRAssistantResponse = check getHRAssistantResponse(query, retrievedChunks);
        return {message: hRAssistantResponse};
    }
}
```
