```
service / on new http:Listener(8080) {
    function init() returns error? {
        sheets:Range range = check gSheets->getRange(sheetId, sheetName, "A2:B");
        pinecone:Vector[] vectors = [];

        foreach any[] row in range.values {
            string title = <string>row[0];
            string content = <string>row[1];
            float[] vector = check getEmbedding(string `${title} ${"\n"} ${content}`);
            vectors[vectors.length()] = 
                {id: title, values: vector, metadata: {"content": content}};
        }

        pinecone:UpsertResponse response = 
            check pineconeClient->/vectors/upsert.post({vectors, namespace: NAMESPACE});
        if response.upsertedCount != range.values.length() {
            return error("Failed to insert embedding vectors to pinecone.");
        }
        io:println("Successfully inserted embedding vectors to pinecone.");
    }

    resource function get answer(string question) returns string?|error {
        string prompt = check constructPrompt(question);
        text:CreateCompletionRequest prmt = {
            prompt: prompt,
            model: "text-davinci-003",
            max_tokens: 2000
        };
        text:CreateCompletionResponse completionRes = check openAIText->/completions.post(prmt);
        return completionRes.choices[0].text;
    }
}
```