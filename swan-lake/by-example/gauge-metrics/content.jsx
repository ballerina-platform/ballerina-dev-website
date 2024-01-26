import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `import ballerina/http;
import ballerina/io;
import ballerina/log;
import ballerina/observe;
import ballerinax/prometheus as _;

//Create a gauge as a global variable in the service with the optional field description,
//default statistics configurations = { timeWindow: 600000, buckets: 5,
// and percentiles: [0.33, 0.5, 0.66, 0.99] }.
observe:Gauge globalGauge = new ("global_gauge", "Global gauge defined");

service /onlineStoreService on new http:Listener(9090) {

    resource function get makeOrder(http:Caller caller, http:Request req) {
        io:println("------------------------------------------");
        //Incrementing the global gauge defined by 15.0.
        globalGauge.increment(15.0);
        //Log the current state of global gauge.
        printGauge(globalGauge);


        //Create a gauge with simply a name, and default statistics configurations.
        observe:Gauge localGauge = new ("local_operations");
        //Increment the local gauge by default value 1.0.
        localGauge.increment();
        //Increment the value of the gauge by 20.
        localGauge.increment(20.0);
        //Decrement the local gauge by default value 1.0.
        localGauge.decrement();
        //Decrement the value of the gauge by 20.
        localGauge.decrement(10.0);
        //Log the current state of local gauge.
        printGauge(localGauge);


        //Create a gauge with optional fields description, and tags defined.
        observe:Gauge registeredGaugeWithTags =
                  new ("registered_gauge_with_tags", "RegisteredGauge",
                       {property: "gaugeProperty", gaugeType: "RegisterType"});

        //Register the gauge instance, therefore it is stored in the global registry and can be reported to the
        //metrics server such as Prometheus. Additionally, this operation will register to the global registry for the
        //first invocation and will throw an error if there is already a registration of different metrics instance
        //or type. And subsequent invocations of register() will simply retrieve the stored metrics instance
        //for the provided name and tags fields, and use that instance for the subsequent operations on the
        //Counter instance.
        error? result = registeredGaugeWithTags.register();
        if (result is error) {
            log:printError("Error in registering gauge", 'error = result);
        }

        //Set the value of the gauge with the new value.
        registeredGaugeWithTags.increment();
        float value = registeredGaugeWithTags.getValue();
        float newValue = value * 12.0;
        registeredGaugeWithTags.setValue(newValue);
        //Log the current state of registered gauge with tags.
        printGauge(registeredGaugeWithTags);


        //Create a gauge with statistics disabled by passing empty statistics config array.
        observe:StatisticConfig[] statsConfigs = [];
        observe:Gauge gaugeWithNoStats = new ("gauge_with_no_stats",
                                        "Some description", (), statsConfigs);
        gaugeWithNoStats.setValue(100);
        printGauge(gaugeWithNoStats);


        //Create gauge with custom statistics config.
        observe:StatisticConfig config = {
            timeWindow: 30000,
            percentiles: [0.33, 0.5, 0.9, 0.99],
            buckets: 3
        };
        statsConfigs[0] = config;
        observe:Gauge gaugeWithCustomStats = new ("gauge_with_custom_stats",
                                        "Some description", (), statsConfigs);
        int i = 1;
        while (i < 6) {
            gaugeWithCustomStats.setValue(<float>(100 * i));
            i = i + 1;
        }
        //Log the current state of registered gauge with tags.
        printGauge(gaugeWithCustomStats);

        io:println("------------------------------------------");

        //Send response to the client.
        http:Response res = new;
        // Use a util method to set a string payload.
        res.setPayload("Order Processed!");

        // Send the response back to the caller.
        result = caller->respond(res);

        if (result is error) {
            log:printError("Error sending response", 'error = result);
        }
    }
}

function printGauge(observe:Gauge gauge) {
    //Get the statistics snapshot of the gauge.
    io:print("Gauge - " + gauge.name + " Snapshot: ");
    observe:Snapshot[]? snapshots = gauge.getSnapshot();
    json|error snapshotAsAJson = snapshots.cloneWithType(json);
    if snapshotAsAJson is json {
        io:println(snapshotAsAJson.toJsonString());
    }
    //Get the current value of the gauge.
    io:println("Gauge - ", gauge.name, " Current Value: "
        , gauge.getValue());
}
`,
];

