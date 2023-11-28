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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import { prefix } from '../../../utils/prefix';
import styles from './Code.module.css';

export default function UseCases(props) {

    const samples = props.samples;

    const rest = samples['rest-support'];
    const jsonSupport = samples['json-support'];
    const constraintValidation = samples['constraint-validation'];
    const graphql = samples['graphql'];
    const websocket = samples['websockets'];
    const serverAuth = samples['server-auth'];
    const security = samples['security'];
    const clientAuth = samples['client-auth'];
    const persist = samples['persist'];
    const deployment = samples['deployment'];

    return (
        <>
            {/* rest */}
            <Row className="pageContentRow integration code odd">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='simplify-back-end-development-with-native-rest-features' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'simplify-back-end-development-with-native-rest-features')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {rest.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={6} lg={6} className={styles.box}>
                                <Row>
                                    <div className={styles.wrapper}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{rest.frontmatter.description}</ReactMarkdown>

                                        {
                                            (rest.frontmatter.url && rest.frontmatter.url !== '') ?
                                                <div className={styles.dVersion}>
                                                    <a href={rest.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                        <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                                        View code on GitHub
                                                    </a>
                                                </div>
                                                : null
                                        }

                                    </div>
                                </Row>
                                <Row>
                                    {
                                        (rest.code && rest.code !== '') ?
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: rest.code }} />
                                            </div>
                                            : null
                                    }
                                    {
                                        (rest.frontmatter.image && rest.frontmatter.image !== '') ?
                                            <img src={`${prefix}/${rest.frontmatter.image}`} alt={rest.frontmatter.title} />
                                            : null
                                    }
                                </Row>
                            </Col>
                            <Col xs={12} md={6} lg={6} className={styles.box}>
                                <img src={`${prefix}/images/usecases/integration/bff/rest.gif`} style={{ height: "auto", borderRadius: "0.7rem" }} alt="Rest-API" />

                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* jsonSupport */}
            <Row className="pageContentRow integration code">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='streamline-back-end-data-handling' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'streamline-back-end-data-handling')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {jsonSupport.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={6} lg={6} className={styles.box}>
                                <Row>
                                    <div className={styles.wrapper}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{jsonSupport.frontmatter.description}</ReactMarkdown>

                                        {
                                            (jsonSupport.frontmatter.url && jsonSupport.frontmatter.url !== '') ?
                                                <div className={styles.dVersion}>
                                                    <a href={jsonSupport.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                        <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                                        View code on GitHub
                                                    </a>
                                                </div>
                                                : null
                                        }

                                    </div>
                                </Row>
                                <Row>
                                    {
                                        (jsonSupport.code && jsonSupport.code !== '') ?
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: jsonSupport.code }} />
                                            </div>
                                            : null
                                    }
                                    {
                                        (jsonSupport.frontmatter.image && jsonSupport.frontmatter.image !== '') ?
                                            <img src={`${prefix}/${jsonSupport.frontmatter.image}`} alt={jsonSupport.frontmatter.title} />
                                            : null
                                    }
                                </Row>
                            </Col>
                            <Col xs={12} md={6} lg={6} className={styles.box}>
                                <img src={`${prefix}/images/usecases/integration/bff/multi_part.gif`} style={{ height: "auto", borderRadius: "0.7rem" }} alt="Advanced Payload Validation" />
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* constraint validation */}
            <Row className="pageContentRow integration code odd">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='validate-payload-constraints-in-web-back-ends' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'validate-payload-constraints-in-web-back-ends')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {constraintValidation.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={6} lg={6} className={styles.box}>
                                <Row>
                                    <div className={styles.wrapper}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{constraintValidation.frontmatter.description}</ReactMarkdown>

                                        {
                                            (constraintValidation.frontmatter.url && constraintValidation.frontmatter.url !== '') ?
                                                <div className={styles.dVersion}>
                                                    <a href={constraintValidation.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                        <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                                        View code on GitHub
                                                    </a>
                                                </div>
                                                : null
                                        }

                                    </div>
                                </Row>
                                <Row>
                                    {
                                        (constraintValidation.code && constraintValidation.code !== '') ?
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: constraintValidation.code }} />
                                            </div>
                                            : null
                                    }
                                    {
                                        (constraintValidation.frontmatter.image && constraintValidation.frontmatter.image !== '') ?
                                            <img src={`${prefix}/${constraintValidation.frontmatter.image}`} alt={constraintValidation.frontmatter.title} />
                                            : null
                                    }
                                </Row>
                            </Col>
                            <Col xs={12} md={6} lg={6} className={styles.box}>
                                <img src={`${prefix}/images/usecases/integration/bff/constraint_validation.gif`} style={{ height: "auto", borderRadius: "0.7rem" }} alt="Advanced Payload Validation" />
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* graphql */}
            <Row className="pageContentRow integration code">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='efficiently-expose-complex-data-with-graphql' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'efficiently-expose-complex-data-with-graphql')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {graphql.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={6} lg={6} className={styles.box}>
                                <Row>
                                    <div className={styles.wrapper}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{graphql.frontmatter.description}</ReactMarkdown>

                                        {
                                            (graphql.frontmatter.url && graphql.frontmatter.url !== '') ?
                                                <div className={styles.dVersion}>
                                                    <a href={graphql.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                        <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                                        View code on GitHub
                                                    </a>
                                                </div>
                                                : null
                                        }

                                    </div>
                                </Row>
                                <Row>
                                    {
                                        (graphql.code && graphql.code !== '') ?
                                            <div className={styles.codeSnippet}>
                                                <div style={{ height: "auto" }} className="highlight" dangerouslySetInnerHTML={{ __html: graphql.code }} />
                                            </div>
                                            : null
                                    }
                                    {
                                        (graphql.frontmatter.image && graphql.frontmatter.image !== '') ?
                                            <img src={`${prefix}/${graphql.frontmatter.image}`} alt={graphql.frontmatter.title} />
                                            : null
                                    }
                                </Row>

                            </Col>
                            <Col xs={12} md={6} lg={6} className={styles.box}>
                                <img src={`${prefix}/images/usecases/integration/bff/graphql.gif`} alt="GraphQl" />
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* websocket */}
            <Row className="pageContentRow integration code odd">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='expose-real-time-data-to-front-ends-via-websockets' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'expose-real-time-data-to-front-ends-via-websockets')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {websocket.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={6} lg={6} className={styles.box}>
                                <Row>
                                    <div className={styles.wrapper}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{websocket.frontmatter.description}</ReactMarkdown>

                                        {
                                            (websocket.frontmatter.url && websocket.frontmatter.url !== '') ?
                                                <div className={styles.dVersion}>
                                                    <a href={websocket.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                        <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                                        View code on GitHub
                                                    </a>
                                                </div>
                                                : null
                                        }

                                    </div>
                                </Row>
                                <Row>
                                    {
                                        (websocket.code && websocket.code !== '') ?
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: websocket.code }} />
                                            </div>
                                            : null
                                    }
                                    {
                                        (websocket.frontmatter.image && websocket.frontmatter.image !== '') ?
                                            <img src={`${prefix}/${websocket.frontmatter.image}`} alt={websocket.frontmatter.title} />
                                            : null
                                    }
                                </Row>
                            </Col>
                            <Col xs={12} md={6} lg={6} className={styles.box}>
                                <img src={`${prefix}/images/usecases/integration/bff/websocket.gif`} style={{ height: "auto", borderRadius: "1.2rem" }} alt="Websockets" />

                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* server auth */}
            <Row className="pageContentRow integration code">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='simplify-user-authentications-and-authorizations' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'simplify-user-authentications-and-authorizations')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {serverAuth.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={6} lg={6} className={styles.box}>
                                <Row>
                                    <div className={styles.wrapper}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{serverAuth.frontmatter.description}</ReactMarkdown>

                                        {
                                            (serverAuth.frontmatter.url && serverAuth.frontmatter.url !== '') ?
                                                <div className={styles.dVersion}>
                                                    <a href={serverAuth.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                        <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                                        View code on GitHub
                                                    </a>
                                                </div>
                                                : null
                                        }

                                    </div>
                                </Row>
                                <Row>
                                    {
                                        (serverAuth.code && serverAuth.code !== '') ?
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: serverAuth.code }} />
                                            </div>
                                            : null
                                    }
                                    {
                                        (serverAuth.frontmatter.image && serverAuth.frontmatter.image !== '') ?
                                            <img src={`${prefix}/${serverAuth.frontmatter.image}`} alt={serverAuth.frontmatter.title} />
                                            : null
                                    }
                                </Row>
                            </Col>
                            <Col xs={12} md={6} lg={6} className={styles.box}>
                                <img src={`${prefix}/images/usecases/integration/bff/react_jwt.gif`} style={{ borderRadius: "1.2rem" }} alt="Auth & AuthZ" />

                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* security */}
            <Row className="pageContentRow integration code odd">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='comprehensive-security-for-web-back-ends' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'comprehensive-security-for-web-back-ends')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {security.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={6} lg={6} className={styles.box}>
                                <Row>
                                    <div className={styles.wrapper}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{security.frontmatter.description}</ReactMarkdown>

                                        {
                                            (security.frontmatter.url && security.frontmatter.url !== '') ?
                                                <div className={styles.dVersion}>
                                                    <a href={security.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                        <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                                        View code on GitHub
                                                    </a>
                                                </div>
                                                : null
                                        }

                                    </div>
                                </Row>
                                {
                                    (security.code && security.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: security.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (security.frontmatter.image && security.frontmatter.image !== '') ?
                                        <img src={`${prefix}/${security.frontmatter.image}`} alt={security.frontmatter.title} />
                                        : null
                                }
                                <Row>
                                </Row>
                            </Col>
                            <Col xs={12} md={6} lg={6} className={styles.box}>
                                <img src={`${prefix}/images/usecases/integration/bff/comprehensive-security.gif`} style={{ height: "auto", borderRadius: "1.2rem" }} alt="Comprehensive-Security" />
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* internal/external services */}
            <Row className="pageContentRow integration code">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='securely-interact-with-internal-external-services' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'securely-interact-with-internal-external-services')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {clientAuth.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={6} lg={6} className={styles.box}>
                                <Row>
                                    <div className={styles.wrapper}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{clientAuth.frontmatter.description}</ReactMarkdown>

                                        {
                                            (clientAuth.frontmatter.url && clientAuth.frontmatter.url !== '') ?
                                                <div className={styles.dVersion}>
                                                    <a href={clientAuth.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                        <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                                        View code on GitHub
                                                    </a>
                                                </div>
                                                : null
                                        }

                                    </div>
                                </Row>
                                <Row>
                                    {
                                        (clientAuth.code && clientAuth.code !== '') ?
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: clientAuth.code }} />
                                            </div>
                                            : null
                                    }
                                    {
                                        (clientAuth.frontmatter.image && clientAuth.frontmatter.image !== '') ?
                                            <img src={`${prefix}/${clientAuth.frontmatter.image}`} alt={clientAuth.frontmatter.title} />
                                            : null
                                    }
                                </Row>
                            </Col>
                            <Col xs={12} md={6} lg={6} className={styles.box}>
                                <img src={`${prefix}/images/usecases/integration/bff/microservices.gif`} style={{ height: "auto", borderRadius: "1.2rem" }} alt="Internal/External services" />
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* persist */}
            <Row className="pageContentRow integration code odd">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='automate-data-access-with-ballerina' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'automate-data-access-with-ballerina')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {persist.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={6} lg={6} className={styles.box}>
                                <Row>
                                    <div className={styles.wrapper}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{persist.frontmatter.description}</ReactMarkdown>

                                        {
                                            <div className={styles.dVersion}>
                                                <a href={persist.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                    <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                                    View code on GitHub
                                                </a>
                                            </div>
                                        }

                                    </div>
                                </Row>
                                <Row>
                                {
                                    (persist.code && persist.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: persist.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (persist.frontmatter.image && persist.frontmatter.image !== '') ?
                                        <img src={`${prefix}/${persist.frontmatter.image}`} alt={persist.frontmatter.title} className={styles.doNotFill} width='60%' />
                                        : null
                                }
                                </Row>
                            </Col>
                            <Col xs={12} md={6} lg={6} className={`${styles.box}`}><img src={`${prefix}/images/usecases/integration/bff/persists.gif`} style={{ height: "auto", borderRadius: "1.2rem" }} alt="Persist Support" />
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* deployment */}
            <Row className="pageContentRow integration code">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='develop-flexible-scalable-back-ends' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'develop-flexible-scalable-back-ends')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {deployment.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{deployment.frontmatter.description}</ReactMarkdown>

                                    {
                                        (deployment.frontmatter.url && deployment.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <a href={deployment.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                    Get started with Choreo IDevP for free
                                                </a>
                                            </div>
                                            : null
                                    }

                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={`${styles.box} ${styles.ipaas}`}>
                                {
                                    (deployment.code && deployment.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: deployment.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (deployment.frontmatter.image && deployment.frontmatter.image !== '') ?
                                        <img src={`${prefix}/${deployment.frontmatter.image}`} alt={deployment.frontmatter.title} className={styles.doNotFill} width='60%' />
                                        : null
                                }
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>


        </>
    );
}
