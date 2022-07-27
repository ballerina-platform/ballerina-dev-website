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

// Caching can be enabled by setting \`enabled:true\` in the \`cache\` config of the client.
// In this example, the \`isShared\` field of the \`cacheConfig\` is set
// to true, as the cache will be a public cache in this particular scenario.
//
// The default caching policy is to cache a response only if it contains a
// \`cache-control\` header and either an \`etag\` header, or a \`last-modified\`
// header. The user can control this behaviour by setting the \`policy\` field of
// the \`cacheConfig\`. Currently, there are only 2 policies:
// \`CACHE_CONTROL_AND_VALIDATORS\` (the default policy) and \`RFC_7234\`.

http:Client cachingEP = checkpanic new ("http://localhost:8080",
                        {cache: {enabled: true, isShared: true}});
service / on new http:Listener(9090) {

    resource function get cache(http:Request req)
            returns http:Response|error? {
        http:Response response = check cachingEP->forward("/hello", req);
        // If the request was successful, an HTTP response will be
        // returned.
        return response;
    }
}

service / on new http:Listener(8080) {

    resource function 'default hello() returns http:Response {
        http:Response res = new;
        // The \`ResponseCacheControl\` object in the \`Response\` object can be
        // used for setting the cache control directives associated with the
        // response. In this example, \`max-age\` directive is set to 15 seconds
        // indicating that the response will be fresh for 15 seconds. The
        // \`must-revalidate\` directive instructs that the cache should not
        // serve a stale response without validating it with the origin server
        // first. The \`public\` directive is set by setting \`isPrivate=false\`.
        // This indicates that the response can be cached even by intermediary
        // caches which serve multiple users.
        http:ResponseCacheControl resCC = new;

        resCC.maxAge = 15;
        resCC.mustRevalidate = true;
        resCC.isPrivate = false;
        res.cacheControl = resCC;
        json payload = {"message": "Hello, World!"};

        // The \`setETag()\` function can be used for generating ETags for
        // \`string\`, \`json\`, and \`xml\` types. This uses the \`getCRC32()\`
        // function from the \`ballerina/crypto\` module for generating the ETag.
        res.setETag(payload);

        // The \`setLastModified()\` function sets the current time as the
        // \`last-modified\` header.
        res.setLastModified();

        res.setPayload(payload);
        // When sending the response, if the \`cacheControl\` field of the
        // response is set, and the user has not already set a \`cache-control\`
        // header, a \`cache-control\` header will be set using the directives set
        // in the \`cacheControl\` object.
        return res;

    }
}
`,
];

export default function HttpCachingClient() {
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
      <h1>Caching client</h1>

      <p>HTTP caching is enabled by default in HTTP client endpoints.</p>

      <p>
        Users can configure caching using the <code>cache</code> field in the
        client configurations.&lt;br/&gt;&lt;br/&gt;
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
                "https://github.com/ballerina-platform/ballerina-distribution/tree/v2201.1.1/examples/http-caching-client",
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
              <span>{`# Invoke the service.`}</span>
              <span>{`curl -v http://localhost:9090/cache`}</span>
              <span>{`> GET /cache HTTP/1.1`}</span>
              <span>{`> Host: localhost:9090`}</span>
              <span>{`> User-Agent: curl/7.64.1`}</span>
              <span>{`> Accept: */*`}</span>
              <span>{`>`}</span>
              <span>{`< HTTP/1.1 200 OK`}</span>
              <span>{`< etag: 620328e8`}</span>
              <span>{`< last-modified: Fri, 26 Nov 2021 04:22:32 GMT`}</span>
              <span>{`< content-type: application/json`}</span>
              <span>{`< cache-control: must-revalidate,public,max-age=15`}</span>
              <span>{`< date: Fri, 26 Nov 2021 09:52:32 +0530`}</span>
              <span>{`< server: ballerina`}</span>
              <span>{`< content-length: 27`}</span>
              <span>{`<`}</span>
              <span>{`{"message":"Hello, World!"}`}</span>
              <span>{``}</span>
              <span>{`curl -v http://localhost:9090/cache`}</span>
              <span>{`> GET /cache HTTP/1.1`}</span>
              <span>{`> Host: localhost:9090`}</span>
              <span>{`> User-Agent: curl/7.64.1`}</span>
              <span>{`> Accept: */*`}</span>
              <span>{`>`}</span>
              <span>{`< HTTP/1.1 200 OK`}</span>
              <span>{`< etag: 620328e8`}</span>
              <span>{`< last-modified: Fri, 26 Nov 2021 04:22:32 GMT`}</span>
              <span>{`< content-type: application/json`}</span>
              <span>{`< cache-control: must-revalidate,public,max-age=15`}</span>
              <span>{`< date: Fri, 26 Nov 2021 09:52:32 +0530`}</span>
              <span>{`< age: 8`}</span>
              <span>{`< server: ballerina`}</span>
              <span>{`< content-length: 27`}</span>
              <span>{`<`}</span>
              <span>{`{"message":"Hello, World!"}`}</span>
              <span>{``}</span>
              <span>{`curl -v http://localhost:9090/cache`}</span>
              <span>{`> GET /cache HTTP/1.1`}</span>
              <span>{`> Host: localhost:9090`}</span>
              <span>{`> User-Agent: curl/7.64.1`}</span>
              <span>{`> Accept: */*`}</span>
              <span>{`>`}</span>
              <span>{`< HTTP/1.1 200 OK`}</span>
              <span>{`< content-type: application/json`}</span>
              <span>{`< cache-control: must-revalidate,public,max-age=15`}</span>
              <span>{`< date: Fri, 26 Nov 2021 09:52:54 +0530`}</span>
              <span>{`< etag: 620328e8`}</span>
              <span>{`< last-modified: Fri, 26 Nov 2021 04:22:54 GMT`}</span>
              <span>{`< age: 0`}</span>
              <span>{`< server: ballerina`}</span>
              <span>{`< content-length: 27`}</span>
              <span>{`<`}</span>
              <span>{`{"message":"Hello, World!"}`}</span>
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
              <span>{`# The two services have to be run separately to observe the following output.`}</span>
              <span>{`# For clarity, only the relevant parts of the HTTP trace logs have been included here.`}</span>
              <span>{`bal run http_caching_client.bal -- -Cballerina.http.traceLogConsole=true`}</span>
              <span>{``}</span>
              <span>{`# The caching proxy receives a request from a client.`}</span>
              <span>{`[2021-11-26 09:52:32,588] TRACE {http.tracelog.downstream} - [id: 0x6c720951, correlatedSource: n/a, host:/0:0:0:0:0:0:0:1:9090 - remote:/0:0:0:0:0:0:0:1:50902] INBOUND: DefaultHttpRequest(decodeResult: success, version: HTTP/1.1)`}</span>
              <span>{`GET /cache HTTP/1.1`}</span>
              <span>{`Host: localhost:9090`}</span>
              <span>{`User-Agent: curl/7.64.1`}</span>
              <span>{`Accept: */*`}</span>
              <span>{``}</span>
              <span>{`# The proxy in turn, makes a request to the backend service.`}</span>
              <span>{`[2021-11-26 09:52:32,780] TRACE {http.tracelog.upstream} - [id: 0x99c1790f, correlatedSource: 0x6c720951, host:/127.0.0.1:50903 - remote:localhost/127.0.0.1:8080] OUTBOUND: DefaultHttpRequest(decodeResult: success, version: HTTP/1.1)`}</span>
              <span>{`GET /hello HTTP/1.1`}</span>
              <span>{`Accept: */*`}</span>
              <span>{`host: localhost:8080`}</span>
              <span>{`user-agent: ballerina`}</span>
              <span>{`connection: keep-alive`}</span>
              <span>{``}</span>
              <span>
                {`# The backend service responds with a 200 OK and it contains `}
                <code>{`etag`}</code>
                {` and `}
                <code>{`cache-control`}</code>
                {` headers. This response can be cached and as such the caching client caches it. As seen from the max-age directive of the 'cache-control header, this response is valid for 15 seconds.`}
              </span>
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
              <span>{``}</span>
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
              <span>{``}</span>
              <span>{`# Subsequent requests to the proxy within the next 15 seconds are served from the proxy's cache. As seen here, the backend service is not contacted.`}</span>
              <span>{`[2021-11-26 09:52:40,143] TRACE {http.tracelog.downstream} - [id: 0xc79f9038, correlatedSource: n/a, host:/0:0:0:0:0:0:0:1:9090 - remote:/0:0:0:0:0:0:0:1:50915] INBOUND: DefaultHttpRequest(decodeResult: success, version: HTTP/1.1)`}</span>
              <span>{`GET /cache HTTP/1.1`}</span>
              <span>{`Host: localhost:9090`}</span>
              <span>{`User-Agent: curl/7.64.1`}</span>
              <span>{`Accept: */*`}</span>
              <span>{``}</span>
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
              <span>{``}</span>
              <span>{`# Another request is sent after remaining idle for a while.`}</span>
              <span>{`[2021-11-26 09:52:54,648] TRACE {http.tracelog.downstream} - [id: 0x083aeb7c, correlatedSource: n/a, host:/0:0:0:0:0:0:0:1:9090 - remote:/0:0:0:0:0:0:0:1:50916] INBOUND: DefaultHttpRequest(decodeResult: success, version: HTTP/1.1)`}</span>
              <span>{`GET /cache HTTP/1.1`}</span>
              <span>{`Host: localhost:9090`}</span>
              <span>{`User-Agent: curl/7.64.1`}</span>
              <span>{`Accept: */*`}</span>
              <span>{``}</span>
              <span>
                {`# This time, the request is not served from the cache. The backend service is contacted. The `}
                <code>{`if-none-match`}</code>
                {` header sends the entity tag of the now stale response so that the backend service may determine whether this response is still valid.`}
              </span>
              <span>{`[2021-11-26 09:52:54,668] TRACE {http.tracelog.upstream} - [id: 0x99c1790f, correlatedSource: 0x083aeb7c, host:/127.0.0.1:50903 - remote:localhost/127.0.0.1:8080] OUTBOUND: DefaultHttpRequest(decodeResult: success, version: HTTP/1.1)`}</span>
              <span>{`GET /hello HTTP/1.1`}</span>
              <span>{`Accept: */*`}</span>
              <span>{`if-none-match: 620328e8`}</span>
              <span>{`if-modified-since: Fri, 26 Nov 2021 04:22:32 GMT`}</span>
              <span>{`user-agent: curl/7.64.1`}</span>
              <span>{`host: localhost:8080`}</span>
              <span>{`connection: keep-alive`}</span>
              <span>{`content-length: 0`}</span>
              <span>{``}</span>
              <span>{`# The response has not changed. Therefore, the backend services respond with a 304 Not Modified response. Based on this, the proxy will refresh the response so that it can continue serving the cached response.`}</span>
              <span>{`[2021-11-26 09:52:54,673] TRACE {http.tracelog.upstream} - [id: 0x99c1790f, correlatedSource: 0x083aeb7c, host:/127.0.0.1:50903 - remote:localhost/127.0.0.1:8080] INBOUND: DefaultHttpResponse(decodeResult: success, version: HTTP/1.1)`}</span>
              <span>{`HTTP/1.1 304 Not Modified`}</span>
              <span>{`etag: 620328e8`}</span>
              <span>{`last-modified: Fri, 26 Nov 2021 04:22:54 GMT`}</span>
              <span>{`cache-control: must-revalidate,public,max-age=15`}</span>
              <span>{`server: ballerina`}</span>
              <span>{`date: Fri, 26 Nov 2021 09:52:54 +0530`}</span>
              <span>{`content-length: 0`}</span>
              <span>{``}</span>
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
              <span>{``}</span>
              <span>{`# The output for the mock service.`}</span>
              <span>{`ball run  hello_service.bal -- -Cballerina.http.traceLogConsole=true`}</span>
              <span>{``}</span>
              <span>{`# For the first request that the caching proxy receives, it sends a request to the hello service.`}</span>
              <span>{`[2021-11-26 09:52:32,797] TRACE {http.tracelog.downstream} - [id: 0x318ba81d, correlatedSource: n/a, host:/127.0.0.1:8080 - remote:/127.0.0.1:50903] INBOUND: DefaultHttpRequest(decodeResult: success, version: HTTP/1.1)`}</span>
              <span>{`GET /hello HTTP/1.1`}</span>
              <span>{`Accept: */*`}</span>
              <span>{`host: localhost:8080`}</span>
              <span>{`user-agent: ballerina`}</span>
              <span>{`connection: keep-alive`}</span>
              <span>{``}</span>
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
              <span>{``}</span>
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
              <span>{``}</span>
              <span>
                {`# After checking the `}
                <code>{`if-none-match`}</code>
                {` header, the service determines that the response is still the same and that the proxy can keep reusing it.`}
              </span>
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

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="Client data binding"
            href="/learn/by-example/http-client-data-binding"
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
                  Client data binding
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="Service - SSL/TLS"
            href="/learn/by-example/http-service-ssl-tls"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Service - SSL/TLS
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
