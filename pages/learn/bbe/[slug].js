import fs from 'fs';
import matter from 'gray-matter';


import React from 'react'
import ReactMarkdown from 'react-markdown'
import ReactDom from 'react-dom'

import Layout from '../../../layouts/layout-docs';

import Head from 'next/head';
// import Script from 'next/script';
import Grid from '@mui/material/Grid';

export async function getStaticPaths() {
  // console.log("booooo");
  // Retrieve all our slugs
  const files = fs.readdirSync('bbe');

  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace('.html', ''),
    },
  }));

  return {
    paths,
    fallback: false, 
  };
}

export async function getStaticProps({ params: { slug } }) {
  const fileName = fs.readFileSync(`bbe/${slug}.html`, 'utf-8');
  const { data: frontmatter, content } = matter(fileName);
  return {
    props: {
      frontmatter,
      content,
    },
  };
}


export default function PostPage({ frontmatter, content }) {
  
  return (
      <Layout>
        <Head>
        <script async src="https://unpkg.com/shiki" />
        <script async src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

        <link rel="stylesheet" href="https://yasithd.github.io/ballerina-dev-website/css/shiki.css"/>
        <link rel="stylesheet" href="https://yasithd.github.io/ballerina-dev-website/css/custom-highlight.css"/>
      </Head>
      <Grid container spacing={0} flexShrink={0}>
        <Grid item xs={9} className='content'>
          <div dangerouslySetInnerHTML={{__html: content}}/>
        </Grid>
        <Grid item xs={3} className="pageNav">
        <nav id="sidebar" className="sidebar" aria-label="Table of contents">
            <div className="sidebar-scrollbox">
                <ul className='pageNav'>
                  <li>Hello World</li>
                  <li>Hello World Service</li>
                </ul>
            </div>
            <div id="sidebar-resize-handle" className="sidebar-resize-handle"></div>
        </nav>
        </Grid>
      </Grid>
      
      
      
      
{/* 
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          $( "pre > code" ).each(function() {
            var langClass = $(this).attr('class');
            
            var myArray = langClass.split("-");
            var myLang = myArray[1];

            shiki
            .getHighlighter({
              theme: 'nord',
              langs: ['bash','ballerina']

            })
            .then(highlighter => {
              var code = highlighter.codeToHtml($(this).html(), { lang: myLang });
              $(code).insertAfter($(this).parent().prev());
              $(this).parent().remove();
            })
          });
        `,
        }}
      /> */}
          
      </Layout>
      
  
  );
}
