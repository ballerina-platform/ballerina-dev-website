/**
 * Copyright (c) 2022, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 LLC licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import * as React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { BsCheck } from 'react-icons/bs';

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

        <Row className={styles.introBottomRow}>
          <Col xs={12} sm={12} md={12} lg={8} className={styles.description}>
            <h1>Flexible, Powerful, Beautiful<br />Integrations as Code with Ballerina</h1>

            <p className={styles.desItem}><BsCheck className={styles.check} /><span>Open source, cloud-native programming language optimized for integration</span></p>
            <p className={styles.desItem}><BsCheck className={styles.check} /><span>Batteries included: Rich ecosystem of network protocols, data formats, and connectors</span></p>
            <p className={styles.desItem}><BsCheck className={styles.check} /><span>Edit/view source code textually or graphically as sequence diagrams and flowcharts</span></p>
            <p className={styles.desItem}><BsCheck className={styles.check} /><span>Built-in, easy and efficient concurrency with sequence diagrams and safety primitives</span></p>
            <p className={styles.desItem}><BsCheck className={styles.check} /><span>Developed by <a href="https://wso2.com/" target='_blank' rel="noreferrer" className={styles.introLinks}>WSO2</a> since 2016 and first released in February 2022</span></p>



          </Col>

          <Col xs={12} sm={12} md={12} lg={4} className={styles.btnCol}>
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
              href={`${prefix}/downloads/`}
              rel="noreferrer">
              Download
              {/* <p>Install Ballerina, set it all up <br />and take it for a spin.</p> */}
            </a>
            <a className={`${styles.homeIntroButton} ${styles.playButton}`}
              style={buttonStyleHover}
              target="_blank"
              href={`${prefix}/learn/by-example/`}
              rel="noreferrer">
              Examples
              {/* <p>Explore and try out a series of guided Ballerina examples.<br /> &nbsp;</p> */}
            </a>


            <div className={styles.socialMediaPanel} >
              <a className={styles.socialMediaIcons} href="https://github.com/ballerina-platform/ballerina-lang" target="_blank" rel="noreferrer" title="GitHub">
                <i className="bi bi-github"></i>
              </a>

              <a className={styles.socialMediaIcons} href="https://twitter.com/ballerinalang" target="_blank" rel="noreferrer" title="X">
                <i className="bi bi-twitter-x"></i>
              </a>

              <a className={styles.socialMediaIcons} href="https://discord.gg/ballerinalang" target="_blank" rel="noreferrer" title="Discord">
                <i className="bi bi-discord"></i>
              </a>

              <a className={styles.socialMediaIcons} href="https://stackoverflow.com/questions/tagged/ballerina" target="_blank" rel="noreferrer" title="Stackoverflow">
                <i className="bi bi-stack-overflow"></i>
              </a>

              <a className={styles.socialMediaIcons} href="https://www.youtube.com/c/Ballerinalang" target="_blank" rel="noreferrer" title="YouTube">
                <i className="bi bi-youtube"></i>
              </a>

              {/* <a className={styles.socialMediaIcons} href="https://www.linkedin.com/company/79080790" target="_blank" rel="noreferrer"  title="LinkedIn">
                <Image src={`${prefix}/images/sm-icons/linkedin-white.svg`} width={25} height={25} alt="LinkedIn" />
              </a> */}
            </div>
          </Col>
        </Row>


      </Container>
    </Col>

  );
}
