import * as React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import Image from 'next-image-export-optimizer';

import { prefix } from '../../../utils/prefix';
import styles from './Intro.module.css';


export default function Intro() {

  const [hoverBtn, setHoverBtn] = React.useState(false);

  let imagePath = prefix + '/images/main-right-arrow-home.svg';
  let imagePathHover = prefix + '/images/main-right-arrow-home-hover.svg';

  const buttonStyle = {
    backgroundImage: 'url(' + imagePath + ')',
    backgroundSize: '60px 60px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right center',
  };

  const buttonStyleHover = {
    backgroundImage: 'url(' + imagePathHover + ')',
    backgroundSize: '60px 60px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right center',
  };

  return (

    <Col sm={12}>
      <Container>
        <Row className={styles.introTopRow}>
          <Col xs={12} sm={12} md={12} lg={8}>
            <Image className={styles.homePageLogo} src={`${prefix}/images/ballerina-logo-white.svg`} height={61} width={330} alt="Ballerina Logo" />
          </Col>
          <Col xs={12} sm={12} md={12} lg={4}></Col>
        </Row>
        <Row className={styles.introBottomRow}>
          <Col xs={12} sm={12} md={12} lg={8} className={styles.description}>
            <p>Ballerina is an open-source programming language for the cloud that makes it easier to use, combine, and create network services.</p>
          </Col>

          <Col xs={12} sm={12} md={12} lg={4}>
            <a className={styles.homeIntroButton}
              onMouseEnter={() => {
                setHoverBtn(true);
              }}
              onMouseLeave={() => {
                setHoverBtn(false);
              }}
              style={
                (hoverBtn ? buttonStyleHover : buttonStyle)
              }
              target="_blank"
              href={`${prefix}/learn/getting-started-with-ballerina/`}
              rel="noreferrer">
              Get started
              <p>Install Ballerina, set it all up <br />and take it for a spin.</p>
            </a>
            <a className={`${styles.homeIntroButton} ${styles.playButton}`}
              style={buttonStyleHover}
              target="_blank"
              href={`${prefix}/learn/by-example/`}
              rel="noreferrer">
              Examples
              <p>Explore and try Ballerina examples.<br /> &nbsp;</p>
            </a>
          </Col>
        </Row>
      </Container>
    </Col>

  );
}