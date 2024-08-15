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

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Link from "next/link";

import { prefix } from '../../../utils/prefix';

export default function PrevNext(props) {
  const { id, Toc } = props;
  const [prevDetails, setPrevDetails] = useState({});
  const [nextDetails, setNextDetails] = useState({});
  const [btnHover, updateBtnHover] = useState([false, false]);

  // Helper to flatten directories and keep track of full path, only include non-directory items
  function flattenDirectories(directories, prefix = '') {
    let flatList = [];
    directories.forEach((dir) => {
      const path = `${prefix}/${dir.id}`;
      if (!dir.isDir) {
        flatList.push({ ...dir, path });
      }
      if (dir.subDirectories) {
        flatList = [...flatList, ...flattenDirectories(dir.subDirectories, path)];
      }
    });
    return flatList;
  }

  // Using useMemo to calculate this only when Toc or id changes
  const flatDirectories = React.useMemo(() => flattenDirectories(Toc.subDirectories), [Toc]);

  // Find current index based on id
  function findCurrentIndex() {
    return flatDirectories.findIndex(item => item.id === id);
  }

  // Set navigation details
  function handleNavigation() {
    const currentIndex = findCurrentIndex();
    if (currentIndex !== -1) {
      const prevItem = flatDirectories[currentIndex - 1];
      const nextItem = flatDirectories[currentIndex + 1];
      if (prevItem) {
        setPrevDetails(prevItem);
      } else {
        setPrevDetails({});
      }
      if (nextItem) {
        setNextDetails(nextItem);
      } else {
        setNextDetails({});
      }
    }
  }

  // Handle navigation effect
  useEffect(() => {
    handleNavigation();
  }, [id, flatDirectories]); // Dependency on flatDirectories ensures re-calculation when Toc changes

  function goto(url, dir) {
    if ((dir === 'API Docs' || dir === "Ballerina by Example" ||
      dir === "Visual Studio Code extension" || dir === "Ballerina API Docs" ||
      dir === "Enterprise Integration Patterns (EIP)" || dir === "Pre-built integrations") ||
      dir === "Integration tutorials") {
      window.open(`${prefix}${url}`, "_blank")
    } else {
      window.location.href = `${prefix}${url}`;
    }
  }

  return (
    <>
      <Row className="mt-5 mb-5">
        <Col sm={6}>
          {prevDetails.url && (
            <div className="btnContainer d-flex align-items-center me-auto" onClick={() => goto(prevDetails.url, prevDetails.dirName)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#3ad1ca"
                className={`${btnHover[0] ? "prevNextBtnArrowHover" : "btnArrow"
                  } bi bi-arrow-right`}
                viewBox="0 0 16 16"
                onMouseEnter={() => updateBtnHover([true, false])}
                onMouseOut={() => updateBtnHover([false, false])}
              >
                <path
                  fillRule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
              </svg>
              <div className="d-flex flex-column ms-4">
                <span className="btnPrev">Previous</span>
                <span
                  className={btnHover[0] ? "prevNextBtnHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([true, false])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  {prevDetails.dirName}
                </span>
              </div>
            </div>
          )}
        </Col>
        <Col sm={6}>
          {nextDetails.url && (
            <div className="btnContainer d-flex align-items-center ms-auto" onClick={() => goto(nextDetails.url, nextDetails.dirName)}>
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "prevNextBtnHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  {nextDetails.dirName}
                </span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#3ad1ca"
                className={`${btnHover[1] ? "prevNextBtnArrowHover" : "btnArrow"
                  } bi bi-arrow-right`}
                viewBox="0 0 16 16"
                onMouseEnter={() => updateBtnHover([false, true])}
                onMouseOut={() => updateBtnHover([false, false])}
              >
                <path
                  fillRule="evenodd"
                  d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                />
              </svg>
            </div>

          )}
        </Col>
      </Row>
    </>
  );
}
