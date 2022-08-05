import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Row, Stack } from 'react-bootstrap';

import Footer from '../components/common/footer/Footer';

export default function Layout({ children }) {
  const TopNav = dynamic(() => import('../components/common/top-nav/TopNav'), { ssr: false });



  return (
    <>
      <Head>

        <title>Ballerina Home</title>

        <meta name="description" content="Ballerina is an open-source programming language for the cloud that makes it easier to use, combine and create network services."></meta>

        {/* Google analytics */}
        <script type="text/javascript" async="" src="https://www.google-analytics.com/analytics.js" />
        <script async="" src="https://www.googletagmanager.com/gtm.js?id=GTM-PSL2TX4" />
        <script async="" src="https://www.googletagmanager.com/gtag/js?id=UA-92163714-2" />

        <script type="text/javascript" crossorigin src="https://cdn.jsdelivr.net/npm/@docsearch/js@alpha" />

        <meta name="keywords" content="ballerina, ballerinalang, cloud native, microservices, integration, programming language" />

        {/* <!--FB--> */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Ballerina - Ballerina Home" />
        <meta property="og:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />

        {/* <!--LINKED IN  --> */}
        <meta property="og:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />

        {/* <!--TWITTER--> */}
        <meta name="twitter:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />
        <meta name="twitter:text:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />


      </Head>
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