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

    // Ballerina is GraphQL - GraphQL is Ballerina
    // Each code snippet in a separate md file.
    // The md file with Ballerina code has the frontmatter, "title" and "description"
    const similarities = samples['similarities'];
    const similaritiesObjectTypeBallerina = samples['similarities-object-types-ballerina'];
    const similaritiesObjectTypeGraphQL = samples['similarities-object-types-graphql'];
    const similaritiesNullabilityBallerina = samples['similarities-nullability-ballerina'];
    const similaritiesNullabilityGraphQL = samples['similarities-nullability-graphql'];
    const similaritiesUnionTypesBallerina = samples['similarities-union-types-ballerina'];
    const similaritiesUnionTypesGraphQL = samples['similarities-union-types-graphql'];
    const similaritiesDefaultValuesBallerina = samples['similarities-default-values-ballerina'];
    const similaritiesDefaultValuesGraphQL = samples['similarities-default-values-graphql'];

    // Clean and simple code
    const clean = samples['clean-and-simple-code'];
    const cleanApollo = samples['clean-and-simple-code-apollo'];
    const cleanBallerina = samples['clean-and-simple-code-ballerina'];

    // Simplifying GraphQL API Development
    const simplifying = samples['simplifying-graphql-api-development'];
    const simplifyingGraphql = samples['simplifying-graphql-api-development-graphql'];
    const simplifyingBallerina = samples['simplifying-graphql-api-development-ballerina'];

    // Subscription support
    const subscription = samples['subscription-support'];
    const subscriptionApollo = samples['subscription-support-apollo'];
    const subscriptionBallerina = samples['subscription-support-ballerina'];

    const designer = samples['designer-tool'];
    const cli = samples['cli-tool'];
    const security = samples['better-security'];
    const workflow = samples['git-based-workflow'];
    const anything = samples['connect-with-anything'];
    const diagram = samples['diagram-when-you-need'];
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
            {/* similarities */}
            <Row className="pageContentRow integration code odd">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='ballerina-is-graphql-graphql-is-ballerina' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'ballerina-is-graphql-graphql-is-ballerina')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {similarities.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={3} lg={3} className={styles.box}>
                                <div className={`${styles.wrapper} ${styles.spacing}`}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{similarities.frontmatter.description}</ReactMarkdown>
                                </div>
                            </Col>
                            <Col xs={12} md={9} lg={9} className={styles.box}>
                                <div className={`${styles.box} ${styles.tableBox}`}>
                                    <div className={styles.codeSnippet}>
                                        <div className='highlight'>
                                            <table className={styles.codeTable} cellSpacing={30}>
                                                <tr>
                                                    <td colSpan={2} className={styles.descriptionTd}>
                                                        <b>{similaritiesObjectTypeBallerina.frontmatter.title}: </b> {similaritiesObjectTypeBallerina.frontmatter.description}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className={styles.codeTd}>
                                                        <span className={styles.graph}>GraphQL</span>
                                                        <div className="highlightx" dangerouslySetInnerHTML={{ __html: similaritiesObjectTypeGraphQL.code }} />
                                                    </td>
                                                    <td className={styles.codeTd}>
                                                        <span className={styles.ballerina}>Ballerina</span>
                                                        <div className="highlightx" dangerouslySetInnerHTML={{ __html: similaritiesObjectTypeBallerina.code }} />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={2} className={styles.descriptionTd}>
                                                        <b>{similaritiesNullabilityBallerina.frontmatter.title}:</b> {similaritiesNullabilityBallerina.frontmatter.description}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className={styles.codeTd}>
                                                        <span className={styles.graph}>GraphQL</span>
                                                        <div className="highlightx" dangerouslySetInnerHTML={{ __html: similaritiesNullabilityGraphQL.code }} />
                                                    </td>
                                                    <td className={styles.codeTd}>
                                                        <span className={styles.ballerina}>Ballerina</span>
                                                        <div className="highlightx" dangerouslySetInnerHTML={{ __html: similaritiesNullabilityBallerina.code }} />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={2} className={styles.descriptionTd}>
                                                        <b>{similaritiesUnionTypesBallerina.frontmatter.title}:</b> {similaritiesUnionTypesBallerina.frontmatter.description}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className={styles.codeTd}>
                                                        <span className={styles.graph}>GraphQL</span>
                                                        <div className="highlightx" dangerouslySetInnerHTML={{ __html: similaritiesUnionTypesGraphQL.code }} />
                                                    </td>
                                                    <td className={styles.codeTd}>
                                                        <span className={styles.ballerina}>Ballerina</span>
                                                        <div className="highlightx" dangerouslySetInnerHTML={{ __html: similaritiesUnionTypesBallerina.code }} />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={2} className={styles.descriptionTd}>
                                                        <b>{similaritiesDefaultValuesBallerina.frontmatter.title}:</b> {similaritiesDefaultValuesBallerina.frontmatter.description}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className={styles.codeTd}>
                                                        <span className={styles.graph}>GraphQL</span>
                                                        <div className="highlightx" dangerouslySetInnerHTML={{ __html: similaritiesDefaultValuesGraphQL.code }} />
                                                    </td>
                                                    <td className={styles.codeTd}>
                                                        <span className={styles.ballerina}>Ballerina</span>
                                                        <div className="highlightx" dangerouslySetInnerHTML={{ __html: similaritiesDefaultValuesBallerina.code }} />
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* clean */}
            <Row className="pageContentRow integration code">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='clean-and-simple-code' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'clean-and-simple-code')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {clean.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{clean.frontmatter.description}</ReactMarkdown>
                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={`${styles.box}`}>

                                <div id="code-container-1" className={`${styles["code-container"]} d-none d-lg-block`}>
                                    <div id="left-panel-1" className={`${styles["left-panel"]}`}>
                                        <p className={`${styles["title-old"]}`}>{cleanApollo.frontmatter.title}</p>
                                        <div className={`${styles["code-panel"]}`} dangerouslySetInnerHTML={{ __html: cleanApollo.code }} />
                                    </div>
                                    <div id="right-panel-1" className={`${styles["right-panel"]}`}>
                                        <div id="drag-1" className={`${styles["drag"]}`}>
                                            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${styles["button-wrap"]} absolute`}>
                                                <circle cx="23" cy="23" r="23" fill="#20b6b0" className='draggable' id="draggable-circle-1"></circle>
                                                <path d="M10.4375 22.5625C10.4375 22.2988 10.5254 22.0645 10.7012 21.8887L16.3262 16.2637C16.6777 15.8828 17.293 15.8828 17.6445 16.2637C18.0254 16.6152 18.0254 17.2305 17.6445 17.582L12.6934 22.5625L17.6445 27.5137C18.0254 27.8652 18.0254 28.4805 17.6445 28.832C17.293 29.2129 16.6777 29.2129 16.3262 28.832L10.7012 23.207C10.5254 23.0312 10.4375 22.7969 10.4375 22.5625Z" fill="white"></path>
                                                <path d="M35.5625 22.5625C35.5625 22.2988 35.4746 22.0645 35.2988 21.8887L29.6738 16.2637C29.3223 15.8828 28.707 15.8828 28.3555 16.2637C27.9746 16.6152 27.9746 17.2305 28.3555 17.582L33.3066 22.5625L28.3555 27.5137C27.9746 27.8652 27.9746 28.4805 28.3555 28.832C28.707 29.2129 29.3223 29.2129 29.6738 28.832L35.2988 23.207C35.4746 23.0312 35.5625 22.7969 35.5625 22.5625Z" fill="white"></path>
                                            </svg>
                                        </div>
                                        <p className={`${styles["title-new"]}`}>{cleanBallerina.frontmatter.title}</p>
                                        <div className={`${styles["code-panel"]}`} dangerouslySetInnerHTML={{ __html: cleanBallerina.code }} />
                                    </div>
                                </div>

                                {/* mobile view */}
                                <div id="code-tab-1" className={`${styles["code-tab"]} d-block d-lg-none`}>
                                    <Tabs defaultActiveKey="ballerina-code" id="codeTab1" className="mb-3 codeTabs">
                                        <Tab eventKey="apollo-code" title={cleanApollo.frontmatter.title}>
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: cleanApollo.code }} />
                                            </div>
                                        </Tab>
                                        <Tab eventKey="ballerina-code" title={cleanBallerina.frontmatter.title}>
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: cleanBallerina.code }} />
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* simplifying graphql api development */}
            <Row className="pageContentRow integration code odd">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='code-first' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'code-first')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {simplifying.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{simplifying.frontmatter.description}</ReactMarkdown>
                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={`${styles.box}`}>

                                <div id="code-container-2" className={`${styles["code-container"]} ${styles["code2"]} d-none d-lg-block`}>
                                    <div id="left-panel-2" className={`${styles["left-panel"]}`}>
                                        <p className={`${styles["title-new"]}`}>{simplifyingBallerina.frontmatter.title}</p>
                                        <div className={`${styles["code-panel"]}`} dangerouslySetInnerHTML={{ __html: simplifyingBallerina.code }} />
                                    </div>
                                    <div id="right-panel-2" className={`${styles["right-panel"]}`}>
                                        <div id="drag-2" className={`${styles["drag"]}`}>
                                            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${styles["button-wrap"]} absolute`}>
                                                <circle cx="23" cy="23" r="23" fill="#20b6b0" className='draggable' id="draggable-circle-2"></circle>
                                                <path d="M10.4375 22.5625C10.4375 22.2988 10.5254 22.0645 10.7012 21.8887L16.3262 16.2637C16.6777 15.8828 17.293 15.8828 17.6445 16.2637C18.0254 16.6152 18.0254 17.2305 17.6445 17.582L12.6934 22.5625L17.6445 27.5137C18.0254 27.8652 18.0254 28.4805 17.6445 28.832C17.293 29.2129 16.6777 29.2129 16.3262 28.832L10.7012 23.207C10.5254 23.0312 10.4375 22.7969 10.4375 22.5625Z" fill="white"></path>
                                                <path d="M35.5625 22.5625C35.5625 22.2988 35.4746 22.0645 35.2988 21.8887L29.6738 16.2637C29.3223 15.8828 28.707 15.8828 28.3555 16.2637C27.9746 16.6152 27.9746 17.2305 28.3555 17.582L33.3066 22.5625L28.3555 27.5137C27.9746 27.8652 27.9746 28.4805 28.3555 28.832C28.707 29.2129 29.3223 29.2129 29.6738 28.832L35.2988 23.207C35.4746 23.0312 35.5625 22.7969 35.5625 22.5625Z" fill="white"></path>
                                            </svg>
                                        </div>
                                        <p className={`${styles["title-old"]}`}>{simplifyingGraphql.frontmatter.title}</p>
                                        <div className={`${styles["code-panel"]}`} dangerouslySetInnerHTML={{ __html: simplifyingGraphql.code }} />
                                    </div>
                                </div>

                                {/* mobile view */}
                                <div id="code-tab-2" className={`${styles["code-tab"]} d-block d-lg-none`}>
                                    <Tabs defaultActiveKey="ballerina-code" id="codeTab2" className="mb-3 codeTabs">
                                        <Tab eventKey="ballerina-code" title={simplifyingBallerina.frontmatter.title}>
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: simplifyingBallerina.code }} />
                                            </div>
                                        </Tab>
                                        <Tab eventKey="graphql-code" title={simplifyingGraphql.frontmatter.title}>
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: simplifyingGraphql.code }} />
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* subscription */}
            <Row className="pageContentRow integration code">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='subscription-support' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'subscription-support')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {subscription.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{subscription.frontmatter.description}</ReactMarkdown>
                                </div>
                                <div className={styles.dVersion}>
                                    <a href={subscription.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                        <Image src={`${prefix}/images/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                        View code on GitHub
                                    </a>
                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={`${styles.box}`}>

                                <div id="code-container-3" className={`${styles["code-container"]} d-none d-lg-block`}>
                                    <div id="left-panel-3" className={`${styles["left-panel"]}`}>
                                        <p className={`${styles["title-new"]}`}>{subscriptionApollo.frontmatter.title}</p>
                                        <div className={`${styles["code-panel"]}`} dangerouslySetInnerHTML={{ __html: subscriptionApollo.code }} />
                                    </div>
                                    <div id="right-panel-3" className={`${styles["right-panel"]}`}>
                                        <div id="drag-3" className={`${styles["drag"]}`}>
                                            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${styles["button-wrap"]} absolute`}>
                                                <circle cx="23" cy="23" r="23" fill="#20b6b0" className='draggable' id="draggable-circle-3"></circle>
                                                <path d="M10.4375 22.5625C10.4375 22.2988 10.5254 22.0645 10.7012 21.8887L16.3262 16.2637C16.6777 15.8828 17.293 15.8828 17.6445 16.2637C18.0254 16.6152 18.0254 17.2305 17.6445 17.582L12.6934 22.5625L17.6445 27.5137C18.0254 27.8652 18.0254 28.4805 17.6445 28.832C17.293 29.2129 16.6777 29.2129 16.3262 28.832L10.7012 23.207C10.5254 23.0312 10.4375 22.7969 10.4375 22.5625Z" fill="white"></path>
                                                <path d="M35.5625 22.5625C35.5625 22.2988 35.4746 22.0645 35.2988 21.8887L29.6738 16.2637C29.3223 15.8828 28.707 15.8828 28.3555 16.2637C27.9746 16.6152 27.9746 17.2305 28.3555 17.582L33.3066 22.5625L28.3555 27.5137C27.9746 27.8652 27.9746 28.4805 28.3555 28.832C28.707 29.2129 29.3223 29.2129 29.6738 28.832L35.2988 23.207C35.4746 23.0312 35.5625 22.7969 35.5625 22.5625Z" fill="white"></path>
                                            </svg>
                                        </div>
                                        <p className={`${styles["title-old"]}`}>{subscriptionBallerina.frontmatter.title}</p>
                                        <div className={`${styles["code-panel"]}`} dangerouslySetInnerHTML={{ __html: subscriptionBallerina.code }} />
                                    </div>
                                </div>

                                {/* mobile view */}
                                <div id="code-tab-2" className={`${styles["code-tab"]} d-block d-lg-none`}>
                                    <Tabs defaultActiveKey="apollo-code" id="codeTab3" className="mb-3 codeTabs">
                                        <Tab eventKey="apollo-code" title={subscriptionApollo.frontmatter.title}>
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: subscriptionApollo.code }} />
                                            </div>
                                        </Tab>
                                        <Tab eventKey="ballerina-code" title={subscriptionBallerina.frontmatter.title}>
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: subscriptionBallerina.code }} />
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* designer */}
            <Row className="pageContentRow integration code odd">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='graphql-designer-tool' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'graphql-designer-tool')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {designer.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{designer.frontmatter.description}</ReactMarkdown>
                                    <div className={styles.dVersion}>
                                        <a href={designer.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                            {/* <Image src={`${prefix}/images/github-grey.svg`} width={20} height={20} alt="View code on GitHub" /> */}
                                            Learn more about the Ballerina GraphQL designer
                                        </a>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={styles.box}>
                                {
                                    (designer.code && designer.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: designer.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (designer.frontmatter.image && designer.frontmatter.image !== '') ?
                                        <img src={`${prefix}/${designer.frontmatter.image}`} alt={designer.frontmatter.title} />
                                        : null
                                }
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* cli tool */}
            <Row className="pageContentRow integration code">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='ballerina-graphql-cli-tool' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'ballerina-graphql-cli-tool')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {cli.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{cli.frontmatter.description}</ReactMarkdown>
                                </div>
                                <div className={styles.dVersion}>
                                    <a href={cli.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                        {/* <Image src={`${prefix}/images/github-grey.svg`} width={20} height={20} alt="View code on GitHub" /> */}
                                        Learn more about the Ballerina GraphQL CLI tool
                                    </a>
                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={`${styles.box} ${styles.ipaas}`}>
                                <img src={`${prefix}/${cli.frontmatter.image}`} alt={cli.frontmatter.title} className={styles.doNotFill} width='60%' />
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
                                <h2 id='better-security' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'better-security')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {security.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{security.frontmatter.description}</ReactMarkdown>
                                    <div className={styles.dVersion}>
                                        <a href={security.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                            <Image src={`${prefix}/images/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                            View code on GitHub
                                        </a>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={styles.box}>
                                <div className={styles.codeSnippet}>
                                    <div className="highlight" dangerouslySetInnerHTML={{ __html: security.code }} />
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* workflow */}
            <Row className="pageContentRow integration code">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='git-based-workflow' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'git-based-workflow')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {workflow.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{workflow.frontmatter.description}</ReactMarkdown>
                                    <div className={styles.dVersion}>
                                        <a href={workflow.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                            <Image src={`${prefix}/images/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                            View code on GitHub
                                        </a>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={`${styles.box} ${styles.ipaas}`}>
                                {
                                    (workflow.code && workflow.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: workflow.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (workflow.frontmatter.image && workflow.frontmatter.image !== '') ?
                                        <img src={`${prefix}/${workflow.frontmatter.image}`} alt={workflow.frontmatter.title} className={styles.doNotFill} width='60%' />
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
                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={`${styles.box}`}>
                                <div className={styles.codeSnippet}>
                                    <div className="highlight" dangerouslySetInnerHTML={{ __html: anything.code }} />
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* community*/}
            <Row className="pageContentRow integration code odd">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='community-driven-development' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'community-driven-development')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {community.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{community.frontmatter.description}</ReactMarkdown>

                                    {
                                        (community.frontmatter.url && community.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <a href={transactions.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                    <Image src={`${prefix}/images/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                                    View code on GitHub
                                                </a>
                                            </div>
                                            : null
                                    }

                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={`${styles.box} ${styles.ipaas}`}>
                                {
                                    (community.code && community.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: community.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (community.frontmatter.image && community.frontmatter.image !== '') ?
                                        <img src={`${prefix}/${community.frontmatter.image}`} alt={community.frontmatter.title} className={styles.doNotFill} width='60%' />
                                        : null
                                }
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* ipaas */}
            <Row className="pageContentRow integration code">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='trivial-hosting-in-wso2-choreo-ipaas' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'trivial-hosting-in-wso2-choreo-ipaas')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {ipaas.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{ipaas.frontmatter.description}</ReactMarkdown>

                                    {
                                        (ipaas.frontmatter.url && ipaas.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <a href={ipaas.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                    {/* <Image src={`${prefix}/images/github-grey.svg`} width={20} height={20} alt="View code on GitHub" /> */}
                                                    Get started with WSO2 Choreo iPaaS for free
                                                </a>
                                            </div>
                                            : null
                                    }

                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={`${styles.box} ${styles.ipaas}`}>
                                {
                                    (ipaas.code && ipaas.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: ipaas.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (ipaas.frontmatter.image && ipaas.frontmatter.image !== '') ?
                                        <img src={`${prefix}/${ipaas.frontmatter.image}`} alt={ipaas.frontmatter.title} className={styles.doNotFill} width='60%' />
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
