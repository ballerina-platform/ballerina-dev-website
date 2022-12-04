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
import ballerina/io;

public function main() returns error? {
    // Caching can be enabled by setting \`enabled:true\` in the \`cache\` config of the client.
    // In this example, the \`isShared\` field of the \`cacheConfig\` is set
    // to true, as the cache will be a public cache in this particular scenario.
    //
    // The default caching policy is to cache a response only if it contains a
    // \`cache-control\` header and either an \`etag\` header, or a \`last-modified\`
    // header. The user can control this behaviour by setting the \`policy\` field of
    // the \`cacheConfig\`. Currently, there are only 2 policies:
    // \`CACHE_CONTROL_AND_VALIDATORS\` (the default policy) and \`RFC_7234\`.
    http:Client httpClient = check new ("localhost:9090",
        cache = {
            enabled: true,
            isShared: true
        }
    );
    string payload = check httpClient->get("/greeting");
    io:println(payload);
}
`,
];

export default function HttpCachingClient() {
  const [codeClick1, updateCodeClick1] = useState(false);

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
      <h1>HTTP client - Caching</h1>

      <p>
        HTTP caching is enabled by default in HTTP client endpoints. Users can
        configure caching using the <code>cache</code> field in the client
        configurations.
      </p>

      <Row
        className="bbeCode mx-0 py-0 rounded 
      "
        style={{ marginLeft: "0px" }}
      >
        <Col className="d-flex align-items-start" sm={12}>
          {codeClick1 ? (
            <button
              className="bg-transparent border-0 m-0 p-2 ms-auto"
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
              className="bg-transparent border-0 m-0 p-2 ms-auto"
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

      <h2>Prerequisites</h2>

      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            Run the HTTP service given in the{" "}
            <a href="learn/by-example/http-service-cache-response/">
              Sending cache response service
            </a>{" "}
            example.
          </span>
        </li>
      </ul>

      <p>Run the client program by executing the following command.</p>

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
              <span>{`\$ bal run http_caching_client.bal -- -Cballerina.http.traceLogConsole=true`}</span>
              <span>{`
