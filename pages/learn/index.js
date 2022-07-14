import React from 'react';
import { Row, Col } from 'react-bootstrap';

import Layout from '../../layouts/LayoutLearn';
import Intro from '../../components/learn/intro/Intro';
import LearnTheLanguage from '../../components/learn/language/Language';
import UseCases from '../../components/learn/use-cases/UseCases';
import Platform from '../../components/learn/platform/Platform';
import New from '../../components/learn/new/New';

export default function Learn() {

  return (
    <Layout>
      <Col sm={12}>

        <Row className="pageHeader pageContentRow">
          <Col xs={12}>
            <h1>Learn Ballerina</h1>
          </Col>
        </Row>

        <Row className="pageContentRow">
          <Col xs={12} md={12}>
            <p>Ballerina is a comprehensive language that is easy to grasp for anyone with prior programming experience. Let&apos;s start learning Ballerina.</p>
          </Col>
        </Row>

        <Intro/>
        <LearnTheLanguage/>
        <UseCases/>
        <Platform/>
        <New/>

      

        {/* <Row className="pageContentRow">
          <Col xs={12} md={12}>
            <h2>What's new</h2>
          </Col>
        </Row>

        <Row className="pageContentRow">
          <Col xs={12} md={12}>
            <p>Ballerina Proposals</p>
            <p>Read and contribute to open proposals</p>
          </Col>
        </Row> */}





      </Col>
    </Layout>

  );
}
