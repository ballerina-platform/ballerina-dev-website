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
import ballerina/log;
import ballerina/mime;

http:Client clientEP = check new ("http://localhost:9090");

//Binds the listener to the service.
service /multiparts on new http:Listener(9090) {

    resource function post decode(http:Request request)
            returns http:Response|http:InternalServerError {
        http:Response response = new;
        // [Extracts bodyparts](https://docs.central.ballerina.io/ballerina/http/latest/classes/Request#getBodyParts) from the request.
        var bodyParts = request.getBodyParts();

        if bodyParts is mime:Entity[] {
            foreach var part in bodyParts {
                handleContent(part);
            }
            response.setPayload(bodyParts);
            return response;
        } else {
            log:printError(bodyParts.message());
            return {body:"Error in decoding multiparts!"};
        }
    }

    resource function get encode(http:Request req)
            returns http:Response|http:InternalServerError {
        //Create a \`json\` body part.
        mime:Entity jsonBodyPart = new;
        jsonBodyPart.setContentDisposition(getContentDispositionForFormData("json part"));
        jsonBodyPart.setJson({"name": "wso2"});
        //Create an \`xml\` body part as a file upload.
        mime:Entity xmlFilePart = new;
        xmlFilePart.setContentDisposition(getContentDispositionForFormData("xml file part"));
        // This file path is relative to where Ballerina is running.
        // If your file is located outside,
        // give the absolute file path instead.
        xmlFilePart.setFileAsEntityBody("./files/test.xml", contentType = mime:APPLICATION_XML);
        // Create an array to hold all the body parts.
        mime:Entity[] bodyParts = [jsonBodyPart, xmlFilePart];
        http:Request request = new;
        // [Set the body parts](https://docs.central.ballerina.io/ballerina/http/latest/classes/Request#setBodyParts) to the request.
        // Here the content-type is set as multipart form data.
        // This also works with any other multipart media type.
        // E.g., \`multipart/mixed\`, \`multipart/related\` etc.
        // You need to pass the content type that suits your requirement.
        request.setBodyParts(bodyParts, contentType = mime:MULTIPART_FORM_DATA);
        http:Response|error returnResponse = clientEP->post("/multiparts/decode", request);
        if returnResponse is http:Response {
            return returnResponse;
        } else {
            return {body:"Error occurred while sending multipart request!"};
        }
    }
}

// The content logic that handles the body parts vary based on your requirement.
function handleContent(mime:Entity bodyPart) {
    // [Get the media type](https://docs.central.ballerina.io/ballerina/mime/latest/functions#getMediaType) from the body part retrieved from the request.
    var mediaType = mime:getMediaType(bodyPart.getContentType());
    if mediaType is mime:MediaType {
        string baseType = mediaType.getBaseType();
        if mime:APPLICATION_XML == baseType || mime:TEXT_XML == baseType {
            //[Extracts \`xml\` data](https://docs.central.ballerina.io/ballerina/mime/latest/classes/Entity#getXml) from the body part.
            var payload = bodyPart.getXml();
            if payload is xml {
                log:printInfo(payload.toString());
            } else {
                log:printError(payload.message());
            }
        } else if mime:APPLICATION_JSON == baseType {
            //[Extracts \`json\` data](https://docs.central.ballerina.io/ballerina/mime/latest/classes/Entity#getJson) from the body part.
            var payload = bodyPart.getJson();
            if payload is json {
                log:printInfo(payload.toJsonString());
            } else {
                log:printError(payload.message());
            }
        } else if mime:TEXT_PLAIN == baseType {
            //[Extracts \`text\` data](https://docs.central.ballerina.io/ballerina/mime/latest/classes/Entity#getText) from the body part.
            var payload = bodyPart.getText();
            if payload is string {
                log:printInfo(payload);
            } else {
                log:printError(payload.message());
            }
        }
    }
}

