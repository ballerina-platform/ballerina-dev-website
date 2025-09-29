/**
 * Copyright (c) 2025, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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


export default function Layout({ children }) {
  const TopNav = dynamic(() => import('../components/common/top-nav/TopNav'), { ssr: false });
  const Meta = dynamic(() => import('../components/common/meta/Meta'), { ssr: false });
  const Footer = dynamic(() => import('../components/common/footer/Footer'), { ssr: false });

  return (
    <>
      <Head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          
          <meta name="author" content="WSO2 LLC" />
          <meta
            name="keywords"
            content="ballerina, hacktoberfest, integration"
          />
          <link rel="shortcut icon" href="/img/favicon.ico" />
          
          <script type="text/javascript" crossOrigin="true" src="https://cdn.jsdelivr.net/npm/@docsearch/js@alpha" />

          
      </Head>
      <Meta />
      <Stack gap={0} className='main-wrapper home hack2025'>
        <TopNav launcher='hack' />
        <div className='wrap-page-content'>
          <Row className='contentRow'>
            {children}
          </Row>
        </div>

        <Footer year="2024"/>

      </Stack>

    </>
  );
}
