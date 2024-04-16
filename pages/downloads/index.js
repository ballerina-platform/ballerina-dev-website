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

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import dynamic from 'next/dynamic';

import Layout from '../../layouts/LayoutDownloads';
import styles from '../../styles/Downloads.module.css'
import { prefix } from '../../utils/prefix';
import swanlake from '../../_data/swanlake-latest/metadata.json';

export default function Downloads() {

   const Packs = dynamic(() => import('../../components/downloads/packs/Packs'), { ssr: false });
 
   let vsCodeImagePath = prefix + '/images/downloads/vs-code.svg';

   const vscodeIcon = {
      backgroundImage: 'url('+ vsCodeImagePath +')'
   }

   return (
      <Layout>
         <Col sm={12}>
            <Row className="cDownloadsHeader pageHeader pageContentRow">
               <Col xs={12}>
                  <h1>Downloads</h1> 
               </Col>
            </Row>

            <Row className={`${styles.downloadVersion} ${styles.downloadContentRow}`}>
               <Col xs={12}>
                  <h2>Step 1 - Install Ballerina Swan Lake</h2> 
               </Col>
            </Row>

            <Row className={`${styles.downloadVersion} ${styles.downloadContentRow} pageContentRow`}>
               <Col xs={12}>
                  <p>If you are new to Ballerina, download the relevant Ballerina distribution based on your operating system and install it.</p>
               </Col>
            </Row>

            <Row className={`${styles.downloadVersion}`}>
               <h3>{swanlake['display-version']}</h3>
            </Row>

            <Row className={`${styles.downloadContentRow}`}>
               <Packs info={swanlake}/>
            </Row>

            <Row className={`${styles.downloadContentRow}`}>
               <div className={styles.releaseLinks} >
                     <div className={styles.releaseNotes} >
                        <p><a href={`${prefix}/downloads/swan-lake-release-notes/swan-lake-${swanlake.version}`}>RELEASE NOTES &gt;</a></p>
                     </div>
               </div>
            </Row>

            <Row className={`${styles.downloadVersion} ${styles.downloadContentRow} ${styles.InstallInfo}`}>
            <Col xs={12} sm={12} md={12} lg={12}>
                  <p>
                     <ul>
                        <li>
                           <b>macOS Users:</b> Install quickly with <code className="highlighter-rouge language-plaintext">brew install bal<span aria-hidden="true" className="line-numbers-rows"><span></span></span></code>.
                        </li>
                        <li>
                           <b>Installation Options:</b> Check out various methods in our <a href={`${prefix}/downloads/installation-options/`} className={styles.instructions}>guide</a>.
                        </li>
                        <li>
                           <b>Artifact Signature Verification:</b> Ensure authenticity using our <a href={`${prefix}/downloads/verify-ballerina-artifacts/`} className={styles.instructions}>verification guide</a>.
                        </li>
                        <li>
                           <b>Previous Releases:</b> Find older versions in <a href={`${prefix}/downloads/archived/#swan-lake-archived-versions`} className={styles.instructions}>Archived versions</a>.
                        </li>
                     </ul>
                  </p>
               </Col>
            </Row>

            <Row className={`${styles.downloadVersion} ${styles.downloadContentRow}`}>
               <Col xs={12}>
                  <h2>Step 2 - Verify the installation</h2> 
               </Col>
            </Row>

            <Row className={`${styles.downloadVersion} ${styles.downloadContentRow} pageContentRow`}>
               <Col xs={12}>
                  <p>
                     To verify that Ballerina was successfully installed, execute 
                     the <code className="highlighter-rouge language-plaintext">bal version<span aria-hidden="true" className="line-numbers-rows"><span></span></span></code> command 
                     in the Terminal/Shell. Refer to the <a href={`${prefix}/learn/cli-commands/`} className={styles.instructions}>CLI commands</a> page to learn about more commands.
                  </p>
               </Col>
            </Row>

            <Row className={`${styles.downloadVersion} ${styles.downloadContentRow}`}>
               <Col xs={12}>
                  <h2>Step 3 - Run a sample program</h2> 
               </Col>
            </Row>

            <Row className={`${styles.downloadsVSCode} ${styles.downloadContentRow}`}>
               <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={3}>
                  <a id="packVsCode" href="vscode://wso2.ballerina/open-file?gist=74cea880fefcb463d26a0c46f38fce39&file=hello_world.bal" 
                  className={styles.cVSCodeSample} data-download="downloads" 
                  target="_blank" rel="noreferrer">
                     <div className={styles.cSize}>Open <code style={{padding:"3px", color:"#585a5e"}}>hello_world.bal</code> on <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Visual Studio Code</p></div>
                  </a>
               </Col>

               <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={9}>
                  <p>You will be prompted to install the Ballerina Visual Studio Code extension.</p>
                  <p>For more information, see the <a href="https://wso2.com/ballerina/vscode/" target="_blank" rel="noreferrer">Ballerina Visual Studio Code extension</a>.</p>
               </Col>
            </Row>

            <Row className={`${styles.downloadsVSCode} ${styles.downloadContentRow}`}>
               <Col xs={12} sm={12} md={12} lg={12}>
               <p>Run the program by using the Run CodeLens of Visual Studio Code. For more information, see <a href=" https://wso2.com/ballerina/vscode/docs/run-a-program/" target="_blank" rel="noreferrer">Run a program</a>.</p>
               </Col>
            </Row>

            <Row className={`${styles.downloadsVSCode} ${styles.downloadContentRow}`}>
               <Col xs={12} sm={12} md={12} lg={6}>
                  <p>Now, you are all set! For more guides, see <a href={`${prefix}/learn/`}> Learn</a>.</p>
               </Col>
            </Row>
         </Col>
      </Layout>
    
  );
}
