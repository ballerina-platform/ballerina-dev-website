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
import { Col } from 'react-bootstrap';
import Head from 'next/head';
import DOMPurify from 'isomorphic-dompurify';

import Layout from '../../../layouts/LayoutOther';
import NewsletterSubscription from '../../../components/common/newsletter-subscription/NewsletterSubscription';


export async function getStaticPaths() {
  // Retrieve all our slugs
  const files = fs.readdirSync('community/newsletter');
  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace('.md', '').split("/"),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {

  const fileName = fs.readFileSync(`community/newsletter/${slug}.md`, 'utf-8');
  const { data: frontmatter, content } = matter(fileName);

  return {
    props: {
      frontmatter,
      content
    },
  };
}

export default function PostPage({ frontmatter, content }) {

  return (
    <>
      <Head>
        <meta name="description" content={'Ballerina newsletter - ' + frontmatter.issue}/>
        <meta name="keywords" content={frontmatter.keywords}/>

        <title>{`${frontmatter.title} - The Ballerina programming language`}</title>

        {/* <!--FB--> */}
        <meta property="og:type" content="article"/>
        <meta property="og:title" content={`${frontmatter.title} - The Ballerina programming language`}/>
        <meta property="og:description" content={'Ballerina newsletter - ' + frontmatter.issue}></meta>
        
        {/* <!--LINKED IN  --> */}
        <meta property="og:description" content={'Ballerina newsletter - ' + frontmatter.issue}/>

        {/* <!--TWITTER--> */}
        <meta name="twitter:title" content={`${frontmatter.title} - The Ballerina programming language`}/>
        <meta property="twitter:description" content={'Ballerina newsletter - ' + frontmatter.issue}/>
        <meta property="twitter:text:description" content={'Ballerina newsletter - ' + frontmatter.issue}/>

      </Head>
      <Layout>
        <Col sm={12} md={8} lg={8} className='newsletter'> 
          <div className='topRow'>
            <Col xs={12}><h1>{frontmatter.issue}</h1></Col>
          </div>
          <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(content)}}/>
        </Col>

        <Col sm={12} md={4} lg={4} className="subscriptionCol">
          <NewsletterSubscription/>
        </Col>

      </Layout>
    </>
  );
}
