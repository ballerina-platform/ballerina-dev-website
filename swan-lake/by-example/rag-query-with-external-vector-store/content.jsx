import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `import ballerina/ai;
import ballerina/io;
import ballerinax/ai.pinecone;

// Configuration for Pinecone.
configurable string pineconeServiceUrl = ?;
configurable string pineconeApiKey = ?;

// Define the vector store to use.
// The example uses Pinecone. Alternatively, you can use other providers
// or try out the in-memory vector store (\`ai:InMemoryVectorStore\`).
final ai:VectorStore vectorStore = 
            check new pinecone:VectorStore(pineconeServiceUrl, pineconeApiKey);

// Define the embedding provider to use.
// The example uses the default embedding provider implementation
// (with configuration added via a Ballerina VS Code command).
final ai:EmbeddingProvider embeddingProvider = 
            check ai:getDefaultEmbeddingProvider();

// Create the knowledge base with the vector store and embedding provider.
final ai:KnowledgeBase knowledgeBase = 
            new ai:VectorKnowledgeBase(vectorStore, embeddingProvider);

// Define the model provider to use.
// The example uses the default model provider implementation
// (with configuration added via a Ballerina VS Code command).
final ai:ModelProvider modelProvider = check ai:getDefaultModelProvider();

public function main() returns error? {
    string appealQuery = 
        "What is the process for appealing a rejected leave request?";

    // Retrieve the relevant context (chunks) from the knowledge base.
    ai:QueryMatch[] queryMatches = check knowledgeBase.retrieve(appealQuery, 10);
    ai:Chunk[] context = from ai:QueryMatch queryMatch in queryMatches
                            select queryMatch.chunk;

    // Use the \`generate\` method, inserting the context and query to the prompt.
    string answer = check modelProvider->generate(\`Answer the query based on the 
	    following context:

	    Context: \${context}

	    Query: \${appealQuery}

	    Base the answer only on the above context. If the answer is not
	    contained within the context, respond with "I don't know".\`);
    io:println("Query: ", appealQuery);
    io:println("Answer: ", answer);

    string carryForwardQuery = 
        "How many annual leave days can a full-time employee carry forward to the next year?";
    
    queryMatches = check knowledgeBase.retrieve(carryForwardQuery, 10);
    context = from ai:QueryMatch queryMatch in queryMatches
                            select queryMatch.chunk;

    // The \`augmentUserQuery\` function augments the user query with the context using 
    // a generic prompt template.
    ai:ChatUserMessage augmentedQuery = ai:augmentUserQuery(context, carryForwardQuery);

    // Use the \`chat\` method with the \`ai:ChatUserMessage\` with the augmented query.
    ai:ChatAssistantMessage assistantMessage = check modelProvider->chat(augmentedQuery);
    
    io:println("\\nQuery: ", carryForwardQuery);
    io:println("Answer: ", assistantMessage.content);
}
`,
];

export function RagQueryWithExternalVectorStore({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>Retrieval-augmented generation (RAG) query</h1>

      <p>
        Retrieval-augmented generation (RAG) is a technique that enhances
        capabilities of large language models by combining them with external
        knowledge sources to provide more accurate and contextually-relevant
        responses.
      </p>

      <p>
        Ballerina has high-level, provider-agnostic APIs for retrieval-augmented
        generation (RAG) workflows. These include abstractions such as{" "}
        <code>ai:VectorStore</code>, <code>ai:EmbeddingProvider</code>, and{" "}
        <code>ai:KnowledgeBase</code>.
      </p>

      <p>
        These abstractions enable you to query semantically similar content from
        vector databases (e.g., Pinecone, Weaviate, etc.) and use retrieved
        context in the request to the LLM to generate more accurate responses.
      </p>

      <p>
        This example demonstrates how to query a knowledge base to retrieve
        relevant documents and use them with a language model to answer
        questions based on the retrieved context.
      </p>

      <blockquote>
        <p>
          Note: You can follow the{" "}
          <a href="/learn/by-example/rag-ingestion/">RAG ingestion</a> example
          to ingest data first.
        </p>
      </blockquote>

      <blockquote>
        <p>
          Note: This example uses the default model provider and embedding
          provider implementations and Pinecone. To generate the configuration
          for the model and embedding providers, open up the VS Code command
          palette (<code>Ctrl</code> + <code>Shift</code> + <code>P</code> or{" "}
          <code>command</code> + <code>shift</code> + <code>P</code>), and run
          the <code>Configure default WSO2 Model Provider</code> command to add
          your configuration to the <code>Config.toml</code> file. If not
          already logged in, log in to the Ballerina Copilot when prompted.
          Alternatively, to use your own keys, use the relevant{" "}
          <code>ballerinax/ai.&lt;provider&gt;</code> embedding provider
          implementation. Follow{" "}
          <a href="https://central.ballerina.io/ballerinax/ai.pinecone/latest#prerequisites">
            <code>ballerinax/ai.pinecone</code> prerequisites
          </a>{" "}
          to extract Pinecone configuration. Alternatively, you can try out the
          in-memory vector store (<code>ai:InMemoryVectorStore</code>).
        </p>
      </blockquote>

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
          {codeClick1 ? (
            <button
              className="bg-transparent border-0 m-0 p-2  ms-auto"
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
              className="bg-transparent border-0 m-0 p-2  ms-auto"
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
              <span>{`\$ bal run rag_query_with_external_vector_store.bal`}</span>
              <span>{`Query: What is the process for appealing a rejected leave request?`}</span>
              <span>{`Answer: I don't know.`}</span>
              <span>{`
`}</span>
              <span>{`Query: How many annual leave days can a full-time employee carry forward to the next year?`}</span>
              <span>{`Answer: A full-time employee can carry forward up to 5 unused annual leave days to the next year.`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <h2>Related links</h2>

      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/rag-ingestion/">RAG ingestion example</a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://central.ballerina.io/ballerinax/ai.milvus/latest">
              The <code>ballerinax/ai.milvus</code> module
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://central.ballerina.io/ballerinax/ai.pinecone/latest">
              The <code>ballerinax/ai.pinecone</code> module
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://central.ballerina.io/ballerinax/ai.pgvector/latest">
              The <code>ballerinax/ai.pgvector</code> module
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://central.ballerina.io/ballerinax/ai.weaviate/latest">
              The <code>ballerinax/ai.weaviate</code> module
            </a>
          </span>
        </li>
      </ul>
      <span style={{ marginBottom: "20px" }}></span>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="RAG ingestion with external vector store"
            href="/learn/by-example/rag-ingestion-with-external-vector-store/"
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
                  RAG ingestion with external vector store
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link title="MCP service" href="/learn/by-example/mcp-service/">
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  MCP service
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
