import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `import ballerina/ai;
import ballerina/file;
import ballerina/io;
import ballerina/uuid;

# A vector entry as it is saved in the file.
type StoredEntry record {|
    # The unique identifier of the entry
    string id;
    # The dense vector of the chunk
    float[] embedding;
    # The chunk content
    string content;
    # The chunk metadata
    ai:Metadata metadata;
|};

// A custom vector store that implements the \`ai:VectorStore\` type. It keeps the entries in
// a JSON file, so they are available across runs. Replace the file operations with calls to
// your own database or search service to integrate it with a knowledge base.
isolated class JsonFileVectorStore {
    *ai:VectorStore;

    private final string filePath;

    isolated function init(string filePath) {
        self.filePath = filePath;
    }

    // Adds the entries, replacing any existing entry that has the same ID. An ID is generated
    // for entries without one, such as those added by a knowledge base. The \`lock\`
    // statement prevents concurrent updates from overwriting each other's changes.
    public isolated function add(ai:VectorEntry[] entries) returns ai:Error? {
        readonly & ai:VectorEntry[] newEntries = entries.cloneReadOnly();
        lock {
            map<StoredEntry> stored = check self.readEntries();
            foreach ai:VectorEntry entry in newEntries {
                ai:Embedding embedding = entry.embedding;
                if embedding !is ai:Vector {
                    return error ai:Error("Only dense vectors are supported");
                }
                string id = entry.id ?: uuid:createRandomUuid();
                stored[id] = {
                    id,
                    embedding,
                    content: entry.chunk.content.toString(),
                    metadata: entry.chunk.metadata ?: {}
                };
            }
            check self.writeEntries(stored);
        }
    }

    // Returns the \`topK\` entries that match the filters, ranked by cosine similarity. A \`topK\`
    // of \`-1\` returns all the matching entries.
    public isolated function query(ai:VectorStoreQuery query) returns ai:VectorMatch[]|ai:Error {
        ai:Embedding? queryEmbedding = query?.embedding;
        if queryEmbedding !is ai:Vector? {
            return error ai:Error("Only dense vectors are supported");
        }
        map<StoredEntry> stored = check self.readEntries();
        ai:VectorMatch[] matches = [];
        foreach StoredEntry entry in stored {
            if !check matchesFilters(entry.metadata, query?.filters) {
                continue;
            }
            float score = queryEmbedding is ai:Vector ? cosineSimilarity(queryEmbedding, entry.embedding) : 0.0;
            ai:TextChunk chunk = {content: entry.content, metadata: entry.metadata};
            matches.push({id: entry.id, embedding: entry.embedding, chunk, similarityScore: score});
        }
        ai:VectorMatch[] ranked = from ai:VectorMatch vectorMatch in matches
            order by vectorMatch.similarityScore descending
            select vectorMatch;
        int topK = query.topK;
        return topK < 1 || topK >= ranked.length() ? ranked : ranked.slice(0, topK);
    }

    // Deletes the entries with the given IDs.
    public isolated function delete(string|string[] ids) returns ai:Error? {
        string[] idList = [];
        if ids is string {
            idList.push(ids);
        } else {
            idList.push(...ids);
        }
        readonly & string[] idsToDelete = idList.cloneReadOnly();
        lock {
            map<StoredEntry> stored = check self.readEntries();
            foreach string id in idsToDelete {
                _ = stored.removeIfHasKey(id);
            }
            check self.writeEntries(stored);
        }
    }

    private isolated function readEntries() returns map<StoredEntry>|ai:Error {
        do {
            if !check file:test(self.filePath, file:EXISTS) {
                return {};
            }
            json content = check io:fileReadJson(self.filePath);
            return check content.cloneWithType();
        } on fail error e {
            return error ai:Error("Failed to read the vector store file", e);
        }
    }

    private isolated function writeEntries(map<StoredEntry> entries) returns ai:Error? {
        io:Error? result = io:fileWriteJson(self.filePath, entries.toJson());
        if result is io:Error {
            return error ai:Error("Failed to write the vector store file", result);
        }
    }
}

// Supports filters that compare a metadata field with a value (\`==\` and \`!=\`), combined
// with the \`AND\` or \`OR\` condition.
isolated function matchesFilters(ai:Metadata metadata, ai:MetadataFilters? filters) returns boolean|ai:Error {
    if filters is () {
        return true;
    }
    foreach ai:MetadataFilters|ai:MetadataFilter filter in filters.filters {
        boolean matched;
        if filter is ai:MetadataFilters {
            matched = check matchesFilters(metadata, filter);
        } else if filter.operator == ai:EQUAL {
            matched = metadata[filter.key] == filter.value;
        } else if filter.operator == ai:NOT_EQUAL {
            matched = metadata[filter.key] != filter.value;
        } else {
            return error ai:Error(string \`Unsupported filter operator: \${filter.operator}\`);
        }
        if filters.condition == ai:OR && matched {
            return true;
        }
        if filters.condition == ai:AND && !matched {
            return false;
        }
    }
    return filters.condition == ai:AND;
}

isolated function cosineSimilarity(float[] a, float[] b) returns float {
    float dot = 0.0;
    float normA = 0.0;
    float normB = 0.0;
    foreach int i in 0 ..< a.length() {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    return dot / (normA.sqrt() * normB.sqrt());
}

public function main() returns error? {
    ai:VectorStore vectorStore = new JsonFileVectorStore("./vectors.json");

    // Add entries. The embeddings are short, hand-written vectors to keep the example
    // self-contained; in practice, they are produced by an embedding provider.
    check vectorStore.add([
        {
            id: "leave-1",
            embedding: [0.9, 0.1, 0.0],
            chunk: <ai:TextChunk>{content: "Employees get 20 days of paid annual leave.", metadata: {"topic": "leave"}}
        },
        {
            id: "leave-2",
            embedding: [0.7, 0.3, 0.1],
            chunk: <ai:TextChunk>{content: "Unused leave can be carried forward.", metadata: {"topic": "leave"}}
        },
        {
            id: "expense-1",
            embedding: [0.1, 0.2, 0.9],
            chunk: <ai:TextChunk>{content: "Submit expense claims within 30 days.", metadata: {"topic": "expenses"}}
        }
    ]);

    // The store is used through the \`ai:VectorStore\` type, like any other implementation.
    ai:VectorMatch[] matches = check vectorStore.query({embedding: [0.8, 0.2, 0.0], topK: 2});
    printMatches("Top 2 matches", matches);

    matches = check vectorStore.query({
        filters: {filters: [{key: "topic", operator: ai:EQUAL, value: "expenses"}]}
    });
    printMatches("Entries with the topic 'expenses'", matches);

    check vectorStore.delete("leave-2");

    // A new instance reads the entries that were saved to the file.
    ai:VectorStore reopenedStore = new JsonFileVectorStore("./vectors.json");
    printMatches("Entries after deleting 'leave-2'", check reopenedStore.query({topK: -1}));

    // The custom store can be passed to a knowledge base, which then uses it to store and
    // search the embedded chunks:
    // ai:KnowledgeBase knowledgeBase = new ai:VectorKnowledgeBase(vectorStore, embeddingProvider);
}

function printMatches(string title, ai:VectorMatch[] matches) {
    io:println(title, ":");
    foreach ai:VectorMatch vectorMatch in matches {
        io:println(string \`- \${vectorMatch.id ?: ""}: \${vectorMatch.chunk.content.toString()} (score: \${
                vectorMatch.similarityScore.round(3)})\`);
    }
}
`,
];

