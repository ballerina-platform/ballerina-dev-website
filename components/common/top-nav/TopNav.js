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

import Search from '../search/Search';
import { prefix } from '../../../utils/prefix';
import styles from './TopNav.module.css';

const TopNav = (props) => {
  const launcher = props.launcher;
  const versionPicker = 'Swan Lake';

  if (global.location.pathname.indexOf('learn') > 0) {
    launcher = launcher + '-learn';
  }

  return (
    <>
      <Navbar className={(launcher === 'home') ? `${styles[launcher]} navbar-dark` : styles[launcher]} expand="lg" sticky='top'>
        <Container fluid className={(launcher === 'home') ? styles.toggleFloat : null}>
          {(launcher !== "home") ?
            <Navbar.Brand href={`${prefix}/`} className={styles.logo}>
              <Image src={`${prefix}/images/ballerina-logo.svg`} height={28} width={150} alt="Ballerina Logo" />
            </Navbar.Brand>
            : null
          }
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll" className={styles.navItems}>
            <Nav
              className={`${styles.topNav} ms-auto my-2 my-lg-0`}
              navbarScroll >
              <Nav.Link className={(launcher === 'downloads') ? `${styles.active} ${styles.navItem}` : `${styles.navItem}`} href={`${prefix}/downloads`}>Download</Nav.Link>
              <NavDropdown title='Use cases' id={styles.navbarScrollingDropdown} className={(launcher === 'usecases') ? `${styles.active}` : null} >
                <NavDropdown.Item href={`${prefix}/usecases/integration`} className={styles.dropDownItem}>Integration</NavDropdown.Item>
                <NavDropdown.Item href={`${prefix}/usecases/ai`} className={styles.dropDownItem}>AI</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link className={styles.navItem} href="https://play.ballerina.io/" target='_blank' rel="noreferrer">Playground</Nav.Link>
              <Nav.Link className={(launcher === 'docs-learn') ? `${styles.active} ${styles.navItem}` : `${styles.navItem}`} href={`${prefix}/learn`}>Learn</Nav.Link>
              <Nav.Link className={styles.navItem} href="https://central.ballerina.io/" target='_blank' rel="noreferrer">Central</Nav.Link>
              <Nav.Link className={(launcher === 'community') ? `${styles.active} ${styles.navItem}` : `${styles.navItem}`} href={`${prefix}/community`}>Community</Nav.Link>
              <Nav.Link className={styles.navItem} href="https://blog.ballerina.io/" target='_blank' rel="noreferrer">Blog</Nav.Link>
              {(launcher === 'docs-learn') ?
                <NavDropdown title={versionPicker} id={styles.navbarScrollingDropdown}>
                  <NavDropdown.Item href={`${prefix}/learn/`} className={styles.dropDownItem}>Swan Lake</NavDropdown.Item>
                  <NavDropdown.Item href={`${prefix}/1.2/learn/`} className={styles.dropDownItem}>v1.2</NavDropdown.Item>
                </NavDropdown>
                : null
              }
            </Nav>
            <Search />
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>

  );
};
export default TopNav;
