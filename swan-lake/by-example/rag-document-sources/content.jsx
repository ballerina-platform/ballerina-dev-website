import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `import ballerina/ai;
import ballerina/io;
import ballerinax/ai.microsoft.sharepoint;

// Credentials of a Microsoft Entra ID app registration that has the \`Sites.Read.All\`
// application permission for Microsoft Graph.
configurable string tenantId = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;

// The SharePoint site to load from, in the \`{hostname}:/sites/{site-name}\` form
// (e.g., \`contoso.sharepoint.com:/sites/HR\`).
configurable string siteId = ?;

public function main() returns error? {
    // Source 1: local files. The built-in \`ai:TextDataLoader\` loads \`pdf\`, \`docx\`, \`markdown\`,
    // \`html\`, and \`pptx\` files as text documents.
    ai:DataLoader fileLoader = check new ai:TextDataLoader("./leave_policy.pdf", "./employee_handbook.md");
    ai:Document[] fileDocuments = toArray(check fileLoader.load());
    printDocuments("local files", fileDocuments);

    // Source 2: Microsoft SharePoint. The \`sharepoint:TextDataLoader\` reads files from
    // SharePoint document libraries through the Microsoft Graph API. Here, it loads the
    // PDF and Markdown files in the \`Policies\` folder of the site's default \`Documents\`
    // library.
    ai:DataLoader sharePointLoader = check new sharepoint:TextDataLoader(
        {
            auth: {
                tokenUrl: string \`https://login.microsoftonline.com/\${tenantId}/oauth2/v2.0/token\`,
                clientId,
                clientSecret,
                scopes: ["https://graph.microsoft.com/.default"]
            }
        },
        [
            {
                siteId,
                libraries: [{paths: ["/Policies"], includeExtensions: ["pdf", "md"]}]
            }
        ]
    );
    ai:Document[] sharePointDocuments = toArray(check sharePointLoader.load());
    printDocuments("SharePoint", sharePointDocuments);

    // Source 3: content already in memory, such as the body of an HTTP response or a message,
    // can be wrapped as a document directly.
    ai:TextDocument notice = {
        content: "The office is closed on public holidays. Critical support staff may work remotely.",
        metadata: {fileName: "holiday-notice"}
    };
    printDocuments("memory", [notice]);

    // All the documents share the \`ai:Document\` type, so they can be ingested into a
    // knowledge base together, regardless of where they came from.
    ai:Document[] documents = [...fileDocuments, ...sharePointDocuments, notice];
    io:println("\\nTotal documents: ", documents.length());
}

function printDocuments(string origin, ai:Document[] documents) {
    io:println("Loaded from ", origin, ": ", documents.length());
    foreach ai:Document document in documents {
        io:println("- ", document.metadata?.fileName, " (", document.content.toString().length(), " characters)");
    }
}

function toArray(ai:Document|ai:Document[] loaded) returns ai:Document[] {
    if loaded is ai:Document[] {
        return loaded;
    }
    return [loaded];
}
`,
];

export function RagDocumentSources({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>Load documents from multiple sources</h1>

      <p>
        The documents for a retrieval-augmented generation (RAG) knowledge base
        rarely come from a single place. The <code>ai:DataLoader</code>{" "}
        abstraction represents any source of documents: the built-in{" "}
        <code>ai:TextDataLoader</code> loads local files (<code>pdf</code>,{" "}
        <code>docx</code>, <code>markdown</code>, <code>html</code>, and{" "}
        <code>pptx</code>), and modules such as{" "}
        <a href="https://central.ballerina.io/ballerinax/ai.microsoft.sharepoint/latest">
          ballerinax/ai.microsoft.sharepoint
        </a>{" "}
        load documents from external services. Content that is already in
        memory, such as an HTTP response body, can be wrapped as an{" "}
        <code>ai:TextDocument</code> directly. To load from any other source,
        implement the <code>ai:DataLoader</code> type, as shown in the{" "}
        <a href="/learn/by-example/rag-custom-data-loader/">
          Load using a custom data loader
        </a>{" "}
        example.
      </p>

      <p>
        The <code>sharepoint:TextDataLoader</code> reads files from SharePoint
        document libraries, and optionally site pages, through the Microsoft
        Graph API. It loads text files, such as Markdown, as they are and
        extracts the text of PDF files. It authenticates with OAuth2 client
        credentials, a refresh token, or a bearer token. Each source names a
        site and the libraries, paths, and file extensions to load.
      </p>

      <p>
        Because every loader produces <code>ai:Document</code> values, documents
        from different sources can be combined and ingested into a knowledge
        base together.
      </p>

      <p>
        This example demonstrates loading documents from local files, from a
        SharePoint document library, and from in-memory content.
      </p>

      <blockquote>
        <p>
          Note: This example requires a Microsoft Entra ID app registration with
          the <code>Sites.Read.All</code> application permission for Microsoft
          Graph. Add the tenant ID, client ID, client secret, and SharePoint
          site ID to the <code>Config.toml</code> file (e.g.,{" "}
          <code>siteId = &quot;contoso.sharepoint.com:/sites/HR&quot;</code>).
          The example loads the PDF and Markdown files in the{" "}
          <code>Policies</code> folder of the site’s <code>Documents</code>{" "}
          library.
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
              <span>{`\$ bal run rag_document_sources.bal`}</span>
              <span>{`Loaded from local files: 2`}</span>
              <span>{`- leave_policy.pdf (2833 characters)`}</span>
              <span>{`- employee_handbook.md (525 characters)`}</span>
              <span>{`Loaded from SharePoint: 2`}</span>
              <span>{`- expense_guidelines.md (164 characters)`}</span>
              <span>{`- travel_policy.pdf (211 characters)`}</span>
              <span>{`Loaded from memory: 1`}</span>
              <span>{`- holiday-notice (82 characters)`}</span>
              <span>{`
`}</span>
              <span>{`Total documents: 5`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <h2>Related links</h2>

      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://github.com/ballerina-platform/ballerina-distribution/tree/master/examples/rag-document-sources/leave_policy.pdf">
              Sample leave policy document
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://github.com/ballerina-platform/ballerina-distribution/tree/master/examples/rag-document-sources/employee_handbook.md">
              Sample employee handbook document
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
            <a href="/learn/by-example/rag-custom-data-loader/">
              The Load using a custom data loader example
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/rag-in-memory-vector-store-ingestion/">
              The Ingest into an in-memory vector store example
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://central.ballerina.io/ballerinax/ai.microsoft.sharepoint/latest">
              The <code>ballerinax/ai.microsoft.sharepoint</code> module
            </a>
          </span>
        </li>
      </ul>
      <span style={{ marginBottom: "20px" }}></span>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="Load documents"
            href="/learn/by-example/rag-document-loading/"
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
                  Load documents
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="Load using a custom data loader"
            href="/learn/by-example/rag-custom-data-loader/"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Load using a custom data loader
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
