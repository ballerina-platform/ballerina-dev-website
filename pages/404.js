import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import Layout from '../layouts/Layout404';
import { prefix } from '../utils/prefix';


export default function FourOHFour() {

  const RedirectMessage = dynamic(() => import('../components/common/redirect-message/RedirectMessage'), { ssr: false });

    const goBack = () => {
        history.go(-1);
        return false;
}
  return (
    <>
      <Head>
        <meta name="description" content="A programming language for the cloud that makes it easier to use, combine, and create network services."/>
        <meta name="keywords" content="ballerinalang, integration, microservices, programming language, cloud native, ballerina language"/>

        <title>404</title>

        {/* <!--FB--> */}
        <meta property="og:type" content="article"/>
        <meta property="og:title" content={`Ballerina - 404`}/>
        <meta property="og:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services."/>

        {/* <!--LINKED IN  --> */}
        <meta property="og:title" content="Ballerina"/>


        {/* <!--TWITTER--> */}
        <meta property="twitter:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services."/>
        <meta property="twitter:text:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services."/>

      </Head>
      <Layout>
        <Col xs={12} sm={10} className="policyContent">
          <Row className="pageHeader">
            <Col xs={11}><h1>404</h1></Col>
          </Row>

          <Row className='pageContentRow'>
            <Col xs={12}>
                <p><strong>Page not found. :(</strong></p>
                <RedirectMessage/>
                <p>You can either <a href="#" onClick={goBack}>go back</a> to the previous page, <a className="getStartLinks" href='https://github.com/ballerina-platform/ballerina-lang/issues/new/choose'>report your issue,</a> or contact the <a href={`${prefix}/community/#ballerina-slack-community`}>Ballerina
      Team</a>.</p>
            </Col>
          </Row>
        </Col>
      </Layout>
    </>
  );
}
