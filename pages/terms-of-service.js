import fs from 'fs';
import matter from 'gray-matter';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Col, Row } from 'react-bootstrap';
import MarkdownNavbar from 'markdown-navbar';
import Image from 'next-image-export-optimizer';
import rehypeRaw from 'rehype-raw';
import Head from 'next/head';

import Layout from '../layouts/LayoutOther';
import { prefix } from '../utils/prefix';

export async function getStaticProps() {

  const fileName = fs.readFileSync(`policy/terms-of-service.md`, 'utf-8');
  const { data: frontmatter, content } = matter(fileName);

  return {
    props: {
      frontmatter,
      content
    },
  };
}

export default function TermsOfServicePage({ frontmatter, content }) {

  // Add id attributes to headings
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

  // Show page toc
  const [showToc, setShowToc] = React.useState(false);

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
        <Col xs={12} sm={10} className="policyContent">
          <Row className='topRow innerRow'>
            <Col xs={11}><h1>{frontmatter.title}</h1></Col>
            <Col xs={1} className="gitIcon">
              <a href={`${process.env.gitHubPath}policy/terms-of-service.md`}>
                <Image src={`${prefix}/images/github.svg`} height={20} width={20} alt="Edit in github" />
              </a>
            </Col>
          </Row>

          <Row className='pageContentRow innerRow'>
            <Col xs={12}>
              <ReactMarkdown
                components={{
                  h2({ node, inline, className, children, ...props }) {
                    let id = '';
                    setShowToc(true);
                    if (children.length === 1) {
                      id = children[0].toLowerCase().replace(/ /g, '-');
                    }
                    else {
                      id = scanArray(children);
                    }
                    return <h2 id={id}>{children}</h2>
                  },
                  h3({ node, inline, className, children, ...props }) {
                    let id = '';
                    setShowToc(true);
                    if (children.length === 1) {
                      id = children[0].toLowerCase().replace(/ /g, '-');
                    }
                    else {
                      id = scanArray(children);
                    }
                    return <h3 id={id}>{children}</h3>
                  },
                  h4({ node, inline, className, children, ...props }) {
                    let id = '';
                    setShowToc(true);
                    if (children.length === 1) {
                      id = children[0].toLowerCase().replace(/ /g, '-');
                    }
                    else {
                      id = scanArray(children);
                    }
                    return <h4 id={id}>{children}</h4>
                  },
                  h5({ node, inline, className, children, ...props }) {
                    let id = '';
                    setShowToc(true);
                    if (children.length === 1) {
                      id = children[0].toLowerCase().replace(/ /g, '-');
                    }
                    else {
                      id = scanArray(children);
                    }
                    return <h5 id={id}>{children}</h5>
                  },
                  h6({ node, inline, className, children, ...props }) {
                    let id = '';
                    setShowToc(true);
                    if (children.length === 1) {
                      id = children[0].toLowerCase().replace(/ /g, '-');
                    }
                    else {
                      id = scanArray(children);
                    }
                    return <h6 id={id}>{children}</h6>
                  }
                }}
                rehypePlugins={[rehypeRaw]}>
                {content}
              </ReactMarkdown>
            </Col>
          </Row>
        </Col>
        <Col sm={2} className='pageToc d-none d-sm-block'>
          {
            (showToc) ?
              <>
                <h6>On this page</h6>
                <MarkdownNavbar
                  source={content}
                  ordered={false}
                  headingTopOffset={150}
                  declarative />
              </>
              : null
          }
        </Col>
      </Layout>
    </>
  );
}
