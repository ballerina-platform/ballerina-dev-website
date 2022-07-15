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
  `import ballerina/uuid;
import ballerinax/azure_functions as af;

// HTTP request/response with no authentication
@af:Function
public function hello(@af:HTTPTrigger { authLevel: "anonymous" }
                      string payload)
                      returns @af:HTTPOutput string|error {
    return "Hello, " + payload + "!";
}

// HTTP request to add data to a queue
@af:Function
public function fromHttpToQueue(af:Context ctx, 
            @af:HTTPTrigger af:HTTPRequest req, 
            @af:QueueOutput { queueName: "queue1" } af:StringOutputBinding msg) 
            returns @af:HTTPOutput af:HTTPBinding {
    msg.value = req.body;
    return { statusCode: 200, payload: "Request: " + req.toString() };
}

// A message put to a queue is copied to another queue
@af:Function
public function fromQueueToQueue(af:Context ctx, 
        @af:QueueTrigger { queueName: "queue2" } string inMsg,
        @af:QueueOutput { queueName: "queue3" } af:StringOutputBinding outMsg) {
    ctx.log("In Message: " + inMsg);
    ctx.log("Metadata: " + ctx.metadata.toString());
    outMsg.value = inMsg;
}

// A blob added to a container is copied to a queue
@af:Function
public function fromBlobToQueue(af:Context ctx, 
        @af:BlobTrigger { path: "bpath1/{name}" } byte[] blobIn,
        @af:BindingName  string name,
        @af:QueueOutput { queueName: "queue3" } af:StringOutputBinding outMsg) 
        returns error? {
    outMsg.value = "Name: " + name + " Content: " + blobIn.toString();
}

// HTTP request to read a blob value
@af:Function
public function httpTriggerBlobInput(@af:HTTPTrigger af:HTTPRequest req, 
                    @af:BlobInput { path: "bpath1/{Query.name}" }
                    byte[]? blobIn)
                    returns @af:HTTPOutput string {
    int length = 0;
    if blobIn is byte[] {
        length = blobIn.length();
    }
    return "Blob: " + req.query["name"].toString() + " Length: " + 
            length.toString() + " Content: " + blobIn.toString();
}

// HTTP request to add a new blob
@af:Function
public function httpTriggerBlobOutput(@af:HTTPTrigger af:HTTPRequest req, 
        @af:BlobOutput { path: "bpath1/{Query.name}" }
            af:StringOutputBinding bb)
        returns @af:HTTPOutput string|error {
    bb.value = req.body;
    return "Blob: " + req.query["name"].toString() + " Content: " + 
            bb?.value.toString();
}

// HTTP request to add a new blob
@af:Function
public function httpTriggerBlobOutput2(@af:HTTPTrigger af:HTTPRequest req,
        @af:BlobOutput { path: "bpath1/{Query.name}" } af:BytesOutputBinding bb)
        returns @af:HTTPOutput string|error {
    bb.value = [65, 66, 67, 97, 98];
    return "Blob: " + req.query["name"].toString() + " Content: " +
            bb?.value.toString();
}

// Sending an SMS
@af:Function
public function sendSMS(@af:HTTPTrigger af:HTTPRequest req, 
                        @af:TwilioSmsOutput { fromNumber: "+12069845840" } 
                                              af:TwilioSmsOutputBinding tb)
                        returns @af:HTTPOutput string {
    tb.to = req.query["to"].toString();
    tb.body = req.body.toString();
    return "Message - to: " + tb?.to.toString() + " body: " +
            tb?.body.toString();
}

public type Person record {
    string id;
    string name;
    string country;
};

// CosmosDB record trigger
@af:Function
public function cosmosDBToQueue1(@af:CosmosDBTrigger { 
        connectionStringSetting: "CosmosDBConnection", databaseName: "db1",
        collectionName: "c1" } Person[] req, 
        @af:QueueOutput { queueName: "queue3" } af:StringOutputBinding outMsg) {
    outMsg.value = req.toString();
}

@af:Function
public function cosmosDBToQueue2(@af:CosmosDBTrigger { 
        connectionStringSetting: "CosmosDBConnection", databaseName: "db1", 
        collectionName: "c2" } json req,
        @af:QueueOutput { queueName: "queue3" } af:StringOutputBinding outMsg) {
    outMsg.value = req.toString();
}

// HTTP request to read CosmosDB records
@af:Function
public function httpTriggerCosmosDBInput1(
            @af:HTTPTrigger af:HTTPRequest httpReq, 
            @af:CosmosDBInput { connectionStringSetting: "CosmosDBConnection", 
                databaseName: "db1", collectionName: "c1", 
                id: "{Query.id}", partitionKey: "{Query.country}" } json dbReq)
                returns @af:HTTPOutput string|error {
    return dbReq.toString();
}

@af:Function
public function httpTriggerCosmosDBInput2(
            @af:HTTPTrigger af:HTTPRequest httpReq, 
            @af:CosmosDBInput { connectionStringSetting: "CosmosDBConnection", 
                databaseName: "db1", collectionName: "c1", 
                id: "{Query.id}", partitionKey: "{Query.country}" }
                      Person? dbReq)
                returns @af:HTTPOutput string|error {
    return dbReq.toString();
}

@af:Function
public function httpTriggerCosmosDBInput3(
        @af:HTTPTrigger { route: "c1/{country}" } af:HTTPRequest httpReq, 
        @af:CosmosDBInput { connectionStringSetting: "CosmosDBConnection", 
        databaseName: "db1", collectionName: "c1", 
        sqlQuery: "select * from c1 where c1.country = {country}" } 
        Person[] dbReq)
        returns @af:HTTPOutput string|error {
    return dbReq.toString();
}

// HTTP request to write records to CosmosDB
@af:Function
public function httpTriggerCosmosDBOutput1(
    @af:HTTPTrigger af:HTTPRequest httpReq, @af:HTTPOutput af:HTTPBinding hb) 
    returns @af:CosmosDBOutput { connectionStringSetting: "CosmosDBConnection", 
                                 databaseName: "db1", collectionName: "c1" }
                                 json {
    json entry = { id: uuid:createType1AsString(), name: "Saman",
                    country: "Sri Lanka" };
    hb.payload = "Adding entry: " + entry.toString();
    return entry;
}

@af:Function
public function httpTriggerCosmosDBOutput2(
        @af:HTTPTrigger af:HTTPRequest httpReq, 
        @af:HTTPOutput af:HTTPBinding hb) 
        returns @af:CosmosDBOutput { 
            connectionStringSetting: "CosmosDBConnection", 
            databaseName: "db1", collectionName: "c1" } json {
    json entry = [{ id: uuid:createType1AsString(),
                    name: "John Doe A", country: "USA" },
                  { id: uuid:createType1AsString(),
                    name: "John Doe B", country: "USA" }];
    hb.payload = "Adding entries: " + entry.toString();
    return entry;
}

@af:Function
public function httpTriggerCosmosDBOutput3(
                    @af:HTTPTrigger af:HTTPRequest httpReq) 
                    returns @af:CosmosDBOutput { 
                        connectionStringSetting: "CosmosDBConnection", 
                        databaseName: "db1", collectionName: "c1" } Person[] {
    Person[] persons = [];
    persons.push({id: uuid:createType1AsString(), name: "Jack", country: "UK"});
    persons.push({id: uuid:createType1AsString(), name: "Will", country: "UK"});
    return persons;
}

// A timer function which is executed every 10 seconds.
@af:Function
public function queuePopulationTimer(
            @af:TimerTrigger { schedule: "*/10 * * * * *" } json triggerInfo, 
            @af:QueueOutput { queueName: "queue4" }
             af:StringOutputBinding msg) {msg.value = triggerInfo.toString();
}
`,
];

