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
            <Row className="cDownloadsHeader pageHeader pageContentRow">
               <Col xs={12}>
                  <h1>Downloads</h1> 
               </Col>
            </Row>

            <Row className={`${styles.donwloadVersion} pageContentRow`}>
               <Col xs={12}>
                  <h2 id="swanlake"><span>{swanlake['display-version']}</span></h2>
               </Col>
            </Row>

            <Row className={`${styles.donwloadVersion} pageContentRow`}>
               <Col xs={12}>
                  <p>If you are new to Ballerina, download the relevant Ballerina distribution based on your operating system and install it.</p>
               </Col>
            </Row>

            <Row className={`${styles.donwloadVersion} pageContentRow`}>
               <Packs info={swanlake}/>
            </Row>

            <Row className={`${styles.donwloadVersion} pageContentRow`}>
               <Col xs={12}>
               <div className={styles.releaseLinks} >
                     <div className={styles.releaseNotes} >
                        <p><a href={`${prefix}/downloads/swan-lake-release-notes/swan-lake-${swanlake.version}`}>RELEASE NOTES &gt;</a></p>
                     </div>
                     <div className={styles.releaseNotes} >
                        <p><a href={`${prefix}/downloads/archived/#swan-lake-archived-versions`}>ARCHIVED VERSIONS &gt;</a></p>
                     </div>
                  </div>
               </Col>
            </Row>

            <Row className={`${styles.downloadsOther} pageContentRow`}>
               <Col xs={12} sm={12} md={6} lg={6}>
                  <div className="cInstallers">
                     <h3>Other installation options</h3>
                     <div className="">
                        <table id="insPackages1">
                           <tr> </tr>
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
                  </div>
               </Col>
            </Row>

            <Row className={`${styles.donwloadVersion} pageContentRow`}>
               <Col xs={12}>
                  <p>
                     To <a href={`${prefix}/downloads/installation-options/#verify-the-installation`} className={styles.instructions}>verify that Ballerina was successfully installed</a>, execute 
                     the <code className="highlighter-rouge language-plaintext">bal version<span aria-hidden="true" className="line-numbers-rows"><span></span></span></code> command 
                     in the Terminal/Shell. For more information on installing Ballerina, see <a href={`${prefix}/downloads/installation-options/`} className={styles.instructions}>Installation options</a>.
                  </p>
               </Col>
            </Row>

            <Row className={`${styles.donwloadVersion} pageContentRow`}>
               <Col xs={12}>
                  <h2 id="swanlake"><span>Visual Studio Code extension</span></h2>
               </Col>
            </Row>

            <Row className={`${styles.downloadsVSCode} pageContentRow`}>
               <Col xs={12}>
                  <p>Next, install the Ballerina Visual Studio Code extension from the VS Code marketplace.</p>
               </Col>
            </Row>

            <Row className={`${styles.downloadsVSCode} pageContentRow`}>
               <Col xs={12} sm={12} md={12} lg={4}>
                  <h3 className={styles.dVSCode} style={vscodeIcon}>Visual Studio Code</h3>
                  <a id="packWindows" href="https://marketplace.visualstudio.com/items?itemName=wso2.ballerina" 
                  className={styles.cDownload} data-download="downloads" 
                  target="_blank" rel="noreferrer">
                     <div className={styles.cSize}>Ballerina extension<span id="packWindowsName"></span></div>
                  </a>
               </Col>
            </Row>

            <Row className={`${styles.downloadsVSCode} pageContentRow`}>
               <Col xs={12} sm={12} md={12} lg={4}>
                  <p>Now, you are all set to <a href={`${prefix}/learn/get-started/`}>get started with Ballerina.</a></p>
               </Col>
            </Row>
         </Col>
      </Layout>
    
  );
}
