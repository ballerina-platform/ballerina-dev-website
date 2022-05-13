import * as React from 'react';
import { Container, Nav, Navbar, NavDropdown, Form, FormControl, Button} from 'react-bootstrap';


import Image from 'next/image';
// import '../styles/custom.css';
// import styles from './topNav.module.css';

const pages = ['Download', 'Playground', 'Learn', 'Central', 'Community', 'Blog'];

const TopNav = () => {
    return (
      <Navbar bg="#fff" expand="lg" fixed='top'>
        <Container fluid>
          <Navbar.Brand href="#">
            <img src='/images/ballerina-logo.svg' height={28} width={150}/>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="ms-auto my-2 my-lg-0 topNav"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Nav.Link href="#action1">Download</Nav.Link>
              <Nav.Link href="#action2">Playground</Nav.Link>
              <Nav.Link href="#action2">Learn</Nav.Link>
              <Nav.Link href="#action2">Central</Nav.Link>
              <Nav.Link href="#action2">Community</Nav.Link>
              <Nav.Link href="#action2">Blog</Nav.Link>
              <NavDropdown title="Swarn Lake" id="navbarScrollingDropdown">
                <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action4">Another action</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action5">
                  Something else here
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Form className="d-flex">
              {/* <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              /> */}
              <Button className="DocSearch DocSearch-Button" aria-label="Search">
                <span className="DocSearch-Button-Container">
                  <svg width="20" height="20" className="DocSearch-Search-Icon" viewBox="0 0 20 20">
                    <path d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" stroke="currentColor" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  <span className="DocSearch-Button-Placeholder">Search</span>
                </span>
                <span className="DocSearch-Button-Keys">
                  <span className="DocSearch-Button-Key">
                    <svg width="15" height="15" className="DocSearch-Control-Key-Icon">
                      <path d="M4.505 4.496h2M5.505 5.496v5M8.216 4.496l.055 5.993M10 7.5c.333.333.5.667.5 1v2M12.326 4.5v5.996M8.384 4.496c1.674 0 2.116 0 2.116 1.5s-.442 1.5-2.116 1.5M3.205 9.303c-.09.448-.277 1.21-1.241 1.203C1 10.5.5 9.513.5 8V7c0-1.57.5-2.5 1.464-2.494.964.006 1.134.598 1.24 1.342M12.553 10.5h1.953" strokeWidth="1.2" stroke="currentColor" fill="none" strokeLinecap="square"></path>
                    </svg>
                  </span>
                  <span className="DocSearch-Button-Key">K</span>
                </span>
              </Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

    );
};
export default TopNav;
