import * as React from 'react';
import { Row, Col, Container } from 'react-bootstrap';

import styles from './Contact.module.css';
import { prefix } from '../../../utils/prefix';

export default function Contact() {

  const [hoverBtn, setHoverBtn] = React.useState(false);

  let linkArrowPath = prefix + '/images/toc-bg.svg';
  let linkArrowHoverPath = prefix + '/images/toc-bg-hover.svg';

  const linkArrow = {
    background: 'url(' + linkArrowPath + ') no-repeat scroll right center',
    paddingRight: '25px'
  }

  const linkArrowHover = {
    background: 'url(' + linkArrowHoverPath + ') no-repeat scroll right center',
    paddingRight: '25px'
  }

  return (
    <Col xs={12}>
      <Container>
        <Row>
          <Col xs={12}>
            <h2 id='contact-us'>Contact us</h2>
          </Col>
        </Row>

        <Row>
          <Col sm={12} md={6} lg={6}>
            <p>
              Got any questions? Want to get involved but not sure how? Need help with your first use case? Our team is here to support you. Email us today, and we will be in touch soon.
            </p>
            <a href="mailto:contact@ballerina.io">
              <button type="button" className={styles.sendEmail}>Email contact@ballerina.io</button>
            </a>
          </Col>

          <Col sm={12} md={6} lg={6}>
            &nbsp;
          </Col>
        </Row>
      </Container>
    </Col>
  );
}
