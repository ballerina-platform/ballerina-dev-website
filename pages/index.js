/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import dynamic from 'next/dynamic';
import { Col, Row } from 'react-bootstrap';

import Layout from '../layouts/LayoutHome';
import Intro from '../components/home-page/intro/Intro';
import WhyBal from '../components/home-page/why-bal/WhyBal';
import Videos from '../components/home-page/videos/Videos';
import Events from '../components/home-page/events/Events';
import styles from '../styles/Home.module.css'


export default function Home() {
  const BalAction = dynamic(() => import('../components/home-page/bal-action/BalAction'), { ssr: false });

  return (
    <Layout>
      <Col sm={12}>

        <Row className={styles.homeIntro}>
          <Intro />
        </Row>



        <Row className={styles.homeBalAction}>
          <BalAction />
        </Row>



        <Row className={styles.homeWhyBal}>
          <WhyBal />
        </Row>


        <Row className={styles.homeVideos}>
          <Videos />
        </Row>


        <Row className={styles.homeEvents}>
          <Events />
        </Row>

      </Col>
    </Layout>
  );
}
