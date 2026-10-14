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
    description: 'High-level constructs mean fewer tokens and fewer places for a model to make a mistake.'
  },
  {
    title: 'Fewer silent choices',
    description: 'Retries, timeouts, and serialization come from documented library defaults, not whatever a model picks on a given run.'
  },
  {
    title: 'Easier to review',
    description: 'Types reject malformed data at compile time, and the sequence diagram shows the flow at a glance.'
  },
  {
    title: 'Source you keep',
    description: 'Generate once, then version, test, and diff it like any other code.'
  }
];

export default function AiCoding() {
  return <Col xs={12}>
    <Container>
      <Row className={styles.content}>
        <Col xs={12} lg={6} className={styles.intro}>
          <h2>Writing Ballerina with AI coding agents</h2>
          <p>More integration code is now generated than typed. Ballerina&apos;s design suits that: the model describes the integration at a high level, the compiler and standard library handle the plumbing, and you review the result as code and as a diagram.</p>
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
