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

    const why = samples['why-is-ballerina-the-way-you-should-write-ai-applications'];

    const chat = samples['bring-text-alive-with-openai-chats'];
    const chat1 = samples['openai1'];
    const chat2 = samples['openai2'];
    const chat3 = samples['openai3'];

    const dalle = samples['create-images-with-dall-e'];
    const dalle1 = samples['dalle1'];
    const dalle2 = samples['dalle2'];
    const dalle3 = samples['dalle3'];
    const dalle4 = samples['dalle4'];

    const music = samples['transcribe-speech-or-music-with-whisper'];
    const sample1 = samples['music1'];
    const sample2 = samples['music2'];

    const tune = samples['fine-tune-models-with-your-own-data'];
    const vector = samples['simplify-vector-database-management'];
    const libraries = samples['libraries-for-ai-operations'];
    const powered = samples['create-ai-powered-apis'];
    const robust = samples['write-robust-api-powered-ai-applications'];
    const concurrency = samples['concurrency-simplified-for-ai-development'];
    const effortlessly = samples['effortlessly-create-impactful-business'];
    const effort1 = samples['effort1'];
    const effort2 = samples['effort2'];
    const ipaas = samples['trivial-hosting-in-wso2-choreo-ipaas'];


    var isResizing = false;

    React.useEffect(() => {
        (function () {
            var container = document.getElementById("code-container"),
                left = document.getElementById("left_panel"),
                right = document.getElementById("right_panel"),
                handle = document.getElementById("drag");

            handle.onmousedown = function (e) {
                isResizing = true;
            };

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
            {/* why */}
            <Row className="pageContentRow integration code odd">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='why-is-ballerina-the-way-you-should-write-ai-applications' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'why-is-ballerina-the-way-you-should-write-ai-applications')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {why.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{why.frontmatter.description}</ReactMarkdown>

                                    <div className={styles.dVersions}>
                                        <div className={styles.dVersion}>
                                            <a href={`https://central.ballerina.io/search?q=package%3Aopenai.`}
                                                className={styles.cDownload}
                                                data-download="downloads">
                                                <div className={styles.cSize}>OpenAI Connectors</div>
                                            </a>
                                        </div>
                                        <div className={styles.dVersion}>
                                            <a href={`https://central.ballerina.io/search?q=package%3Aazure.openai.&sort=pull_count%2CDESC&page=1`}
                                                className={styles.cDownload}
                                                data-download="downloads">
                                                <div className={styles.cSize}>Azure OpenAI connectors</div>
                                            </a>
                                        </div>
                                    </div>

                                    <div className={styles.dVersions}>
                                        <div className={styles.dVersion}>
                                            <a href={`https://central.ballerina.io/search/keywords?q=Embedding+Search&page=1`}
                                                className={styles.cDownload}
                                                data-download="downloads">
                                                <div className={styles.cSize}>Vector DB connectors</div>
                                            </a>
                                        </div>
                                        <div className={styles.dVersion}>
                                            <a href={`https://central.ballerina.io/search/keywords?q=AI%2FImages&page=1`}
                                                className={styles.cDownload}
                                                data-download="downloads">
                                                <div className={styles.cSize}>Images</div>
                                            </a>
                                        </div>
                                    </div>

                                    <div className={styles.dVersions}>
                                        <div className={styles.dVersion}>
                                            <a href={`https://central.ballerina.io/ballerina/math.vector`}
                                                className={styles.cDownload}
                                                data-download="downloads">
                                                <div className={styles.cSize}>Vector Math</div>
                                            </a>
                                        </div>
                                    </div>

                                    {
                                        (why.frontmatter.url && why.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <a href={why.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                    <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                                    View code on GitHub
                                                </a>
                                            </div>
                                            : null
                                    }

                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={`${styles.box}`}>

                                <div id="code-container" className='d-none d-lg-block'>
                                    <div id="left_panel">
                                        <p className='title-old'>Code</p>
                                        {/* < dangerouslySetInnerHTML={{ __html: sample1.code }} /> */}
                                        <div className="code-panel" dangerouslySetInnerHTML={{ __html: why.code }} />
                                        {/* <div className="code-panel">
                                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                                            <br/>Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                        </div> */}
                                    </div>
                                    <div id="right_panel">
                                        <div id="drag">
                                            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute button-wrap" ><circle cx="23" cy="23" r="23" fill="#20b6b0"></circle><path d="M10.4375 22.5625C10.4375 22.2988 10.5254 22.0645 10.7012 21.8887L16.3262 16.2637C16.6777 15.8828 17.293 15.8828 17.6445 16.2637C18.0254 16.6152 18.0254 17.2305 17.6445 17.582L12.6934 22.5625L17.6445 27.5137C18.0254 27.8652 18.0254 28.4805 17.6445 28.832C17.293 29.2129 16.6777 29.2129 16.3262 28.832L10.7012 23.207C10.5254 23.0312 10.4375 22.7969 10.4375 22.5625Z" fill="white"></path><path d="M35.5625 22.5625C35.5625 22.2988 35.4746 22.0645 35.2988 21.8887L29.6738 16.2637C29.3223 15.8828 28.707 15.8828 28.3555 16.2637C27.9746 16.6152 27.9746 17.2305 28.3555 17.582L33.3066 22.5625L28.3555 27.5137C27.9746 27.8652 27.9746 28.4805 28.3555 28.832C28.707 29.2129 29.3223 29.2129 29.6738 28.832L35.2988 23.207C35.4746 23.0312 35.5625 22.7969 35.5625 22.5625Z" fill="white"></path></svg>
                                        </div>

                                        <p className='title-new'>Diagram</p>
                                        {/* <div className="code-panel" dangerouslySetInnerHTML={{ __html: sample2.code }} /> */}
                                        <div className="code-panel diagram">
                                            <Image src={`${prefix}/images/ai-diagram.png`} width={520} height={548} alt="Diagram" />
                                            {/* <img src={`${prefix}/images/ai-diagram.png`} alt={why.frontmatter.title} className={styles.doNotFill} width='71%' /> */}
                                        </div>
                                        {/* <div className="code-panel">
                                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                                            <br/>Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                        </div> */}

                                    </div>
                                </div>




                                {/* mobile view */}
                                <div id="code-tab" className='d-block d-lg-none'>
                                    <Tabs defaultActiveKey="code" id="codeTab1" className="mb-3 codeTabs">
                                        <Tab eventKey="code" title="Code">
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: why.code }} />
                                            </div>
                                        </Tab>
                                        <Tab eventKey="diagram" title="Diagram">
                                            <img src={`${prefix}/images/ai-diagram.png`} width={520} height={548} alt="Diagram" />
                                        </Tab>
                                    </Tabs>
                                </div>

                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* chat */}
            <Row className="pageContentRow integration code">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='bring-text-alive-with-openai-chat' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'bring-text-alive-with-openai-chat')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {chat.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{chat.frontmatter.description}</ReactMarkdown>
                                    <div className={styles.dVersion}>
                                        <span>Sample 1: Summarize text using OpenAI</span>
                                        <a href='https://github.com/ballerina-guides/ai-samples/blob/main/summarize_text_using_openai/main.bal' className={styles.cDownload} target="_blank" rel="noreferrer">
                                            <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                            View code on GitHub
                                        </a>
                                    </div>

                                    <div className={styles.dVersion}>
                                        <span>Sample 2: Correct grammar and spelling in text using OpenAI</span>
                                        <a href='https://github.com/ballerina-guides/ai-samples/blob/main/correct_grammar_and_spelling_in_text_using_openai/main.bal' className={styles.cDownload} target="_blank" rel="noreferrer">
                                            <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                            View code on GitHub
                                        </a>
                                    </div>

                                    <div className={styles.dVersion}>
                                        <span>Sample 3: Tweet on upcoming and recently released movies using Azure OpenAI</span>
                                        <a href='https://github.com/ballerina-guides/ai-samples/blob/main/tweet_on_upcoming_and_recently_released_movies_using_azure_openai/main.bal' className={styles.cDownload} target="_blank" rel="noreferrer">
                                            <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                            View code on GitHub
                                        </a>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={styles.box}>
                                <div id="code-tab">
                                    <Tabs defaultActiveKey="chat1" id="code" className="mb-3 codeTabs">
                                        <Tab eventKey="chat1" title="Sample 1">
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: chat1.code }} />
                                            </div>
                                        </Tab>
                                        <Tab eventKey="chat2" title="Sample 2">
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: chat2.code }} />
                                            </div>
                                        </Tab>
                                        <Tab eventKey="chat3" title="Sample 3">
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: chat3.code }} />
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* dalle */}
            <Row className="pageContentRow integration code odd">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='create-images-with-dall-e' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'create-images-with-dall-e')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {dalle.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{dalle.frontmatter.description}</ReactMarkdown>
                                    <div className={styles.dVersion}>
                                        <span>Sample 1: Generate images using OpenAI and store them in Google Drive</span>
                                        <a href='https://github.com/ballerina-guides/ai-samples/blob/main/generate_images_using_openai_and_store_in_google_drive/main.bal' className={styles.cDownload} target="_blank" rel="noreferrer">
                                            <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                            View code on GitHub
                                        </a>
                                    </div>


                                    <div className={styles.dVersion}>
                                        <span>Sample 2: Create products in Shopify using OpenAI</span>
                                        <a href='https://github.com/ballerina-guides/ai-samples/tree/main/create_products_in_shopify_using_openai/main.bal' className={styles.cDownload} target="_blank" rel="noreferrer">
                                            <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                            View code on GitHub
                                        </a>
                                    </div>

                                    <div className={styles.dVersion}>
                                        <span>Sample 3: Create and send customized greeting cards using OpenAI</span>
                                        <a href='https://github.com/ballerina-guides/ai-samples/blob/main/create_and_send_customized_greeting_cards_using_openai/service.bal' className={styles.cDownload} target="_blank" rel="noreferrer">
                                            <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                            View code on GitHub
                                        </a>
                                    </div>

                                    <div className={styles.dVersion}>
                                        <span>Sample 4: Generate a poem and an image on a topic using OpenAI and Stable Diffusion and email both of them</span>
                                        <a href='https://github.com/ballerina-guides/ai-samples/blob/main/generate_and_send_a_creative_email_using_openai_and_stability_ai/main.bal' className={styles.cDownload} target="_blank" rel="noreferrer">
                                            <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                            View code on GitHub
                                        </a>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={styles.box}>
                                <div id="code-tab">
                                    <Tabs defaultActiveKey="dalle1" id="code" className="mb-3 codeTabs">
                                        <Tab eventKey="dalle1" title="Sample 1">
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: dalle1.code }} />
                                            </div>
                                        </Tab>
                                        <Tab eventKey="dalle2" title="Sample 2">
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: dalle2.code }} />
                                            </div>
                                        </Tab>
                                        <Tab eventKey="dalle3" title="Sample 3">
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: dalle3.code }} />
                                            </div>
                                        </Tab>
                                        <Tab eventKey="dalle4" title="Sample 4">
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: dalle4.code }} />
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* music */}
            <Row className="pageContentRow integration code">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='transcribe-speech-or-music-with-whisper' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'transcribe-speech-or-music-with-whisper')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {music.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{music.frontmatter.description}</ReactMarkdown>
                                    <div className={styles.dVersion}>
                                        <span>Sample 1: Convert audio to text and translate using OpenAI</span>
                                        <a href='https://github.com/ballerina-guides/ai-samples/blob/main/convert_audio_to_text_and_translate_using_openai/main.bal' className={styles.cDownload} target="_blank" rel="noreferrer">
                                            <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                            View code on GitHub
                                        </a>
                                    </div>

                                    <div className={styles.dVersion}>
                                        <span>Sample 2: Audio-to-text summarization using OpenAI</span>
                                        <a href='https://github.com/ballerina-guides/ai-samples/blob/main/audio_to_text_summarization_using_openai/main.bal' className={styles.cDownload} target="_blank" rel="noreferrer">
                                            <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                            View code on GitHub
                                        </a>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={styles.box}>
                                <div id="code-tab">
                                    <Tabs defaultActiveKey="sample1" id="code" className="mb-3 codeTabs">
                                        <Tab eventKey="sample1" title="Sample 1">
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: sample1.code }} />
                                            </div>
                                        </Tab>
                                        <Tab eventKey="sample2" title="Sample 2">
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: sample2.code }} />
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* tune */}
            <Row className="pageContentRow integration code odd">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='fine-tune-models-with-your-own-data' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'fine-tune-models-with-your-own-data')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {tune.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{tune.frontmatter.description}</ReactMarkdown>

                                    {
                                        (tune.frontmatter.url && tune.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <span>Fine-tune GPT-3 models</span>
                                                <a href={tune.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
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
                                    (tune.code && tune.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: tune.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (tune.frontmatter.image && tune.frontmatter.image !== '') ?
                                        <img src={`${prefix}/${tune.frontmatter.image}`} alt={tune.frontmatter.title} />
                                        : null
                                }
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* vector */}
            <Row className="pageContentRow integration code">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='simplify-vector-database-management' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'simplify-vector-database-management')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {vector.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{vector.frontmatter.description}</ReactMarkdown>

                                    {
                                        (vector.frontmatter.url && vector.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <span>Answer questions by performing a similarity search on embedding vectors stored in Weaviate</span>
                                                <a href={vector.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
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
                                    (vector.code && vector.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: vector.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (vector.frontmatter.image && vector.frontmatter.image !== '') ?
                                        <img src={`${prefix}/${vector.frontmatter.image}`} alt={vector.frontmatter.title} />
                                        : null
                                }
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* libraries */}
            <Row className="pageContentRow integration code odd">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='libraries-for-ai-operations' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'libraries-for-ai-operations')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {libraries.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{libraries.frontmatter.description}</ReactMarkdown>

                                    {
                                        (libraries.frontmatter.url && libraries.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <span>Text similarity comparison with OpenAI GPT-3 embeddings</span>
                                                <a href={libraries.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
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
                                    (libraries.code && libraries.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: libraries.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (libraries.frontmatter.image && libraries.frontmatter.image !== '') ?
                                        <img src={`${prefix}/${libraries.frontmatter.image}`} alt={libraries.frontmatter.title} />
                                        : null
                                }
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* effortlessly */}
            <Row className="pageContentRow integration code">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='effortlessly-create-impactful-business-use-cases' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'effortlessly-create-impactful-business-use-cases')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {effortlessly.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{effortlessly.frontmatter.description}</ReactMarkdown>

                                    <div className={styles.dVersion}>
                                        <span>Sample 1: Chatbot service for Slack using Azure OpenAI</span>
                                        <a href='https://github.com/ballerina-guides/ai-samples/blob/main/slackbot_using_azure_openai/service.bal' className={styles.cDownload} target="_blank" rel="noreferrer">
                                            <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                            View code on GitHub
                                        </a>
                                    </div>

                                    <div className={styles.dVersion}>
                                        <span>Sample 2: Question Answering based on Context using OpenAI GPT-3 and Pinecone</span>
                                        <a href='https://github.com/ballerina-guides/ai-samples/blob/main/question_answering_based_on_context_using_openai_and_pinecone/main.bal' className={styles.cDownload} target="_blank" rel="noreferrer">
                                            <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                            View code on GitHub
                                        </a>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={styles.box}>

                                <div id="code-tab">
                                    <Tabs defaultActiveKey="sample1" id="code" className="mb-3 codeTabs">
                                        <Tab eventKey="sample1" title="Sample 1">
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: effort1.code }} />
                                            </div>
                                        </Tab>
                                        <Tab eventKey="sample2" title="Sample 2">
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: effort2.code }} />
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* powered */}
            <Row className="pageContentRow integration code odd">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='create-ai-powered-apis' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'create-ai-powered-apis')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {powered.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{powered.frontmatter.description}</ReactMarkdown>

                                    {
                                        (powered.frontmatter.url && powered.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <span>Question answering with OpenAI</span>
                                                <a href={powered.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
                                                    <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                                    View code on GitHub
                                                </a>
                                            </div>
                                            : null
                                    }

                                    <div className={styles.dVersion}>
                                        <a href='/usecases/integration' className={styles.cDownload} target="_blank" rel="noreferrer">
                                            Take a deeper dive into using Ballerina for integration.
                                        </a>
                                    </div>

                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={styles.box}>
                                {
                                    (powered.code && powered.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: powered.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (powered.frontmatter.image && powered.frontmatter.image !== '') ?
                                        <img src={`${prefix}/${powered.frontmatter.image}`} alt={powered.frontmatter.title} />
                                        : null
                                }
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* robust */}
            <Row className="pageContentRow integration code">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='write-robust-api-powered-ai-applications' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'write-robust-api-powered-ai-applications')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {robust.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{robust.frontmatter.description}</ReactMarkdown>

                                    {
                                        (robust.frontmatter.url && robust.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <span>Grammar and spelling correction in text using OpenAI</span>
                                                <a href={robust.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
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
                                    (robust.code && robust.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: robust.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (robust.frontmatter.image && robust.frontmatter.image !== '') ?
                                        <img src={`${prefix}/${robust.frontmatter.image}`} alt={robust.frontmatter.title} />
                                        : null
                                }
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* concurrency*/}
            <Row className="pageContentRow integration code odd">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='concurrency-simplified-for-ai-development' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'concurrency-simplified-for-ai-development')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {concurrency.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{concurrency.frontmatter.description}</ReactMarkdown>

                                    {
                                        (concurrency.frontmatter.url && concurrency.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <span>Personalized greetings with custom design using OpenAI</span>
                                                <a href={concurrency.frontmatter.url} className={styles.cDownload} target="_blank" rel="noreferrer">
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
                                    (concurrency.code && concurrency.code !== '') ?
                                        <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: concurrency.code }} />
                                        </div>
                                        : null
                                }
                                {
                                    (concurrency.frontmatter.image && concurrency.frontmatter.image !== '') ?
                                        <img src={`${prefix}/${concurrency.frontmatter.image}`} alt={concurrency.frontmatter.title} />
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
