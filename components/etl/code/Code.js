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

import { prefix } from '../../../utils/prefix';
import styles from './Code.module.css';

export default function UseCases(props) {

    const samples = props.samples;

    const dataInteractions = samples['drive-data-interactions-with-models'];
    const smarterExtractiion = samples['make-data-extraction-smarter'];
    const githubExtract = samples['extract-data-from-github'];
    const clean = samples['eleminating-redundency-for-cleaner-data'];
    const clean1 = samples['clean1'];
    const clean2 = samples['clean2'];
    const errorCorrection = samples['refining-data-excellence'];
    const enrich = samples['data-enrichment-magic'];
    const dataMapper = samples['reshaping-data-with-data-mapper'];
    const cleanUsingRegex = samples['precision-cleaning-with-regex'];
    const loadFromKafka = samples['load-from-kafka-topics'];
    const loadToBigQuery = samples['load-data-to-data-warehouse'];
    const loadToGSheets = samples['load-data-to-google-sheets'];

    var isResizing = false;

    React.useEffect(() => {
        (function () {
            var container = document.getElementById("code-container"),
                left = document.getElementById("left_panel"),
                right = document.getElementById("right_panel");
            // handle = document.getElementById("drag");

            // handle.onmousedown = function (e) {
            //     isResizing = true;
            // };

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
            {/* Extractions */}
            <Row className="pageContentRow integration code odd">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='drive-data-interactions-with-models' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'drive-data-interactions-with-models')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    Data extraction (E)
                                </h2>
                            </Col>
                        </Row>
                        {/* dataInteractions */}
                        <Row className={styles.subsection}>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <h3>{dataInteractions.frontmatter.title}</h3>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{dataInteractions.frontmatter.description}</ReactMarkdown>

                                    {
                                        (dataInteractions.frontmatter.url && dataInteractions.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <a href={dataInteractions.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                    <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                                    View code on GitHub
                                                </a>
                                            </div>
                                            : null
                                    }

                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={styles.box}>
                                {
                                    (dataInteractions.code && dataInteractions.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: dataInteractions.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (dataInteractions.frontmatter.image && dataInteractions.frontmatter.image !== '') ?
                                        <img src={`${prefix}/${dataInteractions.frontmatter.image}`} alt={dataInteractions.frontmatter.title} />
                                        : null
                                }
                            </Col>
                        </Row>

                        {/* smarterExtractiion */}
                        <Row className={styles.subsection}>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <h3>{smarterExtractiion.frontmatter.title}</h3>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{smarterExtractiion.frontmatter.description}</ReactMarkdown>

                                    {
                                        (smarterExtractiion.frontmatter.url && smarterExtractiion.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <a href={smarterExtractiion.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                    <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                                    View code on GitHub
                                                </a>
                                            </div>
                                            : null
                                    }

                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={styles.box}>
                                {
                                    (smarterExtractiion.code && smarterExtractiion.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: smarterExtractiion.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (smarterExtractiion.frontmatter.image && smarterExtractiion.frontmatter.image !== '') ?
                                        <img src={`${prefix}/${smarterExtractiion.frontmatter.image}`} alt={smarterExtractiion.frontmatter.title} />
                                        : null
                                }
                            </Col>
                        </Row>

                        {/* githubExtract */}
                        <Row className={styles.subsection}>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <h3>{githubExtract.frontmatter.title}</h3>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{githubExtract.frontmatter.description}</ReactMarkdown>

                                    {
                                        (githubExtract.frontmatter.url && githubExtract.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <a href={githubExtract.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                    <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                                    View code on GitHub
                                                </a>
                                            </div>
                                            : null
                                    }

                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={styles.box}>
                                {
                                    (githubExtract.code && githubExtract.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: githubExtract.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (githubExtract.frontmatter.image && githubExtract.frontmatter.image !== '') ?
                                        <img src={`${prefix}/${githubExtract.frontmatter.image}`} alt={githubExtract.frontmatter.title} />
                                        : null
                                }
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* Transformations */}
            <Row className="pageContentRow integration code">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='eleminating-redundency-for-cleaner-data' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'eleminating-redundency-for-cleaner-data')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    Data transformation (T)
                                </h2>
                            </Col>
                        </Row>
                        {/* clean */}
                        <Row className={styles.subsection}>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <h3>{clean.frontmatter.title}</h3>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{clean.frontmatter.description}</ReactMarkdown>
                                    <div className={styles.dVersion}>
                                        <span>Sample 1: Remove duplicates based on composite fields</span>
                                        <a href='https://github.com/ballerina-guides/etl-samples/blob/main/remove-duplicates/main.bal' className={styles.cDownload} target="_blank" rel="noreferrer">
                                            <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                            View code on GitHub
                                        </a>
                                    </div>

                                    <div className={styles.dVersion}>
                                        <span>Sample 2: Remove duplicates based on approximation</span>
                                        <a href='https://github.com/ballerina-guides/etl-samples/blob/main/remove-approximate-duplicates/main.bal' className={styles.cDownload} target="_blank" rel="noreferrer">
                                            <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                            View code on GitHub
                                        </a>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={styles.box}>
                                <div id="code-tab">
                                    <Tabs defaultActiveKey="clean1" id="code" className="mb-3 codeTabs">
                                        <Tab eventKey="clean1" title="Sample 1">
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: clean1.code }} />
                                            </div>
                                        </Tab>
                                        <Tab eventKey="clean2" title="Sample 2">
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: clean2.code }} />
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </Col>
                        </Row>

                        {/* errorCorrection */}
                        <Row className={styles.subsection}>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <h3>{errorCorrection.frontmatter.title}</h3>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{errorCorrection.frontmatter.description}</ReactMarkdown>

                                    {
                                        (errorCorrection.frontmatter.url && errorCorrection.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <a href={errorCorrection.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                    <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                                    View code on GitHub
                                                </a>
                                            </div>
                                            : null
                                    }

                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={styles.box}>
                                {
                                    (errorCorrection.code && errorCorrection.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: errorCorrection.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (errorCorrection.frontmatter.image && errorCorrection.frontmatter.image !== '') ?
                                        <img src={`${prefix}/${errorCorrection.frontmatter.image}`} alt={errorCorrection.frontmatter.title} />
                                        : null
                                }
                            </Col>
                        </Row>

                        {/* enrich */}
                        <Row className={styles.subsection}>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <h3>{enrich.frontmatter.title}</h3>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{enrich.frontmatter.description}</ReactMarkdown>

                                    {
                                        (enrich.frontmatter.url && enrich.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <a href={enrich.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                    <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                                    View code on GitHub
                                                </a>
                                            </div>
                                            : null
                                    }

                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={styles.box}>
                                {
                                    (enrich.code && enrich.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: enrich.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (enrich.frontmatter.image && enrich.frontmatter.image !== '') ?
                                        <img src={`${prefix}/${enrich.frontmatter.image}`} alt={enrich.frontmatter.title} />
                                        : null
                                }
                            </Col>
                        </Row>

                        {/* dataMapper */}
                        <Row className={styles.subsection}>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <h3>{dataMapper.frontmatter.title}</h3>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{dataMapper.frontmatter.description}</ReactMarkdown>

                                    {
                                        (dataMapper.frontmatter.url && dataMapper.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <a href={dataMapper.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                    <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                                    View code on GitHub
                                                </a>
                                            </div>
                                            : null
                                    }

                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={styles.box}>
                                {
                                    (dataMapper.code && dataMapper.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: dataMapper.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (dataMapper.frontmatter.image && dataMapper.frontmatter.image !== '') ?
                                        <img src={`${prefix}/${dataMapper.frontmatter.image}`} alt={dataMapper.frontmatter.title} />
                                        : null
                                }
                            </Col>
                        </Row>

                        {/* cleanUsingRegex */}
                        <Row className={styles.subsection}>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <h3>{cleanUsingRegex.frontmatter.title}</h3>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{cleanUsingRegex.frontmatter.description}</ReactMarkdown>

                                    {
                                        (cleanUsingRegex.frontmatter.url && cleanUsingRegex.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <a href={cleanUsingRegex.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                    <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                                    View code on GitHub
                                                </a>
                                            </div>
                                            : null
                                    }

                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={styles.box}>
                                {
                                    (cleanUsingRegex.code && cleanUsingRegex.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: cleanUsingRegex.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (cleanUsingRegex.frontmatter.image && cleanUsingRegex.frontmatter.image !== '') ?
                                        <img src={`${prefix}/${cleanUsingRegex.frontmatter.image}`} alt={cleanUsingRegex.frontmatter.title} />
                                        : null
                                }
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* loading */}
            <Row className="pageContentRow integration code odd">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='load-from-kafka-topics' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'load-from-kafka-topics')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    Data loading (L)
                                </h2>
                            </Col>
                        </Row>
                        {/* loadFromKafka */}
                        <Row className={styles.subsection}>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <h3>{loadFromKafka.frontmatter.title}</h3>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{loadFromKafka.frontmatter.description}</ReactMarkdown>

                                    {
                                        (loadFromKafka.frontmatter.url && loadFromKafka.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <a href={loadFromKafka.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                    <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                                    View code on GitHub
                                                </a>
                                            </div>
                                            : null
                                    }

                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={styles.box}>
                                {
                                    (loadFromKafka.code && loadFromKafka.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: loadFromKafka.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (loadFromKafka.frontmatter.image && loadFromKafka.frontmatter.image !== '') ?
                                        <img src={`${prefix}/${loadFromKafka.frontmatter.image}`} alt={loadFromKafka.frontmatter.title} />
                                        : null
                                }
                            </Col>
                        </Row>

                        {/* loadToBigQuery */}
                        <Row className={styles.subsection}>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <h3>{loadToBigQuery.frontmatter.title}</h3>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{loadToBigQuery.frontmatter.description}</ReactMarkdown>

                                    {
                                        (loadToBigQuery.frontmatter.url && loadToBigQuery.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <a href={loadToBigQuery.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                    <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                                    View code on GitHub
                                                </a>
                                            </div>
                                            : null
                                    }

                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={styles.box}>
                                {
                                    (loadToBigQuery.code && loadToBigQuery.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: loadToBigQuery.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (loadToBigQuery.frontmatter.image && loadToBigQuery.frontmatter.image !== '') ?
                                        <img src={`${prefix}/${loadToBigQuery.frontmatter.image}`} alt={loadToBigQuery.frontmatter.title} />
                                        : null
                                }
                            </Col>
                        </Row>

                        {/* loadToGSheets */}
                        <Row className={styles.subsection}>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <h3>{loadToGSheets.frontmatter.title}</h3>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{loadToGSheets.frontmatter.description}</ReactMarkdown>

                                    {
                                        (loadToGSheets.frontmatter.url && loadToGSheets.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <a href={loadToGSheets.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                    <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                                    View code on GitHub
                                                </a>
                                            </div>
                                            : null
                                    }

                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={styles.box}>
                                {
                                    (loadToGSheets.code && loadToGSheets.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: loadToGSheets.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (loadToGSheets.frontmatter.image && loadToGSheets.frontmatter.image !== '') ?
                                        <img src={`${prefix}/${loadToGSheets.frontmatter.image}`} alt={loadToGSheets.frontmatter.title} />
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
