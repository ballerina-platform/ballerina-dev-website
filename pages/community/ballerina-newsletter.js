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

import fs from 'fs';
import matter from 'gray-matter';
import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import Head from 'next/head';


import Layout from '../../layouts/LayoutCommunity';
import NewsletterSubscription from '../../components/common/newsletter-subscription/NewsletterSubscription';
import { prefix } from '../../utils/prefix';

export async function getStaticProps() {
  // Get all our posts
  const files = fs.readdirSync('community/newsletter');

  const posts = files.map((fileName) => {
    const slug = fileName.replace('.md', '');
    const readFile = fs.readFileSync(`community/newsletter/${fileName}`, 'utf-8');
    const { data: frontmatter } = matter(readFile);

    return {
      slug,
      frontmatter,
    };
  });

  return {
    props: {
      posts,
    },
  };

}


export default function BallerinaNewsLetter({ posts }) {

  return (
    <>
      <Head>
        <meta name="description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />
        <meta name="keywords" content="ballerinalang, integration, microservices, programming language, cloud native, ballerina language" />
        <title>Ballerina newsletter - The Ballerina programming language</title>

        {/* <!--FB--> */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Ballerina newsletter - The Ballerina programming language" />
        <meta property="og:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />

        {/* <!--LINKED IN  --> */}
        <meta property="og:title" content="Ballerina newsletter - The Ballerina programming language" />
        <meta property="og:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />


        {/* <!--TWITTER--> */}
        <meta name="twitter:title" content="Ballerina newsletter - The Ballerina programming language" />
        <meta property="twitter:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />
        <meta property="twitter:text:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />

      </Head>
      <Layout>
        <Col sm={12}>

          <Container>

            <Row className="pageHeader pageContentRow communityRow">
              <Col xs={12}>
                <h1>Ballerina newsletter</h1>
              </Col>
            </Row>

            <Row className="pageContentRow communityRow">
              <Col xs={12} md={6}>
                <p>This is a periodic newsletter on Ballerina with hand-picked content and regular updates on the language.</p>
              </Col>
            </Row>



            <Row className="pageContentRow communityRow">
              <Col xs={12}>
                {posts.reverse().map(({ slug, frontmatter }, index) => (
                  <>
                    {
                      (index === 0) ?
                        <h2 id="current-issues" className='newsletterCat'>Current issue </h2>
                        : (index === 1) ?
                          <h2 id="past-issues" className='newsletterCat'>Past issues </h2>
                          : null
                    }
                    <div key={index} className='newsletterInfo'>
                      <p className='newsletterDate'>{frontmatter.issue}</p>
                      <a className='newsletterLink' target="_blank" rel="noreferrer" href={`${prefix}/community/newsletter/${slug}`} >
                        <h4 className='newsletterTitle'>{frontmatter.title}</h4>
                      </a>
                    </div>
                  </>
                ))}
              </Col>
            </Row>

          </Container>

        </Col>
      </Layout>
    </>
  );
}
