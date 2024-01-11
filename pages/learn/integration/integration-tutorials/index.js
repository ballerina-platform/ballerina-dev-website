/**
 * Copyright (c) 2023, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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

import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Row, Col, Container, Badge } from "react-bootstrap";

import Layout from "../../../../layouts/LayoutLearn";
import SampleList from "../../../../components/common/sample-list/SampleList";
import { prefix } from '../../../../utils/prefix';
import { data } from "../../../../components/learn/integration-tutorials/data";
import {RxCross2} from "react-icons/rx"
 
export default function Learn() {

  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState(data);

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

  function handleSelectedTag(selectedCategory){
    if(selectedTags.includes(selectedCategory)){
      let filters = selectedTags.filter((el)=>el!==selectedCategory)
      setSelectedTags(filters);
    }else{
      setSelectedTags([...selectedTags, selectedCategory])
    }
  }

  useEffect(() => {
    handleFilteredTags()
  }, [selectedTags])

  function handleFilteredTags() {
    if (selectedTags.length > 0) {
      const filteredItems = data.filter((item) => {
        return selectedTags.every((tag) => item.tags.includes(tag));
      });
      setFilteredTags(filteredItems);
    } else {
      setFilteredTags([...data]);
    }
  }


  return (
    <>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Step-by-step guides on how you can develop your integration scenarios in Ballerina."
        />
        <meta name="author" content="WSO2 LLC" />
        <meta
          name="keywords"
          content="ballerina, learn, documentation, docs, programming language"
        />
        <link rel="shortcut icon" href="/img/favicon.ico" />
        <title>Integration tutorials - The Ballerina programming language</title>

        {/* FB */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Integration tutorials - The Ballerina programming language" />
        <meta
          property="og:description"
          content="Step-by-step guides on how you can develop your integration scenarios in Ballerina."
        />
        <meta
          property="og:image"
          itemProp="image"
          content="https://ballerina.io/images/ballerina-learn-integration-tutorials-page-sm-banner.png"
        />

        {/* LINKED IN */}
        <meta property="og:title" content="Integration tutorials - The Ballerina programming language" />
        <meta
          property="og:image"
          content="https://ballerina.io/images/ballerina-learn-integration-tutorials-page-sm-banner.png"
        />
        <meta
          property="og:description"
          itemProp="image"
          content="Step-by-step guides on how you can develop your integration scenarios in Ballerina."
        />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ballerinalang" />
        <meta name="twitter:creator" content="@ballerinalang" />
        <meta name="twitter:title" content="Integration tutorials - The Ballerina programming language" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:description"
          content="Step-by-step guides on how you can develop your integration scenarios in Ballerina."
        />
        <meta
          name="twitter:image"
          content="https://ballerina.io/images/ballerina-learn-integration-tutorials-page-sm-banner.png"
        />
        <meta
          property="twitter:text:description"
          content="Step-by-step guides on how you can develop your integration scenarios in Ballerina."
        />
        <meta
          property="twitter:image"
          content="https://ballerina.io/images/ballerina-learn-integration-tutorials-page-sm-banner.png"
        />
      </Head>

      <Layout>

        <Col sm={12}>
          <Row className="pageHeader pageContentRow llanding">

            <Col xs={12}>
              <Container>
                <h1>Integration tutorials</h1>
              </Container>
            </Col>


          </Row>

          <Row className="pageContentRow llanding">

            <Col xs={12} md={12}>
              <Container>
                <p>
                  Step-by-step guides on how you can develop your integration scenarios in Ballerina.
                </p>
              </Container>
            </Col>
          </Row>

          <Row className="selectedTagContainer">
            <Col xs={12}>
              <Container>
                {selectedTags.map((selectedTag)=>{
                  return(
                    <Badge as={"a"} key={selectedTag} className="selectedTagBadge" onClick={()=>handleSelectedTag(selectedTag)} bg="#888" pill>{selectedTag}
                    <RxCross2 className="selectedTagIcon" />
                    </Badge>
                  )
                })}
              </Container>
            </Col>
          </Row>

          <Row className="pageContentRow llanding">
            <Col xs={12} md={12}>
              <Container>
                <Row>
                  {/* Left Column */}
                  {filteredTags.map((item)=>{
                    return(
                      <SampleList name={item.name} key={item.name} description={item.description} tags={item.tags} icon={item.icon} handleSelectedTag={handleSelectedTag}>
                      </SampleList>
                    )
                  })}
                </Row>
              </Container>
            </Col>
          </Row>

        </Col>


      </Layout>
    </>
  );
}
