import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import fs from "fs";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../../layouts/LayoutDocs";
import { load } from "js-yaml";
import LeftNavYaml from "../../../components/common/left-nav/LeftNavYaml";

function toKebabCase(str) {
  return str.replace(/\s/g, "-").toLowerCase();
}

export async function getStaticProps() {
  const bbesJson = JSON.parse(
    fs.readFileSync("swan-lake/by-example/all-bbes.json", "utf-8")
  );
  const navContent = load(
    fs.readFileSync("_data/ballerina-by-example-nav.yml", "utf-8")
  );

  return {
    props: {
      navContent,
      bbesJson,
    },
  };
}

export default function BBEPage({ navContent, bbesJson }) {
  function ListBBEs() {
    let currentCategory = "",
      currentColumn = 0,
      output = [],
      rowData = [],
      colData = [];
    for (let category of bbesJson) {
      let sampleData = [];

      if (
        currentColumn !== category.column ||
        currentCategory !== category.category
      ) {
        if (colData.length > 0) {
          rowData.push(
            <Col md={3} sm={16} xs={12}>
              {colData}
            </Col>
          );

          currentColumn = category.column;
          colData = [];
        }
      }

      for (let bbe of category.samples) {
        sampleData.push(
          <Link href={`/learn/by-example/${bbe.url}`} passHref>
            <li className="ps-3 my-1 fw-light">{bbe.name}</li>
          </Link>
        );
      }

      colData.push(
        <ul className="p-0 my-1" id={toKebabCase(category.title)}>
          <Link
            href={`/learn/by-example#${toKebabCase(category.title)}`}
            passHref
          >
            <li className="fw-bold">{category.title}</li>
          </Link>
          {sampleData}
        </ul>
      );
      sampleData = [];

      if (currentCategory !== category.category) {
        if (rowData.length > 0) {
          output.push(<Row>{rowData}</Row>);
          rowData = [];
        }

        currentCategory = category.category;
        output.push(<h4 className="my-4">{currentCategory}</h4>);
        output.push(<hr />);
      }
    }

    rowData.push(
      <Col md={3} sm={16} xs={12}>
        {colData}
      </Col>
    );

    output.push(<Row>{rowData}</Row>);

    return <div className="bbeTable py-4 px-4">{output}</div>;
  }

  return (
    <>
      <Head>
        <meta charset="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Ballerina by Example enables you to have complete coverage over the Ballerina language, while emphasizing incremental learning."
        />
        <meta name="author" content="WSO2, Inc." />
        <meta
          name="keywords"
          content="hello world, basics, network interaction, working with data, concurrency, transactions, concurrency safety, testing, rest api, rest client, rest api security, rest api advanced, http2, graphql, graphql security, websockets, websocket security, websub, resiliency, listeners, grpc, nats, stan, kafka, rabbitmq, tcp, udp, email, mysql, jdbc, io, security, url, time, cache, log, file, random, task, uuid, xslt, regex, os, xml data, tracing, metrics, code to cloud, function as a service"
        />
        <link rel="shortcut icon" href="/img/favicon.ico" />
        <title>Ballerina by Example</title>

        {/* FB */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Ballerina - Ballerina by Example" />
        <meta
          property="og:description"
          content="Ballerina by Example enables you to have complete coverage over the Ballerina language, while emphasizing incremental learning."
        />
        <meta
          property="og:image"
          itemProp="image"
          content="https://ballerina.io/img/ballerina-swan-lake-sm-banner-general.png"
        />

        {/* LINKED IN */}
        <meta property="og:title" content="Ballerina" />
        <meta
          property="og:image"
          content="https://ballerina.io/img/ballerina-swan-lake-sm-banner-general.png"
        />
        <meta
          property="og:description"
          itemProp="image"
          content="Ballerina by Example enables you to have complete coverage over the Ballerina language, while emphasizing incremental learning."
        />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ballerinalang" />
        <meta name="twitter:creator" content="@ballerinalang" />
        <meta name="twitter:title" content="Ballerina" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:description"
          content="Ballerina by Example enables you to have complete coverage over the Ballerina language, while emphasizing incremental learning."
        />
        <meta
          name="twitter:image"
          content="https://ballerina.io/img/ballerina-swan-lake-sm-banner-general.png"
        />
        <meta
          property="twitter:text:description"
          content="Ballerina by Example enables you to have complete coverage over the Ballerina language, while emphasizing incremental learning."
        />
        <meta
          property="twitter:image"
          content="https://ballerina.io/img/ballerina-swan-lake-sm-banner-general.png"
        ></meta>
      </Head>

      <Layout>
        <Col sm={3} xxl={2} className="leftNav d-none d-sm-block">
          <LeftNavYaml navContent={navContent} bbe={null} />
        </Col>
        <Col xs={12} className="d-block d-sm-none">
          Mobile Left Nav
        </Col>
        <Col xs={12} sm={9} xxl={10} className="mdContent">
          <Container fluid="xl">
            <h1 className="mt-2 mb-4 pb-2 bbeHomeTitle">
              Ballerina By Example
            </h1>
            <p className="mb-5">
              Ballerina by Example enables you to have complete coverage over
              the language, while emphasizing incremental learning. This is a
              series of commented example programs.
            </p>
            <ListBBEs />
          </Container>
        </Col>
      </Layout>
    </>
  );
}
