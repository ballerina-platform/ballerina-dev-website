---
title: 'Refining Data Excellence'
description: "Ballerina's seamless integration with AI models enhances error correction, ensuring data integrity and precision during transformation.
"
url: 'https://github.com/ShammiL/ETL-code-samples/blob/main/errorCorrection/service.bal'
phase: 'Transformations'
---
```
final http:Client saplingEP = check new ("https://api.sapling.ai");

service /api/posts on new http:Listener(8080) {
    resource function post spellings(SpellCheckRequest request) returns error? {
        SaplingRequest saplingRequest = {
            'key: apiKey,
            text: request.content,
            session_id: "session1"
        };
        SaplingResponse response = check saplingEP->/api/v1/spellcheck.post(saplingRequest);
        int errorCount = 0;
        foreach EditBody edit in response.edits {
            io:println(string `${edit.sentence} : ${edit.replacement}`);
            errorCount = errorCount + 1;
        }
        io:println(string `Total errors: ${errorCount}`);
    }
}
```