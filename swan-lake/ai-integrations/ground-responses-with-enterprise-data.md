---
layout: ballerina-ground-responses-with-enterprise-data-left-nav-pages-swanlake
title: Ground responses with enterprise data
description: Build a complete RAG pipeline, from loading and indexing documents to retrieving relevant content and generating responses with source attribution.
keywords: ballerina, AI, LLM, RAG, retrieval-augmented generation, vector store, embeddings, knowledge base, integration
permalink: /learn/ground-responses-with-enterprise-data/
active: ground-responses-with-enterprise-data
intro: This guide shows how to build a retrieval-augmented generation (RAG) pipeline in Ballerina. You load and chunk policy documents, index them in a vector knowledge base, retrieve the content that is relevant to a question, and return an answer from a large language model (LLM) together with the documents and sections it is based on.
---

## The scenario

A company wants an HR policy assistant that employees can ask questions such as "How many leave days can I carry forward?". The company's policies are kept as Markdown documents. A model that is not given these documents answers from its training data, which does not contain the company's own rules, so its answers can be wrong.

The requirements are:

- Answer only from the company's policy documents.
- Return the policy document and section that each answer is based on, so that employees can check the original text.
- Return a clear "not found" response when the policies do not cover the question, instead of a guess.
- Never return an answer that cites a source that was not retrieved.
- Distinguish between invalid requests, an unavailable model provider, and an unusable model response.

## How it works

Retrieval-augmented generation (RAG) has two stages. The *ingestion* stage prepares the documents once. The *query* stage runs for every question.

```
Ingestion (at startup)                 Query (per request)

  policies/*.md                          POST /hr/ask {"question": ".."}
        │                                              │
        ▼                                              ▼
┌─────────────────────┐        ┌───────────────────────────────────┐
│ TextDataLoader      │        │ 1. validate the question          │
├─────────────────────┤        │ 2. retrieve the top K chunks ─────┼──────┐
│ MarkdownChunker     │        │ 3. drop chunks below min score    │      │
│ + source metadata   │        │ 4. generate a typed answer ───────┼──► LLM
├─────────────────────┤        │ 5. check the cited sources        │      │
│ knowledge base      │        └───────────────────────────────────┘      │
│   embed chunks ─────┼──► Embedding provider ◄── embed the question ─────┤
│   store vectors ────┼──► Vector store ◄──────── similarity search ──────┘
└─────────────────────┘
                               PolicyAnswer | 400 | 502 | 503
```

1. **Ingestion.** A data loader reads the policy documents. A chunker splits each document into smaller pieces (*chunks*), and the integration adds the document title and section headings to the metadata of each chunk. An embedding provider converts each chunk into a vector, and a vector store keeps the vectors together with the chunks. A *knowledge base* (`ai:VectorKnowledgeBase`) combines the embedding provider and the vector store, and performs the embedding and storing in one call.
2. **Retrieval.** The knowledge base embeds the question and returns the most similar chunks with a similarity score. Chunks below a minimum score are dropped. If none remain, the integration returns a "not found" answer without calling the model.
3. **Generation.** The remaining chunks are sent to the model as numbered excerpts (`S1`, `S2`, ...). The model returns a typed answer that states whether the excerpts contain the answer and lists the ids of the excerpts that it used.
4. **Attribution.** The integration maps the cited ids back to the document and section metadata of the excerpts. A cited id that was not sent to the model is treated as an invalid response.

