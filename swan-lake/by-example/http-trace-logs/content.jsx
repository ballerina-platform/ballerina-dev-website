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
                "vscode://wso2.ballerina/open-file?repoFileUrl=https://github.com/ballerina-platform/ballerina-distribution/tree/v2201.8.3/examples/http-trace-logs/http_trace_logs.md",
                "_blank",
              );
            }}
            target="_blank"
            aria-label="Open in Ballerina Playground"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Open in Ballerina Visual Studio Code</title>
              <mask
                id="mask0"
                mask-type="alpha"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="100"
                height="100"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M70.9119 99.3171C72.4869 99.9307 74.2828 99.8914 75.8725 99.1264L96.4608 89.2197C98.6242 88.1787 100 85.9892 100 83.5872V16.4133C100 14.0113 98.6243 11.8218 96.4609 10.7808L75.8725 0.873756C73.7862 -0.130129 71.3446 0.11576 69.5135 1.44695C69.252 1.63711 69.0028 1.84943 68.769 2.08341L29.3551 38.0415L12.1872 25.0096C10.589 23.7965 8.35363 23.8959 6.86933 25.2461L1.36303 30.2549C-0.452552 31.9064 -0.454633 34.7627 1.35853 36.417L16.2471 50.0001L1.35853 63.5832C-0.454633 65.2374 -0.452552 68.0938 1.36303 69.7453L6.86933 74.7541C8.35363 76.1043 10.589 76.2037 12.1872 74.9905L29.3551 61.9587L68.769 97.9167C69.3925 98.5406 70.1246 99.0104 70.9119 99.3171ZM75.0152 27.2989L45.1091 50.0001L75.0152 72.7012V27.2989Z"
                  fill="white"
                ></path>
              </mask>
              <g mask="url(#mask0)">
                <path
                  d="M96.4614 10.7962L75.8569 0.875542C73.4719 -0.272773 70.6217 0.211611 68.75 2.08333L1.29858 63.5832C-0.515693 65.2373 -0.513607 68.0937 1.30308 69.7452L6.81272 74.754C8.29793 76.1042 10.5347 76.2036 12.1338 74.9905L93.3609 13.3699C96.086 11.3026 100 13.2462 100 16.6667V16.4275C100 14.0265 98.6246 11.8378 96.4614 10.7962Z"
                  fill="#0065A9"
                ></path>
                <g filter="url(#filter0_d)">
                  <path
                    d="M96.4614 89.2038L75.8569 99.1245C73.4719 100.273 70.6217 99.7884 68.75 97.9167L1.29858 36.4169C-0.515693 34.7627 -0.513607 31.9063 1.30308 30.2548L6.81272 25.246C8.29793 23.8958 10.5347 23.7964 12.1338 25.0095L93.3609 86.6301C96.086 88.6974 100 86.7538 100 83.3334V83.5726C100 85.9735 98.6246 88.1622 96.4614 89.2038Z"
                    fill="#007ACC"
                  ></path>
                </g>
                <g filter="url(#filter1_d)">
                  <path
                    d="M75.8578 99.1263C73.4721 100.274 70.6219 99.7885 68.75 97.9166C71.0564 100.223 75 98.5895 75 95.3278V4.67213C75 1.41039 71.0564 -0.223106 68.75 2.08329C70.6219 0.211402 73.4721 -0.273666 75.8578 0.873633L96.4587 10.7807C98.6234 11.8217 100 14.0112 100 16.4132V83.5871C100 85.9891 98.6234 88.1786 96.4586 89.2196L75.8578 99.1263Z"
                    fill="#1F9CF0"
                  ></path>
                </g>
                <g style="mix-blend-mode:overlay" opacity="0.25">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M70.8511 99.3171C72.4261 99.9306 74.2221 99.8913 75.8117 99.1264L96.4 89.2197C98.5634 88.1787 99.9392 85.9892 99.9392 83.5871V16.4133C99.9392 14.0112 98.5635 11.8217 96.4001 10.7807L75.8117 0.873695C73.7255 -0.13019 71.2838 0.115699 69.4527 1.44688C69.1912 1.63705 68.942 1.84937 68.7082 2.08335L29.2943 38.0414L12.1264 25.0096C10.5283 23.7964 8.29285 23.8959 6.80855 25.246L1.30225 30.2548C-0.513334 31.9064 -0.515415 34.7627 1.29775 36.4169L16.1863 50L1.29775 63.5832C-0.515415 65.2374 -0.513334 68.0937 1.30225 69.7452L6.80855 74.754C8.29285 76.1042 10.5283 76.2036 12.1264 74.9905L29.2943 61.9586L68.7082 97.9167C69.3317 98.5405 70.0638 99.0104 70.8511 99.3171ZM74.9544 27.2989L45.0483 50L74.9544 72.7012V27.2989Z"
                    fill="url(#paint0_linear)"
                  ></path>
                </g>
              </g>
              <defs>
                <filter
                  id="filter0_d"
                  x="-8.39411"
                  y="15.8291"
                  width="116.727"
                  height="92.2456"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood
                    flood-opacity="0"
                    result="BackgroundImageFix"
                  ></feFlood>
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  ></feColorMatrix>
                  <feOffset></feOffset>
                  <feGaussianBlur stdDeviation="4.16667"></feGaussianBlur>
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                  ></feColorMatrix>
                  <feBlend
                    mode="overlay"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow"
                  ></feBlend>
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow"
                    result="shape"
                  ></feBlend>
                </filter>
                <filter
                  id="filter1_d"
                  x="60.4167"
                  y="-8.07558"
                  width="47.9167"
                  height="116.151"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood
                    flood-opacity="0"
                    result="BackgroundImageFix"
                  ></feFlood>
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  ></feColorMatrix>
                  <feOffset></feOffset>
                  <feGaussianBlur stdDeviation="4.16667"></feGaussianBlur>
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                  ></feColorMatrix>
                  <feBlend
                    mode="overlay"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow"
                  ></feBlend>
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow"
                    result="shape"
                  ></feBlend>
                </filter>
                <linearGradient
                  id="paint0_linear"
                  x1="49.9392"
                  y1="0.257812"
                  x2="49.9392"
                  y2="99.7423"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="white"></stop>
                  <stop offset="1" stop-color="white" stop-opacity="0"></stop>
                </linearGradient>
              </defs>
            </svg>
          </button>

          <button
            className="bg-transparent border-0 m-0 p-2"
            onClick={() => {
              window.open(
                "https://github.com/ballerina-platform/ballerina-distribution/tree/v2201.8.3/examples/http-trace-logs",
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
                "vscode://wso2.ballerina/open-file?repoFileUrl=https://github.com/ballerina-platform/ballerina-distribution/tree/v2201.8.3/examples/http-trace-logs/http_trace_logs.md",
                "_blank",
              );
            }}
            target="_blank"
            aria-label="Open in Ballerina Playground"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Open in Ballerina Visual Studio Code</title>
              <mask
                id="mask0"
                mask-type="alpha"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="100"
                height="100"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M70.9119 99.3171C72.4869 99.9307 74.2828 99.8914 75.8725 99.1264L96.4608 89.2197C98.6242 88.1787 100 85.9892 100 83.5872V16.4133C100 14.0113 98.6243 11.8218 96.4609 10.7808L75.8725 0.873756C73.7862 -0.130129 71.3446 0.11576 69.5135 1.44695C69.252 1.63711 69.0028 1.84943 68.769 2.08341L29.3551 38.0415L12.1872 25.0096C10.589 23.7965 8.35363 23.8959 6.86933 25.2461L1.36303 30.2549C-0.452552 31.9064 -0.454633 34.7627 1.35853 36.417L16.2471 50.0001L1.35853 63.5832C-0.454633 65.2374 -0.452552 68.0938 1.36303 69.7453L6.86933 74.7541C8.35363 76.1043 10.589 76.2037 12.1872 74.9905L29.3551 61.9587L68.769 97.9167C69.3925 98.5406 70.1246 99.0104 70.9119 99.3171ZM75.0152 27.2989L45.1091 50.0001L75.0152 72.7012V27.2989Z"
                  fill="white"
                ></path>
              </mask>
              <g mask="url(#mask0)">
                <path
                  d="M96.4614 10.7962L75.8569 0.875542C73.4719 -0.272773 70.6217 0.211611 68.75 2.08333L1.29858 63.5832C-0.515693 65.2373 -0.513607 68.0937 1.30308 69.7452L6.81272 74.754C8.29793 76.1042 10.5347 76.2036 12.1338 74.9905L93.3609 13.3699C96.086 11.3026 100 13.2462 100 16.6667V16.4275C100 14.0265 98.6246 11.8378 96.4614 10.7962Z"
                  fill="#0065A9"
                ></path>
                <g filter="url(#filter0_d)">
                  <path
                    d="M96.4614 89.2038L75.8569 99.1245C73.4719 100.273 70.6217 99.7884 68.75 97.9167L1.29858 36.4169C-0.515693 34.7627 -0.513607 31.9063 1.30308 30.2548L6.81272 25.246C8.29793 23.8958 10.5347 23.7964 12.1338 25.0095L93.3609 86.6301C96.086 88.6974 100 86.7538 100 83.3334V83.5726C100 85.9735 98.6246 88.1622 96.4614 89.2038Z"
                    fill="#007ACC"
                  ></path>
                </g>
                <g filter="url(#filter1_d)">
                  <path
                    d="M75.8578 99.1263C73.4721 100.274 70.6219 99.7885 68.75 97.9166C71.0564 100.223 75 98.5895 75 95.3278V4.67213C75 1.41039 71.0564 -0.223106 68.75 2.08329C70.6219 0.211402 73.4721 -0.273666 75.8578 0.873633L96.4587 10.7807C98.6234 11.8217 100 14.0112 100 16.4132V83.5871C100 85.9891 98.6234 88.1786 96.4586 89.2196L75.8578 99.1263Z"
                    fill="#1F9CF0"
                  ></path>
                </g>
                <g style="mix-blend-mode:overlay" opacity="0.25">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M70.8511 99.3171C72.4261 99.9306 74.2221 99.8913 75.8117 99.1264L96.4 89.2197C98.5634 88.1787 99.9392 85.9892 99.9392 83.5871V16.4133C99.9392 14.0112 98.5635 11.8217 96.4001 10.7807L75.8117 0.873695C73.7255 -0.13019 71.2838 0.115699 69.4527 1.44688C69.1912 1.63705 68.942 1.84937 68.7082 2.08335L29.2943 38.0414L12.1264 25.0096C10.5283 23.7964 8.29285 23.8959 6.80855 25.246L1.30225 30.2548C-0.513334 31.9064 -0.515415 34.7627 1.29775 36.4169L16.1863 50L1.29775 63.5832C-0.515415 65.2374 -0.513334 68.0937 1.30225 69.7452L6.80855 74.754C8.29285 76.1042 10.5283 76.2036 12.1264 74.9905L29.2943 61.9586L68.7082 97.9167C69.3317 98.5405 70.0638 99.0104 70.8511 99.3171ZM74.9544 27.2989L45.0483 50L74.9544 72.7012V27.2989Z"
                    fill="url(#paint0_linear)"
                  ></path>
                </g>
              </g>
              <defs>
                <filter
                  id="filter0_d"
                  x="-8.39411"
                  y="15.8291"
                  width="116.727"
                  height="92.2456"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood
                    flood-opacity="0"
                    result="BackgroundImageFix"
                  ></feFlood>
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  ></feColorMatrix>
                  <feOffset></feOffset>
                  <feGaussianBlur stdDeviation="4.16667"></feGaussianBlur>
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                  ></feColorMatrix>
                  <feBlend
                    mode="overlay"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow"
                  ></feBlend>
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow"
                    result="shape"
                  ></feBlend>
                </filter>
                <filter
                  id="filter1_d"
                  x="60.4167"
                  y="-8.07558"
                  width="47.9167"
                  height="116.151"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood
                    flood-opacity="0"
                    result="BackgroundImageFix"
                  ></feFlood>
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  ></feColorMatrix>
                  <feOffset></feOffset>
                  <feGaussianBlur stdDeviation="4.16667"></feGaussianBlur>
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                  ></feColorMatrix>
                  <feBlend
                    mode="overlay"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow"
                  ></feBlend>
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow"
                    result="shape"
                  ></feBlend>
                </filter>
                <linearGradient
                  id="paint0_linear"
                  x1="49.9392"
                  y1="0.257812"
                  x2="49.9392"
                  y2="99.7423"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="white"></stop>
                  <stop offset="1" stop-color="white" stop-opacity="0"></stop>
                </linearGradient>
              </defs>
            </svg>
          </button>

          <button
            className="bg-transparent border-0 m-0 p-2"
            onClick={() => {
              window.open(
                "https://github.com/ballerina-platform/ballerina-distribution/tree/v2201.8.3/examples/http-trace-logs",
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
