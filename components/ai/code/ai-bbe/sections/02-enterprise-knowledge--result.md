---
lang: text
---
```
# Chunk metadata after ingestion (captured from leave-policy.md)
{"fileName": "leave-policy.md", "documentTitle": "Leave policy", "sections": ["Annual leave"]}
{"fileName": "leave-policy.md", "documentTitle": "Leave policy", "sections": ["Carry forward"]}
{"fileName": "leave-policy.md", "documentTitle": "Leave policy", "sections": ["Sick leave"]}
...

# Answer with sources (illustrative: generated text varies)
POST /hr/ask {"question": "How many unused annual leave days can I carry forward?"}
-> 201 Created
{"answer": "You can carry forward up to 5 unused annual leave days to the next calendar year.
            You must use them before 31 March, or they are forfeited.",
 "answerFound": true,
 "sources": [{"document": "leave-policy.md", "title": "Leave policy", "sections": ["Carry forward"]}]}

# No relevant evidence
POST /hr/ask {"question": "What is the parking policy at the head office?"}
-> 201 Created
{"answer": "I could not find this in the HR policies. Contact HR for help.", "answerFound": false, "sources": []}

# Model cites an excerpt that was not retrieved (resolveSources, captured with bal test)
sourceIds: ["S3"], retrieved: ["S1"]
-> model cited an unknown source: S3
-> 502 Bad Gateway  "Could not generate a valid answer"
```
