/**
 * Copyright (c) 2026, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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
import { Col, Row } from 'react-bootstrap';
import Head from 'next/head';

import Layout from '../../layouts/LayoutNutcracker';
import Intro from '../../components/nutcracker/intro/Intro';
import About from '../../components/nutcracker/about/About';
import Release from '../../components/nutcracker/release/Release';
import Community from '../../components/nutcracker/community/Community';
import styles from '../../styles/Nutcracker.module.css';

const REPO = 'ballerina-nutcracker/ballerina';

// Static fallback used when the GitHub API cannot be reached at build time.
const FALLBACK_RELEASE = {
  tag: 'v0.5.0',
  name: 'v0.5.0',
  publishedAt: '2026-05-19T14:26:43Z',
  htmlUrl: `https://github.com/${REPO}/releases/tag/v0.5.0`,
  assets: [
    { name: 'ballerina-bal-darwin-arm64-0.5.0.zip', url: `https://github.com/${REPO}/releases/download/v0.5.0/ballerina-bal-darwin-arm64-0.5.0.zip` },
    { name: 'ballerina-bal-darwin-amd64-0.5.0.zip', url: `https://github.com/${REPO}/releases/download/v0.5.0/ballerina-bal-darwin-amd64-0.5.0.zip` },
    { name: 'ballerina-bal-linux-amd64-0.5.0.zip', url: `https://github.com/${REPO}/releases/download/v0.5.0/ballerina-bal-linux-amd64-0.5.0.zip` },
    { name: 'ballerina-bal-linux-arm64-0.5.0.zip', url: `https://github.com/${REPO}/releases/download/v0.5.0/ballerina-bal-linux-arm64-0.5.0.zip` },
    { name: 'ballerina-bal-windows-amd64-0.5.0.zip', url: `https://github.com/${REPO}/releases/download/v0.5.0/ballerina-bal-windows-amd64-0.5.0.zip` },
  ],
};

export default function Nutcracker({ release }) {

  const description = "Ballerina Nutcracker is a fast, lightweight implementation of the Ballerina language, written in Go that provides fast startup time, a small footprint, and instant execution.";

  return (
    <>
      <Head>
        <meta name="description" content={description} />
        <meta name="keywords" content="ballerina, nutcracker, native interpreter, go, ballerina runtime, integration" />
        <title>Ballerina Nutcracker</title>

        {/* FB */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Ballerina Nutcracker" />
        <meta property="og:description" content={description} />
        <meta property="og:image" itemProp="image" content="https://ballerina.io/images/ballerina-generic-social-media-image-2023.png" />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@ballerinalang" />
        <meta name="twitter:creator" content="@ballerinalang" />
        <meta name="twitter:title" content="Ballerina Nutcracker" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://ballerina.io/images/ballerina-generic-social-media-image-2023.png" />
      </Head>

      <Layout>
        <Col sm={12}>
          <Row className={styles.nutcrackerIntro}>
            <Intro repo={REPO} />
          </Row>

          <Row className={styles.nutcrackerAbout}>
            <About />
          </Row>

          <Row className={styles.nutcrackerRelease}>
            <Release release={release} repo={REPO} />
          </Row>

          <Row className={styles.nutcrackerCommunity}>
            <Community repo={REPO} />
          </Row>
        </Col>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  let release = FALLBACK_RELEASE;

  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
      headers: { Accept: 'application/vnd.github+json' },
    });

    if (res.ok) {
      const data = await res.json();
      release = {
        tag: data.tag_name,
        name: data.name || data.tag_name,
        publishedAt: data.published_at,
        htmlUrl: data.html_url,
        assets: (data.assets || []).map((a) => ({
          name: a.name,
          url: a.browser_download_url,
          size: a.size || null,
        })),
      };
    }
  } catch (e) {
    // Keep the fallback release if the API is unreachable during the build.
    console.warn('Nutcracker: could not fetch latest release, using fallback.', e);
  }

  return {
    props: { release },
  };
}
