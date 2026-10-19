/**
 * Copyright (c) 2026, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 LLC licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import * as React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { highlightLine } from '../ai-shared/highlight';
import hl from '../ai-shared/highlight.module.css';
import shared from '../ai-shared/section.module.css';
import styles from './AiCoding.module.css';

const REVIEW = `service /support on new http:Listener(8080) {
    resource function post tickets(Ticket ticket) returns TicketResult|error {
        Order orderDetails = check orderApi->/orders/[ticket.orderId];
        Triage triage = check model->generate(\`
            Classify this support ticket and summarize it in one sentence.
            Order status: \${orderDetails.status}
            Ticket: \${ticket.message}\`);
        return {ticketId: ticket.id, priority: triage.priority,
                summary: triage.summary};
    }
}`;

// Lines that continue a multi-line prompt template render as string text up to the closing backtick.
function highlightCode(code) {
  let inPrompt = false;
  return code.split('\n').map((text, i) => {
    let nodes;
    if (inPrompt) {
      const end = text.indexOf('`') + 1;
      nodes = end === 0
        ? <span className={hl.string}>{text}</span>
        : [<span key="prompt" className={hl.string}>{text.slice(0, end)}</span>, ...highlightLine(text.slice(end))];
    } else {
      nodes = highlightLine(text);
    }
    if ((text.match(/`/g) || []).length % 2 === 1) inPrompt = !inPrompt;
    return <React.Fragment key={i}>{nodes}{'\n'}</React.Fragment>;
  });
}

const CONSTRUCTS = `final http:Client orderApi = check new (orderApiUrl);
final http:Client shipmentApi = check new (shipmentApiUrl);

service /api on new http:Listener(8080) {
    resource function get orders/[string orderId]/delivery()
            returns Delivery|http:NotFound|http:BadGateway {
        Order|http:ClientError 'order = orderApi->/orders/[orderId];
        // ... handle errors, then look up the shipment
        Shipment|http:ClientError shipment =
                shipmentApi->/shipments/['order.trackingNumber];
        // ...
        return {orderId, status: shipment.status, eta: shipment.eta};
    }
}`;

const TEST = `@test:Config
function unknownOrderReturns404() returns error? {
    http:Response res = check api->/orders/["ORD-0000"]/delivery;
    test:assertEquals(res.statusCode, 404);
}`;

const DIFF = `-        return {orderId, status: shipment.status, eta: shipment.eta};
+        return {orderId, status: shipment.status, eta: shipment.eta,
+                carrier: shipment.carrier};`;

function Code({ code, className }) {
  return (
    <pre className={`${shared.code} ${className || ''}`}>
      <code>{highlightCode(code)}</code>
    </pre>
  );
}

function Panel({ label, note, className, children }) {
  return (
    <figure className={`${shared.panel} ${styles.panel} ${className || ''}`}>
      <figcaption className={shared.panelLabel}>
        <strong>{label}</strong>
        {note}
      </figcaption>
      {children}
    </figure>
  );
}

function ConstructsExample() {
  return (
    <>
      <Panel label="Code" note={<span>delivery.bal</span>}>
        <Code code={CONSTRUCTS} />
      </Panel>
      <p className={styles.exampleNote}>Clients, the listener, the service, and the resource path are language constructs, not library calls or framework configuration. A coding agent writes the integration in the same terms an engineer uses to describe it.</p>
    </>
  );
}

const SETTINGS = `final http:Client orderApi = check new (orderApiUrl,
    timeout = 10,
    retryConfig = {count: 3, interval: 2, statusCodes: [503]}
);

// The JSON payload is bound to Order by the library, not parsed by hand.
Order|http:ClientError 'order = orderApi->/orders/[orderId];`;

function SettingsExample() {
  return (
    <>
      <Panel label="Code" note={<span>delivery.bal</span>}>
        <Code code={SETTINGS} />
      </Panel>
      <p className={styles.exampleNote}>Timeouts, retries, and serialization are options of the HTTP client, not code the model writes. Anything left unset falls back to a documented library default, so the behavior does not depend on what a model picked on a given run.</p>
    </>
  );
}

// Redraws the WSO2 Integrator flow view of the tickets resource.
const FLOW_NODES = [
  { y: 86, icon: 'call', title: 'http : get', lines: ['orderDetails'], endpoint: { label: 'orderApi', icon: 'globe' } },
  { y: 186, icon: 'call', title: 'openai : generate', lines: ['triage'], endpoint: { label: 'model', icon: 'model' } },
  { y: 286, icon: 'return', title: 'Return', lines: ['{ticketId: ticket.id, prio', 'rity: triage.priority, su…'] }
];

function EndpointIcon({ kind, cx, cy }) {
  if (kind === 'globe') {
    return (
      <g className={styles.flowIcon}>
        <circle cx={cx} cy={cy} r="8" />
        <ellipse cx={cx} cy={cy} rx="3.6" ry="8" />
        <path d={`M${cx - 8} ${cy} H${cx + 8}`} />
      </g>
    );
  }
  return (
    <g className={styles.flowIcon}>
      {[0, 60, 120].map((r) => (
        <ellipse key={r} cx={cx} cy={cy} rx="8" ry="3.6" transform={`rotate(${r} ${cx} ${cy})`} />
      ))}
    </g>
  );
}

function FlowDiagram() {
  const cx = 160;
  return (
    <svg className={styles.diagram} viewBox="0 0 430 362" role="img"
      aria-label="Flow diagram of the tickets resource: Start; http get to orderApi, stored in orderDetails; openai generate to the model, stored in triage; Return.">
      <defs>
        <pattern id="aiCodingFlowDots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r=".8" className={styles.flowDot} />
        </pattern>
        <marker id="aiCodingFlowArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 1 L9 5 L0 9 z" className={styles.flowArrowHead} />
        </marker>
      </defs>
      <rect width="430" height="362" fill="url(#aiCodingFlowDots)" />

      <rect className={styles.flowBox} x={cx - 46} y="18" width="92" height="30" rx="15" />
      <text className={styles.flowTitle} x={cx} y="33" textAnchor="middle">Start</text>
      <path className={styles.flowEdge} d={`M${cx} 48 V84`} markerEnd="url(#aiCodingFlowArrow)" />

      {FLOW_NODES.map((n, i) => {
        const h = n.lines.length > 1 ? 58 : 48;
        const mid = n.y + h / 2;
        return (
          <g key={n.title}>
            <rect className={styles.flowBox} x="20" y={n.y} width="280" height={h} rx="6" />
            {n.icon === 'call'
              ? <path className={styles.flowCall} d={`M38 ${mid + 6} L50 ${mid - 6} M42 ${mid - 6} H50 V${mid + 2}`} />
              : <path className={styles.flowReturn} d={`M50 ${mid - 7} V${mid + 2} H38 M42 ${mid - 2} L38 ${mid + 2} L42 ${mid + 6}`} />}
            <text className={styles.flowTitle} x="66" y={n.y + 18}>{n.title}</text>
            {n.lines.map((l, j) => (
              <text key={j} className={styles.flowSub} x="66" y={n.y + 33 + j * 13}>{l}</text>
            ))}
            <g className={styles.flowKebab}>
              {[-5, 0, 5].map((d) => <circle key={d} cx="281" cy={mid + d} r="1.4" />)}
            </g>
            {n.endpoint && (
              <g>
                <path className={styles.flowEdge} d={`M300 ${mid} H352`} markerEnd="url(#aiCodingFlowArrow)" />
                <circle className={styles.flowBox} cx="376" cy={mid} r="22" />
                <EndpointIcon kind={n.endpoint.icon} cx={376} cy={mid} />
                <text className={styles.flowLabel} x="376" y={mid + 38} textAnchor="middle">{n.endpoint.label}</text>
              </g>
            )}
            {i < FLOW_NODES.length - 1 && (
              <path className={styles.flowEdge} d={`M${cx} ${n.y + h} V${FLOW_NODES[i + 1].y - 2}`} markerEnd="url(#aiCodingFlowArrow)" />
            )}
          </g>
        );
      })}
    </svg>
  );
}

function VisualExample() {
  return (
    <>
      <Panel label="Code" note={<span>support.bal</span>}>
        <Code code={REVIEW} />
      </Panel>
      <Panel label="Diagram" note={<em className={styles.note}>generated from the same source</em>}>
        <div className={styles.diagramWrap}>
          <FlowDiagram />
        </div>
      </Panel>
      <p className={styles.exampleNote}>The diagram is a view of the same source, not a separate artifact. Type and client declarations are omitted. <code>Order</code> and <code>Triage</code> are declared types: the compiler checks every use of their fields, and the API and model responses are checked against them at runtime, so a malformed response surfaces as an error.</p>
    </>
  );
}

function MaintainableExample() {
  return (
    <>
      <Panel label="Test" note={<span>tests/delivery_test.bal</span>}>
        <Code code={TEST} />
      </Panel>
      <Panel label="Change" note={<span>git diff delivery.bal</span>}>
        <pre className={`${shared.code} ${styles.diff}`}>
          <code>
            {DIFF.split('\n').map((line, i) => (
              <span key={i} className={`${styles.line} ${line[0] === '+' ? styles.add : styles.del}`}>
                {line[0]}{highlightLine(line.slice(1))}
              </span>
            ))}
          </code>
        </pre>
      </Panel>
      <p className={styles.exampleNote}>Generated integrations are ordinary <code>.bal</code> files. Teams review changes as diffs, run them with <code>bal test</code>, and keep evolving the same source.</p>
    </>
  );
}

const ADVANTAGES = [
  {
    title: 'Less code to generate',
    description: 'High-level constructs mean fewer tokens and fewer places for a model to make a mistake.',
    Example: ConstructsExample
  },
  {
    title: 'Fewer silent choices',
    description: 'Retries, timeouts, and serialization come from documented library defaults, not whatever a model picks on a given run.',
    Example: SettingsExample
  },
  {
    title: 'Easier to review',
    description: 'Types reject malformed data at compile time, and the diagram shows how the integration works at a glance.',
    Example: VisualExample
  },
  {
    title: 'Source you keep',
    description: 'Generate once, then version, test, and diff it like any other code.',
    Example: MaintainableExample
  }
];

export default function AiCoding(props) {
  const [selected, setSelected] = React.useState(0);
  const { Example } = ADVANTAGES[selected];

  return (
    <Col xs={12}>
      <Container>
        <Row className={shared.section}>
          <Col xs={{ span: 12, order: 2 }} lg={{ span: 7, order: 1 }} id="ai-for-ballerina-example" aria-live="polite" className={`${shared.example} ${styles.exampleCol}`}>
            <Example />
          </Col>

          <Col xs={{ span: 12, order: 1 }} lg={{ span: 5, order: 2 }} className={`${shared.text} ${styles.textCol}`}>
            <p className={shared.eyebrow}>AI for Ballerina</p>
            <h2 id="ai-for-ballerina" className={`section ${shared.heading}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-link-45deg mdButton pe-2"
                viewBox="0 0 16 16"
                onClick={(e) => props.getLink(e.target, 'ai-for-ballerina')}
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
              </svg>
              Writing Ballerina with AI coding agents
            </h2>

            <p className={shared.lead}>More integration code is now generated than typed. Ballerina’s design suits that: the model describes the integration at a high level, the compiler and standard library handle the plumbing, and you review the result as code and as a diagram.</p>

            <ul className={shared.rows}>
              {ADVANTAGES.map((a, i) => (
                <li key={a.title} className={i === selected ? shared.itemOn : undefined}>
                  <button
                    type="button"
                    className={shared.item}
                    aria-pressed={i === selected}
                    aria-controls="ai-for-ballerina-example"
                    onClick={() => setSelected(i)}
                  >
                    <span className={shared.itemTitle}>{a.title}</span>
                    <span className={shared.itemText}>{a.description}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}
