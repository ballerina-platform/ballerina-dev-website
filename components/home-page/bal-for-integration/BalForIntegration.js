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
    title: 'Services and connectors',
    description: 'Expose HTTP, GraphQL, gRPC, and WebSocket services, and reach SaaS apps, databases, and APIs through typed connectors.',
    excerpts: [
      {
        label: 'The service',
        note: 'copies GitHub pull requests into Google Sheets',
        code: `type PullRequest record {
    string url;
    string title;
    string state;
};

final http:Client github = check new ("https://api.github.com/repos");
final sheets:Client gsheets = check new ({auth: {token: sheetsToken}});

service /reports on new http:Listener(8080) {
    resource function post [string owner]/[string repo]() returns error? {
        PullRequest[] prs = check github->/[owner]/[repo]/pulls;
        foreach var {url, title, state} in prs {
            _ = check gsheets->appendValue(sheetId, [url, title, state],
                    {sheetName: "pull-requests"});
        }
    }
}`
      }
    ]
  },
  {
    title: 'Data as types',
    description: 'JSON, XML, and CSV bind straight to record types. Transform them with query expressions the compiler checks.',
    excerpts: [
      {
        label: 'The transformation',
        note: 'binds a JSON payload to records and maps it to XML',
        code: `type Customer record {|
    string id;
    string name;
    string email;
    boolean active;
|};

service /contacts on new http:Listener(8080) {
    // The JSON payload binds to Customer[]; malformed input is rejected.
    resource function post export(Customer[] customers) returns xml {
        return xml \`<contacts>\${
            from Customer customer in customers
            where customer.active
            select xml \`<contact><email>\${customer.email}</email></contact>\`
        }</contacts>\`;
    }
}`
      }
    ]
  },
  {
    title: 'Errors, retries, and transactions',
    description: 'Errors are values the compiler makes you handle. Retries, circuit breakers, and transactions are built in.',
    excerpts: [
      {
        label: 'The client',
        note: 'retries, then trips a circuit breaker if failures continue',
        code: `final http:Client paymentApi = check new (paymentUrl,
    timeout = 10,
    retryConfig = {count: 3, interval: 1, backOffFactor: 2.0},
    circuitBreaker = {
        rollingWindow: {timeWindow: 60, bucketSize: 10},
        failureThreshold: 0.5,
        resetTime: 30,
        statusCodes: [500, 502, 503]
    }
);`
      },
      {
        label: 'The service',
        note: 'handles the failure and updates both tables atomically',
        code: `service /orders on new http:Listener(8080) {
    resource function post .(Order 'order)
            returns http:Created|http:BadGateway|error {
        // A failed call is a value the compiler makes you handle.
        Payment|error payment = paymentApi->/payments.post(
                {orderId: 'order.id, amount: 'order.total});
        if payment is error {
            log:printError("Payment failed", payment);
            return <http:BadGateway>{body: "Payment service unavailable"};
        }

        // Both updates commit together, or neither does.
        transaction {
            _ = check db->execute(\`UPDATE stock SET qty = qty - \${'order.qty}
                    WHERE sku = \${'order.sku}\`);
            _ = check db->execute(\`INSERT INTO orders (id, payment_ref)
                    VALUES (\${'order.id}, \${payment.ref})\`);
            check commit;
        }
        return <http:Created>{body: {orderId: 'order.id}};
    }
}`
      }
    ]
  },
  {
    title: 'Events and workflows',
    description: 'React to Kafka and other event streams with listeners, and run long-running workflows that pause for people and resume.',
    excerpts: [
      {
        label: 'The listener',
        note: 'consumes orders and publishes fulfillment events',
        code: `service on new kafka:Listener(broker, groupId = "fulfillment", topics = "orders") {
    private final kafka:Producer producer;

    function init() returns error? {
        self.producer = check new (broker);
    }

    remote function onConsumerRecord(Order[] orders) returns error? {
        foreach Order item in orders {
            check self.producer->send({topic: "fulfillment",
                value: {orderId: item.orderId, status: "READY_TO_PACK"}});
        }
    }
}`
      },
      {
        label: 'The workflow',
        note: 'verifies a claim, waits for approval, then pays',
        code: `@workflow:Workflow
function claimApproval(workflow:Context ctx, Claim claim) returns string|error {
    boolean verified = check ctx->callActivity(verifyClaim, {"claim": claim});
    if !verified {
        return string \`Claim \${claim.claimId} failed verification.\`;
    }

    // Pauses until a manager decides, then resumes.
    ApprovalDecision decision = check ctx->awaitHumanTask("approveClaim", "MANAGER",
            payload = {claimId: claim.claimId, amount: claim.amount},
            title = string \`Approve claim \${claim.claimId}\`,
            description = "Approve or reject the payment.");
    if !decision.approved {
        return string \`Claim \${claim.claimId} rejected: \${decision.comment}\`;
    }

    string paymentRef = check ctx->callActivity(makePayment,
            {"claimId": claim.claimId, "amount": claim.amount});
    return string \`Claim \${claim.claimId} paid: \${paymentRef}\`;
}`
      }
    ]
  }
];

// Precedes "Ballerina for AI", so the text sits on the left.
export default function BalForIntegration(props) {
  return (
    <CapabilityShowcase
      id="ballerina-for-integration"
      eyebrow="Ballerina for Integration"
      heading="Build integrations that connect your systems, data, and services."
      lead="Integrations call systems you don’t control, over networks that fail. Ballerina handles this in the language with services, clients, typed data, checked errors, and safe concurrency."
      capabilities={CAPABILITIES}
      getLink={props.getLink}
    />
  );
}
