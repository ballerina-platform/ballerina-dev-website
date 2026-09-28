import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `import ballerina/ai;
import ballerina/io;
import ballerinax/ai.wso2.integration as wso2;

// Configuration for the WSO2 Integration knowledge base.
configurable string knowledgeBaseUrl = ?;
configurable string knowledgeBaseToken = ?;

// The knowledge base is hosted and populated on the WSO2 Integration platform, so the
// application only retrieves from it. Ingestion and deletion are not supported by this
// knowledge base, and return an error.
final ai:KnowledgeBase knowledgeBase = check new wso2:CloudKnowledgeBase(knowledgeBaseUrl,
        {auth: {token: knowledgeBaseToken}},
        // Chunks scoring below this similarity threshold are dropped.
        minSimilarityThreshold = 0.7);

# Searches the company knowledge base for information relevant to a question.
# + query - The question to search the knowledge base for
# + return - The matching excerpts from the knowledge base
@ai:AgentTool
isolated function searchKnowledgeBase(string query) returns string[]|ai:Error {
    ai:QueryMatch[] matches = check knowledgeBase.retrieve(query, 5);
    return from ai:QueryMatch queryMatch in matches
        select queryMatch.chunk.content.toString();
}

// Retrieval is a tool rather than a fixed step, so the agent decides whether to search,
// what to search for, and can search several times before it answers.
final ai:Agent supportAgent = check new ({
    systemPrompt: {
        role: "Support Assistant",
        instructions: string \`Answer questions using the company knowledge base. Search the
            knowledge base before answering, and base the answer only on what the search
            returns. Keep answers brief.\`
    },
    model: check ai:getDefaultModelProvider(),
    tools: [searchKnowledgeBase]
});

public function main() returns error? {
    string response = check supportAgent.run("How do I configure a scheduled task?");
    io:println(response);
}
`,
];

export function AgenticRagWithWso2IntegrationKnowledgeBase({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>Agentic retrieval-augmented generation (RAG) with WSO2 Cloud</h1>

      <p>
        The <code>ballerinax/ai.wso2.integration</code> module provides{" "}
        <code>wso2:CloudKnowledgeBase</code>, an <code>ai:KnowledgeBase</code>{" "}
        implementation backed by a knowledge base hosted on the WSO2 Integration
        platform. The documents are ingested and indexed on the platform, so the
        application only retrieves from it. Calls to <code>ingest</code> and{" "}
        <code>deleteByFilter</code> return an error.
      </p>

      <p>
        Because it implements <code>ai:KnowledgeBase</code>, retrieval is
        exposed to an agent as a tool in the same way as any other knowledge
        base. The agent then decides whether to search, what to search for, and
        can search several times before answering, which is what distinguishes
        agentic RAG from a fixed retrieve-then-generate flow.
      </p>

      <p>
        The knowledge base accepts a bearer token or OAuth2 client credentials,
        and can drop weak matches with <code>minSimilarityThreshold</code>. It
        also supports reranking the retrieved chunks with Cohere through the{" "}
        <code>cohereRerankerApiKey</code>, <code>cohereRerankerModel</code>, and{" "}
        <code>rerankerTopN</code> parameters.
      </p>

      <blockquote>
        <p>
          Note: Add the knowledge base URL and token to the{" "}
          <code>Config.toml</code> file. This example also uses the default
          model provider implementation. To generate its configuration, open up
          the VS Code command palette (<code>Ctrl</code> + <code>Shift</code> +{" "}
          <code>P</code> or <code>command</code> + <code>shift</code> +{" "}
          <code>P</code>), and run the{" "}
          <code>Configure default WSO2 Model Provider</code> command to add your
          configuration to the <code>Config.toml</code> file. If not already
          logged in, log in to the Ballerina Copilot when prompted.
        </p>
      </blockquote>

      <p>
        For more information on the underlying module, see the{" "}
        <a href="https://central.ballerina.io/ballerinax/ai.wso2.integration/latest">
          <code>ballerinax/ai.wso2.integration</code> module
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

      <h2>Related links</h2>

      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/rag-wso2-cloud-knowledge-base-retrieval/">
              The Retrieve from a WSO2 Cloud knowledge base example
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/agentic-rag-with-pinecone-vector-store/">
              The Agentic RAG with Pinecone example
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://central.ballerina.io/ballerinax/ai.wso2.integration/latest">
              The <code>ballerinax/ai.wso2.integration</code> module
            </a>
          </span>
        </li>
      </ul>
      <span style={{ marginBottom: "20px" }}></span>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="Filter results by metadata"
            href="/learn/by-example/rag-query-with-metadata-filters/"
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
                  Filter results by metadata
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="Agentic RAG with Pinecone"
            href="/learn/by-example/agentic-rag-with-pinecone-vector-store/"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Agentic RAG with Pinecone
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
