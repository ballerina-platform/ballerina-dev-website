import React from 'react';
import { Row, Col, Tabs, Tab, Container } from 'react-bootstrap';


import Layout from '../../layouts/LayoutCommunity';
import Articles from '../../components/community/resources/articles/Articles';
import Blogs from '../../components/community/resources/blogs/Blogs';
import Videos from '../../components/community/resources/videos/Videos';
import Other from '../../components/community/resources/other/Other';


export default function Resources() {

  return (
    <Layout>
      <Col sm={12}>
        <Container>
          <Row className="pageHeader pageContentRow communityRow">
            <Col xs={12}>
              <h1>Resources</h1>
            </Col>
          </Row>

          <Row className="pageContentRow communityRow">
            <Col xs={12} md={6}>
              <p>
                We have an extensive list of community-maintained articles, blogs, and videos to get you up to speed with Ballerina.
              </p>
              <p>
                This list is curated to recognize the efforts made by our community and encourage anyone to contribute towards Ballerina content.
              </p>
            </Col>
          </Row>

          <Tabs defaultActiveKey="Articles" id="events" className="mb-3 eventsTabs">
            <Tab eventKey="Articles" title="Articles">
              <Articles />
            </Tab>
            <Tab eventKey="Blog" title="Blog posts">
              <Blogs />
            </Tab>
            <Tab eventKey="Video" title="Videos & podcasts">
              <Videos />
            </Tab>
            <Tab eventKey="Other" title="Other resources">
              <Other />
            </Tab>
          </Tabs>

        </Container>
      </Col>
    </Layout>

  );
}
