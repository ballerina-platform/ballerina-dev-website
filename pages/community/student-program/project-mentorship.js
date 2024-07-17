/**
 * Copyright (c) 2024, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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

import React from 'react';
import { Row, Col, Container, Badge, Tabs, Tab } from 'react-bootstrap';
import Head from 'next/head';
import { RxCross2 } from "react-icons/rx"

import Layout from '../../../layouts/LayoutCommunity';
import Projects from '../../../_data/student_projects.json';
import ProjectsGrid from '../../../components/common/card-grid/CardGrid';
import { fetchContributors } from '../../../utils/github';

export async function getStaticProps() {
  const projectsWithContributors = await Promise.all(
    Projects.projects.map(async (project) => {
      let contributors = [];
      try {
        contributors = await fetchContributors(project.repo.org, project.repo.name);
      } catch (error) {
        console.error(`Failed to fetch contributors for ${project.title}:`, error);
      }
      return { ...project, contributors: contributors.slice(0, 5) };
    })
  );

  return {
    props: {
      projects: projectsWithContributors,
    },
  };
}

export default function StudentengagementProgram({ projects }) {

  const getLink = (element, id) => {
    if (element.tagName.toLowerCase() === "path")
      element = element.parentElement;

    const elementNodeList = document.querySelectorAll(`#${id}`);
    const elementArray = Array.prototype.slice.call(elementNodeList);
    const count = elementArray.indexOf(element.parentElement);

    if (count === 0) {
      location.hash = `#${id}`;
    } else {
      location.hash = `#${id}-${count}`;
    }

    navigator.clipboard.writeText(window.location.href);
    element.parentElement.scrollIntoView();
  };

  const [selectedTags, setSelectedTags] = React.useState([]);
  const [filteredTags, setFilteredTags] = React.useState(projects);

  function handleSelectedTag(selectedCategory) {
    if (selectedTags.includes(selectedCategory)) {
      let filters = selectedTags.filter((el) => el !== selectedCategory)
      setSelectedTags(filters);
    } else {
      setSelectedTags([...selectedTags, selectedCategory])
    }
  }

  const childRefs = {
    upcoming: React.useRef(),
    ongoing: React.useRef(),
    past: React.useRef()
  };

  React.useEffect(() => {
    handleFilteredTags();

    let hash = global.location.hash;
    if (hash !== '') {
      hash = hash.replace('#', '');
      const element = document.getElementById(hash);
      if (!element) {
        if (childRefs.upcoming.current) {
          childRefs.upcoming.current.showMoreVersions();
        }
        if (childRefs.ongoing.current) {
          childRefs.ongoing.current.showMoreVersions();
        }
        if (childRefs.past.current) {
          childRefs.past.current.showMoreVersions();
        }
      }
    }
  }, [selectedTags])

  function handleFilteredTags() {
    if (selectedTags.length > 0) {
      const filteredItems = projects.filter((item) => {
        return selectedTags.every((tag) => item.tags.includes(tag));
      });
      setFilteredTags(filteredItems);
    } else {
      setFilteredTags([...projects]);
    }
  }

  const past = filteredTags.filter(project => project.status === "past");
  const ongoing = filteredTags.filter(project => project.status === "ongoing");
  const upcoming = filteredTags.filter(project => project.status === "upcoming");


  // React.useEffect(() => {
  //   let hash = global.location.hash;
  //   if (hash !== '') {
  //     hash = hash.replace('#', '');
  //     const element = document.getElementById(hash);
  //     if (!element) {
  //       const checkPast = past.filter((project) => project.id === hash);
  //     }
  //     // if (hash === "consuming-services" || hash === "working-with-data"
  //     //   || hash === "restful-api" || hash === "grpc-api" || hash === "graphql-api"
  //     //   || hash === "kafka-consumer-producer" || hash === "working-with-databases") {
  //     //   setKey(hash);
  //     //   const element = document.getElementById("ballerina-in-action");
  //     //   element.scrollIntoView();
  //     // }
  //   }
  // }, []);
    
  return (
    <>
      <Head>
        <title>Project mentorship - The Ballerina programming language</title>
        <meta name="description" content="The Ballerina student engagement program enriches university students by complementing their academic studies and nurturing them to become industry leaders." />
        <meta name="keywords" content="ballerinalang, integration, microservices, programming language, cloud native, ballerina language" />

        {/* <!--FB--> */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Project mentorship - The Ballerina programming language" />
        <meta property="og:description" content="The Ballerina student engagement program enriches university students by complementing their academic studies and nurturing them to become industry leaders." />
        <meta
          property="og:image"
          itemProp="image"
          content="https://ballerina.io/images/ballerina-student-engagement-program-sm-banner.png"
        />

        {/* <!--LINKED IN  --> */}
        <meta property="og:title" content="Project mentorship - The Ballerina programming language" />
        <meta property="og:description" content="The Ballerina student engagement program enriches university students by complementing their academic studies and nurturing them to become industry leaders." />
        <meta
          property="og:image"
          content="https://ballerina.io/images/ballerina-student-engagement-program-sm-banner.png"
        />

        {/* <!--TWITTER--> */}
        <meta name="twitter:title" content="Project mentorship - The Ballerina programming language" />
        <meta property="twitter:description" content="The Ballerina student engagement program enriches university students by complementing their academic studies and nurturing them to become industry leaders." />
        <meta property="twitter:text:description" content="The Ballerina student engagement program enriches university students by complementing their academic studies and nurturing them to become industry leaders." />
        <meta
          name="twitter:image"
          content="https://ballerina.io/images/ballerina-student-engagement-program-sm-banner.png"
        />

      </Head>
      <Layout>
        <Col sm={12}>

          <Row className="pageHeader pageContentRow communityRow communityIntro" style={{ paddingBottom: "4rem" }}>
            <Col xs={12}>
              <Container>
                <Row>
                  <img src="/images/mesh-1-row-cropped.svg" className="background-image" alt="Background" />
                  <Col xs={12} md={12} lg={6}>
                    <h1>Project mentorship</h1>
                    <p style={{ fontSize: "24px", fontWeight: "400", color: "#20b6b0", marginTop: "40px" }}>Ballerina is dedicated to supporting the advancement of the next generation. Our student engagement program aims to provide university students with informative sessions that complement their academic curriculum and foster a sense of community among them.</p>
                  </Col>
                  <Col xs={12} md={12} lg={6} className='introImg'>
                    <img src="/images/university/1.png" alt="University" />
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
          {/* {
            selectedTags.length > 0 &&

            <Row className="selectedTagContainer slackRow">
              <Col xs={12}>
                <Container>
                  Filtered by:&nbsp;
                  {selectedTags.map((selectedTag) => {
                    return (
                      <Badge as={"a"} key={selectedTag} className="selectedTagBadge" onClick={() => handleSelectedTag(selectedTag)} bg="#888" pill>{selectedTag}
                        <RxCross2 className="selectedTagIcon" />
                      </Badge>
                    )
                  })}
                </Container>
              </Col>
            </Row>
          } */}


          <Row className="pageContentRow communityRow slackRow">
            <Col xs={12}>
              <Container>

              {
            selectedTags.length > 0 &&

            <Row className="selectedTagContainer slackRow">
              <Col xs={12}>
                
                  Filtered by:&nbsp;
                  {selectedTags.map((selectedTag) => {
                    return (
                      <Badge as={"a"} key={selectedTag} className="selectedTagBadge" onClick={() => handleSelectedTag(selectedTag)} bg="#888" pill>{selectedTag}
                        <RxCross2 className="selectedTagIcon" />
                      </Badge>
                    )
                  })}
                
              </Col>
            </Row>
          }


                {/* <Row>
                        <Col xs={12} md={12}>
                            <h2 id="projects" className='section'>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="30"
                                    height="30"
                                    fill="currentColor"
                                    className="bi bi-link-45deg mdButton pe-2"
                                    viewBox="0 0 16 16"
                                    onClick={(e) => props.getLink(e.target, 'projects')}
                                >
                                    <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                    <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                </svg>
                                Projects
                            </h2>
                        </Col>
                    </Row> */}
{
  upcoming.length > 0 &&
<Row>
                  <Col xs={12} >
                    <div style={{ background: "#ffffff", marginTop: "20px", paddingTop: "24px" }}>
                      <ProjectsGrid ref={childRefs.upcoming} propsData={upcoming} launcher="project-mentorship" section="Available projects" getLink={getLink} handleSelectedTag={handleSelectedTag} />
                    </div>

                  </Col>
                </Row>
}

