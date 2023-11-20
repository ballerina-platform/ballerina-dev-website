/**
 * Copyright (c) 2023, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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

import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Row, Stack } from 'react-bootstrap';

import Footer from '../components/common/footer/Footer';

export default function Layout({ children }) {
  const TopNav = dynamic(() => import('../components/common/top-nav/TopNav'), { ssr: false });
  const Meta = dynamic(() => import('../components/common/meta/Meta'), { ssr: false });

  return (
    <>
      <Head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta
            name="description"
            content="Ballerina participates in Hacktoberfest 2023"
          />
          <meta name="author" content="WSO2 LLC" />
          <meta
            name="keywords"
            content="ballerina, hackoberfest, integration"
          />
          <link rel="shortcut icon" href="/img/favicon.ico" />
          <title>Ballerina - Hacktoberfest 2023 - The Ballerina programming language</title>

          <script type="text/javascript" crossOrigin="true" src="https://cdn.jsdelivr.net/npm/@docsearch/js@alpha" />

          {/* FB */}
          <meta property="og:type" content="article" />
          <meta property="og:title" content="Ballerina - Hacktoberfest 2023 - The Ballerina programming language" />
          <meta
            property="og:description"
            content="Ballerina participates in Hacktoberfest 2023"
          />
          <meta
            property="og:image"
            itemProp="image"
            content="https://ballerina.io/images/hacktoberfest/ballerina-hacktoberfest-sm-banner.png"
          />

          {/* LINKED IN */}
          <meta property="og:title" content="Ballerina - Hacktoberfest 2023 - The Ballerina programming language" />
          <meta
            property="og:image"
            content="https://ballerina.io/images/hacktoberfest/ballerina-hacktoberfest-sm-banner.png"
          />
          <meta
            property="og:description"
            itemProp="image"
            content="Ballerina participates in Hacktoberfest 2023."
          />

          {/* TWITTER */}
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@ballerinalang" />
          <meta name="twitter:creator" content="@ballerinalang" />
          <meta name="twitter:title" content="Ballerina - Hacktoberfest 2023 - The Ballerina programming language" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            property="twitter:description"
            content="Ballerina participates in Hacktoberfest 2023"
          />
          <meta
            name="twitter:image"
            content="https://ballerina.io/images/hacktoberfest/ballerina-hacktoberfest-sm-banner.png"
          />
          <meta
            property="twitter:text:description"
            content="Ballerina participates in Hacktoberfest 2023"
          />
          <meta
            property="twitter:image"
            content="https://ballerina.io/images/hacktoberfest/ballerina-hacktoberfest-sm-banner.png"
          />
      </Head>
      <Meta />
      <Stack gap={0} className='main-wrapper home'>
        <TopNav launcher='home' />
        <div className='wrap-page-content'>
          <Row className='contentRow'>
            {children}
          </Row>
        </div>

        <Footer />

      </Stack>

    </>
  );
}
