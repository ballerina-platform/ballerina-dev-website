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
import { Accordion, Container, Nav, Navbar, NavDropdown, OverlayTrigger, Dropdown, Button, ButtonGroup, Offcanvas, Form } from 'react-bootstrap';
import Image from 'next-image-export-optimizer';

import Search from '../search/Search';
import CustomToggle from "./CustomToggle";
import CustomMenu from "./CustomMenu";
import { prefix } from '../../../utils/prefix';
import styles from './TopNav.module.css';

const TopNav = (props) => {
  const launcher = props.launcher;
  const versionPicker = 'Swan Lake';

  if (global.location.pathname.indexOf('learn') > 0) {
    launcher = launcher + '-learn';
  }

  const expand = 'lg';

  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const MenuItems = [
    <Dropdown.Item contentType='usecases' href={`${prefix}/usecases/integration`} className={styles.dropDownItem}>Integration</Dropdown.Item>,
    <Dropdown.Item contentType='usecases' href={`${prefix}/usecases/integration/ballerina-vs-apollo-for-graphql/`} className={`${styles.dropDownItem} ${styles.sub}`}><span>Ballerina vs. Apollo for GraphQL</span></Dropdown.Item>,
    <Dropdown.Item contentType='usecases' href={`${prefix}/usecases/integration/data-oriented-programming`} className={`${styles.dropDownItem} ${styles.sub}`}><span>Data-oriented programming</span></Dropdown.Item>,
    <Dropdown.Item contentType='comparisons' href={`${prefix}/usecases/integration/ballerina-vs-apollo-for-graphql/`} className={styles.dropDownItem}>Ballerina vs. Java for data oriented programming</Dropdown.Item>,
    <Dropdown.Item contentType='usecases' href={`${prefix}/usecases/ai`} className={styles.dropDownItem}>AI</Dropdown.Item>,
    <Dropdown.Item contentType='usecases' href={`${prefix}/usecases/healthcare`} className={styles.dropDownItem}>Healthcare</Dropdown.Item>,
    <Dropdown.Item contentType='usecases' href={`${prefix}/usecases/microservices`} className={styles.dropDownItem}>Microservices</Dropdown.Item>,
    <Dropdown.Item contentType='usecases' href={`${prefix}/usecases/eda`} className={styles.dropDownItem}>EDA</Dropdown.Item>,
    <Dropdown.Item contentType='usecases' href={`${prefix}/usecases/b2b`} className={styles.dropDownItem}>B2B</Dropdown.Item>
  ];


  return (
    <>
      <>
        <Navbar key={expand} expand={expand} className={(launcher === 'home') ? `${styles[launcher]} navbar-dark` : styles[launcher]} sticky='top'>
          <Container fluid>
            {(launcher !== "home") ?
              <Navbar.Brand href={`${prefix}/`} className={styles.logo}>
                <Image src={`${prefix}/images/ballerina-logo.svg`} height={28} width={150} alt="Ballerina Logo" />
              </Navbar.Brand>
              : null
            }
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  <Image src={`${prefix}/images/ballerina-logo.svg`} height={28} width={150} alt="Ballerina Logo" />
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className={`${styles.topNav} ms-auto my-2 my-lg-0`}>
                  <Nav.Link className={(launcher === 'downloads') ? `${styles.active} ${styles.navItem}` : `${styles.navItem}`} href={`${prefix}/downloads`}>Download</Nav.Link>


                  <Dropdown className={(launcher === 'usecases') ? `${styles.active} nav-item d-none d-lg-block` : 'nav-item d-none d-lg-block'} id={`dropdown-button-drop-end`}>
                    <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" launcher={launcher}>
                      Explore
                    </Dropdown.Toggle>

                    <Dropdown.Menu as={CustomMenu} style={{ minWidth: '700px', marginLeft: '-210px' }} className="dropdown-center">
                      <MenuItems />
                    </Dropdown.Menu>
                  </Dropdown>

                  {/* Offcanvas nav bar for mobile view */}
                  <a className={(launcher === 'usecases') ? `${styles.active} ${styles.navItem} nav-link d-block d-lg-none` : `${styles.navItem} nav-link d-block d-lg-none`}
                    onClick={handleShow}>
                    Explore
                  </a>


                  <Offcanvas show={show} onHide={handleClose}>
                    <Offcanvas.Header>
                      <Offcanvas.Title onClick={handleClose} className={styles.back}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="#20b6b0"
                          className={` bi bi-arrow-right`}
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                          />
                        </svg> Back
                      </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                      <Accordion as={CustomMenu} launcher='mobile' className={styles.mobileAccordion}>
                        <MenuItems />
                      </Accordion>
                    </Offcanvas.Body>
                  </Offcanvas>

                  {/* Offcanvas nav bar for mobile view */}


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
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      </>
    </>

  );
};
export default TopNav;