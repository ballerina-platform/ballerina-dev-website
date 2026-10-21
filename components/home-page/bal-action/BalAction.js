/**
 * Copyright (c) 2022, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
 * Licensed under the Apache License, Version 2.0.
 */
import * as React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCheck, FaRegCopy } from 'react-icons/fa';
import { examples } from './examples';
import styles from './BalAction.module.css';

function Diagram({ diagram }) {
  if (diagram.kind === 'image') {
    return <div className={styles.diagramImageWrap}>
      <img className={`${styles.diagramImage} ${diagram.large ? styles.diagramImageLarge : ''}`} src={diagram.src} alt={diagram.alt} />
    </div>;
  }
  if (diagram.kind === 'mapping' || diagram.kind === 'workflow') {
    return <div className={styles.flow} aria-label={diagram.nodes.join(' then ')}>
      {diagram.nodes.map((node, index) => <React.Fragment key={node}>
        {index > 0 && <span aria-hidden="true" className={styles.arrow}>→</span>}
        <span className={`${styles.flowNode} ${diagram.kind === 'workflow' && index === 1 ? styles.waiting : ''}`}>{node}</span>
      </React.Fragment>)}
    </div>;
  }
  return <div className={styles.sequence} aria-label="Interaction sequence">
    <div className={styles.participants}>{diagram.nodes.map(node => <span key={node}>{node}</span>)}</div>
    <ol>{diagram.steps.map(([from, to, action], index) =>
      <li key={`${from}-${to}-${index}`}><span>{from}</span><span className={styles.stepArrow}>→ {action} →</span><span>{to}</span></li>
    )}</ol>
  </div>;
}

export default function BalAction({ samples, codeSamples, getLink }) {
  const [active, setActive] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
  const tabs = React.useRef([]);

  React.useEffect(() => {
    const hash = window.location.hash.slice(1);
    const selected = examples.findIndex(example => example.id === hash);
    if (selected >= 0) {
      setActive(selected);
      document.getElementById('ballerina-in-action')?.scrollIntoView();
    }
  }, []);

  const select = index => {
    setActive(index);
    setCopied(false);
  };

  const onTabKeyDown = (event, index) => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % examples.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + examples.length) % examples.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = examples.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      select(next);
      tabs.current[next]?.focus();
    }
  };

  const example = examples[active];
  // A diagram only helps when parties interact or state changes; a pure data mapping gets full-width code.
  const showDiagram = example.diagram.kind !== 'mapping';
  const sourceFile = example.source.split('/').pop();
  return <Col sm={12}><Container>
    <Row className={styles.header}>
      <Col xs={12}>
        <p className={styles.eyebrow}>See the language at work</p>
        <h2 id="ballerina-in-action" className={`section ${styles.heading}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-link-45deg mdButton pe-2" viewBox="0 0 16 16" onClick={e => getLink(e.target, 'ballerina-in-action')} aria-hidden="true">
            <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
            <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
          </svg>Ballerina in action.</h2>
      </Col>
    </Row>
    <p className={styles.tabHint}>Scroll to explore all eight examples.</p>
    <div className={styles.tabList} role="tablist" aria-label="Ballerina examples">
      {examples.map((item, index) => <button key={item.id} ref={node => tabs.current[index] = node}
        id={`action-tab-${item.id}`} role="tab" type="button" aria-selected={active === index}
        aria-controls={`action-panel-${item.id}`} tabIndex={active === index ? 0 : -1}
        onClick={() => select(index)} onKeyDown={event => onTabKeyDown(event, index)}>{item.label}</button>)}
    </div>
    <section id={`action-panel-${example.id}`} role="tabpanel" aria-labelledby={`action-tab-${example.id}`} tabIndex={0} className={styles.panel}>
      <div className={styles.intro}><div><h3>{example.title}</h3><p>{example.description}</p></div>
        <a href={example.link} target="_blank" rel="noopener noreferrer">View full example <span aria-hidden="true">↗</span></a></div>
      <div className={`${styles.mainGrid} ${showDiagram ? '' : styles.fullWidth}`}>
        <div className={styles.codePane}><div className={styles.paneHeader}><span>Ballerina · {sourceFile}</span>
          <CopyToClipboard text={codeSamples[example.id]} onCopy={() => setCopied(true)}>
            <button type="button" aria-label={`Copy ${example.label} code`} className={styles.copyButton}>
              {copied ? <FaCheck aria-hidden="true" /> : <FaRegCopy aria-hidden="true" />}{copied ? 'Copied' : 'Copy code'}
            </button>
          </CopyToClipboard></div>
          <div className="highlight" dangerouslySetInnerHTML={{ __html: samples[example.id] }} />
        </div>
        {showDiagram && <div className={styles.diagramPane}><div className={styles.paneHeader}>Diagram · {example.label.toLowerCase()}</div><Diagram diagram={example.diagram} /></div>}
      </div>
    </section>
  </Container></Col>;
}
