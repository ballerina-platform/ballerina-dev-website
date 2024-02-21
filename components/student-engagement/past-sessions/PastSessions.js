/**
 * Copyright (c) 2024, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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
import { Row, Col, Container } from 'react-bootstrap';

import styles from './PastSessions.module.css';
import Events from '../../../_data/university_sessions.json';

export function getPastEvents(now) {
  const events = Events.events;
  let pastEvents = [];

  events.map((item) => {
    if (now > Date.parse(item.expire)) {
      pastEvents.push(item)
    }
  })

  return pastEvents;

}

export default function PastSessions(props) {

  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    setNow(new Date());
  }, [])

  const pastEvents = getPastEvents(now)

  return (
    <Col xs={12}>
      <Container>
        <Row>
          <Col xs={12}>
            <h2 id='past-sessions' className='section'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-link-45deg mdButton pe-2"
                viewBox="0 0 16 16"
                onClick={(e) => props.getLink(e.target, 'past-sessions')}
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
              </svg>
              Past sessions
            </h2>
          </Col>
        </Row>

        <Row style={{ marginBottom: "30px" }}>
          <Col sm={12}>
            <p>Take a peek at some of the programs we hosted in the past, where our team of experts empowered the minds of tomorrow.</p>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            {
              pastEvents.map((item, index) => {

                const eventDate = new Date(item.expire)
                // Deduct 1 day
                eventDate.setDate(eventDate.getDate() - 1);

                return (
                  <Row className={styles.eventRows} key={index}>
                    <Col sm={12} md={2} className={styles.eventDateContainer}>
                      <p className={`${styles.eventDate} ${styles.eventDateNum}`}>{item.date}</p>
                      <p className={styles.eventDate}>{eventDate.toLocaleString('default', { weekday: 'long' })}</p>
                      <p className="eventLocation">{item.location}</p>
                    </Col>
                    <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
                      <a target="_blank" href={item.url} rel="noreferrer">
                        <p className="eventName">{item.eventType}</p>
                      </a>
                      <h5>{item.eventName}</h5>
                      {
                        item.presenters.length > 0 ?
                          <>
                            {
                              item.presenters.map((presenter, index) => {
                                return (
                                  <React.Fragment key={index}>
                                    <a target="_blank" rel="noreferrer" href={presenter.twitter}>{presenter.name}</a>
                                    {presenter.designation ?
                                      <> ({presenter.designation})
                                        {
                                          index + 1 < item.presenters.length ?
                                            <>, </>
                                            : null
                                        }
                                      </>
                                      : null
                                    }
                                  </React.Fragment>
                                )
                              }
                              )
                            }
                          </>
                          : null
                      }
                    </Col>
                    <Col sm={12} md={3} className={styles.eventURL}>
                      {
                        item.url !== "" ?
                          <a className={styles.eventRegistration} href={item.url} target="_blank" rel="noreferrer">{item.buttonText}</a>
                          : null
                      }
                    </Col>
                  </Row>
                )
              })}
          </Col>
        </Row>

      </Container>
    </Col>
  );
}
