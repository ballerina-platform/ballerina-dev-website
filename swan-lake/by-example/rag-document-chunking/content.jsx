import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `import ballerina/ai;
import ballerina/io;

// The documents of each type are kept in a separate array, so that each type can be chunked
// with the chunking function for that type.
final ai:TextDocument[] markdownDocuments = [
    {
        content: "# Leave policy\\n\\n## Annual leave\\n\\n20 days of paid leave per year.\\n\\n" +
            "## Sick leave\\n\\n10 days of paid sick leave per year.",
        metadata: {fileName: "leave_policy.md"}
    }
];

final ai:TextDocument[] htmlDocuments = [
    {
        content: "<h1>Travel policy</h1><h2>Booking</h2><p>Book travel two weeks in advance.</p>" +
            "<h2>Meals</h2><p>Meals are reimbursed up to 60 USD per day.</p>",
        metadata: {fileName: "travel_policy.html"}
    }
];

final ai:TextDocument[] textDocuments = [
    {
        content: "Treat colleagues with respect. Harassment is not tolerated. Report concerns to HR.",
        metadata: {fileName: "code_of_conduct.txt"}
    }
];

public function main() returns error? {
    // Chunk each document type with the chunking function for that type. Each function
    // splits by the structure of the document (e.g., headers) and recursively falls back
    // to smaller units (e.g., sentences) when a chunk exceeds \`maxChunkSize\` characters.
    ai:Chunk[] markdownChunks = check ai:chunkMarkdownDocument(markdownDocuments[0],
            maxChunkSize = 70, maxOverlapSize = 0);
    printChunks("Markdown chunks", markdownChunks);

    ai:Chunk[] htmlChunks = check ai:chunkHtmlDocument(htmlDocuments[0],
            maxChunkSize = 80, maxOverlapSize = 0);
    printChunks("HTML chunks", htmlChunks);

    ai:Chunk[] textChunks = check ai:chunkDocumentRecursively(textDocuments[0],
            maxChunkSize = 40, maxOverlapSize = 0, strategy = ai:SENTENCE);
    printChunks("Text chunks", textChunks);

    // A knowledge base created with \`ai:AUTO\` (the default) detects the chunker for each
    // document from its \`mimeType\` metadata or file extension: \`.md\` documents use the
    // Markdown chunker, \`.html\` documents use the HTML chunker, and other documents use
    // the generic recursive chunker. So, all the arrays can be ingested together.
    ai:VectorStore vectorStore = check new ai:InMemoryVectorStore();
    ai:KnowledgeBase knowledgeBase = new ai:VectorKnowledgeBase(vectorStore,
            check ai:getDefaultEmbeddingProvider(), ai:AUTO);
    check knowledgeBase.ingest([...markdownDocuments, ...htmlDocuments, ...textDocuments]);

    // Inspect the chunks that were stored. A query without an embedding or filters returns
    // all the entries (\`topK\` of \`-1\` removes the limit).
    ai:VectorMatch[] entries = check vectorStore.query({topK: -1});
    printChunks("Chunks stored with ai:AUTO", from ai:VectorMatch entry in entries
        select entry.chunk);
}

function printChunks(string title, ai:Chunk[] chunks) {
    io:println(title, ": ", chunks.length());
    foreach ai:Chunk chunk in chunks {
        io:println("- [", chunk.metadata?.fileName ?: "-", "] ",
                re \`\\s+\`.replaceAll(chunk.content.toString(), " ").trim());
    }
}
`,
];

export function RagDocumentChunking({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>Chunk documents</h1>

      <p>
        Before you embed documents for retrieval-augmented generation (RAG), you
        split them into chunks. The <code>ballerina/ai</code> module has a
        chunking function for each document type:{" "}
        <code>ai:chunkMarkdownDocument</code>, <code>ai:chunkHtmlDocument</code>
        , and <code>ai:chunkDocumentRecursively</code> for generic text. Each
        one splits by the document structure and falls back to smaller units
        when a chunk exceeds <code>maxChunkSize</code> characters. An{" "}
        <code>ai:VectorKnowledgeBase</code> created with <code>ai:AUTO</code>{" "}
        (the default) picks the chunker for each document from its{" "}
        <code>mimeType</code> metadata or file extension.
      </p>

      <p>
        This example chunks Markdown, HTML, and text documents, and then ingests
        them all into a knowledge base that uses <code>ai:AUTO</code>.
      </p>

      <blockquote>
        <p>
          Note: This example uses the default embedding provider implementation
          for the knowledge base. To generate its configuration, open up the VS
          Code command palette (<code>Ctrl</code> + <code>Shift</code> +{" "}
          <code>P</code> or <code>command</code> + <code>shift</code> +{" "}
          <code>P</code>), and run the{" "}
          <code>Configure default WSO2 Model Provider</code> command to add your
          configuration to the <code>Config.toml</code> file. If not already
          logged in, log in to the Ballerina Copilot when prompted.
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
          <button
            className="bg-transparent border-0 m-0 p-2 ms-auto"
            onClick={() => {
              window.open(
                "https://github.com/ballerina-platform/ballerina-distribution/tree/master/examples/rag-document-chunking",
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
              <span>{`\$ bal run rag_document_chunking.bal`}</span>
              <span>{`Markdown chunks: 2`}</span>
              <span>{`- [leave_policy.md] # Leave policy ## Annual leave 20 days of paid leave per year.`}</span>
              <span>{`- [leave_policy.md] ## Sick leave 10 days of paid sick leave per year.`}</span>
              <span>{`HTML chunks: 2`}</span>
              <span>{`- [travel_policy.html] <h1>Travel policy</h1><h2>Booking</h2><p>Book travel two weeks in advance.</p>`}</span>
              <span>{`- [travel_policy.html] <h2>Meals</h2><p>Meals are reimbursed up to 60 USD per day.</p>`}</span>
              <span>{`Text chunks: 3`}</span>
              <span>{`- [code_of_conduct.txt] Treat colleagues with respect.`}</span>
              <span>{`- [code_of_conduct.txt] Harassment is not tolerated.`}</span>
              <span>{`- [code_of_conduct.txt] Report concerns to HR.`}</span>
              <span>{`Chunks stored with ai:AUTO: 3`}</span>
              <span>{`- [leave_policy.md] # Leave policy ## Annual leave 20 days of paid leave per year. ## Sick leave 10 days of paid sick leave per year.`}</span>
              <span>{`- [travel_policy.html] <h1>Travel policy</h1><h2>Booking</h2><p>Book travel two weeks in advance.</p><h2>Meals</h2><p>Meals are reimbursed up to 60 USD per day.</p>`}</span>
              <span>{`- [code_of_conduct.txt] Treat colleagues with respect. Harassment is not tolerated. Report concerns to HR.`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <h2>Related links</h2>

      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/rag-with-configured-chunker/">
              The Ingest with a configured chunker example
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/rag-with-custom-chunker/">
              The Implement a custom chunker example
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/rag-document-loading/">
              The Load documents example
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/rag-ingestion-with-external-vector-store/">
              The Ingest into Pinecone example
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/rag-query-with-metadata-filters/">
              The Filter results by metadata example
            </a>
          </span>
        </li>
      </ul>
      <span style={{ marginBottom: "20px" }}></span>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="Load using a custom data loader"
            href="/learn/by-example/rag-custom-data-loader/"
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
                  Load using a custom data loader
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="Implement a custom chunker"
            href="/learn/by-example/rag-with-custom-chunker/"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Implement a custom chunker
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
