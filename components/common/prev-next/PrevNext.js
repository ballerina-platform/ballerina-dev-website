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
import { Col } from 'react-bootstrap';


import { prefix } from '../../../utils/prefix';
import { useState } from 'react';
// import styles from './LeftNav.module.css';

export default function PrevNext(props) {
  const launcher = props.launcher;
  let id = props.id;
  let mainDir = props.mainDir;
  let sub = props.sub;
  let third = props.third;
  const Elements = props.Toc.subDirectories;
  const [prevDetails,setPrevDetails]=useState({})
  const [nextDetails,setNextDetails]=useState({})

  function comparePositions(a, b) {
    return a.position - b.position;
  }
  
  const SortedDir = Elements.sort(comparePositions);

  function goto(url) {
    window.location.href=`${prefix}` + url;
  }

  function findIndexOfDir(dir) {
    for (let i = 0; i < dir.length; i++) {
      if (Array.isArray(dir[i].subDirectories)) {
        const innerIndex = findIndexOfDir(dir[i].subDirectories);
        if (innerIndex !== -1) {
          return [i, innerIndex];
        }
      } else if (dir[i].id === id) {
        return i;
      }
    }
    return -1;
  }
  let [outDirIndex , innerDirIndex  ] = findIndexOfDir(SortedDir);
  const handlePrev = ()=>{
    if(Array.isArray(innerDirIndex)){
      let [middleDirIndex,thirdDirIndex] = innerDirIndex
      if(thirdDirIndex===0){
        middleDirIndex--;
        thirdDirIndex=SortedDir[middleDirIndex].subDirectories.length-1;
        if(middleDirIndex===0){
          setPrevDetails(SortedDir[outDirIndex].subDirectories[middleDirIndex-1].subDirectories[SortedDir[middleDirIndex-1].subDirectories.length-1])
          goto(SortedDir[outDirIndex].subDirectories[middleDirIndex-1].subDirectories[SortedDir[middleDirIndex-1].subDirectories.length-1].url)
        }
      }
        setPrevDetails(SortedDir[outDirIndex].subDirectories[middleDirIndex].subDirectories[thirdDirIndex-1])
        goto(SortedDir[outDirIndex].subDirectories[middleDirIndex].subDirectories[thirdDirIndex-1].url)
    }else{
      if(innerDirIndex===0){
        outDirIndex--;
        innerDirIndex=SortedDir[outDirIndex].subDirectories.length-1;
        setPrevDetails(SortedDir[outDirIndex].subDirectories[innerDirIndex])
        goto(SortedDir[outDirIndex].subDirectories[innerDirIndex].url)
      }
      else{
        setPrevDetails(SortedDir[outDirIndex].subDirectories[innerDirIndex-1])
        goto(SortedDir[outDirIndex].subDirectories[innerDirIndex-1].url)
      }
    }
  }
  const handleNext = ()=>{
    if(Array.isArray(innerDirIndex)){
      let [middleDirIndex,thirdDirIndex] = innerDirIndex
      if(thirdDirIndex===SortedDir[outDirIndex].subDirectories[middleDirIndex].subDirectories.length-1){
        middleDirIndex++;
        thirdDirIndex=0;
        goto(SortedDir[outDirIndex].subDirectories[middleDirIndex].subDirectories[thirdDirIndex].url)
      }
      else{
        setNextDetails(SortedDir[outDirIndex].subDirectories[middleDirIndex].subDirectories[thirdDirIndex+1])
        goto(SortedDir[outDirIndex].subDirectories[middleDirIndex].subDirectories[thirdDirIndex+1].url)
      }
    }else{
      if(innerDirIndex===SortedDir[outDirIndex].subDirectories.length-1){
      outDirIndex++;
      innerDirIndex=0;
      setNextDetails(SortedDir[outDirIndex].subDirectories[innerDirIndex])
      goto(SortedDir[outDirIndex].subDirectories[innerDirIndex].url)
      }
      else{
        setNextDetails(SortedDir[outDirIndex].subDirectories[innerDirIndex+1])
        goto(SortedDir[outDirIndex].subDirectories[innerDirIndex+1].url)
      }
    }
  }

  return (
    <>
    
    <Col xs={6} className='prevLink'>
              <div onClick={handlePrev}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#20b6b0" className="bi bi-chevron-left" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg> &nbsp;
                <a>Previous {prevDetails.dirName}</a>
              </div>
              </Col>
              <Col xs={6} className='nextLink'>
                <div onClick={handleNext}>
                  <a>Next {nextDetails.dirName}</a> &nbsp;
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#20b6b0" className="bi bi-chevron-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </div>
              </Col>  
    </>
  );
}
