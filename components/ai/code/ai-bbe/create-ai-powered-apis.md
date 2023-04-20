---
title: 'Create AI-powered APIs, automations, and event handlers'
description: "Effortlessly tackle any AI-powered API integration by leveraging the network abstractions of Ballerina to create APIs, automations, and event handlers for your applications."
url: 'https://github.com/ballerina-guides/ai-samples/blob/main/question_answering_based_on_context_using_openai/main.bal'
---
```
service / on new http:Listener(8080) {

    map<string> documents = {};
    map<float[]> docEmbeddings = {};

    function init() returns error? {
        sheets:Range range = check gSheets->getRange(sheetId, sheetName, "A2:B");

        //Populate the dictionaries with the content and embeddings for each doc.
        foreach any[] row in range.values {
            string title = <string>row[0];
            string content = <string>row[1];
            self.documents[title] = content;
            self.docEmbeddings[title] = check getEmbedding(string `${title} ${"\n"} ${
                                                                   content}`);
        }
    }

    resource function get answer(string question) returns string?|error {
        string prompt = check constructPrompt(question, self.documents, 
                        self.docEmbeddings);
        text:CreateCompletionRequest prmt = {
            prompt: prompt,
            model: "text-davinci-003"
        };
        text:CreateCompletionResponse completionRes = 
            check openAIText->/completions.post(prmt);
        return completionRes.choices[0].text;
    }
}
```