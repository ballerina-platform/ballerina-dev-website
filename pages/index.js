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
import dynamic from 'next/dynamic';
import { Col, Row } from 'react-bootstrap';

import Layout from '../layouts/LayoutHome';
import Intro from '../components/home-page/intro/Intro';
import WhyBal from '../components/home-page/why-bal/WhyBal';
import Videos from '../components/home-page/videos/Videos';
import Events from '../components/home-page/events/Events';
import Integration from '../components/home-page/integration/Integration';
import Users from '../components/home-page/users/Users';
import Articles from '../components/home-page/articles/Articles';
import styles from '../styles/Home.module.css';
import EventsData from '../_data/events.json';

import fs from "fs";
import matter from "gray-matter";
import { getHighlighter } from "shiki";

var traverseFolder = function (dir) {
  var results = [];
  var list = fs.readdirSync(dir);
  list.forEach(function (file) {
    var filex = dir + "/" + file;
    results.push(filex);
  });
  return results;
};

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

export async function getStaticProps() {

  const highlighter = await getHighlighter({
    theme: 'github-light'
  });
  const files = traverseFolder("components/home-page/bal-action/action-bbe");
  var samples = {};
  var codeSamples = {};

  files.forEach(function (item, index) {
    const filename = fs.readFileSync(item, "utf-8");
    const sampleName = item.replace('components/home-page/bal-action/action-bbe/', '').replace('.md', '');
    const { data: frontmatter, content } = matter(filename);
    samples[sampleName] = highlighter.codeToHtml(content.replaceAll('```', ''), { lang: 'ballerina' });
    codeSamples[sampleName] = content.replaceAll('```','');
  });

  return {
    props: {
      samples,
      codeSamples
    },
  };
}


export default function Home({ samples, codeSamples }) {
  const BalAction = dynamic(() => import('../components/home-page/bal-action/BalAction'), { ssr: false });

  const getLink = (element, id) => {
    if (element.tagName.toLowerCase() === "path")
      element = element.parentElement;

    const elementNodeList = document.querySelectorAll(`#${id}`);
    const elementArray = Array.prototype.slice.call(elementNodeList);
    const count = elementArray.indexOf(element.parentElement);

    if (count === 0) {
      location.hash = `#${id}`;
    } else {
      location.hash = `#${id}-${count}`;
    }

    navigator.clipboard.writeText(window.location.href);
    element.parentElement.scrollIntoView();
  };


  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    setNow(new Date());
  }, [])

  const upcomingEvents = getUpcomingEvents(now);


  return (
    <Layout>
      <Col sm={12}>

        <Row className={styles.homeIntro}>
          <Intro />
        </Row>

        <Row className={styles.homeIntegration}>
          <Integration getLink={getLink} />
        </Row>

        <Row className={styles.homeBalAction}>
          <BalAction samples={samples} codeSamples={codeSamples} getLink={getLink} />
        </Row>

        <Row className={styles.homeWhyBal}>
          <WhyBal getLink={getLink} />
        </Row>

        <Row className={styles.homeUsers}>
          <Users getLink={getLink} />
        </Row>

        <Row className={styles.homeArticles}>
          <Articles getLink={getLink} />
        </Row>

        <Row className={styles.homeVideos}>
          <Videos getLink={getLink} />
        </Row>
        {
          upcomingEvents &&
          <Row className={styles.homeEvents}>
            <Events getLink={getLink} />
          </Row>
        }

      </Col>
    </Layout>
  );
}