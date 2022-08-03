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

// This code is completely focused on the business logic and it does not specify anything related to operations.
listener http:Listener helloEP = new(9090);

service http:Service /helloWorld on helloEP {
    resource function get sayHello() returns string {
        return "Hello, World from service helloWorld ! \\n";
    }
}
`,
];

export default function C2cDeployment() {
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
      <h1>Kubernetes</h1>

      <p>
        Ballerina supports generating Docker and Kubernetes artifacts from code
        without any additional configuration.
      </p>

      <p>
        This simplifies the experience of developing and deploying Ballerina
        code in the cloud.
      </p>

      <p>
        Code to Cloud builds the containers and required artifacts by deriving
        the required values from the code.
      </p>

      <p>
        If you want to override the default values taken by the compiler, you
        can use a <code>Cloud.toml</code> file. &lt;br/&gt;&lt;br/&gt;
      </p>

      <p>
        For more information, see{" "}
        <a href="/learn/run-ballerina-programs-in-the-cloud/code-to-cloud-deployment/">
          Code to Cloud deployment
        </a>
        .
      </p>

      <Row className="bbeCode mx-0 py-0 rounded" style={{ marginLeft: "0px" }}>
        <Col className="d-flex align-items-start" sm={12}>
          <button
            className="bg-transparent border-0 m-0 p-2 ms-auto"
            onClick={() => {
              window.open(
                "https://github.com/ballerina-platform/ballerina-distribution/tree/v2201.1.1/examples/c2c-deployment",
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
              <span>
                {`# Before you build the package, you need to override some of the default values taken by the compiler. To do this, create a filed named `}
                <code>{`Cloud.toml`}</code>
                {` `}
              </span>
              <span>{`in the package directory, and add the content below to it.`}</span>
              <span>{``}</span>
              <span>{`# For all the supported key value properties, see [Code to Cloud deployment](/learn/run-ballerina-programs-in-the-cloud/code-to-cloud-deployment/).`}</span>
              <span>{``}</span>
              <span>{`[container.image]`}</span>
              <span>{`repository="wso2inc"`}</span>
              <span>{`name="hello"`}</span>
              <span>{`tag="v0.1.0"`}</span>
              <span>{``}</span>
              <span>{`# Additionally, if you are using Minikube, execute the command below to reuse the Docker daemon from Minikube.`}</span>
              <span>
                {``}
                <code>{`eval \$(minikube docker-env)`}</code>
                {``}
              </span>
              <span>{``}</span>
              <span>
                {`# Execute the `}
                <code>{`bal build`}</code>
                {` command to build the Ballerina package. Code to Cloud generates only one container per package.`}
              </span>
              <span>
                {``}
                <code>{`bal build`}</code>
                {``}
              </span>
              <span>{``}</span>
              <span>{`Compiling source`}</span>
              <span>{`        wso2/hello:0.1.0`}</span>
              <span>{``}</span>
              <span>{`Creating balas`}</span>
              <span>{`        target/bala/hello-2020r2-any-0.1.0.bala`}</span>
              <span>{``}</span>
              <span>{`Running Tests`}</span>
              <span>{``}</span>
              <span>{`        wso2/hello:0.1.0`}</span>
              <span>{`        No tests found`}</span>
              <span>{``}</span>
              <span>{`Generating executables`}</span>
              <span>{`        target/bin/hello.jar`}</span>
              <span>{``}</span>
              <span>{`Generating artifacts...`}</span>
              <span>{``}</span>
              <span>{`        @kubernetes:Service                      - complete 1/1`}</span>
              <span>{`        @kubernetes:Deployment                   - complete 1/1`}</span>
              <span>{`        @kubernetes:HPA                          - complete 1/1`}</span>
              <span>{`        @kubernetes:Docker                       - complete 2/2`}</span>
              <span>{``}</span>
              <span>{`        Execute the below command to deploy the Kubernetes artifacts:`}</span>
              <span>{`        kubectl apply -f /home/wso2/project/target/kubernetes/hello-0.1.0`}</span>
              <span>{``}</span>
              <span>{`        Execute the below command to access service via NodePort:`}</span>
              <span>{`        kubectl expose deployment wso2-hello-0--deployment --type=NodePort --name=wso2-hello-0--svc-local`}</span>
              <span>{``}</span>
              <span>{`# First, let’s try executing the Docker image separately.`}</span>
              <span>{``}</span>
              <span>
                {`# Verify if the Docker image is generated. (If you have used the `}
                <code>{`minikube docker-env`}</code>
                {`, skip this and go to the Kubernetes deployment directly.)`}
              </span>
              <span>
                {``}
                <code>{`docker images`}</code>
                {``}
              </span>
              <span>{``}</span>
              <span>{`REPOSITORY                    TAG                 IMAGE ID            CREATED             SIZE`}</span>
              <span>{`wso2inc/hello                       v0.1.0              60d95f0928b2        About a minute ago   228MB`}</span>
              <span>{``}</span>
              <span>{`# Run the generated Docker image.`}</span>
              <span>
                {``}
                <code>{`docker run -d -p 9090:9090 wso2inc/hello:v0.1.0`}</code>
                {``}
              </span>
              <span>{`c04194eb0b4d0d78cbc8ca55e0527d381d8ab4a1a68f8ea5dd3770a0845d5fbb`}</span>
              <span>{``}</span>
              <span>{`# Access the service.`}</span>
              <span>
                {``}
                <code>{`curl http://localhost:9090/helloWorld/sayHello`}</code>
                {``}
              </span>
              <span>{`Hello, World from service helloWorld !`}</span>
              <span>{``}</span>
              <span>{`# Execute the Kubernetes service now.`}</span>
              <span>
                {``}
                <code>{`kubectl apply -f /home/wso2/project/target/kubernetes/hello-0.1.0`}</code>
                {``}
              </span>
              <span>{`service/helloep-svc created`}</span>
              <span>{`deployment.apps/wso2-hello-0--deployment created`}</span>
              <span>{`horizontalpodautoscaler.autoscaling/wso2-hello-0--hpa created`}</span>
              <span>{``}</span>
              <span>{`# Verify the Kubernetes pods.`}</span>
              <span>
                {``}
                <code>{`kubectl get pods`}</code>
                {``}
              </span>
              <span>{`NAME                                          READY   STATUS    RESTARTS   AGE`}</span>
              <span>{`wso2-hello-0--deployment-7d4d56457b-7jlzx   1/1     Running   0          57s`}</span>
              <span>{``}</span>
              <span>{`# Expose via Nodeport to test in the developer environment.`}</span>
              <span>
                {``}
                <code>{`kubectl expose deployment wso2-hello-0--deployment --type=NodePort --name=wso2-hello-0--svc-local`}</code>
                {``}
              </span>
              <span>{`service/wso2-hello-0--svc-local exposed`}</span>
              <span>{``}</span>
              <span>{`# Get the IP and port of the Kubernetes service.`}</span>
              <span>
                {``}
                <code>{`kubectl get svc`}</code>
                {``}
              </span>
              <span>{`NAME                        TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE`}</span>
              <span>{`wso2-hello-0--svc-local   NodePort    10.111.61.112    <none>        9090:32437/TCP   4m17s`}</span>
              <span>{``}</span>
              <span>
                {`# If you are using Minikube, the IP address should be changed according to the output of the `}
                <code>{`minikube ip`}</code>
                {` command.`}
              </span>
              <span>
                {``}
                <code>{`minikube ip`}</code>
                {``}
              </span>
              <span>{`192.168.49.2`}</span>
              <span>{``}</span>
              <span>{`# Access the deployed service via CURL.`}</span>
              <span>
                {``}
                <code>{`curl http://192.168.49.2:32437/helloWorld/sayHello`}</code>
                {``}
              </span>
              <span>{`Hello, World from service helloWorld !`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="Gauge-based metrics"
            href="/learn/by-example/gauge-metrics"
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
                  Gauge-based metrics
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="Azure Functions"
            href="/learn/by-example/azure-functions-deployment"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Azure Functions
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
