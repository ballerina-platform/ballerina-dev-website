import fs from 'fs';
import matter from 'gray-matter';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Container, Col, Row } from 'react-bootstrap';
import remarkGfm from 'remark-gfm';
import Image from 'next-image-export-optimizer';
import rehypeRaw from 'rehype-raw';
import Head from 'next/head';
import Link from 'next/link';


import { getHighlighter, setCDN } from "shiki";

setCDN("https://unpkg.com/shiki/");


import Layout from '../../../layouts/LayoutSpec';
import { prefix } from '../../../utils/prefix';



export async function getStaticProps() {

  const fileName = fs.readFileSync(`spec/http/spec.md`, 'utf-8');
  const { data: frontmatter, content } = matter(fileName);

  return {
    props: {
      frontmatter,
      content
    },
  };
}


export default function PostPage({ frontmatter, content, id }) {

  const HighlightSyntax = (code,language) => {
    const [codeSnippet, setCodeSnippet] = React.useState([]);
    if (language=='proto') {
      language = 'ballerina';
    }
    React.useEffect( () => { 

      async function fetchData() {
          getHighlighter({
            theme: "github-light",
            langs: ['bash', 'ballerina', 'toml', 'yaml', 'sh', 'json', 'graphql', 'sql']
          }).then((highlighter) => {
            setCodeSnippet(highlighter.codeToHtml(code,language));
          })
      }
      fetchData();
    }, [code,language]);

    return [codeSnippet]
  }

  const genrateId = (children) => {

    const idArray = children[0].split(" ");
    idArray[0] = idArray[0].replace(/\./g, '');
    let id = idArray.join("-");
    id = id.toLowerCase()

    return id;
  }

  return (
    <>
      <Head>
        <meta name="description" content={frontmatter.description}/>
        <meta name="keywords" content={frontmatter.keywords}/>

        <title>{frontmatter.title}</title>

        {/* <!--FB--> */}
        <meta property="og:type" content="article"/>
        <meta property="og:title" content={`Ballerina - ${frontmatter.title}`}/>
        <meta property="og:description" content={frontmatter.description}></meta>
        
        {/* <!--LINKED IN  --> */}
        <meta property="og:description" content={frontmatter.description}/>

        {/* <!--TWITTER--> */}
        <meta property="twitter:description" content={frontmatter.description}/>
        <meta property="twitter:text:description" content={frontmatter.description}/>


        
      </Head>
      <Layout>     
        <Col xs={12} className='mdContent'>
          <Container>
            <Row className='topRowSpec'>
              <Col xs={12}>
                <Link href='/'><Image src={`${prefix}/images/ballerina-logo.svg`} height={37} width={199} alt="Ballerina-logo"/></Link>
              </Col>
            </Row>
            
            <Row className='specContent'>
            <ReactMarkdown className='stdLib'
              components={{
                h2: ({node,children, ...props}) => <h2 id={genrateId(children)} {...props}>{children}</h2>,
                h3: ({node,children, ...props}) => <h3 id={genrateId(children)} {...props}>{children}</h3>,
                h4: ({node,children, ...props}) => <h4 id={genrateId(children)} {...props}>{children}</h4>,
                h5: ({node,children, ...props}) => <h5 id={genrateId(children)} {...props}>{children}</h5>,
                h6: ({node,children, ...props}) => <h6 id={genrateId(children)} {...props}>{children}</h6>,
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <div dangerouslySetInnerHTML={{__html: HighlightSyntax(String(children).replace(/\n$/, ''),match[1].toLowerCase())}} />
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
            
            </Row>
          </Container>
        </Col>

      </Layout>
    </>
  );
}
