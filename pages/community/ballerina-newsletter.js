import fs from 'fs';
import matter from 'gray-matter';
import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';


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
              <NewsletterSubscription />
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

  );
}
