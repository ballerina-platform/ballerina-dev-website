import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `[ballerina.log]
level = "INFO"
format = "logfmt"

# Configure root logger with TIME_BASED rotation
# Logs will rotate based on file age
[[ballerina.log.destinations]]
path = "./logs/app.log"
[ballerina.log.destinations.rotation]
policy = "TIME_BASED"
maxAge = 5  # 5 seconds for demo (use 86400 = 24 hours in production)
maxBackupFiles = 5
`,
  `import ballerina/log;
import ballerina/lang.runtime;

public function main() {
    // Root logger is configured in Config.toml with TIME_BASED rotation
    // Logs will be written to ./logs/app.log
    log:printInfo("Starting log rotation demonstration");
    log:printInfo("Application started", version = "1.0.0");

    foreach int i in 1...15 {
        log:printInfo("Processing request",
            requestId = string \`req\${i}\`,
            endpoint = "/api/users",
            responseTime = 125 + i);

        if i % 5 == 0 {
            // Sleep to demonstrate time-based rotation (5 second threshold)
            runtime:sleep(2);
        }
    }

    log:printInfo("Application processing completed");
    log:printInfo("Log rotation demonstration complete. Check ./logs directory for rotated log files.");
}
`,
];

export function LogFileRotation({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);
  const [codeClick2, updateCodeClick2] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();
  const [outputClick2, updateOutputClick2] = useState(false);
  const ref2 = createRef();

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>Log file rotation</h1>

      <p>
        Log file rotation helps manage log file sizes by automatically creating
        backups when certain conditions are met, preventing disk space issues.
        This example demonstrates TIME_BASED rotation configured through{" "}
        <code>Config.toml</code>.
      </p>

      <h2>Configuring File Rotation</h2>

      <p>
        The root logger is configured in <code>Config.toml</code> with
        TIME_BASED rotation. All logs using the default logger will
        automatically benefit from this rotation policy.
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
        className="bbeCode mx-0 py-0 rounded 
      "
        style={{ marginLeft: "0px" }}
      >
        <Col className="d-flex align-items-start" sm={12}>
          {codeClick2 ? (
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
                updateCodeClick2(true);
                copyToClipboard(codeSnippetData[1]);
                setTimeout(() => {
                  updateCodeClick2(false);
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
          {codeSnippets[1] != undefined && (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(codeSnippets[1]),
              }}
            />
          )}
        </Col>
      </Row>

      <p>Run the example to see rotation in action:</p>

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
              <span>{`\$ bal run log_file_rotation.bal`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <h2>How Rotation Works</h2>

      <p>
        When a log file rotates, it's renamed with a timestamp suffix and a new
        file is created:
      </p>

      <pre style={{ marginLeft: "0px" }} className="p-3 rounded bash">
        <code>
          logs/ app.log (current log file) app-20251223-225602.log (rotated
          backup) app-20251223-223015.log (older backup)
        </code>
      </pre>

      <p>
        Older backups beyond <code>maxBackupFiles</code> are automatically
        deleted.
      </p>

      <h3>Application Log Rotation Output</h3>

      <Row
        className="bbeOutput mx-0 py-0 rounded "
        style={{ marginLeft: "0px" }}
      >
        <Col sm={12} className="d-flex align-items-start">
          {outputClick2 ? (
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
                updateOutputClick2(true);
                const extractedText = extractOutput(ref2.current.innerText);
                copyToClipboard(extractedText);
                setTimeout(() => {
                  updateOutputClick2(false);
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
          <pre ref={ref2}>
            <code className="d-flex flex-column">
              <span>{`\$ ls -la logs/`}</span>
              <span>{`total 16`}</span>
              <span>{`drwxr-xr-x@ 4 wso2  staff   128 Jan  5 21:20 .`}</span>
              <span>{`drwxr-xr-x@ 9 wso2  staff   288 Jan  5 21:20 ..`}</span>
              <span>{`-rw-r--r--@ 1 wso2  staff  2325 Jan  5 21:20 app-20260105-212048.log`}</span>
              <span>{`-rw-r--r--@ 1 wso2  staff   248 Jan  5 21:20 app.log`}</span>
              <span>{`
`}</span>
              <span>{`\$ cat logs/app-*.log`}</span>
              <span>{`time=2026-01-05T21:20:42.771+05:30 level=INFO module="" message="Starting log rotation demonstration"`}</span>
              <span>{`time=2026-01-05T21:20:42.801+05:30 level=INFO module="" message="Application started" version="1.0.0"`}</span>
              <span>{`time=2026-01-05T21:20:42.804+05:30 level=INFO module="" message="Processing request" requestId="req1" endpoint="/api/users" responseTime=126`}</span>
              <span>{`time=2026-01-05T21:20:42.806+05:30 level=INFO module="" message="Processing request" requestId="req2" endpoint="/api/users" responseTime=127`}</span>
              <span>{`time=2026-01-05T21:20:42.808+05:30 level=INFO module="" message="Processing request" requestId="req3" endpoint="/api/users" responseTime=128`}</span>
              <span>{`time=2026-01-05T21:20:42.810+05:30 level=INFO module="" message="Processing request" requestId="req4" endpoint="/api/users" responseTime=129`}</span>
              <span>{`time=2026-01-05T21:20:42.811+05:30 level=INFO module="" message="Processing request" requestId="req5" endpoint="/api/users" responseTime=130`}</span>
              <span>{`time=2026-01-05T21:20:44.815+05:30 level=INFO module="" message="Processing request" requestId="req6" endpoint="/api/users" responseTime=131`}</span>
              <span>{`time=2026-01-05T21:20:44.816+05:30 level=INFO module="" message="Processing request" requestId="req7" endpoint="/api/users" responseTime=132`}</span>
              <span>{`time=2026-01-05T21:20:44.818+05:30 level=INFO module="" message="Processing request" requestId="req8" endpoint="/api/users" responseTime=133`}</span>
              <span>{`time=2026-01-05T21:20:44.819+05:30 level=INFO module="" message="Processing request" requestId="req9" endpoint="/api/users" responseTime=134`}</span>
              <span>{`time=2026-01-05T21:20:44.820+05:30 level=INFO module="" message="Processing request" requestId="req10" endpoint="/api/users" responseTime=135`}</span>
              <span>{`time=2026-01-05T21:20:46.823+05:30 level=INFO module="" message="Processing request" requestId="req11" endpoint="/api/users" responseTime=136`}</span>
              <span>{`time=2026-01-05T21:20:46.824+05:30 level=INFO module="" message="Processing request" requestId="req12" endpoint="/api/users" responseTime=137`}</span>
              <span>{`time=2026-01-05T21:20:46.825+05:30 level=INFO module="" message="Processing request" requestId="req13" endpoint="/api/users" responseTime=138`}</span>
              <span>{`time=2026-01-05T21:20:46.826+05:30 level=INFO module="" message="Processing request" requestId="req14" endpoint="/api/users" responseTime=139`}</span>
              <span>{`time=2026-01-05T21:20:46.827+05:30 level=INFO module="" message="Processing request" requestId="req15" endpoint="/api/users" responseTime=140`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <h2>Configuration Options</h2>

      <p>Rotation policies support these configuration parameters:</p>

      <p>| Parameter | Default | Description |</p>

      <p>|-----------|---------|-------------|</p>

      <p>
        | <code>policy</code> | <code>&quot;BOTH&quot;</code> | Rotation
        trigger: <code>&quot;SIZE_BASED&quot;</code>,{" "}
        <code>&quot;TIME_BASED&quot;</code>, or <code>&quot;BOTH&quot;</code> |
      </p>

      <p>
        | <code>maxFileSize</code> | 10485760 | Maximum file size in bytes (10MB
        default) |
      </p>

      <p>
        | <code>maxAge</code> | 86400 | Maximum file age in seconds (24 hours
        default) |
      </p>

      <p>
        | <code>maxBackupFiles</code> | 10 | Number of rotated backup files to
        retain |
      </p>

      <blockquote>
        <p>
          <strong>Note:</strong> This example uses a small threshold (5 seconds)
          to make rotation observable during demonstration. In production, use
          realistic values such as <code>maxAge = 86400</code> (24 hours).
        </p>
      </blockquote>

      <h2>Related links</h2>

      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://ballerina.io/spec/log/#35-configure-log-rotation">
              <code>log</code> module - Specification
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://lib.ballerina.io/ballerina/log/latest/">
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
            title="Child loggers with context"
            href="/learn/by-example/child-loggers-with-context/"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Child loggers with context
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
