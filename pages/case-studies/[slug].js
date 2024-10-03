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

import fs from "fs";
import matter from "gray-matter";
import React from "react";
import { Col, Row } from "react-bootstrap";
import Image from "next-image-export-optimizer";
import Head from "next/head";

import Layout from "../../layouts/LayoutOther";
import MainContent from "../../components/common/main-content/MainContent";
import { prefix } from "../../utils/prefix";
import Toc from "../../components/common/pg-toc/Toc";

export async function getStaticPaths() {
    // Retrieve all our slugs
    const files = fs.readdirSync('case-studies');
    const paths = files.map((fileName) => ({
        params: {
            slug: fileName.replace('.md', ''),
        },
    }));

    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params: { slug } }) {

    const fileName = fs.readFileSync(`case-studies/${slug}.md`, 'utf-8');
    const { data: frontmatter, content } = matter(fileName);

    return {
        props: {
            frontmatter,
            content,
            slug
        },
    };
}

export default function PostPage({ frontmatter, content, slug }) {

    // Show page toc
    const [showToc, setShowToc] = React.useState(false);

    const handleToc = (data) => {
        setShowToc(data)
    }

    return (
        <>
            <Head>
                <meta
                    name="description"
                    content={frontmatter.description}
                />
                <meta
                    name="keywords"
                    content={frontmatter.keywords}
                />

                <title>{`${frontmatter.title} - The Ballerina programming language`}</title>

                {/* <!--FB--> */}
                <meta property="og:type" content="article" />
                <meta
                    property="og:title"
                    content={`${frontmatter.title} - The Ballerina programming language`}
                />
                <meta
                    property="og:description"
                    content={frontmatter.description}
                />
                <meta
                    property="og:image"
                    itemProp="image"
                    content={`https://ballerina.io/images/case-studies/${frontmatter.user}-sm-banner.png`}
                />

                {/* <!--LINKED IN  --> */}
                <meta property="og:title" content={`${frontmatter.title} - The Ballerina programming language`} />
                <meta
                    property="og:image"
                    content={`https://ballerina.io/images/case-studies/${frontmatter.user}-sm-banner.png`}
                />

                {/* <!--TWITTER--> */}
                <meta name="twitter:title" content={`${frontmatter.title} - The Ballerina programming language`} />
                <meta
                    property="twitter:description"
                    content={frontmatter.description}
                />
                <meta
                    property="twitter:text:description"
                    content={frontmatter.description}
                />
                <meta
                    name="twitter:image"
                    content={`https://ballerina.io/images/case-studies/${frontmatter.user}-sm-banner.png`}
                />
            </Head>
            <Layout>
                <Col xs={12} sm={10} className="mdContent caseStudies">
                    <Row className="topRow innerRow">
                        <Col xs={11}>
                            <h1>{frontmatter.title}</h1>
                        </Col>
                        <Col xs={1} className="gitIcon">
                            <a
                                href={`${process.env.gitHubPath}case-studies/${slug}.md`}
                                target="_blank"
                                rel="noreferrer"
                                title="Edit in GitHub"
                            >
                                <Image
                                    src={`${prefix}/images/sm-icons/github.svg`}
                                    height={20}
                                    width={20}
                                    alt="Edit in GitHub"
                                />
                            </a>
                        </Col>
                    </Row>

                    <Row className="pageContentRow innerRow" style={{ marginTop: '40px', marginBottom: "0", alignItems: "center" }}>
                        <Col xs={12} md={8}>
                            <p>{frontmatter.intro}</p>
                        </Col>
                        <Col xs={12} md={3} className={slug == 'fat-tuesday' ? `vLogo` : null}>
                            <img src={frontmatter.logo} alt={`${slug} logo`} title={`${slug} logo`} />
                        </Col>
                    </Row>

                    <Row className="pageContentRow innerRow">
                        <Col xs={12}>
                            <MainContent
                                content={content}
                                handleToc={handleToc} />
                        </Col>
                    </Row>

                    {
                        frontmatter.disclaimer && <Row className="pageContentRow innerRow">
                            <Col xs={12}>
                                <p className="disclaimer">
                                    The logos and marks used in this page :  {frontmatter.disclaimer}, belong to the respective trademark owners and WSO2 excludes any and all copyrights, trademarks, rights and interests in those logos and marks.
                                </p>
                            </Col>
                        </Row>

                    }

                </Col>
                <Col sm={2} className="pageToc d-none d-sm-block">
                    {showToc ? (
                        <>
                            <h6>On this page</h6>
                            <Toc source={content} />
                        </>
                    ) : null}
                </Col>
            </Layout>
        </>
    );
}
