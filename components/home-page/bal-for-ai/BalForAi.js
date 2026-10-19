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
import { Row, Col, Container } from 'react-bootstrap';

import { highlightLine } from '../ai-shared/highlight';
import shared from '../ai-shared/section.module.css';
import styles from './BalForAi.module.css';

const CAPABILITIES = [
  {
    title: 'Agents and enterprise tools',
    description: 'Build agents that invoke Ballerina functions and use connectors to interact with business systems.',
    excerpts: [
      {
        label: 'The tool',
        note: 'an order lookup against the order system',
        code: `final http:Client orderApi = check new (orderApiUrl);

# Retrieves an order, including its status and tracking number.
#
# + orderId - The order ID, in the format ORD-1234
# + return - The order, or an error if it cannot be retrieved
@ai:AgentTool
isolated function getOrder(string orderId) returns Order|error {
    Order 'order = check orderApi->/orders/[orderId];
    return 'order;
}`
      },
      {
        label: 'The agent',
        note: 'uses the tool and is served over HTTP',
        code: `final ai:Agent supportAgent = check new (
    systemPrompt = {
        role: "Order Support Assistant",
        instructions: "Answer order questions. Use the tools; do not guess."
    },
    model = check new openai:ModelProvider(openAiKey, openai:GPT_4O),
    tools = [getOrder]
);

service /support on new http:Listener(8080) {
    resource function post chat(ai:ChatReqMessage request)
            returns ai:ChatRespMessage|error {
        string answer = check supportAgent.run(request.message,
                request.sessionId);
        return {message: answer};
    }
}`
      }
    ]
  },
  {
    title: 'MCP clients and services',
    description: 'Consume MCP tools and expose enterprise capabilities through Ballerina’s client and service abstractions.',
    excerpts: [
      {
        label: 'The MCP service',
        note: 'exposes order operations as tools',
        code: `listener mcp:StreamableHttpListener mcpListener = new (9090);

@mcp:StreamableHttpServiceConfig {
    info: {name: "customer-care-tools", version: "1.0.0"}
}
service mcp:StreamableHttpService /mcp on mcpListener {

    # Get the current status of an order.
    #
    # + orderId - Order ID in the format ORD-NNNN
    # + return - The order status, or an explanation if not found
    remote function getOrderStatus(string orderId)
            returns OrderStatus|ToolMessage {
        return findOrderStatus(orderId);
    }
}`
      },
      {
        label: 'The MCP client',
        note: 'gives an agent the server’s tools',
        code: `ai:McpToolKit orderTools = check new (mcpServerUrl,
    ["getOrderStatus", "submitReturnRequest"],
    {name: "customer-care-agent", version: "1.0.0"});

ai:Agent agent = check new (
    systemPrompt = {
        role: "Customer Care Agent",
        instructions: "Help customers with order status and returns."
    },
    model = model,
    tools = [orderTools]
);`
      }
    ]
  },
  {
    title: 'Retrieval and business context',
    description: 'Connect embedding providers and vector stores to retrieve relevant knowledge for model interactions.',
    excerpts: [
      {
        label: 'Ingest',
        note: 'embeds policy documents into a vector store',
        code: `final ai:EmbeddingProvider embeddings = check new openai:EmbeddingProvider(
        openAiKey, openai:TEXT_EMBEDDING_3_SMALL);

final ai:KnowledgeBase knowledgeBase = new ai:VectorKnowledgeBase(
        check new ai:InMemoryVectorStore(), embeddings);

function ingestPolicies(string[] paths) returns error? {
    ai:DataLoader loader = check new ai:TextDataLoader(...paths);
    check knowledgeBase.ingest(check loader.load());
}`
      },
      {
        label: 'Retrieve and answer',
        note: 'grounds the model in the matching excerpts',
        code: `ai:QueryMatch[] matches = check knowledgeBase.retrieve(question, 5);

GeneratedAnswer answer = check model->generate(\`
    Answer the employee's question using only the policy
    excerpts below. If they do not contain the answer,
    set answerFound to false.

    Excerpts: \${matches}
    Question: \${question}\`);`
      }
    ]
  },
  {
    title: 'Agent evaluations',
    description: 'Test agents against scenario datasets with rule-based and model-based checks, and run evaluations as standard tests in CI.',
    excerpts: [
      {
        label: 'The dataset',
        note: 'expected tool calls and answers for each scenario',
        code: `{
  "id": "shipped-no-cancel",
  "description": "A shipped order must not be cancelled",
  "traces": [{
    "userMessage": {"role": "user", "content": "Please cancel my order ORD-1001."},
    "toolCalls": [{"name": "getOrder", "arguments": {"orderId": "ORD-1001"}}],
    "output": {"role": "assistant",
        "content": "Order ORD-1001 has already shipped, so it can't be cancelled."}
  }]
}`
      },
      {
        label: 'The evaluation',
        note: 'a standard test with a pass-rate threshold',
        code: `@test:Config {dataProvider: orderThreads, runs: 3, minPassRate: 0.8}
isolated function evaluateOrderAgent(ai:ConversationThread thread) returns error? {
    ai:Agent agent = check createOrderAgent(model);
    foreach ai:Trace expected in thread.traces {
        string question = ai:getUserQuery(expected);
        ai:Trace actual = check agent.run(question, thread.id);

        // Rule-based check: the expected tools were called with the expected arguments.
        string[] violations = checkToolCalls(expected.toolCalls ?: [], actual.toolCalls ?: []);
        test:assertTrue(violations.length() == 0, violations.toString());

        // Model-based check: an LLM judge scores the answer against the reference.
        JudgeVerdict verdict = check judgeAnswer(judgeModel, question,
                check answerOf(expected), check answerOf(actual));
        test:assertTrue(verdict.score >= 4, verdict.reason);
    }
}`
      }
    ]
  }
];

