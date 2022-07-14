import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Container, Row, Stack, Col} from 'react-bootstrap';

import Footer from '../components/common/footer/Footer';

export default function Layout({ children }) {

  const TopNav = dynamic(() => import('../components/common/top-nav/TopNav'), { ssr: false });

  return (
    <>
      <Head>
        {/* Google analytics */}
        <script type="text/javascript" async="" src="https://www.google-analytics.com/analytics.js"/>
        <script async="" src="https://www.googletagmanager.com/gtm.js?id=GTM-PSL2TX4"/>
        <script async="" src="https://www.googletagmanager.com/gtag/js?id=UA-92163714-2"/>

        {/* <script async src="/jquery/jquery.min.js"/> */}
        {/* <script async src="/jquery/jquery.min.js"/>
        <script async src="/shiki/shiki.js" /> */}
        <script type="text/javascript" crossOrigin src="https://cdn.jsdelivr.net/npm/@docsearch/js@alpha"/>
        
      </Head>
      <Stack gap={0} className='main-wrapper'>
        <TopNav launcher='rn'/>
        <Container className='wrap-page-content' fluid>
          <Row>
            {children}
          </Row>
        </Container>

        <Footer/>

      </Stack>
    </>
  );
}