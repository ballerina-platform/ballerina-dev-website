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

import { Html, Head, Main, NextScript } from 'next/document';

import { prefix } from '../utils/prefix';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="author" content="WSO2 LLC"/>
        
        <link rel="shortcut icon" href={`${prefix}/images/favicon.ico`}></link>
        <link rel="stylesheet" href="https://ballerina.io/css/roboto.css" />

        {/* Algolia */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css" />
        <link rel="stylesheet" href={`${prefix}/css/ballerina-search-button.css`} />
        <link rel="stylesheet" href={`${prefix}/css/ballerina-search-modal.css`} />
        <link rel="stylesheet" href={`${prefix}/css/ballerina-search-variables.css`} />
        <link rel="stylesheet" href={`${prefix}/css/ballerina-search-style.css`} />
      </Head>
      <body>
        {/*  Google Tag Manager (noscript)  */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PSL2TX4"
          height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
        </noscript>
        {/*  End Google Tag Manager (noscript)  */}
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}