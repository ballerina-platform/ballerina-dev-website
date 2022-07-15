import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Image from 'next-image-export-optimizer';

import Layout from '../../layouts/LayoutDownloads';
import styles from '../../styles/Downloads.module.css'
import { prefix } from '../../utils/prefix';
import swanlake from '../../_data/swanlake-latest/metadata.json';
import stable from '../../_data/stable-latest/metadata.json';

export default function Downloads() {

   const [hoverBtn1, setHoverBtn1] = React.useState(false);
   const [hoverBtn2, setHoverBtn2] = React.useState(false);
   const [hoverBtn3, setHoverBtn3] = React.useState(false);
   const [hoverBtn4, setHoverBtn4] = React.useState(false);
   const [hoverBtn5, setHoverBtn5] = React.useState(false);
   const [hoverBtn6, setHoverBtn6] = React.useState(false);
 
   let vsCodeImagePath = prefix + '/images/downloads/vs-code.svg';
   let windowsImagePath = prefix + '/images/downloads/windows.svg';
   let linuxImagePath = prefix + '/images/downloads/linux.svg';
   let macImagePath = prefix + '/images/downloads/mac.svg';
   let downloadIconPath = prefix + '/images/download-bg.svg';
   let downloadIconHoverPath = prefix + '/images/download-bg-white.svg';

   const vscodeIcon = {
      backgroundImage: 'url('+ vsCodeImagePath +')'
   }

   const windowsIcon = {
      backgroundImage: 'url('+ windowsImagePath +')',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
   }

   const linuxIcon = {
      backgroundImage: 'url('+ linuxImagePath +')',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
   }

   const macIcon = {
      backgroundImage: 'url('+ macImagePath +')',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
   }

   const downloadIcon = {
      backgroundImage: 'url('+ downloadIconPath +')',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'left 20px top 20px'
   }

   const downloadIconHover = {
      backgroundImage: 'url('+ downloadIconHoverPath +')',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'left 20px top 20px',
      backgroundColor: '#20b6b0'
   }


   const Windows = <span style={windowsIcon}>Windows</span>
   const Linux = <span style={linuxIcon}>Linux</span>
   const Mac = <span style={macIcon}>macOs</span>

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
               <Col xs={12} sm={12} md={12} lg={4}>
                  <h3 className={styles.dwindows} style={windowsIcon}>Windows</h3>
                  <a id="packWindows" 
                     href={`${process.env.distServer}/downloads/${swanlake.version}/${swanlake['windows-installer']}`}
                     className={styles.cDownload} 
                     data-download="downloads" 
                     data-pack={swanlake['windows-installer']}
                     onMouseEnter={()=> {
                        setHoverBtn1(true);
                     }}
                     onMouseLeave={()=> {
                        setHoverBtn1(false);
                     }}
                     style={
                        (hoverBtn1 ? downloadIconHover : downloadIcon)
                     }>
                     <div className={styles.cSize}>msi <span id="packWindowsName">{swanlake['windows-installer-size']}</span></div>
                  </a>
                  <ul className={styles.downloadSubLinks}>
                     <li><a id="packWindowsMd5" href={`${process.env.distServer}/downloads/${swanlake.version}/${swanlake['windows-installer']}.md5`}>md5</a></li>
                     <li><a id="packWindowsSha1" href={`${process.env.distServer}/downloads/${swanlake.version}/${swanlake['windows-installer']}.sha1`}>SHA-1</a></li>
                     <li><a id="packWindowsAsc" href={`${process.env.distServer}/downloads/${swanlake.version}/${swanlake['windows-installer']}.asc`}>asc</a></li>
                  </ul>
               </Col>
               <Col xs={12} sm={12} md={12} lg={4}>
                  <h3 className={styles.dLinux} style={linuxIcon}>Linux </h3>
                  <div className={styles.dVersions}>
                     <div className={styles.dVersion}>
                        <a id="packLinux" href={`${process.env.distServer}/downloads/${swanlake.version}/${swanlake['linux-installer']}`} 
                        className={styles.cDownload} 
                        data-download="downloads" data-pack={swanlake['linux-installer']}
                        onMouseEnter={()=> {
                           setHoverBtn2(true);
                        }}
                        onMouseLeave={()=> {
                           setHoverBtn2(false);
                        }}
                        style={
                           (hoverBtn2 ? downloadIconHover : downloadIcon)
                        }>
                           <div className={styles.cSize}>deb <span id="packLinuxName">{swanlake['linux-installer-size']}</span></div>
                        </a>
                        <ul className={styles.downloadSubLinks}>
                           <li><a id="packLinuxMd5" href={`${process.env.distServer}/downloads/${swanlake.version}/${swanlake['linux-installer']}.md5`}>md5</a></li>
                           <li><a id="packLinuxSha1" href={`${process.env.distServer}/downloads/${swanlake.version}/${swanlake['linux-installer']}.sha1`}>SHA-1</a></li>
                           <li><a id="packLinuxAsc" href={`${process.env.distServer}/downloads/${swanlake.version}/${swanlake['linux-installer']}.asc`}>asc</a></li>
                        </ul>
                     </div>
                     <div className={styles.dVersion}>
                        <a id="packLinux" href={`${process.env.distServer}/downloads/${swanlake.version}/${swanlake['rpm-installer']}`} 
                        className={styles.cDownload} 
                        data-download="downloads" data-pack={swanlake['rpm-installer']}
                        onMouseEnter={()=> {
                           setHoverBtn3(true);
                        }}
                        onMouseLeave={()=> {
                           setHoverBtn3(false);
                        }}
                        style={
                           (hoverBtn3 ? downloadIconHover : downloadIcon)
                        }>
                           <div className={styles.cSize}>rpm <span id="packLinuxName">{swanlake['rpm-installer-size']}</span></div>
                        </a>
                        <ul className={styles.downloadSubLinks}>
                           <li><a id="packLinuxMd5" href={`${process.env.distServer}/downloads/${swanlake.version}/${swanlake['rpm-installer']}.md5`}>md5</a></li>
                           <li><a id="packLinuxSha1" href={`${process.env.distServer}/downloads/${swanlake.version}/${swanlake['rpm-installer']}.sha1`}>SHA-1</a></li>
                           <li><a id="packLinuxAsc" href={`${process.env.distServer}/downloads/${swanlake.version}/${swanlake['rpm-installer']}.asc`}>asc</a></li>
                        </ul>
                     </div>
                  </div>
               </Col>
               <Col xs={12} sm={12} md={12} lg={4}>
                  <h3 className={styles.dMac} style={macIcon}>macOS</h3>
                  <a id="packMac" 
                     href={`${process.env.distServer}/downloads/${swanlake.version}/${swanlake['macos-installer']}`}
                     className={styles.cDownload} 
                     data-download="downloads" 
                     data-pack={swanlake['macos-installer']}
                     onMouseEnter={()=> {
                        setHoverBtn4(true);
                     }}
                     onMouseLeave={()=> {
                        setHoverBtn4(false);
                     }}
                     style={
                        (hoverBtn4 ? downloadIconHover : downloadIcon)
                     }>
                     <div className={styles.cSize}>pkg <span id="packWindowsName">{swanlake['macos-installer-size']}</span></div>
                  </a>
                  <ul className={styles.downloadSubLinks}>
                     <li><a id="packMacMd5" href={`${process.env.distServer}/downloads/${swanlake.version}/${swanlake['macos-installer']}.md5`}>md5</a></li>
                     <li><a id="packMacSha1" href={`${process.env.distServer}/downloads/${swanlake.version}/${swanlake['macos-installer']}.sha1`}>SHA-1</a></li>
                     <li><a id="packMacAsc" href={`${process.env.distServer}/downloads/${swanlake.version}/${swanlake['macos-installer']}.asc`}>asc</a></li>
                  </ul>
               </Col>
            </Row>

            <Row className={`${styles.donwloadVersion} pageContentRow`}>
               <Col xs={12}>
               <div className={styles.releaseLinks} >
                     <div className={styles.releaseNotes} >
                        <p><a href={`${prefix}/downloads/swan-lake-release-notes/swan-lake-${swanlake.version}`}>RELEASE NOTES &gt;</a></p>
                     </div>
                     <div className={styles.releaseNotes} >
                        <p><a href={`${prefix}/downloads/swan-lake-archived`}>ARCHIVED VERSIONS &gt;</a></p>
                     </div>
                  </div>
               </Col>
            </Row>

            <Row className={`${styles.donwloadVersion} pageContentRow`}>
               <Col xs={12}>
                  <p>
                     To <a href={`${prefix}/learn/installing-ballerina/installation-options/#verifying-the-installation`} className={styles.instructions}>verify that Ballerina was successfully installed</a>, execute 
                     the <code className="highlighter-rouge language-plaintext">bal version<span aria-hidden="true" className="line-numbers-rows"><span></span></span></code> command 
                     in the Terminal/Shell. For more information on installing Ballerina, see <a href={`${prefix}/learn/installing-ballerina/installation-options/`} className={styles.instructions}>Installation options</a>.
                  </p>
                  <p>Next, install the Ballerina Visual Studio Code extension.</p>
               </Col>
            </Row>

            <Row className={`${styles.downloadsVSCode} pageContentRow`}>
               <Col xs={12} sm={12} md={12} lg={4}>
                  <h3 className={styles.dVSCode} style={vscodeIcon}>Visual Studio Code</h3>
                  <a id="packWindows" href="https://marketplace.visualstudio.com/items?itemName=wso2.ballerina" 
                  className={styles.cDownload} data-download="downloads" 
                  target="_blank" rel="noreferrer"
                  onMouseEnter={()=> {
                     setHoverBtn5(true);
                  }}
                  onMouseLeave={()=> {
                     setHoverBtn5(false);
                  }}
                  style={
                     (hoverBtn5 ? downloadIconHover : downloadIcon)
                  }>
                     <div className={styles.cSize}>Ballerina Extension<span id="packWindowsName"></span></div>
                  </a>
                  <br/>
                  <p>Now, you are all set to <a href={`${prefix}/learn/getting-started-with-ballerina/`}>get started with Ballerina.</a></p>
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
                                 <a href={`${prefix}/learn/installing-ballerina/installation-options/#installing-on-macos`} className="cDownloadLinkIcon">
                                    <Image src={`${prefix}/images/right-bg-green-fill.svg`} width={13} height={13} alt="Install via Homebrew (for macOS)"/>
                                 </a>
                              </td>
                           </tr>
                           <tr>
                              <td>Install via the ZIP archive
                                 <a href={`${prefix}/learn/installing-ballerina/installation-options/#installing-via-the-ballerina-language-zip-file`} className="cDownloadLinkIcon">
                                    <Image src={`${prefix}/images/right-bg-green-fill.svg`} width={13} height={13} alt="Install via the ZIP archive"/>
                                 </a>
                              </td>
                           </tr>
                           <tr>
                              <td>Install from source
                                 <a href={`${prefix}/learn/installing-ballerina/installation-options/#building-from-source`} className="cDownloadLinkIcon">
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
                  <h2 id="stable"><span>{stable['display-version']}</span></h2>
               </Col>
            </Row>

            <Row className={`${styles.donwloadVersion} pageContentRow`}>
               <Col xs={12} sm={12} md={12} lg={4}>
                  <h3 className={styles.dwindows} style={windowsIcon}>Windows</h3>
                  <a id="packWindows" 
                     href={`${process.env.distServer}/downloads/${stable.version }/${stable['windows-installer']}`} 
                     className={styles.cDownload} 
                     data-download="downloads" 
                     data-pack={stable['windows-installer']}
                     onMouseEnter={()=> {
                        setHoverBtn1(true);
                     }}
                     onMouseLeave={()=> {
                        setHoverBtn1(false);
                     }}
                     style={
                        (hoverBtn1 ? downloadIconHover : downloadIcon)
                     }>
                     <div className={styles.cSize}>msi <span id="packWindowsName">{stable['windows-installer-size']}</span></div>
                  </a>
                  <ul className={styles.downloadSubLinks}>
                     <li><a id="packWindowsMd5" href={`${process.env.distServer}/downloads/${stable.version }/${stable['windows-installer']}.md5`} >md5</a></li>
                     <li><a id="packWindowsSha1" href={`${process.env.distServer}/downloads/${stable.version }/${stable['windows-installer']}.sha1`} >SHA-1</a></li>
                     <li><a id="packWindowsAsc" href={`${process.env.distServer}/downloads/${stable.version }/${stable['windows-installer']}.asc`}>asc</a></li>
                  </ul>
               </Col>
               <Col xs={12} sm={12} md={12} lg={4}>
                  <h3 className={styles.dLinux} style={linuxIcon}>Linux </h3>
                  <div className={styles.dVersions}>
                     <div className={styles.dVersion}>
                        <a id="packLinux" href={`${process.env.distServer}/downloads/${stable.version }/${stable['linux-installer']}`}  
                        className={styles.cDownload} 
                        data-download="downloads" data-pack={stable['linux-installer']}
                        onMouseEnter={()=> {
                           setHoverBtn2(true);
                        }}
                        onMouseLeave={()=> {
                           setHoverBtn2(false);
                        }}
                        style={
                           (hoverBtn2 ? downloadIconHover : downloadIcon)
                        }>
                           <div className={styles.cSize}>deb <span id="packLinuxName">{stable['linux-installer-size']}</span></div>
                        </a>
                        <ul className={styles.downloadSubLinks}>
                           <li><a id="packLinuxMd5" href={`${process.env.distServer}/downloads/${stable.version }/${stable['linux-installer']}.md5`}>md5</a></li>
                           <li><a id="packLinuxSha1" href={`${process.env.distServer}/downloads/${stable.version }/${stable['linux-installer']}.sha1`}>SHA-1</a></li>
                           <li><a id="packLinuxAsc" href={`${process.env.distServer}/downloads/${stable.version }/${stable['linux-installer']}.asc`}>asc</a></li>
                        </ul>
                     </div>
                     <div className={styles.dVersion}>
                        <a id="packLinux" href={`${process.env.distServer}/downloads/${stable.version }/${stable['rpm-installer']}`}   
                        className={styles.cDownload} 
                        data-download="downloads" data-pack={stable['rpm-installer']}
                        onMouseEnter={()=> {
                           setHoverBtn3(true);
                        }}
                        onMouseLeave={()=> {
                           setHoverBtn3(false);
                        }}
                        style={
                           (hoverBtn3 ? downloadIconHover : downloadIcon)
                        }>
                           <div className={styles.cSize}>rpm <span id="packLinuxName">{stable['rpm-installer-size']}</span></div>
                        </a>
                        <ul className={styles.downloadSubLinks}>
                           <li><a id="packLinuxMd5" href={`${process.env.distServer}/downloads/${stable.version }/${stable['rpm-installer']}.md5`}>md5</a></li>
                           <li><a id="packLinuxSha1" href={`${process.env.distServer}/downloads/${stable.version }/${stable['rpm-installer']}.sha1`}>SHA-1</a></li>
                           <li><a id="packLinuxAsc" href={`${process.env.distServer}/downloads/${stable.version }/${stable['rpm-installer']}.asc`}>asc</a></li>
                        </ul>
                     </div>
                  </div>
               </Col>
               <Col xs={12} sm={12} md={12} lg={4}>
                  <h3 className={styles.dMac} style={macIcon}>macOS</h3>
                  <a id="packMac" 
                     href={`${process.env.distServer}/downloads/${stable.version }/${stable['macos-installer']}`}  
                     className={styles.cDownload} 
                     data-download="downloads" 
                     data-pack={stable['macos-installer']}
                     onMouseEnter={()=> {
                        setHoverBtn4(true);
                     }}
                     onMouseLeave={()=> {
                        setHoverBtn4(false);
                     }}
                     style={
                        (hoverBtn4 ? downloadIconHover : downloadIcon)
                     }>
                     <div className={styles.cSize}>pkg <span id="packWindowsName">{stable['macos-installer-size']}</span></div>
                  </a>
                  <ul className={styles.downloadSubLinks}>
                     <li><a id="packMacMd5" href={`${process.env.distServer}/downloads/${stable.version }/${stable['macos-installer']}.md5`}>md5</a></li>
                     <li><a id="packMacSha1" href={`${process.env.distServer}/downloads/${stable.version }/${stable['macos-installer']}.sha1`}>SHA-1</a></li>
                     <li><a id="packMacAsc" href={`${process.env.distServer}/downloads/${stable.version }/${stable['macos-installer']}.asc`}>asc</a></li>
                  </ul>
               </Col>
            </Row>
            
            <Row className={`${styles.donwloadVersion} pageContentRow`}>
               <Col xs={12}>
                  <div className={styles.releaseLinks} >
                     <div className={styles.releaseNotes} >
                        <p><a href={`${prefix}/downloads/1.2.x-release-notes/${stable.version}`}>RELEASE NOTES &gt;</a></p>
                     </div>
                     <div className={styles.releaseNotes} >
                        <p><a href={`${prefix}/downloads/1.2.x-archived`}>ARCHIVED VERSIONS &gt;</a></p>
                     </div>
                  </div>
               </Col>
            </Row>

            <Row className={`${styles.downloadsVSCode} pageContentRow`}>
               <Col xs={12} sm={12} md={12} lg={4}>
                  <h3 className={styles.dVSCode} style={vscodeIcon}>Visual Studio Code</h3>
                  <a id="packWindows" href="https://github.com/wso2/ballerina-plugin-vscode/releases/tag/v2.1.1" 
                  className={styles.cDownload} data-download="downloads" 
                  target="_blank" rel="noreferrer"
                  onMouseEnter={()=> {
                     setHoverBtn6(true);
                  }}
                  onMouseLeave={()=> {
                     setHoverBtn6(false);
                  }}
                  style={
                     (hoverBtn6 ? downloadIconHover : downloadIcon)
                  }>
                     <div className={styles.cSize}>Ballerina Extension<span id="packWindowsName"></span></div>
                  </a>
               </Col>
            </Row>

            <Row className={`${styles.downloadsOther} pageContentRow`}>
               <Col xs={12} sm={12} md={6} lg={6}>
                  <div className="cInstallers">
                     <h3>Other installation options</h3>
                     <div className="">
                        <table id="insPackages0">
                           <tr>
                              <td>Install via the ZIP archive
                                 <a href={`${prefix}/1.2/learn/installing-ballerina/#installing-via-the-ballerina-language-zip-file`} className="cDownloadLinkIcon" target="_blank" rel="noreferrer">
                                    <Image src={`${prefix}/images/right-bg-green-fill.svg`} width={13} height={13} alt="Install via the ZIP archive"/>
                                 </a>
                              </td>
                           </tr>
                           <tr>
                              <td>Install from source
                                 <a href={`${prefix}/1.2/learn/installing-ballerina/#building-from-source`} className="cDownloadLinkIcon" target="_blank" rel="noreferrer">
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
                  <p>To download the VSCode and IntelliJ Ballerina extensions, see <a href={`${prefix}/1.2/learn/setting-up-visual-studio-code/`} className={styles.instructions}>Setting up Visual Studio Code</a> and 
                  <a href={`${prefix}/1.2/learn/setting-up-intellij-idea/`} className={styles.instructions}> Setting up IntelliJ IDEA</a>, and for installation instructions, see 
                  <a href={`${prefix}/1.2/learn/installing-ballerina/`} className={styles.instructions}> Installing Ballerina</a>. 
                  </p>
               </Col>
            </Row>
         </Col>
      </Layout>
    
  );
}
