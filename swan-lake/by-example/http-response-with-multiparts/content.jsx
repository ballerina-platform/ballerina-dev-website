import React, { useState, useEffect } from "react";
import { setCDN } from "shiki";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import {
  copyToClipboard,
  removeEscapes,
  shikiTokenizer,
} from "../../../utils/bbe";
import Link from "next/link";

setCDN("https://unpkg.com/shiki/");

const codeSnippetData = [
  `import ballerina/http;
import ballerina/io;
import ballerina/log;
import ballerina/mime;

// Creates an endpoint for the client.
http:Client clientEP = check new ("http://localhost:9092");

service /multiparts on new http:Listener(9092) {

    resource function get encode_out_response() returns http:Response {
        // Creates an enclosing entity to hold the child parts.
        mime:Entity parentPart = new;

        // Creates a child part with the JSON content.
        mime:Entity childPart1 = new;
        childPart1.setJson({"name": "wso2"});
        // Creates another child part with a file.
        mime:Entity childPart2 = new;
        // This file path is relative to where the Ballerina is running.
        //If your file is located outside, please give the
        //absolute file path instead.
        childPart2.setFileAsEntityBody("./files/test.xml",
            contentType = mime:TEXT_XML);
        // Creates an array to hold the child parts.
        mime:Entity[] childParts = [childPart1, childPart2];
        // [Sets the child parts to the parent part](https://docs.central.ballerina.io/ballerina/mime/latest/classes/Entity#setBodyParts).
        parentPart.setBodyParts(childParts,
            contentType = mime:MULTIPART_MIXED);
        // Creates an array to hold the parent part and set it to the response.
        mime:Entity[] immediatePartsToResponse = [parentPart];
        http:Response outResponse = new;
        outResponse.setBodyParts(immediatePartsToResponse,
            contentType = mime:MULTIPART_FORM_DATA);
        return outResponse;
    }
}

// Binds the listener to the service.
service /multiparts on new http:Listener(9090) {

    // This resource accepts multipart responses.
    resource function get decode_in_response()
            returns string|http:InternalServerError {
        http:Response|error returnResult = clientEP->get(
                        "/multiparts/encode_out_response");
        if (returnResult is http:Response) {
            // [Extracts the body parts](https://docs.central.ballerina.io/ballerina/http/latest/classes/Response#getBodyParts)  from the response.
            var parentParts = returnResult.getBodyParts();
            if (parentParts is mime:Entity[]) {
                //Loops through body parts.
                foreach var parentPart in parentParts {
                    handleNestedParts(parentPart);
                }
                return "Body Parts Received!";
            } else {
                return { body: "Invalid payload"};
            }
        } else {
            return { body: "Connection error"};
        }
    }
}

// Gets the child parts that are nested within the parent.
function handleNestedParts(mime:Entity parentPart) {
    string contentTypeOfParent = parentPart.getContentType();
    if (contentTypeOfParent.startsWith("multipart/")) {
        var childParts = parentPart.getBodyParts();
        if (childParts is mime:Entity[]) {
            log:printInfo("Nested Parts Detected!");
            foreach var childPart in childParts {
                handleContent(childPart);
            }
        } else {
            log:printError("Error retrieving child parts! " +
                            childParts.message());
        }
    }
}

//The content logic that handles the body parts
//vary based on your requirement.
function handleContent(mime:Entity bodyPart) {
    string baseType = getBaseType(bodyPart.getContentType());
    if (mime:APPLICATION_XML == baseType || mime:TEXT_XML == baseType) {
        // [Extracts XML data](https://docs.central.ballerina.io/ballerina/mime/latest/classes/Entity#getXml) from the body part.
        var payload = bodyPart.getXml();
        if (payload is xml) {
             log:printInfo("XML data: " + payload.toString());
        } else {
             log:printError("Error in parsing XML data", 'error = payload);
        }
    } else if (mime:APPLICATION_JSON == baseType) {
        // [Extracts JSON data](https://docs.central.ballerina.io/ballerina/mime/latest/classes/Entity#getJson) from the body part.
        var payload = bodyPart.getJson();
        if (payload is json) {
            log:printInfo("JSON data: " + payload.toJsonString());
        } else {
             log:printError("Error in parsing JSON data", 'error = payload);
        }
    } else if (mime:TEXT_PLAIN == baseType) {
        // [Extracts text data](https://docs.central.ballerina.io/ballerina/mime/latest/classes/Entity#getText) from the body part.
        var payload = bodyPart.getText();
        if (payload is string) {
            log:printInfo("Text data: " + payload);
        } else {
            log:printError("Error in parsing text data", 'error = payload);
        }
    } else if (mime:APPLICATION_PDF == baseType) {
        // [Extracts the byte stream](https://docs.central.ballerina.io/ballerina/http/latest/classes/Response#getByteStream) from the body part and saves it as a file.
        var payload = bodyPart.getByteStream();
        if (payload is stream<byte[], io:Error?>) {
            //Writes the incoming stream to a file using \`io:fileWriteBlocksFromStream\` API by providing the file location to which the content should be written to.
            io:Error? result = io:fileWriteBlocksFromStream(
                                    "./files/ReceivedFile.pdf", payload);

            if (result is error) {
                log:printError("Error occurred while writing ",
                                'error = result);
            }
            close(payload);
        } else {
            log:printError("Error in parsing byte channel :",
                            'error = payload);
        }
    }
}

//Gets the base type from a given content type.
function getBaseType(string contentType) returns string {
    var result = mime:getMediaType(contentType);
    if (result is mime:MediaType) {
        return result.getBaseType();
    } else {
        panic result;
    }
}

//Closes the byte stream.
function close(stream<byte[], io:Error?> byteStream) {
    var cr = byteStream.close();
    if (cr is error) {
        log:printError("Error occurred while closing the stream: ",
                       'error = cr);
    }
}
`,
];

