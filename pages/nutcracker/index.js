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
// Refresh this at each release — it is what visitors see if the API is down or
// rate-limited during a build. `size` matters: without it the download buttons
// render with no file size, unlike the live path.
const FALLBACK_TAG = 'v0.6.0';
const FALLBACK_RELEASE = {
  tag: FALLBACK_TAG,
  name: FALLBACK_TAG,
  publishedAt: '2026-08-05T08:34:08Z',
  htmlUrl: `https://github.com/${REPO}/releases/tag/${FALLBACK_TAG}`,
  assets: [
    ['darwin-amd64', 28501452],
    ['darwin-arm64', 27875033],
    ['linux-amd64', 28364579],
    ['linux-arm64', 27501499],
    ['windows-amd64', 28605559],
  ].map(([platform, size]) => {
    const name = `ballerina-nutcracker-${platform}-${FALLBACK_TAG.slice(1)}.zip`;
    return { name, size, url: `https://github.com/${REPO}/releases/download/${FALLBACK_TAG}/${name}` };
  }),
};

export default function Nutcracker({ release, ogImage }) {

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
        <meta property="og:image" itemProp="image" content={ogImage} />
        <meta property="og:image:alt" content="Ballerina Nutcracker" />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@ballerinalang" />
        <meta name="twitter:creator" content="@ballerinalang" />
        <meta name="twitter:title" content="Ballerina Nutcracker" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content="Ballerina Nutcracker" />
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

  // Don't let an unresponsive API stall the build; fall back instead.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: controller.signal,
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
    // Keep the fallback release if the API is unreachable or times out.
    console.warn('Nutcracker: could not fetch latest release, using fallback.', e);
  } finally {
    clearTimeout(timeout);
  }

  // The card lives at an absolute URL. Preview deployments serve their own copy
  // of the assets, so pointing them at ballerina.io means a newly added image
  // resolves to a 404 there and no card renders. Send previews to themselves and
  // keep production on the canonical domain — on production builds VERCEL_URL is
  // the ephemeral deployment host, not ballerina.io, so gate on VERCEL_ENV.
  // Resolved here rather than in the component so the value is identical on the
  // server and the client (a bare process.env read in the component would be
  // undefined during hydration and mismatch).
  const origin =
    process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://ballerina.io';

  return {
    props: {
      release,
      ogImage: `${origin}/images/nutcracker/ballerina-nutcracker-social-media-image.jpg`,
    },
  };
}