`}</span>
              <span>{`# The caching proxy receives a request from a client.`}</span>
              <span>{`[2021-11-26 09:52:32,588] TRACE {http.tracelog.downstream} - [id: 0x6c720951, correlatedSource: n/a, host:/0:0:0:0:0:0:0:1:9090 - remote:/0:0:0:0:0:0:0:1:50902] INBOUND: DefaultHttpRequest(decodeResult: success, version: HTTP/1.1)`}</span>
              <span>{`GET /greeting HTTP/1.1`}</span>
              <span>{`Host: localhost:9090`}</span>
              <span>{`User-Agent: curl/7.64.1`}</span>
              <span>{`Accept: */*`}</span>
              <span>{`
`}</span>
              <span>{`# The proxy in turn, makes a request to the backend service.`}</span>
              <span>{`[2021-11-26 09:52:32,780] TRACE {http.tracelog.upstream} - [id: 0x99c1790f, correlatedSource: 0x6c720951, host:/127.0.0.1:50903 - remote:localhost/127.0.0.1:8080] OUTBOUND: DefaultHttpRequest(decodeResult: success, version: HTTP/1.1)`}</span>
              <span>{`GET /hello HTTP/1.1`}</span>
              <span>{`Accept: */*`}</span>
              <span>{`host: localhost:8080`}</span>
              <span>{`user-agent: ballerina`}</span>
              <span>{`connection: keep-alive`}</span>
              <span>{`
`}</span>
              <span>{`# The backend service responds with a 200 OK and it contains \`etag\` and \`cache-control\` headers. This response can be cached and as such the caching client caches it. As seen from the max-age directive of the 'cache-control header, this response is valid for 15 seconds.`}</span>
              <span>{`[2021-11-26 09:52:32,896] TRACE {http.tracelog.upstream} - [id: 0x99c1790f, correlatedSource: 0x6c720951, host:/127.0.0.1:50903 - remote:localhost/127.0.0.1:8080] INBOUND: DefaultHttpResponse(decodeResult: success, version: HTTP/1.1)`}</span>
              <span>{`HTTP/1.1 200 OK`}</span>
              <span>{`etag: 620328e8`}</span>
              <span>{`last-modified: Fri, 26 Nov 2021 04:22:32 GMT`}</span>
              <span>{`content-type: application/json`}</span>
              <span>{`cache-control: must-revalidate,public,max-age=15`}</span>
              <span>{`server: ballerina`}</span>
              <span>{`date: Fri, 26 Nov 2021 09:52:32 +0530`}</span>
              <span>{`content-length: 27`}</span>
              <span>{`{"message":"Hello, World!"}`}</span>
              <span>{`
`}</span>
              <span>{`# The response is sent back to the client.`}</span>
              <span>{`[2021-11-26 09:52:32,916] TRACE {http.tracelog.downstream} - [id: 0x6c720951, correlatedSource: n/a, host:localhost/0:0:0:0:0:0:0:1:9090 - remote:/0:0:0:0:0:0:0:1:50902] OUTBOUND: DefaultFullHttpResponse(decodeResult: success, version: HTTP/1.1, content: CompositeByteBuf(ridx: 0, widx: 27, cap: 27, components=1))`}</span>
              <span>{`HTTP/1.1 200 OK`}</span>
              <span>{`etag: 620328e8`}</span>
              <span>{`last-modified: Fri, 26 Nov 2021 04:22:32 GMT`}</span>
              <span>{`content-type: application/json`}</span>
              <span>{`cache-control: must-revalidate,public,max-age=15`}</span>
              <span>{`date: Fri, 26 Nov 2021 09:52:32 +0530`}</span>
              <span>{`server: ballerina`}</span>
              <span>{`content-length: 27, 27B`}</span>
              <span>{`{"message":"Hello, World!"}`}</span>
              <span>{`
`}</span>
              <span>{`# Subsequent requests to the proxy within the next 15 seconds are served from the proxy's cache. As seen here, the backend service is not contacted.`}</span>
              <span>{`[2021-11-26 09:52:40,143] TRACE {http.tracelog.downstream} - [id: 0xc79f9038, correlatedSource: n/a, host:/0:0:0:0:0:0:0:1:9090 - remote:/0:0:0:0:0:0:0:1:50915] INBOUND: DefaultHttpRequest(decodeResult: success, version: HTTP/1.1)`}</span>
              <span>{`GET /greeting HTTP/1.1`}</span>
              <span>{`Host: localhost:9090`}</span>
              <span>{`User-Agent: curl/7.64.1`}</span>
              <span>{`Accept: */*`}</span>
              <span>{`
`}</span>
              <span>{`# Cached response.`}</span>
              <span>{`[2021-11-26 09:52:40,181] TRACE {http.tracelog.downstream} - [id: 0xc79f9038, correlatedSource: n/a, host:localhost/0:0:0:0:0:0:0:1:9090 - remote:/0:0:0:0:0:0:0:1:50915] OUTBOUND: DefaultFullHttpResponse(decodeResult: success, version: HTTP/1.1, content: CompositeByteBuf(ridx: 0, widx: 27, cap: 27, components=1))`}</span>
              <span>{`HTTP/1.1 200 OK`}</span>
              <span>{`etag: 620328e8`}</span>
              <span>{`last-modified: Fri, 26 Nov 2021 04:22:32 GMT`}</span>
              <span>{`content-type: application/json`}</span>
              <span>{`cache-control: must-revalidate,public,max-age=15`}</span>
              <span>{`date: Fri, 26 Nov 2021 09:52:32 +0530`}</span>
              <span>{`age: 8`}</span>
              <span>{`server: ballerina`}</span>
              <span>{`content-length: 27, 27B`}</span>
              <span>{`{"message":"Hello, World!"}`}</span>
              <span>{`
`}</span>
              <span>{`# Another request is sent after remaining idle for a while.`}</span>
              <span>{`[2021-11-26 09:52:54,648] TRACE {http.tracelog.downstream} - [id: 0x083aeb7c, correlatedSource: n/a, host:/0:0:0:0:0:0:0:1:9090 - remote:/0:0:0:0:0:0:0:1:50916] INBOUND: DefaultHttpRequest(decodeResult: success, version: HTTP/1.1)`}</span>
              <span>{`GET /greeting HTTP/1.1`}</span>
              <span>{`Host: localhost:9090`}</span>
              <span>{`User-Agent: curl/7.64.1`}</span>
              <span>{`Accept: */*`}</span>
              <span>{`
`}</span>
              <span>{`# This time, the request is not served from the cache. The backend service is contacted. The \`if-none-match\` header sends the entity tag of the now stale response so that the backend service may determine whether this response is still valid.`}</span>
              <span>{`[2021-11-26 09:52:54,668] TRACE {http.tracelog.upstream} - [id: 0x99c1790f, correlatedSource: 0x083aeb7c, host:/127.0.0.1:50903 - remote:localhost/127.0.0.1:8080] OUTBOUND: DefaultHttpRequest(decodeResult: success, version: HTTP/1.1)`}</span>
              <span>{`GET /hello HTTP/1.1`}</span>
              <span>{`Accept: */*`}</span>
              <span>{`if-none-match: 620328e8`}</span>
              <span>{`if-modified-since: Fri, 26 Nov 2021 04:22:32 GMT`}</span>
              <span>{`user-agent: curl/7.64.1`}</span>
              <span>{`host: localhost:8080`}</span>
              <span>{`connection: keep-alive`}</span>
              <span>{`content-length: 0`}</span>
              <span>{`
`}</span>
              <span>{`# The response has not changed. Therefore, the backend services respond with a 304 Not Modified response. Based on this, the proxy will refresh the response so that it can continue serving the cached response.`}</span>
              <span>{`[2021-11-26 09:52:54,673] TRACE {http.tracelog.upstream} - [id: 0x99c1790f, correlatedSource: 0x083aeb7c, host:/127.0.0.1:50903 - remote:localhost/127.0.0.1:8080] INBOUND: DefaultHttpResponse(decodeResult: success, version: HTTP/1.1)`}</span>
              <span>{`HTTP/1.1 304 Not Modified`}</span>
              <span>{`etag: 620328e8`}</span>
              <span>{`last-modified: Fri, 26 Nov 2021 04:22:54 GMT`}</span>
              <span>{`cache-control: must-revalidate,public,max-age=15`}</span>
              <span>{`server: ballerina`}</span>
              <span>{`date: Fri, 26 Nov 2021 09:52:54 +0530`}</span>
              <span>{`content-length: 0`}</span>
              <span>{`
`}</span>
              <span>{`# The cached response is served yet again since the response has not changed.`}</span>
              <span>{`[2021-11-26 09:52:54,688] TRACE {http.tracelog.downstream} - [id: 0x083aeb7c, correlatedSource: n/a, host:localhost/0:0:0:0:0:0:0:1:9090 - remote:/0:0:0:0:0:0:0:1:50916] OUTBOUND: DefaultFullHttpResponse(decodeResult: success, version: HTTP/1.1, content: CompositeByteBuf(ridx: 0, widx: 27, cap: 27, components=1))`}</span>
              <span>{`HTTP/1.1 200 OK`}</span>
              <span>{`content-type: application/json`}</span>
              <span>{`cache-control: must-revalidate,public,max-age=15`}</span>
              <span>{`date: Fri, 26 Nov 2021 09:52:54 +0530`}</span>
              <span>{`etag: 620328e8`}</span>
              <span>{`last-modified: Fri, 26 Nov 2021 04:22:54 GMT`}</span>
              <span>{`age: 0`}</span>
              <span>{`server: ballerina`}</span>
              <span>{`content-length: 27, 27B`}</span>
              <span>{`{"message":"Hello, World!"}`}</span>
              <span>{`
`}</span>
              <span>{`# The output for the mock service.`}</span>
              <span>{`ball run  hello_service.bal -- -Cballerina.http.traceLogConsole=true`}</span>
              <span>{`
`}</span>
              <span>{`# For the first request that the caching proxy receives, it sends a request to the hello service.`}</span>
              <span>{`[2021-11-26 09:52:32,797] TRACE {http.tracelog.downstream} - [id: 0x318ba81d, correlatedSource: n/a, host:/127.0.0.1:8080 - remote:/127.0.0.1:50903] INBOUND: DefaultHttpRequest(decodeResult: success, version: HTTP/1.1)`}</span>
              <span>{`GET /hello HTTP/1.1`}</span>
              <span>{`Accept: */*`}</span>
              <span>{`host: localhost:8080`}</span>
              <span>{`user-agent: ballerina`}</span>
              <span>{`connection: keep-alive`}</span>
              <span>{`
`}</span>
              <span>{`# The service responds with a 200 OK with the relevant caching headers set.`}</span>
              <span>{`[2021-11-26 09:52:32,890] TRACE {http.tracelog.downstream} - [id: 0x318ba81d, correlatedSource: n/a, host:localhost/127.0.0.1:8080 - remote:/127.0.0.1:50903] OUTBOUND: DefaultFullHttpResponse(decodeResult: success, version: HTTP/1.1, content: CompositeByteBuf(ridx: 0, widx: 27, cap: 27, components=1))`}</span>
              <span>{`HTTP/1.1 200 OK`}</span>
              <span>{`etag: 620328e8`}</span>
              <span>{`last-modified: Fri, 26 Nov 2021 04:22:32 GMT`}</span>
              <span>{`content-type: application/json`}</span>
              <span>{`cache-control: must-revalidate,public,max-age=15`}</span>
              <span>{`content-length: 27`}</span>
              <span>{`server: ballerina`}</span>
              <span>{`date: Fri, 26 Nov 2021 09:52:32 +0530, 27B`}</span>
              <span>{`{"message":"Hello, World!"}`}</span>
              <span>{`
`}</span>
              <span>{`# The backend service only gets another request when the cached response and the proxy have expired and it wants to validate it again.`}</span>
              <span>{`[2021-11-26 09:52:54,669] TRACE {http.tracelog.downstream} - [id: 0x318ba81d, correlatedSource: n/a, host:localhost/127.0.0.1:8080 - remote:/127.0.0.1:50903] INBOUND: DefaultHttpRequest(decodeResult: success, version: HTTP/1.1)`}</span>
              <span>{`GET /hello HTTP/1.1`}</span>
              <span>{`Accept: */*`}</span>
              <span>{`if-none-match: 620328e8`}</span>
              <span>{`if-modified-since: Fri, 26 Nov 2021 04:22:32 GMT`}</span>
              <span>{`user-agent: curl/7.64.1`}</span>
              <span>{`host: localhost:8080`}</span>
              <span>{`connection: keep-alive`}</span>
              <span>{`content-length: 0`}</span>
              <span>{`
`}</span>
              <span>{`# After checking the \`if-none-match\` header, the service determines that the response is still the same and that the proxy can keep reusing it.`}</span>
              <span>{`[2021-11-26 09:52:54,672] TRACE {http.tracelog.downstream} - [id: 0x318ba81d, correlatedSource: n/a, host:localhost/127.0.0.1:8080 - remote:/127.0.0.1:50903] OUTBOUND: DefaultFullHttpResponse(decodeResult: success, version: HTTP/1.1, content: CompositeByteBuf(ridx: 0, widx: 0, cap: 0, components=1))`}</span>
              <span>{`HTTP/1.1 304 Not Modified`}</span>
              <span>{`etag: 620328e8`}</span>
              <span>{`last-modified: Fri, 26 Nov 2021 04:22:54 GMT`}</span>
              <span>{`cache-control: must-revalidate,public,max-age=15`}</span>
              <span>{`content-length: 0`}</span>
              <span>{`server: ballerina`}</span>
              <span>{`date: Fri, 26 Nov 2021 09:52:54 +0530, 0B`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <h2>Related links</h2>

      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://lib.ballerina.io/ballerina/http/latest/">
              <code>http</code> package - API documentation
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/spec/http/#2412-caching">
              HTTP client caching - Specification
            </a>
          </span>
        </li>
      </ul>
      <span style={{ marginBottom: "20px" }}></span>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link title="Chunking" href="/learn/by-example/http-client-chunking">
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
            title="Request with multiparts"
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
                  Request with multiparts
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
