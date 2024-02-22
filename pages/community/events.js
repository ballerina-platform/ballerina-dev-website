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

import React from 'react';
import { Row, Col, Tabs, Tab, Container } from 'react-bootstrap';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import Layout from '../../layouts/LayoutCommunity';
import EventsData from '../../_data/events.json';

export function getUpcomingEvents(now) {
  const events = EventsData.events;
  let upcomingEvents = false;

  for (var i = 0; i < events.length; i++) {
    if (now < Date.parse(events[i].expire)) {
      upcomingEvents = true;
      break;
    }
  }

  return upcomingEvents;

}

export default function Events() {

  const UpcomingEvents = dynamic(() => import('../../components/common/upcoming-events/UpcomingEvents'), { ssr: false });
  const PastEvents = dynamic(() => import('../../components/community/events/past-events/PastEvents'), { ssr: false });

  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    setNow(new Date());
  }, [])

  const upcomingEvents = getUpcomingEvents(now);

  return (
    <>
      <Head>
        <title>Events - The Ballerina programming language</title>

        <meta name="description" content="Ballerina offers a variety of events that can help you learn more and connect with experts." />
        <meta name="keywords" content="ballerinalang, integration, microservices, programming language, cloud native, ballerina language" />

        {/* <!--FB--> */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Events - The Ballerina programming language" />
        <meta property="og:description" content="Ballerina offers a variety of events that can help you learn more and connect with experts." />

        {/* <!--LINKED IN  --> */}
        <meta property="og:title" content="Events - The Ballerina programming language" />
        <meta property="og:description" content="Ballerina offers a variety of events that can help you learn more and connect with experts." />

        {/* <!--TWITTER--> */}
        <meta name="twitter:title" content="Events - The Ballerina programming language" />
        <meta property="twitter:description" content="Ballerina offers a variety of events that can help you learn more and connect with experts." />
        <meta property="twitter:text:description" content="Ballerina offers a variety of events that can help you learn more and connect with experts." />

      </Head>
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

            <Tabs defaultActiveKey={upcomingEvents && upcomingEvents.length > 0 ? "Upcoming" : "Past" } id="events" className="mb-3 eventsTabs">
              { upcomingEvents && 
              <Tab eventKey="Upcoming" title="Upcoming">
                <UpcomingEvents />
              </Tab>
              }
              <Tab eventKey="Past" title="Past">
                <PastEvents />
              </Tab>
            </Tabs>

          </Container>
        </Col>
      </Layout>
    </>
  );
}
