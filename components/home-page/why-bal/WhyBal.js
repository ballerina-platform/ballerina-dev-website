import * as React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import Image from 'next-image-export-optimizer';
import Link from 'next/link';

import { prefix } from '../../../utils/prefix';
import styles from './WhyBal.module.css';

export default function WhyBal() {

  let imagePath = prefix + '/images/toc-bg.svg';

  const linkStyle = {
    backgroundImage: 'url(' + imagePath + ')',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'left center'
  };

  return (
    <Col sm={12}>
      <Container>
        <Row>
          <Col sm={12}>
            <h2 id="why-ballerina">Why Ballerina</h2>
          </Col>
        </Row>
        <Row className={styles.whyBallerinaRow}>
          <Col sm={12} md={4}>
            <div className={styles.whyBallerinaBox}>
              <Image src={`${prefix}/images/home-page/icons/cloud-native.svg`} width={126} height={100} alt="cloud-native" />
              <h3>Cloud native</h3>
              <p>Network primitives in the language make it simpler to write services and run them in the cloud.</p>
              <ul className={styles.inlineLinkList}>
                <li className={styles.greenLinkArrow} style={linkStyle}>
                  <Link href={`/why-ballerina/cloud-native/`}>More info</Link>
                </li>
              </ul>
            </div>
          </Col>


          <Col sm={12} md={4}>
            <div className={styles.whyBallerinaBox}>
              <Image src={`${prefix}/images/home-page/icons/flexible-typing.svg`} width={151} height={100} alt="flexible-typing" />
              <h3>Flexibly typed</h3>
              <p>Structural types with support for openness are used both for static typing within a program and for
                describing service interfaces.</p>
              <ul className={styles.inlineLinkList}>
                <li className={styles.greenLinkArrow} style={linkStyle}>
                  <Link href={`/why-ballerina/flexibly-typed/`}>More info</Link>
                </li>
              </ul>
            </div>
          </Col>

          <Col sm={12} md={4}>
            <div className={styles.whyBallerinaBox}>
              <Image src={`${prefix}/images/home-page/icons/data-transformation.svg`} width={142} height={100} alt="data-transformation" />
              <h3>Data oriented</h3>
              <p>Type-safe, declarative processing of JSON, XML, and tabular data with language-integrated queries.</p>
              <ul className={styles.inlineLinkList}>
                <li className={styles.greenLinkArrow} style={linkStyle}>
                  <Link href={`/why-ballerina/data-oriented/`}>More info</Link>
                </li>
              </ul>
            </div>
          </Col>
        </Row>



        <Row className={styles.whyBallerinaRow}>
          <Col sm={12} md={4}>
            <div className={styles.whyBallerinaBox}>
              <Image src={`${prefix}/images/home-page/icons/graphical.svg`} width={135} height={100} alt="graphical" />
              <h3>Graphical</h3>
              <p>Programs have both a textual syntax and an equivalent graphical form based on sequence diagrams.</p>
              <ul className={styles.inlineLinkList}>
                <li className={styles.greenLinkArrow} style={linkStyle}>
                  <Link href={`/why-ballerina/graphical/`}>More info</Link>
                </li>
              </ul>
            </div>
          </Col>


          <Col sm={12} md={4}>
            <div className={styles.whyBallerinaBox}>
              <Image src={`${prefix}/images/home-page/icons/concurrent.svg`} width={108} height={100} alt="concurrent" />
              <h3>Concurrent</h3>
              <p>Easy and efficient  concurrency with sequence diagrams and language-managed threads without the complexity of asynchronous functions.</p>
              <ul className={styles.inlineLinkList}>
                <li className={styles.greenLinkArrow} style={linkStyle}>
                  <Link href={`/why-ballerina/concurrent/`}>More info</Link>
                </li>
              </ul>
            </div>
          </Col>

          <Col sm={12} md={4}>
            <div className={styles.whyBallerinaBox}>
              <Image src={`${prefix}/images/home-page/icons/reliable-maintainable.svg`} width={100} height={100} alt="reliable-maintainable" />
              <h3>Reliable, maintainable</h3>
              <p>Explicit error handling, static types, and concurrency safety, combined with a  familiar, readable syntax make programs reliable and maintainable.</p>
              <ul className={styles.inlineLinkList}>
                <li className={styles.greenLinkArrow} style={linkStyle}>
                  <Link href={`/why-ballerina/reliable-maintainable/`}>More info</Link>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}
