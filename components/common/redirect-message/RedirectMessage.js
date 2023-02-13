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
import Link from 'next/link';
import { Col, Row } from 'react-bootstrap';
import { prefix } from '../../../utils/prefix';

export function PageContent(props) {
  const goBack = () => {
    history.go(-1);
    return false;
  }

  const redirectmsg = <p>The content you are looking for seems to be obsolete. Please go through our new {props.redirectLink} content.</p>

  return (
    <>
    <Row className="pageHeader">
      <Col xs={11}><h1>404</h1></Col>
    </Row>

    <Row className='pageContentRow'>
      <Col xs={12}>
        <p><strong>Page not found. :(</strong></p>
        {
        (props.redirectLink) ?
        redirectmsg
        :null
        }
        <p>You can either <a href="#" onClick={goBack}>go back</a> to the previous page, <a className="getStartLinks" href='https://github.com/ballerina-platform/ballerina-lang/issues/new/choose'>report your issue,</a> or contact the <a href={`https://discord.gg/ballerinalang`}>Ballerina
          Team</a>.</p>
      </Col>
    </Row>
  </>
  );
}

export default function RedirectMessage(props) {
  
  let pageBody = '';
  let redirectLink = '';

  if (global.location.pathname.indexOf('by-example') > 0) {
    let redirectTo = '/learn/by-example/'
    if (global.location.pathname.indexOf('.html') > 0) {
      redirectTo = global.location.pathname.replace('.html', '');
    }
    
    pageBody = <>
      <meta charSet="utf-8" />
      <title>Redirecting&hellip;</title>
      <link rel="canonical" href={redirectTo} />
      <script>location=&quot;{redirectTo}&quot;</script>
      <meta httpEquiv="refresh" content={"0; url=\"" + redirectTo + '"'} />
      <meta name="robots" content="noindex" />
      <h2>Redirecting&hellip;</h2>
      <br/><br/><br/>
      <p><Link href={redirectTo}>Click here if you are not redirected.</Link></p>
    </>
  } else if (global.location.pathname.indexOf('learn') > 0) {
    redirectLink = <Link href='/learn'>Learn</Link>
    pageBody = <PageContent redirectLink = {redirectLink}/>
  } else if (global.location.pathname.indexOf('community') > 0) {
    redirectLink = <Link href='/community'>Community</Link>
    pageBody = <PageContent redirectLink = {redirectLink}/>
  } else if (global.location.pathname.indexOf('downloads') > 0) {
    redirectLink = <Link href='/downloads'>Downloads</Link>
    pageBody = <PageContent redirectLink = {redirectLink}/>
  } else if (global.location.pathname.indexOf('spec') > 0) {
    redirectLink = <Link href='/learn/ballerina-specifications'>Ballerina specifications</Link>
    pageBody = <PageContent redirectLink = {redirectLink}/>
  } else {
    pageBody = <PageContent/>
  }


  return (
    <>

      {pageBody}

    </>
  );
}