export function GaugeMetrics({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();
  const [outputClick2, updateOutputClick2] = useState(false);
  const ref2 = createRef();

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>Gauge-based metrics</h1>

      <p>
        Ballerina supports Observability out of the box and Metrics is one of
        the three important aspects of the bservability. To observe Ballerina
        code, the build time flag <code>--observability-included</code> should
        be given along with the <code>Config.toml</code> file when starting the
        service. The <code>Config.toml</code> file contains the required runtime
        configurations related to observability.
      </p>

      <p>
        The developers can define and use metrics to measure their own logic. A
        gauge is one type of the metrics that is supported by default in
        Ballerina, and it represents a single numerical value that can
        arbitrarily go up and down, and also based on the statistics
        configurations provided to the Gauge, it can also report the statistics
        such as max, min, mean, percentiles, etc.
      </p>

      <p>
        For more information about configs and observing applications, see{" "}
        <a href="/learn/observe-ballerina-programs/">
          Observe Ballerina programs
        </a>
        .
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
                "https://github.com/ballerina-platform/ballerina-distribution/tree/v2201.8.4/examples/gauge-metrics",
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

      <p>Invoke the service using the cURL command below.</p>

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
              <span>{`\$ curl http://localhost:9090/onlineStoreService/makeOrder`}</span>
              <span>{`Order Processed!`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <p>To start the service, navigate to the directory that contains the</p>

      <p>
        <code>.bal</code> file, and execute the <code>bal run</code> command
        below with the <code>--observability-included</code> build time flag and
        the <code>Config.toml</code> runtime configuration file.
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
              <span>{`\$ BAL_CONFIG_FILES=Config.toml bal run --observability-included gauge_metrics.bal`}</span>
              <span>{`ballerina: started Prometheus HTTP listener 0.0.0.0:9797`}</span>
              <span>{`------------------------------------------`}</span>
              <span>{`Gauge - global_gauge Snapshot: [{"timeWindow":600000, "mean":15.0, "max":15.0, "min":15.0, "stdDev":0.0, "percentileValues":[{"percentile":0.33, "value":15.0}, {"percentile":0.5, "value":15.0}, {"percentile":0.66, "value":15.0}, {"percentile":0.75, "value":15.0}, {"percentile":0.95, "value":15.0}, {"percentile":0.99, "value":15.0}, {"percentile":0.999, "value":15.0}]}]`}</span>
              <span>{`Gauge - global_gauge Current Value: 15.0`}</span>
              <span>{`Gauge - local_operations Snapshot: [{"timeWindow":600000, "mean":13.0390625, "max":21.1171875, "min":1.0, "stdDev":8.180620171277893, "percentileValues":[{"percentile":0.33, "value":10.0546875}, {"percentile":0.5, "value":10.0546875}, {"percentile":0.66, "value":20.1171875}, {"percentile":0.75, "value":20.1171875}, {"percentile":0.95, "value":21.1171875}, {"percentile":0.99, "value":21.1171875}, {"percentile":0.999, "value":21.1171875}]}]`}</span>
              <span>{`Gauge - local_operations Current Value: 10.0`}</span>
              <span>{`Gauge - registered_gauge_with_tags Snapshot: [{"timeWindow":600000, "mean":6.515625, "max":12.0546875, "min":1.0, "stdDev":5.515625, "percentileValues":[{"percentile":0.33, "value":1.0}, {"percentile":0.5, "value":1.0}, {"percentile":0.66, "value":12.0546875}, {"percentile":0.75, "value":12.0546875}, {"percentile":0.95, "value":12.0546875}, {"percentile":0.99, "value":12.0546875}, {"percentile":0.999, "value":12.0546875}]}]`}</span>
              <span>{`Gauge - registered_gauge_with_tags Current Value: 12.0`}</span>
              <span>{`Gauge - gauge_with_no_stats Snapshot: null`}</span>
              <span>{`Gauge - gauge_with_no_stats Current Value: 100.0`}</span>
              <span>{`Gauge - gauge_with_custom_stats Snapshot: [{"timeWindow":30000, "mean":300.7, "max":501.5, "min":100.0, "stdDev":141.775033062948, "percentileValues":[{"percentile":0.33, "value":200.5}, {"percentile":0.5, "value":301.5}, {"percentile":0.9, "value":501.5}, {"percentile":0.99, "value":501.5}]}]`}</span>
              <span>{`Gauge - gauge_with_custom_stats Current Value: 500.0`}</span>
              <span>{`------------------------------------------`}</span>
              <span>{`------------------------------------------`}</span>
              <span>{`Gauge - global_gauge Snapshot: [{"timeWindow":600000, "mean":22.53125, "max":30.0625, "min":15.0, "stdDev":7.53125, "percentileValues":[{"percentile":0.33, "value":15.0}, {"percentile":0.5, "value":15.0}, {"percentile":0.66, "value":30.0625}, {"percentile":0.75, "value":30.0625}, {"percentile":0.95, "value":30.0625}, {"percentile":0.99, "value":30.0625}, {"percentile":0.999, "value":30.0625}]}]`}</span>
              <span>{`Gauge - global_gauge Current Value: 30.0`}</span>
              <span>{`Gauge - local_operations Snapshot: [{"timeWindow":600000, "mean":13.0390625, "max":21.1171875, "min":1.0, "stdDev":8.180620171277893, "percentileValues":[{"percentile":0.33, "value":10.0546875}, {"percentile":0.5, "value":10.0546875}, {"percentile":0.66, "value":20.1171875}, {"percentile":0.75, "value":20.1171875}, {"percentile":0.95, "value":21.1171875}, {"percentile":0.99, "value":21.1171875}, {"percentile":0.999, "value":21.1171875}]}]`}</span>
              <span>{`Gauge - local_operations Current Value: 10.0`}</span>
              <span>{`Gauge - registered_gauge_with_tags Snapshot: [{"timeWindow":600000, "mean":55.4140625, "max":156.9921875, "min":1.0, "stdDev":61.38432884406833, "percentileValues":[{"percentile":0.33, "value":12.0546875}, {"percentile":0.5, "value":12.0546875}, {"percentile":0.66, "value":52.2421875}, {"percentile":0.75, "value":52.2421875}, {"percentile":0.95, "value":156.9921875}, {"percentile":0.99, "value":156.9921875}, {"percentile":0.999, "value":156.9921875}]}]`}</span>
              <span>{`Gauge - registered_gauge_with_tags Current Value: 156.0`}</span>
              <span>{`Gauge - gauge_with_no_stats Snapshot: null`}</span>
              <span>{`Gauge - gauge_with_no_stats Current Value: 100.0`}</span>
              <span>{`Gauge - gauge_with_custom_stats Snapshot: [{"timeWindow":30000, "mean":300.7, "max":501.5, "min":100.0, "stdDev":141.775033062948, "percentileValues":[{"percentile":0.33, "value":200.5}, {"percentile":0.5, "value":301.5}, {"percentile":0.9, "value":501.5}, {"percentile":0.99, "value":501.5}]}]`}</span>
              <span>{`Gauge - gauge_with_custom_stats Current Value: 500.0`}</span>
              <span>{`------------------------------------------`}</span>
              <span>{`------------------------------------------`}</span>
              <span>{`Gauge - global_gauge Snapshot: [{"timeWindow":600000, "mean":30.0625, "max":45.1875, "min":15.0, "stdDev":12.298479750223873, "percentileValues":[{"percentile":0.33, "value":15.0}, {"percentile":0.5, "value":30.0625}, {"percentile":0.66, "value":30.0625}, {"percentile":0.75, "value":45.1875}, {"percentile":0.95, "value":45.1875}, {"percentile":0.99, "value":45.1875}, {"percentile":0.999, "value":45.1875}]}]`}</span>
              <span>{`Gauge - global_gauge Current Value: 45.0`}</span>
              <span>{`Gauge - local_operations Snapshot: [{"timeWindow":600000, "mean":13.0390625, "max":21.1171875, "min":1.0, "stdDev":8.180620171277893, "percentileValues":[{"percentile":0.33, "value":10.0546875}, {"percentile":0.5, "value":10.0546875}, {"percentile":0.66, "value":20.1171875}, {"percentile":0.75, "value":20.1171875}, {"percentile":0.95, "value":21.1171875}, {"percentile":0.99, "value":21.1171875}, {"percentile":0.999, "value":21.1171875}]}]`}</span>
              <span>{`Gauge - local_operations Current Value: 10.0`}</span>
              <span>{`Gauge - registered_gauge_with_tags Snapshot: [{"timeWindow":600000, "mean":377.1927083333333, "max":1887.9921875, "min":1.0, "stdDev":676.7534301455432, "percentileValues":[{"percentile":0.33, "value":12.0546875}, {"percentile":0.5, "value":52.2421875}, {"percentile":0.66, "value":156.9921875}, {"percentile":0.75, "value":157.9921875}, {"percentile":0.95, "value":1887.9921875}, {"percentile":0.99, "value":1887.9921875}, {"percentile":0.999, "value":1887.9921875}]}]`}</span>
              <span>{`Gauge - registered_gauge_with_tags Current Value: 1884.0`}</span>
              <span>{`Gauge - gauge_with_no_stats Snapshot: null`}</span>
              <span>{`Gauge - gauge_with_no_stats Current Value: 100.0`}</span>
              <span>{`Gauge - gauge_with_custom_stats Snapshot: [{"timeWindow":30000, "mean":300.7, "max":501.5, "min":100.0, "stdDev":141.775033062948, "percentileValues":[{"percentile":0.33, "value":200.5}, {"percentile":0.5, "value":301.5}, {"percentile":0.9, "value":501.5}, {"percentile":0.99, "value":501.5}]}]`}</span>
              <span>{`Gauge - gauge_with_custom_stats Current Value: 500.0`}</span>
              <span>{`------------------------------------------`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="Counter-based metrics"
            href="/learn/by-example/counter-metrics"
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
                  Counter-based metrics
                </span>
              </div>
            </div>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
