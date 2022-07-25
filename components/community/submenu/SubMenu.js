import * as React from 'react';
import { Row, Col, Container } from 'react-bootstrap';


export default function SubMenu() {

  return (
    <Col xs={12}>
      <Container fluid='xxl'>
        <Row>
          <Col xs={12} className='communitySubRow'>
            <ul className="nav navbar-nav secondary-nav">
                 <li className="active"><a href="#subscribe-to-our-newsletter">Newsletter</a></li>
                 <li><a href="#events">Events</a></li>
                 <li><a href="#resources">Resources</a></li>
                 <li><a href="#ballerina-slack-community">Slack</a></li>
                 <li><a href="#monthly-tech-talk">Tech Talk</a></li>
                 <li><a href="#get-involved">Get involved</a></li>
                 <li><a href="#contact-us">Contact us</a></li>
               </ul>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}
