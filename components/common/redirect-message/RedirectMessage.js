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
        <p>You can either <a href="#" onClick={goBack}>go back</a> to the previous page, <a className="getStartLinks" href='https://github.com/ballerina-platform/ballerina-lang/issues/new/choose'>report your issue,</a> or contact the <a href={`${prefix}/community/#ballerina-slack-community`}>Ballerina
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
    pageBody = <>
      <meta charset="utf-8" />
      <title>Redirecting&hellip;</title>
      <link rel="canonical" href="/learn/by-example/" />
      <script>location=&quot;/learn/by-example/&quot;</script>
      <meta httpEquiv="refresh" content="0; url=/learn/by-example/" />
      <meta name="robots" content="noindex" />
      <h2>Redirecting&hellip;</h2>
      <br/><br/><br/>
      <p><Link href="/learn/by-example/">Click here if you are not redirected.</Link></p>
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
  } else {
    pageBody = <PageContent/>
  }


  return (
    <>

      {pageBody}

    </>
  );
}
