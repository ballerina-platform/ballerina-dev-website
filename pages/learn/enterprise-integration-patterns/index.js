/**
 * Copyright (c) 2022, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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

import { load } from "js-yaml";
import Head from "next/head";
import fs from "fs";
import path from 'path';
import React, { useEffect, useState } from "react";
import { Row, Col, Container, Badge } from "react-bootstrap";
import Layout from "../../../layouts/LayoutLearn";
import { useRouter } from "next/router";
import Pattern from "../../../components/learn/pattern/Pattern";
import {RxCross2} from "react-icons/rx"

const baseDirectory = path.resolve("pages/learn/enterprise-integration-patterns/enterprise-integration-patterns");

export async function getStaticProps() {
  const files = fs.readdirSync(baseDirectory);
  var patterns = {};
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(baseDirectory, file);
    const stats = fs.statSync(filePath);
    const balPath = path.join(filePath, file + ".bal");
    const ymlPath = path.join(baseDirectory, file, file + ".yml");
    if (!stats.isDirectory() || !(fs.existsSync(balPath) || fs.existsSync(ymlPath))) {
      continue;
    }
    const name = file.replace(/-.|^./g, x => " " + x.slice(-1).toUpperCase()).trim();
    var pattern = loadYml(ymlPath) || {};
    pattern.name = pattern.name ?? name;
    const category = pattern.category ?? "uncategorized";
    const existingCategory = patterns[category];
    if (existingCategory) {
      existingCategory.push(pattern);
    } else {
      patterns[category] = [pattern];
    }
  }
  for (const category of Object.values(patterns)) {
    category.sort((a, b) => {
      const ai = a.index ?? -1;
      const bi = b.index ?? -1;
      return ai - bi;
    });
  }
  // list of categories, sorted by index
  const categories = Object.keys(patterns).sort((a, b) => { return (patterns[a][0].index ?? -1) - (patterns[b][0].index ?? -1) });
  return { props: { categories, patterns } };
}

function loadYml(ymlPath) {
  if (!fs.existsSync(ymlPath)) {
    return {};
  }
  return load(fs.readFileSync(ymlPath, "utf-8"));
}

export default function PatternList(props) {

  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState(props.categories);

  const router = useRouter();

  function handleSelectedTag(selectedCategory) {
    if (selectedTags.includes(selectedCategory)) {
      let filters = selectedTags.filter((el) => el !== selectedCategory);
      setSelectedTags(filters);
    } else {
      setSelectedTags([...selectedTags, selectedCategory]);
    }
  }

  useEffect(() => {
    handleFilteredTags();
  }, [selectedTags]);

  function handleFilteredTags() {
    if (selectedTags.length > 0) {
      const filteredItems = [];
  
      for (const category of props.categories) {
        if (props.patterns[category]) {
          const filteredCategoryItems = props.patterns[category].filter((data) => {
            return selectedTags.every((tag) => data.tags.includes(tag));
          });
  
          if (filteredCategoryItems.length > 0) {
            filteredItems.push({
              category: category,
              data: filteredCategoryItems,
            });
          }
        }
      }
  
      setFilteredTags(filteredItems);
    } else {
      setFilteredTags(
        props.categories.map((category) => ({
          category,
          data: props.patterns[category] || [],
        }))
      );
    }
  }

  return (
    <>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Ballerina usage patterns and best practices for implementing enterprise integrations."
        />
        <meta name="author" content="WSO2 LLC" />
        <meta
          name="keywords"
          content="ballerina, learn, documentation, docs, programming language"
        />
        <link rel="shortcut icon" href="/img/favicon.ico" />
        <title>Enterprise Integrations Patterns - The Ballerina programming language</title>

        {/* FB */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Enterprise Integrations Patterns - The Ballerina programming language" />
        <meta
          property="og:description"
          content="Ballerina usage patterns and best practices for implementing enterprise integrations."
        />
        <meta
          property="og:image"
          itemProp="image"
          content="https://ballerina.io/images/ballerina-swan-lake-eip-sm-banner.png"
        />

        {/* LINKED IN */}
        <meta property="og:title" content="Enterprise Integrations Patterns - The Ballerina programming language" />
        <meta
          property="og:image"
          content="https://ballerina.io/images/ballerina-swan-lake-eip-sm-banner.png"
        />
        <meta
          property="og:description"
          itemProp="image"
          content="Ballerina usage patterns and best practices for implementing enterprise integrations."
        />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ballerinalang" />
        <meta name="twitter:creator" content="@ballerinalang" />
        <meta name="twitter:title" content="Enterprise Integrations Patterns - The Ballerina programming language" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:description"
          content="Ballerina usage patterns and best practices for implementing enterprise integrations. "
        />
        <meta
          name="twitter:image"
          content="https://ballerina.io/images/ballerina-swan-lake-eip-sm-banner.png"
        />
        <meta
          property="twitter:text:description"
          content="Ballerina usage patterns and best practices for implementing enterprise integrations."
        />
        <meta
          property="twitter:image"
          content="https://ballerina.io/images/ballerina-swan-lake-eip-sm-banner.png"
        />
      </Head>

      <Layout>
        <Col sm={12}>
          <Row className="pageHeader pageContentRow llanding">

            <Col xs={12}>
              <Container>
                <h1>Enterprise Integrations Patterns</h1>
              </Container>
            </Col>


          </Row>

          <Row className="pageContentRow llanding">

            <Col xs={12} md={12}>
              <Container>
                <p className="intro">
                  Ballerina usage patterns and best practices for implementing enterprise integrations. These patterns are based on the <a href="https://www.enterpriseintegrationpatterns.com">Enterprise Integration Patterns</a> book by Gregor Hohpe and Bobby Woolf. Each sample is a simplified version of a real-world integration scenario.
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

          <Row className="pageContentRow llanding" >
            <Col xs={12}>
            {filteredTags.map((categoryData) => (
              <Container key={categoryData.category}>
                <h2>{categoryData.category}</h2>
                <Row>
                  {categoryData.data && categoryData.data.map((p) => (
                    <Pattern
                      name={p.name}
                      description={p.tagline ?? p.desc}
                      tags={p.tags ?? []}
                      key={p.name}
                      handleSelectedTag={handleSelectedTag}
                    />
                  ))}
                </Row>
              </Container>
            ))}

            </Col>
          </Row>

        </Col>
        
      </Layout>

    </>
  );
}
