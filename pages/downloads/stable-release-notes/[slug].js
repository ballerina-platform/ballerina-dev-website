import fs from 'fs';
import matter from 'gray-matter';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Container, Col } from 'react-bootstrap';
import MarkdownNavbar from 'markdown-navbar';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Image from 'next-image-export-optimizer';
import Head from 'next/head';
import { getHighlighter, setCDN } from "shiki";

setCDN("https://unpkg.com/shiki/");

import Layout from '../../../layouts/LayoutDocs';
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
      filex = filex.replace(/downloads\/stable-release-notes\//g, "").replace(/\/RELEASE_NOTE.md/g, "").replace(/\/RELEASE_NOTE.html/g, "");
      results.push(filex);
    }
  });

  return results;
}

export async function getStaticPaths() {
  // Retrieve all our slugs
  const files = traverseFolder('downloads/stable-release-notes');
  const paths = files.map((fileName) => ({
    params: {
      slug: fileName,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {

  let path = `downloads/stable-release-notes/${slug}/RELEASE_NOTE.html`;
  let fileName = '';

  if (!fs.existsSync(path)) {
    fileName = fs.readFileSync(`downloads/stable-release-notes/${slug}/RELEASE_NOTE.md`, 'utf-8');
  }

  // The file *does* exist
  else {
    // Read the file and do anything you want
    fileName = fs.readFileSync(`downloads/stable-release-notes/${slug}/RELEASE_NOTE.html`, 'utf-8');
  }

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

  const HighlightSyntax = (code, language) => {
    const [codeSnippet, setCodeSnippet] = React.useState([]);

    React.useEffect(() => {
      async function fetchData() {
        getHighlighter({
          theme: "github-light",
          langs: ['bash', 'ballerina', 'toml', 'yaml', 'sh', 'json', 'graphql', 'sql']
        }).then((highlighter) => {
          setCodeSnippet(highlighter.codeToHtml(code, language));
        })
      }
      fetchData();
    }, [code, language]);
    return [codeSnippet]
  }

  const extractText = (value) => {
    if (typeof value === 'string') {
      return value
    } else {
      return value.props.children
    }
  }

  const scanArray = (array) => {
    const newArray = array.map(extractText);
    let newId = newArray.join('').replace(/[&\/\\#,+()!$~%.'":*?<>{}]/g, '').toLowerCase();
    newId = newId.replace(/ /g, '-');
    return newId
  }

  return (
    <>
      <Head>
        <meta name="description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />
        <meta name="keywords" content="ballerinalang, integration, microservices, programming language, cloud native, ballerina language" />

        <title>{frontmatter.title}</title>

        {/* <!--FB--> */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`Ballerina - ${frontmatter.title}`} />
        <meta property="og:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />


        {/* <!--LINKED IN  --> */}
        <meta property="og:title" content="Ballerina" />


        {/* <!--TWITTER--> */}
        <meta property="twitter:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />
        <meta property="twitter:text:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />
      </Head>
      <Layout>
        <Col xs={12} sm={10} className='mdContent'>
          <Container>
            <div className='topRow'>
              <Col xs={11}><h1>{frontmatter.title}</h1></Col>
              <Col xs={1} className="gitIcon">
                <a href={`${process.env.gitHubPath}downloads/stable-release-notes/${slug}/RELEASE_NOTE.html`}>
                  <Image src={`${prefix}/images/github.svg`} height={20} width={20} alt="Edit in github" />
                </a>
              </Col>
            </div>

            <ReactMarkdown
              components={{
                h2({ node, inline, className, children, ...props }) {
                  let id = '';
                  if (children.length === 1) {
                    id = children[0].toLowerCase().replace(/ /g, '-');
                  }
                  else {
                    id = scanArray(children);
                  }
                  return <h2 data-id={id}>{children}</h2>
                },
                h3({ node, inline, className, children, ...props }) {
                  let id = '';
                  if (children.length === 1) {
                    id = children[0].toLowerCase().replace(/ /g, '-');
                  }
                  else {
                    id = scanArray(children);
                  }
                  return <h3 data-id={id}>{children}</h3>
                },
                h4({ node, inline, className, children, ...props }) {
                  let id = '';
                  if (children.length === 1) {
                    id = children[0].toLowerCase().replace(/ /g, '-');
                  }
                  else {
                    id = scanArray(children);
                  }
                  return <h4 data-id={id}>{children}</h4>
                },
                h5({ node, inline, className, children, ...props }) {
                  let id = '';
                  if (children.length === 1) {
                    id = children[0].toLowerCase().replace(/ /g, '-');
                  }
                  else {
                    id = scanArray(children);
                  }
                  return <h5 data-id={id}>{children}</h5>
                },
                h6({ node, inline, className, children, ...props }) {
                  let id = '';
                  if (children.length === 1) {
                    id = children[0].toLowerCase().replace(/ /g, '-');
                  }
                  else {
                    id = scanArray(children);
                  }
                  return <h6 data-id={id}>{children}</h6>
                },
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <div dangerouslySetInnerHTML={{ __html: HighlightSyntax(String(children).replace(/\n$/, ''), match[1].toLowerCase()) }} />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {content}
            </ReactMarkdown>

            {/* <div className='contentNav'>
              <Col xs={6} className='prevLink'>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#20b6b0" className="bi bi-chevron-left" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                </svg> &nbsp;
                <a href='#'>Install Ballerina</a>
              </Col>
              <Col xs={6} className='nextLink'>
                <a href='#'>Language basics</a> &nbsp;
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#20b6b0" className="bi bi-chevron-right" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </Col>
            </div> */}
          </Container>
        </Col>
        <Col sm={2} className='pageToc d-none d-sm-block'>
          <h6>On this page</h6>
          <MarkdownNavbar source={content} ordered={false} headingTopOffset={150} declarative />
        </Col>
      </Layout>
    </>
  );
}
