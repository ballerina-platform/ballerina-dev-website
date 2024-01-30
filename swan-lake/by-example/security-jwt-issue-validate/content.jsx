import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `import ballerina/io;
import ballerina/jwt;

public function main() returns error? {
    // Defines the JWT issuer configurations with the private key file configurations, 
    // which are used to self-sign the JWT.
    jwt:IssuerConfig issuerConfig = {
        username: "ballerina",
        issuer: "wso2",
        audience: "vEwzbcasJVQm1jVYHUHCjhxZ4tYa",
        keyId: "NTAxZmMxNDMyZDg3MTU1ZGM0MzEzODJhZWI4NDNlZDU1OGFkNjFiMQ",
        expTime: 3600,
        // Signature can be created using either the private key configurations or keystore configurations.
        // For details, see https://lib.ballerina.io/ballerina/jwt/latest#IssuerSignatureConfig.
        signatureConfig: {
            config: {
                keyFile: "../resource/path/to/private.key"
            }
        }
    };

    // Issues a JWT based on the provided header, payload, and private key.
    string jwt = check jwt:issue(issuerConfig);
    io:println("Issued JWT: ", jwt);

    // Defines the JWT validator configurations with the public certificate file configurations, 
    // which are used to validate the signature of JWT.
    jwt:ValidatorConfig validatorConfig = {
        issuer: "wso2",
        audience: "vEwzbcasJVQm1jVYHUHCjhxZ4tYa",
        clockSkew: 60,
        // Signature can be validated using the public certificate file, truststore configurations, or JWKS configurations.
        // For detials, see https://lib.ballerina.io/ballerina/jwt/latest#ValidatorSignatureConfig.
        signatureConfig: {
            certFile: "../resource/path/to/public.crt"
        }
    };

    // Validates the created JWT.
    jwt:Payload payload = check jwt:validate(jwt, validatorConfig);
    io:println("Validated JWT Payload: ", payload.toString());
}
`,
];

export function SecurityJwtIssueValidate({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>JWT issue/validate</h1>

      <p>
        This example demonstrates how to issue a self-signed JWT and validate a
        JWT.
      </p>

      <p>
        For more information on the underlying module, see the{" "}
        <a href="https://lib.ballerina.io/ballerina/jwt/latest/">
          <code>jwt</code> module
        </a>
        .
      </p>

      <blockquote>
        <p>
          <strong>Tip:</strong> You may need to change the certificate file
          path, private key file path, and trusted certificate file path in the
          code below.
        </p>
      </blockquote>

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
                "https://github.com/ballerina-platform/ballerina-distribution/tree/v2201.8.4/examples/security-jwt-issue-validate",
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
              className="bg-transparent border-0 m-0 p-2"
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
              className="bg-transparent border-0 m-0 p-2"
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

      <p>Run the program by executing command below.</p>

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
              <span>{`\$ bal run security_jwt_issue_validate.bal`}</span>
              <span>{`Issued JWT: eyJhbGciOiJSUzI1NiIsICJ0eXAiOiJKV1QiLCAia2lkIjoiTlRBeFptTXhORE15WkR`}</span>
              <span>{`            nM01UVTFaR00wTXpFek9ESmhaV0k0TkRObFpEVTFPR0ZrTmpGaU1RIn0.eyJpc3MiOi`}</span>
              <span>{`            JiYWxsZXJpbmEiLCAic3ViIjoiYWRtaW4iLCAiYXVkIjoidkV3emJjYXNKVlFtMWpWW`}</span>
              <span>{`            UhVSENqaHhaNHRZYSIsICJqdGkiOiI1NWEwYjc1NC04OTVmLTQyNzktODg0My1iNzQ1`}</span>
              <span>{`            ZTExYTU3ZTkiLCAiZXhwIjoxNjExMTI3MDIzLCAibmJmIjoxNjExMTIzNDIzLCAiaWF`}</span>
              <span>{`            0IjoxNjExMTIzNDIzfQ.DMJDjJEFiQN7d_2CXGfXX_UR8Fi7Witr3aVGm4K7amEm3xN`}</span>
              <span>{`            cbh1bZmKO2ir-oP2_ikoM1_ETO7i4E4LKJHNAEdhqj8YHyKpbszaEq5zouMOtdFcI7i`}</span>
              <span>{`            TS8LyYDnyLEQQ6sa9L9NoMz3xULeF8epk0eaN1vVA-ijndVkZlMjaXJNf9Bgzn2qJOd`}</span>
              <span>{`            sQ6F0GeC4WKEt-xcEY5C2_haEDotSOYhUzEqh6D1fRtrGy7GaH5gzx99n-xjn8NZbTD`}</span>
              <span>{`            F0VnD6c1kJPe25FiPz24l9KdaCE1i2WbuzEhZWMclHW5RcTXVkLLkjQ4DvxfE-riGmK`}</span>
              <span>{`            qPN1gatWViZQF_VGBK-G7rEhi9Q`}</span>
              <span>{`Validated JWT Payload: {"iss":"ballerina","sub":"admin",`}</span>
              <span>{`                        "aud":"vEwzbcasJVQm1jVYHUHCjhxZ4tYa",`}</span>
              <span>{`                        "jti":"55a0b754-895f-4279-8843-b745e11a57e9",`}</span>
              <span>{`                        "exp":1611127023,"nbf":1611123423,"iat":1611123423}`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="Cryptographic operations"
            href="/learn/by-example/security-crypto"
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
                  Cryptographic operations
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="URL encode/decode operations"
            href="/learn/by-example/url-encode-decode"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  URL encode/decode operations
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
