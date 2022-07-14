import * as React from 'react';
import { Row, Col } from 'react-bootstrap';

import styles from './UpcomingEvents.module.css';

export default function UpcomingEvents() {

  return (
    <>
      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>Aug 11, 2022</p>	
          <p className={styles.eventDate}>Thurs., 3.00 p.m. PDT</p>	
          <p className="eventLocation">Seattle, USA</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://vslive.com/events/redmond-2022/home.aspx" rel="noreferrer">	
            <p className="eventName">Visual Studio LIVE!</p>	
          </a>
          <h5>VH19 Busy Developer&apos;s Guide to Ballerina</h5>		
          <a target="_blank" rel="noreferrer" href="https://twitter.com/tedneward">Ted Neward</a>, Co-founder of Solidify
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://vslive.com/Events/Redmond-2022/Sessions/Thursday/VH19-Busy-Developers-Guide-to-Ballerina.aspx" target="_blank" rel="noreferrer">More info</a>
        </Col>
      </Row>

      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>Sep 7, 2022</p>	
          <p className={styles.eventDate}>Wed., 4.00 p.m. CDT</p>	
          <p className="eventLocation">Austin, TX</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://www.developerweek.com/global/conference/cloud/" rel="noreferrer">	
            <p className="eventName">DeveloperWeek Cloud 2022</p>	
          </a>
          <h5>Ballerina: Programming Language Designed for Cloud-Native Applications</h5>		
          <a target="_blank" rel="noreferrer" href="https://twitter.com/sameerajayasoma">Sameera Jayasoma</a>, Senior Director, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://www.developerweek.com/global/conference/cloud/schedule/" target="_blank" rel="noreferrer">More info</a>
        </Col>
      </Row>
    </>

  );
}
