import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `import ballerina/ai;
import ballerina/io;
import ballerinax/ai.wso2.integration as wso2;

// Configuration for the WSO2 Cloud knowledge base. Add the values to the \`Config.toml\` file.
configurable string knowledgeBaseUrl = ?;
configurable string knowledgeBaseToken = ?;

// The knowledge base is hosted on the WSO2 Integration platform, where the documents are
// ingested, chunked, and embedded. The application only retrieves from it, so no embedding
// provider is configured here; the \`ingest\` and \`deleteByFilter\` methods return an error.
final ai:KnowledgeBase knowledgeBase = check new wso2:CloudKnowledgeBase(knowledgeBaseUrl,
        {auth: {token: knowledgeBaseToken}},
        // Chunks scoring below this similarity threshold are dropped. The default is 0.7.
        minSimilarityThreshold = 0.75);

// Use the default model provider (with configuration added via a Ballerina VS Code command)
// to generate the final response.
final ai:ModelProvider model = check ai:getDefaultModelProvider();

public function main() returns error? {
    // Retrieve the chunks that are most relevant to the query. The platform embeds the query
    // and searches the knowledge base; the results carry their similarity scores.
    string query = "How do I configure a scheduled task?";
    ai:QueryMatch[] matches = check knowledgeBase.retrieve(query, 5);
    io:println("Retrieved chunks: ", matches.length());
    foreach ai:QueryMatch queryMatch in matches {
        io:println("- ", queryMatch.chunk.content, " (score: ", queryMatch.similarityScore, ")");
    }

    // Augment the user query with the retrieved context and generate the response.
    ai:ChatUserMessage augmentedQuery = ai:augmentUserQuery(matches, query);
    ai:ChatAssistantMessage response = check model->chat(augmentedQuery);
    io:println("\\nAnswer: ", response.content);
}
`,
];

export function RagWso2CloudKnowledgeBaseRetrieval({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>Retrieve from a WSO2 Cloud knowledge base</h1>

      <p>
        The{" "}
        <a href="https://central.ballerina.io/ballerinax/ai.wso2.integration/latest">
          ballerinax/ai.wso2.integration
        </a>{" "}
        module provides <code>wso2:CloudKnowledgeBase</code>, an{" "}
        <code>ai:KnowledgeBase</code> implementation backed by a knowledge base
        hosted on the WSO2 Integration platform. The documents are ingested,
        chunked, and embedded on the platform, so the application only retrieves
        from it: the query is embedded by the platform and the matching chunks
        are returned with their similarity scores. Calls to <code>ingest</code>{" "}
        and <code>deleteByFilter</code> return an error.
      </p>

      <p>
        The knowledge base accepts a bearer token or OAuth2 client credentials,
        drops weak matches below <code>minSimilarityThreshold</code>, and can
        rerank the retrieved chunks with Cohere through the{" "}
        <code>cohereRerankerApiKey</code>, <code>cohereRerankerModel</code>, and{" "}
        <code>rerankerTopN</code> parameters. Since it implements{" "}
        <code>ai:KnowledgeBase</code>, the retrieved chunks are used exactly
        like those from any other knowledge base: augment the prompt with them
        and generate the answer with a model provider.
      </p>

      <p>
        This example demonstrates retrieving from a WSO2 Cloud knowledge base
        and generating the answer with the default WSO2 model provider. To let
        an agent decide when to retrieve, see the{" "}
        <a href="/learn/by-example/agentic-rag-with-wso2-integration-knowledge-base/">
          Agentic RAG with WSO2 Cloud
        </a>{" "}
        example.
      </p>

      <blockquote>
        <p>
          Note: This example only retrieves. Before you run it, create the
          knowledge base and ingest your documents on the WSO2 Integration
          platform. For the platform’s generative AI components, including the
          default WSO2 model provider, see the{" "}
          <a href="https://wso2.com/integration-platform/docs/genai/develop/components/model-providers">
            WSO2 Integration platform documentation
          </a>
          .
        </p>
      </blockquote>

      <blockquote>
        <p>
          Note: Add the knowledge base URL and token to the{" "}
          <code>Config.toml</code> file (e.g.,{" "}
          <code>knowledgeBaseUrl = &quot;&lt;knowledge-base-url&gt;&quot;</code>
          , <code>knowledgeBaseToken = &quot;&lt;token&gt;&quot;</code>). This
          example also uses the default model provider implementation. To
          generate its configuration, open up the VS Code command palette (
          <code>Ctrl</code> + <code>Shift</code> + <code>P</code> or{" "}
          <code>command</code> + <code>shift</code> + <code>P</code>), and run
          the <code>Configure default WSO2 Model Provider</code> command to add
          your configuration to the <code>Config.toml</code> file. If not
          already logged in, log in to the Ballerina Copilot when prompted.
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
              <span>{`\$ bal run rag_wso2_cloud_knowledge_base_retrieval.bal`}</span>
              <span>{`Retrieved chunks: 2`}</span>
              <span>{`- Scheduled tasks are created from the Automation artifact. Set the schedule with a cron expression in the automation configuration and deploy the integration. (score: 0.86)`}</span>
              <span>{`- A scheduled automation runs on the configured schedule; use the Try It panel to trigger a run manually while testing. (score: 0.78)`}</span>
              <span>{`
`}</span>
              <span>{`Answer: To configure a scheduled task, create an Automation artifact, set its schedule using a cron expression in the automation configuration, and deploy the integration. While testing, you can trigger a run manually from the Try It panel.`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <h2>Related links</h2>

      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/agentic-rag-with-wso2-integration-knowledge-base/">
              The Agentic RAG with WSO2 Cloud example
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/rag-azure-ai-search-retrieval/">
              The Retrieve from Azure AI Search example
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/rag-augment-prompt/">
              The Augment the prompt with retrieved context example
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
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://wso2.com/integration-platform/docs/genai/develop/components/model-providers">
              WSO2 Integration platform: Model providers
            </a>
          </span>
        </li>
      </ul>
      <span style={{ marginBottom: "20px" }}></span>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="Retrieve from Azure AI Search"
            href="/learn/by-example/rag-azure-ai-search-retrieval/"
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
                  Retrieve from Azure AI Search
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="Retrieve and generate with Google Vertex AI"
            href="/learn/by-example/rag-vertex-ai-retrieval/"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Retrieve and generate with Google Vertex AI
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
