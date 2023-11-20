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

 import React from "react";
 import { Container, Row, Col, Button, Offcanvas } from "react-bootstrap";
 import fs from "fs";
 import Head from "next/head";
 import Link from "next/link";
 import Layout from "../../../layouts/LayoutDocs";
 import { load } from "js-yaml";
 import LeftNavYaml from "../../../components/common/left-nav/LeftNavYaml";
 import { useRouter } from "next/router";
 import { prefix } from "../../../utils/prefix";
 
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
   // Show mobile left nav
   const [show, setShow] = React.useState(false);
   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);
 
   const router = useRouter();
 
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
           <li className="ps-4 my-1 fw-light">
             <Link href={`${prefix}/learn/by-example/${bbe.url}`} passHref>
               {bbe.name}
             </Link>
           </li>
         );
       }
 
       colData.push(
         <ul className="p-0 my-1" id={toKebabCase(category.title)}>
           <li className="d-flex align-items-center">
             <Link
               href={`${prefix}/learn/by-example#${toKebabCase(category.title)}`}
               passHref
             >
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 width="18"
                 height="18"
                 fill="currentColor"
                 className="bi bi-link-45deg categoryButton"
                 viewBox="0 0 16 16"
               >
                 <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                 <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
               </svg>
             </Link>
             <div className="ps-2 fw-bold">{category.title}</div>
           </li>
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
         <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         <meta
           name="description"
           content="Ballerina by Example enables you to have complete coverage over the Ballerina language, while emphasizing incremental learning."
         />
         <meta name="author" content="WSO2 LLC" />
         <meta
           name="keywords"
           content="hello world, basics, network interaction, working with data, concurrency, transactions, concurrency safety, testing, rest api, rest client, rest api security, rest api advanced, http2, graphql, graphql security, websockets, websocket security, websub, resiliency, listeners, grpc, nats, stan, kafka, rabbitmq, tcp, udp, email, mysql, jdbc, io, security, url, time, cache, log, file, random, task, uuid, xslt, regex, os, xml data, tracing, metrics, code to cloud, function as a service"
         />
         <link rel="shortcut icon" href="/img/favicon.ico" />
         <title>Ballerina by Example - The Ballerina programming language</title>
 
         {/* FB */}
         <meta property="og:type" content="article" />
         <meta property="og:title" content="Ballerina by Example - The Ballerina programming language" />
         <meta
           property="og:description"
           content="Ballerina by Example enables you to have complete coverage over the Ballerina language, while emphasizing incremental learning."
         />
         <meta
           property="og:image"
           itemProp="image"
           content="https://ballerina.io/images/ballerina-learn-ballerina-by-example-page-sm-banner.png"
         />
 
         {/* LINKED IN */}
         <meta property="og:title" content="Ballerina by Example - The Ballerina programming language" />
         <meta
           property="og:image"
           content="https://ballerina.io/images/ballerina-learn-ballerina-by-example-page-sm-banner.png"
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
         <meta name="twitter:title" content="Ballerina by Example - The Ballerina programming language" />
         <meta name="twitter:card" content="summary_large_image" />
         <meta
           property="twitter:description"
           content="Ballerina by Example enables you to have complete coverage over the Ballerina language, while emphasizing incremental learning."
         />
         <meta
           name="twitter:image"
           content="https://ballerina.io/images/ballerina-learn-ballerina-by-example-page-sm-banner.png"
         />
         <meta
           property="twitter:text:description"
           content="Ballerina by Example enables you to have complete coverage over the Ballerina language, while emphasizing incremental learning."
         />
         <meta
           property="twitter:image"
           content="https://ballerina.io/images/ballerina-learn-ballerina-by-example-page-sm-banner.png"
         />
       </Head>
 
       <Layout>
         <Col sm={3} xxl={2} className="leftNav d-none d-sm-block">
           <LeftNavYaml navContent={navContent} viewer={1} />
         </Col>
         <Col xs={12} className="d-block d-sm-none">
           <Button className="learnMob" onClick={handleShow}>
             Learn
           </Button>
           <Offcanvas show={show} onHide={handleClose}>
             <Offcanvas.Header closeButton></Offcanvas.Header>
             <Offcanvas.Body>
               <LeftNavYaml navContent={navContent} />
             </Offcanvas.Body>
           </Offcanvas>
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