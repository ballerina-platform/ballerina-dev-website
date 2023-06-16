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
import { Row, Col, Container, Tabs, Tab } from 'react-bootstrap';
import Image from 'next-image-export-optimizer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import { prefix } from '../../../../utils/prefix';
import styles from './Code.module.css';

export default function UseCases(props) {
    const samples = props.samples;

    const opensource = samples['free-and-opensource'];
    const gitHubCoPilot = samples['github-copilot'];
    const rest = samples['rest'];
    const restResources = samples['rest-resources'];
    const restStatusCodes = samples['rest-statuscodes'];
    const restConstraints = samples['rest-constraints'];
    const restHateoas = samples['rest-hateoas'];
    const restBal = samples['rest-bal'];
    const restSpringBoot = samples['rest-springboot'];
    const relationalData = samples['relational-data'];
    const configurability = samples['configurability'];
    const configurabilityBal = samples['configurability-bal'];
    const configurabilityToml = samples['configurability-toml'];
    const consumeRestEndpoints = samples['consume-rest-endpoints']
    const builtForCloud = samples['built-for-cloud']
    const goNative = samples['go-native']
    const workflow = samples['git-based-workflow'];
    const anything = samples['connect-with-anything'];
    const diagram = samples['diagram-when-you-need'];
    const scalability = samples['greater-scalability-flexibility-and-customization'];
    const security = samples['better-security'];
    const community = samples['community-driven-development'];
    const ipaas = samples['trivial-hosting-in-wso2-choreo-ipaas'];

    var isResizing = false;

    const draggableElements = {
        "draggable-circle-1": {
            containerId: "code-container-1",
            leftId: "left-panel-1",
            rightId: "right-panel-1",
        },
        "draggable-circle-2": {
            containerId: "code-container-2",
            leftId: "left-panel-2",
            rightId: "right-panel-2",
        },
        "draggable-circle-3": {
            containerId: "code-container-3",
            leftId: "left-panel-3",
            rightId: "right-panel-3",
        },
        "draggable-circle-4": {
            containerId: "code-container-4",
            leftId: "left-panel-4",
            rightId: "right-panel-4",
        },
        "draggable-circle-5": {
            containerId: "code-container-5",
            leftId: "left-panel-5",
            rightId: "right-panel-5",
        },
        "draggable-circle-6": {
            containerId: "code-container-6",
            leftId: "left-panel-6",
            rightId: "right-panel-6",
        },
        "draggable-circle-7": {
            containerId: "code-container-7",
            leftId: "left-panel-7",
            rightId: "right-panel-7",
        },
        "draggable-circle-8": {
            containerId: "code-container-8",
            leftId: "left-panel-8",
            rightId: "right-panel-8",
        },
        "draggable-circle-9": {
            containerId: "code-container-9",
            leftId: "left-panel-9",
            rightId: "right-panel-9",
        },
        "draggable-circle-10": {
            containerId: "code-container-10",
            leftId: "left-panel-10",
            rightId: "right-panel-10",
        },
        "draggable-circle-11": {
            containerId: "code-container-11",
            leftId: "left-panel-11",
            rightId: "right-panel-11",
        },
        "draggable-circle-12": {
            containerId: "code-container-12",
            leftId: "left-panel-12",
            rightId: "right-panel-12",
        },
        "draggable-circle-13": {
            containerId: "code-container-13",
            leftId: "left-panel-13",
            rightId: "right-panel-13",
        }
    };

    React.useEffect(() => {
        (function () {
            var container = null;
            var left = null;
            var right = null;

            document.addEventListener("mousedown", function (e) {
                if (e.target.classList.contains("draggable")) {
                    isResizing = true;
                    const { containerId, leftId, rightId } = draggableElements[e.target.id];
                    container = document.getElementById(containerId);
                    left = document.getElementById(leftId);
                    right = document.getElementById(rightId);
                }
            });

            document.onmousemove = function (e) {
                // we don't want to do anything if we aren't resizing.
                if (!isResizing) {
                    return;
                }

                var offsetRight = container.clientWidth - (e.clientX - container.offsetLeft);

                //stop resizing if the left panel or right panel is too small
                if (e.clientX - container.offsetLeft <= 50 || offsetRight <= 50) {

                    isResizing = false;
                    return;
                }

                left.style.right = offsetRight + "px";
                right.style.width = offsetRight + "px";
            }

            document.onmouseup = function (e) {
                // stop resizing
                isResizing = false;
            }
        })();
    }, []);

    return (
        <>
            {/* REST with a rest */}
            <Row className="pageContentRow integration code odd">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='rest-with-a-rest' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'rest-with-a-rest')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {rest.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <Row>
                                    <Col xs={12} md={6}>
                                        <div className={styles.wrapper}>
                                            <h3>{restResources.frontmatter.title}</h3>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{restResources.frontmatter.description}</ReactMarkdown>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <div className={styles.wrapper}>
                                            <h3>{restStatusCodes.frontmatter.title}</h3>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{restStatusCodes.frontmatter.description}</ReactMarkdown>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} md={6}>
                                        <div className={styles.wrapper}>
                                            <h3>{restConstraints.frontmatter.title}</h3>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{restConstraints.frontmatter.description}</ReactMarkdown>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <div className={styles.wrapper}>
                                            <h3>{restHateoas.frontmatter.title}</h3>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{restHateoas.frontmatter.description}</ReactMarkdown>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} md={5} lg={5} className={styles.box}>
                                        <div className={styles.wrapper}>

                                            {
                                                (rest.frontmatter.url && rest.frontmatter.url !== '') ?
                                                    <div className={styles.dVersion}>
                                                        <a href={rest.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                            <Image src={`${prefix}/images/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                                            View code on GitHub
                                                        </a>
                                                    </div>
                                                    : null
                                            }

                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={styles.box}>
                                <div id="code-container-1" className={`${styles["code-container"]} d-none d-lg-block`}>
                                    <div id="left-panel-1" className={`${styles["left-panel"]}`}>
                                        <p className={`${styles["title-old"]}`}>{restSpringBoot.frontmatter.title}</p>
                                        <div className={`${styles["code-panel"]}`} dangerouslySetInnerHTML={{ __html: restSpringBoot.code }} />
                                    </div>
                                    <div id="right-panel-1" className={`${styles["right-panel"]}`}>
                                        <div id="drag-1" className={`${styles["drag"]}`}>
                                            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${styles["button-wrap"]} absolute`}>
                                                <circle cx="23" cy="23" r="23" fill="#20b6b0" className='draggable' id="draggable-circle-1"></circle>
                                                <path d="M10.4375 22.5625C10.4375 22.2988 10.5254 22.0645 10.7012 21.8887L16.3262 16.2637C16.6777 15.8828 17.293 15.8828 17.6445 16.2637C18.0254 16.6152 18.0254 17.2305 17.6445 17.582L12.6934 22.5625L17.6445 27.5137C18.0254 27.8652 18.0254 28.4805 17.6445 28.832C17.293 29.2129 16.6777 29.2129 16.3262 28.832L10.7012 23.207C10.5254 23.0312 10.4375 22.7969 10.4375 22.5625Z" fill="white"></path>
                                                <path d="M35.5625 22.5625C35.5625 22.2988 35.4746 22.0645 35.2988 21.8887L29.6738 16.2637C29.3223 15.8828 28.707 15.8828 28.3555 16.2637C27.9746 16.6152 27.9746 17.2305 28.3555 17.582L33.3066 22.5625L28.3555 27.5137C27.9746 27.8652 27.9746 28.4805 28.3555 28.832C28.707 29.2129 29.3223 29.2129 29.6738 28.832L35.2988 23.207C35.4746 23.0312 35.5625 22.7969 35.5625 22.5625Z" fill="white"></path>
                                            </svg>
                                        </div>
                                        <p className={`${styles["title-new"]}`}>{restBal.frontmatter.title}</p>
                                        <div className={`${styles["code-panel"]}`} dangerouslySetInnerHTML={{ __html: restBal.code }} />
                                    </div>
                                </div>

                                {/* mobile view */}
                                <div id="code-tab-1" className={`${styles["code-tab"]} d-block d-lg-none`}>
                                    <Tabs defaultActiveKey="ballerina-code" id="codeTab1" className="mb-3 codeTabs">
                                        <Tab eventKey="java-code" title={restSpringBoot.frontmatter.title}>
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: restSpringBoot.code }} />
                                            </div>
                                        </Tab>
                                        <Tab eventKey="ballerina-code" title={restBal.frontmatter.title}>
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: restBal.code }} />
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* Relational data access made simple */}
            <Row className="pageContentRow integration code">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='relational-data' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'relational-data')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {relationalData.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={6} lg={6} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{relationalData.frontmatter.description}</ReactMarkdown>
                                    {
                                        (relationalData.frontmatter.url && relationalData.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <a href={relationalData.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                    Learn more about relational data access
                                                </a>
                                            </div>
                                            : null
                                    }

                                </div>
                            </Col>
                            <Col xs={12} md={6} lg={6} className={styles.box}>
                                {
                                    (relationalData.code && relationalData.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: relationalData.code }} />
                                        </div>
                                        : null
                                }
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* Configurability */}
            <Row className="pageContentRow integration code odd">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='configurability' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'configurability')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {configurability.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={7} lg={7} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{configurability.frontmatter.description}</ReactMarkdown>
                                    {
                                        (configurability.frontmatter.url && configurability.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <a href={configurability.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                    Learn more about configurability
                                                </a>
                                            </div>
                                            : null
                                    }

                                </div>
                            </Col>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                {
                                    (configurabilityBal.code && configurabilityBal.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: configurabilityBal.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (configurabilityToml.code && configurabilityToml.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: configurabilityToml.code }} />
                                        </div>
                                        : null
                                }
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* Consuming REST endpoints as resources */}
            <Row className="pageContentRow integration code">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='relational-data' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'relational-data')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {consumeRestEndpoints.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={6} lg={6} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{consumeRestEndpoints.frontmatter.description}</ReactMarkdown>
                                </div>
                            </Col>
                            <Col xs={12} md={6} lg={6} className={styles.box}>
                                {
                                    (consumeRestEndpoints.code && consumeRestEndpoints.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: consumeRestEndpoints.code }} />
                                        </div>
                                        : null
                                }
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* diagram */}
            <Row className="pageContentRow integration code odd">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='incredible-data-transformations' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'incredible-data-transformations')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {diagram.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{diagram.frontmatter.description}</ReactMarkdown>
                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={styles.box}>
                                {
                                    (diagram.code && diagram.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: diagram.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (diagram.frontmatter.image && diagram.frontmatter.image !== '') ?
                                        <img src={`${prefix}/${diagram.frontmatter.image}`} alt={diagram.frontmatter.title} />
                                        : null
                                }
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* Built for cloud */}
            <Row className="pageContentRow integration code">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='relational-data' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'relational-data')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {builtForCloud.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={12} lg={12} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{builtForCloud.frontmatter.description}</ReactMarkdown>

                                    {
                                        (builtForCloud.frontmatter.url && builtForCloud.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <a href={builtForCloud.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                    Learn more about code to cloud
                                                </a>
                                            </div>
                                            : null
                                    }

                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* Go native with GraalVM */}
            <Row className="pageContentRow integration code odd">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='relational-data' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'relational-data')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {goNative.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={12} lg={12} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{goNative.frontmatter.description}</ReactMarkdown>

                                    {
                                        (goNative.frontmatter.url && goNative.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <a href={goNative.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                    Learn more about native image build
                                                </a>
                                            </div>
                                            : null
                                    }

                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* anything */}
            <Row className="pageContentRow integration code">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='connect-with-anything' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'connect-with-anything')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {anything.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{anything.frontmatter.description}</ReactMarkdown>

                                    {
                                        (anything.frontmatter.url && anything.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <a href={anything.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                    <Image src={`${prefix}/images/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                                    View code on GitHub
                                                </a>
                                            </div>
                                            : null
                                    }

                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={`${styles.box}`}>
                                {
                                    (anything.code && anything.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: anything.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (anything.frontmatter.image && anything.frontmatter.image !== '') ?
                                        <img src={`${prefix}/${anything.frontmatter.image}`} alt={anything.frontmatter.title} />
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
