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
import { Row, Col, Container, Modal } from 'react-bootstrap';
import Image from 'next-image-export-optimizer';

import { prefix } from '../../../utils/prefix';
import styles from './Videos.module.css';

export default function Videos(props) {
  const [showModal, setShowModal] = React.useState(false);
  const [vSource, setVSource] = React.useState('');

  const handleClose = () => { setShowModal(false); }
  const handleShow = (e) => {
    setVSource(e);
    setShowModal(true);
  }

  return (
    <Col sm={12}>
      <Container>
        <Row>
          <Col sm={12} className='sectionTitle'>
            <h2 id="featured-videos" className='section'>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-link-45deg mdButton pe-2"
                viewBox="0 0 16 16"
                onClick={(e) => props.getLink(e.target, 'featured-videos')}
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
              </svg>
              Featured videos
            </h2>
          </Col>
        </Row>

        <Row>
          <Col sm={12} md={6} className={styles.videoImage}>
            <h3>Why should you start programming with Ballerina?</h3><br />
            <a onClick={() => handleShow('https://www.youtube.com/embed/NYrKeElltg8')} id="cMainVideoFrame1" className={styles.videoLink} data-toggle="modal" data-src="https://www.youtube.com/embed/NYrKeElltg8" data-target="#iBallerinaVideo">
              <Image src={`${prefix}/images/why-should-start-programming-with-ballerina-video-thumbnail-v2.png`} alt="Ballerina Language Concepts" width={553} height={308} />
              <a id="cplayvideo" className={styles.videoPlayButton} data-toggle="modal" data-src="https://www.youtube.com/embed/NYrKeElltg8" data-target="#iBallerinaVideo">
                <span></span>
              </a>
            </a>
          </Col>
          <Col sm={12} md={6} className={styles.videoImage}>
            <h3>Tutorial: Creating a service in Ballerina</h3><br />
            <a id="cMainVideoFrame2" onClick={() => handleShow('https://www.youtube.com/embed/NxyIKoHl3Dw')} className={styles.videoLink} data-toggle="modal" data-src="https://www.youtube.com/embed/NxyIKoHl3Dw" data-target="#iBallerinaVideo">
              <Image src={`${prefix}/images/tutorial-creating-a-service-in-ballerinathumbnail-v2.png`} alt="Tutorial: Creating a Service in Ballerina" width={551} height={307} />
              <a id="cplayvideo" className={styles.videoPlayButton} data-toggle="modal" data-src="https://www.youtube.com/embed/NxyIKoHl3Dw" data-target="#iBallerinaVideo">
                <span></span>
              </a>
            </a>

          </Col>

        </Row>

        <Modal show={showModal} onHide={handleClose} className={styles.videoModal}>
          <Modal.Header closeButton className={styles.videoHeader}>
          </Modal.Header>
          <Modal.Body className={styles.videoBody}>
            <iframe className={styles.videoIframe} allow="fullscreen;autoplay;"
              id="video"
              src={vSource + `?autoplay=1`}>
            </iframe>
          </Modal.Body>
        </Modal>

      </Container>
    </Col>
  );
}
