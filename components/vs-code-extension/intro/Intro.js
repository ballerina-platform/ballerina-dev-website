/**
 * Copyright (c) 2023, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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
import Image from 'next-image-export-optimizer';
import Carousel from 'react-bootstrap/Carousel';

import { prefix } from '../../../utils/prefix';
import styles from './Intro.module.css';



export default function Intro() {

    const [hoverBtn, setHoverBtn] = React.useState(false);

    let linkArrowPath = prefix + '/images/toc-bg.svg';
    let linkArrowHoverPath = prefix + '/images/toc-bg-hover.svg';

    const linkArrow = {
        background: 'url(' + linkArrowPath + ') no-repeat right scroll',
        width: 'fit-content',
        paddingRight: '20px'

    }

    const linkArrowHover = {
        background: 'url(' + linkArrowHoverPath + ') no-repeat scroll',
        width: 'fit-content',
        paddingRight: '20px'
    }

    return (
        <>
        <Col xs={12}>
            <Container>
            <Row className='pageContentRow integration'>
                <Col xs={12} lg={5} className={styles.introText}>
                    <div>
                        <br/>
                        <h1 className={styles.title}>Code and visualize<br/>Ballerina</h1>
                        
                        <br/>
                        <p className={styles.introText3}>
                        The VS Code extension provides robust language support with visualization and design tools for Ballerina.
                        </p>
                        <br/>  
                        
                        <p className={styles.dVersion}>
                    
                        <a href={`https://marketplace.visualstudio.com/items?itemName=WSO2.ballerina`}
                            className={styles.cDownload} target="_blank" rel="noreferrer">
                            Install the extension
                        </a>
                    

                    </p>
                    <p className={styles.dGetBallerinaText}>If you are new to Ballerina,</p>
                        <p>
                        <a href={`https://ballerina.io/downloads/`}
                            className={styles.cVideoBtn} target="_blank" rel="noreferrer"> 
                            <Image src={`${prefix}/images/ballerina-get-started.svg`} width={20} height={20} alt="Try GraphQL services" />
                            Get Ballerina
                            
                        </a>
                        </p>
                    </div>
                    <br/>    
                </Col>
                <Col xs={12} lg={7} className={styles.introImg}>
                

                <Carousel controls={false}>
      <Carousel.Item>
      <img className={styles.SliderImg1} src={`${prefix}/images/vsc-slider-images-5.png`} alt="AI" />
      </Carousel.Item>
      <Carousel.Item>
      <img className={styles.SliderImg1} src={`${prefix}/images/vsc-slider-images-4.png`} alt="AI" />
      </Carousel.Item>
      <Carousel.Item>
      <img className={styles.SliderImg1} src={`${prefix}/images/vsc-slider-images-1.png`} alt="AI" />
      </Carousel.Item>
      <Carousel.Item>
      <img className={styles.SliderImg1} src={`${prefix}/images/vsc-slider-images-3.png`} alt="AI" />
      </Carousel.Item>
    </Carousel>

                </Col>
            </Row>

            </Container>
            </Col>
        </>
    );
}
