import React from 'react';
import { Col } from 'react-bootstrap';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import Layout from '../layouts/Layout404';


export default function FourOHFour() {

  const RedirectMessage = dynamic(() => import('../components/common/redirect-message/RedirectMessage'), { ssr: false });

  return (
    <>
      <Head>
        <meta name="description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />
        <meta name="keywords" content="ballerinalang, integration, microservices, programming language, cloud native, ballerina language" />

        <title>404</title>

        {/* <!--FB--> */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`Ballerina - 404`} />
        <meta property="og:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />

        {/* <!--LINKED IN  --> */}
        <meta property="og:title" content="Ballerina" />


        {/* <!--TWITTER--> */}
        <meta property="twitter:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />
        <meta property="twitter:text:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />

      </Head>
      <Layout>
        <Col xs={12} sm={10} className="policyContent">
          <RedirectMessage />
        </Col>
      </Layout>
    </>
  );
}