{
  ongoing.length > 0 &&
<Row style={{ marginTop: "4rem" }}>
                  <Col xs={12} >
                    <div style={{ background: "#ffffff", marginTop: "20px", paddingTop: "24px" }}>
                      <ProjectsGrid ref={childRefs.ongoing} propsData={ongoing} launcher="project-mentorship" section="Ongoing projects" getLink={getLink} handleSelectedTag={handleSelectedTag} />
                    </div>

                  </Col>
                </Row>
}
                
{
  past.length > 0 &&
<Row style={{ marginTop: "4rem" }}>
                  <Col xs={12} >
                    <div style={{ background: "#ffffff", marginTop: "20px", paddingTop: "24px" }}>
                      <ProjectsGrid ref={childRefs.past} propsData={past} launcher="project-mentorship" section="Past projects" getLink={getLink} handleSelectedTag={handleSelectedTag} />
                    </div>

                  </Col>
                </Row>
}
                

              </Container>
            </Col>
          </Row>

          {/* <Row className="pageContentRow communityRow slackRow">
            <ProjectsGrid propsData={ongoing} launcher="project-mentorship" section="Ongoing" getLink={getLink} handleSelectedTag={handleSelectedTag}/>
            <Col xs={12}>
              <Container>
                <div style={{ paddingBottom: "20px", background: "#ffffff" }}>
                  <ProjectsGrid propsData={past} launcher="project-mentorship" section="Past" getLink={getLink} handleSelectedTag={handleSelectedTag} />
                </div>
                <Tabs defaultActiveKey="Past" id="events" className="mb-3 eventsTabs">
              <Tab eventKey="Past" title={<>Past&nbsp;<Badge bg="secondary" style={{borderRadius:"50%"}}>{past.length}</Badge></>}>
              <ProjectsGrid propsData={past} launcher="project-mentorship" section="Past" getLink={getLink} handleSelectedTag={handleSelectedTag}/>
              </Tab>

              <Tab eventKey="Ongoing" title={<>Ongoing&nbsp;<Badge bg="secondary" style={{borderRadius:"50%"}}>{ongoing.length}</Badge></>}>
              <ProjectsGrid propsData={ongoing} launcher="project-mentorship" section="Ongoing" getLink={getLink} handleSelectedTag={handleSelectedTag}/>
              </Tab>

              <Tab eventKey="Upcoming" title={<>Upcoming&nbsp;<Badge bg="secondary" style={{borderRadius:"50%"}}>{upcoming.length}</Badge></>}>
              <ProjectsGrid propsData={upcoming} launcher="project-mentorship" section="Upcoming" getLink={getLink} handleSelectedTag={handleSelectedTag}/>
              </Tab>
            </Tabs>
              </Container>
            </Col>
          </Row> */}


          {/* <Row className="pageContentRow communityRow slackRow">
            <ProjectsGrid propsData={past} launcher="project-mentorship" section="Past" getLink={getLink} handleSelectedTag={handleSelectedTag}/>
          </Row>

          <Row className="pageContentRow communityRow">
            <ProjectsGrid propsData={ongoing} launcher="project-mentorship" section="Ongoing" getLink={getLink} handleSelectedTag={handleSelectedTag}/>
          </Row>

          <Row className="pageContentRow communityRow slackRow">
            <ProjectsGrid propsData={upcoming} launcher="project-mentorship" section="Upcoming" getLink={getLink} handleSelectedTag={handleSelectedTag}/>
          </Row> */}

        </Col>
      </Layout>
    </>
  );
}
