import React, { useState, useEffect, createRef } from "react";
import { setCDN } from "shiki";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import {
  copyToClipboard,
  extractOutput,
  shikiTokenizer,
} from "../../../utils/bbe";
import Link from "next/link";

setCDN("https://unpkg.com/shiki/");

const codeSnippetData = [];

export default function GrpcServiceBasicAuthFileUserStore() {
  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();

  const [codeSnippets, updateSnippets] = useState([]);
  const [btnHover, updateBtnHover] = useState([false, false]);

  useEffect(() => {
    async function loadCode() {
      for (let snippet of codeSnippetData) {
        const output = await shikiTokenizer(snippet, "ballerina");
        updateSnippets((prevSnippets) => [...prevSnippets, output]);
      }
    }
    loadCode();
  }, []);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>Service - Basic Auth file user store</h1>

      <p>
        A gRPC service/resource can be secured with Basic Auth and optionally by
        enforcing authorization. Then, it validates the Basic Auth token sent as
        the <code>Authorization</code> metadata against the provided
        configurations. This reads data from a file, which has a TOML format.
        This stores the usernames, passwords for authentication, and scopes for
        authorization.
      </p>

      <p>
        Ballerina uses the concept of scopes for authorization. A resource
        declared in a service can be bound to one/more scope(s). In the
        authorization phase, the scopes of the service/resource are compared
        against the scope included in the user store for at least one match
        between the two sets.
      </p>

      <p>
        <code>Config.toml</code> has defined three users - alice, ldclakmal, and
        eve. Each user has a password and optionally assigned scopes as an
        array.
      </p>

      <p>
        For more information on the underlying module, see the{" "}
        <a href="https://lib.ballerina.io/ballerina/auth/latest/">
          Auth module
        </a>
        .
      </p>

      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>4.</span>
          <span>
            As a prerequisite, ensure that the <code>Config.toml</code> file is
            populated correctly with the user information.
          </span>
        </li>
      </ul>

      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>6.</span>
          <span>
            Execute the commands below to build and run the 'service' package.
          </span>
        </li>
      </ul>

      <Row
        className="bbeOutput mx-0 py-0 rounded"
        style={{ marginLeft: "24px" }}
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
                fill="#00FF19"
                className="output-btn bi bi-check"
                viewBox="0 0 16 16"
              >
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
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
              </svg>
            </button>
          )}
        </Col>
        <Col sm={12}>
          <pre ref={ref1}>
            <code className="d-flex flex-column">
              <span>{`echo '[["ballerina.auth.users"]]`}</span>
              <span>{`username="alice"`}</span>
              <span>{`password="password1"`}</span>
              <span>{`scopes=["scope1"]`}</span>
              <span>{`[["ballerina.auth.users"]]`}</span>
              <span>{`username="bob"`}</span>
              <span>{`password="password2"`}</span>
              <span>{`scopes=["scope2", "scope3"]' > Config.toml`}</span>
              <span>{`
`}</span>
              <span>{`\$ bal build service`}</span>
              <span>{`
`}</span>
              <span>{`\$ bal run service/target/bin/service.jar`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <p>
        You may need to change the certificate file path and private key file
        path.
      </p>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="Service - Mutual SSL"
            href="/learn/by-example/grpc-service-mutual-ssl"
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
                  Service - Mutual SSL
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="Service - Basic Auth LDAP user store"
            href="/learn/by-example/grpc-service-basic-auth-ldap-user-store"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Service - Basic Auth LDAP user store
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
