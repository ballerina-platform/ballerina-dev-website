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

    const agent = samples['ballerina-ai-agent'];

    const text_connectors = samples['ballerina_text_connectors'];
    const text_connectors_chat1 = samples['openai1'];
    const text_connectors_chat2 = samples['openai2'];
    const text_connectors_chat3 = samples['openai3'];

    const multimodel = samples['ballerina_multimodel'];
    const multimodel_1 = samples['multimodel1'];
    const multimodel_2 = samples['multimodel2'];
    const multimodel_3 = samples['multimodel3'];
    const multimodel_4 = samples['multimodel4'];

    const copilot = samples['copilot_your_partner'];
    const npVsCodeFeatures = samples['natural_programming_vs_code_features'];
    const npCompileTimeCodeGeneration = samples['natural_programming_compile_time_code_generation'];

    const npCode = samples['natural_expressions'];
    const npCompileTimeCodegenerationCode = samples['natural_programming_compile_time_code_generation_code'];
    const npConstCompileTimeCodegenerationCode = samples['natural_programming_const_compile_time_code_generation_code'];

    const ipaas = samples['hosting_ipaas'];
    const np = samples['blog-analyzer-using-natural-programming'];

    var isResizing = false;

    React.useEffect(() => {
        addDragHandler(
          document.getElementById("code-container"),
          document.getElementById("left_panel"),
          document.getElementById("right_panel"),
          document.getElementById("drag")
        );

        addDragHandler(
          document.getElementById("agent-code-container"),
          document.getElementById("agent-left_panel"),
          document.getElementById("agent-right_panel"),
          document.getElementById("agent-drag")
        );
    }, []);

    function addDragHandler(container, left, right, handle) {
      let isResizing = false;

      handle.addEventListener("mousedown", function (e) {
        isResizing = true;

        function onMouseMove(e) {
          if (!isResizing) return;

          var offsetRight =
            container.clientWidth - (e.clientX - container.offsetLeft);

          if (e.clientX - container.offsetLeft <= 50 || offsetRight <= 50) {
            isResizing = false;
            return;
          }

          left.style.right = offsetRight + "px";
          right.style.width = offsetRight + "px";
        }

        function onMouseUp() {
          isResizing = false;
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
        }
        
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });
    }

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

                                    {
                                        (why.frontmatter.url && why.frontmatter.url !== '') ?
                                            <div className={styles.dVersion}>
                                                <span>HR Retrieval Augmented Generation Application</span>
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
                                        <div className="code-panel" dangerouslySetInnerHTML={{ __html: why.code }} />
                                    </div>
                                    <div id="right_panel">
                                        <div id="drag">
                                            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute button-wrap" ><circle cx="23" cy="23" r="23" fill="#20b6b0"></circle><path d="M10.4375 22.5625C10.4375 22.2988 10.5254 22.0645 10.7012 21.8887L16.3262 16.2637C16.6777 15.8828 17.293 15.8828 17.6445 16.2637C18.0254 16.6152 18.0254 17.2305 17.6445 17.582L12.6934 22.5625L17.6445 27.5137C18.0254 27.8652 18.0254 28.4805 17.6445 28.832C17.293 29.2129 16.6777 29.2129 16.3262 28.832L10.7012 23.207C10.5254 23.0312 10.4375 22.7969 10.4375 22.5625Z" fill="white"></path><path d="M35.5625 22.5625C35.5625 22.2988 35.4746 22.0645 35.2988 21.8887L29.6738 16.2637C29.3223 15.8828 28.707 15.8828 28.3555 16.2637C27.9746 16.6152 27.9746 17.2305 28.3555 17.582L33.3066 22.5625L28.3555 27.5137C27.9746 27.8652 27.9746 28.4805 28.3555 28.832C28.707 29.2129 29.3223 29.2129 29.6738 28.832L35.2988 23.207C35.4746 23.0312 35.5625 22.7969 35.5625 22.5625Z" fill="white"></path></svg>
                                        </div>

                                        <p className='title-new'>Diagram</p>
                                        <div className="code-panel diagram-multi" style={{textAlign: 'center'}}>
                                            <Image src={`${prefix}/images/ai_project_comp.png`} width={381} height={540} padding={30} alt="Diagram" />
                                        </div>
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
                                            <img src={`${prefix}/images/ai_project_comp.png`} width={381} height={540} alt="Diagram" />
                                        </Tab>
                                    </Tabs>
                                </div>

                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

             {/* agent */}
             <Row className="pageContentRow integration code">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='ballerina-ai-agent' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'ballerina-ai-agent')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {agent.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{agent.frontmatter.description}</ReactMarkdown>
                                    <div className={styles.dVersion}>
                                        <span>Personal Assistant with Calendar and Email Management</span>
                                        <a href='https://github.com/ballerina-guides/ai-samples/blob/main/personal_ai_assistant_agent' className={styles.cDownload} target="_blank" rel="noreferrer">
                                            <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                            View code on GitHub
                                        </a>
                                    </div>                            
                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={`${styles.box}`}>
                                <div id="agent-code-container" className='d-none d-lg-block'>
                                    <div id="agent-left_panel">
                                        <p className='title-old'>Code</p>
                                        <div className="code-panel" dangerouslySetInnerHTML={{ __html: agent.code }} />
                                    </div>
                                    <div id="agent-right_panel">
                                        <div id="agent-drag">
                                            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute button-wrap" ><circle cx="23" cy="23" r="23" fill="#20b6b0"></circle><path d="M10.4375 22.5625C10.4375 22.2988 10.5254 22.0645 10.7012 21.8887L16.3262 16.2637C16.6777 15.8828 17.293 15.8828 17.6445 16.2637C18.0254 16.6152 18.0254 17.2305 17.6445 17.582L12.6934 22.5625L17.6445 27.5137C18.0254 27.8652 18.0254 28.4805 17.6445 28.832C17.293 29.2129 16.6777 29.2129 16.3262 28.832L10.7012 23.207C10.5254 23.0312 10.4375 22.7969 10.4375 22.5625Z" fill="white"></path><path d="M35.5625 22.5625C35.5625 22.2988 35.4746 22.0645 35.2988 21.8887L29.6738 16.2637C29.3223 15.8828 28.707 15.8828 28.3555 16.2637C27.9746 16.6152 27.9746 17.2305 28.3555 17.582L33.3066 22.5625L28.3555 27.5137C27.9746 27.8652 27.9746 28.4805 28.3555 28.832C28.707 29.2129 29.3223 29.2129 29.6738 28.832L35.2988 23.207C35.4746 23.0312 35.5625 22.7969 35.5625 22.5625Z" fill="white"></path></svg>
                                        </div>
                                        <p className='title-new'>Diagram</p>
                                        <div className="code-panel diagram">
                                            <Image src={`${prefix}/images/agent-diagram.png`} width={520} height={548} alt="Diagram" />
                                        </div>
                                    </div>
                                </div>


                                {/* mobile view */}
                                <div id="code-tab" className='d-block d-lg-none'>
                                    <Tabs defaultActiveKey="code" id="codeTab1" className="mb-3 codeTabs">
                                        <Tab eventKey="code" title="Code">
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: agent.code }} />
                                            </div>
                                        </Tab>
                                        <Tab eventKey="diagram" title="Diagram">
                                            <img src={`${prefix}/images/agent-diagram.png`} width={520} height={548} alt="Diagram" />
                                        </Tab>
                                    </Tabs>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* np */}
            <Row className="pageContentRow integration code odd">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='ai-powered-blog-analyzer-using-natural-programming' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'ai-powered-blog-analyzer-using-natural-programming')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {np.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{np.frontmatter.description}</ReactMarkdown>
                                    <div className={styles.dVersion}>
                                        <span>Sample: Building an AI-Powered Blog Analyzer Using Ballerina&apos;s Natural Expressions</span>
                                        <a href='https://github.com/ballerina-guides/ai-samples/blob/main/rate-blog-posts-using-natural-expressions/main.bal' className={styles.cDownload} target="_blank" rel="noreferrer">
                                            <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                            View code on GitHub
                                        </a>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={styles.box}>
                                <div id="code-tab">
                                    <div className={styles.codeSnippet}>
                                            <div className="highlight" dangerouslySetInnerHTML={{ __html: npCode.code }} />
                                            </div>
                                    </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* compile time code generation */}
            <Row className="pageContentRow integration code">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='natural-programming-complie-time-code-generation' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'natural-programming-complie-time-code-generation')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {npCompileTimeCodeGeneration.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{npCompileTimeCodeGeneration.frontmatter.description}</ReactMarkdown>
                                </div>
                                <div className={styles.dVersion}>
                                    <span>Sample: Building an AI-Powered Blog Analyzer Using Ballerina&apos;s Natural Expressions</span>
                                    <a href='https://github.com/ballerina-guides/ai-samples/tree/main/compile-time-code-generation-with-order-system' className={styles.cDownload} target="_blank" rel="noreferrer">
                                        <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                        View code on GitHub
                                    </a>
                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={styles.box}>
                                <div id="code-tab">
                                    <Tabs defaultActiveKey="compileCodeGeneration" id="code" className="mb-3 codeTabs">
                                        <Tab eventKey="compileCodeGeneration" title="AI-synthesized function bodies">
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: npCompileTimeCodegenerationCode.code }} />
                                            </div>
                                        </Tab>
                                        <Tab eventKey="constCompileCodeGeneration" title="Constant natural expressions">
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: npConstCompileTimeCodegenerationCode.code }} />
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* copilot */}
            <Row className="pageContentRow integration code odd">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='copilot_your_partner' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'copilot_your_partner')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {copilot.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{copilot.frontmatter.description}</ReactMarkdown>
                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={styles.box}>
                                <div id="code-tab">
                                    <Tabs defaultActiveKey="copilotView1" id="code" className="mb-3 codeTabs">
                                        <Tab eventKey="copilotView1" title="Code generation">
                                            <div className={styles.codeSnippet}>
                                                <img src={`${prefix}/images/ai_codegen.png`}/>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="copilotView2" title="AI Data Mapper">
                                        <div className={styles.codeSnippet}>
                                                <img src={`${prefix}/images/ai_datamapper.png`}/>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="copilotView3" title="Ask Ballerina">
                                        <div className={styles.codeSnippet}>
                                                <img src={`${prefix}/images/ai_ask.png`}/>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="copilotView4" title="Test generation">
                                        <div className={styles.codeSnippet}>
                                                <img src={`${prefix}/images/ai_test.png`}/>
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* natural programming UX */}
            <Row className="pageContentRow integration code">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='natural-programming-vs-code-features' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'natural-programming-vs-code-features')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {npVsCodeFeatures.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{npVsCodeFeatures.frontmatter.description}</ReactMarkdown>
                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={styles.box}>
                                <div id="code-tab">
                                    <Tabs defaultActiveKey="npVsCodeFeaturesView2" id="code" className="mb-3 codeTabs">
                                        <Tab eventKey="npVsCodeFeaturesView1" title="Code from requirements">
                                            <div className={styles.codeSnippet}>
                                                <img src={`${prefix}/images/np_code_generation_from_requirements.png`}/>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="npVsCodeFeaturesView2" title="Drift Detection & Fixes">
                                        <div className={styles.codeSnippet}>
                                                <img src={`${prefix}/images/np_drift_check.gif`}/>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="npVsCodeFeaturesView3" title="Tests from requirements">
                                        <div className={styles.codeSnippet}>
                                                <img src={`${prefix}/images/np_test_generation_from_requirements.png`}/>
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* text connectors */}
            <Row className="pageContentRow integration code odd">
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
                                    {text_connectors.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{text_connectors.frontmatter.description}</ReactMarkdown>
                                    <div className={styles.dVersion}>
                                        <span>Sample 1: Summarize text using OpenAI</span>
                                        <a href='https://github.com/ballerina-guides/ai-samples/blob/main/summarize_text_using_openai/main.bal' className={styles.cDownload} target="_blank" rel="noreferrer">
                                            <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                            View code on GitHub
                                        </a>
                                    </div>

                                    <div className={styles.dVersion}>
                                        <span>Sample 2: Function Calling using OpenAI</span>
                                        <a href='https://github.com/xlight05/ai-samples/blob/usecase-samples/function_calling/main.bal' className={styles.cDownload} target="_blank" rel="noreferrer">
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
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: text_connectors_chat1.code }} />
                                            </div>
                                        </Tab>
                                        <Tab eventKey="chat2" title="Sample 2">
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: text_connectors_chat2.code }} />
                                            </div>
                                        </Tab>
                                        <Tab eventKey="chat3" title="Sample 3">
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: text_connectors_chat3.code }} />
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* multimodal */}
            <Row className="pageContentRow integration code">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='ballerina_multimodel' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'ballerina_multimodel')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {multimodel.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{multimodel.frontmatter.description}</ReactMarkdown>
                                    <div className={styles.dVersion}>
                                        <span>Sample 1: Describe an image using OpenAI</span>
                                        <a href='https://github.com/xlight05/ai-samples/blob/usecase-samples/describe_photo/main.bal' className={styles.cDownload} target="_blank" rel="noreferrer">
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
                                        <span>Sample 3: Convert audio to text and translate using OpenAI</span>
                                        <a href='https://github.com/ballerina-guides/ai-samples/blob/main/convert_audio_to_text_and_translate_using_openai/main.bal' className={styles.cDownload} target="_blank" rel="noreferrer">
                                            <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                            View code on GitHub
                                        </a>
                                    </div>

                                    <div className={styles.dVersion}>
                                        <span>Sample 4: Audio-to-text summarization using OpenAI</span>
                                        <a href='https://github.com/ballerina-guides/ai-samples/blob/main/audio_to_text_summarization_using_openai/main.bal' className={styles.cDownload} target="_blank" rel="noreferrer">
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
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: multimodel_1.code }} />
                                            </div>
                                        </Tab>
                                        <Tab eventKey="dalle2" title="Sample 2">
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: multimodel_2.code }} />
                                            </div>
                                        </Tab>
                                        <Tab eventKey="dalle3" title="Sample 3">
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: multimodel_3.code }} />
                                            </div>
                                        </Tab>
                                        <Tab eventKey="dalle4" title="Sample 4">
                                            <div className={styles.codeSnippet}>
                                                <div className="highlight" dangerouslySetInnerHTML={{ __html: multimodel_4.code }} />
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            {/* devant */}
            <Row className="pageContentRow integration code odd">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='deploy-ai-powered-integrations-with-devant' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'deploy-ai-powered-integrations-with-devant')}
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
                                                    Get started with Devant by WSO2 for free
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
