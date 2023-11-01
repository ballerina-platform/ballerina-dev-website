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

  const handlePrev = (outDirIndex , innerDirIndex )=>{
    if(Array.isArray(innerDirIndex)){
      let [middleDirIndex,thirdDirIndex] = innerDirIndex
      if(Array.isArray(thirdDirIndex)){
        let [thirdL1DirIndex,thirdL2DirIndex] = thirdDirIndex
        if(thirdL2DirIndex===1){
          thirdL2DirIndex=SortedDir[outDirIndex].subDirectories[middleDirIndex].subDirectories[thirdL1DirIndex].subDirectories.length-1;
          if(thirdL1DirIndex===0){
            thirdL1DirIndex=SortedDir[outDirIndex].subDirectories[middleDirIndex-1].subDirectories[SortedDir[outDirIndex].subDirectories[middleDirIndex-1].subDirectories.length-1];
            if(middleDirIndex===0){
              setPrevDetails(SortedDir[outDirIndex-1].subDirectories[SortedDir[outDirIndex-1].subDirectories.length-1])
            }
            else{
              setPrevDetails(SortedDir[outDirIndex].subDirectories[middleDirIndex-1].subDirectories[SortedDir[outDirIndex].subDirectories[middleDirIndex-1].subDirectories.length-1])
            }
          }
          else{
            setPrevDetails(SortedDir[outDirIndex].subDirectories[middleDirIndex].subDirectories[thirdL1DirIndex-1])
          }
        }
        else{
          setPrevDetails(SortedDir[outDirIndex].subDirectories[middleDirIndex].subDirectories[thirdL1DirIndex].subDirectories[thirdL2DirIndex-1])
        }
      }
      else{
        if(thirdDirIndex===0){
          thirdDirIndex=SortedDir[outDirIndex].subDirectories[middleDirIndex].subDirectories.length-1;
          if(middleDirIndex===0){
            setPrevDetails(SortedDir[outDirIndex-1].subDirectories[SortedDir[outDirIndex-1].subDirectories.length-1])
          }
          else{
            setPrevDetails(SortedDir[outDirIndex].subDirectories[middleDirIndex-1].subDirectories[SortedDir[outDirIndex].subDirectories[middleDirIndex-1].subDirectories.length-1])
  
          }
        }
        else{
          setPrevDetails(SortedDir[outDirIndex].subDirectories[middleDirIndex].subDirectories[thirdDirIndex-1])
        }
      }
    }
    else{
      if(innerDirIndex===0){
        if(outDirIndex!==0){
          outDirIndex--;
          innerDirIndex=SortedDir[outDirIndex].subDirectories.length-1;
          setPrevDetails(SortedDir[outDirIndex].subDirectories[innerDirIndex])
        }
    }
      else{
        setPrevDetails(SortedDir[outDirIndex].subDirectories[innerDirIndex-1])
      }
    }
  }
  const handleNext = (outDirIndex , innerDirIndex )=>{
    if(Array.isArray(innerDirIndex)){
      let [middleDirIndex,thirdDirIndex] = innerDirIndex
      if(Array.isArray(thirdDirIndex)){
        let [thirdL1DirIndex,thirdL2DirIndex] = thirdDirIndex
        if(thirdL2DirIndex===SortedDir[outDirIndex].subDirectories[middleDirIndex].subDirectories[thirdL1DirIndex].subDirectories.length-1){
          if(thirdL1DirIndex!==SortedDir[outDirIndex].subDirectories[middleDirIndex].subDirectories.length-1){
            if(middleDirIndex!==SortedDir[outDirIndex].subDirectories.length-1){
                  middleDirIndex++;
                  thirdL1DirIndex++;
                  thirdL2DirIndex=0;
                  setNextDetails(SortedDir[outDirIndex].subDirectories[middleDirIndex].subDirectories[thirdL1DirIndex].subDirectories[thirdL2DirIndex])
            }
            else{
                if(outDirIndex!==SortedDir.length-1){
                  outDirIndex++;
                  middleDirIndex=0;
                  thirdL1DirIndex=0;
                  thirdL2DirIndex=0;
                  setNextDetails(SortedDir[outDirIndex].subDirectories[middleDirIndex].subDirectories[thirdL1DirIndex].subDirectories[thirdL2DirIndex])
                }
            }
          }
          else{
            setNextDetails(SortedDir[outDirIndex].subDirectories[middleDirIndex+1].subDirectories[0].subDirectories[0])
          }
        }
        else{
          setNextDetails(SortedDir[outDirIndex].subDirectories[middleDirIndex].subDirectories[thirdL1DirIndex].subDirectories[thirdL2DirIndex+1])
        }
      }
      else{
        if(thirdDirIndex===SortedDir[outDirIndex].subDirectories[middleDirIndex].subDirectories.length-1){
         if(middleDirIndex!==SortedDir[outDirIndex].subDirectories.length-1){
              middleDirIndex++;
              thirdDirIndex=0;
              setNextDetails(SortedDir[outDirIndex].subDirectories[middleDirIndex].subDirectories[thirdDirIndex])
            }
            else{
              if(outDirIndex!==SortedDir.length-1){
                outDirIndex++;
                middleDirIndex=0;
                thirdDirIndex=0;
                console.log(outDirIndex,middleDirIndex,thirdDirIndex)
                setNextDetails(SortedDir[outDirIndex].subDirectories[middleDirIndex].subDirectories[thirdDirIndex])
              }
          }
    
        }
        else{
          setNextDetails(SortedDir[outDirIndex].subDirectories[middleDirIndex].subDirectories[thirdDirIndex+1])
        }
      }
    }else{
      if(innerDirIndex===SortedDir[outDirIndex].subDirectories.length-1){
        
        if(outDirIndex!==SortedDir.length-1){
            outDirIndex++;
            innerDirIndex=0;
            setNextDetails(SortedDir[outDirIndex].subDirectories[innerDirIndex])
        }
    }
      else{
        setNextDetails(SortedDir[outDirIndex].subDirectories[innerDirIndex+1])
      }
    }
  }

  React.useEffect(()=>{
    let [outDirIndex , innerDirIndex ] = findIndexOfDir(SortedDir);
    handlePrev(outDirIndex , innerDirIndex )
    handleNext(outDirIndex , innerDirIndex )
  },[])

  return (
    <>
      <Row className="mt-5 mb-5">
        <Col sm={6}>
        {prevDetails!==undefined && prevDetails.url!=="" && (<Link title={prevDetails.dirName} href={`${prefix}` + prevDetails.url}>
            <div className="btnContainer d-flex align-items-center me-auto">
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
                  fill-rule="evenodd"
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
          </Link>)}
        </Col>
        <Col sm={6}>
        {nextDetails!==undefined && Object.keys(nextDetails).length!==0 && (<Link
            title={nextDetails.dirName}
            href={`${prefix}` + nextDetails.url}
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
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
            </div>
          </Link>)}
        </Col>
      </Row>
    </>
  );
}
