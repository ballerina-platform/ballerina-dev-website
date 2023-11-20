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
    const files = fs.readdirSync('policy');
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

    const fileName = fs.readFileSync(`policy/${slug}.md`, 'utf-8');
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
                    content="A programming language for the cloud that makes it easier to use, combine, and create network services."
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
                    content="A programming language for the cloud that makes it easier to use, combine, and create network services."
                />

                {/* <!--LINKED IN  --> */}
                <meta property="og:title" content={`${frontmatter.title} - The Ballerina programming language`} />

                {/* <!--TWITTER--> */}
                <meta name="twitter:title" content={`${frontmatter.title} - The Ballerina programming language`}/>
                <meta
                    property="twitter:description"
                    content="A programming language for the cloud that makes it easier to use, combine, and create network services."
                />
                <meta
                    property="twitter:text:description"
                    content="A programming language for the cloud that makes it easier to use, combine, and create network services."
                />
            </Head>
            <Layout>
                <Col xs={12} sm={10} className="policyContent">
                    <Row className="topRow innerRow">
                        <Col xs={11}>
                            <h1>{frontmatter.title}</h1>
                        </Col>
                        <Col xs={1} className="gitIcon">
                            <a
                                href={`${process.env.gitHubPath}policy/${slug}.md`}
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

                    <Row className="pageContentRow innerRow">
                        <Col xs={12}>
                            <MainContent
                                content={content}
                                handleToc={handleToc} />
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
