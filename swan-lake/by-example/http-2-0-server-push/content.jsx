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
import ballerina/log;

// Create an endpoint with port 7090 to accept HTTP requests.
// HTTP version is set to 2.0.
listener http:Listener http2ServiceEP = new (7090,
    config = {httpVersion: "2.0"});

service /http2Service on http2ServiceEP {

    resource function 'default .(http:Caller caller) {

        // [Send a Push Promise](https://docs.central.ballerina.io/ballerina/http/latest/clients/Caller#promise).
        http:PushPromise promise1 = new (path = "/resource1", method = "GET");
        var promiseResponse1 = caller->promise(promise1);
        if (promiseResponse1 is error) {
            log:printError("Error occurred while sending the promise1",
                'error = promiseResponse1);
        }

        // Send another Push Promise.
        http:PushPromise promise2 = new (path = "/resource2", method = "GET");
        var promiseResponse2 = caller->promise(promise2);
        if (promiseResponse2 is error) {
            log:printError("Error occurred while sending the promise2",
                'error = promiseResponse2);
        }

        // Send one more Push Promise.
        http:PushPromise promise3 = new (path = "/resource3", method = "GET");
        var promiseResponse3 = caller->promise(promise3);
        if (promiseResponse3 is error) {
            log:printError("Error occurred while sending the promise3",
                'error = promiseResponse3);
        }

        // Construct the requested resource.
        http:Response res = new;
        json msg = {"response": {"name": "main resource"}};
        res.setPayload(msg);

        // Send the requested resource.
        var response = caller->respond(res);
        if (response is error) {
            log:printError("Error occurred while sending the response",
                'error = response);
        }

        // Construct promised resource1.
        http:Response push1 = new;
        msg = {"push": {"name": "resource1"}};
        push1.setPayload(msg);

        // [Push promised resource1](https://docs.central.ballerina.io/ballerina/http/latest/clients/Caller#pushPromisedResponse).
        var pushResponse1 = caller->pushPromisedResponse(promise1, push1);
        if (pushResponse1 is error) {
            log:printError("Error occurred while sending the promised " +
                           "response1", 'error = pushResponse1);
        }

        // Construct promised resource2.
        http:Response push2 = new;
        msg = {"push": {"name": "resource2"}};
        push2.setPayload(msg);

        // Push promised resource2.
        var pushResponse2 = caller->pushPromisedResponse(promise2, push2);
        if (pushResponse2 is error) {
            log:printError("Error occurred while sending the promised " +
                            "response2", 'error = pushResponse2);
        }

        // Construct promised resource3.
        http:Response push3 = new;
        msg = {"push": {"name": "resource3"}};
        push3.setPayload(msg);

        // Push promised resource3.
        var pushResponse3 = caller->pushPromisedResponse(promise3, push3);
        if (pushResponse3 is error) {
            log:printError("Error occurred while sending the promised " +
                            "response3", 'error = pushResponse3);
        }
    }
}
`,
  `import ballerina/http;
import ballerina/log;

// Create an [HTTP client](https://docs.central.ballerina.io/ballerina/http/latest/clients/Client) that can send HTTP/2 messages.
// HTTP version is set to 2.0.
final http:Client clientEP =
        check new ("http://localhost:7090", {httpVersion: "2.0"});

public function main() {

    http:Request serviceReq = new;
    http:HttpFuture httpFuture = new;
    // [Submit a request](https://docs.central.ballerina.io/ballerina/http/latest/clients/Client#submit).
    var submissionResult = clientEP->submit("GET", "/http2Service", serviceReq);

    if (submissionResult is http:HttpFuture) {
        httpFuture = submissionResult;
    } else {
        log:printError("Error occurred while submitting a request",
            'error = submissionResult);
        return;
    }

    http:PushPromise?[] promises = [];
    int promiseCount = 0;
    // [Check if promises exists](https://docs.central.ballerina.io/ballerina/http/latest/clients/Client#hasPromise).
    boolean hasPromise = clientEP->hasPromise(httpFuture);

    while (hasPromise) {
        http:PushPromise pushPromise = new;
        // [Get the next promise](https://docs.central.ballerina.io/ballerina/http/latest/clients/Client#getNextPromise).
        var nextPromiseResult = clientEP->getNextPromise(httpFuture);

        if (nextPromiseResult is http:PushPromise) {
            pushPromise = nextPromiseResult;
        } else {
            log:printError("Error occurred while fetching a push promise",
                'error = nextPromiseResult);
            return;
        }
        log:printInfo("Received a promise for " + pushPromise.path);

        if (pushPromise.path == "/resource2") {
            // The client is not interested in receiving \`/resource2\`.
            // Therefore, [reject the promise](https://docs.central.ballerina.io/ballerina/http/latest/clients/Client#rejectPromise).
            clientEP->rejectPromise(pushPromise);

            log:printInfo("Push promise for resource2 rejected");
        } else {
            // Store the required promises.
            promises[promiseCount] = pushPromise;

            promiseCount = promiseCount + 1;
        }
        hasPromise = clientEP->hasPromise(httpFuture);
    }

    http:Response response = new;
    // [Get the requested resource](https://docs.central.ballerina.io/ballerina/http/latest/clients/Client#getResponse).
    var result = clientEP->getResponse(httpFuture);

    if (result is http:Response) {
        response = result;
    } else {
        log:printError("Error occurred while fetching response",
                'error = <error>result);
        return;
    }

    var responsePayload = response.getJsonPayload();
    if (responsePayload is json) {
        log:printInfo("Response : " + responsePayload.toJsonString());
    } else {
        log:printError("Expected response payload not received",
          'error = responsePayload);
    }

    // Fetch required promise responses.
    foreach var p in promises {
        http:PushPromise promise = <http:PushPromise>p;
        http:Response promisedResponse = new;
        var promisedResponseResult = clientEP->getPromisedResponse(promise);
        if (promisedResponseResult is http:Response) {
            promisedResponse = promisedResponseResult;
        } else {
            log:printError("Error occurred while fetching promised response",
                'error = promisedResponseResult);
            return;
        }
        var promisedPayload = promisedResponse.getJsonPayload();
        if (promisedPayload is json) {
            log:printInfo("Promised resource : " +
                           promisedPayload.toJsonString());
        } else {
            log:printError("Expected promised response payload not received",
                'error = promisedPayload);
        }
    }
}
`,
];

export default function Http20ServerPush() {
  const [click1, updateClick1] = useState(false);
  const [click2, updateClick2] = useState(false);
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
      <h1>HTTP 2.0 server push</h1>

      <p>
        HTTP/2 server push messages can be sent and received using the Ballerina{" "}
        <code>http</code> library.
      </p>

      <p>
        HTTP/2 Server Push messages allow the server to send resources to the
        client before the client requests for it.&lt;br/&gt;&lt;br/&gt;
      </p>

      <p>For more information on the underlying module,</p>

      <p>
        see the{" "}
        <a href="https://docs.central.ballerina.io/ballerina/http/latest/">
          HTTP module
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
                "https://github.com/ballerina-platform/ballerina-distribution/tree/v2201.0.3/http-2-0-server-push",
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
            <span>{`bal run http_2.0_service.bal`}</span>
          </code>
        </pre>
      </Row>

      <Row className="bbeCode px-2 py-0 rounded" style={{ marginLeft: "0px" }}>
        <Col sm={10}>
          {codeSnippets[1] != undefined && (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(codeSnippets[1]),
              }}
            />
          )}
        </Col>
        <Col className="d-flex align-items-start pt-2" sm={2}>
          <button
            className="btn rounded ms-auto"
            onClick={() => {
              window.open(
                "https://github.com/ballerina-platform/ballerina-distribution/tree/v2201.0.3/http-2-0-server-push",
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
          {click2 ? (
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
                copyToClipboard(codeSnippetData[1]);
                updateClick2(true);
                setTimeout(() => {
                  updateClick2(false);
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
            <span>{`bal run http_client.bal`}</span>
            <span>{`time = 2021-01-21 18:54:45,237 level = INFO  module = "" message = "Received a promise for /resource1"`}</span>
            <span>{`time = 2021-01-21 18:54:45,278 level = INFO  module = "" message = "Received a promise for /resource2"`}</span>
            <span>{`time = 2021-01-21 18:54:45,281 level = INFO  module = "" message = "Push promise for resource2 rejected"`}</span>
            <span>{`time = 2021-01-21 18:54:45,283 level = INFO  module = "" message = "Received a promise for /resource3"`}</span>
            <span>{`time = 2021-01-21 18:54:45,306 level = INFO  module = "" message = "Response : {"response":{"name":"main resource"}}"`}</span>
            <span>{`time = 2021-01-21 18:54:45,314 level = INFO  module = "" message = "Promised resource : {"push":{"name":"resource1"}}"`}</span>
            <span>{`time = 2021-01-21 18:54:45,468 level = INFO  module = "" message = "Promised resource : {"push":{"name":"resource3"}}"`}</span>
          </code>
        </pre>
      </Row>

      <br />

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="HTTP 1.1 to 2.0 protocol switch"
            href="/learn/by-example/http-1-1-to-2-0-protocol-switch"
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
                  HTTP 1.1 to 2.0 protocol switch
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="Hello world"
            href="/learn/by-example/graphql-hello-world"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Hello world
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
