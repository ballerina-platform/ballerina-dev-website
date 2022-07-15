import * as React from 'react';
import { Row, Col, Container} from 'react-bootstrap';
import Image from 'next-image-export-optimizer';

import { prefix } from '../../../utils/prefix';
import styles from './Videos.module.css';

export default function Videos() {

  return (
    <Col sm={12}>
      <Container>
      <Row>
        <Col sm={12}>
          <h2 id="featured-videos">Featured videos</h2>
        </Col>
      </Row>

      <Row>
      <Col sm={12} md={6} className={styles.videoImage}>
        <h3>Why should you start programming with Ballerina?</h3><br/>
        <a id="cMainVideoFrame" className={styles.videoLink} data-toggle="modal" data-src="https://www.youtube.com/embed/NYrKeElltg8" data-target="#iBallerinaVideo">
          <Image src={`${prefix}/images/why-should-start-programming-with-ballerina-video-thumbnail-v2.png`} alt="Ballerina Language Concepts" width={553} height={308}/>
          <a id="cplayvideo" className={styles.videoPlayButton} data-toggle="modal" data-src="https://www.youtube.com/embed/NYrKeElltg8" data-target="#iBallerinaVideo">
              <span></span>
          </a>
        </a>  
      </Col>
      <Col sm={12} md={6} className={styles.videoImage}>
        <h3>Tutorial: Creating a service in Ballerina</h3><br/>
        <a id="cMainVideoFrame" className={styles.videoLink} data-toggle="modal" data-src="https://www.youtube.com/embed/NxyIKoHl3Dw" data-target="#iBallerinaVideo">
          <Image src={`${prefix}/images/tutorial-creating-a-service-in-ballerinathumbnail-v2.png`} alt="Tutorial: Creating a Service in Ballerina" width={551} height={307}/>
          <a id="cplayvideo" className={styles.videoPlayButton} data-toggle="modal" data-src="https://www.youtube.com/embed/NxyIKoHl3Dw" data-target="#iBallerinaVideo">
              <span></span>
          </a>
        </a>
        
      </Col>

    </Row>
    </Container>
    </Col>
  );
}
