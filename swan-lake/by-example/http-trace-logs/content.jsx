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

service /hello on new http:Listener(9090) {

    resource function get .(http:Request req) returns http:Response|error {
        http:Client clientEP = check new ("https://httpstat.us");
        http:Response resp = check clientEP->forward("/200", req);
        return resp;
    }
}
`,
];

export default function HttpTraceLogs() {
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
    <Container className="d-flex flex-column h-100">
      <h1>Trace logs</h1>

      <p>
        The HTTP trace logs can be used to monitor the HTTP traffic that goes in
        and out of Ballerina.
      </p>

      <p>
        To enable trace logs, the log level has to be set to <code>TRACE</code>{" "}
        using the runtime argument:
      </p>

      <p>
        &lt;br&gt; <code>-Cballerina.http.traceLogConsole=true</code>.
        &lt;br&gt;
      </p>

      <p>
        The configurations can be set in the <code>Config.toml</code> file for
        advanced use cases such as specifying the file path
      </p>

      <p>
        to save the trace logs and specifying the hostname and port of a socket
        service to publish the trace logs.&lt;br/&gt;&lt;br/&gt;
      </p>

      <p>For more information on the underlying module,</p>

      <p>
        see the{" "}
        <a href="https://docs.central.ballerina.io/ballerina/http/latest/">
          HTTP module
        </a>
        .
      </p>

      <Row
        className="bbeCode mx-0 px-2 py-0 rounded"
        style={{ marginLeft: "0px" }}
      >
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
                "https://github.com/ballerina-platform/ballerina-distribution/tree/v2201.1.1/examples/http-trace-logs",
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
      </Row>

      <br />

      <Row className="bbeOutput mx-0 px-2 rounded">
        <Col className="my-2" sm={10}>
          <pre className="m-0" ref={ref1}>
            <code className="d-flex flex-column">
              <span>{`# Invoke the service.`}</span>
              <span>{`curl http://localhost:9090/hello`}</span>
              <span>{`200 OK`}</span>
            </code>
          </pre>
        </Col>
        <Col sm={2} className="d-flex align-items-start">
          {outputClick1 ? (
            <button
              className="btn rounded ms-auto"
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
              className="btn rounded ms-auto"
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
      </Row>

      <br />

      <Row className="bbeOutput mx-0 px-2 rounded">
        <Col className="my-2" sm={10}>
          <pre className="m-0" ref={ref2}>
            <code className="d-flex flex-column">
              <span>{`bal run http_trace_logs.bal -- -Cballerina.http.traceLogConsole=true`}</span>
              <span>{`ballerina: HTTP trace log enabled`}</span>
              <span>{``}</span>
              <span>
                {`# In the logs, `}
                <code>{`http.downstream`}</code>
                {` refers to the HTTP traffic that flows between the client and Ballerina`}
              </span>
              <span>
                {`# while `}
                <code>{`http.upstream`}</code>
                {` refers to the HTTP traffic that flows between Ballerina and the backend.`}
              </span>
              <span>{``}</span>
              <span>{`[2021-10-06 18:18:11,118] TRACE {http.tracelog.downstream} - [id: 0x91dfb8c7] REGISTERED`}</span>
              <span>{`[2021-10-06 18:18:11,151] TRACE {http.tracelog.downstream} - [id: 0x91dfb8c7, correlatedSource: n/a, host:/0:0:0:0:0:0:0:1:9090 - remote:/0:0:0:0:0:0:0:1:50367] ACTIVE`}</span>
              <span>{`[2021-10-06 18:18:11,187] TRACE {http.tracelog.downstream} - [id: 0x91dfb8c7, correlatedSource: n/a, host:/0:0:0:0:0:0:0:1:9090 - remote:/0:0:0:0:0:0:0:1:50367] INBOUND: DefaultHttpRequest(decodeResult: success, version: HTTP/1.1)`}</span>
              <span>{`GET /hello HTTP/1.1`}</span>
              <span>{`Host: localhost:9090`}</span>
              <span>{`User-Agent: curl/7.64.1`}</span>
              <span>{`Accept: */*`}</span>
              <span>{`[2021-10-06 18:18:11,223] TRACE {http.tracelog.downstream} - [id: 0x91dfb8c7, correlatedSource: n/a, host:localhost/0:0:0:0:0:0:0:1:9090 - remote:/0:0:0:0:0:0:0:1:50367] INBOUND: EmptyLastHttpContent, 0B`}</span>
              <span>{`[2021-10-06 18:18:11,225] TRACE {http.tracelog.downstream} - [id: 0x91dfb8c7, correlatedSource: n/a, host:localhost/0:0:0:0:0:0:0:1:9090 - remote:/0:0:0:0:0:0:0:1:50367] READ COMPLETE`}</span>
              <span>{`[2021-10-06 18:18:11,418] TRACE {http.tracelog.upstream} - [id: 0xf7c32f4c] REGISTERED`}</span>
              <span>{`[2021-10-06 18:18:11,418] TRACE {http.tracelog.upstream} - [id: 0xf7c32f4c] CONNECT: httpstat.us/172.67.134.121:80, null`}</span>
              <span>{`[2021-10-06 18:18:11,661] TRACE {http.tracelog.upstream} - [id: 0xf7c32f4c, correlatedSource: n/a, host:/192.168.1.21:50368 - remote:httpstat.us/172.67.134.121:80] DEREGISTER`}</span>
              <span>{`[2021-10-06 18:18:11,664] TRACE {http.tracelog.upstream} - [id: 0xf7c32f4c, correlatedSource: n/a, host:/192.168.1.21:50368 - remote:httpstat.us/172.67.134.121:80] ACTIVE`}</span>
              <span>{`[2021-10-06 18:18:11,665] TRACE {http.tracelog.upstream} - [id: 0xf7c32f4c, correlatedSource: n/a, host:/192.168.1.21:50368 - remote:httpstat.us/172.67.134.121:80] UNREGISTERED`}</span>
              <span>{`[2021-10-06 18:18:11,665] TRACE {http.tracelog.upstream} - [id: 0xf7c32f4c] REGISTERED`}</span>
              <span>{`[2021-10-06 18:18:11,671] TRACE {http.tracelog.upstream} - [id: 0xf7c32f4c, correlatedSource: 0x91dfb8c7, host:/192.168.1.21:50368 - remote:httpstat.us/172.67.134.121:80] OUTBOUND: DefaultHttpRequest(decodeResult: success, version: HTTP/1.1)`}</span>
              <span>{`GET /200 HTTP/1.1`}</span>
              <span>{`Accept: */*`}</span>
              <span>{`host: httpstat.us`}</span>
              <span>{`user-agent: ballerina`}</span>
              <span>{`connection: keep-alive`}</span>
              <span>{`[2021-10-06 18:18:11,674] TRACE {http.tracelog.upstream} - [id: 0xf7c32f4c, correlatedSource: 0x91dfb8c7, host:/192.168.1.21:50368 - remote:httpstat.us/172.67.134.121:80] OUTBOUND: EmptyLastHttpContent, 0B`}</span>
              <span>{`[2021-10-06 18:18:11,675] TRACE {http.tracelog.upstream} - [id: 0xf7c32f4c, correlatedSource: 0x91dfb8c7, host:/192.168.1.21:50368 - remote:httpstat.us/172.67.134.121:80] FLUSH`}</span>
              <span>{`[2021-10-06 18:18:12,027] TRACE {http.tracelog.upstream} - [id: 0xf7c32f4c, correlatedSource: 0x91dfb8c7, host:/192.168.1.21:50368 - remote:httpstat.us/172.67.134.121:80] INBOUND: DefaultHttpResponse(decodeResult: success, version: HTTP/1.1)`}</span>
              <span>{`HTTP/1.1 200 OK`}</span>
              <span>{`Date: Wed, 06 Oct 2021 12:48:11 GMT`}</span>
              <span>{`Content-Type: text/plain; charset=utf-8`}</span>
              <span>{`Transfer-Encoding: chunked`}</span>
              <span>{`Connection: keep-alive`}</span>
              <span>{`cache-control: private`}</span>
              <span>{`vary: Accept-Encoding`}</span>
              <span>{`x-aspnetmvc-version: 5.1`}</span>
              <span>{`access-control-allow-origin: *`}</span>
              <span>{`access-control-expose-headers: Link, Content-Range, Location, WWW-Authenticate, Proxy-Authenticate, Retry-After`}</span>
              <span>{`access-control-expose-headers: Request-Context`}</span>
              <span>{`x-aspnet-version: 4.0.30319`}</span>
              <span>{`request-context: appId=cid-v1:7585021b-2db7-4da6-abff-2cf23005f0a9`}</span>
              <span>{`x-powered-by: ASP.NET`}</span>
              <span>{`set-cookie: ARRAffinity=dd9ed9b645068a439255e4a6e0a4e0f2b5c11799187f1613a5766939d04a2bc0;Path=/;HttpOnly;Domain=httpstat.us`}</span>
              <span>{`CF-Cache-Status: DYNAMIC`}</span>
              <span>{`Report-To: {"endpoints":[{"url":"https:\\/\\/a.nel.cloudflare.com\\/report\\/v3?s=Df0k19O1x6RNB6Uc0hwC%2BFcQZS27%2BOuWb1JATwpu15Zhvdxc3Yd465533%2BuB2PIJKEBfRrCyHSgNLMiDje2EMkli18C83LScpe4czBPDKbUV77XLGuzwGdu9oGoCpQ%3D%3D"}],"group":"cf-nel","max_age":604800}`}</span>
              <span>{`NEL: {"success_fraction":0,"report_to":"cf-nel","max_age":604800}`}</span>
              <span>{`Server: cloudflare`}</span>
              <span>{`CF-RAY: 699f00a99def15af-EWR`}</span>
              <span>{`alt-svc: h3=":443"; ma=86400, h3-29=":443"; ma=86400, h3-28=":443"; ma=86400, h3-27=":443"; ma=86400`}</span>
              <span>{`[2021-10-06 18:18:12,040] TRACE {http.tracelog.upstream} - [id: 0xf7c32f4c, correlatedSource: 0x91dfb8c7, host:/192.168.1.21:50368 - remote:httpstat.us/172.67.134.121:80] INBOUND: DefaultHttpContent(data: PooledSlicedByteBuf(ridx: 0, widx: 6, cap: 6/6, unwrapped: PooledUnsafeDirectByteBuf(ridx: 1172, widx: 1177, cap: 2048)), decoderResult: success), 6B`}</span>
              <span>{`200 OK`}</span>
              <span>{`[2021-10-06 18:18:12,041] TRACE {http.tracelog.upstream} - [id: 0xf7c32f4c, correlatedSource: 0x91dfb8c7, host:/192.168.1.21:50368 - remote:httpstat.us/172.67.134.121:80] INBOUND: EmptyLastHttpContent, 0B`}</span>
              <span>{`[2021-10-06 18:18:12,043] TRACE {http.tracelog.upstream} - [id: 0xf7c32f4c, correlatedSource: 0x91dfb8c7, host:/192.168.1.21:50368 - remote:httpstat.us/172.67.134.121:80] READ COMPLETE`}</span>
              <span>{`[2021-10-06 18:18:12,046] TRACE {http.tracelog.downstream} - [id: 0x91dfb8c7, correlatedSource: n/a, host:localhost/0:0:0:0:0:0:0:1:9090 - remote:/0:0:0:0:0:0:0:1:50367] OUTBOUND: DefaultHttpResponse(decodeResult: success, version: HTTP/1.1)`}</span>
              <span>{`HTTP/1.1 200 OK`}</span>
              <span>{`Date: Wed, 06 Oct 2021 12:48:11 GMT`}</span>
              <span>{`Content-Type: text/plain; charset=utf-8`}</span>
              <span>{`Transfer-Encoding: chunked`}</span>
              <span>{`cache-control: private`}</span>
              <span>{`vary: Accept-Encoding`}</span>
              <span>{`x-aspnetmvc-version: 5.1`}</span>
              <span>{`access-control-allow-origin: *`}</span>
              <span>{`access-control-expose-headers: Link, Content-Range, Location, WWW-Authenticate, Proxy-Authenticate, Retry-After`}</span>
              <span>{`access-control-expose-headers: Request-Context`}</span>
              <span>{`x-aspnet-version: 4.0.30319`}</span>
              <span>{`request-context: appId=cid-v1:7585021b-2db7-4da6-abff-2cf23005f0a9`}</span>
              <span>{`x-powered-by: ASP.NET`}</span>
              <span>{`set-cookie: ARRAffinity=dd9ed9b645068a439255e4a6e0a4e0f2b5c11799187f1613a5766939d04a2bc0;Path=/;HttpOnly;Domain=httpstat.us`}</span>
              <span>{`CF-Cache-Status: DYNAMIC`}</span>
              <span>{`Report-To: {"endpoints":[{"url":"https:\\/\\/a.nel.cloudflare.com\\/report\\/v3?s=Df0k19O1x6RNB6Uc0hwC%2BFcQZS27%2BOuWb1JATwpu15Zhvdxc3Yd465533%2BuB2PIJKEBfRrCyHSgNLMiDje2EMkli18C83LScpe4czBPDKbUV77XLGuzwGdu9oGoCpQ%3D%3D"}],"group":"cf-nel","max_age":604800}`}</span>
              <span>{`NEL: {"success_fraction":0,"report_to":"cf-nel","max_age":604800}`}</span>
              <span>{`CF-RAY: 699f00a99def15af-EWR`}</span>
              <span>{`alt-svc: h3=":443"; ma=86400, h3-29=":443"; ma=86400, h3-28=":443"; ma=86400, h3-27=":443"; ma=86400`}</span>
              <span>{`server: cloudflare`}</span>
              <span>{`[2021-10-06 18:18:12,048] TRACE {http.tracelog.downstream} - [id: 0x91dfb8c7, correlatedSource: n/a, host:localhost/0:0:0:0:0:0:0:1:9090 - remote:/0:0:0:0:0:0:0:1:50367] OUTBOUND: DefaultHttpContent(data: PooledSlicedByteBuf(ridx: 0, widx: 6, cap: 6/6, unwrapped: PooledUnsafeDirectByteBuf(ridx: 1177, widx: 1177, cap: 2048)), decoderResult: success), 6B`}</span>
              <span>{`200 OK`}</span>
              <span>{`[2021-10-06 18:18:12,049] TRACE {http.tracelog.downstream} - [id: 0x91dfb8c7, correlatedSource: n/a, host:localhost/0:0:0:0:0:0:0:1:9090 - remote:/0:0:0:0:0:0:0:1:50367] FLUSH`}</span>
              <span>{`[2021-10-06 18:18:12,054] TRACE {http.tracelog.downstream} - [id: 0x91dfb8c7, correlatedSource: n/a, host:localhost/0:0:0:0:0:0:0:1:9090 - remote:/0:0:0:0:0:0:0:1:50367] OUTBOUND: DefaultLastHttpContent(data: UnpooledByteBufAllocator\$InstrumentedUnpooledUnsafeHeapByteBuf(ridx: 0, widx: 0, cap: 0), decoderResult: success), 0B`}</span>
              <span>{`[2021-10-06 18:18:12,055] TRACE {http.tracelog.downstream} - [id: 0x91dfb8c7, correlatedSource: n/a, host:localhost/0:0:0:0:0:0:0:1:9090 - remote:/0:0:0:0:0:0:0:1:50367] FLUSH`}</span>
              <span>{`[2021-10-06 18:18:12,057] TRACE {http.tracelog.downstream} - [id: 0x91dfb8c7, correlatedSource: n/a, host:localhost/0:0:0:0:0:0:0:1:9090 - remote:/0:0:0:0:0:0:0:1:50367] READ COMPLETE`}</span>
              <span>{`[2021-10-06 18:18:12,058] TRACE {http.tracelog.downstream} - [id: 0x91dfb8c7, correlatedSource: n/a, host:localhost/0:0:0:0:0:0:0:1:9090 - remote:/0:0:0:0:0:0:0:1:50367] INACTIVE`}</span>
              <span>{`[2021-10-06 18:18:12,061] TRACE {http.tracelog.downstream} - [id: 0x91dfb8c7, correlatedSource: n/a, host:localhost/0:0:0:0:0:0:0:1:9090 - remote:/0:0:0:0:0:0:0:1:50367] UNREGISTERED`}</span>
            </code>
          </pre>
        </Col>
        <Col sm={2} className="d-flex align-items-start">
          {outputClick2 ? (
            <button
              className="btn rounded ms-auto"
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
              className="btn rounded ms-auto"
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
      </Row>

      <br />

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link title="Compression" href="/learn/by-example/http-compression">
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
                  Compression
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link title="Access logs" href="/learn/by-example/http-access-logs">
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Access logs
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
