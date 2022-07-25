import fs from "fs";
import { load } from "js-yaml";
import React, { useState, useEffect } from "react";
import { Container, Col } from "react-bootstrap";
import BBEs from "../../../swan-lake/by-example";
import Head from "next/head";
import Layout from "../../../layouts/LayoutDocs";
import LeftNavYaml from "../../../components/common/left-nav/LeftNavYaml";
import Link from "next/link";

export async function getStaticPaths() {
  const bbes = fs.readdirSync("swan-lake/by-example");
  const paths = [];

  bbes.forEach((bbeDir) => {
    const relDir = `swan-lake/by-example/${bbeDir}`;
    if (fs.statSync(relDir).isDirectory()) {
      paths.push({
        params: {
          bbe: bbeDir,
        },
      });
    }
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { bbe } }) {
  const frontmatterString = fs.readFileSync(
    `swan-lake/by-example/${bbe}/liquid.json`
  );
  const navContentString = fs.readFileSync(
    "_data/ballerina-by-example-nav.yml",
    "utf-8"
  );
  const navContent = load(navContentString);
  const frontmatter = JSON.parse(frontmatterString);
  return {
    props: {
      frontmatter,
      navContent,
      bbe,
    },
  };
}

export default function BBEPage({ frontmatter, navContent, bbe }) {
  const [bbeComponent, updateBBE] = useState(null);

  useEffect(() => {
    if (bbe != undefined) {
      // update component
      const splitUrl = bbe
        .split("-")
        .map((word) => word[0].toUpperCase() + word.slice(1));
      const bbeComponentName = splitUrl.join("");
      const BBE = BBEs[bbeComponentName];
      updateBBE(<BBE />);
    }
  }, [bbe]);

  return (
    <>
      <Head>
        <meta name="description" content={frontmatter.description} />
        <meta name="keywords" content={frontmatter.keywords} />

        <title>{frontmatter.title}</title>

        {/* <!--FB--> */}
        <meta property="og:type" content="article" />
        <meta
          property="og:title"
          content={`Ballerina - ${frontmatter.title}`}
        />

        {/* <!--LINKED IN  --> */}
        <meta property="og:description" content={frontmatter.description} />

        {/* <!--TWITTER--> */}
        <meta
          property="twitter:description"
          content={frontmatter.description}
        />
        <meta
          property="twitter:text:description"
          content={frontmatter.description}
        />
      </Head>

      <Layout>
        <Col sm={3} xxl={2} className="leftNav d-none d-sm-block">
          <Link href="/learn/by-example" passHref>
            <div className="backToExample my-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="#3ad1ca"
                className="bi bi-box-arrow-left"
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
              <p className="m-0 p-0">Back to Examples</p>
            </div>
          </Link>
          <LeftNavYaml navContent={navContent} bbe={bbe} />
        </Col>
        <Col xs={12} className="d-block d-sm-none">
          Mobile Left Nav
        </Col>
        <Col xs={12} sm={9} xxl={10} className="mdContent">
          <Container className="h-100">
            {bbeComponent != null && bbeComponent}
          </Container>
        </Col>
      </Layout>
    </>
  );
}
