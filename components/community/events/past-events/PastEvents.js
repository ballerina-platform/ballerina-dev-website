import * as React from 'react';
import { Row, Col } from 'react-bootstrap';

import styles from './PastEvents.module.css';

export default function PastEvents() {

  return (
    <>
      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>June 8, 2022</p>	
          <p className={styles.eventDate}>Wednesday</p>	
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://www.womentech.net/speaker/Anupama/Pathirage/70302" rel="noreferrer">	
            <p className="eventName">Women in Tech Global Conference</p>	
          </a>
          <h5>Ballerina: Cloud-Native Middleware as a Programming Language</h5>		
          <a target="_blank" rel="noreferrer" href="https://twitter.com/anupama_pathira">Anupama Pathirage</a>, Director of Engineering, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://www.womentech.net/speaker/Anupama/Pathirage/70302" target="_blank" rel="noreferrer">More info</a>
        </Col>
      </Row>

      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>May 25, 2022</p>	
          <p className={styles.eventDate}>Wednesday</p>	
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://twitter.com/sfjug" rel="noreferrer">	
            <p className="eventName">Meetup: San Francisco Java User Group</p>	
          </a>
          <h5>Ballerina: A language to Develop, Consume and Combine Network Services</h5>		
          <a target="_blank" rel="noreferrer" href="https://twitter.com/sameerajayasoma">Sameera Jayasoma </a>, Senior Director, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://youtu.be/rL_6LImpwD4" target="_blank" rel="noreferrer">Watch Recording</a>
        </Col>
      </Row>


      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>March 24, 2022</p>	
          <p className={styles.eventDate}>Thursday</p>	
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://twitter.com/KubernetesSL" rel="noreferrer">	
            <p className="eventName">Meetup: Kubernetes Sri Lanka</p>	
          </a>
          <h5>From Code to Cloud with Ballerina</h5>		
          <a target="_blank" rel="noreferrer" href="https://twitter.com/sameerajayasoma">Sameera Jayasoma </a>, Senior Director, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://youtu.be/SJbbIYtxHDk" target="_blank" rel="noreferrer">Watch Recording</a>
        </Col>
      </Row>


      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>March 10, 2022</p>	
          <p className={styles.eventDate}>Thursday</p>	
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://twitter.com/fosssliit" rel="noreferrer">	
            <p className="eventName">Meetup: SLIIT FOSS Community</p>	
          </a>
          <h5>Introduction to Compiler Construction: Ballerina as a Case Study</h5>		
          <a target="_blank" rel="noreferrer" href="https://twitter.com/manurangaperera">Manuranga Perera </a>, Senior Technical Lead, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://www.youtube.com/watch?v=894DMRFQmI0" target="_blank" rel="noreferrer">Watch Recording</a>
        </Col>
      </Row>

      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>March 3, 2022</p>	
          <p className={styles.eventDate}>Thursday</p>	
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://www.meetup.com/Cloud-Native-London/" rel="noreferrer">	
            <p className="eventName">Meetup: Cloud Native London</p>	
          </a>
          <h5>Cloud Native Application Development with Ballerina</h5>		
          <a target="_blank" rel="noreferrer" href="https://twitter.com/sameerajayasoma">Sameera Jayasoma </a>, Senior Director, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://youtu.be/-hcHhQKJF3U?t=6047" target="_blank" rel="noreferrer">Watch Recording</a>
        </Col>
      </Row>

      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>Feb 2, 2022</p>	
          <p className={styles.eventDate}>Wednesday</p>	
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://www.meetup.com/CodeSeekers-Endless-Programming-Languages/" rel="noreferrer">	
            <p className="eventName">Meetup: CodeSeeker&apos;s Endless Programming Languages</p>	
          </a>
          <h5>Ballerina - A Cloud Native Programming Language</h5>		
          <a target="_blank" rel="noreferrer" href="https://twitter.com/HasithaAravinda">Hasitha Aravinda </a>, Associate Director/Architect, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://youtu.be/iWOX688L-D4" target="_blank" rel="noreferrer">Watch Recording</a>
        </Col>
      </Row>


      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>Dec 15, 2021</p>	
          <p className={styles.eventDate}>Wednesday</p>	
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://ossalsjp21.sched.com/event/pehF" rel="noreferrer">	
            <p className="eventName">Open Source Summit Japan</p>	
          </a>
          <h5>Ballerina Swan Lake: The Open Source Cloud-Native Programming Language Revamped</h5>		
          <a target="_blank" rel="noreferrer" href="https://twitter.com/Imesha94">Imesha Sudasingha</a>, Senior Software Engineer, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://youtu.be/QlS_8-yaN68" target="_blank" rel="noreferrer">Watch Recording</a>
        </Col>
      </Row>

      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>Oct 26, 2021</p>	
          <p className={styles.eventDate}>Tuesday</p>	
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://www.meetup.com/SF-Types-Theorems-and-Programming-Languages/events/281320748/" rel="noreferrer">	
            <p className="eventName">Meetup: SF Types, Theorems, and Programming Languages</p>	
          </a>
          <h5>Ballerina - A Cloud-Native Programming Language</h5>		
          <a target="_blank" rel="noreferrer" href="https://twitter.com/james_clark">James Clark </a>, Chief Language Designer, Ballerina
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://youtu.be/_4x5v4rGUOw" target="_blank" rel="noreferrer">Watch Recording</a>
        </Col>
      </Row>


      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>June 15, 2021</p>	
          <p className={styles.eventDate}>Tuesday</p>	
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://stackconf.eu/" rel="noreferrer">	
            <p className="eventName">StackConf</p>	
          </a>
          <h5>Automatic Microservices Observability with Open-Source Programming Language: Ballerina</h5>		
          <a target="_blank" rel="noreferrer" href="https://twitter.com/lafernando">Anjana Fernando</a>, Director - Developer Relations, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://youtu.be/htAwwgt86c0" target="_blank" rel="noreferrer">Watch Recording</a>
        </Col>
      </Row>

      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>April 27, 2021</p>	
          <p className={styles.eventDate}>Tuesday</p>	
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://ballerina.io/community/events/" rel="noreferrer">	
            <p className="eventName">GIDS Live</p>	
          </a>
          <h5>Cloud Native Middleware as a Programming Language</h5>		
          <a target="_blank" rel="noreferrer" href="https://twitter.com/lafernando">Anjana Fernando</a>, Director - Developer Relations, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://youtu.be/NFFbSRnzg3k" target="_blank" rel="noreferrer">Watch Recording</a>
        </Col>
      </Row>

      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>Feb 5, 2021</p>	
          <p className={styles.eventDate}>Wednesday</p>	
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://www.youtube.com/watch?v=0pKOkMRODF0" rel="noreferrer">	
            <p className="eventName">Open Source Summit Japan</p>	
          </a>
          <h5>Ballerina: An Open-Source Cloud-Native Programming Language</h5>		
          <a target="_blank" rel="noreferrer" href="https://twitter.com/lafernando">Anjana Fernando</a>, Director - Developer Relations, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://www.youtube.com/watch?v=0pKOkMRODF0" target="_blank" rel="noreferrer">Watch Recording</a>
        </Col>
      </Row>

      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>Oct 28, 2020</p>	
          <p className={styles.eventDate}>Wednesday</p>	
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://apiworld.co/" rel="noreferrer">	
            <p className="eventName">API World Virtual</p>	
          </a>
          <h5>Code to Kubernetes: Deployment Shouldn&apos;t be an Afterthought</h5>		
          <a target="_blank" rel="noreferrer" href="https://twitter.com/lakwarus">Lakmal Warusawithana</a>, Senior Director Solutions Architecture, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://youtu.be/lkJs588zXxU" target="_blank" rel="noreferrer">Watch Recording</a>
        </Col>
      </Row>

      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>Oct 19, 2020</p>	
          <p className={styles.eventDate}>Monday</p>	
          <p className="eventLocation">Munich, Germany</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://osad-munich.org/en/featured-speakers/code-to-kubernetes-deployment-shouldnt-be-an-afterthought/#" rel="noreferrer">	
            <p className="eventName">Open Source Automation Days</p>	
          </a>
          <h5>Code to Kubernetes: Deployment Shouldn&apos;t be an Afterthought</h5>		
          <a target="_blank" rel="noreferrer" href="https://twitter.com/lakwarus">Lakmal Warusawithana</a>, Senior Director Solutions Architecture, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://osad-munich.org/en/featured-speakers/code-to-kubernetes-deployment-shouldnt-be-an-afterthought/#" target="_blank" rel="noreferrer">More Info</a>
        </Col>
      </Row>

      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>Oct 7, 2020</p>	
          <p className={styles.eventDate}>Wednesday</p>	
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://youtu.be/OJUYOFds-s4" rel="noreferrer">	
            <p className="eventName">Cloud Colombo</p>	
          </a>
          <h5>Ballerina - A Cloud Native Programming Language</h5>		
          <a target="_blank" rel="noreferrer" href="https://twitter.com/lafernando">Anjana Fernando</a>, Director - Developer Relations, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://youtu.be/OJUYOFds-s4" target="_blank" rel="noreferrer">Watch Recording</a>
        </Col>
      </Row>

      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>Sep 29, 2020</p>	
          <p className={styles.eventDate}>Tuesday</p>	
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://emamo.com/event/developerweek-global-cloud-2020/r/speaker/anjana-fernando-1" rel="noreferrer">	
            <p className="eventName">DeveloperWeek Global: Cloud</p>	
          </a>
          <h5>Code to Kubernetes: Languages of Infrastructure</h5>		
          <a target="_blank" rel="noreferrer" href="https://twitter.com/lafernando">Anjana Fernando</a>, Director - Developer Relations, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://www.slideshare.net/BallerinaLang/code-to-kubernetes-languages-of-infrastructure" target="_blank" rel="noreferrer">View Slides</a>
        </Col>
      </Row>

      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>Sep 26, 2020</p>	
          <p className={styles.eventDate}>Saturday</p>	
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://youtu.be/OSaQK7K0fRM" rel="noreferrer">	
            <p className="eventName">Nova Code Camp</p>	
          </a>
          <h5>Let&apos;s Dance Together! Ballerina</h5>		
          <a target="_blank" rel="noreferrer" href="https://twitter.com/vanjikumaran">Vanjikumaran Sivajothy</a>, Senior Lead Solutions Engineer, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://youtu.be/OSaQK7K0fRM" target="_blank" rel="noreferrer">Watch Recordings</a>
        </Col>
      </Row>
    </>

  );
}
