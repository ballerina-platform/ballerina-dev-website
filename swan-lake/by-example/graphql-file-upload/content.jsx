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
  `import ballerina/graphql;
import ballerina/io;

service /fileUpload on new graphql:Listener(4000) {

    // Store the file information that need to be shared between the remote and
    // resource functions.
    string[] uploadedFiles = [];

    // Remote functions can use the \`graphql:Upload\` type as an input
    // parameter type.
    remote function singleFileUpload(graphql:Upload file)
        returns string|error {

        // Access the file name from the \`graphql:Upload\` type parameter.
        // Similarly, it can access the mime type as \`file.mimeType\`
        // and encoding as \`file.encoding\`. Except the \`byteStream\` field, all
        // other fields in the \`graphql:Upload\` are \`string\` values.
        string fileName = file.fileName;
        string path = string\`./uploads/\${fileName}\`;

        // Access the byte stream of the file from the \`graphql:Upload\` type
        // parameter. The type of the \`byteStream\` field is
        // \`stream<byte[], io:Error?>\`
        stream<byte[], io:Error?> byteStream = file.byteStream;

        // Store the received file using the ballerina \`io\` package. If any
        // \`error\` occurred during the file write, it can be returned as the
        // resolver function output.
        check io:fileWriteBlocksFromStream(path, byteStream);

        // Returns the message if the uploading process is successful.
        return "Successfully Uploaded";
    }

    // Remote functions in GraphQL services can use the \`graphql:Upload[]\` as
    // an input parameter type. Therefore, remote functions can accept an array
    // of \`graphql:Upload\` values. This can be used to store multiple files via
    // a single request.
    remote function multipleFileUpload(graphql:Upload[] files)
        returns string[]|error {

        // Iterates the \`graphql:Upload\` type array to store the files.
        foreach int i in 0..< files.length() {
            graphql:Upload file = files[i];
            stream<byte[], io:Error?> byteStream = file.byteStream;
            string fileName = file.fileName;
            string path = string\`./uploads/\${fileName}\`;
            check io:fileWriteBlocksFromStream(path, byteStream);
            self.uploadedFiles.push(file.fileName);
        }
        return self.uploadedFiles;
    }

    resource function get getUploadedFileNames() returns string[] {
        return self.uploadedFiles;
    }
}
`,
];

