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

import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Container, Badge } from 'react-bootstrap';
import Head from 'next/head';
import { RxCross2 } from "react-icons/rx";

import Layout from '../../../layouts/LayoutCommunity';
import ProjectsGrid from '../../../components/common/card-grid/CardGrid';
import { fetchContributors } from '../../../utils/github';
import projectsData from '../../../_data/student_projects.json';

export default function StudentengagementProgram() {
  const [projects, setProjects] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);

  const childRefs = {
    upcoming: useRef(),
    ongoing: useRef(),
    past: useRef()
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsWithContributors = await Promise.all(
        projectsData.projects.map(async (project) => {
          let contributors = [];
          try {
            contributors = await fetchContributors(project.repo.org, project.repo.name);
          } catch (error) {
            console.error(`Failed to fetch contributors for ${project.title}:`, error);
          }
          return { ...project, contributors: contributors.slice(0, 6) };
        })
      );
      setProjects(projectsWithContributors);
      setFilteredTags(projectsWithContributors); // Initialize filteredTags with all projects
    };

    fetchProjects();
  }, []);

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

  useEffect(() => {
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
  }, [selectedTags]);

  const handleSelectedTag = (selectedCategory) => {
    if (selectedTags.includes(selectedCategory)) {
      let filters = selectedTags.filter((el) => el !== selectedCategory);
      setSelectedTags(filters);
    } else {
      setSelectedTags([...selectedTags, selectedCategory]);
    }
  };

  const handleFilteredTags = () => {
    if (selectedTags.length > 0) {
      const filteredItems = projects.filter((item) => {
        return selectedTags.every((tag) => item.tags.includes(tag));
      });
      setFilteredTags(filteredItems);
    } else {
      setFilteredTags([...projects]);
    }
  };
// console.log(projects);

  const past = filteredTags.filter(project => project.status === "past");
  const ongoing = filteredTags.filter(project => project.status === "ongoing");
  const upcoming = filteredTags.filter(project => project.status === "upcoming");

  // console.log(ongoing);
  

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
          
          <Row className="pageContentRow communityRow slackRow">
            <Col xs={12}>
              <Container>
                {selectedTags.length > 0 && (
                  <Row className="selectedTagContainer slackRow">
                    <Col xs={12}>
                      Filtered by:&nbsp;
                      {selectedTags.map((selectedTag) => {
                        return (
                          <Badge as="a" key={selectedTag} className="selectedTagBadge" onClick={() => handleSelectedTag(selectedTag)} bg="#888" pill>{selectedTag}
                            <RxCross2 className="selectedTagIcon" />
                          </Badge>
                        );
                      })}
                    </Col>
                  </Row>
                )}

                {upcoming.length > 0 && (
                  <Row>
                    <Col xs={12}>
                      <div style={{ background: "#ffffff", marginTop: "20px", paddingTop: "24px" }}>
                        <ProjectsGrid ref={childRefs.upcoming} propsData={upcoming} launcher="project-mentorship" section="Available projects" getLink={getLink} handleSelectedTag={handleSelectedTag} />
                      </div>
                    </Col>
                  </Row>
                )}

                {ongoing.length > 0 && (
                  <Row style={upcoming.length > 0 ? { marginTop: "4rem" } : {}}>
                    <Col xs={12}>
                      <div style={{ background: "#ffffff", marginTop: "20px", paddingTop: "24px" }}>
                        <ProjectsGrid ref={childRefs.ongoing} propsData={ongoing} launcher="project-mentorship" section="Ongoing projects" getLink={getLink} handleSelectedTag={handleSelectedTag} />
                      </div>
                    </Col>
                  </Row>
                )}

                {past.length > 0 && (
                  <Row style={upcoming.length > 0 || ongoing.length > 0 ? { marginTop: "4rem" } : {}}>
                    <Col xs={12}>
                      <div style={{ background: "#ffffff", marginTop: "20px", paddingTop: "24px" }}>
                        <ProjectsGrid ref={childRefs.past} propsData={past} launcher="project-mentorship" section="Past projects" getLink={getLink} handleSelectedTag={handleSelectedTag} />
                      </div>
                    </Col>
                  </Row>
                )}
              </Container>
            </Col>
          </Row>
        </Col>
      </Layout>
    </>
  );
}

