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
import { Accordion, Container, Nav, Navbar, NavDropdown, Dropdown, Offcanvas, Row, Col } from 'react-bootstrap';
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
    <Dropdown.Item category='usecases' href={`${prefix}/usecases/integration`} className={styles.dropDownItem} key='1'>Integration</Dropdown.Item>,
    <Dropdown.Item category='comparisons' href={`${prefix}/usecases/integration/ballerina-vs-apollo-for-graphql/`} className={`${styles.dropDownItem}`} key='2'><span>Ballerina vs. Apollo for GraphQL</span></Dropdown.Item>,
    <Dropdown.Item category='comparisons' href={`${prefix}/usecases/integration/ballerina-vs-java-for-data-oriented-programming/`} className={styles.dropDownItem} key='4'>Ballerina vs. Java for data-oriented programming</Dropdown.Item>,
    <Dropdown.Item category='usecases' href={`${prefix}/usecases/ai`} className={styles.dropDownItem} key='5'>AI</Dropdown.Item>,
    <Dropdown.Item category='usecases' href={`${prefix}/usecases/healthcare`} className={styles.dropDownItem} key='6'>Healthcare</Dropdown.Item>,
    <Dropdown.Item category='usecases' href={`${prefix}/usecases/data-oriented-programming`} className={`${styles.dropDownItem}`} key='3'><span>Data-oriented programming</span></Dropdown.Item>,
    <Dropdown.Item category='usecases' href={`${prefix}/usecases/eda`} className={styles.dropDownItem} key='7'>EDA</Dropdown.Item>,
    <Dropdown.Item category='usecases' href={`${prefix}/usecases/b2b`} className={styles.dropDownItem} key='8'>B2B</Dropdown.Item>,
    <Dropdown.Item category='usecases' href={`${prefix}/usecases/etl`} className={styles.dropDownItem} key='12'>ETL</Dropdown.Item>,
    <Dropdown.Item category='usecases' href={`${prefix}/usecases/microservices`} className={styles.dropDownItem} key='9'>Microservices</Dropdown.Item>,
    <Dropdown.Item category='usecases' href={`${prefix}/usecases/bff`} className={styles.dropDownItem} key='10'>BFF</Dropdown.Item>,
    <Dropdown.Item category='case studies' href={`${prefix}/case-studies/wso2`} className={styles.dropDownItem} key='11'>WSO2</Dropdown.Item>,
    <Dropdown.Item category='case studies' href={`${prefix}/case-studies/fat-tuesday`} className={styles.dropDownItem} key='12'>FAT Tuesday</Dropdown.Item>,
    <Dropdown.Item category='case studies' href={`${prefix}/case-studies/mosip`} className={styles.dropDownItem} key='13'>MOSIP</Dropdown.Item>,
    <Dropdown.Item category='case studies' href={`${prefix}/case-studies/qhana`} className={styles.dropDownItem} key='14'>QHAna</Dropdown.Item>,
    <Dropdown.Item category='case studies' href={`${prefix}/case-studies/ballerina-central`} className={styles.dropDownItem} key='15'>Ballerina Central</Dropdown.Item>,
    <Dropdown.Item category='case studies' href={`${prefix}/case-studies/redcross-elixir`} className={styles.dropDownItem} key='16'>Red Cross Elixir</Dropdown.Item>,
    <Dropdown.Item category='case studies' href={`${prefix}/case-studies/raapid-ai`} className={styles.dropDownItem} key='17'>RAAPID.AI</Dropdown.Item>,
    <Dropdown.Item category='case studies' href={`${prefix}/case-studies/avinya-foundation`} className={styles.dropDownItem} key='18'>Avinya Academy</Dropdown.Item>
  ];

  const now = new Date();
  let showBanner = false;

  if (now < Date.parse('2024-05-10T00:00:00.0000-00:00')) {
    showBanner = true;
  }


  return (
    <>
      {
        (showBanner) ?
          <>

            <section className={styles.conBanner}>
              <Container>
                <Row style={{ alignItems: "center" }}>
                  <Col sm={12} md={4} lg={4} className={styles.conBannerLogo}>
                    <a href="https://wso2.com/wso2con/2024/" id="cWSO2ConHomeLogoBtn" target="_blank" aria-label="" rel="noreferrer">
                      <img src="https://wso2.cachefly.net/wso2/sites/all/wso2con/2024/wso2con2024-white.webp" width="194" height="19" alt="WSO2Con2024 Logo" className="ls-is-cached lazyloaded " loading="lazy" />
                    </a>
                  </Col>
                  <Col sm={12} md={4} lg={4} className={styles.conBannerDate}>
                    <h3>May 7-9 | Hollywood, FL, USA</h3>
                  </Col>
                  <Col sm={12} md={4} lg={4} className={styles.conBannerBtn}>
                    <a href="https://wso2.com/wso2con/2024/" target="_blank" className={styles.cButtonN_Standard} id="cWSO2ConHomeNotifyBtn" aria-label="Register Now" rel="noreferrer">
                      Register Now
                    </a>
                  </Col>
                </Row>
              </Container>
            </section>

            {/* <div className={styles.hackathonBanner}>
            Ballerina Hacktoberfest is happening now. <a href="https://ballerina.io/hacktoberfest/" target="_blank" rel="noreferrer">Join us</a>!
          </div> */}
          </>
          : null
      }
      <>
        <Navbar key={expand} expand={expand} className={(launcher === 'home') ? `${styles[launcher]} navbar-dark` : styles[launcher]} sticky='top'>
          <Container fluid>
            {(launcher === "home") ?
              <Navbar.Brand href={`${prefix}/`} className={styles.logo}>
                <Image src={`${prefix}/images/logo/ballerina-logo-white.svg`} height={50} width={150} alt="Ballerina Logo" />
              </Navbar.Brand>
              : <Navbar.Brand href={`${prefix}/`} className={styles.logo}>
                <Image src={`${prefix}/images/logo/ballerina-logo-grey.svg`} height={50} width={150} alt="Ballerina Logo" />
              </Navbar.Brand>
            }
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  <Image src={`${prefix}/images/logo/ballerina-logo-grey.svg`} height={50} width={150} alt="Ballerina Logo" />
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className={`${styles.topNav} ms-auto my-2 my-lg-0`}>

                  <Dropdown className={(launcher === 'usecases') ? `${styles.active} nav-item d-none d-lg-block` : 'nav-item d-none d-lg-block'} id={`dropdown-button-drop-end`}>
                    <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" launcher={launcher}>
                      Explore
                    </Dropdown.Toggle>

                    <Dropdown.Menu as={CustomMenu} style={{ minWidth: '700px', marginLeft: '-210px' }} className="dropdown-center" renderOnMount={true}>
                      {MenuItems}
                    </Dropdown.Menu>
                  </Dropdown>

                  {/* Offcanvas nav bar for mobile view */}
                  <a className={(launcher === 'usecases') ? `${styles.active} ${styles.navItem} ${styles.arrow} nav-link d-block d-lg-none` : `${styles.navItem} ${styles.arrow} nav-link d-block d-lg-none`}
                    onClick={handleShow}>
                    Explore
                  </a>


                  <Offcanvas show={show} onHide={handleClose} placement='end'>
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
                            fillRule="evenodd"
                            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                          />
                        </svg> Back
                      </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                      <Accordion as={CustomMenu} launcher='mobile' className={styles.mobileAccordion}>
                        {MenuItems}
                      </Accordion>
                    </Offcanvas.Body>
                  </Offcanvas>

                  {/* Offcanvas nav bar for mobile view */}

                  <Nav.Link className={(launcher === 'docs-learn') ? `${styles.active} ${styles.navItem}` : `${styles.navItem}`} href={`${prefix}/learn`}>Learn</Nav.Link>
                  <Nav.Link className={styles.navItem} href="https://central.ballerina.io/" target='_blank' rel="noreferrer">Packages</Nav.Link>
                  <Nav.Link className={(launcher === 'community') ? `${styles.active} ${styles.navItem}` : `${styles.navItem}`} href={`${prefix}/community`}>Community</Nav.Link>
                  <Nav.Link className={styles.navItem} href="https://blog.ballerina.io/" target='_blank' rel="noreferrer">Blog</Nav.Link>
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