export default function GraphqlFileUpload() {
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
      <h1>File upload</h1>

      <p>
        GraphQL package provides a way to upload files through the GraphQL
        endpoints with GraphQL mutations. To define
      </p>

      <p>
        an endpoint with the file upload capability, the{" "}
        <code>graphql:Upload</code> type can be used as the input parameter of
      </p>

      <p>
        resolver functions. The <code>graphql:Upload</code> type can represent
        the details of the file that needs to be uploaded and
      </p>

      <p>
        that can be used only with the remote functions. The value of{" "}
        <code>graphql:Upload</code> type is extracted from the HTTP
      </p>

      <p>
        multipart request, which will be received by the GraphQL endpoints. This
        example shows how to implement a GraphQL endpoint that
      </p>

      <p>can be used to upload files.</p>

      <p>&lt;br/&gt;&lt;br/&gt;</p>

      <p>For more information on the underlying package, see the</p>

      <p>
        <a href="https://docs.central.ballerina.io/ballerina/graphql/latest/">
          GraphQL package
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
                "https://github.com/ballerina-platform/ballerina-distribution/tree/v2201.0.3/graphql-file-upload",
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
            <span>{`# Send a HTTP multipart request to upload a single file via the GraphQL endpoint using a cURL command.`}</span>
            <span>
              {`# The first part of the request is `}
              <code>{`operations`}</code>
              {` that includes a `}
              <code>{`JSON-encoded`}</code>
              {` map value.`}
            </span>
            <span>
              {`# The `}
              <code>{`operations`}</code>
              {` map value is similar to a standard GraphQL POST request, in which all the variable values related to the file upload are `}
              <code>{`null`}</code>
              {`.`}
            </span>
            <span>
              {`# `}
              <code>{`operations`}</code>
              {`: { "query": "mutation(\$file: Upload!) { singleFileUpload(file: \$file) }", "variables": {"file": null} }`}
            </span>
            <span>{``}</span>
            <span>
              {`# The second part of the request is a `}
              <code>{`map`}</code>
              {` field that includes a `}
              <code>{`JSON-encoded`}</code>
              {` map of files that occurred in the operations.`}
            </span>
            <span>
              {`# The `}
              <code>{`key`}</code>
              {` is file field name and the `}
              <code>{`value`}</code>
              {` is an array of paths in which the files occurred in the `}
              <code>{`operations`}</code>
              {`.`}
            </span>
            <span>
              {`# `}
              <code>{`map`}</code>
              {`: { “0”: ["variables.file"] }`}
            </span>
            <span>{``}</span>
            <span>{`# A file can be added to the next part of the request with a unique, arbitrary field name.`}</span>
            <span>{`# 0=@file1.png`}</span>
            <span>{``}</span>
            <span>{` curl localhost:4000/fileUpload \\`}</span>
            <span>{`  -F operations='{ "query": "mutation(\$file: Upload!) { singleFileUpload(file: \$file) }", "variables": { "file": null } }' \\`}</span>
            <span>{`  -F map='{ "0": ["variables.file"] }' \\`}</span>
            <span>{`  -F 0=@file1.png`}</span>
            <span>{` {"data":{"singleFileUpload":"Successfully Uploaded"}}`}</span>
            <span>{``}</span>
            <span>{`# Now, send a request with multiple files.`}</span>
            <span>
              {`# The variable value related to the files is an array of `}
              <code>{`null`}</code>
              {` values.`}
            </span>
            <span>
              {`# `}
              <code>{`operations`}</code>
              {`: { "query": "mutation(\$file: [Upload!]!) { multipleFileUpload(files: \$file) }", "variables": { "file": [null, null] } }`}
            </span>
            <span>{``}</span>
            <span>
              {`# Same as the single file upload, the `}
              <code>{`map`}</code>
              {` value is a JSON-encoded map of paths in which files occurred in the `}
              <code>{`operations`}</code>
              {`.`}
            </span>
            <span>
              {`# Since the `}
              <code>{`operations`}</code>
              {` has an array of `}
              <code>{`null`}</code>
              {` values, an array index is included in the path value.`}
            </span>
            <span>
              {`#  E.g., In `}
              <code>{`file.0`}</code>
              {`, `}
              <code>{`0`}</code>
              {` is the array index.`}
            </span>
            <span>
              {`# `}
              <code>{`map`}</code>
              {`: { "0": ["variables.file.0"], "1": ["variables.file.1"]}`}
            </span>
            <span>{``}</span>
            <span>{`# Files can be added to the next fields of the request with a unique, arbitrary field name.`}</span>
            <span>{`# 0=@file1.png`}</span>
            <span>{`# 1=@file2.png`}</span>
            <span>{``}</span>
            <span>{` curl localhost:4000/fileUpload \\`}</span>
            <span>{`  -F operations='{ "query": "mutation(\$file: [Upload!]!) { multipleFileUpload(files: \$file) }", "variables": { "file": [null, null] } }' \\`}</span>
            <span>{`  -F map='{ "0": ["variables.file.0"], "1": ["variables.file.1"]}' \\`}</span>
            <span>{`  -F 0=@file1.png \\`}</span>
            <span>{`  -F 1=@file2.png`}</span>
            <span>{`  {"data":{"multipleFileUpload":["file1.png", "file2.png"]}}`}</span>
          </code>
        </pre>
      </Row>

      <br />

      <Row className="bbeOutput p-2 rounded">
        <pre className="m-0">
          <code className="d-flex flex-column">
            <span>{`bal run graphql_file_upload.bal`}</span>
          </code>
        </pre>
      </Row>

      <br />

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link title="Context" href="/learn/by-example/graphql-context">
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
                  Context
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="Documentation"
            href="/learn/by-example/graphql-documentation"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Documentation
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
