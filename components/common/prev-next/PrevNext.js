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
import { useState } from 'react';
import { Row,Col } from 'react-bootstrap';
import Link from "next/link";



import { prefix } from '../../../utils/prefix';

// import styles from './LeftNav.module.css';

export default function PrevNext(props) {
  const launcher = props.launcher;
  let id = props.id;
  let mainDir = props.mainDir;
  let sub = props.sub;
  let third = props.third;
  const Elements = props.Toc.subDirectories;
  const [prevDetails,setPrevDetails]=useState({})
  const [isPrev,setIsPrev] = useState(false)
  const [nextDetails,setNextDetails]=useState({})  
  const [btnHover, updateBtnHover] = useState([false, false]);

  function comparePositions(a, b) {
    return a.position - b.position;
  }
  
  const SortedDir = Elements.sort(comparePositions);

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


  const handlePrev = (outDirIndex, innerDirIndex) => {
    let newOutDirIndex = outDirIndex;
    let newInnerDirIndex = innerDirIndex;

    if(Array.isArray(innerDirIndex)){
      console.log(innerDirIndex)
      if(Array.isArray(innerDirIndex[1])){
        if(innerDirIndex[1][1] > 0){
          newInnerDirIndex[1][1]--;
          console.log(SortedDir[outDirIndex].subDirectories[newInnerDirIndex[0]].subDirectories[newInnerDirIndex[1][0]].subDirectories[newInnerDirIndex[1][1]])
          setPrevDetails(SortedDir[outDirIndex].subDirectories[newInnerDirIndex[0]].subDirectories[newInnerDirIndex[1][0]].subDirectories[newInnerDirIndex[1][1]]);
        }
        else{
          if(innerDirIndex[1][0] > 0){
            newInnerDirIndex[1][0]--;
            console.log(SortedDir[outDirIndex].subDirectories[newInnerDirIndex[0]].subDirectories[newInnerDirIndex[1][0]]);
            setPrevDetails(SortedDir[outDirIndex].subDirectories[newInnerDirIndex[0]].subDirectories[newInnerDirIndex[1][0]]);
          }
        }
      }
      else{
        if(innerDirIndex[1] > 0){
          newInnerDirIndex[1]--;
          console.log(SortedDir[outDirIndex].subDirectories[newInnerDirIndex[0]].subDirectories[newInnerDirIndex[1]]);
          setPrevDetails(SortedDir[outDirIndex].subDirectories[newInnerDirIndex[0]].subDirectories[newInnerDirIndex[1]]);
        }
        else{
          if(innerDirIndex[0] > 0){
            newInnerDirIndex[0]--;
            console.log(SortedDir[outDirIndex].subDirectories[newInnerDirIndex[0]].subDirectories[SortedDir[newOutDirIndex].subDirectories[newInnerDirIndex[0]].subDirectories.length-1]);
            setPrevDetails(SortedDir[outDirIndex].subDirectories[newInnerDirIndex[0]].subDirectories[SortedDir[newOutDirIndex].subDirectories[newInnerDirIndex[0]].subDirectories.length-1]);
          }
          else if(outDirIndex > 0){
            newOutDirIndex--;
            console.log(SortedDir[newOutDirIndex].subDirectories[SortedDir[newOutDirIndex].subDirectories.length-1]);
            setPrevDetails(SortedDir[newOutDirIndex].subDirectories[SortedDir[newOutDirIndex].subDirectories.length-1]);
          }
        }
      }

    }
    else{
      if(innerDirIndex > 0){
        newInnerDirIndex--;
        console.log(SortedDir[outDirIndex].subDirectories[newInnerDirIndex]);
        setPrevDetails(SortedDir[outDirIndex].subDirectories[newInnerDirIndex]);
      }
      else{
        if(outDirIndex > 0){
          newOutDirIndex--;
          console.log(SortedDir[newOutDirIndex].subDirectories[SortedDir[newOutDirIndex].subDirectories.length-1]);
          setPrevDetails(SortedDir[newOutDirIndex].subDirectories[SortedDir[newOutDirIndex].subDirectories.length-1]);
        }
      }
    }

    // if (innerDirIndex[2] > 0) {
    //   newInnerDirIndex[2]--;
    // } else if (innerDirIndex[1] > 0) {
    //   newInnerDirIndex[1]--;
    //   newInnerDirIndex[2] = SortedDir[outDirIndex].subDirectories[innerDirIndex[0]].subDirectories[newInnerDirIndex[1]].subDirectories.length - 1;
    // } else if (innerDirIndex[0] > 0) {
    //   newInnerDirIndex[0]--;
    //   newInnerDirIndex[1] = SortedDir[outDirIndex].subDirectories[newInnerDirIndex[0]].subDirectories.length - 1;
    //   newInnerDirIndex[2] = SortedDir[outDirIndex].subDirectories[newInnerDirIndex[0]].subDirectories[newInnerDirIndex[1]].subDirectories.length - 1;
    // } else if (outDirIndex > 0) {
    //   newOutDirIndex--;
    //   newInnerDirIndex = SortedDir[newOutDirIndex].subDirectories.length - 1;
    // }

    // setPrevDetails(getDirectoryDetails(newOutDirIndex, newInnerDirIndex));
  };

  const handleNext = (outDirIndex, innerDirIndex) => {
    let newOutDirIndex = outDirIndex;
    let newInnerDirIndex = innerDirIndex;

    if(Array.isArray(innerDirIndex)){
      console.log(innerDirIndex)
      if(Array.isArray(innerDirIndex[1])){
        if(innerDirIndex[1][1] > 0){
          newInnerDirIndex[1][1]--;
          console.log(SortedDir[outDirIndex].subDirectories[newInnerDirIndex[0]].subDirectories[newInnerDirIndex[1][0]].subDirectories[newInnerDirIndex[1][1]])
          setPrevDetails(SortedDir[outDirIndex].subDirectories[newInnerDirIndex[0]].subDirectories[newInnerDirIndex[1][0]].subDirectories[newInnerDirIndex[1][1]]);
        }
        else{
          if(innerDirIndex[1][0] > 0){
            newInnerDirIndex[1][0]--;
            console.log(SortedDir[outDirIndex].subDirectories[newInnerDirIndex[0]].subDirectories[newInnerDirIndex[1][0]]);
            setPrevDetails(SortedDir[outDirIndex].subDirectories[newInnerDirIndex[0]].subDirectories[newInnerDirIndex[1][0]]);
          }
        }
      }
      else{
        console.log(innerDirIndex)
        if(innerDirIndex[1] < SortedDir[outDirIndex].subDirectories[innerDirIndex[0]].subDirectories.length-1){
          newInnerDirIndex[1]++;
          console.log(SortedDir[outDirIndex].subDirectories[newInnerDirIndex[0]].subDirectories[newInnerDirIndex[1]]);
          setPrevDetails(SortedDir[outDirIndex].subDirectories[newInnerDirIndex[0]].subDirectories[newInnerDirIndex[1]]);
        }
        else{
          if(innerDirIndex[0] > 0){
            newInnerDirIndex[0]--;
            console.log(SortedDir[outDirIndex].subDirectories[newInnerDirIndex[0]].subDirectories[SortedDir[newOutDirIndex].subDirectories[newInnerDirIndex[0]].subDirectories.length-1]);
            setPrevDetails(SortedDir[outDirIndex].subDirectories[newInnerDirIndex[0]].subDirectories[SortedDir[newOutDirIndex].subDirectories[newInnerDirIndex[0]].subDirectories.length-1]);
          }
          else if(outDirIndex > 0){
            newOutDirIndex--;
            console.log(SortedDir[newOutDirIndex].subDirectories[SortedDir[newOutDirIndex].subDirectories.length-1]);
            setPrevDetails(SortedDir[newOutDirIndex].subDirectories[SortedDir[newOutDirIndex].subDirectories.length-1]);
          }
        }
      }

    }
    else{
      if(innerDirIndex < SortedDir[outDirIndex].subDirectories.length-1){
        newInnerDirIndex++;
        console.log(SortedDir[outDirIndex].subDirectories[newInnerDirIndex]);
        setNextDetails(SortedDir[outDirIndex].subDirectories[newInnerDirIndex]);
      }
      else{
        if(outDirIndex < SortedDir.length-1){
          newOutDirIndex++;
          console.log(SortedDir[newOutDirIndex].subDirectories[0]);
          setNextDetails(SortedDir[newOutDirIndex].subDirectories[0]);
        }
      }
    }
  };

  React.useEffect(()=>{
    let [outDirIndex , innerDirIndex ] = findIndexOfDir(SortedDir);
    handlePrev(outDirIndex , innerDirIndex )
    // handleNext(outDirIndex , innerDirIndex )
  },[])

  function goto(url) {
    window.location.href=`${prefix}` + url;
  }
  
  return (
    <>
      <Row className="mt-5 mb-5">
        <Col sm={6}>
            {prevDetails.url!=="" ? <div className="btnContainer d-flex align-items-center me-auto" onClick={()=>goto(prevDetails.url)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#3ad1ca"
                className={`${
                  btnHover[0] ? "prevNextBtnArrowHover" : "btnArrow"
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
            </div>:''}
          
        </Col>
        <Col sm={6}>
          {/* {Object.keys(nextDetails).length!==0 ? <div className="btnContainer d-flex align-items-center ms-auto" onClick={()=>goto(nextDetails.url)}>
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
              className={`${
                btnHover[1] ? "prevNextBtnArrowHover" : "btnArrow"
              } bi bi-arrow-right`}
              viewBox="0 0 16 16"
              onMouseEnter={() => updateBtnHover([false, true])}
              onMouseOut={() => updateBtnHover([false, false])}
            >
              <path
                fill-rule="evenodd"
                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
              />
            </svg>
          </div>:''} */}
        </Col>
      </Row>

    </>
  );
}
