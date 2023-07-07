/**
 * Copyright (c) 2022, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 LLC licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import * as React from 'react';
import { Row, Col } from 'react-bootstrap';

import styles from './PastTechTalks.module.css';

export default function PastTechTalks() {

  return (
    <>
      
      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>June 7, 2023</p>
          <p className={styles.eventDate}>Wednesday</p>
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://youtu.be/qflhlNQg18c" rel="noreferrer">
            <p className="eventName">Monthly Tech Talk</p>
          </a>
          <h5>Unleash the Power of AI with Ballerina</h5>
          <a target="_blank" rel="noreferrer" href="https://twitter.com/JayaniHewa">Jayani Hewavitharana</a>, Ballerina AI Team<br />
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://youtu.be/qflhlNQg18c" target="_blank" rel="noreferrer">Watch Tech Talk</a>
        </Col>
      </Row>
    
      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>May 4, 2023</p>
          <p className={styles.eventDate}>Thursday</p>
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://youtu.be/jmSy_n6VUPk" rel="noreferrer">
            <p className="eventName">Monthly Tech Talk</p>
          </a>
          <h5>Bend it like Ballerina: Unveiling our Regex Support</h5>
          <a target="_blank" rel="noreferrer" href="https://twitter.com/Sasindu3625">Sasindu Alahakoon</a>, Software Engineer, WSO2<br />
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://youtu.be/jmSy_n6VUPk" target="_blank" rel="noreferrer">Watch Tech Talk</a>
        </Col>
      </Row>
    
      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>Feb 22, 2022</p>
          <p className={styles.eventDate}>Tuesday</p>
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://youtu.be/sZmRCRgVnuI?t=35" rel="noreferrer">
            <p className="eventName">Monthly Tech Talk</p>
          </a>
          <h5>Ballerina Programming with VS Code</h5>
          <a target="_blank" rel="noreferrer" href="https://twitter.com/Imesha94">Imesha Sudasingha</a>, Senior Software Engineer, WSO2<br />
          <a target="_blank" rel="noreferrer" href="https://twitter.com/Nadeeshaan">Nadeeshaan Gunasinghe</a>, Technical Lead, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://youtu.be/sZmRCRgVnuI?t=35" target="_blank" rel="noreferrer">Watch Tech Talk</a>
        </Col>
      </Row>


      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>Jan 25, 2022</p>
          <p className={styles.eventDate}>Tuesday</p>
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://youtu.be/cJwstQ8yynk" rel="noreferrer">
            <p className="eventName">Monthly Tech Talk</p>
          </a>
          <h5>Ballerina OpenAPI Support</h5>
          <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/joseph-fonseka-04b538a/">Joseph Fonseka</a>, Director - Ballerina Team, WSO2<br />
          <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/sumudu-nissanka/">Sumudu Nissanka</a>, Senior Software Engineer, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://youtu.be/cJwstQ8yynk" target="_blank" rel="noreferrer">Watch Tech Talk</a>
        </Col>
      </Row>

      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>Nov 30, 2021</p>
          <p className={styles.eventDate}>Tuesday</p>
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://www.youtube.com/watch?v=ga_cyzIXW38" rel="noreferrer">
            <p className="eventName">Monthly Tech Talk</p>
          </a>
          <h5>Building Real-time Systems with WebSub</h5>
          <a target="_blank" rel="noreferrer" href="https://twitter.com/Ayesh363">Ayesh Almeida</a>, Senior Software Engineer - Integration, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://www.youtube.com/watch?v=ga_cyzIXW38" target="_blank" rel="noreferrer">Watch Tech Talk</a>
        </Col>
      </Row>


      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>Oct 26, 2021</p>
          <p className={styles.eventDate}>Tuesday</p>
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://www.youtube.com/watch?v=8Z-i0VxTvK4&t=6s" rel="noreferrer">
            <p className="eventName">Monthly Tech Talk</p>
          </a>
          <h5>Managing Dependencies in Ballerina</h5>
          <a target="_blank" rel="noreferrer" href="https://twitter.com/sameerajayasoma"> Sameera Jayasoma</a>, Senior Director, Platform Architecture, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://www.youtube.com/watch?v=8Z-i0VxTvK4&t=6s" target="_blank" rel="noreferrer">Watch Tech Talk</a>
        </Col>
      </Row>

      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>Sep 28, 2021</p>
          <p className={styles.eventDate}>Tuesday</p>
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://www.youtube.com/watch?v=81XCTewSo8I&t=5s" rel="noreferrer">
            <p className="eventName">Monthly Tech Talk</p>
          </a>
          <h5>Using Language Integrated Queries</h5>
          <a target="_blank" rel="noreferrer" href="https://twitter.com/pcnfernando"> Chiran Fernando</a>, Associate Technical Lead, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://www.youtube.com/watch?v=81XCTewSo8I&t=5s" target="_blank" rel="noreferrer">Watch Tech Talk</a>
        </Col>
      </Row>


      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>Aug 31, 2021</p>
          <p className={styles.eventDate}>Tuesday</p>
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://www.youtube.com/watch?v=clmGc2oZpYE&t=2311s" rel="noreferrer">
            <p className="eventName">Monthly Tech Talk</p>
          </a>
          <h5>GraphQL and Ballerina: A Match Made in Heaven</h5>
          <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/chiranfernando/"> Dimuthu Madushan</a>, Software Engineer, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://www.youtube.com/watch?v=clmGc2oZpYE&t=2311s" target="_blank" rel="noreferrer">Watch Tech Talk</a>
        </Col>
      </Row>


      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>July 27, 2021</p>
          <p className={styles.eventDate}>Tuesday</p>
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://youtu.be/l5KWZwHZdSA" rel="noreferrer">
            <p className="eventName">Monthly Tech Talk</p>
          </a>
          <h5>Changes in the HTTP Package in Ballerina Swan Lake</h5>
          <a target="_blank" rel="noreferrer" href="https://twitter.com/chamil321"> Chamil Elladeniya</a>, Associate Technical Lead, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://youtu.be/l5KWZwHZdSA" target="_blank" rel="noreferrer">Watch Tech Talk</a>
        </Col>
      </Row>


      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>June 29, 2021</p>
          <p className={styles.eventDate}>Tuesday</p>
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://youtu.be/9ZqDZ3TgnDU" rel="noreferrer">
            <p className="eventName">Monthly Tech Talk</p>
          </a>
          <h5>Ballerina Swan Lake Release</h5>
          <a target="_blank" rel="noreferrer" href="https://twitter.com/sameerajayasoma"> Sameera Jayasoma</a>, Senior Director, Platform Architecture, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://youtu.be/9ZqDZ3TgnDU" target="_blank" rel="noreferrer">Watch Tech Talk</a>
        </Col>
      </Row>



      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>March 30, 2021</p>
          <p className={styles.eventDate}>Tuesday</p>
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://youtu.be/dYito-DW6ZA" rel="noreferrer">
            <p className="eventName">Monthly Tech Talk</p>
          </a>
          <h5>Ballerina Shell and Debugging Tools</h5>
          <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/nipunaranasinghe/"> Nipuna Ranasinghe</a>, Associate Technical Lead, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://youtu.be/dYito-DW6ZA" target="_blank" rel="noreferrer">Watch Tech Talk</a>
        </Col>
      </Row>


      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>Feb 23, 2021</p>
          <p className={styles.eventDate}>Tuesday</p>
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://youtu.be/hKBjatIFxyw" rel="noreferrer">
            <p className="eventName">Monthly Tech Talk</p>
          </a>
          <h5>Services and Network Communication</h5>
          <a target="_blank" rel="noreferrer" href="https://twitter.com/lafernando">Anjana Fernando</a>, Director - Developer Relations, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://youtu.be/hKBjatIFxyw" target="_blank" rel="noreferrer">Watch Tech Talk</a>
        </Col>
      </Row>


      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>Jan 26, 2021</p>
          <p className={styles.eventDate}>Tuesday</p>
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://youtu.be/36U5RoTdYhc" rel="noreferrer">
            <p className="eventName">Monthly Tech Talk</p>
          </a>
          <h5>Code to Cloud with Ballerina</h5>
          <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/anuruddha-liyanarachchi-6b259652/">Anuruddha Liyanarachchi</a>, Associate Technical Lead, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://youtu.be/36U5RoTdYhc" target="_blank" rel="noreferrer">Watch Tech Talk</a>
        </Col>
      </Row>



      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>Dec 8, 2020</p>
          <p className={styles.eventDate}>Tuesday</p>
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://youtu.be/4EINEJAtAg4" rel="noreferrer">
            <p className="eventName">Monthly Tech Talk</p>
          </a>
          <h5>Java Interoperability in Ballerina</h5>
          <a target="_blank" rel="noreferrer" href="https://twitter.com/IrushiL">Irushi Liyanage</a>, Senior Software Engineer, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://youtu.be/4EINEJAtAg4" target="_blank" rel="noreferrer">Watch Tech Talk</a>
        </Col>
      </Row>


      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>Nov 10, 2020</p>
          <p className={styles.eventDate}>Tuesday</p>
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://www.youtube.com/watch?v=lLqvaLtC3m0" rel="noreferrer">
            <p className="eventName">Monthly Tech Talk</p>
          </a>
          <h5>Data Access in Ballerina</h5>
          <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/niveathika/">Niveathika Rajendran</a>, Associate Technical Lead, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://www.youtube.com/watch?v=lLqvaLtC3m0" target="_blank" rel="noreferrer">Watch Tech Talk</a>
        </Col>
      </Row>



      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>Oct 13, 2020</p>
          <p className={styles.eventDate}>Tuesday</p>
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://www.youtube.com/watch?v=12gosblVlhY" rel="noreferrer">
            <p className="eventName">Monthly Tech Talk</p>
          </a>
          <h5>Serverless in Ballerina</h5>
          <a target="_blank" rel="noreferrer" href="https://twitter.com/lafernando">Anjana Fernando</a>, Director - Developer Relations, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://www.youtube.com/watch?v=12gosblVlhY" target="_blank" rel="noreferrer">Watch Tech Talk</a>
        </Col>
      </Row>


      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>Sep 8, 2020</p>
          <p className={styles.eventDate}>Tuesday</p>
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://www.youtube.com/watch?v=ADZPZtXK5e8" rel="noreferrer">
            <p className="eventName">Monthly Tech Talk</p>
          </a>
          <h5>gRPC in Ballerina</h5>
          <a target="_blank" rel="noreferrer" href="https://twitter.com/BuddhiWK">Buddhi Kothalawala</a>, Senior Software Engineer, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://www.youtube.com/watch?v=ADZPZtXK5e8" target="_blank" rel="noreferrer">Watch Tech Talk</a>
        </Col>
      </Row>


    </>

  );
}