export function RagCustomVectorStore({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>Implement a custom vector store</h1>

      <p>
        A vector store (<code>ai:VectorStore</code>) saves vector entries and
        searches them by similarity. The <code>ballerina/ai</code> module
        provides <code>ai:InMemoryVectorStore</code>, and modules such as{" "}
        <a href="https://central.ballerina.io/ballerinax/ai.pgvector/latest">
          ballerinax/ai.pgvector
        </a>{" "}
        and{" "}
        <a href="https://central.ballerina.io/ballerinax/ai.pinecone/latest">
          ballerinax/ai.pinecone
        </a>{" "}
        provide implementations for external databases. To keep the vectors in a
        database or search service that has no vector store module, implement
        the <code>ai:VectorStore</code> type yourself.
      </p>

      <p>
        An <code>ai:VectorStore</code> has three methods: <code>add</code>,
        which saves vector entries, <code>query</code>, which returns the
        entries that match an <code>ai:VectorStoreQuery</code>, and{" "}
        <code>delete</code>, which removes entries by their IDs. A query has an
        embedding, metadata filters, or both, plus a <code>topK</code> limit,
        where <code>-1</code> returns all the entries. An{" "}
        <code>ai:VectorKnowledgeBase</code> adds entries without IDs, so a store
        should generate an ID when an entry does not have one. A custom store
        can be passed to an <code>ai:VectorKnowledgeBase</code>, which uses it
        to store and search the embedded chunks.
      </p>

      <p>
        This example demonstrates a vector store that saves the entries to a
        JSON file, so they are available across runs. It ranks the entries by
        cosine similarity and supports metadata filters that use the{" "}
        <code>==</code> and <code>!=</code> operators. To keep the example
        self-contained, the embeddings are short, hand-written vectors.
      </p>

      <p>
        For more information on the underlying module, see the{" "}
        <a href="https://lib.ballerina.io/ballerina/ai/latest/">
          <code>ballerina/ai</code> module
        </a>
        .
      </p>

      <Row
        className="bbeCode mx-0 py-0 rounded 
      "
        style={{ marginLeft: "0px" }}
      >
        <Col className="d-flex align-items-start" sm={12}>
          <button
            className="bg-transparent border-0 m-0 p-2 ms-auto"
            onClick={() => {
              window.open(
                "https://github.com/ballerina-platform/ballerina-distribution/tree/master/examples/rag-custom-vector-store",
                "_blank",
              );
            }}
            aria-label="Edit on Github"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#000"
              className="bi bi-github"
              viewBox="0 0 16 16"
            >
              <title>Edit on Github</title>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </button>
          {codeClick1 ? (
            <button
              className="bg-transparent border-0 m-0 p-2 "
              disabled
              aria-label="Copy to Clipboard Check"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#20b6b0"
                className="bi bi-check"
                viewBox="0 0 16 16"
              >
                <title>Copied</title>
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
              </svg>
            </button>
          ) : (
            <button
              className="bg-transparent border-0 m-0 p-2 "
              onClick={() => {
                updateCodeClick1(true);
                copyToClipboard(codeSnippetData[0]);
                setTimeout(() => {
                  updateCodeClick1(false);
                }, 3000);
              }}
              aria-label="Copy to Clipboard"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#000"
                className="bi bi-clipboard"
                viewBox="0 0 16 16"
              >
                <title>Copy to Clipboard</title>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
              </svg>
            </button>
          )}
        </Col>
        <Col sm={12}>
          {codeSnippets[0] != undefined && (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(codeSnippets[0]),
              }}
            />
          )}
        </Col>
      </Row>

      <Row
        className="bbeOutput mx-0 py-0 rounded "
        style={{ marginLeft: "0px" }}
      >
        <Col sm={12} className="d-flex align-items-start">
          {outputClick1 ? (
            <button
              className="bg-transparent border-0 m-0 p-2 ms-auto"
              aria-label="Copy to Clipboard Check"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#20b6b0"
                className="output-btn bi bi-check"
                viewBox="0 0 16 16"
              >
                <title>Copied</title>
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
              </svg>
            </button>
          ) : (
            <button
              className="bg-transparent border-0 m-0 p-2 ms-auto"
              onClick={() => {
                updateOutputClick1(true);
                const extractedText = extractOutput(ref1.current.innerText);
                copyToClipboard(extractedText);
                setTimeout(() => {
                  updateOutputClick1(false);
                }, 3000);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#EEEEEE"
                className="output-btn bi bi-clipboard"
                viewBox="0 0 16 16"
                aria-label="Copy to Clipboard"
              >
                <title>Copy to Clipboard</title>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
              </svg>
            </button>
          )}
        </Col>
        <Col sm={12}>
          <pre ref={ref1}>
            <code className="d-flex flex-column">
              <span>{`\$ bal run rag_custom_vector_store.bal`}</span>
              <span>{`Top 2 matches:`}</span>
              <span>{`- leave-1: Employees get 20 days of paid annual leave. (score: 0.991)`}</span>
              <span>{`- leave-2: Unused leave can be carried forward. (score: 0.979)`}</span>
              <span>{`Entries with the topic 'expenses':`}</span>
              <span>{`- expense-1: Submit expense claims within 30 days. (score: 0.0)`}</span>
              <span>{`Entries after deleting 'leave-2':`}</span>
              <span>{`- leave-1: Employees get 20 days of paid annual leave. (score: 0.0)`}</span>
              <span>{`- expense-1: Submit expense claims within 30 days. (score: 0.0)`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <h2>Related links</h2>

      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/rag-vector-store-operations/">
              The Vector store operations example
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/rag-custom-embedding-provider/">
              The Implement a custom embedding provider example
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://lib.ballerina.io/ballerina/ai/latest/">
              The <code>ballerina/ai</code> module
            </a>
          </span>
        </li>
      </ul>
      <span style={{ marginBottom: "20px" }}></span>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="Vector store operations"
            href="/learn/by-example/rag-vector-store-operations/"
          >
            <div className="btnContainer d-flex align-items-center me-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#3ad1ca"
                className={`${
                  btnHover[0] ? "btnArrowHover" : "btnArrow"
                } bi bi-arrow-right`}
                viewBox="0 0 16 16"
                onMouseEnter={() => updateBtnHover([true, false])}
                onMouseOut={() => updateBtnHover([false, false])}
              >
                <path
                  fill-rule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
              </svg>
              <div className="d-flex flex-column ms-4">
                <span className="btnPrev">Previous</span>
                <span
                  className={btnHover[0] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([true, false])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Vector store operations
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="Augment the prompt with retrieved context"
            href="/learn/by-example/rag-augment-prompt/"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Augment the prompt with retrieved context
                </span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#3ad1ca"
                className={`${
                  btnHover[1] ? "btnArrowHover" : "btnArrow"
                } bi bi-arrow-right`}
                viewBox="0 0 16 16"
                onMouseEnter={() => updateBtnHover([false, true])}
                onMouseOut={() => updateBtnHover([false, false])}
              >
                <path
                  fill-rule="evenodd"
                  d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                />
              </svg>
            </div>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
