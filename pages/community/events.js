import React from 'react';
import { Row, Col, Tabs, Tab, Container } from 'react-bootstrap';


import Layout from '../../layouts/LayoutCommunity';
import UpcomingEvents from '../../components/common/upcoming-events/UpcomingEvents';
import PastEvents from '../../components/community/events/past-events/PastEvents';

export default function Events() {

  return (
    <Layout>
      <Col sm={12}>
        <Container>
          <Row className="pageHeader pageContentRow communityRow">
            <Col xs={12}>
              <h1>Events</h1>
            </Col>
          </Row>

          <Row className="pageContentRow communityRow">
            <Col xs={12} md={6}>
              <p>
                Want to connect with other Ballerina users or language experts? Then look no further. We&apos;re excited to offer a variety of events that can help you learn more and connect with experts.
              </p>
            </Col>
          </Row>

          <Tabs defaultActiveKey="Upcoming" id="events" className="mb-3 eventsTabs">
            <Tab eventKey="Upcoming" title="Upcoming">
              <UpcomingEvents />
            </Tab>
            <Tab eventKey="Past" title="Past">
              <PastEvents />
            </Tab>
          </Tabs>

        </Container>
      </Col>
    </Layout>

  );
}
