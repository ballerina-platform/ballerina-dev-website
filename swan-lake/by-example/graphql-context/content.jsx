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
  `import ballerina/graphql;
import ballerina/http;
import ballerina/lang.value;

@graphql:ServiceConfig {
    // Initialization of the \`graphqlContext\` should be provided to the
    // \`contextInit\` field.
    contextInit: isolated function (http:RequestContext requestContext,
                                    http:Request request)
                                    returns graphql:Context|error {

        // Initialize the \`graphql:Context\` object.
        graphql:Context context = new;

        // Retrieve the header named \`scope\` and set it to the context with the
        // \`scope\` key. If the header does not exist, this will return an
        // \`error\`, and thereby, the request will not be processed.
        context.set("scope", check request.getHeader("scope"));

        // Finally, the context object has to be returned.
        return context;

    }
}
service /graphql on new graphql:Listener(4000) {

    // Define a \`Person\` object when the service is initialized.
    private final Person person;

    function init() {
        // Initialize the \`person\` value.
        self.person = new("Walter White", 51, 737000.00);

    }

    // Resource functions can be defined without a context parameter.
    resource function get greet() returns string {
        return "Hello, world";
    }

    // If the context is needed, it should be defined as the first paramter of
    // the resolver function.
    resource function get profile(graphql:Context context)
    returns Person|error {

        // Retrieve the \`scope\` attribute from the context. This will return
        // a \`graphql:Error\` if the \`scope\` is not
        // found in the context.
        value:Cloneable|isolated object {} scope = check context.get("scope");

        // The profile information will be returned for the scope of either
        // \`admin\` or \`user\`.
        if scope is string {
            if scope == "admin" || scope == "user" {
                return self.person;
            }
        }

        // Return an \`error\` if the required scope is not found.
        return error("Permission denied");
    }
}

// Define a service class to use as an object in the GraphQL service.
public service class Person {

    private final string name;
    private final int age;
    private final float salary;

    function init(string name, int age, float salary) {
        self.name = name;
        self.age = age;
        self.salary = salary;
    }

    resource function get name() returns string {
        return self.name;
    }

    resource function get age() returns int {
        return self.age;
    }

    resource function get salary(graphql:Context context) returns float|error {

        // Retrieve the \`scope\` attribute from the context.
        value:Cloneable|isolated object {} scope = check context.get("scope");

        // The \`salary\` value will only be returned if the \`scope\` is \`admin\`.
        if scope is string {
            if scope == "admin" {
                return self.salary;
            }
        }

        // Return an \`error\` if the required scope is not found.
        return error("Permission denied");

    }
}
`,
];

export default function GraphqlContext() {
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
      <h1>Context</h1>

      <p>
        The <code>graphql:Context</code> object can be used to pass meta
        information between the resolver functions. An init function
      </p>

      <p>
        should be provided using the <code>graphql:ServiceConfig</code>{" "}
        parameter named <code>contextInit</code>. Inside the init function, the
      </p>

      <p>
        <code>graphql:Context</code> can be initialized. Values from the{" "}
        <code>http:RequestContext</code> and <code>http:Request</code> can be
        added as well as
      </p>

      <p>
        other values. These values are stored as key-value pairs. The key is a{" "}
        <code>string</code> and the value can be any <code>readonly</code>
      </p>

      <p>
        value or an <code>isolated</code> object. If the init function is not
        provided, an empty context object will be created.
      </p>

      <p>
        The context can be accessed by defining it as the first parameter of any
        resolver (resource/remote) function.
      </p>

      <p>&lt;br/&gt;&lt;br/&gt;</p>

      <p>For more information on the underlying package, see the</p>

      <p>
        <a href="https://docs.central.ballerina.io/ballerina/graphql/latest/">
          GraphQL package
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
                "https://github.com/ballerina-platform/ballerina-distribution/tree/v2201.1.1/examples/graphql-context",
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
              <span>
                {`# Send a query to the GraphQL endpoint using a cURL command. Set the `}
                <code>{`scope`}</code>
                {` header value to `}
                <code>{`admin`}</code>
                {`.`}
              </span>
              <span>{` # The query used: { profile { name salary } }`}</span>
              <span>{` curl -X POST -H "Content-type: application/json" -H "scope: admin" -d '{ "query": "{ profile { name salary } }" }' 'http://localhost:4000/graphql'`}</span>
              <span>{` {"data":{"profile":{"name":"Walter White", "salary":737000.0}}}`}</span>
              <span>{``}</span>
              <span>
                {` # Now, send a query with the `}
                <code>{`scope`}</code>
                {` header value set to `}
                <code>{`user`}</code>
                {`. This will return an error in the `}
                <code>{`salary`}</code>
                {` field.`}
              </span>
              <span>{` # The query used: { profile { name salary } }`}</span>
              <span>{` curl -X POST -H "Content-type: application/json" -H "scope: user" -d '{ "query": "{ profile { name salary } }" }' 'http://localhost:4000/graphql'`}</span>
              <span>{` {"errors":[{"message":"Permission denied", "locations":[{"line":1, "column":18}], "path":["profile", "salary"]}], "data":null}`}</span>
              <span>{``}</span>
              <span>
                {` # Now, send a query with the `}
                <code>{`scope`}</code>
                {` header value set to `}
                <code>{`unknown`}</code>
                {`. This will return an error in the `}
                <code>{`profile`}</code>
                {` field.`}
              </span>
              <span>{` # The query used: { profile { name salary } }`}</span>
              <span>{` curl -X POST -H "Content-type: application/json" -H "scope: unknown" -d '{ "query": "{ profile { name salary } }" }' 'http://localhost:4000/graphql'`}</span>
              <span>{` {"errors":[{"message":"Permission denied", "locations":[{"line":1, "column":3}], "path":["profile"]}], "data":null}`}</span>
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
              <span>{`bal run graphql_context.bal`}</span>
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
          <Link title="Mutations" href="/learn/by-example/graphql-mutations">
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
                  Mutations
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="File upload"
            href="/learn/by-example/graphql-file-upload"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  File upload
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
