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

const codeSnippetData = [
  `import ballerina/http;

type PersonAccount record {
    string name;
    int accountNo;
};

service /bank on new http:Listener(9090) {

    // The resource returns the json type values and the \`Content-type\` header is set according to the \`mediaType\`
    // field of [@http:Payload](https://lib.ballerina.io/ballerina/http/latest/records/HttpPayload)
    // annotation.
    resource function get branch() returns
            @http:Payload {mediaType:"application/json+id"} json {
        return { branch : ["Colombo, Srilanka"]};
    }

    // The [StatusCodeResponse](https://lib.ballerina.io/ballerina/http/latest/types#StatusCodeResponse)
    // can be state as return type to send responses with specific HTTP status codes.
    resource function get [string 'type]()
            returns http:Ok|http:InternalServerError {
        if 'type == "open" {

            // Creates response with 200 status code and set body as response payload.
            http:Ok ok = {body: "Bank is open"};
            return ok;
        } else {

            // Creates response with 500 status code and set body as response payload.
            http:InternalServerError err = {body: "Bank is closed"};
            return err;
        }
    }

    // Inline response records are useful to return headers and body along with status code. In this instance the
    // return type is a subtype of [http:Created](https://lib.ballerina.io/ballerina/http/latest/records/Created)
    // record, hence 201 response will be sent.
    resource function put account(@http:Payload string name)
            returns record {|*http:Created; PersonAccount body;|} {
        PersonAccount account = {accountNo: 84230, name: name};
        return {
            mediaType: "application/account+json",
            headers: {
                "Location": "/myServer/084230"
            },
            body: account
        };
    }
}
`,
];

export default function HttpResourceReturns() {
  const [codeClick1, updateCodeClick1] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();
  const [outputClick2, updateOutputClick2] = useState(false);
  const ref2 = createRef();

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
      <h1>Typed resource responses</h1>

      <p>
        The resource method can return <code>anydata</code> type, an{" "}
        <code>http:Response</code> object, <code>StatusCodeResponse</code>{" "}
        records along with
      </p>

      <p>
        <code>error?</code>. Instead of using an <code>http:Caller</code>, the
        response can be sent similarly by returning from the method.
      </p>

      <p>
        When returning <code>anydata</code>, the <code>@http:Payload</code>{" "}
        annotation can be used to specify the <code>Content-type</code> of the
        response
      </p>

      <p>
        additionally. Otherwise, the default content type of the respective
        return value type will be added.
      </p>

      <p>For more information on the underlying module,</p>

      <p>
        see the{" "}
        <a href="https://lib.ballerina.io/ballerina/http/latest/">
          HTTP module
        </a>
        .
      </p>

      <Row className="bbeCode mx-0 py-0 rounded" style={{ marginLeft: "0px" }}>
        <Col className="d-flex align-items-start" sm={12}>
          <button
            className="bg-transparent border-0 m-0 p-2 ms-auto"
            onClick={() => {
              window.open(
                "https://github.com/ballerina-platform/ballerina-distribution/tree/v2201.1.1/examples/http-resource-returns",
                "_blank"
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
                fill="#45FF00"
                className="bi bi-check"
                viewBox="0 0 16 16"
              >
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
        className="bbeOutput mx-0 py-0 rounded"
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
              <span>{`Run the cURL command below to invoke bank/branch resource.`}</span>
              <span>{`curl -v "http://localhost:9090/bank/branch"`}</span>
              <span>{`> GET /bank/branch HTTP/1.1`}</span>
              <span>{`> Host: localhost:9090`}</span>
              <span>{`> User-Agent: curl/7.64.1`}</span>
              <span>{`> Accept: */*`}</span>
              <span>{`>`}</span>
              <span>{`< HTTP/1.1 200 OK`}</span>
              <span>{`< content-type: application/json+id`}</span>
              <span>{`< content-length: 32`}</span>
              <span>{`< server: ballerina`}</span>
              <span>{`< date: Sat, 15 May 2021 16:14:10 +0530`}</span>
              <span>{`<`}</span>
              <span>{`* Connection #0 to host localhost left intact`}</span>
              <span>{`{"branch":["Colombo, Srilanka"]}* Closing connection 0`}</span>
              <span>{``}</span>
              <span>{`Run the cURL command below to invoke second resource.`}</span>
              <span>{`curl -v "http://localhost:9090/bank/open"`}</span>
              <span>{`> GET /bank/open HTTP/1.1`}</span>
              <span>{`> Host: localhost:9090`}</span>
              <span>{`> User-Agent: curl/7.64.1`}</span>
              <span>{`> Accept: */*`}</span>
              <span>{`>`}</span>
              <span>{`< HTTP/1.1 200 OK`}</span>
              <span>{`< content-type: text/plain`}</span>
              <span>{`< content-length: 12`}</span>
              <span>{`< server: ballerina`}</span>
              <span>{`< date: Sat, 15 May 2021 16:16:56 +0530`}</span>
              <span>{`<`}</span>
              <span>{`* Connection #0 to host localhost left intact`}</span>
              <span>{`Bank is open* Closing connection 0`}</span>
              <span>{``}</span>
              <span>{`Run the cURL command below to invoke bank/account resource.`}</span>
              <span>{`curl -v "http://localhost:9090/bank/account" -d "bal" -X PUT`}</span>
              <span>{`> PUT /bank/account HTTP/1.1`}</span>
              <span>{`> Host: localhost:9090`}</span>
              <span>{`> User-Agent: curl/7.64.1`}</span>
              <span>{`> Accept: */*`}</span>
              <span>{`> Content-Length: 3`}</span>
              <span>{`> Content-Type: application/x-www-form-urlencoded`}</span>
              <span>{`>`}</span>
              <span>{`< HTTP/1.1 201 Created`}</span>
              <span>{`< Location: /myServer/084230`}</span>
              <span>{`< content-type: application/account+json`}</span>
              <span>{`< content-length: 33`}</span>
              <span>{`< server: ballerina`}</span>
              <span>{`< date: Sat, 15 May 2021 16:19:31 +0530`}</span>
              <span>{`<`}</span>
              <span>{`* Connection #0 to host localhost left intact`}</span>
              <span>{`{"name":"bal", "accountNo":84230}* Closing connection 0`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <Row
        className="bbeOutput mx-0 py-0 rounded"
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
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
              </svg>
            </button>
          )}
        </Col>
        <Col sm={12}>
          <pre ref={ref2}>
            <code className="d-flex flex-column">
              <span>{`bal run http_resource_returns.bal`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="Header parameter"
            href="/learn/by-example/http-header-param"
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
                  Header parameter
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="Restrict by media type"
            href="/learn/by-example/http-restrict-by-media-type"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Restrict by media type
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
