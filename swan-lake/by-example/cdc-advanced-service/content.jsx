import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `import ballerina/log;
import ballerinax/cdc;
import ballerinax/mysql;
import ballerinax/mysql.cdc.driver as _;

listener mysql:CdcListener mysqlListener = new (
    database = {
        username: "root",
        password: "Test@123",
        includedDatabases: "store_db"
    }
);

type Entity record {
    int id;
};

type ProductReviews record {
    int product_id;
    int rating;
};

@cdc:ServiceConfig {
    tables: ["store_db.products", "store_db.vendors"]
}
service on mysqlListener {

    remote function onRead(Entity after, string tableName) returns cdc:Error? {
        log:printInfo(\`'\${tableName}' cache entry created for Id: \${after.id}\`);
    }

    remote function onCreate(Entity after, string tableName) returns cdc:Error? {
        log:printInfo(\`'\${tableName}' cache entry created for Id: \${after.id}\`);
    }

    remote function onUpdate(Entity before, Entity after, string tableName) returns cdc:Error? {
        log:printInfo(\`'\${tableName}' cache entry updated for Id: \${after.id}.\`);
    }

    remote function onDelete(Entity before, string tableName) returns cdc:Error? {
        if tableName == "products" {
            log:printInfo(\`'products' cache entry deleted for Id: \${before.id}.\`);
        } else {
            log:printInfo(\`'vendors' cache entry deleted for Id: \${before.id}.\`);
        }
    }
}

@cdc:ServiceConfig {
    tables: ["store_db.product_reviews"]
}
service on mysqlListener {

    remote function onRead(ProductReviews after, string tableName) returns cdc:Error? {
        log:printInfo(\`'product_tot_rating' cache added for Product Id: \${after.product_id}.\`);
        log:printInfo(\`'product_reviews' cache entry added for Product Id: \${after.product_id}.\`);
    }

    remote function onCreate(ProductReviews after, string tableName) returns cdc:Error? {
        log:printInfo(\`'product_tot_rating' cache added for Product Id: \${after.product_id}.\`);
        log:printInfo(\`'product_reviews' cache entry added for Product Id: \${after.product_id}.\`);
    }

    remote function onUpdate(ProductReviews before, ProductReviews after, string tableName) returns cdc:Error? {
        int ratingDiff = after.rating - before.rating;
        log:printInfo(\`'product_tot_rating' cache updated for Product Id: \${after.product_id}.\`);
    }

    remote function onDelete(ProductReviews before, string tableName) returns cdc:Error? {
        log:printInfo(\`'product_tot_rating' cache deleted for Product Id: \${before.product_id}.\`);
        log:printInfo(\`'product_reviews' cache entry deleted for Product Id: \${before.product_id}.\`);
    }
}
`,
];

export function CdcAdvancedService({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>Change Data Capture - Group Events by Table</h1>

      <p>
        The <code>cdc:Service</code> connects to a MySQL database using the{" "}
        <code>mysql:CdcListener</code>, allowing you to handle change data
        capture (CDC) events as typed records. The listener detects database
        changes and calls the relevant remote method (<code>onRead</code>,{" "}
        <code>onCreate</code>, <code>onUpdate</code>, or <code>onDelete</code>)
        in your service, passing the event data.
      </p>

      <p>
        You can attach multiple <code>cdc:Service</code> instances to a single{" "}
        <code>mysql:CdcListener</code>. This lets you group related event
        handling logic into separate services, making your code easier to
        organize and maintain. Each service can focus on a specific set of
        tables or event types, improving readability and separation of concerns.
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
                "https://github.com/ballerina-platform/ballerina-distribution/tree/v2201.12.10/examples/cdc-advanced-service",
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
              className="bg-transparent border-0 m-0 p-2 "
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
              className="bg-transparent border-0 m-0 p-2 "
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
            To set up the database, see the{" "}
            <a href="https://github.com/ballerina-platform/ballerina-distribution/tree/master/examples/cdc-prerequisite">
              Change Data Capture Ballerina By Example - Prerequisites and Test
              Data
            </a>
            .
          </span>
        </li>
      </ul>

      <p>Run the program by executing the following command.</p>

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
              <span>{`\$ bal run cdc_advanced_service.bal`}</span>
              <span>{`time=2025-05-27T22:26:20.509+05:30 level=INFO module="" message="\\'product_tot_rating\\' cache added for Product Id: 1001."`}</span>
              <span>{`time=2025-05-27T22:26:20.520+05:30 level=INFO module="" message="\\'product_reviews\\' cache entry added for Product Id: 1001."`}</span>
              <span>{`time=2025-05-27T22:26:20.522+05:30 level=INFO module="" message="\\'product_tot_rating\\' cache added for Product Id: 1001."`}</span>
              <span>{`time=2025-05-27T22:26:20.523+05:30 level=INFO module="" message="\\'product_reviews\\' cache entry added for Product Id: 1001."`}</span>
              <span>{`time=2025-05-27T22:26:20.525+05:30 level=INFO module="" message="\\'product_tot_rating\\' cache added for Product Id: 1002."`}</span>
              <span>{`time=2025-05-27T22:26:20.526+05:30 level=INFO module="" message="\\'product_reviews\\' cache entry added for Product Id: 1002."`}</span>
              <span>{`time=2025-05-27T22:26:20.532+05:30 level=INFO module="" message="\\'products\\' cache entry created for Id: 1001"`}</span>
              <span>{`time=2025-05-27T22:26:20.534+05:30 level=INFO module="" message="\\'products\\' cache entry created for Id: 1002"`}</span>
              <span>{`time=2025-05-27T22:26:20.536+05:30 level=INFO module="" message="\\'vendors\\' cache entry created for Id: 1"`}</span>
              <span>{`time=2025-05-27T22:26:20.538+05:30 level=INFO module="" message="\\'vendors\\' cache entry created for Id: 2"`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <blockquote>
        <p>
          <strong>Tip:</strong> To insert additional records for testing, run
          the <code>test_cdc_advance_listener.bal</code> file provided in the{" "}
          <a href="https://github.com/ballerina-platform/ballerina-distribution/tree/master/examples/cdc-prerequisite">
            Change Data Capture Ballerina By Example - Prerequisites and Test
            Data
          </a>
          .
        </p>
      </blockquote>

      <h2>Related links</h2>

      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://lib.ballerina.io/ballerinax/mysql/latest#CdcListener">
              <code>mysql:CdcListener</code> - API documentation
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://lib.ballerina.io/ballerinax/cdc/latest#Service">
              <code>cdc:Service</code> - API documentation
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://github.com/ballerina-platform/module-ballerinax-cdc/blob/main/docs/spec/spec.md#22-service">
              <code>cdc:Service</code> - Specification
            </a>
          </span>
        </li>
      </ul>
      <span style={{ marginBottom: "20px" }}></span>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="Listen to database"
            href="/learn/by-example/cdc-service/"
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
                  Listen to database
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="Serialization/Deserialization"
            href="/learn/by-example/avro-serdes/"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Serialization/Deserialization
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
