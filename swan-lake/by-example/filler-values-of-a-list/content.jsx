import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `import ballerina/io;
 
public function main() {
    // Since the filler value for int is \`0\`,
    // the \`severity\` array will be initialized as [0, 0, 0].
    int[3] severity = [];
    io:println(severity);
 
    // Since the filler value for \`boolean\` is \`false\` and the rest type can contain no members,
    // the \`scores\` will be initialized as \`[false]\`.
    [boolean, int...] scores = [];
    io:println(scores);
 
    // As the filler value for string is \`""\`,
    // the \`names\` array will be initialized as ["John", "Mike", ""].
    string[3] names = ["John", "Mike"];
    io:println(names);
 
    // As the filler value for the list is an empty list,
    // the \`orderItems\` tuple will be initialized as \`[["carrot", "apple"], ["avacado", "egg"], ["", ""]]\`\`.
    string[3][2] orderItems = [["carrot", "apple"], ["avocado", "egg"]];
    io:println(orderItems);
}
`,
];

export function FillerValuesOfAList({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>Filler values of a list</h1>

      <p>
        Lists can be initialized with the help of filler values. These are the
        default values that a list member will be initialized with if you do not
        provide a value in the list constructor. This gives you the flexibility
        to assign the actual values later for lists.
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
                "https://play.ballerina.io/?gist=cc7795f927f0a5bacfb03e4794f77d26&file=filler_values_of_a_list.bal",
                "_blank"
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
              <span>{`\$ bal run filler_values_of_a_list.bal`}</span>
              <span>{`[0,0,0]`}</span>
              <span>{`[false]`}</span>
              <span>{`["John","Mike",""]`}</span>
              <span>{`[["carrot","apple"],["avocado","egg"],["",""]]`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <h2>Filler values table</h2>

      <p>Type descriptor | Filler value | When available</p>

      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>&#8226;&nbsp;</span>
          <span>-------------- | ------------ | ---------------</span>
        </li>
      </ul>
      <p>
        <code>()</code> | <code>()</code> |
      </p>

      <p>
        <code>boolean</code> | <code>false</code> |
      </p>

      <p>
        <code>int</code> | <code>0</code> |
      </p>

      <p>
        <code>float</code> | <code>+0.0f</code> |
      </p>

      <p>
        <code>decimal</code> | <code>+0d</code> |
      </p>

      <p>
        <code>string</code> | <code>&quot;&quot;</code> |
      </p>

      <p>
        array or tuple type descriptor | <code>[]</code> | if that is a valid
        constructor for the type
      </p>

      <p>
        map or record type descriptor | <code>&#123;&#125;</code> | if that is a
        valid constructor for the type
      </p>

      <p>
        <code>readonly &amp; T</code> | the filler value for <code>T</code>{" "}
        constructed as read-only | if that belongs to the type
      </p>

      <p>
        <code>table</code> | empty table (with no rows) |
      </p>

      <p>
        <code>object</code> | <code>new T()</code> | if <code>T</code> is a
        class, where <code>T</code> is the type descriptor for the object, and
        the static type of <code>T</code>'s init method allows no arguments and
        does not include error
      </p>

      <p>
        <code>stream</code> | empty stream |
      </p>

      <p>
        <code>xml</code> | <code>xml``</code> |
      </p>

      <p>
        built-in subtype of xml | <code>xml``</code> | if this belongs to the
        subtype, i.e. if the subtype is <code>xml:Text</code>
      </p>

      <p>singleton | the single value used to specify the type |</p>

      <p>
        union | <code>()</code> | if <code>()</code> is a member of the union |
      </p>

      <p>
        union | the filler value for basic type <code>B</code> | if all members
        of the union belong to a single basic type <code>B</code>, and the
        filler value for <code>B</code> also belongs to the union
      </p>

      <p>
        <code>T?</code> | <code>()</code> |
      </p>

      <p>
        <code>any</code> | <code>()</code> |
      </p>

      <p>
        <code>anydata</code> | <code>()</code> |
      </p>

      <p>
        <code>byte</code> | <code>0</code> |
      </p>

      <p>
        built-in subtype of int | <code>0</code> |
      </p>

      <p>
        <code>json</code> | <code>()</code> |
      </p>

      <h2>Related links</h2>

      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/tuples">Tuples</a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/arrays">Arrays</a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/nested-arrays">Nested arrays</a>
          </span>
        </li>
      </ul>
      <span style={{ marginBottom: "20px" }}></span>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="Rest type in tuples"
            href="/learn/by-example/rest-type-in-tuples"
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
                  Rest type in tuples
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link title="List subtyping" href="/learn/by-example/list-subtyping">
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  List subtyping
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
