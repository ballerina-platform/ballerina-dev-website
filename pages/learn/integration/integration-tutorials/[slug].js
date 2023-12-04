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

import fs from "fs";
import matter from "gray-matter";
import React from "react";
import { Col, Row } from "react-bootstrap";
import Image from "next-image-export-optimizer";
import Head from "next/head";
import Link from "next/link";

import Layout from "../../../../layouts/LayoutOther";
import MainContent from "../../../../components/common/main-content/MainContent";
import { prefix } from "../../../../utils/prefix";
import Toc from "../../../../components/common/pg-toc/Toc";
import { highlight } from "../../../../utils/highlighter";

export async function getStaticPaths() {
    // Retrieve all our slugs
    const files = fs.readdirSync('swan-lake/integration-tutorials');
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

    const fileName = fs.readFileSync(`swan-lake/integration-tutorials/${slug}.md`, 'utf-8');
    const { data: frontmatter, content } = matter(fileName);
    let codes = await highlight(content);
    return {
        props: {
            frontmatter,
            content,
            slug,
            codes
        },
    };
}

export default function PostPage({ frontmatter, content, slug, codes }) {

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
                    content="ballerinalang, integration, microservices, programming language, cloud native, ballerina language"
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
                    content="https://ballerina.io/images/ballerina-learn-integration-tutorials-page-sm-banner.png"
                />

                {/* <!--LINKED IN  --> */}
                <meta property="og:title" content={`${frontmatter.title} - The Ballerina programming language`} />
                <meta
                    property="og:image"
                    content="https://ballerina.io/images/ballerina-learn-integration-tutorials-page-sm-banner.png"
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
                    content="https://ballerina.io/images/ballerina-learn-integration-tutorials-page-sm-banner.png"
                />
            </Head>
            <Layout>
                <Col xs={12} sm={10} className="mdContent">
                    <Row>
                        <Col xs={12} className="patternContent" style={{ marginBottom: "20px;" }}>
                            <Link href="/learn/integration-tutorials" passHref>
                                <div className="backToLanding">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="#3ad1ca"
                                        className="bi bi-box-arrow-left ms-0"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"
                                        />
                                        <path
                                            fillRule="evenodd"
                                            d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"
                                        />
                                    </svg>
                                    <p className="m-0 p-0">Back to integration tutorials</p>
                                </div>
                            </Link>
                        </Col>
                    </Row>
                    <Row className="topRow innerRow">
                        <Col xs={11}>
                            <h1>{frontmatter.title}</h1>
                        </Col>
                        <Col xs={1} className="gitIcon">
                            <a
                                href={`${process.env.gitHubPath}swan-lake/integration-tutorials/${slug}.md`}
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
                        <Col xs={12}>
                            <p>{frontmatter.intro}</p>
                        </Col>
                    </Row>

                    <Row className="pageContentRow innerRow">
                        <Col xs={12}>
                            <MainContent
                                content={content}
                                handleToc={handleToc}
                                codes={codes} />
                        </Col>
                    </Row>
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
