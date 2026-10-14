/**
 * Copyright (c) 2026, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
 * Licensed under the Apache License, Version 2.0.
 */
import * as React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import styles from './AiCoding.module.css';

const benefits = [
  {
    title: 'Less code to generate',
    description: 'Services, clients, and data mappings are language constructs, so a program needs fewer lines than the same logic assembled from libraries.'
  },
  {
    title: 'Compiler feedback',
    description: 'Static types catch mismatched fields and missing error handling at compile time. An agent can read the diagnostics and fix them before the code runs.'
  },
  {
    title: 'Documented defaults',
    description: 'Retries, timeouts, and serialization are configured on standard library clients instead of being written by hand.'
  },
  {
    title: 'Reviewable as diagrams',
    description: 'Generated code renders as a sequence diagram and a flow diagram, so you can check the control flow and external calls without reading every line.'
  }
];

export default function AiCoding() {
  return <Col xs={12}>
    <Container>
      <Row className={styles.content}>
        <Col xs={12} lg={6} className={styles.intro}>
          <h2>Writing Ballerina with AI coding agents</h2>
          <p>AI coding agents can write Ballerina like any other language. A few properties of the language make their output shorter and easier to check.</p>
        </Col>
        <Col xs={12} lg={6} className={styles.benefits}>
          {benefits.map(benefit => <div className={styles.benefit} key={benefit.title}>
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </div>)}
        </Col>
      </Row>
    </Container>
  </Col>;
}