export default function HttpResponseWithMultiparts() {
  const [click1, updateClick1] = useState(false);
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
    <Container className="d-flex flex-column h-100">
      <h1>Response With multiparts</h1>

      <p>
        Ballerina supports encoding and decoding multipart content in HTTP
        responses along with the nested parts.
      </p>

      <p>
        When you request multiparts from an HTTP inbound response, you get an
        array of the parts of the body (an array of
      </p>

      <p>
        entities). If the received parts contain nested parts, you can loop
        through the parent parts and get the child parts.&lt;br/&gt;&lt;br/&gt;
      </p>

      <p>For more information on the underlying module,</p>

      <p>
        see the{" "}
        <a href="https://docs.central.ballerina.io/ballerina/mime/latest/">
          Mime module
        </a>
        .
      </p>

      <Row className="bbeCode px-2 py-0 rounded" style={{ marginLeft: "0px" }}>
        <Col sm={10}>
          {codeSnippets[0] != undefined && (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(codeSnippets[0]),
              }}
            />
          )}
        </Col>
        <Col className="d-flex align-items-start pt-2" sm={2}>
          <button
            className="btn rounded ms-auto"
            onClick={() => {
              window.open(
                "https://github.com/ballerina-platform/ballerina-distribution/tree/v2201.0.3/http-response-with-multiparts",
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
          {click1 ? (
            <button
              className="btn rounded"
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
              className="btn rounded"
              onClick={() => {
                copyToClipboard(codeSnippetData[0]);
                updateClick1(true);
                setTimeout(() => {
                  updateClick1(false);
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
      </Row>

      <br />

      <Row className="bbeOutput p-2 rounded">
        <pre className="m-0">
          <code className="d-flex flex-column">
            <span>{`#To encode the outbound response with multiparts.`}</span>
            <span>{`curl -X GET http://localhost:9092/multiparts/encode_out_response`}</span>
            <span>{`--5afd3d91ee639af3`}</span>
            <span>{`content-type: multipart/mixed;boundary=de5520ef3bc703d7`}</span>
            <span>{``}</span>
            <span>{`--de5520ef3bc703d7`}</span>
            <span>{`content-type: application/json`}</span>
            <span>{``}</span>
            <span>{`{"name":"wso2"}`}</span>
            <span>{`--de5520ef3bc703d7`}</span>
            <span>{`content-type: text/xml`}</span>
            <span>{``}</span>
            <span>{`<ballerinalang>`}</span>
            <span>{`    <version>0.963</version>`}</span>
            <span>{`    <test>test xml file to be used as a file part</test>`}</span>
            <span>{`</ballerinalang>`}</span>
            <span>{`--de5520ef3bc703d7--`}</span>
            <span>{``}</span>
            <span>{`--5afd3d91ee639af3--`}</span>
            <span>{``}</span>
            <span>{`#To decode the inbound response with multiparts.`}</span>
            <span>{`curl -X GET http://localhost:9090/multiparts/decode_in_response`}</span>
            <span>{`Body Parts Received!`}</span>
          </code>
        </pre>
      </Row>

      <br />

      <Row className="bbeOutput p-2 rounded">
        <pre className="m-0">
          <code className="d-flex flex-column">
            <span>
              {`# In the directory, which contains the `}
              <code>{`.bal`}</code>
              {` file, create a directory named `}
              <code>{`files`}</code>
              {`,`}
            </span>
            <span>
              {`# and add an XML file named `}
              <code>{`test.xml`}</code>
              {` in it.`}
            </span>
            <span>{`bal run response_with_multiparts.bal`}</span>
            <span>{`time = 2021-01-21 22:20:38,143 level = INFO  module = "" message = "Nested Parts Detected!" `}</span>
            <span>{`time = 2021-01-21 22:20:38,185 level = INFO  module = "" message = "JSON data: {"name":"wso2"}" `}</span>
            <span>{`time = 2021-01-21 22:20:38,324 level = INFO  module = "" message = "XML data: <ballerinalang>`}</span>
            <span>{`    <version>0.963</version>`}</span>
            <span>{`    <test>test xml file to be used as a file part</test>`}</span>
            <span>{`</ballerinalang>"`}</span>
          </code>
        </pre>
      </Row>

      <br />

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link title="Chunking" href="/learn/by-example/http-disable-chunking">
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
                  Chunking
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="Request With multiparts"
            href="/learn/by-example/http-request-with-multiparts"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Request With multiparts
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
