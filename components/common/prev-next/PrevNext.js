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


import LearnToc from '../../../files1.json';
import { prefix } from '../../../utils/prefix';
// import styles from './LeftNav.module.css';

export default function PrevNext(props) {
//   const launcher = props.launcher;
//   let id = props.id;
  const Elements = LearnToc;
//   console.log(Elements);

//   function comparePositions(a, b) {
//     return a.position - b.position;
//   }
  
//   const SortedDir = Elements.sort(comparePositions);

//   function MainDir(props) {
//     let category = props.category;
    
//     return  <Accordion.Item eventKey={category.id}>
//               <Accordion.Header>{category.dirName}</Accordion.Header>
//               <Accordion.Body className={styles.accordionBody}>
//                 <ul className={styles.firstTier}>
//                 {
//                 (category.subDirectories) ?
//                   <SubDir directories={category.subDirectories}/>
//                 : <li key={category.dirName}>{category.dirName}</li>
//                 }
//                 </ul>
//               </Accordion.Body>
//             </Accordion.Item>;
//   }

//   function SubDir(props) {
//     let directories = props.directories.sort(comparePositions);
//     return directories.map((directory) => (
//       <>
//       {
//       (directory.isDir && directory.position > 0) ?
//       <>
//         <Accordion>
//           <Accordion.Item eventKey={directory.id}>
//             <Accordion.Header>{directory.dirName}</Accordion.Header>
//             <Accordion.Body>
//               <ul className={styles.secondTier}>
//                 <SubDir directories={directory.subDirectories}/>
//               </ul>
//             </Accordion.Body>
//           </Accordion.Item>
//         </Accordion>
//        </> 
//         : 
//           (directory.position > 0) ?
//             <li key={directory.dirName}>
//               <a id={directory.id} className={(id === directory.id)? "active":null} 
//                 href={(`${prefix}`)? `${prefix}` + directory.url : directory.url}>
//                 {directory.dirName}
//               </a>
//             </li>
//           : null
//       }
//       </>
      
//     ));
//   }
  
  return (
    <>
    
    <Col xs={6} className='prevLink'>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#20b6b0" className="bi bi-chevron-left" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg> &nbsp;
                <a href='#'>Install Ballerina</a>
              </Col>
              <Col xs={6} className='nextLink'>
                <a href='#'>Language basics</a> &nbsp;
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#20b6b0" className="bi bi-chevron-right" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </Col>

  
    </>
  );
}
