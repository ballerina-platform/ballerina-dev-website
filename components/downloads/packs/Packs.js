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

import styles from './Packs.module.css';
import { prefix } from '../../../utils/prefix';

export default function Packs(props) {

   const swanlake = props.info;

   let windowsImagePath = prefix + '/images/downloads/windows.svg';
   let linuxImagePath = prefix + '/images/downloads/linux.svg';
   let macImagePath = prefix + '/images/downloads/mac.svg';

   const windowsIcon = {
      backgroundImage: 'url(' + windowsImagePath + ')',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
   }

   const linuxIcon = {
      backgroundImage: 'url(' + linuxImagePath + ')',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
   }

   const macIcon = {
      backgroundImage: 'url(' + macImagePath + ')',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
   }


   const distServer = (global.location.origin === "https://ballerina.io") ? process.env.distServer : "https://dist-dev.ballerina.io";

   return (
      <>
         <Col xs={12} sm={12} md={12} lg={4} style={{marginTop:"10px"}}>
            <h3 className={styles.dwindows} style={windowsIcon}>Windows</h3>
            <a id="packWindows"
               href={`${distServer}/downloads/${swanlake.version}/${swanlake['windows-installer']}`}
               className={`${styles.cDownload} cGTMDownload`}
               data-download="downloads"
               data-pack={swanlake['windows-installer']}>
               <div className={styles.cSize}>msi <span id="packWindowsName">{swanlake['windows-installer-size']}</span></div>
            </a>
         </Col>
         <Col xs={12} sm={12} md={12} lg={4} style={{marginTop:"10px"}}>
            <h3 className={styles.dLinux} style={linuxIcon}>Linux </h3>
            <div className={styles.dVersions}>
               <div className={styles.dVersion}>
                  <a id="packLinuxDeb" href={`${distServer}/downloads/${swanlake.version}/${swanlake['linux-installer']}`}
                     className={`${styles.cDownload} cGTMDownload`}
                     data-download="downloads"
                     data-pack={swanlake['linux-installer']}>
                     <div className={styles.cSize}>deb <span id="packLinuxName">{swanlake['linux-installer-size']}</span></div>
                  </a>
               </div>
               <div className={styles.dVersion}>
                  <a id="packLinuxRpm" href={`${distServer}/downloads/${swanlake.version}/${swanlake['rpm-installer']}`}
                     className={`${styles.cDownload} cGTMDownload`}
                     data-download="downloads"
                     data-pack={swanlake['rpm-installer']}>
                     <div className={styles.cSize}>rpm <span id="packLinuxName">{swanlake['rpm-installer-size']}</span></div>
                  </a>
               </div>
            </div>
         </Col>
         <Col xs={12} sm={12} md={12} lg={4} style={{marginTop:"10px"}}>
            <h3 className={styles.dMac} style={macIcon}>macOS</h3>
            <div className={styles.dVersions}>
               <div className={styles.dVersion}>
                  <a id="packMacX64" href={`${distServer}/downloads/${swanlake.version}/${swanlake['macos-installer']}`}
                     className={`${styles.cDownload} cGTMDownload`}
                     data-download="downloads"
                     data-pack={swanlake['macos-installer']}>
                     <div className={styles.cSize}>pkg(x64) <span id="packMacName">{swanlake['macos-installer-size']}</span></div>
                  </a>
               </div>
               <div className={styles.dVersion}>
                  <a id="packMacARM" href={`${distServer}/downloads/${swanlake.version}/${swanlake['macos-arm-installer']}`}
                     className={`${styles.cDownload} cGTMDownload`}
                     data-download="downloads"
                     data-pack={swanlake['macos-arm-installer']}>
                     <div className={styles.cSize}>pkg(ARM64) <span id="packMacName">{swanlake['macos-arm-installer-size']}</span></div>
                  </a>
               </div>
            </div>
         </Col>
      </>

   );
}
