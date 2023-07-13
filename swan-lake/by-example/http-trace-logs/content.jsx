import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `import ballerina/http;

type Album readonly & record {|
    string title;
    string artist;
|};

service /info on new http:Listener(9095) {

    resource function get albums(http:Request req) returns Album[]|error {
        http:Client albumEP = check new ("localhost:9090");
        Album[] albums = check albumEP->forward("/albums", req);
        return albums;
    }
}
`,
  `[ballerina.http.traceLogAdvancedConfig]
# Enable printing trace logs on the Console. The default value is \`false\`.
console = true
# Specify the file path to save the trace logs. This is optional.
path = "testTraceLog.txt"
# Specify the hostname and port of a socket service to publish the trace logs. These are optional.
host = "localhost"
port = 8080 
`,
];

export function HttpTraceLogs({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);
  const [codeClick2, updateCodeClick2] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();
  const [outputClick2, updateOutputClick2] = useState(false);
  const ref2 = createRef();

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>HTTP service - Trace logs</h1>

      <p>
        Ballerina allows enabling HTTP trace logs, which can be used to monitor
        the HTTP traffic that goes in and out of the application. HTTP trace
        logs are disabled by default. Set the log level to <code>TRACE</code>{" "}
        using the <code>-Cballerina.http.traceLogConsole=true</code> runtime
        argument to enable them.
      </p>

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
                "https://play.ballerina.io/?gist=87d1dc773436930c3abe7096f0ef7cb1&file=http_trace_logs.bal",
                "_blank",
              );
            }}
            target="_blank"
            aria-label="Open in Ballerina Playground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#000"
              className="bi bi-play-circle"
              viewBox="0 0 16 16"
            >
              <title>Open in Ballerina Playground</title>
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z" />
            </svg>
          </button>

          <button
            className="bg-transparent border-0 m-0 p-2"
            onClick={() => {
              window.open(
                "https://github.com/ballerina-platform/ballerina-distribution/tree/v2201.7.0/examples/http-trace-logs",
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

      <h2>Prerequisites</h2>

      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            Run the HTTP service given in the{" "}
            <a href="/learn/by-example/http-basic-rest-service/">
              Basic REST service
            </a>{" "}
            example.
          </span>
        </li>
      </ul>

      <p>
        Run the service as follows with the runtime argument to enable trace
        logs.
      </p>

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
              <span>{`\$ bal run http_trace_logs.bal -- -Cballerina.http.traceLogConsole=true`}</span>
              <span>{`ballerina: HTTP trace log enabled`}</span>
              <span>{`
`}</span>
              <span>{`# In the logs, \`http.downstream\` refers to the HTTP traffic that flows between the client and Ballerina.`}</span>
              <span>{`# while \`http.upstream\` refers to the HTTP traffic that flows between Ballerina and the backend.`}</span>
              <span>{`
`}</span>
              <span>{`[2022-12-15 11:18:03,126] TRACE {http.tracelog.downstream} - [id: 0x67ba903e] REGISTERED  `}</span>
              <span>{`[2022-12-15 11:18:03,157] TRACE {http.tracelog.downstream} - [id: 0x67ba903e, correlatedSource: n/a, host:/127.0.0.1:9095 - remote:/127.0.0.1:61634] ACTIVE  `}</span>
              <span>{`[2022-12-15 11:18:03,187] TRACE {http.tracelog.downstream} - [id: 0x67ba903e, correlatedSource: n/a, host:/127.0.0.1:9095 - remote:/127.0.0.1:61634] INBOUND: DefaultHttpRequest(decodeResult: success, version: HTTP/1.1)`}</span>
              <span>{`GET /info/albums HTTP/1.1`}</span>
              <span>{`Host: localhost:9095`}</span>
              <span>{`User-Agent: curl/7.79.1`}</span>
              <span>{`Accept: */*  `}</span>
              <span>{`[2022-12-15 11:18:03,253] TRACE {http.tracelog.downstream} - [id: 0x67ba903e, correlatedSource: n/a, host:/127.0.0.1:9095 - remote:/127.0.0.1:61634] INBOUND: EmptyLastHttpContent, 0B  `}</span>
              <span>{`[2022-12-15 11:18:03,255] TRACE {http.tracelog.downstream} - [id: 0x67ba903e, correlatedSource: n/a, host:/127.0.0.1:9095 - remote:/127.0.0.1:61634] READ COMPLETE  `}</span>
              <span>{`[2022-12-15 11:18:03,394] TRACE {http.tracelog.upstream} - [id: 0x40eb51fd] REGISTERED  `}</span>
              <span>{`[2022-12-15 11:18:03,394] TRACE {http.tracelog.upstream} - [id: 0x40eb51fd] CONNECT: localhost/127.0.0.1:9090, null  `}</span>
              <span>{`[2022-12-15 11:18:03,399] TRACE {http.tracelog.upstream} - [id: 0x40eb51fd, correlatedSource: 0x67ba903e, host:/127.0.0.1:61635 - remote:localhost/127.0.0.1:9090] ACTIVE  `}</span>
              <span>{`[2022-12-15 11:18:03,402] TRACE {http.tracelog.upstream} - [id: 0x40eb51fd, correlatedSource: 0x67ba903e, host:/127.0.0.1:61635 - remote:localhost/127.0.0.1:9090] OUTBOUND: DefaultHttpRequest(decodeResult: success, version: HTTP/1.1)`}</span>
              <span>{`GET /albums HTTP/1.1`}</span>
              <span>{`User-Agent: curl/7.79.1`}</span>
              <span>{`Accept: */*`}</span>
              <span>{`host: localhost:9090`}</span>
              <span>{`connection: keep-alive`}</span>
              <span>{`upgrade: h2c`}</span>
              <span>{`HTTP2-Settings: AAEAABAAAAIAAAABAAN_____AAQAAP__AAUAAEAAAAYAACAA`}</span>
              <span>{`connection: HTTP2-Settings,upgrade  `}</span>
              <span>{`[2022-12-15 11:18:03,408] TRACE {http.tracelog.upstream} - [id: 0x40eb51fd, correlatedSource: 0x67ba903e, host:/127.0.0.1:61635 - remote:localhost/127.0.0.1:9090] OUTBOUND: EmptyLastHttpContent, 0B  `}</span>
              <span>{`[2022-12-15 11:18:03,408] TRACE {http.tracelog.upstream} - [id: 0x40eb51fd, correlatedSource: 0x67ba903e, host:/127.0.0.1:61635 - remote:localhost/127.0.0.1:9090] FLUSH  `}</span>
              <span>{`[2022-12-15 11:18:03,414] TRACE {http.tracelog.upstream} - [id: 0x40eb51fd, correlatedSource: 0x67ba903e, host:/127.0.0.1:61635 - remote:localhost/127.0.0.1:9090] INBOUND: DefaultHttpResponse(decodeResult: success, version: HTTP/1.1)`}</span>
              <span>{`HTTP/1.1 101 Switching Protocols`}</span>
              <span>{`connection: upgrade`}</span>
              <span>{`upgrade: h2c  `}</span>
              <span>{`[2022-12-15 11:18:03,417] TRACE {http.tracelog.upstream} - [id: 0x40eb51fd, correlatedSource: 0x67ba903e, host:/127.0.0.1:61635 - remote:localhost/127.0.0.1:9090] INBOUND: EmptyLastHttpContent, 0B  `}</span>
              <span>{`[2022-12-15 11:18:03,419] TRACE {http.tracelog.upstream} - [id: 0x40eb51fd, correlatedSource: 0x67ba903e, host:/127.0.0.1:61635 - remote:localhost/127.0.0.1:9090] OUTBOUND: 24B`}</span>
              <span>{`PRI * HTTP/2.0`}</span>
              <span>{`
`}</span>
              <span>{`SM`}</span>
              <span>{`
`}</span>
              <span>{`  `}</span>
              <span>{`[2022-12-15 11:18:03,421] TRACE {http.tracelog.upstream} - [id: 0x40eb51fd, L:/127.0.0.1:61635 - R:localhost/127.0.0.1:9090] OUTBOUND SETTINGS: ack=false settings={MAX_HEADER_LIST_SIZE=8192}  `}</span>
              <span>{`[2022-12-15 11:18:03,422] TRACE {http.tracelog.upstream} - [id: 0x40eb51fd, correlatedSource: 0x67ba903e, host:/127.0.0.1:61635 - remote:localhost/127.0.0.1:9090] OUTBOUND: 15B`}</span>
              <span>{`   `}</span>
              <span>{`[2022-12-15 11:18:03,430] TRACE {http.tracelog.upstream} - [id: 0x40eb51fd, L:/127.0.0.1:61635 - R:localhost/127.0.0.1:9090] INBOUND SETTINGS: ack=false settings={MAX_HEADER_LIST_SIZE=8192}  `}</span>
              <span>{`[2022-12-15 11:18:03,431] TRACE {http.tracelog.upstream} - [id: 0x40eb51fd, L:/127.0.0.1:61635 - R:localhost/127.0.0.1:9090] OUTBOUND SETTINGS: ack=true  `}</span>
              <span>{`[2022-12-15 11:18:03,437] TRACE {http.tracelog.upstream} - [id: 0x40eb51fd, L:/127.0.0.1:61635 - R:localhost/127.0.0.1:9090] INBOUND HEADERS: streamId=1 headers=DefaultHttp2Headers[:status: 200, content-type: application/json, server: ballerina, date: Thu, 15 Dec 2022 11:18:03 +0530] padding=0 endStream=false  `}</span>
              <span>{`[2022-12-15 11:18:03,450] TRACE {http.tracelog.upstream} - [id: 0x40eb51fd, L:/127.0.0.1:61635 - R:localhost/127.0.0.1:9090] INBOUND DATA: streamId=1 padding=0 endStream=true length=95 data=95B`}</span>
              <span>{`[{"title":"Blue Train", "artist":"John Coltrane"}, {"title":"Jeru", "artist":"Gerry Mulligan"}]  `}</span>
              <span>{`[2022-12-15 11:18:03,452] TRACE {http.tracelog.upstream} - [id: 0x40eb51fd, L:/127.0.0.1:61635 - R:localhost/127.0.0.1:9090] INBOUND SETTINGS: ack=true  `}</span>
              <span>{`[2022-12-15 11:18:03,516] TRACE {http.tracelog.downstream} - [id: 0x67ba903e, correlatedSource: n/a, host:/127.0.0.1:9095 - remote:/127.0.0.1:61634] OUTBOUND: DefaultFullHttpResponse(decodeResult: success, version: HTTP/1.1, content: CompositeByteBuf(ridx: 0, widx: 95, cap: 95, components=1))`}</span>
              <span>{`HTTP/1.1 200 OK`}</span>
              <span>{`content-type: application/json`}</span>
              <span>{`content-length: 95`}</span>
              <span>{`server: ballerina`}</span>
              <span>{`date: Thu, 15 Dec 2022 11:18:03 +0530, 95B`}</span>
              <span>{`[{"title":"Blue Train", "artist":"John Coltrane"}, {"title":"Jeru", "artist":"Gerry Mulligan"}]  `}</span>
              <span>{`[2022-12-15 11:18:03,517] TRACE {http.tracelog.downstream} - [id: 0x67ba903e, correlatedSource: n/a, host:/127.0.0.1:9095 - remote:/127.0.0.1:61634] FLUSH  `}</span>
              <span>{`[2022-12-15 11:18:03,519] TRACE {http.tracelog.downstream} - [id: 0x67ba903e, correlatedSource: n/a, host:/127.0.0.1:9095 - remote:/127.0.0.1:61634] READ COMPLETE  `}</span>
              <span>{`[2022-12-15 11:18:03,521] TRACE {http.tracelog.downstream} - [id: 0x67ba903e, correlatedSource: n/a, host:/127.0.0.1:9095 - remote:/127.0.0.1:61634] INACTIVE  `}</span>
              <span>{`[2022-12-15 11:18:03,523] TRACE {http.tracelog.downstream} - [id: 0x67ba903e, correlatedSource: n/a, host:/127.0.0.1:9095 - remote:/127.0.0.1:61634] UNREGISTERED`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <p>
        Invoke the service by executing the following cURL command in a new
        terminal.
      </p>

      <Row
        className="bbeOutput mx-0 py-0 rounded "
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
                <title>Copy to Clipboard</title>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
              </svg>
            </button>
          )}
        </Col>
        <Col sm={12}>
          <pre ref={ref2}>
            <code className="d-flex flex-column">
              <span>{`\$ curl http://localhost:9095/info/albums`}</span>
              <span>{`[{"title":"Blue Train", "artist":"John Coltrane"}, {"title":"Jeru", "artist":"Gerry Mulligan"}]`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <p>
        Additionally, the following configurations can be added to the{" "}
        <code>Config.toml</code> file for advanced use cases such as specifying
        the file path to save the trace logs to a file and the hostname and port
        of a socket service to publish the trace logs.
      </p>

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
                "https://play.ballerina.io/?gist=76ae5f1a5e05444c263d07055f9d8d55&file=Config.toml",
                "_blank",
              );
            }}
            target="_blank"
            aria-label="Open in Ballerina Playground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#000"
              className="bi bi-play-circle"
              viewBox="0 0 16 16"
            >
              <title>Open in Ballerina Playground</title>
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z" />
            </svg>
          </button>

          <button
            className="bg-transparent border-0 m-0 p-2"
            onClick={() => {
              window.open(
                "https://github.com/ballerina-platform/ballerina-distribution/tree/v2201.7.0/examples/http-trace-logs",
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
          {codeClick2 ? (
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
                updateCodeClick2(true);
                copyToClipboard(codeSnippetData[1]);
                setTimeout(() => {
                  updateCodeClick2(false);
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
          {codeSnippets[1] != undefined && (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(codeSnippets[1]),
              }}
            />
          )}
        </Col>
      </Row>

      <h2>Related links</h2>

      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://lib.ballerina.io/ballerina/http/latest#TraceLogAdvancedConfiguration">
              <code>http:TraceLogAdvancedConfiguration</code> record
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/spec/http/#823-trace-log">
              HTTP service trace log - Specification
            </a>
          </span>
        </li>
      </ul>
      <span style={{ marginBottom: "20px" }}></span>

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
