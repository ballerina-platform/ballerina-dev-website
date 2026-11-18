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
import { BsDatabase, BsRobot } from 'react-icons/bs';
import { SiGmail, SiOpenai } from 'react-icons/si';

import styles from './CodeDiagramCard.module.css';

const CODE = `public function main() returns error? {
    openai:ModelProvider model = check new openai:ModelProvider(
        openAiApiKey, modelType = openai:GPT_4O_MINI
    );
    final ai:Agent agent = check new (
        systemPrompt = {
            role: string \`Delivery assistant\`,
            instructions: string \`
            You help customers track orders and shipments.
            1. Given an order id, look up the order details.
            2. Given a shipment id, look up its status and ETA.
            3. Notify users by email.

            Never guess. If an id is not found, ask the user to check it.\`
        },
        model = model,
        tools = [lookupOrder, lookupShipment, sendEmail],
        memory = check new ai:ShortTermMemory()
    );
    string answer = check agent.run("When will order O-100 arrive?");
    log:printInfo(answer);
}`;

const TOKEN = /("[^"]*"|\b[a-z]\w*:[A-Z]\w*\b|\b(?:string|error)\b)|\b(public|function|returns|check|new|final)\b/g;

function tokens(text, key) {
  const parts = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(<span key={`${key}-${m.index}`} className={m[1] ? styles.type : styles.keyword}>{m[0]}</span>);
    last = m.index + m[0].length;
  }
  parts.push(text.slice(last));
  return parts;
}

// One block per source line. A string template can span lines, so its state carries over.
// Wrapped lines get a hanging indent past the line's own indentation instead of
// restarting at the left edge.
function highlight(code) {
  let inTemplate = false;
  return code.split('\n').map((line, i) => {
    const parts = [];
    let rest = line;
    let n = 0;
    const template = (text) => parts.push(<span key={n++} className={styles.type}>{text}</span>);
    while (rest) {
      if (inTemplate) {
        const close = rest.indexOf('`');
        const end = close === -1 ? rest.length : close + 1;
        template(rest.slice(0, end));
        rest = rest.slice(end);
        if (close !== -1) inTemplate = false;
      } else {
        const open = rest.indexOf('`');
        if (open === -1) {
          parts.push(...tokens(rest, n++));
          rest = '';
        } else {
          parts.push(...tokens(rest.slice(0, open), n++));
          const close = rest.indexOf('`', open + 1);
          const end = close === -1 ? rest.length : close + 1;
          template(rest.slice(open, end));
          rest = rest.slice(end);
          if (close === -1) inTemplate = true;
        }
      }
    }
    const indent = line.length - line.trimStart().length;
    return (
      <span key={i} className={styles.line} style={{ '--indent': `${indent + 4}ch` }}>
        {parts}{'\n'}
      </span>
    );
  });
}

const TOOLS = [
  { name: 'lookupOrder', icon: <span className={styles.fn}>ƒ</span> },
  { name: 'lookupShipment', icon: <span className={styles.fn}>ƒ</span> },
  { name: 'sendEmail', icon: <SiGmail className={styles.gmail} /> },
];

// Redraws the agent node of the WSO2 Integrator flow view of delivery_agent.bal:
// the agent with its memory and instructions, the model it calls, and its three tools.
function AgentDiagram() {
  return (
    <figure className={styles.agentDiagram}
      aria-label="Flow diagram of the agent: an AI Agent with short-term memory and delivery assistant instructions, calling an OpenAI model and the lookupOrder, lookupShipment and sendEmail tools.">
      <div className={styles.agentNode}>
        <div className={styles.nodeHead}>
          <BsRobot className={styles.nodeIcon} aria-hidden="true" />
          <span><strong>AI Agent</strong><code>agent</code></span>
        </div>
        <div className={styles.memory}>
          <span><strong>Memory</strong><code>ShortTermMemory</code></span>
          <BsDatabase className={styles.memoryIcon} aria-hidden="true" />
        </div>
        <div className={styles.prompt}>
          <p className={styles.role}>Delivery assistant</p>
          <p>You help customers track orders and shipments.</p>
          <ol>
            <li>Given an order id, look up the order details.</li>
            <li>Given a shipment id, look up its status and ETA.</li>
            <li>Notify users by email.</li>
          </ol>
          <p className={styles.faint}>Never guess. If an id is not found, ask the user to check it.</p>
        </div>
      </div>
      <ul className={styles.links}>
        <li className={styles.modelLink}>
          <span className={styles.edge} aria-hidden="true" />
          <span className={styles.circle} aria-hidden="true"><SiOpenai /></span>
          <span className={styles.linkLabel}>model<code>openai</code></span>
        </li>
        {TOOLS.map((t) => (
          <li key={t.name}>
            <span className={`${styles.edge} ${styles.dashed}`} aria-hidden="true" />
            <span className={styles.circle} aria-hidden="true">{t.icon}</span>
            <span className={styles.linkLabel}>{t.name}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

export default function CodeDiagramCard() {
  const [view, setView] = React.useState('code');

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span className={styles.file}>delivery_agent.bal</span>
        <div className={styles.toggle} role="group" aria-label="View">
          {['code', 'diagram'].map((v) => (
            <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}>
              {v === 'code' ? 'Code' : 'Diagram'}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.stage}>
        <pre
          className={`${styles.view} ${styles.code} ${view === 'code' ? styles.active : ''}`}
          role="group"
          aria-label="delivery_agent.bal code"
          aria-hidden={view !== 'code'}
          tabIndex={view === 'code' ? 0 : -1}>
          <code>{highlight(CODE)}</code>
        </pre>
        <div
          className={`${styles.view} ${styles.diagram} ${view === 'diagram' ? styles.active : ''}`}
          aria-hidden={view !== 'diagram'}>
          <AgentDiagram />
          <p className={styles.caption}>Generated from the same source</p>
        </div>
      </div>
    </div>
  );
}
