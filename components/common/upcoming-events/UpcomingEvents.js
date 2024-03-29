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

import styles from './UpcomingEvents.module.css';
import Events from '../../../_data/events.json';

export function getUpcomingEvents(now) {
  const events = Events.events;
  let upcomingEvents = [];

  events.map((item) => {
    if (now < Date.parse(item.expire)) {
      upcomingEvents.push(item)
    }
  })

  return upcomingEvents;

}

export default function UpcomingEvents() {

  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    setNow(new Date());
  }, [])

  const upcomingEvents = getUpcomingEvents(now)

  return (
    <>

      {
        (upcomingEvents.length > 0) ?

          upcomingEvents.reverse().map((item, index) => {

            return (

              <Row className={styles.eventRows} key={index}>
                <Col sm={12} md={2} className={styles.eventDateContainer}>
                  <p className={`${styles.eventDate} ${styles.eventDateNum}`}>{item.date}</p>
                  {
                    item.day && item.time ?
                      <p className={styles.eventDate}>{item.day}, {item.time}</p>
                      : item.day && !item.time ?
                        <p className={styles.eventDate}>{item.day}</p>
                        : null
                  }
                  <p className="eventLocation">{item.location}</p>
                </Col>
                <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
                  <a target="_blank" href={item.url} rel="noreferrer">
                    <p className="eventName">{item.eventType}</p>
                  </a>
                  <h5>{item.eventName}</h5>
                  {
                    item.presenters && item.presenters.length > 0 ?
                      <>
                        {
                          item.presenters.map((presenter, index) => {
                            return (
                              <React.Fragment key={index}>
                                <a target="_blank" rel="noreferrer" href={presenter.twitter}>{presenter.name}</a>{presenter.designation ? <> - {presenter.designation}</> : null}
                                {
                                  index + 1 < item.presenters.length ?
                                    <>, </>
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
                  {
                    (item.presenter && item.presenter !== '') ?
                      <><a target="_blank" rel="noreferrer" href={item.presenterTwitter}>{item.presenter}</a>{item.presenterDesignation ? <>, {item.presenterDesignation}</> : null}</>
                      : <>{item.otherInfo}</>
                  }
                </Col>
                <Col sm={12} md={3} className={styles.eventURL}>
                  <a className={styles.eventRegistration} href={item.url} target="_blank" rel="noreferrer">{item.buttonText}</a>
                </Col>
              </Row>
            )
          })
          : <p>No upcoming events for this month.</p>
      }

    </>

  );
}
