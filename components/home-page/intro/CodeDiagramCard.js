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

import { prefix } from '../../../utils/prefix';
import styles from './CodeDiagramCard.module.css';

const DWELL_MS = 5000;

const CODE = `public function main() returns error? {
    openai:ModelProvider model = check new openai:ModelProvider(
        openAiApiKey, modelType = openai:GPT_4O_MINI
    );
    final ai:Agent agent = check new (
        systemPrompt = {
            role: string \`Delivery assistant\`,
            instructions: string \`
            You help customers track orders and shipments.
            1. Given an order id look up for order detials.
            2. Given a shipment id look up for shipment details status and ETA.
            3. To notify users via email.

            Never guess. If an id is not found, ask the user to check it.\`
    
        }, model = model, tools = [lookupOrder, lookupShipment, sendEmail], memory = aiShorttermmemory
    );
    string answer = check agent.run("When will order O-100 arrive?");
    log:printInfo(answer);
}`;

// Order matters: string templates and literals are matched before the keywords inside them.
const TOKEN = /(string\s*`[^`]*`|"[^"]*"|\b[a-z]\w*:[A-Z]\w*\b|\b(?:string|error)\b)|\b(public|function|returns|check|new|final)\b/g;

function highlight(code) {
  const parts = [];
  let last = 0;
  for (const m of code.matchAll(TOKEN)) {
    if (m.index > last) parts.push(code.slice(last, m.index));
    parts.push(<span key={m.index} className={m[1] ? styles.type : styles.keyword}>{m[0]}</span>);
    last = m.index + m[0].length;
  }
  parts.push(code.slice(last));
  return parts;
}

export default function CodeDiagramCard() {
  const [view, setView] = React.useState('code');
  const [auto, setAuto] = React.useState(true);
  const hovering = React.useRef(false);
  const barRef = React.useRef(null);

  React.useEffect(() => {
    if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setAuto(false);
      return undefined;
    }
    let elapsed = 0;
    let last = null;
    let frame;
    const tick = (now) => {
      if (last !== null && !hovering.current) elapsed += now - last;
      last = now;
      if (elapsed >= DWELL_MS) {
        elapsed = 0;
        setView((v) => (v === 'code' ? 'diagram' : 'code'));
      }
      if (barRef.current) barRef.current.style.width = `${(elapsed / DWELL_MS) * 100}%`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [auto]);

  const choose = (next) => {
    setAuto(false);
    setView(next);
  };

  return (
    <div
      className={styles.card}
      onMouseEnter={() => { hovering.current = true; }}
      onMouseLeave={() => { hovering.current = false; }}>
      <div className={styles.head}>
        <span className={styles.file}>delivery_agent.bal</span>
        <div className={styles.toggle} role="group" aria-label="View">
          {['code', 'diagram'].map((v) => (
            <button key={v} type="button" aria-pressed={view === v} onClick={() => choose(v)}>
              {v === 'code' ? 'Code' : 'Diagram'}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.progress} aria-hidden="true">
        {auto && <span ref={barRef} />}
      </div>
      <div className={styles.stage}>
        <pre
          className={`${styles.view} ${styles.code} ${view === 'code' ? styles.active : ''}`}
          aria-hidden={view !== 'code'}
          tabIndex={view === 'code' ? 0 : -1}>
          <code>{highlight(CODE)}</code>
        </pre>
        <div
          className={`${styles.view} ${styles.diagram} ${view === 'diagram' ? styles.active : ''}`}
          aria-hidden={view !== 'diagram'}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${prefix}/images/home-page/delivery-agent-diagram.png`}
            alt="Flow diagram of the delivery agent generated from the same source" />
        </div>
      </div>
    </div>
  );
}
