import React from 'react';
import { Row, Col, Tabs, Tab, Container } from 'react-bootstrap';
import Head from 'next/head';


import Layout from '../../layouts/LayoutCommunity';
import UpcomingEvents from '../../components/common/upcoming-events/UpcomingEvents';
import PastEvents from '../../components/community/events/past-events/PastEvents';

export default function Events() {

  return (
    <>
      <Head>
        <title>Events</title>

        <meta name="description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />
        <meta name="keywords" content="ballerinalang, integration, microservices, programming language, cloud native, ballerina language" />

        {/* <!--FB--> */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Ballerina - Events" />
        <meta property="og:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />

        {/* <!--LINKED IN  --> */}
        <meta property="og:title" content="Ballerina" />
        <meta property="og:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />

        {/* <!--TWITTER--> */}
        <meta property="twitter:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />
        <meta property="twitter:text:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />

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
    </>
  );
}
