import Head from 'next/head';
import Script from 'next/script';

import { Container, Row, Stack, Col} from 'react-bootstrap';
import TopNav from '../components/topNav';
import LeftNav from '../components/leftNav'
import Footer from '../components/footer';




export default function Layout({ children }) {

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet"/>

        <script async src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script async src="https://unpkg.com/shiki" />
        
      </Head>
      <Stack gap={0} className='main-wrapper'>
        <TopNav/>
        <Container className='wrap-page-content' fluid>
          <Row >
            <Col sm={3} xxl={2} className='leftNav d-none d-sm-block'>
              <LeftNav/>
            </Col>
            <Col xs={12} className='d-block d-sm-none'>Mobile Left Nav</Col>
            {children}
          </Row>
        </Container>

        <Footer/>

      </Stack>


      <Script id="console-styles"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            $( "pre > code" ).each(function() {
              var langClass = $(this).attr('class');
              
              var myArray = langClass.split("-");
              var myLang = myArray[1];

              shiki
              .getHighlighter({
                theme: 'nord',
                langs: ['bash','ballerina', 'toml', 'yaml', 'sh']

              })
              .then(highlighter => {
                var code = highlighter.codeToHtml($(this).html(), { lang: myLang });
                $(code).insertAfter($(this).parent().prev());
                $(this).parent().remove();
              })
            });
          `,
          }}
      />
    </>
  );
}