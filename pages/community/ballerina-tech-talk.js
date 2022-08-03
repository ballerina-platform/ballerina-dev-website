import React from 'react';
import { Row, Col, Modal, Container } from 'react-bootstrap';


import Layout from '../../layouts/LayoutCommunity';
import PastTechTalks from '../../components/community/tech-talk/past-tech-talks/PastTechTalks';


export default function TechTalk() {


  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Layout>
      <Col sm={12}>
        <Container>
          <Row className="pageHeader pageContentRow communityRow">
            <Col xs={12}>
              <h1>Ballerina tech talk</h1>
            </Col>
          </Row>

          <Row className="pageContentRow communityRow">
            <Col xs={12} md={6}>
              <p>
                If you&apos;re looking to meet other Ballerina users and language specialists, this is the place for you. We&apos;re excited to bring a regular Tech Talk, where our team will discuss different technical topics surrounding the world of Ballerina.
              </p>
              <p>
                If you would like to suggest a topic for our next talk or give feedback on tech talks,  <a id="techTalkFormButton" className="formLink" onClick={handleShow}>please fill this form</a>.
              </p>
            </Col>
          </Row>

          <Row className="pageContentRow">
            <Col xs={12}>
              <h2>Past Tech Talks</h2>
            </Col>
          </Row>

          <Row className="pageContentRow">
            <Col xs={12}>
              <PastTechTalks />
            </Col>
          </Row>

          <Modal show={show} onHide={handleClose} id="techTalkForm" className="customModal">
            <Modal.Header closeButton>
              <Modal.Title>Suggest topics or give feedback</Modal.Title>
            </Modal.Header>
            <Modal.Body className="customModalBody">
              <iframe src="https://resources.wso2.com/l/142131/2022-01-05/b3x767" frameBorder="0" className="formEmbedded" />
            </Modal.Body>
          </Modal>


        </Container>

      </Col>
    </Layout>

  );
}