export default function BalForAi(props) {
  const [active, setActive] = React.useState(0);
  const example = CAPABILITIES[active];

  return (
    <Col xs={12}>
      <Container>
        <Row className={shared.section}>
          <Col xs={12} lg={5} className={`${shared.text} ${styles.textCol}`}>
            <p className={shared.eyebrow}>Ballerina for AI</p>
            <h2 id="ballerina-for-ai" className={`section ${shared.heading}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-link-45deg mdButton pe-2"
                viewBox="0 0 16 16"
                onClick={(e) => props.getLink(e.target, 'ballerina-for-ai')}
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
              </svg>
              Build agents that work with enterprise systems.
            </h2>

            <p className={shared.lead}>An enterprise agent needs models, tools, and business context. Ballerina brings these together with the language constructs and connector ecosystem used to build integrations.</p>

            <ul className={shared.rows}>
              {CAPABILITIES.map((c, i) => (
                <li key={c.title} className={i === active ? shared.itemOn : undefined}>
                  <button
                    type="button"
                    className={shared.item}
                    aria-pressed={i === active}
                    aria-controls="bal-for-ai-example"
                    onClick={() => setActive(i)}
                  >
                    <span className={shared.itemTitle}>{c.title}</span>
                    <span className={shared.itemText}>{c.description}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Col>

          <Col xs={12} lg={7} id="bal-for-ai-example" aria-live="polite" className={`${shared.example} ${styles.exampleCol}`}>
            {example.excerpts.map((x) => (
              <figure key={x.label} className={`${shared.panel} ${styles.excerpt}`}>
                <figcaption className={shared.panelLabel}>
                  <strong>{x.label}</strong>
                  <em className={styles.note}>{x.note}</em>
                </figcaption>
                <pre className={shared.code}>
                  <code>
                    {x.code.split('\n').map((line, i) => (
                      <React.Fragment key={i}>{highlightLine(line)}{'\n'}</React.Fragment>
                    ))}
                  </code>
                </pre>
              </figure>
            ))}
          </Col>
        </Row>
      </Container>
    </Col>
  );
}
