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

import { prefix } from '../../../utils/prefix';
import styles from './Code.module.css';

export default function UseCases(props) {

    const samples = props.samples;

    const github = samples['github-copilot'];
    const network = samples['network-data'];

    return (
        <>
<Col xs={12}>
    <Container>
            <Row>
                <Col xs={12} md={3} lg={3} className={styles.box}>
                    <div className={styles.wrapper}>
                        <h3 id='network-data' className='section'>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                fill="currentColor"
                                className="bi bi-link-45deg mdButton pe-2"
                                viewBox="0 0 16 16"
                                onClick={(e) => props.getLink(e.target, 'network-data')}
                            >
                                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                            </svg>
                            {network.frontmatter.title}
                        </h3>
                        <p>{network.frontmatter.description}</p>

                        {
                            (network.frontmatter.url && network.frontmatter.url !== '') ?
                                <div className={styles.dVersion}>
                                    <a href={network.frontmatter.url} className={styles.cDownload}>
                                        <Image src={`${prefix}/images/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                        View code on GitHub
                                    </a>
                                </div>
                                : null
                        }

                    </div>
                </Col>
                <Col xs={12} md={9} lg={9} className={styles.box}>
                    {
                        (network.code && network.code !== '') ?
                            <div className={styles.codeSnippet}>
                                <div className="highlight" dangerouslySetInnerHTML={{ __html: network.code }} />
                            </div>
                            : null
                    }
                    {
                        (network.frontmatter.image && network.frontmatter.image !== '') ?
                            <img src={`${prefix}/${network.frontmatter.image}`} alt={network.frontmatter.title} />
                            : null
                    }
                </Col>
            </Row>



            <Row>
                <Col xs={12} md={3} lg={3} className={styles.box}>
                    <div className={styles.wrapper}>
                        <h3 id='github-copilot' className='section'>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                fill="currentColor"
                                className="bi bi-link-45deg mdButton pe-2"
                                viewBox="0 0 16 16"
                                onClick={(e) => props.getLink(e.target, 'github-copilot')}
                            >
                                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                            </svg>
                            {github.frontmatter.title}
                        </h3>
                        <p>{github.frontmatter.description}</p>

                        {
                            (github.frontmatter.url && github.frontmatter.url !== '') ?
                                <div className={styles.dVersion}>
                                    <a href={github.frontmatter.url} className={styles.cDownload}>
                                        <Image src={`${prefix}/images/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                        View code on GitHub
                                    </a>
                                </div>
                                : null
                        }

                    </div>
                </Col>
                <Col xs={12} md={9} lg={9} className={styles.box}>
                    {
                        (github.code && github.code !== '') ?
                            <div className={styles.codeSnippet}>
                                <div className="highlight" dangerouslySetInnerHTML={{ __html: github.code }} />
                            </div>
                            : null
                    }
                    {
                        (github.frontmatter.image && github.frontmatter.image !== '') ?
                            <img src={`${prefix}/${github.frontmatter.image}`} alt={github.frontmatter.title} />
                            : null
                    }
                </Col>
            </Row>
            </Container>
            </Col>
        </>
    );
}
