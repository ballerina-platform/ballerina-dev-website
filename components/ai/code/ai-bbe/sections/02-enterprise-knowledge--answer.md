---
lang: ballerina
---
```
type GeneratedAnswer record {|
    string answer;
    boolean answerFound;
    string[] sourceIds;
|};

service /hr on new http:Listener(port) {
    resource function post ask(AskRequest request)
            returns PolicyAnswer|http:BadRequest|http:BadGateway|http:ServiceUnavailable {
        // ... validate the question (400 Bad Request)
        ai:QueryMatch[]|ai:Error matches = knowledgeBase.retrieve(question, topK);
        // ... a failed retrieval returns 503 Service Unavailable

        // Drop weak matches. With no evidence left, answer "not found" without calling the model.
        SourceExcerpt[] excerpts = selectExcerpts(matches, minSimilarity);
        if excerpts.length() == 0 {
            return {answer: NO_ANSWER, answerFound: false, sources: []};
        }

        GeneratedAnswer|ai:Error generated = model->generate(`
            You are an HR policy assistant. Answer the employee's question using only the
            policy excerpts below. Do not use any other knowledge.

            If the excerpts do not contain the answer, set answerFound to false and
            return an empty sourceIds array. Otherwise, set answerFound to true and
            include the id of every excerpt that you used in sourceIds.

            Excerpts:
            ${excerpts}

            Question: ${question}`);
        // ... a failed model call returns 502 Bad Gateway

        // Map cited ids (S1, S2, ...) back to document metadata; reject ids that were not retrieved.
        PolicyAnswer|error answer = resolveSources(generated, excerpts);
        if answer is error {
            log:printWarn("Model response failed validation", 'error = answer);
            return <http:BadGateway>{body: "Could not generate a valid answer"};
        }
        return answer;
    }
}
```