function getContentDispositionForFormData(string partName) returns (mime:ContentDisposition) {
    mime:ContentDisposition contentDisposition = new;
    contentDisposition.name = partName;
    contentDisposition.disposition = "form-data";
    return contentDisposition;
}
`,
];

export default function HttpRequestWithMultiparts() {
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
      <h1>Request With multiparts</h1>

      <p>
        Ballerina supports encoding and decoding multipart content in HTTP
        requests along with nested parts.
      </p>

      <p>
        When you request multiparts from the HTTP inbound request, you get an
        array of body parts (an array of entities).
      </p>

      <p>
        You can loop through this array and handle the received body parts
        according to your requirement.
      </p>

      <p>
        For more information on the underlying module, see the{" "}
        <a href="https://docs.central.ballerina.io/ballerina/mime/latest/">
          Mime module
        </a>
        .
      </p>

      <Row className="bbeCode mx-0 py-0 rounded" style={{ marginLeft: "0px" }}>
        <Col className="d-flex align-items-start" sm={12}>
          <button
            className="bg-transparent border-0 m-0 p-2 ms-auto"
            onClick={() => {
              window.open(
                "https://github.com/ballerina-platform/ballerina-distribution/tree/v2201.1.1/examples/http-request-with-multiparts",
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

      <p>Run the service as follows.</p>

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
              <span>
                {`# In the directory, which contains the `}
                <code>{`.bal`}</code>
                {` file, create a directory named `}
                <code>{`file`}</code>
                {`,`}
              </span>
              <span>
                {`# and add an XML file named `}
                <code>{`test.xml`}</code>
                {` in it.`}
              </span>
              <span>{`\$ bal run request_with_multiparts.bal`}</span>
              <span>{`time = 2021-01-21 22:00:17,167 level = INFO  module = "" message = "{"name":"ballerina"}"`}</span>
              <span>{`time = 2021-01-21 22:01:18,466 level = INFO  module = "" message = "{"name":"wso2"}"`}</span>
              <span>{`time = 2021-01-21 22:01:18,682 level = INFO  module = "" message = "<ballerinalang>`}</span>
              <span>{`    <version>0.963</version>`}</span>
              <span>{`    <test>test xml file to be used as a file part</test>`}</span>
              <span>{`</ballerinalang>"`}</span>
              <span>{`^C[ballerina/http] stopped HTTP/WS listener 0.0.0.0:9090`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <p>
        Invoke the service by executing the following cURL command in a new
        terminal.
      </p>

      <p>
        In the directory, which contains the <code>.bal</code> file, create a
        directory named <code>file</code>, and add an XML files named{" "}
        <code>test.xml</code> in it.
      </p>

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
              <span>{`\$ curl -F "part1={\\"name\\":\\"ballerina\\"};type=application/json" http://localhost:9090/multiparts/decode -H "Content-Type: multipart/mixed" -H 'Expect:'`}</span>
              <span>{`--f710b4a02896b88a`}</span>
              <span>{`content-disposition: attachment;name="part1"`}</span>
              <span>{`content-type: application/json`}</span>
              <span>{`content-id: 0`}</span>
              <span>{`
`}</span>
              <span>{`{"name":"ballerina"}`}</span>
              <span>{`--f710b4a02896b88a--`}</span>
              <span>{`
`}</span>
              <span>{`# The cURL command, which you need to execute to encode the parts of the body and send a multipart request via the Ballerina service.`}</span>
              <span>{`\$ curl -v http://localhost:9090/multiparts/encode`}</span>
              <span>{`> GET /multiparts/encode HTTP/1.1`}</span>
              <span>{`> Host: localhost:9090`}</span>
              <span>{`> User-Agent: curl/7.64.1`}</span>
              <span>{`> Accept: */*`}</span>
              <span>{`>`}</span>
              <span>{`< HTTP/1.1 200 OK`}</span>
              <span>{`< content-type: multipart/form-data; boundary=bd7547c98465dae2`}</span>
              <span>{`< date: Wed, 23 Sep 2020 10:20:17 +0530`}</span>
              <span>{`< server: ballerina`}</span>
              <span>{`< content-length: 398`}</span>
              <span>{`<`}</span>
              <span>{`--bd7547c98465dae2`}</span>
              <span>{`content-disposition: form-data;name="json part"`}</span>
              <span>{`content-type: application/json`}</span>
              <span>{`content-id: 0`}</span>
              <span>{`
`}</span>
              <span>{`{"name":"wso2"}`}</span>
              <span>{`--bd7547c98465dae2`}</span>
              <span>{`content-disposition: form-data;name="xml file part"`}</span>
              <span>{`content-type: application/xml`}</span>
              <span>{`content-id: 1`}</span>
              <span>{`
`}</span>
              <span>{`<ballerinalang>`}</span>
              <span>{`    <version>0.963</version>`}</span>
              <span>{`    <test>test xml file to be used as a file part</test>`}</span>
              <span>{`</ballerinalang>`}</span>
              <span>{`--bd7547c98465dae2--`}</span>
              <span>{`* Connection #0 to host localhost left intact`}</span>
              <span>{`* Closing connection 0`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="Response With multiparts"
            href="/learn/by-example/http-response-with-multiparts"
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
                  Response With multiparts
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link title="Passthrough" href="/learn/by-example/http-passthrough">
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Passthrough
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
