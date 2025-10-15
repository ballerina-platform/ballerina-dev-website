import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `import ballerina/log;
import ballerina/messaging;
import ballerina/uuid;

// Custom message store implementation using a simple in-memory map
isolated client class CustomMessageStore {
    *messaging:Store;

    private final map<readonly & messaging:Message> messages = {};
    private final map<readonly & messaging:Message> pendingMessages = {};

    isolated remote function store(anydata payload) returns error? {
        string id = uuid:createType1AsString();

        lock {
            self.messages[id] = {
                id,
                payload: payload.cloneReadOnly()
            };
        }

        log:printInfo("Message stored", id = id);
    }

    isolated remote function retrieve() returns messaging:Message|error? {
        lock {
            string[] keys = self.messages.keys();
            if keys.length() > 0 {
                string id = keys[0];
                readonly & messaging:Message message = self.messages.get(id);
                // Move message to pending state
                self.pendingMessages[id] = message;
                _ = self.messages.remove(id);
                return message;
            }
            return;
        }
    }

    isolated remote function acknowledge(string id, boolean success = true) returns error? {
        lock {
            if self.pendingMessages.hasKey(id) {
                if success {
                    _ = self.pendingMessages.remove(id);
                    log:printInfo("Message acknowledged", id = id);
                } else {
                    // Move message back to available state for negative ack
                    readonly & messaging:Message message = self.pendingMessages.get(id);
                    self.messages[id] = message;
                    _ = self.pendingMessages.remove(id);
                    log:printInfo("Message negative acknowledged", id = id);
                }
            }
        }
    }
}

public function main() returns error? {
    // Create an instance of the custom message store
    messaging:Store customStore = new CustomMessageStore();

    // Store and process a message
    check customStore->store("Hello, World!");

    messaging:Message? msg = check customStore->retrieve();
    if msg is messaging:Message {
        log:printInfo("Retrieved message", payload = msg.payload, id = msg.id);
        // Acknowledge the message
        check customStore->acknowledge(msg.id);
    }

    // Demonstrate negative acknowledgment
    check customStore->store("Test message");
    msg = check customStore->retrieve();
    if msg is messaging:Message {
        log:printInfo("Retrieved message for negative ack", payload = msg.payload, id = msg.id);
        check customStore->acknowledge(msg.id, false);

        // Retrieve the same message again after negative ack
        msg = check customStore->retrieve();
        if msg is messaging:Message {
            log:printInfo("Message available again after negative ack", payload = msg.payload, id = msg.id);
            check customStore->acknowledge(msg.id);
        }
    }
}
`,
];

export function MessageStoreType({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>Message Store Type</h1>

      <p>
        The <code>messaging</code> package in Ballerina provides messaging
        capabilities through the <code>Store</code> interface. This example
        demonstrates how to implement a custom message store by creating your
        own implementation of the <code>messaging:Store</code> type.
      </p>

      <p>
        The <code>messaging:Store</code> interface defines the contract for
        message storage, retrieval, and acknowledgment operations. By
        implementing this interface, you can create custom message stores that
        suit your specific requirements while maintaining compatibility with the
        messaging framework.
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
              <span>{`\$ bal run message_store_type.bal`}</span>
              <span>{`
`}</span>
              <span>{`time=2025-10-08T08:54:37.054+05:30 level=INFO module="" message="Message stored" id="01f0a3f6-5150-1888-861d-4d6c2cf6fef8"`}</span>
              <span>{`time=2025-10-08T08:54:37.065+05:30 level=INFO module="" message="Retrieved message" payload="Hello, World!" id="01f0a3f6-5150-1888-861d-4d6c2cf6fef8"`}</span>
              <span>{`time=2025-10-08T08:54:37.066+05:30 level=INFO module="" message="Message acknowledged" id="01f0a3f6-5150-1888-861d-4d6c2cf6fef8"`}</span>
              <span>{`time=2025-10-08T08:54:37.068+05:30 level=INFO module="" message="Message stored" id="01f0a3f6-5150-1888-a339-6e9cd9fc0e8f"`}</span>
              <span>{`time=2025-10-08T08:54:37.069+05:30 level=INFO module="" message="Retrieved message for negative ack" payload="Test message" id="01f0a3f6-5150-1888-a339-6e9cd9fc0e8f"`}</span>
              <span>{`time=2025-10-08T08:54:37.070+05:30 level=INFO module="" message="Message negative acknowledged" id="01f0a3f6-5150-1888-a339-6e9cd9fc0e8f"`}</span>
              <span>{`time=2025-10-08T08:54:37.071+05:30 level=INFO module="" message="Message available again after negative ack" payload="Test message" id="01f0a3f6-5150-1888-a339-6e9cd9fc0e8f"`}</span>
              <span>{`time=2025-10-08T08:54:37.071+05:30 level=INFO module="" message="Message acknowledged" id="01f0a3f6-5150-1888-a339-6e9cd9fc0e8f"`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <h2>Related links</h2>

      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://lib.ballerina.io/ballerina/messaging/latest/">
              <code>messaging</code> module - API documentation
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://ballerina.io/spec/messaging/">
              <code>messaging</code> module - Specification
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/in-memory-message-store/">
              In-memory message store
            </a>
          </span>
        </li>
      </ul>
      <span style={{ marginBottom: "20px" }}></span>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link title="Read/write XML" href="/learn/by-example/io-xml/">
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
                  Read/write XML
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="In-memory message store"
            href="/learn/by-example/in-memory-message-store/"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  In-memory message store
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
