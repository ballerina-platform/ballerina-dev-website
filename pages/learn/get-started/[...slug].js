import fs from 'fs';
import matter from 'gray-matter';
import React from 'react'
import ReactMarkdown from 'react-markdown'

import Layout from '../../../layouts/layout-docs';
import { Container, Col } from 'react-bootstrap';

import MarkdownNavbar from 'markdown-navbar';

var traverseFolder = function(dir) {
  var results = [];
  var list = fs.readdirSync(dir);
  list.forEach(function(file) {
      var filex = dir + '/' + file;
      var stat = fs.statSync(filex);
      if (stat && stat.isDirectory()) { 
          /* Recurse into a subdirectory */
          results = results.concat(traverseFolder(filex));
      } else { 
          /* Is a file */
          filex = filex.replace(/swan-lake\/get-started\//g, "");
          results.push(filex);
      }
  });
  return results;
}

export async function getStaticPaths() {
  // Retrieve all our slugs
  const files = traverseFolder('swan-lake/get-started');
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

  slug=slug.join('/');
  const fileName = fs.readFileSync(`swan-lake/get-started/${slug}.md`, 'utf-8');
  const { data: frontmatter, content } = matter(fileName);
  const source = {source:'learn'};
  return {
    props: {
      frontmatter,
      content
    },
  };
}

export default function PostPage({ frontmatter, content }) {
  // const relative = window.location.origin;
  return (
    <Layout>
      <Col sm={7} xxl={8} className='mdContent'>
        <Container>
          <div className='topRow'>
            <Col xs={11}><h1>{frontmatter.title}</h1></Col>
            <Col xs={1} className="gitIcon">
              <img src="/images/github.svg" height={20} width={20}/>
            </Col>
          </div>
          
          <ReactMarkdown>{content}</ReactMarkdown>
          <div className='contentNav'>
            <Col xs={6} className='prevLink'>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#20b6b0" className="bi bi-chevron-left" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
              </svg> &nbsp;
              <a href='#'>Install Ballerina</a>
            </Col>
            <Col xs={6} className='nextLink'>
              <a href='#'>Language basics</a> &nbsp;
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#20b6b0" className="bi bi-chevron-right" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </Col>
          </div>
        </Container>
      </Col>
      <Col sm={2} className='pageToc d-none d-sm-block'>
        <h6>On this page</h6>
        <MarkdownNavbar source={content} ordered={false} headingTopOffset={150} declarative/>
      </Col>
    </Layout>
  );
}
