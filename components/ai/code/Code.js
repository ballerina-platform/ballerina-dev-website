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

// Anchor ids used by earlier versions of this page. They are kept as empty
// targets so that existing deep links still land on the closest section.
const LEGACY_ANCHORS = {
    'simple-when-you-want-it': ['bring-text-alive-with-openai-chat'],
    'enterprise-knowledge': ['why-is-ballerina-the-way-you-should-write-ai-applications'],
    'agents': ['ballerina-ai-agent'],
    'multimodal-ai': ['ballerina_multimodel'],
    'natural-expressions': ['ai-powered-blog-analyzer-using-natural-programming'],
    'ai-assisted-development': [
        'copilot_your_partner',
        'natural-programming-vs-code-features',
        'natural-programming-complie-time-code-generation',
    ],
};

const withPrefix = (url) => (url.startsWith('/') ? `${prefix}${url}` : url);
const isExternal = (url) => /^https?:\/\//.test(url);
const isGitHub = (url) => /^https:\/\/github\.com\//.test(url);
const defaultAction = (url) => {
    if (isGitHub(url)) return 'View code on GitHub';
    if (url.startsWith('/learn/by-example/')) return 'View example';
    return 'Open page';
};

export function SectionHeading({ id, title, getLink, legacyIds = [] }) {
    return (
        <>
            {legacyIds.map((legacyId) => (
                <span key={legacyId} id={legacyId} className={styles.legacyAnchor} aria-hidden="true" />
            ))}
            <h2 id={id} className='section'>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    className="bi bi-link-45deg mdButton pe-2"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    onClick={(e) => getLink(e.target, id)}
                >
                    <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                    <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                </svg>
                {title}
            </h2>
        </>
    );
}

export function ResourceLink({ label, url, action }) {
    const external = isExternal(url);
    const github = isGitHub(url);
    return (
        <div className={styles.dVersion}>
            {label ? <span>{label}</span> : null}
            <a
                href={withPrefix(url)}
                className={styles.cDownload}
                {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
                {github ?
                    <Image src={`${prefix}/images/sm-icons/github-grey.svg`} width={20} height={20} alt="" className="doNotFill" />
                    : null}
                {action || defaultAction(url)}
                {external && !github ? <span className="visually-hidden"> (opens in a new tab)</span> : null}
            </a>
        </div>
    );
}

// Root-relative links in Markdown get the site base path, like ResourceLink.
const markdownComponents = {
    a: ({ node, href, children, ...props }) => (
        <a href={href ? withPrefix(href) : href} {...props}>{children}</a>
    ),
};

export function Markdown({ children }) {
    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={markdownComponents}>
            {children}
        </ReactMarkdown>
    );
}

function SectionRow({ odd, children }) {
    return (
        <Row className={`pageContentRow integration code${odd ? ' odd' : ''}`}>
            <Col xs={12}>
                <Container>
                    {children}
                </Container>
            </Col>
        </Row>
    );
}

function CapabilitySection({ section, odd, getLink }) {
    const code = section.tabs.length > 0 ? section.tabs[0].code : '';
    return (
        <SectionRow odd={odd}>
            <Row>
                <Col xs={12} className={styles.box}>
                    <SectionHeading
                        id={section.id}
                        title={section.title}
                        getLink={getLink}
                        legacyIds={LEGACY_ANCHORS[section.id] || []}
                    />
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={5} lg={5} className={styles.box}>
                    <div className={styles.wrapper}>
                        <Markdown>{section.description}</Markdown>
                        {section.details ?
                            <div className={styles.details}>
                                <Markdown>{section.details}</Markdown>
                            </div>
                            : null}

                        {section.guide && section.guide.url ?
                            <ResourceLink
                                label="Learn guide"
                                url={section.guide.url}
                                action={section.guide.label || 'Read the guide'}
                            />
                            : null}

                        {section.samples.map((sample) => (
                            <ResourceLink key={sample.url} label={sample.label} url={sample.url} />
                        ))}
                    </div>
                </Col>
                <Col xs={12} md={7} lg={7} className={styles.box}>
                    {code ?
                        <div className={styles.codeSnippet}>
                            <div className="highlight" dangerouslySetInnerHTML={{ __html: code }} />
                        </div>
                        : null}
                </Col>
            </Row>
        </SectionRow>
    );
}

export default function Code({ sections, getLink }) {
    const count = sections.length;
    return (
        <>
            {sections.map((section, index) => (
                <CapabilitySection
                    key={section.id}
                    section={section}
                    odd={index % 2 === 0}
                    getLink={getLink}
                />
            ))}

            {/* related: AI-assisted development */}
            <SectionRow odd={count % 2 === 0}>
                <Row>
                    <Col xs={12} className={styles.box}>
                        <SectionHeading
                            id="ai-assisted-development"
                            title="Related: AI-assisted development"
                            getLink={getLink}
                            legacyIds={LEGACY_ANCHORS['ai-assisted-development']}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={8} className={styles.box}>
                        <div className={styles.wrapper}>
                            <p>
                                The capabilities above run inside your integration. Editor and build-time
                                assistance for writing that integration, including Copilot, requirements-to-code,
                                drift detection, and experimental compile-time code generation, is covered on its own page.
                            </p>
                            <ResourceLink
                                url="/use-cases/ai/ai-assisted-development/"
                                action="Explore AI-assisted development"
                            />
                        </div>
                    </Col>
                </Row>
            </SectionRow>

            {/* WSO2 Integration Platform */}
            <SectionRow odd={count % 2 !== 0}>
                <Row>
                    <Col xs={12} className={styles.box}>
                        <SectionHeading
                            id="deploy-ai-powered-integrations-with-wso2-integration-platform"
                            title="(Extra!) Deploy AI-Powered Integrations with WSO2 Integration Platform"
                            getLink={getLink}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={5} lg={5} className={styles.box}>
                        <div className={styles.wrapper}>
                            <p>
                                WSO2 Integration Platform is an AI-powered iPaaS built for the era of intelligent applications. Go beyond building—deploy, scale, and manage AI integrations effortlessly. Whether it&apos;s GenAI models, knowledge bases, or custom AI agents, the platform helps you operationalize them with low-code speed and cloud-native ease. From idea to live integration—it gets you there faster.
                            </p>
                            <div className={styles.dVersion}>
                                <a href="https://wso2.com/integration-platform/" className={styles.cDownload} target="_blank" rel="noreferrer">
                                    Get started with WSO2 Integration Platform for free
                                    <span className="visually-hidden"> (opens in a new tab)</span>
                                </a>
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} md={7} lg={7} className={`${styles.box} ${styles.ipaas}`}>
                        <img src={`${prefix}/images/devant-ipaas.png`} alt="WSO2 Integration Platform" />
                    </Col>
                </Row>
            </SectionRow>
        </>
    );
}
