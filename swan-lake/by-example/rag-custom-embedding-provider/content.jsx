import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `import ballerina/ai;
import ballerina/http;
import ballerina/io;

// The embeddings service to use. The example uses a local Ollama server, which exposes an
// OpenAI-compatible embeddings API, with the \`nomic-embed-text\` model.
configurable string embeddingServiceUrl = "http://localhost:11434/v1";
configurable string embeddingModel = "nomic-embed-text";

# The response of an OpenAI-compatible embeddings API.
type EmbeddingResponse record {
    # The embeddings, one for each input
    record {
        # The position of the input that the embedding belongs to
        int index;
        # The embedding vector
        float[] embedding;
    }[] data;
};

// A custom embedding provider that implements the \`ai:EmbeddingProvider\` type. It calls
// the \`/embeddings\` endpoint of any service that follows the OpenAI embeddings API, such as
// Ollama, vLLM, or an internal embeddings gateway.
isolated client class OpenAiCompatibleEmbeddingProvider {
    *ai:EmbeddingProvider;

    private final http:Client embeddingClient;
    private final string model;

    isolated function init(string serviceUrl, string model) returns ai:Error? {
        http:Client|error embeddingClient = new (serviceUrl);
        if embeddingClient is error {
            return error ai:Error("Failed to initialize the embeddings client", embeddingClient);
        }
        self.embeddingClient = embeddingClient;
        self.model = model;
    }

    // Converts a single chunk into an embedding.
    isolated remote function embed(ai:Chunk chunk) returns ai:Embedding|ai:Error {
        ai:Embedding[] embeddings = check self->batchEmbed([chunk]);
        return embeddings[0];
    }

    // Converts a batch of chunks into embeddings with a single request.
    isolated remote function batchEmbed(ai:Chunk[] chunks) returns ai:Embedding[]|ai:Error {
        string[] input = [];
        foreach ai:Chunk chunk in chunks {
            anydata content = chunk.content;
            if content !is string {
                return error ai:Error("Only text chunks are supported");
            }
            input.push(content);
        }
        EmbeddingResponse|error response = self.embeddingClient->/embeddings.post({model: self.model, input});
        if response is error {
            return error ai:Error("Failed to generate embeddings: " + response.message(), response);
        }
        // Return the embeddings in the order of the inputs.
        return from var item in response.data
            order by item.index
            select item.embedding;
    }
}

public function main() returns error? {
    ai:EmbeddingProvider embeddingProvider =
        check new OpenAiCompatibleEmbeddingProvider(embeddingServiceUrl, embeddingModel);

    // Use the custom provider directly.
    ai:Embedding embedding = check embeddingProvider->embed(<ai:TextChunk>{content: "Hello, Ballerina!"});
    if embedding is ai:Vector {
        io:println("Embedding dimensions: ", embedding.length());
    }

    // Or pass it to a knowledge base, like any other embedding provider. The knowledge base
    // uses it to embed the chunks when ingesting, and the query when retrieving.
    ai:VectorStore vectorStore = check new ai:InMemoryVectorStore();
    ai:KnowledgeBase knowledgeBase = new ai:VectorKnowledgeBase(vectorStore, embeddingProvider);
    check knowledgeBase.ingest([
        <ai:TextDocument>{content: "Full-time employees get 20 days of paid annual leave per year."},
        <ai:TextDocument>{content: "Expense claims must be submitted within 30 days."},
        <ai:TextDocument>{content: "The office is closed on public holidays."}
    ]);

    ai:QueryMatch[] matches = check knowledgeBase.retrieve("How much vacation do I get?", 1);
    io:println("Best match: ", matches[0].chunk.content);
}
`,
];

export function RagCustomEmbeddingProvider({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>Implement a custom embedding provider</h1>

      <p>
        An embedding provider (<code>ai:EmbeddingProvider</code>) converts
        chunks into vector embeddings. Modules such as{" "}
        <a href="https://central.ballerina.io/ballerinax/ai.openai/latest">
          ballerinax/ai.openai
        </a>{" "}
        and{" "}
        <a href="https://central.ballerina.io/ballerinax/ai.azure/latest">
          ballerinax/ai.azure
        </a>{" "}
        provide implementations for their services. To use an embedding model
        that has no provider module, such as a self-hosted model or an internal
        embeddings gateway, implement the <code>ai:EmbeddingProvider</code> type
        yourself.
      </p>

      <p>
        An <code>ai:EmbeddingProvider</code> is a client object with two remote
        methods: <code>embed</code>, which converts a single chunk into an{" "}
        <code>ai:Embedding</code>, and <code>batchEmbed</code>, which converts a
        batch of chunks in one call. A custom provider can be used anywhere an
        embedding provider is expected, including in an{" "}
        <code>ai:VectorKnowledgeBase</code>, which uses it both to embed the
        chunks when ingesting and to embed the query when retrieving.
      </p>

      <p>
        This example demonstrates a custom embedding provider for services that
        follow the OpenAI embeddings API, used with a local{" "}
        <a href="https://ollama.com">Ollama</a> server, and plugs it into a
        knowledge base.
      </p>

      <blockquote>
        <p>
          Note: This example requires a running Ollama server with the{" "}
          <code>nomic-embed-text</code> model (
          <code>ollama pull nomic-embed-text</code>). To use another
          OpenAI-compatible service, set <code>embeddingServiceUrl</code> and{" "}
          <code>embeddingModel</code> in the <code>Config.toml</code> file.
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
              <span>{`\$ bal run rag_custom_embedding_provider.bal`}</span>
              <span>{`Embedding dimensions: 768`}</span>
              <span>{`Best match: Full-time employees get 20 days of paid annual leave per year.`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <h2>Related links</h2>

      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/rag-embeddings/">
              The Generate embeddings with the default WSO2 embedding provider
              example
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/rag-embedding-provider/">
              The Generate embeddings with a specific provider example
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/rag-custom-vector-store/">
              The Implement a custom vector store example
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
            title="Generate embeddings with a specific provider"
            href="/learn/by-example/rag-embedding-provider/"
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
                  Generate embeddings with a specific provider
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="Vector store operations"
            href="/learn/by-example/rag-vector-store-operations/"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Vector store operations
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
