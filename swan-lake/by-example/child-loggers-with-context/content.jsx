import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `import ballerina/log;

function processUserRequest(string userId, string requestId) returns error? {
    // Get the root logger
    log:Logger rootLogger = log:root();

    // Create a child logger with request-specific context
    log:Logger requestLogger = check rootLogger.withContext(userId = userId, requestId = requestId);

    requestLogger.printInfo("Processing user request");

    // All logs from this logger will include the userId and requestId context
    requestLogger.printDebug("Validating user permissions");
    requestLogger.printInfo("User permissions validated successfully");

    requestLogger.printDebug("Fetching user data from database");
    requestLogger.printInfo("User data retrieved", recordCount = 5);

    // Create a nested logger with additional context for a specific operation
    log:Logger operationLogger = check requestLogger.withContext(operation = "dataTransformation");
    operationLogger.printInfo("Starting data transformation");
    operationLogger.printWarn("Using fallback transformation method", reason = "primary method unavailable");
    operationLogger.printInfo("Data transformation completed", duration = "250ms");

    requestLogger.printInfo("Request processing completed successfully");
}

public function main() returns error? {
    // Process multiple requests with different contexts
    check processUserRequest("alice123", "req-001");

    check processUserRequest("bob456", "req-002");
}
`,
];

export function ChildLoggersWithContext({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>Child loggers with context</h1>

      <p>
        This example demonstrates how to create child loggers with specific
        additional context using the Ballerina logging module. Child loggers
        inherit context from their parent loggers, allowing for hierarchical
        logging with layered context.
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
              <span>{`\$ bal run child_loggers_with_context.bal`}</span>
              <span>{`
`}</span>
              <span>{`time=2025-08-26T08:26:58.477+05:30 level=INFO module="" message="Processing user request" userId="alice123" requestId="req-001"`}</span>
              <span>{`time=2025-08-26T08:26:58.486+05:30 level=INFO module="" message="User permissions validated successfully" userId="alice123" requestId="req-001"`}</span>
              <span>{`time=2025-08-26T08:26:58.487+05:30 level=INFO module="" message="User data retrieved" recordCount=5 userId="alice123" requestId="req-001"`}</span>
              <span>{`time=2025-08-26T08:26:58.489+05:30 level=INFO module="" message="Starting data transformation" userId="alice123" requestId="req-001" operation="dataTransformation"`}</span>
              <span>{`time=2025-08-26T08:26:58.490+05:30 level=WARN module="" message="Using fallback transformation method" reason="primary method unavailable" userId="alice123" requestId="req-001" operation="dataTransformation"`}</span>
              <span>{`time=2025-08-26T08:26:58.491+05:30 level=INFO module="" message="Data transformation completed" duration="250ms" userId="alice123" requestId="req-001" operation="dataTransformation"`}</span>
              <span>{`time=2025-08-26T08:26:58.493+05:30 level=INFO module="" message="Request processing completed successfully" userId="alice123" requestId="req-001"`}</span>
              <span>{`time=2025-08-26T08:26:58.494+05:30 level=INFO module="" message="Processing user request" userId="bob456" requestId="req-002"`}</span>
              <span>{`time=2025-08-26T08:26:58.495+05:30 level=INFO module="" message="User permissions validated successfully" userId="bob456" requestId="req-002"`}</span>
              <span>{`time=2025-08-26T08:26:58.495+05:30 level=INFO module="" message="User data retrieved" recordCount=5 userId="bob456" requestId="req-002"`}</span>
              <span>{`time=2025-08-26T08:26:58.496+05:30 level=INFO module="" message="Starting data transformation" userId="bob456" requestId="req-002" operation="dataTransformation"`}</span>
              <span>{`time=2025-08-26T08:26:58.497+05:30 level=WARN module="" message="Using fallback transformation method" reason="primary method unavailable" userId="bob456" requestId="req-002" operation="dataTransformation"`}</span>
              <span>{`time=2025-08-26T08:26:58.499+05:30 level=INFO module="" message="Data transformation completed" duration="250ms" userId="bob456" requestId="req-002" operation="dataTransformation"`}</span>
              <span>{`time=2025-08-26T08:26:58.500+05:30 level=INFO module="" message="Request processing completed successfully" userId="bob456" requestId="req-002"`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <p>
        The contextual logging APIs make it easy to trace complete request flows
        and correlate related log entries without manually managing context in
        each log statement.
      </p>

      <h2>Related links</h2>

      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://ballerina.io/spec/log/#431-loggers-with-additional-context">
              <code>log</code> module - Specification
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://lib.ballerina.io/ballerina/log/latest">
              <code>log</code> module - API documentation
            </a>
          </span>
        </li>
      </ul>
      <span style={{ marginBottom: "20px" }}></span>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="Configure logging"
            href="/learn/by-example/logging-configuration/"
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
                  Configure logging
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="Logger from configuration"
            href="/learn/by-example/logger-from-config/"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Logger from configuration
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
