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

import CapabilityShowcase from '../ai-shared/CapabilityShowcase';

const CAPABILITIES = [
  {
    title: 'Agents and durable agents',
    description: 'Build agents that use Ballerina functions and connectors as tools, and durable agents that survive restarts and wait for human approval.',
    excerpts: [
      {
        label: 'The agent',
        note: 'calls an order lookup tool and is served over HTTP',
        code: `# Retrieves an order, including its status and tracking number.
@ai:AgentTool
isolated function getOrder(string orderId) returns Order|error {
    return orderApi->/orders/[orderId];
}

final ai:Agent supportAgent = check new (
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
        string answer = check supportAgent.run(request.message, request.sessionId);
        return {message: answer};
    }
}`
      }
    ]
  },
  {
    title: 'MCP servers and clients',
    description: 'Expose enterprise capabilities as MCP servers, and give agents the tools of any MCP server through the MCP client.',
    excerpts: [
      {
        label: 'The MCP server',
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
    title: 'Agent-to-Agent (A2A)',
    description: 'Publish agents as A2A services with an agent card, and delegate tasks to other agents through the A2A client.',
    excerpts: [
      {
        label: 'The A2A service',
        note: 'publishes an agent card and runs incoming tasks',
        code: `@a2a:ServiceConfig {
    agentCard: {
        name: "Weather Agent",
        description: "Answers weather questions",
        skills: [{id: "forecast", name: "Forecast",
            description: "Multi-day forecasts", tags: ["weather"]}]
        // Plus version, provider, input and output modes, and capabilities.
    }
}
isolated service on new a2a:RestListener(9090) {
    private final a2a:DefaultHandler handler = new (new WeatherAgentExecutor());

    isolated resource function post message\\:send(a2a:Context context,
            a2a:SendMessageRequest request) returns a2a:Task|a2a:Message|a2a:Error {
        return self.handler.sendMessage(context, request);
    }

    // Streaming, task, and push notification resources delegate the same way.
}`
      },
      {
        label: 'The A2A client',
        note: 'discovers a remote agent and sends it a task',
        code: `a2a:AgentCard card = check a2a:resolveAgentCard(agentUrl);
a2a:HttpClient weatherAgent = check new (card);

a2a:Task|a2a:Message reply = check weatherAgent->sendMessage({
    message: {
        messageId: "msg-1",
        role: a2a:ROLE_USER,
        parts: [{text: "What is the forecast for Colombo?"}]
    }
});

if reply is a2a:Task {
    a2a:Artifact[] artifacts = reply.artifacts ?: [];
    io:println(reply.status.state, ": ", artifacts);
}`
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

// Follows "Ballerina for Integration", so the excerpts sit on the left.
export default function BalForAi(props) {
  return (
    <CapabilityShowcase
      id="ballerina-for-ai"
      eyebrow="Ballerina for AI"
      heading="Build agents that work with enterprise systems."
      lead="Enterprise agents need models, tools, and other agents. Ballerina brings them together with the same language constructs and connectors used to build integrations."
      capabilities={CAPABILITIES}
      reverse
      getLink={props.getLink}
    />
  );
}
