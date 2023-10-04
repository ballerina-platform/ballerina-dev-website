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

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Accordion from "react-bootstrap/Accordion";
import { prefix } from "../../../utils/prefix";
import styles from "./LeftNav.module.css";

export default function LeftNavYaml({ navContent, bbe = null, viewer = null }) {
  const [baseUrl, setBaseUrl] = useState("");
  const [activeTopLevel, setActiveTopLevel] = useState(null);
  const [activeSubLevel, setActiveSubLevel] = useState(null);

  useEffect(() => {
    if (viewer === null) {
      for (let l1 of navContent.sublinks) {
        for (let l2 of l1.sublinks) {
          for (let bbeContent of l2.sublinks) {
            if (bbeContent.url === bbe) {
              setActiveTopLevel(l1.id);
              setActiveSubLevel(l2.id);
            }
          }
        }
      }
    } else {
      setActiveTopLevel(viewer);
    }
    setBaseUrl(navContent.url);
  }, [navContent, bbe, viewer]);

  function MainDir({ navContent }) {
    return (
      <Accordion
        defaultActiveKey={activeTopLevel}
        className={styles.leftNavAccordian}
        flush
      >
        {navContent &&
          navContent.sublinks.map((category, index) => (
            <Accordion.Item
              key={index}
              eventKey={category.id}
              className={styles.acItem}
            >
              <Accordion.Header className={styles.mainDir}>
                {category.title}
              </Accordion.Header>
              <Accordion.Body className={styles.accordionBody}>
                <ul className={styles.firstTier}>
                  {category.hasOwnProperty("sublinks") ? (
                    <SubDir
                      active={activeTopLevel === index + 1}
                      directories={category.sublinks}
                    />
                  ) : null}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          ))}
      </Accordion>
    );
  }

  function SubDir({ active = false, directories }) {
    return directories.map((directory) => (
      <>
        {directory.hasOwnProperty("sublinks") ? (
          <>
            <Accordion defaultActiveKey={active ? activeSubLevel : null}>
              <Accordion.Item eventKey={directory.id} className={styles.acItem}>
                <Accordion.Header>{directory.title}</Accordion.Header>
                <Accordion.Body className={styles.acBody}>
                  <ul className={styles.secondTier}>
                    <SubDir directories={directory.sublinks} />
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </>
        ) : (
          <li key={directory.id}>
            <Link
              id={directory.id}
              className={bbe === directory.url ? styles.active : null}
              href={
                `${prefix}`
                  ? `${prefix}/learn/by-example/${directory.url}`
                  : `/learn/by-example/${directory.url}`
              }
            >
              <a className={bbe === directory.url ? styles.active : null}>
                {directory.title}
              </a>
            </Link>
          </li>
        )}
      </>
    ));
  }

  return <MainDir navContent={navContent} />;
}
