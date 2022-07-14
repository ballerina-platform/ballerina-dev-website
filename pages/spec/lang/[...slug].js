import fs from 'fs';
import matter from 'gray-matter';
import React from 'react';
import { Col } from 'react-bootstrap';
import Head from 'next/head';


import Layout from '../../../layouts/LayoutSpec';
import { prefix } from '../../../utils/prefix';



var traverseFolder = function (dir) {
  var results = [];
  var list = fs.readdirSync(dir);
  list.forEach(function (file) {
    var filex = dir + '/' + file;
    var stat = fs.statSync(filex);
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results = results.concat(traverseFolder(filex));
    } else {
      /* Is a file */
      filex = filex.replace(/spec\/lang\//g, "");
      console.log(filex);
      results.push(filex);
    }
  });
  return results;
}

export async function getStaticPaths() {
  // Retrieve all our slugs
  const files = traverseFolder('spec/lang');
  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace('.html', '').split("/"),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  slug = slug.join('/');
  const fileName = fs.readFileSync(`spec/lang/${slug}.html`, 'utf-8');
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
        <meta name="description" content={frontmatter.description} />
        <meta name="keywords" content={frontmatter.keywords} />

        <title>{frontmatter.title}</title>

        {/* <!--FB--> */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`Ballerina - ${frontmatter.title}`} />
        <meta property="og:description" content={frontmatter.description}></meta>

        {/* <!--LINKED IN  --> */}
        <meta property="og:description" content={frontmatter.description} />

        {/* <!--TWITTER--> */}
        <meta property="twitter:description" content={frontmatter.description} />
        <meta property="twitter:text:description" content={frontmatter.description} />


        <link rel="stylesheet" href={`${prefix}/spec/ballerina-language-specification.css`} />
       
      </Head>
      <Layout>
        <Col xs={12} className='mdContentSpec'>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </Col>

      </Layout>
    </>
  );
}
