import * as React from 'react';
import { Row, Col, Container } from 'react-bootstrap';

import UpcomingEvents from '../../common/upcoming-events/UpcomingEvents';

export default function Events() {

  return (
    <Col sm={12}>
      <Container>
        <Row>
          <Col sm={12}>
            <h2 id="events">Events</h2>
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <h3>Upcoming events</h3>
          </Col>
        </Row>

        <UpcomingEvents />
      </Container>
    </Col>

  );
}
