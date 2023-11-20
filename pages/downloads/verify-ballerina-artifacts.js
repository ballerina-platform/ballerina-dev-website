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
import { Liquid } from "liquidjs";

import Layout from "../../layouts/LayoutOther";
import MainContent from "../../components/common/main-content/MainContent";
import { prefix } from "../../utils/prefix";
import Toc from "../../components/common/pg-toc/Toc";
import SwanLake from "../../_data/swanlake-latest/metadata.json";


export async function getStaticProps() {

    const fileName = fs.readFileSync(`downloads/verify-ballerina-artifacts.md`, "utf-8");
    const { data: frontmatter, content } = matter(fileName);
    const id = "installation-options";

    return {
        props: {
            frontmatter,
            content,
            id,
        },
    };
}

export default function PostPage({ frontmatter, content, id }) {

    // Show page toc
    const [showToc, setShowToc] = React.useState(false);

    const handleToc = (data) => {
        setShowToc(data)
    }

    function replaceAfterSecondPeriod(str) {
        const regex = /^(\d+\.\d+\.)/;
        const match = str.match(regex);

        if (match && match[1]) {
            return match[1] + 'x';
        }
        
        return '';
    }

    const branch = replaceAfterSecondPeriod(SwanLake.version);

    // Update values in markdown files
    const engine = new Liquid();
    const AddLiquid = (content) => {
        const [newContent, setNewContent] = React.useState("");
        const md = engine.parse(content);
        engine
            .render(md, {
                v: "Liquid",
                "windows-installer-size": SwanLake["windows-installer-size"],
                dist_server: process.env.distServer,
                version: SwanLake.version,
                branch: branch,
                "windows-installer": SwanLake["windows-installer"],
                "linux-installer": SwanLake["linux-installer"],
                "linux-installer-size": SwanLake["linux-installer-size"],
                "rpm-installer": SwanLake["rpm-installer"],
                "rpm-installer-size": SwanLake["rpm-installer-size"],
                "macos-installer": SwanLake["macos-installer"],
                "macos-installer-size": SwanLake["macos-installer-size"],
                "macos-arm-installer": SwanLake["macos-arm-installer"],
                "macos-arm-installer-size": SwanLake["macos-arm-installer-size"],
                "other-artefacts": SwanLake["other-artefacts"],
            })
            .then((md) => {
                setNewContent(md);
            });
        return newContent;
    };

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
                <meta name="twitter:title" content={`${frontmatter.title} - The Ballerina programming language`} />
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
                                href={`${process.env.gitHubPath}downloads/${id}.md`}
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
                                content={AddLiquid(content)}
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