export default function AzureFunctionsDeployment() {
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
      <h1>Azure Functions</h1>

      <p>Azure Functions is an event driven, serverless computing platform.</p>

      <p>
        Ballerina functions can be deployed in Azure Functions by annotating a
        Ballerina function with Azure functions annotation&quot;. You can view
        the code examples below.
      </p>

      <p>
        For more information, see the{" "}
        <a href="https://ballerina.io/learn/deployment/azure-functions/">
          Azure Deployment Guide
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
                "https://github.com/ballerina-platform/ballerina-distribution/tree/v2201.0.3/azure-functions-deployment",
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
            <span>{`# Prerequisites: Azure CLI tools installation and configuration. Visit [Azure Deployment Guide](https://ballerina.io/learn/deployment/azure-functions/) for detailed steps.`}</span>
            <span>{``}</span>
            <span>{`# Create a ballerina package and replace the contents of the generated bal file with the contents above.`}</span>
            <span>{`bal new azure_functions_deployment`}</span>
            <span>{``}</span>
            <span>{`# Build the Ballerina program to generate the Azure Functions`}</span>
            <span>{`bal build`}</span>
            <span>{`Compiling source`}</span>
            <span>{`	wso2/azure_functions_deployment:0.1.0`}</span>
            <span>{``}</span>
            <span>{`Generating executables`}</span>
            <span>{`	@azure_functions:Function: hello, fromHttpToQueue, fromQueueToQueue, fromBlobToQueue, httpTriggerBlobInput, httpTriggerBlobOutput, sendSMS, cosmosDBToQueue1, cosmosDBToQueue2, httpTriggerCosmosDBInput1, httpTriggerCosmosDBInput2, httpTriggerCosmosDBInput3, httpTriggerCosmosDBOutput1, httpTriggerCosmosDBOutput2, httpTriggerCosmosDBOutput3, queuePopulationTimer`}</span>
            <span>{``}</span>
            <span>{`	Run the following command to deploy Ballerina Azure Functions:`}</span>
            <span>{`	az functionapp deployment source config-zip -g <resource_group> -n <function_app_name> --src <project_dir>/target/bin/azure-functions.zip`}</span>
            <span>{`	`}</span>
            <span>{`    target/bin/azure_functions_deployment.jar`}</span>
            <span>{`# Execute the Azure CLI command given by the compiler to publish the functions (replace with your respective Azure <resource_group> and <function_app_name>)`}</span>
            <span>{`az functionapp deployment source config-zip -g functions1777 -n functions1777 --src  <project_dir>/target/bin/azure-functions.zip`}</span>
            <span>{`Getting scm site credentials for zip deployment`}</span>
            <span>{`Starting zip deployment. This operation can take a while to complete ...`}</span>
            <span>{`Deployment endpoint responded with status code 202`}</span>
            <span>{`{`}</span>
            <span>{`  "active": true,`}</span>
            <span>{`  "author": "N/A",`}</span>
            <span>{`  "author_email": "N/A",`}</span>
            <span>{`  "complete": true,`}</span>
            <span>{`  "deployer": "ZipDeploy",`}</span>
            <span>{`  "end_time": "2020-07-02T06:48:08.7706207Z",`}</span>
            <span>{`  "id": "2bacf185fb114d42aab762dfd5f303dc",`}</span>
            <span>{`  "is_readonly": true,`}</span>
            <span>{`  "is_temp": false,`}</span>
            <span>{`  "last_success_end_time": "2020-07-02T06:48:08.7706207Z",`}</span>
            <span>{`  "log_url": "https://functions1777.scm.azurewebsites.net/api/deployments/latest/log",`}</span>
            <span>{`  "message": "Created via a push deployment",`}</span>
            <span>{`  "progress": "",`}</span>
            <span>{`  "provisioningState": null,`}</span>
            <span>{`  "received_time": "2020-07-02T06:47:56.2756472Z",`}</span>
            <span>{`  "site_name": "functions1777",`}</span>
            <span>{`  "start_time": "2020-07-02T06:47:56.7600364Z",`}</span>
            <span>{`  "status": 4,`}</span>
            <span>{`  "status_text": "",`}</span>
            <span>{`  "url": "https://functions1777.scm.azurewebsites.net/api/deployments/latest"`}</span>
            <span>{`}`}</span>
            <span>{``}</span>
            <span>{`# Invoke the functions (replace with your <auth_code> value in authenticated requests)`}</span>
            <span>{`curl -d "Jack" https://functions1777.azurewebsites.net/api/hello`}</span>
            <span>{`Hello, Jack!`}</span>
            <span>{``}</span>
            <span>{`curl -d "ABCDE" https://functions1777.azurewebsites.net/api/fromHttpToQueue?code=<auth_code>`}</span>
            <span>{`Request: url=https://functions1777.azurewebsites.net/api/fromHttpToQueue... body=ABCDE`}</span>
            <span>{``}</span>
            <span>{`curl "https://functions1777.azurewebsites.net/api/httpTriggerBlobInput?name=input.txt&code=<auth_code>"`}</span>
            <span>{`Blob: input.txt Length: 6 Content: 65 66 67 68 69 10`}</span>
            <span>{``}</span>
            <span>{`curl -d "123456" "https://functions1777.azurewebsites.net/api/httpTriggerBlobOutput?name=payload.txt&code=<auth_code>"`}</span>
            <span>{`Blob: payload.txt Content: 123456`}</span>
            <span>{``}</span>
            <span>{`curl -d "123456" "https://functions1777.azurewebsites.net/api/httpTriggerBlobOutput2?name=payload.txt&code=<auth_code>"`}</span>
            <span>{`Blob: payload.txt Content: 65 66 67 97 98`}</span>
            <span>{``}</span>
            <span>{`curl -d "Hello!" "https://functions1777.azurewebsites.net/api/sendSMS?to=xxxxxxxxxx&code=<auth_code>"`}</span>
            <span>{`Message - to: xxxxxxxxxx body: Hello!`}</span>
            <span>{``}</span>
            <span>{`curl "https://functions1777.azurewebsites.net/api/httpTriggerCosmosDBInput1?id=id1&code=<auth_code>"`}</span>
            <span>{`id=id1 _rid=zEkwANYTRPoFAAAAAAAAAA== _self=dbs/zEkwAA==/colls/zEkwANYTRPo=/docs/zEkwANYTRPoFAAAAAAAAAA==/ _ts=1591201470 _etag="10009f6c-0000-0100-0000-5ed7cebe0000" name=Tom birthYear=1950 country=Sri Lanka pk=p1`}</span>
            <span>{``}</span>
            <span>{`curl "https://functions1777.azurewebsites.net/api/httpTriggerCosmosDBInput2?id=id1&code=<auth_code>"`}</span>
            <span>{`id=id1 name=Tom birthYear=1950 _rid=zEkwANYTRPoFAAAAAAAAAA== _self=dbs/zEkwAA==/colls/zEkwANYTRPo=/docs/zEkwANYTRPoFAAAAAAAAAA==/ _ts=1591201470 _etag="10009f6c-0000-0100-0000-5ed7cebe0000" country=Sri Lanka pk=p1`}</span>
            <span>{``}</span>
            <span>{`curl "https://functions1777.azurewebsites.net/api/c1/Sri%20Lanka?code=<auth_code>"`}</span>
            <span>{`id=id3 name=Jack X birthYear=1950 country=Sri Lanka pk=p1 _rid=zEkwANYTRPoEAAAAAAAAAA== _self=dbs/zEkwAA==/colls/zEkwANYTRPo=/docs/zEkwANYTRPoEAAAAAAAAAA==/ _etag="1000076b-0000-0100-0000-5ed7cc110000" _attachments=attachments/ _ts=1591200785 id=id4 name=Tom birthYear=1950 country=Sri Lanka pk=p1 _rid=zEkwANYTRPoFAAAAAAAAAA== _self=dbs/zEkwAA==/colls/zEkwANYTRPo=/docs/zEkwANYTRPoFAAAAAAAAAA==/ _etag="10009f6c-0000-0100-0000-5ed7cebe0000" _attachments=attachments/ _ts=1591201470`}</span>
            <span>{``}</span>
            <span>{`curl https://functions1777.azurewebsites.net/api/httpTriggerCosmosDBOutput1?code=<auth_code>`}</span>
            <span>{`Adding entry: id=abf42517-53d7-4fa3-a30c-87cb65e9597d name=John Doe birthYear=1980`}</span>
            <span>{``}</span>
            <span>{`curl https://functions1777.azurewebsites.net/api/httpTriggerCosmosDBOutput2?code=<auth_code>`}</span>
            <span>{`Adding entries: id=f510e0d2-5341-4901-8c12-9aac1b212378 name=John Doe A birthYear=1985 id=cc145a0f-cb4f-4a5f-8d0f-fbf01209aa2d name=John Doe B birthYear=1990`}</span>
            <span>{``}</span>
            <span>{`curl https://functions1777.azurewebsites.net/api/httpTriggerCosmosDBOutput3?code=<auth_code>`}</span>
            <span>{`[{"id":"4ba53cb4-47a1-4028-af7b-2515f0a9c6bf","name":"Jack","birthYear":2001},{"id":"5b8a6697-c9e9-488d-91b3-3942574efeef","name":"Will","birthYear":2005}]`}</span>
          </code>
        </pre>
      </Row>

      <br />

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link title="Kubernetes" href="/learn/by-example/c2c-deployment">
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
                  Kubernetes
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="AWS Lambda"
            href="/learn/by-example/aws-lambda-deployment"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  AWS Lambda
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