The ingestion and query stages use the same `ai:KnowledgeBase` value. This guide keeps both stages in one service and uses an in-memory vector store so that the sample runs without any infrastructure. [Use a persistent vector store](#use-a-persistent-vector-store) explains how to move ingestion to a separate job.

## Set up the prerequisites

To complete this guide, you need:

1. Ballerina 2201.13.0 (Swan Lake Update 13) or later. Install [Ballerina](/downloads/), or use the `bal dist pull` command to update an existing installation.

    ```
    $ bal dist pull 2201.13.0
    ```

2. Access to an LLM and an embedding model. This guide uses OpenAI for both and requires an OpenAI API key. To use a different provider, see [Use a different model or embedding provider](#use-a-different-model-or-embedding-provider).

3. A text editor.

    >**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina extension</a> installed.

4. A command terminal.

## Create the package

Ballerina uses packages to group code. In the terminal, execute the command below to create a package for the integration.

> **Info:** For more information on Ballerina packages, see [Organize Ballerina code](/learn/organize-ballerina-code/).

```
$ bal new hr_policy_assistant
```

Remove the generated `main.bal` file. At the end of this guide, the package contains the files below.

```
hr_policy_assistant
├── Ballerina.toml
├── Config.toml
├── ingestion.bal
├── service.bal
├── policies
│   ├── expense-policy.md
│   ├── leave-policy.md
│   └── remote-work-policy.md
└── tests
    ├── Config.toml
    ├── ingestion_test.bal
    └── query_test.bal
```

- `ingestion.bal` contains the ingestion stage and the knowledge base.
- `service.bal` contains the query stage, exposed as an HTTP service.

## Add the policy documents

Create a `policies` directory in the package root and add the documents to ingest. The sample uses three short Markdown documents. Each document has a level-1 heading for its title and level-2 headings for its sections; the integration uses these headings as source metadata.

Create `policies/leave-policy.md`.

```markdown
# Leave policy

## Annual leave

Full-time employees receive 20 days of paid annual leave per calendar year. Leave accrues monthly at 1.67 days per month. Part-time employees receive annual leave in proportion to their contracted hours.

## Carry forward

Employees can carry forward up to 5 unused annual leave days to the next calendar year. Carried-forward days must be used before 31 March. Any carried-forward days that are not used by then are forfeited.

## Sick leave

Employees receive 10 days of paid sick leave per calendar year. A medical certificate is required for absences longer than 2 consecutive working days. Unused sick leave cannot be carried forward.

## Requesting leave

Submit leave requests through the HR portal at least 10 working days before the first day of leave. Your line manager approves or rejects the request within 3 working days.

## Appealing a rejected request

If a leave request is rejected, you can appeal within 5 working days by emailing hr-appeals@example.com with the request ID and the reason for the appeal. An HR business partner reviews the appeal and responds within 5 working days.
```

Create `policies/remote-work-policy.md`.

```markdown
# Remote work policy

## Eligibility

Employees who have completed their probation period are eligible to work remotely for up to 3 days per week, subject to line manager approval. Roles that require on-site equipment are not eligible.

## Equipment

The company provides a laptop, a monitor, and a headset for remote work. Employees can claim up to USD 300 once every 2 years for a desk or chair. Claims are submitted through the expense system with an itemized receipt.

## Working hours

Remote employees must be available during the core hours of 10:00 to 15:00 in their local time zone. Any change to regular working hours must be agreed with the line manager in advance.

## Working from another country

Working from a country other than your country of employment requires prior written approval from HR, and is limited to 30 days in a calendar year because of tax and immigration rules.
```

Create `policies/expense-policy.md`.

```markdown
# Travel and expense policy

## Submitting claims

Submit expense claims through the expense system within 30 days of incurring the expense. Each claim must include an itemized receipt. Claims older than 90 days are not reimbursed.

## Meals

When travelling on company business, employees can claim up to USD 60 per day for meals. Alcohol is not reimbursed.

## Air travel

Book economy class for flights shorter than 6 hours. Business class is allowed for flights of 6 hours or longer with director approval. All flights must be booked through the corporate travel portal.

## Accommodation

Hotel bookings must not exceed the nightly limit published for the destination city in the travel portal. Exceptions require approval from the finance team before booking.
```

>**Note:** `ai:TextDataLoader` supports Markdown (`.md`), HTML (`.html`, `.htm`), PDF (`.pdf`), Word (`.docx`), and PowerPoint (`.pptx`) files. Section headings are extracted from Markdown text in this guide; for other formats, add the metadata that your documents need in the same way.

## Configure the providers

The pipeline needs an embedding provider (`ai:EmbeddingProvider`) to convert text to vectors, and a model provider (`ai:ModelProvider`) to generate answers. Both are available for OpenAI in the [`ballerinax/ai.openai`](https://central.ballerina.io/ballerinax/ai.openai/latest) package.

Declare the API key as a [configurable variable](/learn/by-example/configurable-variables/) so that it is never hard-coded. The same key is used for both providers. Create a `Config.toml` file in the package root and add the key.

```toml
openAiApiKey = "<YOUR_OPENAI_API_KEY>"
```

>**Note:** Do not commit `Config.toml` files that contain secrets. In deployed environments, provide the value through an environment variable or a secret store instead. See [Provide values to configurable variables](/learn/provide-values-to-configurable-variables/).

The integration also reads the configurable values below. All of them have defaults, so you need to set them only to change the behavior.

| Variable | Default | Description |
|---|---|---|
| `policyFiles` | The three files in `policies/` | Paths of the documents to ingest. |
| `maxChunkSize` | `400` | Maximum number of characters in a chunk. |
| `maxOverlapSize` | `40` | Maximum number of characters repeated from the end of the previous chunk. |
| `ingestOnStartup` | `true` | Whether to ingest the documents when the service starts. |
| `port` | `8080` | Port of the HTTP listener. |
| `topK` | `5` | Maximum number of chunks to retrieve for a question. |
| `minSimilarity` | `0.3` | Minimum similarity score for a chunk to be sent to the model. |

## Implement the ingestion

Create an `ingestion.bal` file for the ingestion stage.

### Create the knowledge base

Create the embedding provider, the vector store, and the knowledge base at the module level, so that they are initialized once and shared by the ingestion code and by all requests.

```ballerina
import ballerina/ai;
import ballerina/log;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;
configurable string[] policyFiles = [
    "policies/leave-policy.md",
    "policies/remote-work-policy.md",
    "policies/expense-policy.md"
];
configurable int maxChunkSize = 400;
configurable int maxOverlapSize = 40;
configurable boolean ingestOnStartup = true;

final ai:EmbeddingProvider embeddingProvider =
        check new openai:EmbeddingProvider(openAiApiKey, openai:TEXT_EMBEDDING_3_SMALL);

final ai:VectorStore vectorStore = check new ai:InMemoryVectorStore();

// Documents are chunked explicitly in `chunkPolicy`, so chunking is disabled in the knowledge base.
final ai:KnowledgeBase knowledgeBase = new ai:VectorKnowledgeBase(vectorStore, embeddingProvider, ai:DISABLE);
```

- `ai:InMemoryVectorStore` keeps the vectors in memory and uses cosine similarity by default. The vectors are lost when the service stops, so the documents are ingested again on each start.
- The third argument of `ai:VectorKnowledgeBase` selects the chunker. The default, `ai:AUTO`, chooses a chunker based on the document type. Here, the documents are chunked before they are ingested so that metadata can be added to each chunk, and `ai:DISABLE` prevents the knowledge base from splitting the chunks again.

>**Info:** The embedding model used for ingestion must also be used for retrieval. Vectors produced by different embedding models cannot be compared.

### Chunk the documents and add source metadata

Use `ai:MarkdownChunker` to split each document. It splits at Markdown headings first, and falls back to smaller units, such as paragraphs and sentences, when a section is longer than `maxChunkSize`. Short sections can be combined into one chunk, and a long section can be split across several chunks.

The data loader sets the `fileName` metadata field of each document, and each chunk inherits the metadata of its document. `ai:Metadata` is an open record, so you can add your own fields. Add the document title and the sections that each chunk belongs to; these fields are used later to tell the caller where an answer comes from. A chunk that does not start with a heading continues the section of the previous chunk, so the chunks are processed in order and the last section is carried forward.

```ballerina
# Splits a policy document into chunks and adds source metadata to each chunk.
#
# + document - A policy document loaded from a Markdown file
# + return - The chunks of the document, or an error if the document cannot be chunked
isolated function chunkPolicy(ai:Document document) returns ai:Chunk[]|error {
    if document !is ai:TextDocument {
        return error("only text documents are supported");
    }
    string title = documentTitle(document.content) ?: document.metadata?.fileName ?: "Untitled";
    ai:Chunker chunker = new ai:MarkdownChunker(maxChunkSize, maxOverlapSize);

    ai:Chunk[] chunks = [];
    string? currentSection = ();
    foreach ai:Chunk chunk in check chunker.chunk(document) {
        anydata content = chunk.content;
        string[] sections = content is string ? chunkSections(content, currentSection) : [];
        if sections.length() > 0 {
            currentSection = sections[sections.length() - 1];
        }
        chunks.push(withSourceMetadata(chunk, title, sections));
    }
    return chunks;
}

# Returns the sections that a chunk belongs to.
# A chunk that does not start with a heading continues the section of the previous chunk.
#
# + content - The text of the chunk
# + currentSection - The last section of the previous chunk, if any
# + return - The section headings, in the order they appear
isolated function chunkSections(string content, string? currentSection) returns string[] {
    string[] sections = sectionHeadings(content);
    if currentSection is string && !content.trim().startsWith("#") && sections.indexOf(currentSection) is () {
        sections.unshift(currentSection);
    }
    return sections;
}

# Adds the document title and the section headings to the metadata of a chunk.
#
# + chunk - The chunk produced by the chunker
# + title - The title of the document that the chunk belongs to
# + sections - The sections that the chunk belongs to
# + return - A copy of the chunk with the source metadata
isolated function withSourceMetadata(ai:Chunk chunk, string title, string[] sections) returns ai:Chunk {
    ai:Metadata metadata = (chunk.metadata ?: {}).clone();
    metadata["documentTitle"] = title;
    metadata["sections"] = sections;
    ai:Chunk result = chunk.clone();
    result.metadata = metadata;
    return result;
}
```

The `documentTitle` and `sectionHeadings` helper functions read the Markdown headings. They are included in [the complete `ingestion.bal` file](#the-complete-ingestionbal-file). `sectionHeadings` ignores a heading that has no text after it in the chunk, because the chunker can end a chunk with the heading of the next section.

>**Tip:** Chunk size is a trade-off. Small chunks match questions precisely but can lose the surrounding context; large chunks keep the context but add unrelated text to the prompt. Start with chunks of a few hundred characters with some overlap, and adjust them by testing with real questions.

### Ingest the documents

Load the documents with `ai:TextDataLoader`, chunk them, and pass the chunks to the `ingest` method of the knowledge base. The knowledge base embeds all chunks in a batch and adds them to the vector store.

```ballerina
# Loads, chunks, embeds, and stores the policy documents.
#
# + paths - The paths of the policy documents
# + return - An error if any step of the ingestion fails
function ingestPolicies(string[] paths) returns error? {
    ai:DataLoader loader = check new ai:TextDataLoader(...paths);
    ai:Document|ai:Document[] loaded = check loader.load();
    ai:Document[] documents = loaded is ai:Document[] ? loaded : [loaded];

    ai:Chunk[] chunks = [];
    foreach ai:Document document in documents {
        chunks.push(...check chunkPolicy(document));
    }

    check knowledgeBase.ingest(chunks);
    log:printInfo("Ingested policy documents", documents = documents.length(), chunks = chunks.length());
}
```

`load` returns a single `ai:Document` when it is given one path, and an array otherwise, so the result is normalized to an array.

Call the function from the module's `init` function. The `init` function runs before the HTTP listener starts, so the service accepts requests only after the documents are ingested. If ingestion fails, for example because a file is missing or the embedding provider rejects the request, the error is returned from `init` and the program stops instead of serving answers from an empty knowledge base.

```ballerina
function init() returns error? {
    if ingestOnStartup {
        check ingestPolicies(policyFiles);
    }
}
```

## Implement the query service

Create a `service.bal` file for the query stage.

### Define the types

Define the request type, the excerpt type that is sent to the model, the type that the model must return, and the response type. The model provider generates a JSON schema from `GeneratedAnswer` and sends it with the prompt, and the documentation of each field becomes part of that schema.

```ballerina
# A question from an employee.
type AskRequest record {|
    # The question about an HR policy
    string question;
|};

# A policy excerpt that is sent to the model as context.
type SourceExcerpt record {|
    # Identifier of the excerpt, used by the model to cite it
    string id;
    # File name of the policy document
    string document;
    # Title of the policy document
    string title;
    # Section headings in the excerpt
    string[] sections;
    # The text of the excerpt
    string content;
|};

# The answer generated by the model.
type GeneratedAnswer record {|
    # The answer to the question, based only on the provided excerpts
    string answer;
    # Whether the excerpts contain the information needed to answer the question
    boolean answerFound;
    # The ids of the excerpts that support the answer, for example "S1"
    string[] sourceIds;
|};

# A policy document section that an answer is based on.
type Source record {|
    # File name of the policy document
    string document;
    # Title of the policy document
    string title;
    # Section headings in the cited excerpt
    string[] sections;
|};

# The answer returned to the caller.
type PolicyAnswer record {|
    # The answer to the question
    string answer;
    # Whether the answer was found in the policies
    boolean answerFound;
    # The policy sections that the answer is based on
    Source[] sources;
|};
```

The model returns excerpt ids rather than document names. Ids are short and can be checked exactly against the excerpts that were sent, so the document names and sections that are returned to the caller always come from the chunk metadata, not from text written by the model.

### Configure the model provider and the service

Create the model provider at the module level, and declare the retrieval settings and the response that is returned when the policies do not cover a question.

```ballerina
import ballerina/ai;
import ballerina/http;
import ballerina/log;
import ballerinax/ai.openai;

configurable int port = 8080;
configurable int topK = 5;
configurable float minSimilarity = 0.3;

const MAX_QUESTION_LENGTH = 500;
const NO_ANSWER = "I could not find this in the HR policies. Contact HR for help.";

final ai:ModelProvider model = check new openai:ModelProvider(openAiApiKey, openai:GPT_4O);
```

Add an HTTP service with a `POST` resource that accepts the question. The return type lists every possible outcome. See [HTTP service data binding](/learn/by-example/http-service-data-binding/) for how the JSON payload is bound to `AskRequest`.

```ballerina
service /hr on new http:Listener(port) {
    resource function post ask(AskRequest request)
            returns PolicyAnswer|http:BadRequest|http:BadGateway|http:ServiceUnavailable {
        string|error question = validateQuestion(request.question);
        if question is error {
            return <http:BadRequest>{body: question.message()};
        }
        // ...
    }
}
```

Validate the question before it is embedded, so that empty or oversized requests do not use the embedding provider or the model.

```ballerina
# Validates and normalizes a question before it is used for retrieval.
#
# + question - The question from the request
# + return - The trimmed question, or an error if it is empty or too long
isolated function validateQuestion(string question) returns string|error {
    string trimmed = question.trim();
    if trimmed.length() == 0 {
        return error("question must not be empty");
    }
    if trimmed.length() > MAX_QUESTION_LENGTH {
        return error(string `question must not exceed ${MAX_QUESTION_LENGTH} characters`);
    }
    return trimmed;
}
```

### Retrieve relevant content

Call the `retrieve` method of the knowledge base. It embeds the question with the same embedding provider that was used for ingestion and returns up to `topK` matches (`ai:QueryMatch`), each with the chunk and its similarity score, ordered from the most similar.

```ballerina
ai:QueryMatch[]|ai:Error matches = knowledgeBase.retrieve(question, topK);
if matches is ai:Error {
    log:printError("Failed to retrieve policy excerpts", matches);
    return <http:ServiceUnavailable>{body: "The policy assistant is temporarily unavailable"};
}
```

`retrieve` always returns the closest matches, even when none of them is related to the question. Keep only the matches whose score is at least `minSimilarity`, and convert them to excerpts with ids and source metadata.

```ballerina
# Keeps the matches that are similar enough to the question and converts them to excerpts.
#
# + matches - The matches returned by the knowledge base, ordered by similarity
# + minScore - The minimum similarity score for a match to be used
# + return - The excerpts, each with a unique id
isolated function selectExcerpts(ai:QueryMatch[] matches, float minScore) returns SourceExcerpt[] {
    SourceExcerpt[] excerpts = [];
    foreach ai:QueryMatch queryMatch in matches {
        anydata content = queryMatch.chunk.content;
        if queryMatch.similarityScore < minScore || content !is string {
            continue;
        }
        ai:Metadata metadata = queryMatch.chunk.metadata ?: {};
        string document = metadata.fileName ?: "unknown";
        json title = metadata["documentTitle"];
        excerpts.push({
            id: string `S${excerpts.length() + 1}`,
            document,
            title: title is string ? title : document,
            sections: toStrings(metadata["sections"]),
            content
        });
    }
    return excerpts;
}
```

The `toStrings` helper function reads the `sections` array from the metadata. It is included in [the complete `service.bal` file](#the-complete-servicebal-file).

>**Note:** The right `minSimilarity` value depends on the embedding model, the documents, and the similarity metric. The default of `0.3` is a starting point for cosine similarity. Log the scores for a set of related and unrelated questions, and choose a value that separates them.

If no excerpt remains, return the "not found" answer without calling the model.

```ballerina
SourceExcerpt[] excerpts = selectExcerpts(matches, minSimilarity);
if excerpts.length() == 0 {
    log:printInfo("No relevant policy excerpts found");
    return {answer: NO_ANSWER, answerFound: false, sources: []};
}
```

To narrow retrieval to a subset of documents, pass `ai:MetadataFilters` as the third argument of `retrieve`. For example, `{filters: [{key: "fileName", value: "leave-policy.md"}]}` searches only the leave policy.

### Generate the answer

Call the `generate` method of the model provider with a prompt that contains the excerpts and the question. The excerpts are inserted as JSON, so the model sees the id, title, sections, and content of each one. Assign the result to a variable of type `GeneratedAnswer|ai:Error`, so that the response is bound to `GeneratedAnswer`.

```ballerina
GeneratedAnswer|ai:Error generated = model->generate(`
    You are an HR policy assistant. Answer the employee's question using only the
    policy excerpts below. Do not use any other knowledge.

    If the excerpts do not contain the answer, set answerFound to false and
    return an empty sourceIds array. Otherwise, set answerFound to true and
    include the id of every excerpt that you used in sourceIds.

    Excerpts:
    ${excerpts}

    Question: ${question}`);
```

>**Info:** If you do not need source attribution, use `ai:augmentUserQuery` to build a chat message from the matches and the question with a generic prompt, and send it with the `chat` method of the model provider. See [RAG with in-memory vector store](/learn/by-example/rag-with-in-memory-vector-store/).

>**Note:** The retrieved content and the question become part of the prompt. Ingest only documents that may be sent to the model provider, and treat both the question and the document content as untrusted input to the model.

### Handle failures

Each stage of the pipeline can fail independently, and each failure is reported differently.

| Failure | Where it is detected | Result |
|---|---|---|
| A policy file is missing, or the documents cannot be embedded at startup | `init` | The program stops with the error. |
| The question is empty or too long | `validateQuestion` | `400 Bad Request`, without calling any provider. |
| The question cannot be embedded, or the vector store cannot be queried | `retrieve` | `503 Service Unavailable`. |
| No chunk is similar enough to the question | `selectExcerpts` | `200 OK` with `answerFound: false`, without calling the model. |
| The model provider cannot be reached or rejects the request, or the model response cannot be bound to `GeneratedAnswer` | `generate` (`ai:Error`) | `502 Bad Gateway`. |
| The answer cites an unknown excerpt, or no excerpt | `resolveSources` | `502 Bad Gateway`. |

Handle the errors from `generate` as shown below. The error type for a particular failure depends on the model provider implementation. The OpenAI model provider reports HTTP errors and connection failures in a `generate` call as an `ai:Error` with the message `LLM call failed: ...`, not as an `ai:LlmConnectionError`, so the service cannot reliably tell an unreachable model provider apart from other failures, and reports every failure of the model call as `502 Bad Gateway`. The details are logged for operators but not returned to the caller. See [Handle failures](/learn/add-an-llm-step-to-an-integration/#handle-failures) in the LLM step guide.

```ballerina
if generated is ai:Error {
    log:printError("Failed to generate an answer", generated);
    return <http:BadGateway>{body: "Could not generate an answer"};
}
```

### Validate the answer and attach the sources

Check the model response in a separate function so that the rules can be tested without calling the model. If the model reports that the excerpts do not contain the answer, the function returns the standard "not found" answer. Otherwise, each cited id must match an excerpt that was sent to the model, and the answer must cite at least one. The sources are deduplicated, because several excerpts can come from the same section.

```ballerina
# Checks the model's citations against the excerpts and builds the answer for the caller.
#
# + generated - The answer generated by the model
# + excerpts - The excerpts that were sent to the model
# + return - The answer with its sources, or an error if the model response is not usable
isolated function resolveSources(GeneratedAnswer generated, SourceExcerpt[] excerpts) returns PolicyAnswer|error {
    if !generated.answerFound {
        return {answer: NO_ANSWER, answerFound: false, sources: []};
    }
    if generated.answer.trim().length() == 0 {
        return error("model returned an empty answer");
    }
    if generated.sourceIds.length() == 0 {
        return error("model returned an answer without citing a source");
    }

    Source[] sources = [];
    foreach string id in generated.sourceIds {
        SourceExcerpt[] cited = excerpts.filter(excerpt => excerpt.id == id);
        if cited.length() == 0 {
            return error(string `model cited an unknown source: ${id}`);
        }
        Source citedSource = {document: cited[0].document, title: cited[0].title, sections: cited[0].sections};
        if sources.indexOf(citedSource) is () {
            sources.push(citedSource);
        }
    }
    return {answer: generated.answer, answerFound: true, sources};
}
```

Call it from the resource and return the result.

```ballerina
PolicyAnswer|error answer = resolveSources(generated, excerpts);
if answer is error {
    log:printWarn("Model response failed validation", 'error = answer);
    return <http:BadGateway>{body: "Could not generate a valid answer"};
}
return answer;
```

>**Note:** These checks confirm that every cited source was retrieved. They do not prove that the answer text is supported by the cited excerpts. To measure that, evaluate the assistant against a set of questions with known answers. See [Evaluate agent behavior](/learn/evaluate-agent-behavior/).

## The complete `ingestion.bal` file

```ballerina
import ballerina/ai;
import ballerina/log;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;
configurable string[] policyFiles = [
    "policies/leave-policy.md",
    "policies/remote-work-policy.md",
    "policies/expense-policy.md"
];
configurable int maxChunkSize = 400;
configurable int maxOverlapSize = 40;
configurable boolean ingestOnStartup = true;

final ai:EmbeddingProvider embeddingProvider =
        check new openai:EmbeddingProvider(openAiApiKey, openai:TEXT_EMBEDDING_3_SMALL);

final ai:VectorStore vectorStore = check new ai:InMemoryVectorStore();

// Documents are chunked explicitly in `chunkPolicy`, so chunking is disabled in the knowledge base.
final ai:KnowledgeBase knowledgeBase = new ai:VectorKnowledgeBase(vectorStore, embeddingProvider, ai:DISABLE);

function init() returns error? {
    if ingestOnStartup {
        check ingestPolicies(policyFiles);
    }
}

# Loads, chunks, embeds, and stores the policy documents.
#
# + paths - The paths of the policy documents
# + return - An error if any step of the ingestion fails
function ingestPolicies(string[] paths) returns error? {
    ai:DataLoader loader = check new ai:TextDataLoader(...paths);
    ai:Document|ai:Document[] loaded = check loader.load();
    ai:Document[] documents = loaded is ai:Document[] ? loaded : [loaded];

    ai:Chunk[] chunks = [];
    foreach ai:Document document in documents {
        chunks.push(...check chunkPolicy(document));
    }

    check knowledgeBase.ingest(chunks);
    log:printInfo("Ingested policy documents", documents = documents.length(), chunks = chunks.length());
}

# Splits a policy document into chunks and adds source metadata to each chunk.
#
# + document - A policy document loaded from a Markdown file
# + return - The chunks of the document, or an error if the document cannot be chunked
isolated function chunkPolicy(ai:Document document) returns ai:Chunk[]|error {
    if document !is ai:TextDocument {
        return error("only text documents are supported");
    }
    string title = documentTitle(document.content) ?: document.metadata?.fileName ?: "Untitled";
    ai:Chunker chunker = new ai:MarkdownChunker(maxChunkSize, maxOverlapSize);

    ai:Chunk[] chunks = [];
    string? currentSection = ();
    foreach ai:Chunk chunk in check chunker.chunk(document) {
        anydata content = chunk.content;
        string[] sections = content is string ? chunkSections(content, currentSection) : [];
        if sections.length() > 0 {
            currentSection = sections[sections.length() - 1];
        }
        chunks.push(withSourceMetadata(chunk, title, sections));
    }
    return chunks;
}

# Returns the sections that a chunk belongs to.
# A chunk that does not start with a heading continues the section of the previous chunk.
#
# + content - The text of the chunk
# + currentSection - The last section of the previous chunk, if any
# + return - The section headings, in the order they appear
isolated function chunkSections(string content, string? currentSection) returns string[] {
    string[] sections = sectionHeadings(content);
    if currentSection is string && !content.trim().startsWith("#") && sections.indexOf(currentSection) is () {
        sections.unshift(currentSection);
    }
    return sections;
}

# Adds the document title and the section headings to the metadata of a chunk.
#
# + chunk - The chunk produced by the chunker
# + title - The title of the document that the chunk belongs to
# + sections - The sections that the chunk belongs to
# + return - A copy of the chunk with the source metadata
isolated function withSourceMetadata(ai:Chunk chunk, string title, string[] sections) returns ai:Chunk {
    ai:Metadata metadata = (chunk.metadata ?: {}).clone();
    metadata["documentTitle"] = title;
    metadata["sections"] = sections;
    ai:Chunk result = chunk.clone();
    result.metadata = metadata;
    return result;
}

# Returns the text of the first level-1 Markdown heading.
#
# + content - Markdown content
# + return - The title, or `()` if the content has no level-1 heading
isolated function documentTitle(string content) returns string? {
    foreach string line in re `\n`.split(content) {
        if line.startsWith("# ") {
            return line.substring(2).trim();
        }
    }
    return ();
}

# Returns the level-2 Markdown headings that are followed by text in the content.
# A heading at the end of a chunk without any text after it is ignored.
#
# + content - Markdown content
# + return - The section headings, in the order they appear
isolated function sectionHeadings(string content) returns string[] {
    string[] sections = [];
    string? heading = ();
    foreach string line in re `\n`.split(content) {
        if line.startsWith("## ") {
            heading = line.substring(3).trim();
        } else if heading is string && line.trim().length() > 0 {
            sections.push(heading);
            heading = ();
        }
    }
    return sections;
}
```

## The complete `service.bal` file

```ballerina
import ballerina/ai;
import ballerina/http;
import ballerina/log;
import ballerinax/ai.openai;

configurable int port = 8080;
configurable int topK = 5;
configurable float minSimilarity = 0.3;

const MAX_QUESTION_LENGTH = 500;
const NO_ANSWER = "I could not find this in the HR policies. Contact HR for help.";

final ai:ModelProvider model = check new openai:ModelProvider(openAiApiKey, openai:GPT_4O);

# A question from an employee.
type AskRequest record {|
    # The question about an HR policy
    string question;
|};

# A policy excerpt that is sent to the model as context.
type SourceExcerpt record {|
    # Identifier of the excerpt, used by the model to cite it
    string id;
    # File name of the policy document
    string document;
    # Title of the policy document
    string title;
    # Section headings in the excerpt
    string[] sections;
    # The text of the excerpt
    string content;
|};

# The answer generated by the model.
type GeneratedAnswer record {|
    # The answer to the question, based only on the provided excerpts
    string answer;
    # Whether the excerpts contain the information needed to answer the question
    boolean answerFound;
    # The ids of the excerpts that support the answer, for example "S1"
    string[] sourceIds;
|};

# A policy document section that an answer is based on.
type Source record {|
    # File name of the policy document
    string document;
    # Title of the policy document
    string title;
    # Section headings in the cited excerpt
    string[] sections;
|};

# The answer returned to the caller.
type PolicyAnswer record {|
    # The answer to the question
    string answer;
    # Whether the answer was found in the policies
    boolean answerFound;
    # The policy sections that the answer is based on
    Source[] sources;
|};

service /hr on new http:Listener(port) {
    resource function post ask(AskRequest request)
            returns PolicyAnswer|http:BadRequest|http:BadGateway|http:ServiceUnavailable {
        string|error question = validateQuestion(request.question);
        if question is error {
            return <http:BadRequest>{body: question.message()};
        }

        ai:QueryMatch[]|ai:Error matches = knowledgeBase.retrieve(question, topK);
        if matches is ai:Error {
            log:printError("Failed to retrieve policy excerpts", matches);
            return <http:ServiceUnavailable>{body: "The policy assistant is temporarily unavailable"};
        }

        SourceExcerpt[] excerpts = selectExcerpts(matches, minSimilarity);
        if excerpts.length() == 0 {
            log:printInfo("No relevant policy excerpts found");
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

        if generated is ai:Error {
            log:printError("Failed to generate an answer", generated);
            return <http:BadGateway>{body: "Could not generate an answer"};
        }

        PolicyAnswer|error answer = resolveSources(generated, excerpts);
        if answer is error {
            log:printWarn("Model response failed validation", 'error = answer);
            return <http:BadGateway>{body: "Could not generate a valid answer"};
        }
        return answer;
    }
}

# Validates and normalizes a question before it is used for retrieval.
#
# + question - The question from the request
# + return - The trimmed question, or an error if it is empty or too long
isolated function validateQuestion(string question) returns string|error {
    string trimmed = question.trim();
    if trimmed.length() == 0 {
        return error("question must not be empty");
    }
    if trimmed.length() > MAX_QUESTION_LENGTH {
        return error(string `question must not exceed ${MAX_QUESTION_LENGTH} characters`);
    }
    return trimmed;
}

# Keeps the matches that are similar enough to the question and converts them to excerpts.
#
# + matches - The matches returned by the knowledge base, ordered by similarity
# + minScore - The minimum similarity score for a match to be used
# + return - The excerpts, each with a unique id
isolated function selectExcerpts(ai:QueryMatch[] matches, float minScore) returns SourceExcerpt[] {
    SourceExcerpt[] excerpts = [];
    foreach ai:QueryMatch queryMatch in matches {
        anydata content = queryMatch.chunk.content;
        if queryMatch.similarityScore < minScore || content !is string {
            continue;
        }
        ai:Metadata metadata = queryMatch.chunk.metadata ?: {};
        string document = metadata.fileName ?: "unknown";
        json title = metadata["documentTitle"];
        excerpts.push({
            id: string `S${excerpts.length() + 1}`,
            document,
            title: title is string ? title : document,
            sections: toStrings(metadata["sections"]),
            content
        });
    }
    return excerpts;
}

# Returns the string members of a JSON array from chunk metadata.
#
# + value - The metadata value
# + return - The string members, or an empty array if the value is not an array
isolated function toStrings(json value) returns string[] {
    if value !is json[] {
        return [];
    }
    return from json item in value
        where item is string
        select item;
}

# Checks the model's citations against the excerpts and builds the answer for the caller.
#
# + generated - The answer generated by the model
# + excerpts - The excerpts that were sent to the model
# + return - The answer with its sources, or an error if the model response is not usable
isolated function resolveSources(GeneratedAnswer generated, SourceExcerpt[] excerpts) returns PolicyAnswer|error {
    if !generated.answerFound {
        return {answer: NO_ANSWER, answerFound: false, sources: []};
    }
    if generated.answer.trim().length() == 0 {
        return error("model returned an empty answer");
    }
    if generated.sourceIds.length() == 0 {
        return error("model returned an answer without citing a source");
    }

    Source[] sources = [];
    foreach string id in generated.sourceIds {
        SourceExcerpt[] cited = excerpts.filter(excerpt => excerpt.id == id);
        if cited.length() == 0 {
            return error(string `model cited an unknown source: ${id}`);
        }
        Source citedSource = {document: cited[0].document, title: cited[0].title, sections: cited[0].sections};
        if sources.indexOf(citedSource) is () {
            sources.push(citedSource);
        }
    }
    return {answer: generated.answer, answerFound: true, sources};
}
```

## Test the pipeline

Model and embedding responses vary between calls, so test the deterministic parts of the pipeline with fixed inputs: chunking and section metadata, question validation, filtering by score, and the citation checks.

> **Info:** For more information, see [Test Ballerina code](/learn/test-ballerina-code/test-a-simple-function/).

The module-level providers are initialized when the tests run, so add a `tests/Config.toml` file with a placeholder key. Set `ingestOnStartup` to `false` so that the tests do not call the embedding provider, and use a separate port for the service that the tests start.

```toml
openAiApiKey = "test-key"
ingestOnStartup = false
port = 9611
```

Create a `tests/ingestion_test.bal` file to test the chunking. The test loads a real policy file and checks that every chunk carries the source metadata. Chunking does not call any provider.

```ballerina
import ballerina/ai;
import ballerina/test;

@test:Config
function testChunksCarrySourceMetadata() returns error? {
    ai:DataLoader loader = check new ai:TextDataLoader("policies/leave-policy.md");
    ai:Document|ai:Document[] loaded = check loader.load();
    test:assertTrue(loaded is ai:Document);

    ai:Chunk[] chunks = check chunkPolicy(<ai:Document>loaded);
    test:assertTrue(chunks.length() > 1);
    foreach ai:Chunk chunk in chunks {
        ai:Metadata metadata = chunk.metadata ?: {};
        test:assertEquals(metadata.fileName, "leave-policy.md");
        test:assertEquals(metadata["documentTitle"], "Leave policy");
        test:assertTrue(toStrings(metadata["sections"]).length() > 0);
    }
}

@test:Config
function testHeadingsAreExtracted() {
    string content = "# Leave policy\n\n## Annual leave\n\nText.\n\n## Sick leave\n\nMore text.\n\n## Carry forward\n";
    test:assertEquals(documentTitle(content), "Leave policy");
    // "Carry forward" has no text in this chunk, so it is not a section of the chunk.
    test:assertEquals(sectionHeadings(content), ["Annual leave", "Sick leave"]);
    test:assertEquals(documentTitle("No heading"), ());
}

@test:Config
function testContinuationChunkKeepsSection() {
    test:assertEquals(chunkSections("cannot be carried forward.", "Sick leave"), ["Sick leave"]);
    test:assertEquals(chunkSections("\n## Meals\n\nUp to USD 60.", "Submitting claims"), ["Meals"]);
    test:assertEquals(chunkSections("Text without a heading.", ()), []);
}
```

Create a `tests/query_test.bal` file to test the query stage. The last test sends a blank question to the running service and checks that it is rejected before any provider is called.

```ballerina
import ballerina/ai;
import ballerina/http;
import ballerina/test;

final SourceExcerpt[] & readonly sampleExcerpts = [
    {
        id: "S1",
        document: "leave-policy.md",
        title: "Leave policy",
        sections: ["Carry forward"],
        content: "Employees can carry forward up to 5 unused annual leave days."
    },
    {
        id: "S2",
        document: "leave-policy.md",
        title: "Leave policy",
        sections: ["Annual leave"],
        content: "Full-time employees receive 20 days of paid annual leave."
    }
];

@test:Config
function testQuestionValidation() returns error? {
    test:assertEquals(check validateQuestion("  How many leave days do I get?  "), "How many leave days do I get?");
    test:assertTrue(validateQuestion("   ") is error);
    test:assertTrue(validateQuestion("".padStart(MAX_QUESTION_LENGTH + 1, "a")) is error);
}

@test:Config
function testLowScoringMatchesAreDropped() {
    ai:QueryMatch[] matches = [
        {
            chunk: <ai:TextChunk>{
                content: "## Carry forward\n\nEmployees can carry forward up to 5 days.",
                metadata: {fileName: "leave-policy.md", "documentTitle": "Leave policy", "sections": ["Carry forward"]}
            },
            similarityScore: 0.62
        },
        {
            chunk: <ai:TextChunk>{content: "## Meals\n\nUp to USD 60 per day.", metadata: {fileName: "expense-policy.md"}},
            similarityScore: 0.12
        }
    ];
    SourceExcerpt[] excerpts = selectExcerpts(matches, 0.3);
    test:assertEquals(excerpts.length(), 1);
    test:assertEquals(excerpts[0].id, "S1");
    test:assertEquals(excerpts[0].title, "Leave policy");
    test:assertEquals(excerpts[0].sections, ["Carry forward"]);
}

@test:Config
function testMissingMetadataFallsBack() {
    ai:QueryMatch[] matches = [{chunk: <ai:TextChunk>{content: "Some text."}, similarityScore: 0.9}];
    SourceExcerpt[] excerpts = selectExcerpts(matches, 0.3);
    test:assertEquals(excerpts[0].document, "unknown");
    test:assertEquals(excerpts[0].title, "unknown");
    test:assertEquals(excerpts[0].sections, []);
}

@test:Config
function testCitationsAreResolved() returns error? {
    PolicyAnswer answer = check resolveSources(
            {answer: "You can carry forward up to 5 days.", answerFound: true, sourceIds: ["S1", "S1"]},
            sampleExcerpts);
    test:assertEquals(answer.sources, [{document: "leave-policy.md", title: "Leave policy", sections: ["Carry forward"]}]);
}

@test:Config
function testUnknownCitationIsRejected() {
    test:assertTrue(resolveSources({answer: "Yes.", answerFound: true, sourceIds: ["S9"]}, sampleExcerpts) is error);
}

@test:Config
function testAnswerWithoutCitationIsRejected() {
    test:assertTrue(resolveSources({answer: "Yes.", answerFound: true, sourceIds: []}, sampleExcerpts) is error);
}

@test:Config
function testNotFoundAnswerHasNoSources() returns error? {
    PolicyAnswer answer = check resolveSources({answer: "", answerFound: false, sourceIds: ["S1"]}, sampleExcerpts);
    test:assertEquals(answer, {answer: NO_ANSWER, answerFound: false, sources: []});
}

@test:Config
function testBlankQuestionIsRejectedByService() returns error? {
    http:Client hrClient = check new ("http://localhost:9611/hr");
    http:Response response = check hrClient->post("/ask", {question: " "});
    test:assertEquals(response.statusCode, 400);
}
```

Run the tests.

```
$ bal test
```

```
Running Tests

	hr_policy_assistant
		[pass] testAnswerWithoutCitationIsRejected
		[pass] testBlankQuestionIsRejectedByService
		[pass] testChunksCarrySourceMetadata
		[pass] testCitationsAreResolved
		[pass] testContinuationChunkKeepsSection
		[pass] testHeadingsAreExtracted
		[pass] testLowScoringMatchesAreDropped
		[pass] testMissingMetadataFallsBack
		[pass] testNotFoundAnswerHasNoSources
		[pass] testQuestionValidation
		[pass] testUnknownCitationIsRejected


		11 passing
		0 failing
		0 skipped
```

## Run the integration

Execute the command below to run the service. The policy documents are ingested before the listener starts.

```
$ bal run
```

You view the output below. The number of chunks depends on the documents and the chunk size settings.

```
Compiling source
        ballerina_tutorials/hr_policy_assistant:0.1.0

Running executable

time=... level=INFO module=ballerina_tutorials/hr_policy_assistant message="Ingested policy documents" documents=3 chunks=12
```

If the API key is not valid, ingestion fails and the program stops before the service starts.

```
error: Unable to obtain embedding for the provided document
```

## Try the integration

Ask a question that the policies answer. Because the answer is generated by an LLM, your results will differ. The response below is illustrative.

```
$ curl -X POST http://localhost:8080/hr/ask \
    -H "Content-Type: application/json" \
    -d '{"question": "How many unused annual leave days can I carry forward?"}'
{"answer":"You can carry forward up to 5 unused annual leave days to the next calendar year. You must use them before 31 March, or they are forfeited.", "answerFound":true, "sources":[{"document":"leave-policy.md", "title":"Leave policy", "sections":["Carry forward"]}]}
```

The `sources` array comes from the chunk metadata. Depending on how the documents were chunked, a source can list more than one section.

Ask a question that the policies do not cover. Depending on the similarity scores, the "not found" answer is returned either before the model is called or after the model reports that the excerpts do not contain the answer.

```
$ curl -X POST http://localhost:8080/hr/ask \
    -H "Content-Type: application/json" \
    -d '{"question": "What is the parking policy at the head office?"}'
{"answer":"I could not find this in the HR policies. Contact HR for help.", "answerFound":false, "sources":[]}
```

Verify the input validation by sending a blank question. The request is rejected without calling any provider.

```
$ curl -i -X POST http://localhost:8080/hr/ask \
    -H "Content-Type: application/json" \
    -d '{"question": "   "}'
HTTP/1.1 400 Bad Request
...
question must not be empty
```

## Extend the integration

### Use a persistent vector store

The in-memory vector store is lost when the service stops, and every service instance must ingest all documents again. For production, store the vectors in a vector database. Vector stores for the following databases implement `ai:VectorStore`:

| Database | Package | Required constructor arguments |
|---|---|---|
| PostgreSQL with pgvector | [`ballerinax/ai.pgvector`](https://central.ballerina.io/ballerinax/ai.pgvector/latest) | Host, user, password, and database name |
| Pinecone | [`ballerinax/ai.pinecone`](https://central.ballerina.io/ballerinax/ai.pinecone/latest) | Index service URL and API key |
| Weaviate | [`ballerinax/ai.weaviate`](https://central.ballerina.io/ballerinax/ai.weaviate/latest) | Service URL, API key, and a configuration with the name of an existing collection |
| Milvus | [`ballerinax/ai.milvus`](https://central.ballerina.io/ballerinax/ai.milvus/latest) | Service URL, API key, and a configuration with the collection name |

Because the knowledge base depends only on the `ai:VectorStore` type, changing the store changes only its declaration. For example, to use pgvector, replace the `vectorStore` declaration in `ingestion.bal` with the code below and add the database settings to `Config.toml`. The vector dimension must match the embedding model; `text-embedding-3-small` produces 1536-dimensional vectors.

```ballerina
import ballerinax/ai.pgvector;

configurable string dbHost = ?;
configurable string dbUser = ?;
configurable string dbPassword = ?;
configurable string dbName = ?;

// `text-embedding-3-small` produces 1536-dimensional vectors.
final ai:VectorStore vectorStore = check new pgvector:VectorStore(dbHost, dbUser, dbPassword, dbName,
    tableName = "hr_policies", configs = {vectorDimension: 1536});
```

The pgvector store creates the `vector` extension, the table, and an index when it is initialized, and stores the chunk metadata, including the `documentTitle` and `sections` fields, as JSON. For other databases, check how custom metadata fields are stored before you rely on them for attribution.

With a persistent store, separate ingestion from the query service:

1. Set `ingestOnStartup = false` in the `Config.toml` file of the service, so that the service only queries the store.
2. Create a separate package that runs the ingestion as a job, for example when the policies change. It declares the same embedding provider and vector store, and reuses `ingestPolicies`, `chunkPolicy`, and the helper functions from `ingestion.bal`, with a `main` function in place of `init`.

    ```ballerina
    public function main(string... paths) returns error? {
        check ingestPolicies(paths);
    }
    ```

Ingesting the same document twice adds its chunks again. Before you ingest a new version of a document, remove its existing chunks with `deleteByFilter`, for example `check knowledgeBase.deleteByFilter({filters: [{key: "fileName", value: "leave-policy.md"}]});`.

For complete examples of each stage with an external vector store, see [RAG ingestion with external vector store](/learn/by-example/rag-ingestion-with-external-vector-store/) and [RAG query with external vector store](/learn/by-example/rag-query-with-external-vector-store/).

### Use a different model or embedding provider

The pipeline depends only on the `ai:ModelProvider` and `ai:EmbeddingProvider` types, so you can switch providers by changing the imports and the initialization. Embedding providers are also available in packages such as [`ballerinax/ai.azure`](https://central.ballerina.io/ballerinax/ai.azure/latest) and [`ballerinax/ai.googleapis.vertex`](https://central.ballerina.io/ballerinax/ai.googleapis.vertex/latest). If you change the embedding model, ingest all documents again.

The `ballerina/ai` module also provides a default model provider and a default embedding provider, which let you try out the pipeline without your own LLM keys.

```ballerina
final ai:EmbeddingProvider embeddingProvider = check ai:getDefaultEmbeddingProvider();
final ai:ModelProvider model = check ai:getDefaultModelProvider();
```

>**Info: Requires tooling.** The configuration for the default providers is generated by a command in the Ballerina VS Code extension (also available in WSO2 Integrator). Log in to WSO2 Copilot, open the VS Code command palette (`Ctrl + Shift + P` or `command + shift + P`) with the project open, and run `Configure default WSO2 Model Provider`. This adds the required configuration to the `Config.toml` file. The default providers are subject to rate limits and other usage constraints, so use your own providers for production workloads.

### Expose the knowledge base to an agent

Instead of answering every question with a fixed pipeline, you can give an agent a tool that searches the knowledge base, and let the agent decide when to use it. See [Build an agent that uses enterprise systems](/learn/build-an-agent-that-uses-enterprise-systems/).

## Learn more

- [AI integrations overview](/learn/ai-integrations-overview/)
- [Add an LLM step to an integration](/learn/add-an-llm-step-to-an-integration/)
- [Build an agent that uses enterprise systems](/learn/build-an-agent-that-uses-enterprise-systems/)
- [Evaluate agent behavior](/learn/evaluate-agent-behavior/)
- [Observe and secure AI integrations](/learn/observe-and-secure-ai-integrations/)
- [RAG with in-memory vector store](/learn/by-example/rag-with-in-memory-vector-store/) — Ballerina by Example
- [RAG ingestion with external vector store](/learn/by-example/rag-ingestion-with-external-vector-store/) — Ballerina by Example
- [RAG query with external vector store](/learn/by-example/rag-query-with-external-vector-store/) — Ballerina by Example
- [Direct LLM calls](/learn/by-example/direct-llm-calls/) — Ballerina by Example
- [`ballerina/ai` module](https://lib.ballerina.io/ballerina/ai/latest/) — API documentation
