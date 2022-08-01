import Head from 'next/head';
import { Container, Row, Stack, Col} from 'react-bootstrap';

export default function Layout({ children }) {

  return (
    <>
      <Head>
        {/* Google analytics */}
        <script type="text/javascript" async="" src="https://www.google-analytics.com/analytics.js"/>
        <script async="" src="https://www.googletagmanager.com/gtm.js?id=GTM-PSL2TX4"/>
        <script async="" src="https://www.googletagmanager.com/gtag/js?id=UA-92163714-2"/>

        <script type="text/javascript" crossOrigin src="https://cdn.jsdelivr.net/npm/@docsearch/js@alpha"/>
        
      </Head>
      <Stack gap={0} className='main-wrapper spec'>
        <Container className='wrap-page-content'>
          <Row >
            {children}
          </Row>
        </Container>
      </Stack>
    </>
  );
}