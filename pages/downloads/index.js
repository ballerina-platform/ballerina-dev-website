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
import Image from 'next-image-export-optimizer';
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
            <Row className={`${styles.downloadContentRow} cDownloadsHeader pageHeader`}>
               <Col xs={12}>
                  <h1>Downloads</h1> 
               </Col>
            </Row>

            <Row className={`${styles.donwloadVersion} ${styles.downloadContentRow}`}>
               <Col xs={10}>
                  <h2 id="swanlake"><span>{swanlake['display-version']}</span></h2>
               </Col>
               <Col xs={2}>
                  <div className={styles.releaseLinks} >
                     <div className={styles.releaseNotes} >
                        <p><a href={`${prefix}/downloads/swan-lake-release-notes/swan-lake-${swanlake.version}`}>RELEASE NOTES &gt;</a></p>
                     </div>
                  </div>
               </Col>
            </Row>

            <Row className={`${styles.donwloadVersion} ${styles.downloadContentRow}`}>
               <Col xs={12}>
                  <p>If you are new to Ballerina, download the relevant Ballerina distribution based on your operating system and install it.</p>
               </Col>
            </Row>

            <Row className={`${styles.donwloadVersion} ${styles.downloadContentRow}`}>
               <Packs info={swanlake}/>
            </Row>

            <Row className={`${styles.downloadsOther} ${styles.downloadContentRow}`}>
               <Col xs={12} sm={12} md={12} lg={6}>
                  <div className="cInstallers">
                     <h3>Other installation options</h3>
                  </div>
                  <div className="">
                        <table id="insPackages1">
                           <tr>
                              <td>Install via Homebrew (for macOS)
                                 <a href={`${prefix}/downloads/installation-options/#install-using-homebrew`} className={styles.cDownloadLinkIcon}>
                                    <Image src={`${prefix}/images/right-bg-green-fill.svg`} width={13} height={13} alt="Install via Homebrew (for macOS)"/>
                                 </a>
                              </td>
                           </tr>
                           <tr>
                              <td>Install via the ZIP archive
                                 <a href={`${prefix}/downloads/installation-options/#install-via-the-ballerina-language-zip-file`} className={styles.cDownloadLinkIcon}>
                                    <Image src={`${prefix}/images/right-bg-green-fill.svg`} width={13} height={13} alt="Install via the ZIP archive"/>
                                 </a>
                              </td>
                           </tr>
                           <tr>
                              <td>Install from source
                                 <a href={`${prefix}/downloads/installation-options/#build-from-source`} className={styles.cDownloadLinkIcon}>
                                    <Image src={`${prefix}/images/right-bg-green-fill.svg`} width={13} height={13} alt="Install from source"/>
                                 </a>
                              </td>
                           </tr>
                        </table>
                  </div>
               </Col>
            </Row>

            <Row className={`${styles.donwloadVersion} ${styles.downloadContentRow}`}>
               <Col xs={12}>
                  <p><ul>
                     <li>
                     To verify that Ballerina was successfully installed, execute 
                     the <code className="highlighter-rouge language-plaintext">bal version<span aria-hidden="true" className="line-numbers-rows"><span></span></span></code> command 
                     in the Terminal/Shell.
                     </li>
                     <li>
                     To verify the Ballerina release artifact signatures, see <a href={`${prefix}/downloads/verify-ballerina-artifacts/`} className={styles.instructions}>Verify Ballerina artifacts</a>.
                     </li>
                     <li>
                     To view older releases, see <a href={`${prefix}/downloads/archived/#swan-lake-archived-versions`} className={styles.instructions}>Archived versions</a>.
                     </li>
                     </ul>
                  </p>
               </Col>
            </Row>

            <Row className={`${styles.downloadsVSCode} ${styles.downloadContentRow}`}>
               <Col xs={12} sm={12} md={12} lg={6}>
               <p>Next, click <a href="vscode://wso2.ballerina/open-file?gist=74cea880fefcb463d26a0c46f38fce39&file=hello_world.bal" target="_blank" rel="noreferrer">here</a> to open <code className="highlighter-rouge language-plaintext">hello_world.bal<span aria-hidden="true" className="line-numbers-rows"><span></span></span></code> sample on VSCode and run.</p>
                  <p>Refer <a href={`${prefix}/learn/`}>learn</a> page for more guides and material.</p>
               </Col>
            </Row>

            <Row className={`${styles.downloadsVSCode} ${styles.downloadContentRow}`}>
               <Col xs={12} sm={12} md={12} lg={12}>
                 
               </Col>
            </Row>

            <Row className={`${styles.downloadsVSCode} ${styles.downloadContentRow}`}>
               <Col xs={12}>
                  <p className={styles.dVSCode} style={vscodeIcon}>Ballerina VSCode Extension</p>
                  <p>
                     <ul>
                        <li>
                           Ballerina VSCode is available in <a href="https://marketplace.visualstudio.com/items?itemName=wso2.ballerina" target="_blank" rel="noreferrer">Marketplace</a>
                        </li>
                        <li>
                           For detailed information, go to the <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank" rel="noreferrer">Ballerina VSCode extension documentation</a>.
                        </li>
                     </ul>
                  </p>
               </Col>
            </Row>
         </Col>
      </Layout>
    
  );
}
