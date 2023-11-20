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
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import Image from 'next-image-export-optimizer';

// import Search from '../search/Search';
import { prefix } from '../../../utils/prefix';
import styles from './TopNav.module.css';

const TopNav = (props) => {
  const launcher = "usecases";
  // const versionPicker = 'Swan Lake';

  // if (global.location.pathname.indexOf('learn') > 0) {
  //   launcher = launcher + '-learn';
  // }

  return (
    <>
      <Navbar className={(launcher === 'home') ? `${styles[launcher]} navbar-dark` : styles[launcher]} expand="lg" sticky='top'>
        <Container fluid className={(launcher === 'home') ? styles.toggleFloat : null}>
          {(launcher !== "home") ?
            <Navbar.Brand href={`${prefix}/`} className={styles.logo} style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
            <Image src={`${prefix}/images/ballerina-logo-white.svg`} height={50} width={150} alt="Ballerina Logo" /> <span style={{color:"#ffffff", marginLeft:"10px", fontSize:"1.5rem"}}>VS Code extension</span>
            </Navbar.Brand>
            : null
          }
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll" className={styles.navItems}>
            <Nav
              className={`${styles.topNav} ms-auto my-2 my-lg-0`}
              navbarScroll >
              <Nav.Link className={(launcher === 'downloads') ? `${styles.active} ${styles.navItem}` : `${styles.navItem}`} href="https://wso2.com/ballerina/vscode/docs/">Docs</Nav.Link>
              <Nav.Link className={styles.navItem} href="https://ballerina.io/" target='_blank' rel="noreferrer">Ballerina</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>

  );
};
export default TopNav;
